import { useState } from "react";
import {
  XIcon,
  PaperPlaneRightIcon,
  FileIcon,
  WarningCircleIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { useSendMessage } from "./useSendMessage";
import { type PersonSelector, type Aluno } from "../../Utils/Types";
import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";

const FILE_UPLOAD_ENABLED = import.meta.env.VITE_ENABLE_FILE_UPLOAD !== "false";

type SendMessagePanelProps = {
  turmaNome?: string;
  turmaId?: number;
  aluno?: Aluno;
  onClose: () => void;
  isMobile: boolean;
};

export default function SendMessagePanel({
  turmaNome,
  turmaId,
  aluno,
  onClose,
  isMobile,
}: SendMessagePanelProps) {
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isResponsavel, setIsResponsavel] = useState<boolean>(false);
  const [phone2, setPhone2] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f != null) {
      setFile(f);
      setError("");
    }
  };

  const handleSendMessage = async () => {
    setError("");
    setIsSending(true);

    try {
      const messageParams: {
        alunos?: PersonSelector[];
        turmaId?: number;
        text?: string;
        file?: File;
        caption?: string;
      } = {
        text: text || undefined,
        file: file || undefined,
        caption: caption || undefined,
      };

      if (aluno) {
        messageParams.alunos = [
          {
            id: aluno.id,
            isResponsavel,
            phone2,
          },
        ];
      } else if (turmaId) {
        messageParams.turmaId = Number(turmaId);
      }

      await useSendMessage(messageParams);

      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const isValid = () => {
    const hasText = Boolean(text && text.trim());
    const hasFile = Boolean(file);

    // If file upload is disabled, only text is allowed
    if (!FILE_UPLOAD_ENABLED) {
      return hasText;
    }

    return hasText !== hasFile;
  };

  const canSend = isValid() && !isSending && !success;

  const getRecipientInfo = () => {
    if (aluno) {
      const recipientName = isResponsavel
        ? aluno.responsavel?.nomeCompleto || "Responsável"
        : aluno.nomeCompleto;

      const phoneNumber = isResponsavel
        ? phone2
          ? aluno.responsavel?.telefone2 || "N/A"
          : aluno.responsavel?.telefone1 || "N/A"
        : phone2
          ? aluno.telefone2 || "N/A"
          : aluno.telefone1;

      return {
        name: recipientName,
        phone: phoneNumber,
        label: `${recipientName} (${phoneNumber})`,
      };
    }

    if (turmaNome) {
      return {
        name: `Turma: ${turmaNome}`,
        phone: "Todos os alunos",
        label: `Turma: ${turmaNome}`,
      };
    }

    return { name: "", phone: "", label: "" };
  };

  const recipientInfo = getRecipientInfo();

  const hasResponsavelPhone = Boolean(
    aluno?.responsavel?.telefone1 || aluno?.responsavel?.telefone2,
  );

  const hasPhone2 = isResponsavel
    ? Boolean(aluno?.responsavel?.telefone2)
    : Boolean(aluno?.telefone2);

  return (
    <div style={style.dialogOverlay} onClick={onClose}>
      <div
        style={{
          ...style.dialogContainer,
          width: isMobile ? "95vw" : "500px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            ...style.dialogHeader,
            padding: isMobile ? "1rem" : "1.25rem 1.5rem",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "0.75rem" : "0",
          }}
        >
          <div>
            <h2
              style={{
                ...style.dialogTitle,
                fontSize: isMobile ? "1.125rem" : "1.25rem",
              }}
            >
              Enviar Mensagem WhatsApp
            </h2>
            <p style={style.dialogRecipient}>{recipientInfo.label}</p>
          </div>
          <button
            onClick={onClose}
            style={style.closeButton}
            aria-label="Fechar"
          >
            <XIcon size={20} weight="bold" />
          </button>
        </div>

        <div
          style={{
            ...style.dialogContent,
            padding: isMobile ? "1rem" : "1.5rem",
          }}
        >
          {error && (
            <div style={style.errorMessage}>
              <WarningCircleIcon size={20} color={Colors.error} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={style.successMessage}>
              <CheckCircleIcon size={20} color={Colors.success} />
              <span>Mensagem enviada com sucesso!</span>
            </div>
          )}
          
          {aluno && (
            <div style={style.optionsSection}>
              <p style={style.sectionLabel}>Destinatário:</p>
              <div style={style.checkboxGroup}>
                {hasResponsavelPhone && (
                  <label style={style.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isResponsavel}
                      onChange={(e) => {
                        setIsResponsavel(e.target.checked);
                        setPhone2(false);
                      }}
                      style={style.checkbox}
                    />
                    <span>
                      Enviar para responsável (
                      {aluno.responsavel?.nomeCompleto})
                    </span>
                  </label>
                )}
                <label
                  style={{
                    ...style.checkboxLabel,
                    opacity: !isResponsavel && !aluno.telefone2 ? 0.5 : 1,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={phone2}
                    onChange={(e) => setPhone2(e.target.checked)}
                    disabled={
                      !isResponsavel && !aluno.telefone2 && !hasPhone2
                    }
                    style={style.checkbox}
                  />
                  <span>
                    Usar telefone 2{" "}
                    {!hasPhone2 && isResponsavel
                      ? "(não disponível)"
                      : !aluno.telefone2 && !isResponsavel
                        ? "(não disponível)"
                        : ""}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Text Message Input */}
          <div style={style.inputGroup}>
            <label style={style.inputLabel}>Mensagem de texto:</label>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (file) setFile(null);
                setError("");
              }}
              placeholder="Digite sua mensagem..."
              disabled={!!file}
              style={{
                ...style.textInput,
                minHeight: isMobile ? "100px" : "120px",
              }}
            />
          </div>

          {/* File Upload */}
          {FILE_UPLOAD_ENABLED && (
          <>
          <div style={style.inputGroup}>
            <label style={style.inputLabel}>Ou envie um arquivo:</label>
            <div style={style.fileUploadArea}>
              <input
                type="file"
                onChange={(e) => {
                  handleFileChange(e);
                  setText("");
                }}
                disabled={!!text}
                accept="image/*,video/*,application/pdf,.doc,.docx"
                style={style.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={style.fileUploadButton}>
                <FileIcon size={20} />
                <span>
                  {file ? file.name : "Selecionar arquivo..."}
                </span>
              </label>
              {file && (
                <button
                  onClick={() => setFile(null)}
                  style={style.removeFileButton}
                >
                  <XIcon size={16} />
                  Remover
                </button>
              )}
            </div>
          </div>

          {file && (
            <div style={style.inputGroup}>
              <label style={style.inputLabel}>Legenda (opcional):</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Adicione uma legenda ao arquivo..."
                style={style.captionInput}
              />
            </div>
          )}
          </>
          )}

          {/* Validation Message */}
          {!isValid() && !success && (
            <div style={style.validationMessage}>
              <WarningCircleIcon size={16} color={Colors.warning} />
              <span>
                {FILE_UPLOAD_ENABLED
                  ? "Preencha o campo de mensagem OU selecione um arquivo (não ambos)"
                  : "Preencha o campo de mensagem"}
              </span>
            </div>
          )}
        </div>

        {/* Footer / Actions */}
        <div
          style={{
            ...style.dialogFooter,
            padding: isMobile ? "1rem" : "1rem 1.5rem",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            style={{
              ...style.cancelButton,
              width: isMobile ? "100%" : "auto",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!canSend}
            style={{
              ...style.sendButton,
              width: isMobile ? "100%" : "auto",
              opacity: canSend ? 1 : 0.5,
              cursor: canSend ? "pointer" : "not-allowed",
            }}
          >
            <PaperPlaneRightIcon size={20} weight="bold" />
            {isSending ? "Enviando..." : success ? "Enviado!" : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const style = StyleSheet.create({
  dialogOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(8px)",
    padding: "1rem",
  },
  dialogContainer: {
    backgroundColor: Colors.surface,
    borderRadius: "16px",
    border: `1px solid ${Colors.border}`,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
    width: "500px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  dialogHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  dialogTitle: {
    color: Colors.primary,
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: "700",
  },
  dialogRecipient: {
    color: Colors.text,
    margin: "0.25rem 0 0 0",
    fontSize: "0.875rem",
  },
  closeButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2.25rem",
    height: "2.25rem",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    color: Colors.textMuted,
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  dialogContent: {
    padding: "1.5rem",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "rgba(239, 83, 80, 0.1)",
    border: `1px solid ${Colors.error}`,
    borderRadius: "8px",
    color: Colors.error,
    fontSize: "0.875rem",
  },
  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    border: `1px solid ${Colors.success}`,
    borderRadius: "8px",
    color: Colors.success,
    fontSize: "0.875rem",
  },
  optionsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  sectionLabel: {
    color: Colors.textLight,
    fontSize: "0.875rem",
    fontWeight: "600",
    margin: 0,
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: Colors.text,
    fontSize: "0.9375rem",
    cursor: "pointer",
    userSelect: "none",
  },
  checkbox: {
    width: "1rem",
    height: "1rem",
    cursor: "pointer",
    accentColor: Colors.primary,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  inputLabel: {
    color: Colors.textLight,
    fontSize: "0.875rem",
    fontWeight: "500",
    margin: 0,
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: Colors.text,
    fontSize: "0.9375rem",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  fileUploadArea: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  fileInput: {
    display: "none",
  },
  fileUploadButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: Colors.inputBackground,
    border: `1px dashed ${Colors.borderDark}`,
    borderRadius: "8px",
    color: Colors.textLight,
    fontSize: "0.9375rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
    justifyContent: "center",
  },
  removeFileButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.5rem 0.75rem",
    backgroundColor: "rgba(239, 83, 80, 0.1)",
    border: `1px solid ${Colors.error}`,
    borderRadius: "6px",
    color: Colors.error,
    fontSize: "0.875rem",
    cursor: "pointer",
    alignSelf: "flex-start",
    transition: "all 0.2s ease",
  },
  captionInput: {
    backgroundColor: Colors.inputBackground,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    padding: "0.625rem 1rem",
    color: Colors.text,
    fontSize: "0.9375rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  validationMessage: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 0.875rem",
    backgroundColor: "rgba(255, 183, 77, 0.1)",
    border: `1px solid ${Colors.warning}`,
    borderRadius: "8px",
    color: Colors.warning,
    fontSize: "0.8125rem",
  },
  dialogFooter: {
    padding: "1rem 1.5rem",
    borderTop: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  cancelButton: {
    padding: "0.625rem 1.5rem",
    backgroundColor: "transparent",
    color: Colors.textMuted,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
  },
  sendButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.5rem",
    backgroundColor: Colors.success,
    color: "black",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
  },
});
