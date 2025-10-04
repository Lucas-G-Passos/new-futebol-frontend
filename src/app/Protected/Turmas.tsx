import { useEffect, useState } from "react";
import { StyleSheet } from "../Utils/Stylesheet";
import TurmaTable from "../Components/Turma/TurmaTable";
import DynamicForm from "../Components/CreationForm/DynamicForm";
import type { FieldConfig } from "../Utils/Types";
import Colors from "../Utils/Colors";

export default function Turmas() {
  const [turmas, setTurmas] = useState(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const getTurmas = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/turmas/all`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Erro ao pegar turmas");
        const data = await response.json();
        setTurmas(data); // Handle both response formats
        console.log(data);
      } catch (error) {
        alert(error);
      }
    };
    getTurmas();
  }, [refresh]);

  const turmaFields: FieldConfig[] = [
    {
      name: "codigoTurma",
      placeholder: "Código da Turma",
      type: "TEXT",
      required: true,
    },
    {
      name: "nome",
      placeholder: "Nome da Turma",
      type: "TEXT",
      required: true,
    },
    {
      name: "descricao",
      placeholder: "Descrição",
      type: "TEXT",
      required: false,
    },
    {
      name: "diaSemana",
      placeholder: "Dias da Semana",
      type: "CHECKBOXGROUP",
      required: true,
      options: [
        { label: "Segunda-feira", value: "MONDAY" },
        { label: "Terça-feira", value: "TUESDAY" },
        { label: "Quarta-feira", value: "WEDNESDAY" },
        { label: "Quinta-feira", value: "THURSDAY" },
        { label: "Sexta-feira", value: "FRIDAY" },
        { label: "Sábado", value: "SATURDAY" },
        { label: "Domingo", value: "SUNDAY" },
      ],
    },
    {
      name: "horaInicio",
      placeholder: "Hora de Início",
      type: "TIME",
      required: true,
    },
    {
      name: "horaTermino",
      placeholder: "Hora de Término",
      type: "TIME",
      required: true,
    },
    {
      name: "local",
      placeholder: "Local",
      type: "TEXT",
      required: true,
    },
  ];

  const handleCreateTurma = async (formData: Record<string, any>) => {
    try {
      // Format the data for the backend
      const turmaData = {
        codigoTurma: formData.codigoTurma,
        nome: formData.nome,
        descricao: formData.descricao || "",
        diaSemana: formData.diaSemana,
        horaInicio: formData.horaInicio ? `${formData.horaInicio}:00` : null,
        horaTermino: formData.horaTermino ? `${formData.horaTermino}:00` : null,
        local: formData.local,
      };

      console.log("Creating turma:", turmaData);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/turmas`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(turmaData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao criar turma");
      }

      const result = await response.json();
      console.log("Turma created:", result);

      // Close form and refresh the list
      setShowForm(false);
      setRefresh(!refresh);
      alert("Turma criada com sucesso!");
    } catch (error: any) {
      console.error("Error creating turma:", error);
      alert("Erro ao criar turma: " + error.message);
    }
  };

  const handleEditTurma = async () => {
    console.log("Edit turma functionality");
  };

  return (
    <div style={style.mainContainer}>
      <div style={style.header}>
        <h1 style={style.title}>Turmas</h1>
        <button onClick={() => setShowForm(true)} style={style.createButton}>
          + Nova Turma
        </button>
      </div>

      {showForm && (
        <div style={style.formOverlay}>
          <div style={style.formContainer}>
            <DynamicForm
              onSubmit={handleCreateTurma}
              fields={turmaFields}
              title="Criar Nova Turma"
              sendAs="JSON"
            />
          </div>
        </div>
      )}

      {turmas && <TurmaTable data={turmas} onEdit={handleEditTurma} />}
    </div>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
  },
  title: {
    color: Colors.text,
    fontSize: "28px",
    fontWeight: "bold",
    margin: 0,
  },
  createButton: {
    padding: "12px 24px",
    backgroundColor: Colors.primary,
    color: Colors.black,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: Colors.primaryLight,
      transform: "translateY(-1px)",
    },
  },
  formOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
    backdropFilter: "blur(4px)",
  },
  formContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    minHeight: "50vh",
    overflow: "auto",
  },
});
