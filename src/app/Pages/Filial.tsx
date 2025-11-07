import { useEffect, useState } from "react";
import { StyleSheet } from "../Utils/Stylesheet";
import FilialTable from "../Components/Filial/FilialTable";
import DynamicForm from "../Components/CreationForm/DynamicForm";
import type { FieldConfig, Filial } from "../Utils/Types";
import Colors from "../Utils/Colors";
import mockAPI from "../Utils/mockData";

export default function Filial() {
  const [filiais, setFiliais] = useState<{ filiais: Filial[] } | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<boolean>(false);
  const [selectedFilial, setSelectedFilial] = useState<Record<
    string,
    any
  > | null>(null);

  useEffect(() => {
    const getFiliais = async () => {
      try {
        const data = await mockAPI.getAllFiliais();
        setFiliais(data);
      } catch (error) {
        alert(error);
      }
    };
    getFiliais();
  }, [refresh]);

  const filialFields: FieldConfig[] = [
    {
      name: "nome",
      placeholder: "Nome da Filial",
      type: "TEXT",
      required: true,
    },
    {
      name: "cep",
      placeholder: "CEP",
      type: "TEXT",
      required: true,
      mask: "99999-999",
    },
    {
      name: "rua",
      placeholder: "Rua",
      type: "TEXT",
      required: true,
    },
    {
      name: "enderecoNumero",
      placeholder: "Número",
      type: "TEXT",
      required: true,
    },
    {
      name: "cidade",
      placeholder: "Cidade",
      type: "TEXT",
      required: true,
    },
    {
      name: "estado",
      placeholder: "Estado (UF)",
      type: "TEXT",
      required: true,
    },
  ];

  const handleCreateFilial = async (formData: Record<string, any>) => {
    try {
      const filialData = {
        nome: formData.nome,
        cep: formData.cep,
        rua: formData.rua,
        enderecoNumero: formData.enderecoNumero,
        cidade: formData.cidade,
        estado: formData.estado,
      };

      console.log("Creating filial:", filialData);

      const result = await mockAPI.createFilial(filialData);
      console.log("Filial created:", result);

      setShowForm(false);
      setRefresh(!refresh);
      alert("Filial criada com sucesso!");
    } catch (error: any) {
      console.error("Error creating filial:", error);
      alert("Erro ao criar filial: " + error.message);
    }
  };

  const handleEditFilial = async (formData: Record<string, any>) => {
    try {
      const filialData = {
        nome: formData.nome,
        cep: formData.cep,
        rua: formData.rua,
        enderecoNumero: formData.enderecoNumero,
        cidade: formData.cidade,
        estado: formData.estado,
      };

      await mockAPI.updateFilial(formData.id, filialData);

      console.log(filialData);
      setEditForm(false);
      setRefresh(!refresh);
      alert("Filial editada com sucesso!");
    } catch (error: any) {
      console.error("Error editing filial:", error);
      alert("Erro ao editar filial: " + error.message);
    }
  };

  const handleSelectFilialForEdit = (formData: Record<string, any>) => {
    console.log("selectingFilial:", formData);
    setSelectedFilial(formData);
    setEditForm(true);
  };

  return (
    <div style={style.mainContainer}>
      <div style={style.header}>
        <h1 style={style.title}>Filiais</h1>
        <button onClick={() => setShowForm(true)} style={style.createButton}>
          + Nova Filial
        </button>
      </div>

      {showForm && (
        <div style={style.formOverlay}>
          <div style={style.formContainer}>
            <DynamicForm
              onSubmit={handleCreateFilial}
              fields={filialFields}
              title="Criar Nova Filial"
              sendAs="JSON"
            />
          </div>
        </div>
      )}

      {editForm &&
        selectedFilial &&
        (() => {
          let filialFieldsWithDefaults: FieldConfig[] = filialFields.map(
            (field) => ({
              ...field,
              defaultValue: selectedFilial
                ? selectedFilial[field.name] ?? ""
                : "",
            })
          );
          filialFieldsWithDefaults.push({
            name: "id",
            type: "HIDDEN",
            placeholder: "",
            defaultValue: selectedFilial.id,
            required: true,
          });

          return (
            <div style={style.formOverlay}>
              <div style={style.formContainer}>
                <DynamicForm
                  onSubmit={handleEditFilial}
                  fields={filialFieldsWithDefaults}
                  title={`Editar Filial: ${selectedFilial.nome}`}
                  sendAs="JSON"
                />
              </div>
            </div>
          );
        })()}

      {filiais && (
        <FilialTable data={filiais} onEdit={handleSelectFilialForEdit} />
      )}
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
});
