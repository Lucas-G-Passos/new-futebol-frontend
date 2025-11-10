import { useEffect, useState } from "react";
import { type Aluno } from "../Utils/Types";
import DetailsAluno from "../Components/Search/DetailsAluno";
import GenericSearcher from "../Components/Home/GenericSearcher";
import { StyleSheet } from "../Utils/Stylesheet";
import Colors from "../Utils/Colors";

export default function Home() {
  const [nivers, setNivers] = useState<Array<Aluno> | null>(null);
  const [inadimplentes, setInadimplentes] = useState<Array<Aluno> | null>(null);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const api: string = import.meta.env.VITE_BACKEND_URL;
      const anivers = await fetch(`${api}/alunos/aniversariantes`, {
        credentials: "include",
      });
      const inadimp = await fetch(`${api}/alunos/inadimplentes`, {
        credentials: "include",
      });

      if (!anivers.ok || !inadimp.ok) {
        throw new Error("Erro ao recuperar inadimplentes ou aniversariantes");
      }

      const aniverData = await anivers.json();
      const inadimData = await inadimp.json();

      setNivers(aniverData);
      setInadimplentes(inadimData);
    };
    getData();
  }, [refresh]);

  const handleClickAluno = (aluno: Aluno) => {
    setSelectedAluno(aluno);
  };

  const handleCloseDetails = () => {
    setSelectedAluno(null);
  };

  const handleStudentUpdated = () => {
    setRefresh(!refresh);
    setSelectedAluno(null);
  };

  return (
    <div style={style.container}>
      {/* Page Header */}
      <div style={style.header}>
        <h1 style={style.title}>Início</h1>
      </div>

      {/* Content Grid */}
      <div style={style.contentGrid}>
        {nivers && (
          <GenericSearcher
            data={nivers}
            onClick={handleClickAluno}
            title="🎂 Aniversariantes do Mês"
          />
        )}

        {inadimplentes && (
          <GenericSearcher
            data={inadimplentes}
            onClick={handleClickAluno}
            title="⚠️ Inadimplentes"
          />
        )}
      </div>

      {/* Details Modal */}
      {selectedAluno && (
        <DetailsAluno
          data={selectedAluno}
          close={handleCloseDetails}
          onUpdate={handleStudentUpdated}
        />
      )}
    </div>
  );
}

const style = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
    backgroundColor: Colors.background,
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "12px",
  },
  title: {
    color: Colors.primary,
    margin: 0,
    fontSize: "32px",
    fontWeight: "700",
  },
  headerSubtitle: {
    color: Colors.textMuted,
    fontSize: "16px",
    fontWeight: "400",
  },
  contentGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
});
