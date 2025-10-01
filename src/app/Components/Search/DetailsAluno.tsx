import { useEffect, useState } from "react";
import { StyleSheet } from "../../Utils/Stylesheet";
import type { Aluno } from "../../Utils/Types";
import Colors from "../../Utils/Colors";
import {
  X,
  FloppyDisk,
  Pencil,
  Trash,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";

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
  const [areYouSure, setAreYouSure] = useState<{
    open: boolean;
    label: string;
    options: string[];
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  useEffect(() => console.log(data), []);

  // Helper function to format CPF
  const formatCPF = (cpf: string): string => {
    if (!cpf) return "Não informado";
    const cleanCPF = cpf.replace(/\D/g, "");
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Helper function to format RG
  const formatRG = (rg: string): string => {
    if (!rg) return "Não informado";
    const cleanRG = rg.replace(/\D/g, "");
    if (cleanRG.length <= 8) {
      return cleanRG.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
    }
    return cleanRG.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
  };

  // Helper function to format phone numbers
  const formatPhone = (phone: string): string => {
    if (!phone) return "Não informado";
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (cleanPhone.length === 8) {
      return cleanPhone.replace(/(\d{4})(\d{4})/, "$1-$2");
    } else if (cleanPhone.length === 9) {
      return cleanPhone.replace(/(\d{5})(\d{4})/, "$1-$2");
    }

    return phone;
  };

  // Helper function to format date
  const formatDate = (date: string): string => {
    if (!date) return "Não informado";
    try {
      return new Date(date).toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  // Helper function to format time
  const formatTime = (time: string): string => {
    if (!time) return "Não informado";
    try {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  // Helper function to format grade
  const formatGrade = (grade: string): string => {
    if (!grade) return "Não informado";
    const cleanGrade = grade.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const gradeMatch = cleanGrade.match(/^(\d+)(?:ano|series?)?$/);
    if (gradeMatch) {
      const gradeNumber = gradeMatch[1];
      return `${gradeNumber}° Ano`;
    }
    return grade
      .replace(/(\d+)/, "$1°")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const renderField = (
    label: string,
    value: any,
    key: string,
    type: "text" | "date" | "time" | "file" = "text"
  ) => {
    let displayValue = value ?? "Não informado";

    if (!editMode) {
      switch (key) {
        case "cpf":
        case "responsavel.cpf":
          displayValue = formatCPF(value);
          break;
        case "rg":
        case "responsavel.rg":
          displayValue = formatRG(value);
          break;
        case "telefone1":
        case "telefone2":
        case "responsavel.telefone1":
        case "responsavel.telefone2":
          displayValue = formatPhone(value);
          break;
        case "dataNascimento":
        case "dataMatricula":
          displayValue = formatDate(value);
          break;
        case "horarioMedicamento":
          displayValue = formatTime(value);
          break;
        case "colegioAno":
          displayValue = formatGrade(value);
          break;
        default:
          displayValue = value ?? "Não informado";
      }
    }

    return (
      <div style={style.fieldContainer}>
        <label style={style.label}>{label}</label>
        {editMode ? (
          <input
            key={key}
            name={key}
            type={type}
            defaultValue={type === "file" ? undefined : value ?? ""}
            style={style.input}
            className="input-field"
          />
        ) : (
          <div
            style={{
              ...style.value,
              ...(displayValue === "Não informado" ? style.notInformed : {}),
            }}
            key={key}
          >
            {displayValue}
          </div>
        )}
      </div>
    );
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();

      // Add student data - convert all values to strings
      formData.append("id", data.id.toString());
      formData.append(
        "nomeCompleto",
        (document.querySelector('[name="nomeCompleto"]') as HTMLInputElement)
          ?.value ||
          data.nomeCompleto ||
          ""
      );

      // Convert dates to string format YYYY-MM-DD
      const dataNascimentoValue = (
        document.querySelector('[name="dataNascimento"]') as HTMLInputElement
      )?.value;
      const dataMatriculaValue = (
        document.querySelector('[name="dataMatricula"]') as HTMLInputElement
      )?.value;

      formData.append(
        "dataNascimento",
        dataNascimentoValue ||
          (data.dataNascimento instanceof Date
            ? data.dataNascimento.toISOString().split("T")[0]
            : data.dataNascimento || "")
      );

      formData.append(
        "dataMatricula",
        dataMatriculaValue ||
          (data.dataMatricula instanceof Date
            ? data.dataMatricula.toISOString().split("T")[0]
            : data.dataMatricula || "")
      );

      formData.append(
        "telefone1",
        (document.querySelector('[name="telefone1"]') as HTMLInputElement)
          ?.value ||
          data.telefone1 ||
          ""
      );
      formData.append(
        "telefone2",
        (document.querySelector('[name="telefone2"]') as HTMLInputElement)
          ?.value ||
          data.telefone2 ||
          ""
      );
      formData.append(
        "cpf",
        (document.querySelector('[name="cpf"]') as HTMLInputElement)?.value ||
          data.cpf ||
          ""
      );
      formData.append(
        "rg",
        (document.querySelector('[name="rg"]') as HTMLInputElement)?.value ||
          data.rg ||
          ""
      );
      formData.append(
        "alergia",
        (document.querySelector('[name="alergia"]') as HTMLInputElement)
          ?.value ||
          data.alergia ||
          ""
      );
      formData.append(
        "usoMedicamento",
        (document.querySelector('[name="usoMedicamento"]') as HTMLInputElement)
          ?.value ||
          data.usoMedicamento ||
          ""
      );

      // Handle time field
      const horarioMedicamentoValue = (
        document.querySelector(
          '[name="horarioMedicamento"]'
        ) as HTMLInputElement
      )?.value;
      formData.append(
        "horarioMedicamento",
        horarioMedicamentoValue || data.horarioMedicamento || ""
      );

      formData.append(
        "colegio",
        (document.querySelector('[name="colegio"]') as HTMLInputElement)
          ?.value ||
          data.colegio ||
          ""
      );
      formData.append(
        "colegioAno",
        (document.querySelector('[name="colegioAno"]') as HTMLInputElement)
          ?.value ||
          data.colegioAno ||
          ""
      );
      formData.append(
        "time",
        (document.querySelector('[name="time"]') as HTMLInputElement)?.value ||
          data.time ||
          ""
      );
      formData.append(
        "indicacao",
        (document.querySelector('[name="indicacao"]') as HTMLInputElement)
          ?.value ||
          data.indicacao ||
          ""
      );
      formData.append(
        "observacao",
        (document.querySelector('[name="observacao"]') as HTMLInputElement)
          ?.value ||
          data.observacao ||
          ""
      );
      formData.append("ativo", "true");
      formData.append(
        "url",
        (document.querySelector('[name="url"]') as HTMLInputElement)?.value ||
          data.url ||
          ""
      );

      // Add responsible data if exists
      if (data.responsavel) {
        formData.append(
          "responsavel.nomeCompleto",
          (
            document.querySelector(
              '[name="responsavel.nomeCompleto"]'
            ) as HTMLInputElement
          )?.value ||
            data.responsavel.nomeCompleto ||
            ""
        );
        formData.append(
          "responsavel.cpf",
          (
            document.querySelector(
              '[name="responsavel.cpf"]'
            ) as HTMLInputElement
          )?.value ||
            data.responsavel.cpf ||
            ""
        );
        formData.append(
          "responsavel.rg",
          (
            document.querySelector(
              '[name="responsavel.rg"]'
            ) as HTMLInputElement
          )?.value ||
            data.responsavel.rg ||
            ""
        );
        formData.append(
          "responsavel.telefone1",
          (
            document.querySelector(
              '[name="responsavel.telefone1"]'
            ) as HTMLInputElement
          )?.value ||
            data.responsavel.telefone1 ||
            ""
        );
        formData.append(
          "responsavel.telefone2",
          (
            document.querySelector(
              '[name="responsavel.telefone2"]'
            ) as HTMLInputElement
          )?.value ||
            data.responsavel.telefone2 ||
            ""
        );
        formData.append(
          "responsavel.email",
          (
            document.querySelector(
              '[name="responsavel.email"]'
            ) as HTMLInputElement
          )?.value ||
            data.responsavel.email ||
            ""
        );
      }

      // Handle file upload
      const fileInput = document.querySelector(
        '[name="url"]'
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("file", fileInput.files[0]);
      }

      console.log("Sending multipart form data");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/alunos`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );
      console.log(formData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const updatedAluno = await response.json();
      console.log("Atualizado com sucesso!:", updatedAluno);

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
        setEditMode(false);
        setAreYouSure(null);
      },
    });
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
                  {renderField("Foto", data.url, "url", "file")}
                  {data.url && (
                    <img src={data.url} style={style.previewImage} />
                  )}
                </div>
              ) : data.url ? (
                <img src={data.url} style={style.image} />
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
                {renderField(
                  "Nome Completo",
                  data.nomeCompleto,
                  "nomeCompleto"
                )}
                {renderField(
                  "Data de Nascimento",
                  data.dataNascimento,
                  "dataNascimento",
                  "date"
                )}
                {renderField(
                  "Data de Matrícula",
                  data.dataMatricula,
                  "dataMatricula",
                  "date"
                )}
                {renderField("CPF", data.cpf, "cpf")}
                {renderField("RG", data.rg, "rg")}
                {renderField("Telefone 1", data.telefone1, "telefone1")}
                {renderField("Telefone 2", data.telefone2, "telefone2")}
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
                {renderField("Colégio", data.colegio, "colegio")}
                {renderField("Ano/Série", data.colegioAno, "colegioAno")}
              </div>
            </div>

            <div style={style.card}>
              <h3 style={style.cardTitle}>
                <span style={style.icon}>🏥</span>
                Saúde
              </h3>
              <div style={style.fieldsGrid}>
                {renderField("Alergias", data.alergia, "alergia")}
                {renderField(
                  "Uso de Medicamento",
                  data.usoMedicamento,
                  "usoMedicamento"
                )}
                {renderField(
                  "Horário do Medicamento",
                  data.horarioMedicamento,
                  "horarioMedicamento",
                  "time"
                )}
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
                {renderField("Time", data.time, "time")}
                {renderField("Indicação", data.indicacao, "indicacao")}
                {renderField("Observações", data.observacao, "observacao")}
              </div>
            </div>

            {data.responsavel && (
              <div style={style.card}>
                <h3 style={style.cardTitle}>
                  <span style={style.icon}>👨‍👩‍👧‍👦</span>
                  Responsável
                </h3>
                <div style={style.fieldsGrid}>
                  {renderField(
                    "Nome",
                    data.responsavel.nomeCompleto,
                    "responsavel.nomeCompleto"
                  )}
                  {renderField("CPF", data.responsavel.cpf, "responsavel.cpf")}
                  {renderField("RG", data.responsavel.rg, "responsavel.rg")}
                  {renderField(
                    "Telefone 1",
                    data.responsavel.telefone1,
                    "responsavel.telefone1"
                  )}
                  {renderField(
                    "Telefone 2",
                    data.responsavel.telefone2,
                    "responsavel.telefone2"
                  )}
                  {renderField(
                    "Email",
                    data.responsavel.email,
                    "responsavel.email"
                  )}
                </div>
              </div>
            )}
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 20,
    backdropFilter: "blur(4px)",
  },
  mainContainer: {
    width: "90%",
    maxWidth: 1200,
    height: "90%",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    border: `1px solid ${Colors.border}`,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
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
    overflow: "hidden",
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
});
