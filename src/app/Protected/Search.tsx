import { useEffect, useState, useRef } from "react";
import SearchField from "../Components/Search/SearchField";
import SearchResults from "../Components/Search/SearchResults";
import { useAuth } from "../Context/AuthContext";
import ErrorDisplay from "../Components/ErrorDisplay";
import DetailsAluno from "../Components/Search/DetailsAluno";
import { StyleSheet } from "../Utils/Stylesheet";
import Colors from "../Utils/Colors";

export default function Search() {
  const [results, setResults] = useState<any[]>([]);
  const [type, setType] = useState<"ALUNO" | "FUNCIONARIO">("ALUNO");
  const [turmas, setTurmas] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<any | null>(null);
  const { setError } = useAuth();

  // Create ref for SearchField
  const searchFieldRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);

  useEffect(() => {
    const getTurmas = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/turmas/all`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error(await response.text());

        const turmasData = await response.json();
        const turmasMap = turmasData.reduce(
          (acc: Record<number, string>, turma: any) => {
            acc[turma.id] = turma.nome;
            return acc;
          },
          {}
        );
        setTurmas(turmasMap);
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    };
    getTurmas();
  }, []);

  const handleSearch = async (query: string) => {
    try {
      if (!query.trim()) {
        setResults([]);
        return [];
      }

      if (type === "ALUNO") {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/alunos/search?nome=${encodeURIComponent(query)}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setResults([]);
            return [];
          }
          throw new Error(await response.text());
        }

        const data = await response.json();
        setResults(data);
        return data;
      }

      if (type === "FUNCIONARIO") {
        return [];
      }

      return [];
    } catch (error: any) {
      console.error("Erro na busca:", error);
      setError(error);
      setResults([]);
      return [];
    }
  };

  // Function to refresh search with current query
  const refreshSearch = async () => {
    if (searchFieldRef.current) {
      const currentQuery = searchFieldRef.current.getValue();
      if (currentQuery.trim()) {
        await handleSearch(currentQuery);
      }
    }
  };

  // Function to trigger search programmatically
  const triggerSearch = async () => {
    if (searchFieldRef.current) {
      const query = searchFieldRef.current.getValue();
      await handleSearch(query);
    }
  };

  const handleCloseDetails = () => {
    setSelected(null);
  };

  // Handle successful edit/delete from DetailsAluno
  const handleStudentUpdated = () => {
    refreshSearch(); // Refresh the search results
    setSelected(null); // Close the details view
  };

  // Optional: Clear search and results
  const clearSearch = () => {
    if (searchFieldRef.current) {
      searchFieldRef.current.setValue("");
    }
    setResults([]);
  };

  return (
    <div style={style.container}>
      {/* Search Header with Controls */}
      <div style={style.header}>
        <h2 style={style.title}>Buscar Alunos</h2>
        <div style={style.headerActions}>
          <button onClick={clearSearch} style={style.secondaryButton}>
            Limpar
          </button>
          <button onClick={triggerSearch} style={style.primaryButton}>
            Atualizar
          </button>
        </div>
      </div>

      {/* Search Field */}
      <SearchField
        types="TEXT"
        onSearch={handleSearch}
        onResult={setResults}
        ref={searchFieldRef}
      />

      {/* Search Type Selector */}
      <div style={style.typeSelector}>
        <label style={style.radioLabel}>
          <input
            type="radio"
            value="ALUNO"
            checked={type === "ALUNO"}
            onChange={(e) => setType(e.target.value as "ALUNO" | "FUNCIONARIO")}
            style={style.radioInput}
          />
          Alunos
        </label>
        <label style={style.radioLabel}>
          <input
            type="radio"
            value="FUNCIONARIO"
            checked={type === "FUNCIONARIO"}
            onChange={(e) => setType(e.target.value as "ALUNO" | "FUNCIONARIO")}
            style={style.radioInput}
          />
          Funcionários
        </label>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div style={style.resultsSection}>
          <div style={style.resultsHeader}>
            <h3 style={style.resultsTitle}>Resultados ({results.length})</h3>
            <button onClick={refreshSearch} style={style.refreshButton}>
              ↻ Atualizar
            </button>
          </div>
          <SearchResults data={results} onClick={setSelected} />
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && searchFieldRef.current?.getValue() && (
        <div style={style.emptyState}>
          <p style={style.emptyText}>
            Nenhum resultado encontrado para "
            {searchFieldRef.current.getValue()}"
          </p>
          <button onClick={clearSearch} style={style.secondaryButton}>
            Limpar Busca
          </button>
        </div>
      )}

      {/* Empty State */}
      {!searchFieldRef.current?.getValue() && (
        <div style={style.emptyState}>
          <p style={style.emptyText}>
            Digite um termo de busca para encontrar alunos
          </p>
        </div>
      )}

      {/* Student Details Modal */}
      {selected && type === "ALUNO" && (
        <DetailsAluno
          data={selected}
          close={handleCloseDetails}
          onUpdate={handleStudentUpdated}
        />
      )}

      <ErrorDisplay />
    </div>
  );
}

const style = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "20px",
    backgroundColor: Colors.background,
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  title: {
    color: Colors.primary,
    margin: 0,
    fontSize: "24px",
    fontWeight: "600",
  },
  headerActions: {
    display: "flex",
    gap: "8px",
  },
  typeSelector: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    padding: "12px 0",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: Colors.text,
    cursor: "pointer",
  },
  radioInput: {
    margin: 0,
  },
  resultsSection: {
    marginTop: "8px",
  },
  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  resultsTitle: {
    color: Colors.text,
    margin: 0,
    fontSize: "18px",
    fontWeight: "500",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: Colors.textMuted,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: "12px",
    border: `1px solid ${Colors.border}`,
  },
  emptyText: {
    margin: "0 0 16px 0",
    fontSize: "16px",
  },
  primaryButton: {
    padding: "8px 16px",
    backgroundColor: Colors.primary,
    color: Colors.surface,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  secondaryButton: {
    padding: "8px 16px",
    backgroundColor: Colors.surfaceAlt,
    color: Colors.text,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  refreshButton: {
    padding: "6px 12px",
    backgroundColor: Colors.info,
    color: Colors.surface,
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
});
