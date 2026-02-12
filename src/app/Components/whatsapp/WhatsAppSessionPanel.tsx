import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";
import type { SessionDto } from "../../Utils/Types";
import { XIcon } from "@phosphor-icons/react";

type WhatsAppSessionPanelProps = {
  session: SessionDto;
  qrCode?: string | null;
  onLogout: () => void;
  onShutdown: () => void;
  onClose: () => void;
  loading?: boolean;
  formatPhone: (v: string) => string;
};

export function WhatsAppSessionPanel({
  session,
  qrCode,
  onLogout,
  onShutdown,
  onClose,
  loading = false,
  formatPhone,
}: WhatsAppSessionPanelProps) {
  return (
    <div style={style.overlay}>
      <div style={style.panel}>
        <div style={style.header}>
          <h2>Whatsapp</h2>
          <button onClick={onClose} style={style.closeButton}>
            <XIcon />
          </button>
        </div>

        <div style={style.content}>
          {loading ? (
            <p>Carregando...</p>
          ) : qrCode ? (
            <div style={style.qrContainer}>
              <p style={style.statusText}>
                Escaneie o qr code para se conectar ao whatsapp
              </p>
              <img src={qrCode} alt="WhatsApp QR Code" style={style.qrImage} />

              <p style={style.statusText}>
                Ao término, clique em desligar, para evitar gastos.
              </p>
              <button onClick={onShutdown} style={style.shutdownButton}>
                Desligar
              </button>
            </div>
          ) : session.me ? (
            <div style={style.connectedContainer}>
              <p style={style.successText}>✓ Conectado</p>
              <p style={style.userInfo}>{session.me.pushName}</p>
              <p style={style.userInfo}>
                {formatPhone(session.me.id.replace("@c.us", ""))}
              </p>
              <p style={style.sessionInfo}>
                Status: <strong>{session.status}</strong>
              </p>
            </div>
          ) : (
            <div style={style.disconnectedContainer}>
              <p style={style.statusText}>Sessão não iniciada</p>
              <p>Sessão: {JSON.stringify(session)}</p>
            </div>
          )}

          {!qrCode && (
            <>
              <p>
                Quando terminar de usar, sempre desligue, ou teremos gasto de
                dinheiro a mais!{" "}
              </p>
              <div style={style.buttonContainer}>
                <button onClick={onLogout} style={style.logoutButton}>
                  Logout
                </button>
                <button
                  onClick={() => {
                    onShutdown();
                    onClose();
                  }}
                  style={style.shutdownButton}
                >
                  Desligar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const style = StyleSheet.create({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  panel: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    maxWidth: 500,
    width: "100%",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    color: Colors.text,
    padding: 0,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  qrContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  qrImage: {
    maxWidth: "100%",
    height: "auto",
    border: `1px solid ${Colors.border}`,
    borderRadius: 8,
  },
  connectedContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  disconnectedContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  statusText: {
    margin: 0,
    color: Colors.text,
  },
  successText: {
    margin: 0,
    color: Colors.success,
    fontSize: "1.1em",
    fontWeight: "bold",
  },
  userInfo: {
    margin: 0,
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  sessionInfo: {
    margin: 0,
    color: Colors.textLight,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "opacity 0.2s",
    flex: 1,
  },
  shutdownButton: {
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "opacity 0.2s",
    flex: 1,
  },
  buttonContainer: {
    display: "flex",
    gap: 12,
    marginTop: 8,
  },
});
