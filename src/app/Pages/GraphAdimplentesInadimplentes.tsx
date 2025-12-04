import { useEffect, useState } from "react";
import type { DashBoard } from "../Utils/Types";
import Colors from "../Utils/Colors";
import { StyleSheet } from "../Utils/Stylesheet";

export default function GraphAdimplentesInadimplentes({
  data,
}: {
  data: DashBoard;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalAlunos = data.adimplentes + data.inadimplentes;
  const adimplentePercentage =
    totalAlunos > 0 ? (data.adimplentes / totalAlunos) * 100 : 0;
  const inadimplentePercentage =
    totalAlunos > 0 ? (data.inadimplentes / totalAlunos) * 100 : 0;

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Alunos por Status de Pagamento</h2>
        <div style={styles.statusBadge}>
          <span
            style={{
              ...styles.statusText,
              color: adimplentePercentage >= 50 ? Colors.success : Colors.error,
            }}
          >
            {adimplentePercentage.toFixed(1)}% adimplente
          </span>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <div style={styles.barGroup}>
          <div style={styles.barLabel}>
            <span style={styles.barLabelText}>Adimplentes</span>
            <span style={styles.barValue}>
              {data.adimplentes} {data.adimplentes === 1 ? "aluno" : "alunos"}
            </span>
          </div>
          <div style={styles.barBackground}>
            <div
              style={{
                ...styles.barFill,
                width: `${adimplentePercentage}%`,
                backgroundColor: Colors.success,
              }}
            >
              <span style={styles.barPercentage}>
                {adimplentePercentage.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div style={styles.barGroup}>
          <div style={styles.barLabel}>
            <span style={styles.barLabelText}>Inadimplentes</span>
            <span style={styles.barValue}>
              {data.inadimplentes} {data.inadimplentes === 1 ? "aluno" : "alunos"}
            </span>
          </div>
          <div style={styles.barBackground}>
            <div
              style={{
                ...styles.barFill,
                width: `${inadimplentePercentage}%`,
                backgroundColor: Colors.error,
              }}
            >
              <span style={styles.barPercentage}>
                {inadimplentePercentage.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total de Alunos</span>
          <span style={styles.summaryValue}>{totalAlunos}</span>
        </div>
      </div>
    </div>
  );
}

const desktopStyles = StyleSheet.create({
  container: {
    padding: "24px",
    backgroundColor: Colors.surfaceAlt,
    border: `2px solid ${Colors.border}`,
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    color: Colors.text,
    fontSize: "20px",
    fontWeight: "600",
    margin: 0,
  },
  statusBadge: {
    padding: "6px 12px",
    backgroundColor: Colors.surface,
    borderRadius: "8px",
    border: `1px solid ${Colors.border}`,
  },
  statusText: {
    fontSize: "16px",
    fontWeight: "700",
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  barGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  barLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barLabelText: {
    color: Colors.text,
    fontSize: "16px",
    fontWeight: "500",
  },
  barValue: {
    color: Colors.textLight,
    fontSize: "18px",
    fontWeight: "700",
  },
  barBackground: {
    width: "100%",
    height: "48px",
    backgroundColor: Colors.surface,
    borderRadius: "8px",
    overflow: "hidden",
    border: `1px solid ${Colors.border}`,
    position: "relative",
  },
  barFill: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: "12px",
    transition: "width 0.6s ease-out",
    minWidth: "60px",
  },
  barPercentage: {
    color: Colors.white,
    fontSize: "14px",
    fontWeight: "700",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
    padding: 6,
  },
  footer: {
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "center",
  },
  summaryItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  summaryValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: Colors.text,
  },
});

const mobileStyles = StyleSheet.create({
  container: {
    padding: "16px",
    backgroundColor: Colors.surfaceAlt,
    border: `2px solid ${Colors.border}`,
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "8px",
  },
  title: {
    color: Colors.text,
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },
  statusBadge: {
    padding: "4px 10px",
    backgroundColor: Colors.surface,
    borderRadius: "6px",
    border: `1px solid ${Colors.border}`,
  },
  statusText: {
    fontSize: "14px",
    fontWeight: "700",
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  barGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  barLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barLabelText: {
    color: Colors.text,
    fontSize: "14px",
    fontWeight: "500",
  },
  barValue: {
    color: Colors.textLight,
    fontSize: "16px",
    fontWeight: "700",
  },
  barBackground: {
    width: "100%",
    height: "40px",
    backgroundColor: Colors.surface,
    borderRadius: "6px",
    overflow: "hidden",
    border: `1px solid ${Colors.border}`,
    position: "relative",
  },
  barFill: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: "10px",
    transition: "width 0.6s ease-out",
    minWidth: "50px",
  },
  barPercentage: {
    color: Colors.white,
    fontSize: "12px",
    fontWeight: "700",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
  },
  footer: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "center",
  },
  summaryItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  summaryValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: Colors.text,
  },
});
