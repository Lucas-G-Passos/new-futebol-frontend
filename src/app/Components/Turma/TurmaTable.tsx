import { useEffect, useState } from "react";
import type { Turma, Aluno } from "../../Utils/Types";
import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";
import DetailsAluno from "../Search/DetailsAluno";

export default function TurmaTable({
  data,
  onEdit,
}: {
  data: { turmas: Turma[] };
  onEdit: () => Promise<any>;
}) {
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [expandedTurma, setExpandedTurma] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log(data);

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleTurmaExpansion = (codigoTurma: string) => {
    setExpandedTurma(expandedTurma === codigoTurma ? null : codigoTurma);
  };

  const handleAlunoClick = (aluno: Aluno) => {
    setSelectedAluno(aluno);
  };

  const handleCloseAlunoDetails = () => {
    setSelectedAluno(null);
  };

  const handleAlunoUpdate = () => {
    console.log("Aluno updated, refresh data if needed");
  };

  const formatDaysOfWeek = (days: string[]) => {
    const dayMap: { [key: string]: string } = {
      MONDAY: "Seg",
      TUESDAY: "Ter",
      WEDNESDAY: "Qua",
      THURSDAY: "Qui",
      FRIDAY: "Sex",
      SATURDAY: "Sáb",
      SUNDAY: "Dom",
    };

    return days.map((day) => dayMap[day] || day).join(", ");
  };

  const formatTime = (timeString: string) => {
    return timeString?.substring(0, 5) || "";
  };

  // Mobile card view
  const renderMobileView = () => {
    return (
      <div style={style.mobileContainer}>
        {data.turmas.map((turma) => (
          <div key={turma.codigoTurma} style={style.mobileCard}>
            {/* Turma Header */}
            <div style={style.mobileCardHeader}>
              <div style={style.mobileCardTitle}>
                <h3 style={style.mobileTurmaName}>{turma.nome}</h3>
                <div style={style.mobileTurmaCode}>{turma.codigoTurma}</div>
              </div>
              <button
                onClick={() => toggleTurmaExpansion(turma.codigoTurma!)}
                style={style.mobileToggleButton}
              >
                {expandedTurma === turma.codigoTurma ? "▲" : "▼"}
              </button>
            </div>

            {/* Turma Details */}
            <div style={style.mobileDetails}>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Descrição:</span>
                <span style={style.mobileValue}>
                  {turma.descricao || "N/A"}
                </span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Dias:</span>
                <span style={style.mobileValue}>
                  {turma.diaSemana ? formatDaysOfWeek(turma.diaSemana) : "N/A"}
                </span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Horário:</span>
                <span style={style.mobileValue}>
                  {turma.horaInicio && turma.horaTermino
                    ? `${formatTime(turma.horaInicio)} - ${formatTime(
                        turma.horaTermino
                      )}`
                    : "N/A"}
                </span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Local:</span>
                <span style={style.mobileValue}>{turma.local || "N/A"}</span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Alunos:</span>
                <span style={style.mobileValue}>
                  {turma.alunos?.length || 0} aluno(s)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={style.mobileActions}>
              <button onClick={onEdit} style={style.mobileEditButton}>
                Editar Turma
              </button>
            </div>

            {/* Expanded Alunos Section */}
            {expandedTurma === turma.codigoTurma &&
              turma.alunos &&
              turma.alunos.length > 0 && (
                <div style={style.mobileAlunosSection}>
                  <h4 style={style.mobileAlunosTitle}>Alunos</h4>
                  <div style={style.mobileAlunosList}>
                    {turma.alunos.map((aluno) => (
                      <div
                        key={aluno.id}
                        style={style.mobileAlunoCard}
                        onClick={() => handleAlunoClick(aluno)}
                      >
                        <div style={style.mobileAlunoAvatar}>
                          {aluno.nomeCompleto?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div style={style.mobileAlunoInfo}>
                          <div style={style.mobileAlunoName}>
                            {aluno.nomeCompleto}
                          </div>
                          <div style={style.mobileAlunoDetails}>
                            {aluno.colegio} • {aluno.colegioAno}
                          </div>
                          {aluno.telefone1 && (
                            <div style={style.mobileAlunoPhone}>
                              {aluno.telefone1}
                            </div>
                          )}
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
            <th style={style.th}>Código</th>
            <th style={style.th}>Nome</th>
            <th style={style.th}>Descrição</th>
            <th style={style.th}>Dias</th>
            <th style={style.th}>Horário</th>
            <th style={style.th}>Local</th>
            <th style={style.th}>Alunos</th>
            <th style={style.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.turmas.map((turma) => (
            <>
              <tr key={turma.codigoTurma} style={style.tableRow}>
                <td style={style.td}>{turma.codigoTurma}</td>
                <td style={style.td}>{turma.nome}</td>
                <td style={style.td}>{turma.descricao}</td>
                <td style={style.td}>
                  {turma.diaSemana ? formatDaysOfWeek(turma.diaSemana) : ""}
                </td>
                <td style={style.td}>
                  {turma.horaInicio && turma.horaTermino
                    ? `${formatTime(turma.horaInicio)} - ${formatTime(
                        turma.horaTermino
                      )}`
                    : ""}
                </td>
                <td style={style.td}>{turma.local}</td>
                <td style={style.td}>
                  <div style={style.alunosCell}>
                    <span style={style.alunoCount}>
                      {turma.alunos?.length || 0} aluno(s)
                    </span>
                    {turma.alunos && turma.alunos.length > 0 && (
                      <button
                        onClick={() => toggleTurmaExpansion(turma.codigoTurma!)}
                        style={style.toggleButton}
                      >
                        {expandedTurma === turma.codigoTurma ? "▲" : "▼"}
                      </button>
                    )}
                  </div>
                </td>
                <td style={style.td}>
                  <button onClick={onEdit} style={style.editButton}>
                    Editar
                  </button>
                </td>
              </tr>

              {expandedTurma === turma.codigoTurma &&
                turma.alunos &&
                turma.alunos.length > 0 && (
                  <tr style={style.expandedRow}>
                    <td colSpan={8} style={style.expandedCell}>
                      <div style={style.alunosContainer}>
                        <h4 style={style.alunosTitle}>Alunos da Turma</h4>
                        <div style={style.alunosGrid}>
                          {turma.alunos.map((aluno) => (
                            <div
                              key={aluno.id}
                              style={style.alunoCard}
                              onClick={() => handleAlunoClick(aluno)}
                            >
                              <div style={style.alunoAvatar}>
                                {aluno.nomeCompleto?.charAt(0).toUpperCase() ||
                                  "A"}
                              </div>
                              <div style={style.alunoInfo}>
                                <div style={style.alunoName}>
                                  {aluno.nomeCompleto}
                                </div>
                                <div style={style.alunoDetails}>
                                  {aluno.colegio} • {aluno.colegioAno}
                                </div>
                                {aluno.telefone1 && (
                                  <div style={style.alunoPhone}>
                                    {aluno.telefone1}
                                  </div>
                                )}
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
      {selectedAluno && (
        <DetailsAluno
          data={selectedAluno}
          close={handleCloseAlunoDetails}
          onUpdate={handleAlunoUpdate}
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
  alunosCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  alunoCount: {
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
  alunosContainer: {
    padding: "20px",
    backgroundColor: Colors.backgroundAlt,
    borderLeft: `4px solid ${Colors.primary}`,
  },
  alunosTitle: {
    margin: "0 0 16px 0",
    color: Colors.text,
    fontSize: "16px",
    fontWeight: "600",
  },
  alunosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "12px",
  },
  alunoCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: Colors.surfaceAlt,
      borderColor: Colors.primary,
      transform: "translateY(-2px)",
      boxShadow: `0 4px 12px rgba(250, 231, 77, 0.2)`,
    },
  },
  alunoAvatar: {
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
  alunoInfo: {
    flex: 1,
    minWidth: 0,
  },
  alunoName: {
    fontWeight: "600",
    color: Colors.text,
    fontSize: "14px",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  alunoDetails: {
    fontSize: "12px",
    color: Colors.textLight,
    marginBottom: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  alunoPhone: {
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
  mobileTurmaName: {
    margin: "0 0 4px 0",
    color: Colors.text,
    fontSize: "18px",
    fontWeight: "600",
  },
  mobileTurmaCode: {
    color: Colors.textLight,
    fontSize: "14px",
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
  mobileAlunosSection: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: `1px solid ${Colors.border}`,
  },
  mobileAlunosTitle: {
    margin: "0 0 12px 0",
    color: Colors.text,
    fontSize: "16px",
    fontWeight: "600",
  },
  mobileAlunosList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  mobileAlunoCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    backgroundColor: Colors.surfaceAlt,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  mobileAlunoAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: Colors.primary,
    color: Colors.black,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    marginRight: "12px",
    flexShrink: 0,
  },
  mobileAlunoInfo: {
    flex: 1,
    minWidth: 0,
  },
  mobileAlunoName: {
    fontWeight: "600",
    color: Colors.text,
    fontSize: "14px",
    marginBottom: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  mobileAlunoDetails: {
    fontSize: "12px",
    color: Colors.textLight,
    marginBottom: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  mobileAlunoPhone: {
    fontSize: "11px",
    color: Colors.textMuted,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});
