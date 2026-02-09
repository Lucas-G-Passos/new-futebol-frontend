import { useState, useEffect } from "react";
import { WhatsappLogoIcon } from "@phosphor-icons/react";
import { useAuth } from "../../Context/AuthContext";
import type { User, SessionDto } from "../../Utils/Types";
import { WhatsAppSessionPanel } from "./WhatsAppSessionPanel";
import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";

const hasPermission = (
  user: User | null,
  requiredPermission?: string,
): boolean => {
  if (!requiredPermission) return true;
  if (!user) return false;
  if (user.permissions.some((p) => p.permission === "ADMIN")) return true;
  return user.permissions.some((p) => p.permission === requiredPermission);
};

export function WhatsAppManager() {
  const { user } = useAuth();
  const [whatsappStatusOpen, setWhatsappStatusOpen] = useState(false);
  const [whatsappSession, setWhatsappSession] = useState<SessionDto | null>(
    null,
  );
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false);

  const handleShowWhatsappStatus = async () => {
    if (!hasPermission(user, "WHATSAPP")) {
      return;
    }
    const newState = !whatsappStatusOpen;
    setWhatsappStatusOpen(newState);
    if (newState) {
      await getWhatsappStatus();
    }
  };

  const formatBRPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");

    const normalized = digits.startsWith("55") ? digits.slice(2) : digits;

    if (normalized.length !== 11) return value;

    const ddd = normalized.slice(0, 2);
    const first = normalized.slice(2, 7);
    const last = normalized.slice(7);

    return `(${ddd}) ${first}-${last}`;
  };

  const refreshWhatsappStatus = async () => {
    setWhatsappStatusOpen(true);
    await getWhatsappStatus();
  };

  const getWhatsappStatus = async () => {
    if (!hasPermission(user, "WHATSAPP")) {
      return;
    }
    setLoadingWhatsapp(true);
    try {
      // First, start the session
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/whatsapp/session/start`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      // Then get the session status
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/whatsapp/sessions`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const sessionData: SessionDto = await response.json();
        setWhatsappSession(sessionData);

        // If me is null, fetch the QR code
        if (sessionData.me === null) {
          await fetchQrCode();
        }
      }
    } catch (error) {
      console.error("Error fetching WhatsApp status:", error);
    } finally {
      setLoadingWhatsapp(false);
    }
  };

  const fetchQrCode = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/whatsapp/auth/qr`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setQrCodeImage(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  };

  const handleWhatsappLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/whatsapp/sessions/logout`,
        {
          credentials: "include",
          method: "POST",
        },
      );

      if (response.ok) {
        refreshWhatsappStatus();
      }
    } catch (error) {
      console.error("Error on logout:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (qrCodeImage) {
        URL.revokeObjectURL(qrCodeImage);
      }
    };
  }, [qrCodeImage]);


  useEffect(() => {
    if (!qrCodeImage || !whatsappSession || whatsappSession.me !== null) {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/whatsapp/sessions`,
          {
            credentials: "include",
          },
        );

        if (response.ok) {
          const sessionData: SessionDto = await response.json();
          setWhatsappSession(sessionData);

          // Stop polling if session is authenticated
          if (sessionData.me !== null) {
            clearInterval(pollInterval);
            setQrCodeImage(null); // Clear QR code
          }
        }
      } catch (error) {
        console.error("Error polling session status:", error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [qrCodeImage, whatsappSession]);

  useEffect(()=>{},[])

  if (!hasPermission(user, "WHATSAPP")) {
    return null;
  }

  return (
    <>
      <div onClick={handleShowWhatsappStatus} style={style.whatsappButton}>
        <WhatsappLogoIcon size={32} />
      </div>
      {whatsappStatusOpen && whatsappSession && (
        <WhatsAppSessionPanel
          session={whatsappSession}
          qrCode={qrCodeImage}
          onLogout={handleWhatsappLogout}
          onClose={() => setWhatsappStatusOpen(false)}
          loading={loadingWhatsapp}
          formatPhone={formatBRPhone}
        />
      )}
    </>
  );
}

const style = StyleSheet.create({
  whatsappButton: {
    color: "#10b981",
  },
});
