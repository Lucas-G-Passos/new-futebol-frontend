import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";

interface AreYouSureDialogProps {
  label: string;
  options: string[];
  onClose: () => void;
  onConfirm: () => void;
  isMobile: boolean;
}

export default function AreYouSureDialog({
  label,
  options,
  onClose,
  onConfirm,
  isMobile,
}: AreYouSureDialogProps) {
  return (
    <div style={style.dialogOverlay}>
      <div
        style={{
          ...style.dialogContainer,
          width: isMobile ? "95vw" : "90vw",
          maxWidth: isMobile ? "90vw" : "400px",
        }}
      >
        <div
          style={{
            ...style.dialogContent,
            padding: isMobile ? "1.25rem" : "2rem",
          }}
        >
          <div style={style.warningIcon}>⚠️</div>
          <h3 style={style.dialogTitle}>Confirmação</h3>
          <p style={style.dialogMessage}>{label}</p>
          <div
            style={{
              ...style.dialogActions,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <button
              onClick={onClose}
              style={{
                ...style.dialogSecondaryButton,
                width: isMobile ? "100%" : "auto",
              }}
            >
              {options[0]}
            </button>
            <button
              onClick={onConfirm}
              style={{
                ...style.dialogPrimaryButton,
                width: isMobile ? "100%" : "auto",
              }}
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
});