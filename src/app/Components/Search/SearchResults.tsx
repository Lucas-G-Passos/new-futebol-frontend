import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";

type SearchResultsProps = {
  data: any[];
  onClick: (item: any) => void;
  type?: "ALUNO" | "FUNCIONARIO";
};

// Helper function to format grade
const formatGrade = (grade: string): string => {
  if (!grade) return "";

  // Remove any non-alphanumeric characters and convert to lowercase
  const cleanGrade = grade.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // Match patterns like "5ano", "5 ano", "5° ano", "5 series", etc.
  const gradeMatch = cleanGrade.match(/^(\d+)(?:ano|series?)?$/);
  if (gradeMatch) {
    const gradeNumber = gradeMatch[1];
    return `${gradeNumber}° Ano`;
  }

  // If it doesn't match expected patterns, return the original with proper formatting
  return grade.replace(/(\d+)/, "$1°").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper function to format phone numbers
const formatPhone = (phone: string): string => {
  if (!phone) return "";

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Format based on length
  if (cleanPhone.length === 10) {
    // (99) 9999-9999
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (cleanPhone.length === 11) {
    // (99) 99999-9999
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleanPhone.length === 8) {
    // 9999-9999
    return cleanPhone.replace(/(\d{4})(\d{4})/, "$1-$2");
  } else if (cleanPhone.length === 9) {
    // 99999-9999
    return cleanPhone.replace(/(\d{5})(\d{4})/, "$1-$2");
  }

  // Return original if doesn't match expected patterns
  return phone;
};

// Helper function to format CPF
const formatCPF = (cpf: string): string => {
  if (!cpf) return "";

  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length === 11) {
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return cpf;
};

// Helper function to format RG
const formatRG = (rg: string): string => {
  if (!rg) return "";

  const cleanRG = rg.replace(/\D/g, "");

  if (cleanRG.length === 9) {
    return cleanRG.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
  }

  return rg;
};

export default function SearchResults({
  data,
  onClick,
  type = "ALUNO",
}: SearchResultsProps) {
  if (!data || data.length === 0) {
    return (
      <div style={style.emptyState}>
        <div style={style.emptyIcon}>🔍</div>
        <p style={style.emptyText}>Nenhum resultado encontrado</p>
      </div>
    );
  }

  const isFuncionario = type === "FUNCIONARIO";
  const entityName = isFuncionario ? "funcionário" : "aluno";
  const entityNamePlural = isFuncionario ? "funcionários" : "alunos";

  return (
    <div style={style.container}>
      <div style={style.header}>
        <h3 style={style.title}>Resultados da Busca</h3>
        <div style={style.count}>
          {data.length}{" "}
          {data.length === 1
            ? `${entityName} encontrado`
            : `${entityNamePlural} encontrados`}
        </div>
      </div>

      <div style={style.resultsList}>
        {data.map((item) => (
          <div
            key={item.id}
            style={style.resultCard}
            onClick={() => {
              onClick(item);
            }}
            className="result-card"
          >
            {isFuncionario ? (
              // FUNCIONARIO CARD LAYOUT
              <>
                <div style={style.cardHeader}>
                  <div style={style.avatar}>{item.nome?.charAt(0) || "F"}</div>
                  <div style={style.studentInfo}>
                    <div style={style.studentName}>
                      {item.nome || "Nome não informado"}
                    </div>
                    <div style={style.studentDetails}>
                      {item.dataNascimento && (
                        <span style={style.detailItem}>
                          Nascimento:{" "}
                          {new Date(item.dataNascimento).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      )}
                      {item.dataAdmissao && (
                        <span style={style.detailItem}>
                          Admissão:{" "}
                          {new Date(item.dataAdmissao).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      )}
                      {item.situacao && (
                        <span
                          style={{
                            ...style.detailItem,
                            backgroundColor:
                              item.situacao === "OK"
                                ? Colors.success
                                : Colors.warning,
                            border: `1px solid ${
                              item.situacao === "OK"
                                ? Colors.success
                                : Colors.warning
                            }`,
                          }}
                        >
                          {item.situacao}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={style.cardContent}>
                  {item.user && (
                    <div style={style.responsibleInfo}>
                      <div style={style.responsibleLabel}>Usuário</div>
                      <div style={style.responsibleName}>
                        {item.user.username}
                      </div>
                      {item.user.email && (
                        <div style={style.responsibleContact}>
                          📧 {item.user.email}
                        </div>
                      )}
                      {item.user.permissions && (
                        <div style={style.responsibleContact}>
                          🛡️ {item.user.permissions.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={style.additionalInfo}>
                    {item.cpf && (
                      <div style={style.infoItem}>
                        <span style={style.infoLabel}>CPF:</span>
                        <span style={style.infoValue}>
                          {formatCPF(item.cpf)}
                        </span>
                      </div>
                    )}
                    {item.rg && (
                      <div style={style.infoItem}>
                        <span style={style.infoLabel}>RG:</span>
                        <span style={style.infoValue}>{formatRG(item.rg)}</span>
                      </div>
                    )}
                    {item.telefone1 && (
                      <div style={style.infoItem}>
                        <span style={style.infoLabel}>Telefone:</span>
                        <span style={style.infoValue}>
                          {formatPhone(item.telefone1)}
                        </span>
                      </div>
                    )}
                    {item.telefone2 && (
                      <div style={style.infoItem}>
                        <span style={style.infoLabel}>Telefone 2:</span>
                        <span style={style.infoValue}>
                          {formatPhone(item.telefone2)}
                        </span>
                      </div>
                    )}
                    {item.jornadaEscala && (
                      <div style={style.infoItem}>
                        <span style={style.infoLabel}>Jornada:</span>
                        <span style={style.infoValue}>
                          {item.jornadaEscala}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // ALUNO CARD LAYOUT (original)
              <>
                <div style={style.cardHeader}>
                  <div style={style.avatar}>
                    {item.nomeCompleto?.charAt(0) || "A"}
                  </div>
                  <div style={style.studentInfo}>
                    <div style={style.studentName}>
                      {item.nomeCompleto || "Nome não informado"}
                    </div>
                    <div style={style.studentDetails}>
                      {item.dataNascimento && (
                        <span style={style.detailItem}>
                          Nascimento:{" "}
                          {new Date(item.dataNascimento).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      )}
                      {item.colegioAno && (
                        <span style={style.detailItem}>
                          Série: {formatGrade(item.colegioAno)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={style.cardContent}>
                  {item.responsavel && (
                    <div style={style.responsibleInfo}>
                      <div style={style.responsibleLabel}>Responsável</div>
                      <div style={style.responsibleName}>
                        {item.responsavel.nomeCompleto}
                      </div>
                      {item.responsavel.telefone1 && (
                        <div style={style.responsibleContact}>
                          📞 {formatPhone(item.responsavel.telefone1)}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={style.additionalInfo}>
                    {item.colegio && (
                      <div style={style.infoItem}>
                        <span style={style.infoLabel}>Colégio:</span>
                        <span style={style.infoValue}>{item.colegio}</span>
                      </div>
                    )}
                    {item.telefone1 && (
                      <div style={style.infoItem}>
                        <span style={style.infoLabel}>Telefone:</span>
                        <span style={style.infoValue}>
                          {formatPhone(item.telefone1)}
                        </span>
                      </div>
                    )}
                    {item.telefone2 && (
                      <div style={style.infoItem}>
                        <span style={style.infoLabel}>Telefone 2:</span>
                        <span style={style.infoValue}>
                          {formatPhone(item.telefone2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div style={style.cardFooter}>
              <div style={style.clickHint}>Clique para ver detalhes →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const style = StyleSheet.create({
  container: {
    border: `1px solid ${Colors.border}`,
    borderRadius: "12px",
    backgroundColor: Colors.surface,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    backgroundColor: Colors.surfaceAlt,
    borderBottom: `1px solid ${Colors.border}`,
  },
  title: {
    color: Colors.primary,
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
  },
  count: {
    color: Colors.textMuted,
    fontSize: "14px",
    fontWeight: "500",
  },
  resultsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "16px",
  },
  resultCard: {
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: Colors.surface,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: Colors.primary,
    color: Colors.surface,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "16px",
    flexShrink: 0,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    color: Colors.text,
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "4px",
  },
  studentDetails: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  detailItem: {
    color: "white",
    fontSize: "12px",
    backgroundColor: Colors.surfaceAlt,
    padding: "2px 8px",
    borderRadius: "12px",
    border: `1px solid ${Colors.border}`,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  responsibleInfo: {
    padding: "12px",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: "6px",
    border: `1px solid ${Colors.border}`,
  },
  responsibleLabel: {
    color: Colors.textMuted,
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
  },
  responsibleName: {
    color: Colors.text,
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "4px",
  },
  responsibleContact: {
    color: Colors.textMuted,
    fontSize: "12px",
  },
  additionalInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  infoItem: {
    display: "flex",
    justifyContent: "flex-start",
    gap: 9,
    alignItems: "center",
    padding: "4px 0",
  },
  infoLabel: {
    color: Colors.textMuted,
    fontSize: "12px",
    fontWeight: "500",
  },
  infoValue: {
    color: Colors.text,
    fontSize: "12px",
    textAlign: "right",
    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
  },
  cardFooter: {
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: `1px dashed ${Colors.border}`,
  },
  clickHint: {
    color: Colors.primary,
    fontSize: "12px",
    textAlign: "center",
    fontWeight: "500",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: Colors.textMuted,
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.5,
  },
  emptyText: {
    fontSize: "16px",
    margin: 0,
  },
});
