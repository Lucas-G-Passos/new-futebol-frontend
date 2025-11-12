import { useState } from "react";
import { StyleSheet } from "../../Utils/Stylesheet";
import { type ConciliacaoResponse, type Aluno } from "../../Utils/Types";
import Colors from "../../Utils/Colors";
import DetailsAluno from "../Search/DetailsAluno";

export default function Conciliacao() {
  const [file, setFile] = useState<Blob | null>(null);
  const [data, setData] = useState<ConciliacaoResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f != null) setFile(f);
  };

  const detectSeparator = (csv: string): string => {
    const firstLine = csv.split("\n")[0];
    const separators = [";", ",", "\t", "|"];

    const counts = separators.map((sep) => ({
      separator: sep,
      count: (firstLine.match(new RegExp(`\\${sep}`, "g")) || []).length,
    }));

    const best = counts.reduce((max, curr) =>
      curr.count > max.count ? curr : max
    );

    return best.count > 0 ? best.separator : ",";
  };

  const headerCheck = (csv: string) => {
    const separator = detectSeparator(csv);
    const lines = csv.split("\n");
    const headers = lines[0].split(separator).map((h) => h.trim());
    return headers;
  };

  const handleSubmit = async () => {
    try {
      let isCard: boolean = false;
      let isPix: boolean = false;
      let response: Response | undefined;

      if (!file) {
        alert("Por favor, selecione um arquivo CSV antes de enviar.");
        return;
      }

      const filtered: string[] = headerCheck(await file.text());
      if (filtered.some((i) => i.toLowerCase().includes("stone")))
        isCard = true;
      else isPix = true;

      const formdata = new FormData();
      formdata.append("file", file);

      if (isCard) {
        response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/pagamentos/conciliacao/cartao`,
          {
            method: "POST",
            credentials: "include",
            body: formdata,
          }
        );
      } else if (isPix) {
        response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/pagamentos/conciliacao/pix`,
          {
            method: "POST",
            credentials: "include",
            body: formdata,
          }
        );
      } else {
        throw new Error("Erro ao identificar tipo de arquivo");
      }

      if (!response.ok) {
        const errorText = await response.text();

        if (errorText.includes("não é um csv")) {
          throw new Error("O arquivo enviado não é um CSV válido.");
        } else if (errorText.includes("Erro de I/O")) {
          throw new Error(
            "Erro ao processar o arquivo. Verifique se o arquivo está corrompido."
          );
        } else if (errorText.includes("Erro inesperado")) {
          throw new Error(
            "Erro inesperado ao processar o arquivo. Por favor, verifique o formato do CSV."
          );
        } else {
          throw new Error(errorText || "Erro ao enviar arquivo");
        }
      }

      const data = await response.json();
      console.log(data);
      setData(data);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={style.mainContainer}>
      <div style={style.uploadContainer}>
        <h2 style={style.title}>Conciliação</h2>
        <div style={style.uploadSection}>
          <input
            type="file"
            onChange={handleFileChange}
            style={style.fileInput}
          />
          <button onClick={handleSubmit} style={style.submitButton}>
            Enviar
          </button>
        </div>
      </div>
      {data && <Resultados data={data} />}
    </div>
  );
}

function Resultados({ data }: { data: ConciliacaoResponse }) {
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "PIX":
        return "#10b981";
      case "CARTAO":
        return "#3b82f6";
      case "DINHEIRO":
        return "#f59e0b";
      default:
        return Colors.textMuted;
    }
  };

  const translateError = (errorCode: string): string => {
    // Handle errors with additional details (e.g., "INVALID_NUMBER_FORMAT: ...")
    if (errorCode.includes(":")) {
      const [code] = errorCode.split(":");
      const baseMessage = translateError(code.trim());
      return baseMessage;
    }

    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      INVALID_FORMAT: "Formato do cartão inválido",
      ALUNO_NOT_FOUND: "Aluno não encontrado",
      ALUNO_NAO_ENCONTRADO: "Aluno não encontrado",
      INVALID_NUMBER_FORMAT: "Formato numérico inválido",
      INVALID_DATE_FORMAT: "Formato de data inválido",
      PROCESSING_ERROR: "Erro ao processar transação",
      METODO_DE_PAG_NAO_ENCONTRADO: "Método de pagamento não identificado",
      EMPTY_NAME: "Nome vazio ou inválido",
    };

    return errorMessages[errorCode] || errorCode;
  };

  const failedFieldsArray = data.failedFields
    ? Object.entries(data.failedFields)
    : [];

  return (
    <div style={style.resultadosContainer}>
      {selectedAluno && (
        <DetailsAluno
          data={selectedAluno}
          close={() => setSelectedAluno(null)}
        />
      )}

      {/* Alunos to Update */}
      <div style={style.box}>
        <div style={style.boxHeader}>
          <h3 style={style.boxTitle}>Alunos para Atualizar</h3>
          <span style={style.badge}>{data.alunosToUpdate.length}</span>
        </div>
        <div style={style.boxContent}>
          {data.alunosToUpdate.length === 0 ? (
            <div style={style.emptyState}>Nenhum aluno para atualizar</div>
          ) : (
            <div style={style.itemsList}>
              {data.alunosToUpdate.map((aluno) => (
                <div
                  key={aluno.id}
                  style={style.alunoItem}
                  onClick={() => setSelectedAluno(aluno)}
                >
                  <div style={style.alunoInfo}>
                    <div style={style.alunoName}>{aluno.nomeCompleto}</div>
                    <div style={style.alunoDetails}>
                      CPF: {aluno.cpf} | Turma: {aluno.turmaNome || "N/A"}
                    </div>
                  </div>
                  <div style={style.clickHint}>Ver detalhes →</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagamentos to Create */}
      <div style={style.box}>
        <div style={style.boxHeader}>
          <h3 style={style.boxTitle}>Pagamentos para Criar</h3>
          <span style={style.badge}>{data.pagamentosToCreate.length}</span>
        </div>
        <div style={style.boxContent}>
          {data.pagamentosToCreate.length === 0 ? (
            <div style={style.emptyState}>Nenhum pagamento para criar</div>
          ) : (
            <div style={style.itemsList}>
              {data.pagamentosToCreate.map((pagamento: any, index) => (
                <div key={index} style={style.pagamentoItem}>
                  <div style={style.pagamentoHeader}>
                    <div style={style.pagamentoValue}>
                      {formatCurrency(pagamento.valorPago)}
                    </div>
                    <span
                      style={{
                        ...style.methodBadge,
                        backgroundColor: getMethodBadgeColor(
                          pagamento.metodoPagamento
                        ),
                      }}
                    >
                      {pagamento.metodoPagamento}
                    </span>
                  </div>
                  <div style={style.pagamentoBody}>
                    <div style={style.pagamentoDetail}>
                      <strong>Data:</strong> {formatDate(pagamento.dataPago)}
                    </div>
                    {pagamento.aluno && (
                      <div style={style.pagamentoDetail}>
                        <strong>Aluno:</strong>{" "}
                        <span
                          style={style.alunoLink}
                          onClick={() => setSelectedAluno(pagamento.aluno)}
                        >
                          {pagamento.aluno.nomeCompleto}
                        </span>
                      </div>
                    )}
                    {pagamento.observacao && (
                      <div style={style.pagamentoDetail}>
                        <strong>Obs:</strong> {pagamento.observacao}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Failed Fields */}
      <div style={style.box}>
        <div style={style.boxHeader}>
          <h3 style={style.boxTitle}>Campos com Falha</h3>
          <span style={{ ...style.badge, backgroundColor: Colors.error }}>
            {failedFieldsArray.length}
          </span>
        </div>
        <div style={style.boxContent}>
          {failedFieldsArray.length === 0 ? (
            <div style={style.emptyState}>Nenhuma falha encontrada</div>
          ) : (
            <div style={style.itemsList}>
              {failedFieldsArray.map(([identifier, error], index) => {
                // Check if it's a card number (4 digits) or a name
                const isCardNumber = /^\d{4}$/.test(identifier);
                const displayLabel = isCardNumber
                  ? `Cartão ****${identifier}`
                  : identifier === "EMPTY_NAME"
                  ? "Identificação vazia"
                  : identifier;

                return (
                  <div key={index} style={style.failedItem}>
                    <div style={style.failedIcon}>⚠️</div>
                    <div style={style.failedContent}>
                      <div style={style.failedCard}>{displayLabel}</div>
                      <div style={style.failedError}>
                        {translateError(error)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    padding: "2rem",
    minHeight: "100vh",
  },
  uploadContainer: {
    backgroundColor: Colors.surface,
    borderRadius: "16px",
    padding: "2rem",
    border: `1px solid ${Colors.border}`,
    marginBottom: "2rem",
  },
  title: {
    color: Colors.primary,
    fontSize: "1.75rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    margin: 0,
  },
  uploadSection: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  fileInput: {
    padding: "0.75rem",
    border: `2px solid ${Colors.border}`,
    borderRadius: "8px",
    backgroundColor: Colors.surfaceAlt,
    color: Colors.text,
    fontSize: "0.9375rem",
    flex: "1 1 300px",
    cursor: "pointer",
  },
  submitButton: {
    padding: "0.75rem 2rem",
    backgroundColor: Colors.primary,
    color: "black",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9375rem",
    transition: "all 0.2s ease",
  },
  resultadosContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  box: {
    backgroundColor: Colors.surface,
    borderRadius: "16px",
    border: `1px solid ${Colors.border}`,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  boxHeader: {
    padding: "1.5rem 2rem",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderBottom: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boxTitle: {
    color: Colors.primary,
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: 0,
  },
  badge: {
    backgroundColor: Colors.primary,
    color: "black",
    padding: "0.375rem 0.875rem",
    borderRadius: "12px",
    fontSize: "0.875rem",
    fontWeight: "700",
  },
  boxContent: {
    padding: "1.5rem 2rem",
  },
  emptyState: {
    textAlign: "center",
    color: Colors.textMuted,
    padding: "2rem",
    fontSize: "0.9375rem",
    fontStyle: "italic",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  // Aluno Items
  alunoItem: {
    padding: "1.25rem",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: "12px",
    border: `1px solid ${Colors.border}`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alunoInfo: {
    flex: 1,
  },
  alunoName: {
    color: Colors.text,
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  alunoDetails: {
    color: Colors.textMuted,
    fontSize: "0.875rem",
  },
  clickHint: {
    color: Colors.primary,
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  // Pagamento Items
  pagamentoItem: {
    padding: "1.25rem",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: "12px",
    border: `1px solid ${Colors.border}`,
  },
  pagamentoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    paddingBottom: "0.75rem",
    borderBottom: `1px solid ${Colors.border}`,
  },
  pagamentoValue: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: Colors.success,
  },
  methodBadge: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  pagamentoBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  pagamentoDetail: {
    color: Colors.text,
    fontSize: "0.9375rem",
  },
  alunoLink: {
    color: Colors.primary,
    cursor: "pointer",
    textDecoration: "underline",
  },
  // Failed Items
  failedItem: {
    padding: "1.25rem",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: "12px",
    border: `2px solid ${Colors.error}`,
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },
  failedIcon: {
    fontSize: "1.5rem",
  },
  failedContent: {
    flex: 1,
  },
  failedCard: {
    color: Colors.text,
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.375rem",
  },
  failedError: {
    color: Colors.error,
    fontSize: "0.875rem",
    fontWeight: "500",
  },
});
