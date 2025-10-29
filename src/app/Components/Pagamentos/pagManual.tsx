import { useEffect, useState, useMemo } from "react";
import { type Aluno, type FieldConfig } from "../../Utils/Types";
import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";
import DynamicForm from "../CreationForm/DynamicForm";
import GenericSearcher from "../Home/GenericSearcher";
import { XIcon } from "@phosphor-icons/react";

export default function PagamentoManual({
  onClose,
  showClose,
}: {
  onClose?: () => void;
  showClose: boolean;
}) {
  const [alunos, setAlunos] = useState<Array<Aluno> | null>(null);
  const [selectedAluno, setSelected] = useState<Aluno | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGetRespWithAluno = async (nomeAluno: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/alunos/search?nome=${nomeAluno}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar aluno");
      }

      const data = await response.json();
      setAlunos(data);

      console.log(alunos);
      console.log(data);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleClickAluno = (aluno: Aluno) => {
    setSelected(aluno);
    setAlunos(null);
    console.log(selectedAluno?.responsavel?.nomeCompleto);
  };

  const handleClearSelection = () => {
    setSelected(null);
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedAluno) {
      alert("Por favor, selecione um aluno");
      return;
    }

    try {
      const pagamentoData = {
        dataPagamento: new Date(formData.dataPago).toISOString().split("T")[0],
        valorPagamento: formData.valorPago,
        metodoPagamento: formData.metodoPagamento,
        isAutomatized: false,
        observacao: formData.observacao,

        comprovanteCpf: selectedAluno.responsavel?.cpf,
        nomeResponsavel: formData.nomeResponsavel,
        responsavelId: selectedAluno.responsavel?.id,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/pagamentos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(pagamentoData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao registrar pagamento");
      }

      alert("Pagamento registrado com sucesso!");
      setSelected(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 3) {
      handleGetRespWithAluno(value);
    } else {
      setAlunos(null);
    }
  };

  const fields = useMemo<FieldConfig[]>(
    () => [
      {
        name: "nomeResponsavel",
        placeholder: "Nome do Pagador",
        type: "TEXT",
        required: true,
        defaultValue: selectedAluno?.responsavel?.nomeCompleto || "",
      },
      {
        name: "dataPago",
        placeholder: "Data do Pagamento",
        type: "DATE",
        required: true,
      },
      {
        name: "valorPago",
        placeholder: "Valor do Pagamento",
        type: "NUMBER",
        required: true,
      },
      {
        name: "metodoPagamento",
        placeholder: "Metodo de pagamento",
        type: "SELECT",
        required: true,
        options: [
          { label: "Cartão", value: "CARTAO" },
          { label: "PIX", value: "PIX" },
          { label: "Dinheiro", value: "DINHEIRO" },
        ],
      },
      {
        name: "observacao",
        placeholder: "Observação",
        type: "TEXT",
        required: true,
      },
    ],
    [selectedAluno]
  );

  const styles = isMobile ? mobileStyle : style;

  return (
    <div style={styles.mainContainer}>
      <div style={styles.header}>
        <h3 style={styles.title}>Pagamento Manual</h3>
        {showClose && (
          <button style={style.closeButton} onClick={onClose}>
            <XIcon size={22} />
          </button>
        )}
      </div>

      <div style={styles.content}>
        <div>
          <DynamicForm
            title="Dados do Pagamento"
            sendAs="JSON"
            onSubmit={handleSubmit}
            fields={fields}
          />
        </div>
        <div style={styles.searchContainer}>
          <h4 style={styles.sectionTitle}>Buscar Aluno</h4>

          {selectedAluno ? (
            <div style={styles.selectedAlunoContainer}>
              <div style={styles.selectedAluno}>
                <div style={styles.selectedAlunoInfo}>
                  <span style={styles.selectedAlunoLabel}>Aluno:</span>
                  <span style={styles.selectedAlunoName}>
                    {selectedAluno.nomeCompleto}
                  </span>
                </div>
                {selectedAluno.responsavel && (
                  <div style={styles.selectedAlunoInfo}>
                    <span style={styles.selectedAlunoLabel}>Responsável:</span>
                    <span style={styles.selectedAlunoName}>
                      {selectedAluno.responsavel.nomeCompleto}
                    </span>
                  </div>
                )}
              </div>
              <button
                style={styles.clearButton}
                onClick={handleClearSelection}
                type="button"
              >
                Limpar Seleção
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder={
                  isMobile
                    ? "Nome do aluno"
                    : "Digite o nome do aluno (mínimo 3 caracteres)"
                }
                onChange={handleSearchChange}
                style={styles.searchInput}
              />
              {alunos && alunos.length > 0 && (
                <div style={styles.searchResults}>
                  <GenericSearcher
                    data={alunos}
                    onClick={handleClickAluno}
                    title="Resultados"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.surface,
    padding: 20,
    border: `1px solid ${Colors.border}`,
    borderRadius: 16,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: `2px solid ${Colors.border}`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: Colors.text,
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
  },
  content: {
    display: "flex",
    flexDirection: "row",
    gap: 14,
  },
  formSection: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.border}`,
    padding: 20,
    borderRadius: 12,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  sectionTitle: {
    color: Colors.primary,
    margin: 0,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchInput: {
    padding: 12,
    backgroundColor: Colors.inputBackground,
    color: Colors.text,
    border: `1px solid ${Colors.border}`,
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
  },
  searchResults: {
    marginTop: 10,
  },
  selectedAlunoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  selectedAluno: {
    backgroundColor: Colors.surface,
    border: `2px solid ${Colors.borderSuccess}`,
    borderRadius: 8,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  selectedAlunoInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  selectedAlunoLabel: {
    color: Colors.textLight,
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: 600,
  },
  selectedAlunoName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 500,
  },
  clearButton: {
    padding: "10px 16px",
    backgroundColor: Colors.error,
    color: Colors.white,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    transition: "opacity 0.2s",
  },
  closeButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2.5rem",
    height: "2.5rem",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    border: `1px solid ${Colors.border}`,
    borderRadius: "10px",
    color: Colors.textMuted,
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
});

const mobileStyle = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.surface,
    padding: 12,
    border: `1px solid ${Colors.border}`,
    borderRadius: 12,
  },
  header: {
    marginBottom: 15,
    paddingBottom: 12,
    borderBottom: `2px solid ${Colors.border}`,
  },
  title: {
    color: Colors.text,
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  searchContainer: {
    backgroundColor: Colors.backgroundAlt,
    border: `1px solid ${Colors.border}`,
    padding: 15,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  sectionTitle: {
    color: Colors.primary,
    margin: 0,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchInput: {
    width: "100%",
    padding: 10,
    backgroundColor: Colors.inputBackground,
    color: Colors.text,
    border: `1px solid ${Colors.border}`,
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  searchResults: {
    marginTop: 8,
  },
  selectedAlunoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  selectedAluno: {
    backgroundColor: Colors.surface,
    border: `2px solid ${Colors.borderSuccess}`,
    borderRadius: 8,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  selectedAlunoInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  selectedAlunoLabel: {
    color: Colors.textLight,
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: 600,
  },
  selectedAlunoName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 500,
  },
  clearButton: {
    padding: "10px 14px",
    backgroundColor: Colors.error,
    color: Colors.white,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    width: "100%",
  },
});
