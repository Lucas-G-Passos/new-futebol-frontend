import { useState, useEffect, useMemo } from "react";
import PagamentoManual from "../Components/Pagamentos/pagManual";
import { StyleSheet } from "../Utils/Stylesheet";
import Colors from "../Utils/Colors";
import { type Aluno } from "../Utils/Types";
import AlunoTable from "../Components/Aluno/AlunoTable";
import AdicionarDivida from "../Components/Pagamentos/AdicionarDivida";
import Conciliacao from "../Components/Pagamentos/Conciliacao";

export default function Pagamentos() {
  const [showManual, setShowManual] = useState(false);
  const [showAddDivida, setShowAddDivida] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inadimplentes, setInadimplentes] = useState<Aluno[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);

  const fetchInadimplentes = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/alunos/inadimplentes`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        alert("Erro ao buscar inadimplentes");
        return;
      }
      const data = await response.json();
      console.log(data);
      setInadimplentes(data);
    } catch (error) {
      console.error("Erro ao buscar inadimplentes:", error);
      alert("Erro ao buscar inadimplentes");
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    fetchInadimplentes();

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const styles = isMobile ? mobileStyle : style;

  const totalValorDevido = useMemo(() => {
    return inadimplentes.reduce((total, aluno) => {
      return total + (aluno.valorDevido || 0);
    }, 0);
  }, [inadimplentes]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleShowManual = () => {
    setShowManual(!showManual);
    setShowAddDivida(false);
    setShowTable(false);
  };

  const handleShowAddDivida = () => {
    setShowAddDivida(!showAddDivida);
    setShowManual(false);
    setShowTable(false);
  };

  const handleShowTable = () => {
    setShowTable(!showTable);
    setShowManual(false);
    setShowAddDivida(false);
  };

  const renderContent = () => {
    if (showManual && !showAddDivida && !showTable) {
      return <PagamentoManual showClose={false} />;
    }

    if (!showManual && showAddDivida && !showTable) {
      return <AdicionarDivida showClose={false} />;
    }

    if (!showManual && !showAddDivida && showTable) {
      return (
        <div style={styles.tableSection}>
          <h2 style={styles.sectionTitle}>Alunos Inadimplentes</h2>
          <AlunoTable data={inadimplentes} onUpdate={fetchInadimplentes} />
        </div>
      );
    }

    if (!showManual && !showAddDivida && !showTable) {
      return (
        <div>
          <Conciliacao />
        </div>
      );
    }

    return null;
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>Pagamentos</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={styles.toggleButton} onClick={handleShowManual}>
            {showManual ? "Fechar" : "Pagamento manual"}
          </button>
          <button style={styles.toggleButton} onClick={handleShowAddDivida}>
            {showAddDivida ? "Fechar" : "Adicionar Dívida"}
          </button>
          <button style={styles.toggleButton} onClick={handleShowTable}>
            {showTable ? "Fechar" : "Inadimplentes"}
          </button>
        </div>
      </div>

      {inadimplentes.length > 0 && (
        <div style={styles.totalCard}>
          <div style={styles.totalCardIcon}>💰</div>
          <div style={styles.totalCardContent}>
            <div style={styles.totalCardLabel}>Valor Devido Total</div>
            <div style={styles.totalCardValue}>
              {formatCurrency(totalValorDevido)}
            </div>
            <div style={styles.totalCardSubtext}>
              {inadimplentes.length} {inadimplentes.length === 1 ? "aluno inadimplente" : "alunos inadimplentes"}
            </div>
          </div>
        </div>
      )}

      {renderContent()}
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
  totalCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "24px",
    backgroundColor: Colors.surfaceAlt,
    border: `2px solid ${Colors.border}`,
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  totalCardIcon: {
    fontSize: "48px",
    lineHeight: 1,
  },
  totalCardContent: {
    flex: 1,
  },
  totalCardLabel: {
    color: Colors.textMuted,
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },
  totalCardValue: {
    color: Colors.error,
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "4px",
  },
  totalCardSubtext: {
    color: Colors.textMuted,
    fontSize: "14px",
  },
  tableSection: {
    marginTop: "30px",
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
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
  totalCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    backgroundColor: Colors.surfaceAlt,
    border: `2px solid ${Colors.border}`,
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  totalCardIcon: {
    fontSize: "36px",
    lineHeight: 1,
  },
  totalCardContent: {
    flex: 1,
  },
  totalCardLabel: {
    color: Colors.textMuted,
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
  },
  totalCardValue: {
    color: Colors.error,
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "4px",
  },
  totalCardSubtext: {
    color: Colors.textMuted,
    fontSize: "12px",
  },
  tableSection: {
    marginTop: "24px",
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
  },
});
