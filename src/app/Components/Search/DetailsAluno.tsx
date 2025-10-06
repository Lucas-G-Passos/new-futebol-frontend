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
} from "@phosphor-icons/react";

// Masking functions from DynamicForm
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

  { name: "ativo", placeholder: "Ativo", type: "CHECKBOX", required: true },

  {
    name: "turmaId",
    placeholder: "Turma",
    type: "SELECT",
    required: true,
    options: [],
  },

  { name: "file", placeholder: "Foto", type: "FILE", required: true },

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
    type: "TEXT",
    required: true,
    mask: "99999999",
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
  onUpdate: () => void;
}) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [areYouSure, setAreYouSure] = useState<{
    open: boolean;
    label: string;
    options: string[];
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  // Initialize form state from data
  useEffect(() => {
    const initialState: Record<string, any> = {};

    alunoFields.forEach((field) => {
      if (field.name.includes(".")) {
        // Handle nested properties (responsavel.*)
        const [parent, child] = field.name.split(".");
        initialState[field.name] = data[parent]?.[child] || "";
      } else {
        initialState[field.name] = data[field.name as keyof Aluno] || "";
      }
    });

    // Handle file separately
    initialState["url"] = data.url || "";

    setFormState(initialState);
    console.log(alunoFields);
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

  // Helper function to format display values (for view mode)
  const formatDisplayValue = (value: any, field: FieldConfig): string => {
    if (!value) return "Não informado";

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
    // Validate required fields
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

      // Add student data
      formData.append("id", data.id.toString());

      alunoFields.forEach((field) => {
        let value = formState[field.name];

        // Clean masked values
        if (field.mask && typeof value === "string") {
          value = cleanValueForSubmission(value, field.mask);
        }

        // Handle file separately
        if (field.type === "FILE" && value instanceof File) {
          formData.append("file", value);
        } else {
          formData.append(field.name, value || "");
        }
      });

      // Add fixed fields
      formData.append("ativo", "true");

      console.log("Sending multipart form data");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/alunos`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      alert("Atualizado com sucesso!");

      onUpdate?.();
      setEditMode(false);
    } catch (error: any) {
      console.error("Error updating student:", error);
      alert("Erro ao atualizar aluno: " + error.message);
    }
  };

  const handleDelete = () => {
    setAreYouSure({
      open: true,
      label: "Tem certeza que deseja excluir este aluno?",
      options: ["Cancelar", "Excluir"],
      onConfirm: async () => {
        console.log("Deleting student:", data.id);
        try {
          await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/alunos?id=${encodeURIComponent(
              data.id
            )}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );
          setAreYouSure(null);
          onUpdate?.();
          close(false);
        } catch (error) {
          console.error("Error deleting student:", error);
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

  // Group fields by category for display
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
      ["time", "indicacao", "observacao"].includes(field.name)
    ),
    responsible: alunoFields.filter((field) =>
      field.name.startsWith("responsavel.")
    ),
    endereco: alunoFields.filter((field) =>
      ["rua", "cep", "cidade", "estado"].includes(field.name)
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

      <div style={style.mainContainer}>
        <div style={style.header}>
          <div style={style.titleSection}>
            <h2 style={style.title}>
              {data.nomeCompleto || "Nome não informado"}
            </h2>
            <div style={style.subtitle}>Detalhes do Aluno</div>
          </div>
          <div style={style.actions}>
            {!editMode && (
              <button
                type="button"
                onClick={handleDelete}
                style={style.deleteButton}
                className="action-button"
              >
                <Trash size={18} />
                Excluir
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
                  Salvar
                </>
              ) : (
                <>
                  <Pencil size={18} />
                  Editar
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
                Descartar
              </button>
            )}

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
              </div>
            </div>

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
          <div style={style.row}>
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

const style = StyleSheet.create({
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflowY: "auto",
    padding: 40,
  },
  mainContainer: {
    width: "90%",
    maxWidth: 1200,
    minHeight: "90%",
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
    padding: "24px 32px",
    borderBottom: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  titleSection: {
    flex: 1,
  },
  title: {
    color: Colors.primary,
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "4px",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: "14px",
    opacity: 0.8,
  },
  actions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: Colors.primary,
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#10b981",
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  discardButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#f59e0b",
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: Colors.error,
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  closeButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "44px",
    height: "44px",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    border: `1px solid ${Colors.border}`,
    borderRadius: "10px",
    color: Colors.textMuted,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  content: {
    flex: 1,
    padding: "32px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  row: {
    display: "flex",
    gap: "24px",
    alignItems: "stretch",
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    padding: "24px",
    borderRadius: "16px",
    border: `1px solid ${Colors.border}`,
    minWidth: "300px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  imageContainer: {
    flex: "0 0 300px",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    color: Colors.primary,
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 20px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  icon: {
    fontSize: "20px",
  },
  fieldsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontWeight: "600",
    fontSize: "13px",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  value: {
    color: Colors.text,
    fontSize: "15px",
    padding: "4px 0",
    minHeight: "24px",
  },
  notInformed: {
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  input: {
    padding: "10px 12px",
    border: `2px solid ${Colors.border}`,
    borderRadius: "8px",
    fontSize: "15px",
    backgroundColor: Colors.surface,
    transition: "all 0.2s ease",
    color: Colors.text,
  },
  image: {
    width: "100%",
    objectFit: "cover",
    borderRadius: "12px",
    border: `1px solid ${Colors.border}`,
  },
  previewImage: {
    width: "100%",
    objectFit: "cover",
    borderRadius: "8px",
    marginTop: "12px",
    border: `1px solid ${Colors.border}`,
  },
  placeholderImage: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: "12px",
    border: `2px dashed ${Colors.border}`,
    color: Colors.textMuted,
    fontSize: "14px",
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
  },
  dialogContainer: {
    backgroundColor: Colors.surface,
    borderRadius: "16px",
    border: `1px solid ${Colors.border}`,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
    maxWidth: "400px",
    width: "90%",
    overflow: "auto",
  },
  dialogContent: {
    padding: "32px",
    textAlign: "center",
  },
  warningIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  dialogTitle: {
    color: Colors.primary,
    margin: "0 0 12px 0",
    fontSize: "20px",
    fontWeight: "600",
  },
  dialogMessage: {
    color: Colors.text,
    margin: "0 0 24px 0",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  dialogActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  dialogSecondaryButton: {
    padding: "10px 24px",
    backgroundColor: "transparent",
    color: Colors.textMuted,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  dialogPrimaryButton: {
    padding: "10px 24px",
    backgroundColor: Colors.error,
    color: "black",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  error: {
    color: Colors.error,
    fontSize: "12px",
    marginTop: "4px",
  },
});
