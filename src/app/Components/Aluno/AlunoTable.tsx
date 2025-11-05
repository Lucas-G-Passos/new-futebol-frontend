import { useEffect, useState } from "react";
import type { Aluno } from "../../Utils/Types";
import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";
import DetailsAluno from "../Search/DetailsAluno";

export default function AlunoTable({
  data,
  onClick,
  onUpdate,
}: {
  data: Aluno[];
  onClick?: (aluno: Aluno) => void;
  onUpdate?: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const isAdimplente = (valorDevido: number) => {
    return valorDevido === 0;
  };

  const handleAlunoClick = (aluno: Aluno) => {
    if (onClick) {
      onClick(aluno);
    } else {
      setSelectedAluno(aluno);
    }
  };

  const handleCloseDetails = () => {
    setSelectedAluno(null);
  };

  const handleUpdate = () => {
    setSelectedAluno(null);
    if (onUpdate) {
      onUpdate();
    }
  };

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div style={style.emptyStateContainer}>
        <div style={style.emptyStateIcon}>👤</div>
        <h3 style={style.emptyStateTitle}>Nenhum aluno encontrado</h3>
        <p style={style.emptyStateText}>
          Não há alunos para exibir no momento.
        </p>
      </div>
    );
  }

  const renderMobileView = () => {
    return (
      <div style={style.mobileContainer}>
        {data.map((aluno) => (
          <div
            key={aluno.id}
            style={style.mobileCard}
            onClick={() => handleAlunoClick(aluno)}
          >
            {/* Aluno Header */}
            <div style={style.mobileCardHeader}>
              <div style={style.mobileCardTitle}>
                {aluno.url ? (
                  <img
                    src={aluno.url}
                    style={style.mobileAvatar}
                    alt={aluno.nomeCompleto}
                  />
                ) : (
                  <div style={style.mobileAvatarPlaceholder}>
                    {aluno.nomeCompleto?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
                <div>
                  <h3 style={style.mobileAlunoName}>{aluno.nomeCompleto}</h3>
                  <div style={style.mobileAlunoSubtitle}>
                    {aluno.turmaNome || "Sem turma"}
                  </div>
                </div>
              </div>
              <div
                style={{
                  ...style.adimplenteTag,
                  backgroundColor: isAdimplente(aluno.valorDevido)
                    ? Colors.success
                    : Colors.error,
                }}
              >
                {isAdimplente(aluno.valorDevido)
                  ? "Adimplente"
                  : "Inadimplente"}
              </div>
            </div>

            {/* Aluno Details */}
            <div style={style.mobileDetails}>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>CPF:</span>
                <span style={style.mobileValue}>{aluno.cpf || "N/A"}</span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Telefone:</span>
                <span style={style.mobileValue}>
                  {aluno.telefone1 || "N/A"}
                </span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Colégio:</span>
                <span style={style.mobileValue}>
                  {aluno.colegio || "N/A"} - {aluno.colegioAno || "N/A"}
                </span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Data Matrícula:</span>
                <span style={style.mobileValue}>
                  {formatDate(aluno.dataMatricula)}
                </span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Valor Devido:</span>
                <span
                  style={{
                    ...style.mobileValue,
                    color: isAdimplente(aluno.valorDevido)
                      ? Colors.success
                      : Colors.error,
                    fontWeight: "600",
                  }}
                >
                  {formatCurrency(aluno.valorDevido)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDesktopView = () => {
    return (
      <table style={style.table}>
        <thead>
          <tr style={style.headerRow}>
            <th style={style.th}>Foto</th>
            <th style={style.th}>Nome</th>
            <th style={style.th}>Status</th>
            <th style={style.th}>CPF</th>
            <th style={style.th}>Telefone</th>
            <th style={style.th}>Colégio</th>
            <th style={style.th}>Turma</th>
            <th style={style.th}>Data Matrícula</th>
            <th style={style.th}>Valor Devido</th>
          </tr>
        </thead>
        <tbody>
          {data.map((aluno) => (
            <tr
              key={aluno.id}
              style={style.tableRow}
              onClick={() => handleAlunoClick(aluno)}
            >
              <td style={style.td}>
                {aluno.url ? (
                  <img
                    src={aluno.url}
                    style={style.avatar}
                    alt={aluno.nomeCompleto}
                  />
                ) : (
                  <div style={style.avatarPlaceholder}>
                    {aluno.nomeCompleto?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
              </td>
              <td style={style.td}>{aluno.nomeCompleto}</td>
              <td style={style.td}>
                <span
                  style={{
                    ...style.statusBadge,
                    backgroundColor: isAdimplente(aluno.valorDevido)
                      ? Colors.success
                      : Colors.error,
                  }}
                >
                  {isAdimplente(aluno.valorDevido)
                    ? "Adimplente"
                    : "Inadimplente"}
                </span>
              </td>
              <td style={style.td}>{aluno.cpf}</td>
              <td style={style.td}>{aluno.telefone1}</td>
              <td style={style.td}>
                {aluno.colegio || "N/A"}
                {aluno.colegioAno && ` - ${aluno.colegioAno}`}
              </td>
              <td style={style.td}>{aluno.turmaNome || "Sem turma"}</td>
              <td style={style.td}>{formatDate(aluno.dataMatricula)}</td>
              <td style={style.td}>
                <span
                  style={{
                    color: isAdimplente(aluno.valorDevido)
                      ? Colors.success
                      : Colors.error,
                    fontWeight: "600",
                  }}
                >
                  {formatCurrency(aluno.valorDevido)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={style.mainContainer}>
      {selectedAluno && (
        <DetailsAluno
          data={selectedAluno}
          close={handleCloseDetails}
          onUpdate={handleUpdate}
        />
      )}
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: "16px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: Colors.background,
    color: Colors.text,
    minHeight: "100vh",
  },

  // Empty State Styles
  emptyStateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center",
    backgroundColor: Colors.surface,
    borderRadius: "12px",
    border: `1px solid ${Colors.border}`,
    margin: "20px auto",
    maxWidth: "500px",
  },
  emptyStateIcon: {
    fontSize: "64px",
    marginBottom: "20px",
    opacity: 0.5,
  },
  emptyStateTitle: {
    color: Colors.text,
    fontSize: "24px",
    fontWeight: "600",
    margin: "0 0 12px 0",
  },
  emptyStateText: {
    color: Colors.textMuted,
    fontSize: "16px",
    margin: 0,
    lineHeight: "1.5",
  },

  // Desktop Table Styles
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.border}`,
  },
  headerRow: {
    backgroundColor: Colors.surfaceAlt,
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: `2px solid ${Colors.borderDark}`,
    backgroundColor: Colors.primary,
    color: Colors.black,
  },
  tableRow: {
    borderBottom: `1px solid ${Colors.border}`,
    transition: "background-color 0.2s",
    cursor: "pointer",
    ":hover": {
      backgroundColor: Colors.surfaceAlt,
    },
  },
  td: {
    padding: "12px 16px",
    borderBottom: `1px solid ${Colors.border}`,
    color: Colors.text,
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: `2px solid ${Colors.primary}`,
  },
  avatarPlaceholder: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: Colors.primary,
    color: Colors.black,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    color: "white",
    display: "inline-block",
  },

  // Mobile Styles
  mobileContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  mobileCard: {
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.border}`,
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    },
  },
  mobileCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  mobileCardTitle: {
    flex: 1,
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  mobileAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    border: `2px solid ${Colors.primary}`,
  },
  mobileAvatarPlaceholder: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: Colors.primary,
    color: Colors.black,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
    flexShrink: 0,
  },
  mobileAlunoName: {
    margin: "0 0 4px 0",
    color: Colors.text,
    fontSize: "18px",
    fontWeight: "600",
  },
  mobileAlunoSubtitle: {
    color: Colors.textLight,
    fontSize: "14px",
  },
  adimplenteTag: {
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    color: "white",
    whiteSpace: "nowrap",
  },
  mobileDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  mobileDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  mobileLabel: {
    color: Colors.textLight,
    fontSize: "14px",
    fontWeight: "500",
    minWidth: "100px",
  },
  mobileValue: {
    color: Colors.text,
    fontSize: "14px",
    textAlign: "right",
    flex: 1,
    wordBreak: "break-word",
  },
});
