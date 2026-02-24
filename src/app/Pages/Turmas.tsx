import { useEffect, useState, useMemo } from "react";
import { StyleSheet } from "../Utils/Stylesheet";
import TurmaTable from "../Components/Turma/TurmaTable";
import DynamicForm from "../Components/CreationForm/DynamicForm";
import type { FieldConfig, Turma } from "../Utils/Types";
import Colors from "../Utils/Colors";
import { XIcon } from "@phosphor-icons/react";
import { useError } from "../Context/ErrorContext";
import { mapErrorMessage } from "../Utils/ErrorMapping";

export default function Turmas() {
  const { addError } = useError();
  const [turmas, setTurmas] = useState(null);
  const [filiais, setFiliais] = useState<{ id: number; nome: string }[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [selectedTurma, setSelectedTurma] = useState<Record<
    string,
    any
  > | null>(null);

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
      } catch (error) {
        addError(mapErrorMessage(error));
      }
    };
    getTurmas();
  }, [refresh]);

  useEffect(() => {
    const getFiliais = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/filiais/all`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Erro ao pegar filiais");
        const data = await response.json();
        setFiliais(data.filiais || []);
      } catch (error) {
        console.error("Error fetching filiais:", error);
      }
    };
    getFiliais();
  }, []);

  const turmaFields: FieldConfig[] = useMemo(
    () => [
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
        name: "filialId",
        placeholder: "Filial",
        type: "SELECT",
        required: true,
        options: filiais.map((filial) => ({
          label: filial.nome,
          value: filial.id,
        })),
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
    ],
    [filiais]
  );

  const handleCreateTurma = async (formData: Record<string, any>) => {
    try {
      const turmaData = {
        codigoTurma: formData.codigoTurma,
        nome: formData.nome,
        descricao: formData.descricao || "",
        filialId: formData.filialId ? Number(formData.filialId) : null,
        diaSemana: formData.diaSemana,
        horaInicio: formData.horaInicio ? `${formData.horaInicio}:00` : null,
        horaTermino: formData.horaTermino ? `${formData.horaTermino}:00` : null,
        local: formData.local,
      };

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

      setShowForm(false);
      setRefresh(!refresh);
      addError("Turma criada com sucesso!", "success", 3000);
    } catch (error: any) {
      console.error("Error creating turma:", error);
      addError(mapErrorMessage(error));
    }
  };

  const handleEditTurma = async (formData: Record<string, any>) => {
    try {
      setEditForm(true);
      const turmaData = {
        id: formData.id,
        codigoTurma: formData.codigoTurma,
        nome: formData.nome,
        descricao: formData.descricao || "",
        filialId: formData.filialId ? Number(formData.filialId) : null,
        diaSemana: formData.diaSemana,
        horaInicio: formData.horaInicio ? formData.horaInicio : null,
        horaTermino: formData.horaTermino ? formData.horaTermino : null,
        local: formData.local,
      };
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/turmas`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(turmaData),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao editar turma");
      }

      setEditForm(false);
      setRefresh(!refresh);
      addError("Turma editada com sucesso!", "success", 3000);
    } catch (error: any) {
      console.error("Error editing turma:", error);
      addError(mapErrorMessage(error));
    }
  };

  const handleDeleteTurma = async(turma: Turma) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/turmas?id=${turma.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao deletar turma");
      }

      setRefresh(!refresh);
      addError("Turma deletada com sucesso!", "success", 3000);
    } catch (error) {
      addError(mapErrorMessage(error));
    }
  }

  const handleSelectTurmaForEdit = (formData: Record<string, any>) => {
    setSelectedTurma(formData);
    setEditForm(true);
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
          <button
            onClick={() => setShowForm(false)}
            style={style.closeButton}
            aria-label="Fechar"
          >
            <XIcon size={22} />
          </button>
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
      {editForm &&
        selectedTurma &&
        (() => {
          let turmaFieldsWithDefaults: FieldConfig[] = turmaFields.map(
            (field) => ({
              ...field,
              defaultValue: selectedTurma
                ? selectedTurma[field.name] ?? ""
                : "",
            })
          );
          turmaFieldsWithDefaults.push({
            name: "id",
            type: "HIDDEN",
            placeholder: "",
            defaultValue: selectedTurma.id,
            required: true,
          });

          return (
            <div style={style.formOverlay}>
              <button
                onClick={() => setEditForm(false)}
                style={style.closeButton}
                aria-label="Fechar"
              >
                <XIcon size={22} />
              </button>
              <div style={style.formContainer}>
                <DynamicForm
                  onSubmit={handleEditTurma}
                  fields={turmaFieldsWithDefaults}
                  title={`Editar Turma: ${selectedTurma.nome}`}
                  sendAs="JSON"
                />
              </div>
            </div>
          );
        })()}

      {turmas && <TurmaTable data={turmas} onEdit={handleSelectTurmaForEdit} onDelete={handleDeleteTurma}/>}
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
    alignItems: "flex-start",
    zIndex: 1000,
    padding: "20px",
    backdropFilter: "blur(4px)",
    overflow: "auto",
  },
  formContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    minHeight: "50vh",
    overflow: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.border}`,
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: Colors.text,
    transition: "all 0.2s ease",
    zIndex: 1001,
    ":hover": {
      backgroundColor: Colors.primary,
      color: Colors.black,
      transform: "scale(1.1)",
    },
  },
});
