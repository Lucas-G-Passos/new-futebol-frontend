import { X, Warning, CheckCircle, Info } from "@phosphor-icons/react";
import { StyleSheet } from "../../Utils/Stylesheet";

type Props = {
  message: string;
  severity: "info" | "warning" | "error" | "success";
  onClose: () => void;
};

export default function Toast({ message, severity, onClose }: Props) {
  const colors = {
    error: {
      bg: "#fee2e2",
      border: "#ef4444",
      text: "#991b1b",
    },
    warning: {
      bg: "#fef3c7",
      border: "#f59e0b",
      text: "#92400e",
    },
    success: {
      bg: "#d1fae5",
      border: "#10b981",
      text: "#065f46",
    },
    info: {
      bg: "#dbeafe",
      border: "#3b82f6",
      text: "#1e40af",
    },
  };

  const theme = colors[severity];
  const icons = {
    error: <X size={20} color={theme.text} weight="bold" />,
    warning: <Warning size={20} color={theme.text} weight="bold" />,
    success: <CheckCircle size={20} color={theme.text} weight="bold" />,
    info: <Info size={20} color={theme.text} weight="bold" />,
  };

  return (
    <div
      style={{
        ...style.toast,
        backgroundColor: theme.bg,
        borderColor: theme.border,
      }}
    >
      <div style={style.iconContainer}>{icons[severity]}</div>
      <p style={{ ...style.message, color: theme.text }}>{message}</p>
      <button onClick={onClose} style={style.closeButton}>
        <X size={16} color={theme.text} />
      </button>
    </div>
  );
}

const style = StyleSheet.create({
  toast: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    border: "2px solid",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    minWidth: 300,
    animation: "slideIn 0.3s ease-out",
  },
  iconContainer: {
    display: "flex",
    flexShrink: 0,
  },
  message: {
    margin: 0,
    fontSize: 14,
    fontWeight: 500,
    flex: 1,
  },
  closeButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 4,
    borderRadius: 4,
    display: "flex",
    flexShrink: 0,
    ":hover": {
      opacity: 0.7,
    },
  },
});
