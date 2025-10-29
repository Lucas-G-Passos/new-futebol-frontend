import { useState, useEffect } from "react";
import PagamentoManual from "../Components/Pagamentos/pagManual";
import { StyleSheet } from "../Utils/Stylesheet";
import Colors from "../Utils/Colors";

export default function Pagamentos() {
  const [showManual, setShowManual] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const styles = isMobile ? mobileStyle : style;

  return (
    <div style={styles.mainContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>Pagamentos</h1>
        <button
          style={styles.toggleButton}
          onClick={() => setShowManual(!showManual)}
        >
          {showManual
            ? isMobile
              ? "Ocultar"
              : "Ocultar Pagamento Manual"
            : isMobile
            ? "Pagar"
            : "Realizar Pagamento Manual"}
        </button>
      </div>
      {showManual && <PagamentoManual showClose={false} />}
    </div>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    color: Colors.text,
    margin: 0,
  },
  toggleButton: {
    padding: "10px 20px",
    backgroundColor: Colors.primary,
    color: Colors.black,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "background-color 0.2s",
  },
});

const mobileStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: "12px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "10px",
  },
  title: {
    color: Colors.text,
    margin: 0,
    fontSize: "22px",
  },
  toggleButton: {
    padding: "8px 16px",
    backgroundColor: Colors.primary,
    color: Colors.black,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
});
