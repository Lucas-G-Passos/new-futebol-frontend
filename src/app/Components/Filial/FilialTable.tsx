import { useEffect, useState } from "react";
import type { Filial } from "../../Utils/Types";
import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";

export default function FilialTable({
  data,
  onEdit,
}: {
  data: { filiais: Filial[] };
  onEdit: (formData: Record<string, any>) => Promise<any> | void;
}) {
  const [expandedFilial, setExpandedFilial] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleFilialExpansion = (id: number) => {
    setExpandedFilial(expandedFilial === id ? null : id);
  };

  const handleEditFilial = (filial: Filial) => {
    const formData = {
      id: filial.id,
      nome: filial.nome,
      cep: filial.cep,
      rua: filial.rua,
      enderecoNumero: filial.enderecoNumero,
      cidade: filial.cidade,
      estado: filial.estado,
    };

    onEdit(formData);
  };

  const renderMobileView = () => {
    return (
      <div style={style.mobileContainer}>
        {data.filiais.map((filial) => (
          <div key={filial.id} style={style.mobileCard}>
            {/* Filial Header */}
            <div style={style.mobileCardHeader}>
              <div style={style.mobileCardTitle}>
                <h3 style={style.mobileFilialName}>{filial.nome}</h3>
              </div>
              <button
                onClick={() => toggleFilialExpansion(filial.id)}
                style={style.mobileToggleButton}
              >
                {expandedFilial === filial.id ? "▲" : "▼"}
              </button>
            </div>

            {/* Filial Details */}
            <div style={style.mobileDetails}>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>CEP:</span>
                <span style={style.mobileValue}>{filial.cep || "N/A"}</span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Rua:</span>
                <span style={style.mobileValue}>{filial.rua || "N/A"}</span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Número:</span>
                <span style={style.mobileValue}>
                  {filial.enderecoNumero || "N/A"}
                </span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Cidade:</span>
                <span style={style.mobileValue}>{filial.cidade || "N/A"}</span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Estado:</span>
                <span style={style.mobileValue}>{filial.estado || "N/A"}</span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Turmas:</span>
                <span style={style.mobileValue}>
                  {filial.turmas?.length || 0} turma(s)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={style.mobileActions}>
              <button
                onClick={() => handleEditFilial(filial)}
                style={style.mobileEditButton}
              >
                Editar Filial
              </button>
            </div>

            {/* Expanded Turmas Section */}
            {expandedFilial === filial.id &&
              filial.turmas &&
              filial.turmas.length > 0 && (
                <div style={style.mobileTurmasSection}>
                  <h4 style={style.mobileTurmasTitle}>Turmas</h4>
                  <div style={style.mobileTurmasList}>
                    {filial.turmas.map((turma) => (
                      <div key={turma.id} style={style.mobileTurmaCard}>
                        <div style={style.mobileTurmaInfo}>
                          <div style={style.mobileTurmaName}>{turma.nome}</div>
                          <div style={style.mobileTurmaDetails}>
                            {turma.codigoTurma} • {turma.local}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    );
  };

  // Desktop table view
  const renderDesktopView = () => {
    return (
      <table style={style.table}>
        <thead>
          <tr style={style.headerRow}>
            <th style={style.th}>Nome</th>
            <th style={style.th}>CEP</th>
            <th style={style.th}>Rua</th>
            <th style={style.th}>Número</th>
            <th style={style.th}>Cidade</th>
            <th style={style.th}>Estado</th>
            <th style={style.th}>Turmas</th>
            <th style={style.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.filiais.map((filial) => (
            <>
              <tr key={filial.id} style={style.tableRow}>
                <td style={style.td}>{filial.nome}</td>
                <td style={style.td}>{filial.cep}</td>
                <td style={style.td}>{filial.rua}</td>
                <td style={style.td}>{filial.enderecoNumero}</td>
                <td style={style.td}>{filial.cidade}</td>
                <td style={style.td}>{filial.estado}</td>
                <td style={style.td}>
                  <div style={style.turmasCell}>
                    <span style={style.turmaCount}>
                      {filial.turmas?.length || 0} turma(s)
                    </span>
                    {filial.turmas && filial.turmas.length > 0 && (
                      <button
                        onClick={() => toggleFilialExpansion(filial.id)}
                        style={style.toggleButton}
                      >
                        {expandedFilial === filial.id ? "▲" : "▼"}
                      </button>
                    )}
                  </div>
                </td>
                <td style={style.td}>
                  <button
                    onClick={() => handleEditFilial(filial)}
                    style={style.editButton}
                  >
                    Editar
                  </button>
                </td>
              </tr>

              {expandedFilial === filial.id &&
                filial.turmas &&
                filial.turmas.length > 0 && (
                  <tr style={style.expandedRow}>
                    <td colSpan={8} style={style.expandedCell}>
                      <div style={style.turmasContainer}>
                        <h4 style={style.turmasTitle}>Turmas da Filial</h4>
                        <div style={style.turmasGrid}>
                          {filial.turmas.map((turma) => (
                            <div key={turma.id} style={style.turmaCard}>
                              <div style={style.turmaAvatar}>
                                {turma.nome?.charAt(0).toUpperCase() || "T"}
                              </div>
                              <div style={style.turmaInfo}>
                                <div style={style.turmaName}>{turma.nome}</div>
                                <div style={style.turmaDetails}>
                                  {turma.codigoTurma}
                                </div>
                                <div style={style.turmaLocal}>
                                  {turma.local}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
            </>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={style.mainContainer}>
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
    ":hover": {
      backgroundColor: Colors.surfaceAlt,
    },
  },
  expandedRow: {
    backgroundColor: Colors.backgroundAlt,
    borderBottom: `2px solid ${Colors.borderDark}`,
  },
  expandedCell: {
    padding: "0",
    borderBottom: `1px solid ${Colors.border}`,
  },
  td: {
    padding: "12px 16px",
    borderBottom: `1px solid ${Colors.border}`,
    color: Colors.text,
  },
  editButton: {
    padding: "6px 12px",
    backgroundColor: Colors.primary,
    color: Colors.black,
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#45a049",
      transform: "translateY(-1px)",
    },
  },
  turmasCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  turmaCount: {
    fontSize: "14px",
    color: Colors.textLight,
  },
  toggleButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: Colors.secondary,
    padding: "4px",
    transition: "color 0.2s ease",
    ":hover": {
      color: Colors.secondaryLight,
    },
  },
  turmasContainer: {
    padding: "20px",
    backgroundColor: Colors.backgroundAlt,
    borderLeft: `4px solid ${Colors.primary}`,
  },
  turmasTitle: {
    margin: "0 0 16px 0",
    color: Colors.text,
    fontSize: "16px",
    fontWeight: "600",
  },
  turmasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "12px",
  },
  turmaCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: Colors.surfaceAlt,
      borderColor: Colors.primary,
      transform: "translateY(-2px)",
      boxShadow: `0 4px 12px rgba(250, 231, 77, 0.2)`,
    },
  },
  turmaAvatar: {
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
    marginRight: "12px",
    flexShrink: 0,
  },
  turmaInfo: {
    flex: 1,
    minWidth: 0,
  },
  turmaName: {
    fontWeight: "600",
    color: Colors.text,
    fontSize: "14px",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  turmaDetails: {
    fontSize: "12px",
    color: Colors.textLight,
    marginBottom: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  turmaLocal: {
    fontSize: "11px",
    color: Colors.textMuted,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
  },
  mobileCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  mobileCardTitle: {
    flex: 1,
  },
  mobileFilialName: {
    margin: "0 0 4px 0",
    color: Colors.text,
    fontSize: "18px",
    fontWeight: "600",
  },
  mobileToggleButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    color: Colors.secondary,
    padding: "8px",
    margin: "-8px",
  },
  mobileDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
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
    minWidth: "80px",
  },
  mobileValue: {
    color: Colors.text,
    fontSize: "14px",
    textAlign: "right",
    flex: 1,
    wordBreak: "break-word",
  },
  mobileActions: {
    display: "flex",
    justifyContent: "center",
  },
  mobileEditButton: {
    padding: "10px 20px",
    backgroundColor: Colors.success,
    color: Colors.black,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    width: "100%",
    maxWidth: "200px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#45a049",
    },
  },
  mobileTurmasSection: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: `1px solid ${Colors.border}`,
  },
  mobileTurmasTitle: {
    margin: "0 0 12px 0",
    color: Colors.text,
    fontSize: "16px",
    fontWeight: "600",
  },
  mobileTurmasList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  mobileTurmaCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    backgroundColor: Colors.surfaceAlt,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
  },
  mobileTurmaInfo: {
    flex: 1,
    minWidth: 0,
  },
  mobileTurmaName: {
    fontWeight: "600",
    color: Colors.text,
    fontSize: "14px",
    marginBottom: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  mobileTurmaDetails: {
    fontSize: "12px",
    color: Colors.textLight,
    marginBottom: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});
