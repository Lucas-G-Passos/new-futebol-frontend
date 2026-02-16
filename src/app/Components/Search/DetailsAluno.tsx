import {
  ArrowCounterClockwise,
  CurrencyDollarIcon,
  FilePdfIcon,
  FloppyDisk,
  Pencil,
  Trash,
  X,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import type { Aluno, FieldConfig } from "../../Utils/Types";
import {
  applyMask,
  cleanValueForSubmission,
  ensureNumber,
  formatCurrency,
  formatDisplayValue,
  getFieldGroups,
  getFieldValue,
  maskToRegex,
} from "./alunoUtils";
import AreYouSureDialog from "./AreYouSureDialog";
import { detailsAlunoStyles as style } from "./DetailsAlunoStyles";
import PaymentHistoryModal from "./PaymentHistoryModal";
import { alunoFields } from "./alunoFields";
import SendMessagePanel from "../whatsapp/SendMessagePanel";

export default function DetailsAluno({
  data,
  close,
  onUpdate,
}: {
  data: Aluno;
  close: (value: any) => void;
  onUpdate?: () => void;
}) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fields, setFields] = useState<FieldConfig[]>(alunoFields);
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPaymentHistory, setShowPaymentHistory] = useState<boolean>(false);
  const [showWhatsappDialog, setShowWhatsappDialog] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [areYouSure, setAreYouSure] = useState<{
    open: boolean;
    label: string;
    options: string[];
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  useEffect(() => {
    if (!editMode) return;

    const init = async () => {
      let turmaOptions: { label: string; value: number }[] = [];

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/turmas/all`,
          { credentials: "include" },
        );

        if (!response.ok) throw new Error(await response.text());

        const turmas = await response.json();

        turmaOptions = turmas.turmas.map((t: any) => ({
          label: t.nome,
          value: t.id,
        }));

        setFields((prev) =>
          prev.map((field) =>
            field.name === "turmaId"
              ? { ...field, options: turmaOptions }
              : field,
          ),
        );
      } catch (e) {
        console.error(e);
      }

      const initialState: Record<string, any> = {};

      fields.forEach((field) => {
        let value: any;

        if (field.name.includes(".")) {
          const [parent, child] = field.name.split(".");
          value = (data[parent as keyof Aluno] as any)?.[child];
        } else {
          value = data[field.name as keyof Aluno];
        }

        if (field.type === "CHECKBOXGROUP" || field.type === "IFOKCHECKBOXGROUP") {
          value = value || [];
          initialState[field.name] = value;
          // Initialize the _enabled state for IFOKCHECKBOXGROUP
          if (field.type === "IFOKCHECKBOXGROUP") {
            initialState[`${field.name}_enabled`] = value.length > 0;
          }
          return;
        }

        if (value == null) {
          initialState[field.name] = "";
          return;
        }

        if (field.name === "turmaId") {
          initialState[field.name] = value;
          return;
        }

        if (field.mask && typeof value === "string") {
          const digits = value.replace(/\D/g, "");
          initialState[field.name] = applyMask(digits, field.mask);
          return;
        }

        initialState[field.name] = value;
      });

      setFormState(initialState);
      setErrors({});
    };

    init();
  }, [editMode, data]);

  const handleFieldChange = (name: string, rawValue: any, mask?: string) => {
    let value = rawValue;
    let errorMsg = "";

    if (mask && typeof rawValue === "string") {
      const digits = rawValue.replace(/\D/g, "");
      value = applyMask(digits, mask);

      const regex = maskToRegex(mask);
      if (value && !regex.test(value)) {
        errorMsg = "Formato inválido";
      }
    }

    setFormState((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleCheckboxGroupChange = (
    fieldName: string,
    optionValue: string,
    isChecked: boolean
  ) => {
    setFormState((prev) => {
      const currentValues = prev[fieldName] || [];
      let newValues;

      if (isChecked) {
        newValues = [...currentValues, optionValue];
      } else {
        newValues = currentValues.filter(
          (value: string) => value !== optionValue
        );
      }

      return { ...prev, [fieldName]: newValues };
    });

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const renderField = (field: FieldConfig) => {
    const value = editMode
      ? formState[field.name]
      : getFieldValue(field.name, data);
    const error = errors[field.name];
    const displayValue = editMode
      ? value
      : formatDisplayValue(value, field, data);

    if (!editMode) {
      return (
        <div style={style.fieldContainer}>
          <label style={style.label}>{field.placeholder}</label>
          <div
            style={{
              ...style.value,
              ...(displayValue === "Não informado" ? style.notInformed : {}),
            }}
          >
            {displayValue}
          </div>
        </div>
      );
    }

    const labelWithRequired = (
      <label style={style.label}>
        {field.placeholder}
        {field.required && <span style={{ color: "red" }}> *</span>}
      </label>
    );

    switch (field.type) {
      case "TEXT":
      case "NUMBER":
      case "DATE":
      case "TIME":
        return (
          <div style={style.fieldContainer} key={field.name}>
            {labelWithRequired}
            <input
              type={field.type.toLowerCase()}
              value={formState[field.name] || ""}
              onChange={(e) =>
                handleFieldChange(field.name, e.target.value, field.mask)
              }
              style={{
                ...style.input,
                borderColor: error ? "red" : Colors.border,
              }}
              className="input-field"
            />
            {error && <span style={style.error}>{error}</span>}
          </div>
        );

      case "SELECT":
        return (
          <div style={style.fieldContainer} key={field.name}>
            {labelWithRequired}
            <select
              value={formState[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              style={{
                ...style.input,
                borderColor: error ? "red" : Colors.border,
              }}
            >
              <option value="">Selecione...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {error && <span style={style.error}>{error}</span>}
          </div>
        );

      case "FILE":
        return (
          <div style={style.fieldContainer} key={field.name}>
            {labelWithRequired}
            <input
              type="file"
              onChange={(e) =>
                handleFieldChange(field.name, e.target.files?.[0] || null)
              }
              style={style.input}
            />
            {data.url && (
              <img src={data.url} style={style.previewImage} alt="Preview" />
            )}
            {error && <span style={style.error}>{error}</span>}
          </div>
        );

      case "CHECKBOX":
        return (
          <div style={style.fieldContainer} key={field.name}>
            <label style={style.checkboxLabel}>
              <input
                type="checkbox"
                checked={!!formState[field.name]}
                onChange={(e) =>
                  handleFieldChange(field.name, e.target.checked)
                }
                style={style.checkbox}
              />
              {field.placeholder}
              {field.required && <span style={{ color: "red" }}> *</span>}
            </label>
            {error && <span style={style.error}>{error}</span>}
          </div>
        );

      case "CHECKBOXGROUP":
        return (
          <div style={style.fieldContainer} key={field.name}>
            {labelWithRequired}
            <div style={style.checkboxGroup}>
              {field.options?.map((option) => {
                const isChecked = (formState[field.name] || []).includes(
                  option.value
                );
                return (
                  <label
                    key={option.value}
                    style={style.checkboxGroupLabel}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (typeof option.value === "number") return;
                        handleCheckboxGroupChange(
                          field.name,
                          option.value,
                          e.target.checked
                        );
                      }}
                      style={style.checkbox}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
            {error && <span style={style.error}>{error}</span>}
          </div>
        );

      case "IFOKCHECKBOXGROUP":
        const ifCbGroupCheckboxStateName = `${field.name}_enabled`;
        const isIfCbGroupChecked = !!formState[ifCbGroupCheckboxStateName];
        const ifCbGroupLabel =
          field.ifCheckboxOk?.checkBoxLabel || field.placeholder;
        const ifCbGroupRequired =
          field.ifCheckboxOk?.required || field.required;

        return (
          <div style={style.fieldContainer} key={field.name}>
            {/* Main checkbox */}
            <div>
              <label style={style.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isIfCbGroupChecked}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormState((prev) => ({
                      ...prev,
                      [ifCbGroupCheckboxStateName]: checked,
                      [field.name]: checked
                        ? prev[field.name] ||
                          field.ifCheckboxOk?.defaultValue ||
                          []
                        : [],
                    }));
                  }}
                  style={style.checkbox}
                />
                {ifCbGroupLabel}
                {ifCbGroupRequired && <span style={{ color: "red" }}> *</span>}
              </label>
            </div>

            {/* Checkbox group that appears when checkbox is checked */}
            {isIfCbGroupChecked && (
              <div style={{ marginLeft: 16, marginTop: 8 }}>
                <div style={style.checkboxGroup}>
                  {field.options?.map((option) => {
                    const isChecked = (formState[field.name] || []).includes(
                      option.value
                    );
                    return (
                      <label
                        key={option.value}
                        style={style.checkboxGroupLabel}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (typeof option.value === "number") return;
                            handleCheckboxGroupChange(
                              field.name,
                              option.value,
                              e.target.checked
                            );
                          }}
                          style={style.checkbox}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            {error && <span style={style.error}>{error}</span>}
          </div>
        );

      default:
        return (
          <div style={style.fieldContainer} key={field.name}>
            {labelWithRequired}
            <input
              type="text"
              value={formState[field.name] || ""}
              onChange={(e) =>
                handleFieldChange(field.name, e.target.value, field.mask)
              }
              style={{
                ...style.input,
                borderColor: error ? "red" : Colors.border,
              }}
              className="input-field"
            />
            {error && <span style={style.error}>{error}</span>}
          </div>
        );
    }
  };

  const handleSaveEdit = async () => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required) {
        const value = formState[field.name];
        let empty = false;

        if (field.type === "CHECKBOX") {
          empty = value !== true;
        } else if (field.type === "CHECKBOXGROUP") {
          empty = !value || value.length === 0;
        } else if (field.type === "IFOKCHECKBOXGROUP") {
          const checkboxStateName = `${field.name}_enabled`;
          const isCheckboxChecked = formState[checkboxStateName];
          if (isCheckboxChecked) {
            empty = !value || value.length === 0;
          } else {
            empty = false;
          }
        } else {
          empty = value === "" || value == null;
        }

        if (empty) {
          newErrors[field.name] = "Campo obrigatório";
        }
      }

      if (field.mask && formState[field.name]) {
        const regex = maskToRegex(field.mask);
        if (!regex.test(formState[field.name])) {
          newErrors[field.name] = "Formato inválido";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", data.id.toString());

      const alunoData: any = {
        id: data.id,
      };

      fields.forEach((field) => {
        if (field.name.startsWith("responsavel.")) {
          return;
        }

        let value = formState[field.name];

        if (field.mask && typeof value === "string") {
          value = cleanValueForSubmission(value, field.mask);
        }

        if (field.type === "FILE") {
          if (value instanceof File) {
            formData.append(field.name, value);
          }
          return;
        }

        alunoData[field.name] = value ?? "";
      });

      const responsavelData: any = {};
      fields
        .filter((field) => field.name.startsWith("responsavel."))
        .forEach((field) => {
          const responsavelField = field.name.replace("responsavel.", "");
          let value = formState[field.name];

          if (field.mask && typeof value === "string") {
            value = cleanValueForSubmission(value, field.mask);
          }

          responsavelData[responsavelField] = value || "";
        });

      alunoData.responsavel = responsavelData;

      formData.append(
        "dto",
        new Blob([JSON.stringify(alunoData)], {
          type: "application/json",
        }),
      );

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/alunos`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      alert("Aluno atualizado com sucesso!");
      onUpdate?.();
      setEditMode(false);
    } catch (error: any) {
      alert("Erro ao atualizar aluno: " + error.message);
    }
  };

  const handleDelete = () => {
    setAreYouSure({
      open: true,
      label: "Tem certeza que deseja excluir este aluno?",
      options: ["Cancelar", "Excluir"],
      onConfirm: async () => {
        try {
          await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/alunos?id=${encodeURIComponent(
              data.id,
            )}`,
            {
              method: "DELETE",
              credentials: "include",
            },
          );
          setAreYouSure(null);
          onUpdate?.();
          close(false);
        } catch (error) {
          setAreYouSure(null);
        }
      },
    });
  };

  const handleDiscardChanges = () => {
    setAreYouSure({
      open: true,
      label: "Tem certeza que deseja descartar todas as alterações?",
      options: ["Cancelar", "Descartar"],
      onConfirm: () => {
        const initialState: Record<string, any> = {};
        fields.forEach((field) => {
          if (field.name.includes(".")) {
            const [parent, child] = field.name.split(".");
            initialState[field.name] = (data[parent as keyof Aluno] as any)?.[child] || "";
          } else {
            initialState[field.name] = data[field.name as keyof Aluno] || "";
          }
        });
        setFormState(initialState);
        setErrors({});
        setEditMode(false);
        setAreYouSure(null);
      },
    });
  };

  const handlePdf = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/alunos/contrato?id=${encodeURIComponent(data.id)}`,
        { credentials: "include" },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const newWindow = window.open(url, "_blank");

      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        window.location.href = url;
      }
    } catch (error) {
      alert("Erro ao carregar o PDF");
    }
  };

  const fieldGroups = getFieldGroups(fields);

  return (
    <div style={{ ...style.overlay, padding: isMobile ? "0.5rem" : "2vw" }}>
      {areYouSure?.open && (
        <AreYouSureDialog
          label={areYouSure.label}
          options={areYouSure.options}
          onClose={() => setAreYouSure(null)}
          onConfirm={areYouSure.onConfirm}
          isMobile={isMobile}
        />
      )}

      {showPaymentHistory && (
        <PaymentHistoryModal
          onUpdate={onUpdate}
          valorDevido={ensureNumber(data.valorDevido)}
          pagamentos={data.pagamento || []}
          alunoNome={data.nomeCompleto}
          onClose={() => setShowPaymentHistory(false)}
          aluno={data}
          isMobile={isMobile}
        />
      )}
      {showWhatsappDialog && (
        <SendMessagePanel
          onClose={() => setShowWhatsappDialog(false)}
          aluno={data}
          isMobile={isMobile}
        />
      )}

      <div
        style={{
          ...style.mainContainer,
          width: isMobile ? "95vw" : "90vw",
          borderRadius: isMobile ? "12px" : "20px",
        }}
      >
        <div
          style={{
            ...style.header,
            padding: isMobile ? "1rem" : "1.5rem 2rem",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "flex-start",
          }}
        >
          <div style={style.titleSection}>
            <h2
              style={{
                ...style.title,
                fontSize: isMobile ? "1.25rem" : "clamp(1.25rem, 4vw, 1.75rem)",
              }}
            >
              {data.nomeCompleto || "Nome não informado"}
            </h2>
            <div style={style.subtitle}>Detalhes do Aluno</div>
          </div>
          <div
            style={{
              ...style.actions,
              width: isMobile ? "100%" : "auto",
              marginTop: isMobile ? "0.75rem" : "0",
              gap: isMobile ? "0.5rem" : "0.75rem",
            }}
          >
            <button
              type="button"
              onClick={() => handlePdf()}
              style={{
                ...style.saveButton,
                padding: isMobile ? "0.625rem" : "0.625rem 1.25rem",
                minWidth: isMobile ? "2.75rem" : "min-content",
              }}
            >
              <FilePdfIcon size={18} />
              {!isMobile && <span style={style.buttonText}>Gerar PDF</span>}
            </button>

            {!editMode && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  ...style.deleteButton,
                  padding: isMobile ? "0.625rem" : "0.625rem 1.25rem",
                  minWidth: isMobile ? "2.75rem" : "min-content",
                }}
              >
                <Trash size={18} />
                {!isMobile && <span style={style.buttonText}>Excluir</span>}
              </button>
            )}

            <button
              type="button"
              onClick={editMode ? handleSaveEdit : () => setEditMode(true)}
              style={{
                ...(editMode ? style.saveButton : style.editButton),
                padding: isMobile ? "0.625rem" : "0.625rem 1.25rem",
                minWidth: isMobile ? "2.75rem" : "min-content",
              }}
            >
              {editMode ? (
                <>
                  <FloppyDisk size={18} />
                  {!isMobile && <span style={style.buttonText}>Salvar</span>}
                </>
              ) : (
                <>
                  <Pencil size={18} />
                  {!isMobile && <span style={style.buttonText}>Editar</span>}
                </>
              )}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                style={{
                  ...style.discardButton,
                  padding: isMobile ? "0.625rem" : "0.625rem 1.25rem",
                  minWidth: isMobile ? "2.75rem" : "min-content",
                }}
              >
                <ArrowCounterClockwise size={18} />
                {!isMobile && <span style={style.buttonText}>Descartar</span>}
              </button>
            )}

            <button
              type="button"
              style={style.editButton}
              onClick={() => setShowPaymentHistory(!showPaymentHistory)}
            >
              <CurrencyDollarIcon size={22} />
            </button>
            <button
              type="button"
              style={style.saveButton}
              onClick={() => setShowWhatsappDialog(!showWhatsappDialog)}
            >
              <WhatsappLogoIcon size={22} />
            </button>
            <button type="button" onClick={close} style={style.closeButton}>
              <X size={22} />
            </button>
          </div>
        </div>

        <div
          style={{
            ...style.content,
            padding: isMobile ? "1rem" : "2rem",
            gap: isMobile ? "1rem" : "1.5rem",
          }}
        >
          <div style={style.row}>
            <div
              style={{
                ...style.imageContainer,
                ...style.card,
                padding: isMobile ? "1rem" : "1.5rem",
              }}
            >
              <h3
                style={{
                  ...style.cardTitle,
                  fontSize: isMobile ? "1rem" : "1.125rem",
                }}
              >
                Foto
              </h3>
              {editMode ? (
                <div style={style.fileUpload}>
                  {renderField({
                    name: "url",
                    placeholder: "Foto",
                    type: "FILE",
                    required: false,
                  })}
                </div>
              ) : data.url ? (
                <img src={data.url} style={style.image} alt="Aluno" />
              ) : (
                <div style={style.placeholderImage}>Sem foto</div>
              )}
            </div>

            <div
              style={{
                ...style.imageContainer,
                ...style.card,
                padding: isMobile ? "1rem" : "1.5rem",
              }}
            >
              <h3
                style={{
                  ...style.cardTitle,
                  fontSize: isMobile ? "1rem" : "1.125rem",
                }}
              >
                Atestado
              </h3>
              {editMode ? (
                <div style={style.fileUpload}>
                  {renderField({
                    name: "atestado",
                    placeholder: "Atestado Médico",
                    type: "FILE",
                    required: false,
                  })}
                </div>
              ) : data.atestadoUrl ? (
                <img
                  src={data.atestadoUrl}
                  style={style.image}
                  alt="Atestado"
                />
              ) : (
                <div style={style.placeholderImage}>Sem atestado</div>
              )}
            </div>

            <div
              style={{
                ...style.card,
                padding: isMobile ? "1rem" : "1.5rem",
              }}
            >
              <h3
                style={{
                  ...style.cardTitle,
                  fontSize: isMobile ? "1rem" : "1.125rem",
                }}
              >
                <span style={style.icon}>👤</span>
                Dados Pessoais
              </h3>
              <div style={style.fieldsGrid}>
                {fieldGroups.personal.map((field) => renderField(field))}
              </div>
            </div>
          </div>

          <div style={style.row}>
            <div
              style={{
                ...style.card,
                padding: isMobile ? "1rem" : "1.5rem",
              }}
            >
              <h3
                style={{
                  ...style.cardTitle,
                  fontSize: isMobile ? "1rem" : "1.125rem",
                }}
              >
                <span style={style.icon}>🏫</span>
                Informações Escolares
              </h3>
              <div style={style.fieldsGrid}>
                {fieldGroups.school.map((field) => renderField(field))}
              </div>
            </div>

            <div
              style={{
                ...style.card,
                padding: isMobile ? "1rem" : "1.5rem",
              }}
            >
              <h3
                style={{
                  ...style.cardTitle,
                  fontSize: isMobile ? "1rem" : "1.125rem",
                }}
              >
                <span style={style.icon}>🏥</span>
                Saúde
              </h3>
              <div style={style.fieldsGrid}>
                {fieldGroups.health.map((field) => renderField(field))}
              </div>
            </div>
          </div>

          <div style={style.row}>
            <div
              style={{
                ...style.card,
                padding: isMobile ? "1rem" : "1.5rem",
              }}
            >
              <h3
                style={{
                  ...style.cardTitle,
                  fontSize: isMobile ? "1rem" : "1.125rem",
                }}
              >
                <span style={style.icon}>📝</span>
                Informações Adicionais
              </h3>
              <div style={style.fieldsGrid}>
                {fieldGroups.additional.map((field) => renderField(field))}
                {fieldGroups.turma.map((field) => renderField(field))}
              </div>
            </div>

            <div
              style={{
                ...style.card,
                padding: isMobile ? "1rem" : "1.5rem",
              }}
            >
              <h3
                style={{
                  ...style.cardTitle,
                  fontSize: isMobile ? "1rem" : "1.125rem",
                }}
              >
                <span style={style.icon}>💰</span>
                Informações Financeiras
              </h3>
              <div style={style.fieldsGrid}>
                <div style={style.fieldContainer}>
                  <label style={style.label}>Acordo</label>
                  <div style={style.value}>
                    {data.acordo || "Não informado"}
                  </div>
                </div>
                <div style={style.fieldContainer}>
                  <label style={style.label}>Valor da Fatura</label>
                  <div style={style.value}>
                    {formatCurrency(data.valorFatura)}
                  </div>
                </div>
                <div style={style.fieldContainer}>
                  <label style={style.label}>Valor Devido</label>
                  <div
                    style={{
                      ...style.value,
                      color:
                        (data.valorDevido ?? 0) > 0
                          ? Colors.error
                          : Colors.success,
                      fontWeight: 600,
                    }}
                  >
                    {formatCurrency(data.valorDevido)}
                  </div>
                </div>
                <div style={style.fieldContainer}>
                  <label style={style.label}>Valor do Uniforme</label>
                  <div style={style.value}>
                    {formatCurrency(data.valorUniforme)}
                  </div>
                </div>
                <div style={style.fieldContainer}>
                  <label style={style.label}>Dia de Pagamento</label>
                  <div style={style.value}>
                    {data.dataPagamento
                      ? `Dia ${data.dataPagamento}`
                      : "Não informado"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={style.row}>
            {data.responsavel && (
              <div
                style={{
                  ...style.card,
                  padding: isMobile ? "1rem" : "1.5rem",
                }}
              >
                <h3
                  style={{
                    ...style.cardTitle,
                    fontSize: isMobile ? "1rem" : "1.125rem",
                  }}
                >
                  <span style={style.icon}>👨‍👩‍👧‍👦</span>
                  Responsável
                </h3>
                <div style={style.fieldsGrid}>
                  {fieldGroups.responsible.map((field) => renderField(field))}
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              ...style.card,
              padding: isMobile ? "1rem" : "1.5rem",
            }}
          >
            <h3
              style={{
                ...style.cardTitle,
                fontSize: isMobile ? "1rem" : "1.125rem",
              }}
            >
              <span style={style.icon}>🏠</span>
              Endereço
            </h3>
            <div style={style.fieldsGrid}>
              {fieldGroups.endereco.map((field) => renderField(field))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
