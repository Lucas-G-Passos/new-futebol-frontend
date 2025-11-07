import { useEffect, useState } from "react";
import { StyleSheet } from "../../Utils/Stylesheet";
import type { Aluno, FieldConfig } from "../../Utils/Types";
import Colors from "../../Utils/Colors";
import {
  X,
  FloppyDisk,
  Pencil,
  Trash,
  ArrowCounterClockwise,
  FilePdfIcon,
  CurrencyDollarIcon,
  PlusIcon,
  CalendarBlankIcon,
} from "@phosphor-icons/react";
import type { Pagamento } from "../../Utils/Types";
import PagamentoManual from "../Pagamentos/pagManual";
import AdicionarDivida from "../Pagamentos/AdicionarDivida";
import Calendar from "./Calendar/Calendar";
import mockAPI from "../../Utils/mockData";

function escapeForRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyMask(value: string, mask: string): string {
  let result = "";
  let valIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (valIndex >= value.length) break;

    const m = mask[i];
    if (m === "9") {
      if (/\d/.test(value[valIndex])) {
        result += value[valIndex];
        valIndex++;
      } else {
        valIndex++;
        i--;
      }
    } else {
      result += m;
      if (value[valIndex] === m) {
        valIndex++;
      }
    }
  }

  return result;
}

function removeMask(value: string): string {
  return value.replace(/\D/g, "");
}

function maskToRegex(mask: string): RegExp {
  const escaped = escapeForRegex(mask);
  const regexStr = "^" + escaped.replace(/9/g, "\\d") + "$";
  return new RegExp(regexStr);
}

const alunoFields: FieldConfig[] = [
  {
    name: "nomeCompleto",
    placeholder: "Nome Completo",
    type: "TEXT",
    required: true,
  },

  {
    name: "dataNascimento",
    placeholder: "Data de Nascimento",
    type: "DATE",
    required: true,
  },
  {
    name: "dataMatricula",
    placeholder: "Data de Matrícula",
    type: "DATE",
    required: true,
  },

  {
    name: "telefone1",
    placeholder: "Telefone 1",
    type: "TEXT",
    mask: "(99) 99999-9999",
    required: true,
  },
  {
    name: "telefone2",
    placeholder: "Telefone 2",
    type: "TEXT",
    mask: "(99) 99999-9999",
  },

  {
    name: "cpf",
    placeholder: "CPF",
    type: "TEXT",
    mask: "999.999.999-99",
    required: true,
  },
  {
    name: "rg",
    placeholder: "RG",
    type: "TEXT",
    mask: "99.999.999-9",
    required: true,
  },

  { name: "alergia", placeholder: "Alergia", type: "TEXT" },
  { name: "usoMedicamento", placeholder: "Uso de Medicamento", type: "TEXT" },
  {
    name: "horarioMedicamento",
    placeholder: "Horário do Medicamento",
    type: "TIME",
  },

  { name: "colegio", placeholder: "Colégio", type: "TEXT", required: true },

  {
    name: "colegioAno",
    placeholder: "Ano Escolar",
    type: "SELECT",
    required: true,
    options: [
      { label: "1º Ano", value: "1ano" },
      { label: "2º Ano", value: "2ano" },
      { label: "3º Ano", value: "3ano" },
      { label: "4º Ano", value: "4ano" },
      { label: "5º Ano", value: "5ano" },
      { label: "6º Ano", value: "6ano" },
      { label: "7º Ano", value: "7ano" },
      { label: "8º Ano", value: "8ano" },
      { label: "9º Ano", value: "9ano" },
      { label: "1º Médio", value: "1medio" },
      { label: "2º Médio", value: "2medio" },
      { label: "3º Médio", value: "3medio" },
      { label: "Terminou", value: "terminou" },
    ],
  },

  { name: "time", placeholder: "Time", type: "TEXT" },
  { name: "indicacao", placeholder: "Indicação", type: "TEXT" },
  { name: "observacao", placeholder: "Observação", type: "TEXT" },

  {
    name: "isAtivo",
    placeholder: "Ativo",
    type: "CHECKBOX",
    required: true,
    defaultValue: true,
  },

  {
    name: "turmaId",
    placeholder: "Turma",
    type: "SELECT",
    required: true,
    options: [],
  },

  { name: "file", placeholder: "Foto", type: "FILE" },

  {
    name: "responsavel.nomeCompleto",
    placeholder: "Nome do Responsável",
    type: "TEXT",
    required: true,
  },
  {
    name: "responsavel.cpf",
    placeholder: "CPF do Responsável",
    type: "TEXT",
    mask: "999.999.999-99",
    required: true,
  },
  {
    name: "responsavel.rg",
    placeholder: "RG do Responsável",
    type: "TEXT",
    mask: "99.999.999-9",
    required: true,
  },
  {
    name: "responsavel.telefone1",
    placeholder: "Telefone 1 do Responsável",
    type: "TEXT",
    mask: "(99) 99999-9999",
    required: true,
  },
  {
    name: "responsavel.telefone2",
    placeholder: "Telefone 2 do Responsável",
    type: "TEXT",
    mask: "(99) 99999-9999",
  },
  {
    name: "responsavel.email",
    placeholder: "Email do Responsável",
    type: "TEXT",
    required: true,
  },
  {
    name: "cep",
    placeholder: "CEP",
    type: "TEXT",
    required: true,
  },
  {
    name: "rua",
    placeholder: "Rua",
    type: "TEXT",
    required: true,
  },
  {
    name: "enderecoNumero",
    placeholder: "Número",
    type: "NUMBER",
    required: true,
  },
  {
    name: "cidade",
    placeholder: "Cidade",
    type: "TEXT",
    required: true,
  },
  {
    name: "estado",
    placeholder: "Estado",
    type: "SELECT",
    required: true,
    options: [
      { label: "Acre", value: "AC" },
      { label: "Alagoas", value: "AL" },
      { label: "Amapá", value: "AP" },
      { label: "Amazonas", value: "AM" },
      { label: "Bahia", value: "BA" },
      { label: "Ceará", value: "CE" },
      { label: "Distrito Federal", value: "DF" },
      { label: "Espírito Santo", value: "ES" },
      { label: "Goiás", value: "GO" },
      { label: "Maranhão", value: "MA" },
      { label: "Mato Grosso", value: "MT" },
      { label: "Mato Grosso do Sul", value: "MS" },
      { label: "Minas Gerais", value: "MG" },
      { label: "Pará", value: "PA" },
      { label: "Paraíba", value: "PB" },
      { label: "Paraná", value: "PR" },
      { label: "Pernambuco", value: "PE" },
      { label: "Piauí", value: "PI" },
      { label: "Rio de Janeiro", value: "RJ" },
      { label: "Rio Grande do Norte", value: "RN" },
      { label: "Rio Grande do Sul", value: "RS" },
      { label: "Rondônia", value: "RO" },
      { label: "Roraima", value: "RR" },
      { label: "Santa Catarina", value: "SC" },
      { label: "São Paulo", value: "SP" },
      { label: "Sergipe", value: "SE" },
      { label: "Tocantins", value: "TO" },
    ],
  },
];

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
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [id, setId] = useState<number>();
  const [showPaymentHistory, setShowPaymentHistory] = useState<boolean>(false);
  const [areYouSure, setAreYouSure] = useState<{
    open: boolean;
    label: string;
    options: string[];
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const ensureNumber = (value: number | undefined): number => {
    return value ?? 0;
  };

  useEffect(() => {
    const initialState: Record<string, any> = {};

    alunoFields.forEach((field) => {
      if (field.name.includes(".")) {
        const [parent, child] = field.name.split(".");
        initialState[field.name] = data[parent]?.[child] || "";
      } else {
        if (field.type === "CHECKBOX") {
          const value = data[field.name as keyof Aluno];
          initialState[field.name] =
            value === true || value === "true" || value === 1;
        } else {
          initialState[field.name] = data[field.name as keyof Aluno] || "";
        }
      }
    });

    initialState["url"] = data.url || "";

    setId(data.id);
    setFormState(initialState);
  }, [data]);
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

  const cleanValueForSubmission = (value: string, mask?: string): string => {
    if (!mask || !value) return value;
    const cleaned = removeMask(value);
    return cleaned.length > 0 ? cleaned : value;
  };

  const formatDisplayValue = (value: any, field: FieldConfig): string => {
    if (!value) return "Não informado";

    // Special handling for turmaId - display turma name instead
    if (field.name === "turmaId") {
      return (data as any).turmaNome || "Não informado";
    }

    switch (field.type) {
      case "DATE":
        try {
          return new Date(value).toLocaleDateString("pt-BR");
        } catch {
          return "Data inválida";
        }
      case "TIME":
        try {
          const [hours, minutes] = value.split(":");
          return `${hours}:${minutes}`;
        } catch {
          return value;
        }
      case "SELECT":
        const option = field.options?.find((opt) => opt.value === value);
        return option?.label || value;
      case "CHECKBOX":
        return value ? "Sim" : "Não";

      default:
        if (field.mask && value) {
          return applyMask(removeMask(value), field.mask);
        }
        return value;
    }
  };

  const getFieldValue = (fieldName: string): any => {
    if (fieldName.includes(".")) {
      const [parent, child] = fieldName.split(".");
      return data[parent as keyof Aluno]?.[child] || "";
    }
    return data[fieldName as keyof Aluno] || "";
  };

  const renderField = (field: FieldConfig) => {
    const value = editMode ? formState[field.name] : getFieldValue(field.name);
    const error = errors[field.name];
    const displayValue = editMode ? value : formatDisplayValue(value, field);

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
      // In the renderField function, update the CHECKBOX case:
      case "CHECKBOX":
        return (
          <div style={style.fieldContainer} key={field.name}>
            <label style={style.checkboxLabel}>
              <input
                type="checkbox"
                checked={!!formState[field.name]} // Convert to boolean
                onChange={(e) =>
                  handleFieldChange(field.name, e.target.checked)
                } // Use checked property
                style={style.checkbox}
              />
              {field.placeholder}
              {field.required && <span style={{ color: "red" }}> *</span>}
            </label>
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

    alunoFields.forEach((field) => {
      if (field.required) {
        const value = formState[field.name];
        const empty = value === "" || value == null;

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

      // Build the student data object
      const alunoData: any = {
        id: data.id,
      };

      // Process regular fields
      alunoFields.forEach((field) => {
        if (field.name.startsWith("responsavel.")) {
          // Skip nested fields for now
          return;
        }

        let value = formState[field.name];

        // Clean masked values
        if (field.mask && typeof value === "string") {
          value = cleanValueForSubmission(value, field.mask);
        }

        // Handle file separately
        if (field.type === "FILE" && value instanceof File) {
          formData.append("file", value);
        } else {
          alunoData[field.name] = value || "";
        }
      });

      // Build nested responsavel object
      const responsavelData: any = {};
      alunoFields
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

      // Append the main data as JSON
      formData.append(
        "dto",
        new Blob([JSON.stringify(alunoData)], {
          type: "application/json",
        })
      );

      // Convert FormData to object for mockAPI
      const alunoUpdateData: any = {};
      formData.forEach((value, key) => {
        if (key !== "dto") {
          alunoUpdateData[key] = value;
        }
      });
      // Merge with the structured alunoData
      Object.assign(alunoUpdateData, alunoData);

      await mockAPI.updateAluno(alunoUpdateData);

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
          await mockAPI.deleteAluno(data.id);
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
        // Reset form state to original data
        const initialState: Record<string, any> = {};
        alunoFields.forEach((field) => {
          if (field.name.includes(".")) {
            const [parent, child] = field.name.split(".");
            initialState[field.name] = data[parent]?.[child] || "";
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
  const handlePdf = async (id: number) => {
    try {
      const blob = await mockAPI.getContratoBlob(id);
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

  const fieldGroups = {
    personal: alunoFields.filter((field) =>
      [
        "nomeCompleto",
        "dataNascimento",
        "dataMatricula",
        "telefone1",
        "telefone2",
        "cpf",
        "rg",
      ].includes(field.name)
    ),
    school: alunoFields.filter((field) =>
      ["colegio", "colegioAno"].includes(field.name)
    ),
    health: alunoFields.filter((field) =>
      ["alergia", "usoMedicamento", "horarioMedicamento"].includes(field.name)
    ),
    additional: alunoFields.filter((field) =>
      ["time", "indicacao", "observacao", "isAtivo"].includes(field.name)
    ),
    turma: alunoFields.filter((field) => ["turmaId"].includes(field.name)),
    responsible: alunoFields.filter((field) =>
      field.name.startsWith("responsavel.")
    ),
    endereco: alunoFields.filter((field) =>
      ["rua", "cep", "cidade", "estado", "enderecoNumero"].includes(field.name)
    ),
  };

  return (
    <div style={style.overlay}>
      {areYouSure?.open && (
        <AreYouSureDialog
          label={areYouSure.label}
          options={areYouSure.options}
          onClose={() => setAreYouSure(null)}
          onConfirm={areYouSure.onConfirm}
        />
      )}

      {showPaymentHistory && (
        <PaymentHistoryModal
          valorDevido={ensureNumber(data.valorDevido)}
          pagamentos={data.pagamento || []}
          alunoNome={data.nomeCompleto}
          onClose={() => setShowPaymentHistory(false)}
          aluno={data}
        />
      )}

      <div style={style.mainContainer}>
        <div style={style.header}>
          <div style={style.titleSection}>
            <h2 style={style.title}>
              {data.nomeCompleto || "Nome não informado"}
            </h2>
            <div style={style.subtitle}>Detalhes do Aluno</div>
          </div>
          <div style={style.actions}>
            <button
              type="button"
              onClick={() => id && handlePdf(id)}
              style={style.saveButton}
              className="action-button"
            >
              <FilePdfIcon size={18} />
              <span style={style.buttonText}>Gerar PDF</span>
            </button>

            {!editMode && (
              <button
                type="button"
                onClick={handleDelete}
                style={style.deleteButton}
                className="action-button"
              >
                <Trash size={18} />
                <span style={style.buttonText}>Excluir</span>
              </button>
            )}

            <button
              type="button"
              onClick={editMode ? handleSaveEdit : () => setEditMode(true)}
              style={editMode ? style.saveButton : style.editButton}
              className="action-button"
            >
              {editMode ? (
                <>
                  <FloppyDisk size={18} />
                  <span style={style.buttonText}>Salvar</span>
                </>
              ) : (
                <>
                  <Pencil size={18} />
                  <span style={style.buttonText}>Editar</span>
                </>
              )}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                style={style.discardButton}
                className="action-button"
              >
                <ArrowCounterClockwise size={18} />
                <span style={style.buttonText}>Descartar</span>
              </button>
            )}

            <button
              type="button"
              style={style.pagamentoButton}
              onClick={() => setShowPaymentHistory(!showPaymentHistory)}
            >
              <CurrencyDollarIcon size={22} />
            </button>
            <button
              type="button"
              onClick={close}
              style={style.closeButton}
              className="close-button"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div style={style.content}>
          <div style={style.row}>
            <div style={{ ...style.imageContainer, ...style.card }}>
              <h3 style={style.cardTitle}>Foto</h3>
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

            <div style={style.card}>
              <h3 style={style.cardTitle}>
                <span style={style.icon}>👤</span>
                Dados Pessoais
              </h3>
              <div style={style.fieldsGrid}>
                {fieldGroups.personal.map((field) => renderField(field))}
              </div>
            </div>
          </div>

          <div style={style.row}>
            <div style={style.card}>
              <h3 style={style.cardTitle}>
                <span style={style.icon}>🏫</span>
                Informações Escolares
              </h3>
              <div style={style.fieldsGrid}>
                {fieldGroups.school.map((field) => renderField(field))}
              </div>
            </div>

            <div style={style.card}>
              <h3 style={style.cardTitle}>
                <span style={style.icon}>🏥</span>
                Saúde
              </h3>
              <div style={style.fieldsGrid}>
                {fieldGroups.health.map((field) => renderField(field))}
              </div>
            </div>
          </div>

          <div style={style.row}>
            <div style={style.card}>
              <h3 style={style.cardTitle}>
                <span style={style.icon}>📝</span>
                Informações Adicionais
              </h3>
              <div style={style.fieldsGrid}>
                {fieldGroups.additional.map((field) => renderField(field))}
                {fieldGroups.turma.map((field) => renderField(field))}
              </div>
            </div>

            <div style={style.card}>
              <h3 style={style.cardTitle}>
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
              <div style={style.card}>
                <h3 style={style.cardTitle}>
                  <span style={style.icon}>👨‍👩‍👧‍👦</span>
                  Responsável
                </h3>
                <div style={style.fieldsGrid}>
                  {fieldGroups.responsible.map((field) => renderField(field))}
                </div>
              </div>
            )}
          </div>
          <div style={style.card}>
            <h3 style={style.cardTitle}>
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

function AreYouSureDialog({
  label,
  options,
  onClose,
  onConfirm,
}: {
  label: string;
  options: string[];
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div style={style.dialogOverlay}>
      <div style={style.dialogContainer}>
        <div style={style.dialogContent}>
          <div style={style.warningIcon}>⚠️</div>
          <h3 style={style.dialogTitle}>Confirmação</h3>
          <p style={style.dialogMessage}>{label}</p>
          <div style={style.dialogActions}>
            <button
              onClick={onClose}
              style={style.dialogSecondaryButton}
              className="dialog-button"
            >
              {options[0]}
            </button>
            <button
              onClick={onConfirm}
              style={style.dialogPrimaryButton}
              className="dialog-button"
            >
              {options[1]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentHistoryModal({
  pagamentos,
  alunoNome,
  onClose,
  valorDevido,
  aluno,
}: {
  valorDevido: number;
  pagamentos: Pagamento[];
  alunoNome: string;
  aluno?: Aluno;
  onClose: () => void;
}) {
  const [showNewPaymentModal, setShowNewPaymentModal] =
    useState<boolean>(false);
  const [showDividaModal, setShowDividaModal] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(
    null
  );

  const handlePaymentModal = () => {
    setShowNewPaymentModal(!showNewPaymentModal);
  };

  const handleDividaModal = () => {
    setShowDividaModal(!showDividaModal);
  };

  const handleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const mapPagamentosToEventos = (pagamentos: Pagamento[]) => {
    return pagamentos.map((pagamento) => ({
      onClick: () => setSelectedPagamento(pagamento),
      label: formatCurrency(pagamento.valorPago),
      date: new Date(pagamento.dataPago),
    }));
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "PIX":
        return "#10b981";
      case "CARTAO":
        return "#3b82f6";
      case "DINHEIRO":
        return "#f59e0b";
      default:
        return Colors.textMuted;
    }
  };

  return (
    <div style={style.paymentHistoryOverlay}>
      <div style={style.paymentHistoryContainer}>
        <div style={style.paymentHistoryHeader}>
          <div>
            <h2 style={style.paymentHistoryTitle}>
              Histórico de Pagamentos | Valor devido: R${valorDevido}
            </h2>
            <p style={style.paymentHistorySubtitle}>{alunoNome}</p>
          </div>
          <div style={{ flexDirection: "row", display: "flex", gap: 8 }}>
            <button
              onClick={handleCalendar}
              style={style.paymentHistoryCloseButton}
            >
              <CalendarBlankIcon size={24} />
            </button>
            <button
              onClick={handlePaymentModal}
              style={style.paymentHistoryCloseButton}
            >
              Novo Pagamento
              <PlusIcon size={24} />
            </button>
            <button
              onClick={handleDividaModal}
              style={style.paymentHistoryCloseButton}
            >
              Nova Dívida
              <PlusIcon size={24} />
            </button>
            <button onClick={onClose} style={style.paymentHistoryCloseButton}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div style={style.paymentHistoryContent}>
          {pagamentos.length === 0 ? (
            <div style={style.noPaymentsContainer}>
              <div style={style.noPaymentsIcon}>💳</div>
              <p style={style.noPaymentsText}>Nenhum pagamento registrado</p>
            </div>
          ) : (
            <div style={style.paymentsList}>
              {pagamentos.map((pagamento) => (
                <div key={pagamento.id} style={style.paymentCard}>
                  <div style={style.paymentCardHeader}>
                    <div style={style.paymentDateContainer}>
                      <span style={style.paymentDateLabel}>Data</span>
                      <span style={style.paymentDate}>
                        {formatDate(pagamento.dataPago)}
                      </span>
                    </div>
                    <div style={style.paymentValueContainer}>
                      <span style={style.paymentValue}>
                        {formatCurrency(pagamento.valorPago)}
                      </span>
                    </div>
                  </div>

                  <div style={style.paymentCardBody}>
                    <div style={style.paymentMeta}>
                      <span
                        style={{
                          ...style.paymentMethodBadge,
                          backgroundColor: getMethodBadgeColor(
                            pagamento.metodoPagamento
                          ),
                        }}
                      >
                        {pagamento.metodoPagamento}
                      </span>
                      {pagamento.isAutomatized && (
                        <span style={style.automaticBadge}>Automático</span>
                      )}
                    </div>

                    {pagamento.observacao && (
                      <div style={style.paymentObservation}>
                        <strong>Observação:</strong> {pagamento.observacao}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showNewPaymentModal && (
        <div style={style.paymentNewModalOverlay}>
          <PagamentoManual
            onClose={handlePaymentModal}
            showClose={true}
            defaultAluno={aluno}
          />
        </div>
      )}
      {showDividaModal && (
        <div style={style.paymentNewModalOverlay}>
          <AdicionarDivida
            onClose={handleDividaModal}
            showClose={true}
            defaultAluno={aluno}
          />
        </div>
      )}

      {showCalendar &&
        aluno?.dataMatricula &&
        aluno?.intervalosInadimplencia && (
          <div
            style={style.paymentNewModalOverlay}
            onClick={() => setShowCalendar(false)}
          >
            <button
              onClick={() => setShowCalendar(false)}
              style={style.calendarCloseButton}
              aria-label="Fechar calendário"
            >
              <X size={24} weight="bold" />
            </button>
            <div
              style={style.calendarModalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar
                startDate={aluno.dataMatricula}
                intervalos={aluno.intervalosInadimplencia}
                eventos={mapPagamentosToEventos(pagamentos)}
              />
            </div>
          </div>
        )}

      {selectedPagamento && (
        <div
          style={style.paymentNewModalOverlay}
          onClick={() => setSelectedPagamento(null)}
        >
          <div
            style={style.paymentDetailsModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={style.paymentDetailsHeader}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", color: Colors.text }}>
                Detalhes do Pagamento
              </h3>
              <button
                onClick={() => setSelectedPagamento(null)}
                style={style.paymentHistoryCloseButton}
              >
                <X size={20} weight="bold" color={Colors.text} />
              </button>
            </div>
            <div style={style.paymentDetailsBody}>
              <div style={style.paymentDetailRow}>
                <span style={style.paymentDetailLabel}>Valor Pago:</span>
                <span style={style.paymentDetailValue}>
                  {formatCurrency(selectedPagamento.valorPago)}
                </span>
              </div>
              <div style={style.paymentDetailRow}>
                <span style={style.paymentDetailLabel}>Data do Pagamento:</span>
                <span style={style.paymentDetailValue}>
                  {formatDate(selectedPagamento.dataPago)}
                </span>
              </div>
              <div style={style.paymentDetailRow}>
                <span style={style.paymentDetailLabel}>
                  Método de Pagamento:
                </span>
                <span
                  style={{
                    ...style.methodBadge,
                    backgroundColor: getMethodBadgeColor(
                      selectedPagamento.metodoPagamento
                    ),
                  }}
                >
                  {selectedPagamento.metodoPagamento}
                </span>
              </div>
              <div style={style.paymentDetailRow}>
                <span style={style.paymentDetailLabel}>Automatizado:</span>
                <span style={style.paymentDetailValue}>
                  {selectedPagamento.isAutomatized ? "Sim" : "Não"}
                </span>
              </div>
              {selectedPagamento.observacao && (
                <div style={style.paymentDetailRow}>
                  <span style={style.paymentDetailLabel}>Observação:</span>
                  <span style={style.paymentDetailValue}>
                    {selectedPagamento.observacao}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const style = StyleSheet.create({
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflowY: "auto",
    padding: "2vw",
    zIndex: 1000,
  },
  mainContainer: {
    width: "90vw",
    maxWidth: 1200,
    minHeight: "85vh",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    border: `1px solid ${Colors.border}`,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "auto",
  },
  header: {
    padding: "1.5rem 2rem",
    borderBottom: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    flexWrap: "wrap",
    gap: "1rem",
  },
  titleSection: {
    flex: "1 1 300px",
    minWidth: 0,
  },
  title: {
    color: Colors.primary,
    margin: 0,
    fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
    fontWeight: "700",
    marginBottom: "0.25rem",
    wordBreak: "break-word",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: "0.875rem",
    opacity: 0.8,
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  buttonText: {
    // Text will automatically hide when container is too small due to flexbox
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    backgroundColor: Colors.primary,
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    minWidth: "min-content",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    backgroundColor: "#10b981",
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    minWidth: "min-content",
  },
  discardButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    backgroundColor: "#f59e0b",
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    minWidth: "min-content",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    backgroundColor: Colors.error,
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    minWidth: "min-content",
  },
  closeButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2.75rem",
    height: "2.75rem",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    border: `1px solid ${Colors.border}`,
    borderRadius: "10px",
    color: Colors.textMuted,
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  pagamentoButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2.75rem",
    height: "2.75rem",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    border: `1px solid ${Colors.border}`,
    borderRadius: "10px",
    color: Colors.textMuted,
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  row: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "stretch",
    flexWrap: "wrap",
  },
  card: {
    flex: "1 1 300px",
    backgroundColor: Colors.surfaceAlt,
    padding: "1.5rem",
    borderRadius: "16px",
    border: `1px solid ${Colors.border}`,
    minWidth: "min(100%, 300px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  imageContainer: {
    flex: "0 1 300px",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    color: Colors.primary,
    fontSize: "1.125rem",
    fontWeight: "600",
    margin: "0 0 1.25rem 0",
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
  },
  icon: {
    fontSize: "1.25rem",
  },
  fieldsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  label: {
    fontWeight: "600",
    fontSize: "0.8125rem",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  value: {
    color: Colors.text,
    fontSize: "0.9375rem",
    padding: "0.25rem 0",
    minHeight: "1.5rem",
    wordBreak: "break-word",
  },
  notInformed: {
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  input: {
    padding: "0.625rem 0.75rem",
    border: `2px solid ${Colors.border}`,
    borderRadius: "8px",
    fontSize: "0.9375rem",
    backgroundColor: Colors.surface,
    transition: "all 0.2s ease",
    color: Colors.text,
    width: "100%",
    boxSizing: "border-box",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "12px",
    border: `1px solid ${Colors.border}`,
  },
  previewImage: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "8px",
    marginTop: "0.75rem",
    border: `1px solid ${Colors.border}`,
  },
  placeholderImage: {
    width: "100%",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: "12px",
    border: `2px dashed ${Colors.border}`,
    color: Colors.textMuted,
    fontSize: "0.875rem",
  },
  fileUpload: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  dialogOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1001,
    backdropFilter: "blur(8px)",
    padding: "1rem",
  },
  dialogContainer: {
    backgroundColor: Colors.surface,
    borderRadius: "16px",
    border: `1px solid ${Colors.border}`,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
    maxWidth: "400px",
    width: "90vw",
    overflow: "auto",
  },
  dialogContent: {
    padding: "2rem",
    textAlign: "center",
  },
  warningIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  dialogTitle: {
    color: Colors.primary,
    margin: "0 0 0.75rem 0",
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  dialogMessage: {
    color: Colors.text,
    margin: "0 0 1.5rem 0",
    fontSize: "0.9375rem",
    lineHeight: "1.5",
  },
  dialogActions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  dialogSecondaryButton: {
    padding: "0.625rem 1.5rem",
    backgroundColor: "transparent",
    color: Colors.textMuted,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    minWidth: "120px",
  },
  dialogPrimaryButton: {
    padding: "0.625rem 1.5rem",
    backgroundColor: Colors.error,
    color: "black",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    minWidth: "120px",
  },
  error: {
    color: Colors.error,
    fontSize: "0.75rem",
    marginTop: "0.25rem",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "600",
    fontSize: "0.8125rem",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    cursor: "pointer",
  },
  checkbox: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
  },
  // Payment History Modal Styles
  paymentHistoryOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 15,
    backdropFilter: "blur(8px)",
    padding: "1rem",
    paddingTop: "65rem",
    overflow: "auto",
  },
  paymentHistoryContainer: {
    backgroundColor: Colors.surface,
    borderRadius: "16px",
    border: `1px solid ${Colors.border}`,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
    width: "90vw",
    minHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  paymentHistoryHeader: {
    padding: "1.5rem 2rem",
    borderBottom: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  paymentHistoryTitle: {
    color: Colors.primary,
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "0.25rem",
  },
  paymentHistorySubtitle: {
    color: Colors.textMuted,
    margin: 0,
    fontSize: "0.875rem",
  },
  paymentHistoryCloseButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "2.5rem",
    height: "2.5rem",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    border: `1px solid ${Colors.border}`,
    borderRadius: "10px",
    color: Colors.textMuted,
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
    gap: 4,
  },
  paymentHistoryContent: {
    flex: 1,
    overflowY: "auto",
    padding: "1.5rem 2rem",
  },
  noPaymentsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1rem",
    textAlign: "center",
  },
  noPaymentsIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
    opacity: 0.5,
  },
  noPaymentsText: {
    color: Colors.textMuted,
    fontSize: "1rem",
    margin: 0,
  },
  paymentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  paymentCard: {
    backgroundColor: Colors.surfaceAlt,
    border: `1px solid ${Colors.border}`,
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.2s ease",
  },
  paymentCardHeader: {
    padding: "1rem 1.25rem",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderBottom: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentDateContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  paymentDateLabel: {
    fontSize: "0.75rem",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600,
  },
  paymentDate: {
    fontSize: "0.9375rem",
    color: Colors.text,
    fontWeight: 500,
  },
  paymentValueContainer: {
    textAlign: "right",
  },
  paymentValue: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: Colors.success,
  },
  paymentCardBody: {
    padding: "1rem 1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  paymentMeta: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  paymentMethodBadge: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  automaticBadge: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 600,
    backgroundColor: Colors.info,
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  paymentObservation: {
    fontSize: "0.875rem",
    color: Colors.text,
    lineHeight: "1.5",
    padding: "0.75rem",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "6px",
    borderLeft: `3px solid ${Colors.borderFocus}`,
  },
  paymentNewModalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 18,
    backdropFilter: "blur(8px)",
    padding: "2rem 1rem",
    width: "100vw",
    height: "100vh",
    overflow: "auto",
    boxSizing: "border-box",
  },
  paymentDetailsModal: {
    backgroundColor: Colors.surface,
    borderRadius: "12px",
    padding: "1.5rem",
    width: "90%",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    border: `1px solid ${Colors.borderLight}`,
  },
  calendarModalContainer: {
    position: "relative",
    width: "90%",
    marginTop: "3rem",
  },
  calendarCloseButton: {
    position: "fixed",
    top: "2rem",
    right: "2rem",
    backgroundColor: Colors.surface,
    border: `2px solid ${Colors.border}`,
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: Colors.text,
    transition: "all 0.2s ease",
    zIndex: 20,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  paymentDetailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: `1px solid ${Colors.borderLight}`,
  },
  paymentDetailsBody: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  paymentDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem",
    backgroundColor: Colors.background,
    borderRadius: "8px",
    border: `1px solid ${Colors.borderLight}`,
  },
  paymentDetailLabel: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: Colors.textLight,
  },
  paymentDetailValue: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: Colors.text,
  },
  methodBadge: {
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: Colors.text,
  },
});
