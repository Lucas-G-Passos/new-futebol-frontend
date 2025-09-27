import { StyleSheet } from "../Utils/Stylesheet";
import Colors from "../Utils/Colors";
import DynamicForm from "../Components/CreationForm/DynamicForm";
import { useState } from "react";
import type { FieldConfig } from "../Utils/Types";

export default function CreationFormPage() {
  const [type, setType] = useState<"ALUNO" | "FUNCIONARIO">("ALUNO");
  const alunoFields: FieldConfig[] = [
    {
      name: "nomeCompleto",
      placeholder: "Nome Completo",
      type: "TEXT",
      required: true,
    },

    {
      name: "dataNascimento",
      placeholder: "Data de Nascimento",
      type: "DATE",
      required: true,
    },
    {
      name: "dataMatricula",
      placeholder: "Data de Matrícula",
      type: "DATE",
      required: true,
    },

    {
      name: "telefone1",
      placeholder: "Telefone 1",
      type: "TEXT",
      mask: "(99) 99999-9999",
      required: true,
    },
    {
      name: "telefone2",
      placeholder: "Telefone 2",
      type: "TEXT",
      mask: "(99) 99999-9999",
    },

    {
      name: "cpf",
      placeholder: "CPF",
      type: "TEXT",
      mask: "999.999.999-99",
      required: true,
    },
    {
      name: "rg",
      placeholder: "RG",
      type: "TEXT",
      mask: "99.999.999-9",
      required: true,
    },

    { name: "alergia", placeholder: "Alergia", type: "TEXT" },
    { name: "usoMedicamento", placeholder: "Uso de Medicamento", type: "TEXT" },
    {
      name: "horarioMedicamento",
      placeholder: "Horário do Medicamento",
      type: "TIME",
    },

    { name: "colegio", placeholder: "Colégio", type: "TEXT", required: true },

    {
      name: "colegioAno",
      placeholder: "Ano Escolar",
      type: "SELECT",
      required: true,
      options: [
        { label: "1º Ano", value: "1ano" },
        { label: "2º Ano", value: "2ano" },
        { label: "3º Ano", value: "3ano" },
        { label: "4º Ano", value: "4ano" },
        { label: "5º Ano", value: "5ano" },
        { label: "6º Ano", value: "6ano" },
        { label: "7º Ano", value: "7ano" },
        { label: "8º Ano", value: "8ano" },
        { label: "9º Ano", value: "9ano" },
        { label: "1º Médio", value: "1medio" },
        { label: "2º Médio", value: "2medio" },
        { label: "3º Médio", value: "3medio" },
        { label: "Terminou", value: "terminou" },
      ],
    },

    { name: "time", placeholder: "Time", type: "TEXT" },
    { name: "indicacao", placeholder: "Indicação", type: "TEXT" },
    { name: "observacao", placeholder: "Observação", type: "TEXT" },

    { name: "ativo", placeholder: "Ativo", type: "CHECKBOX", required: true },

    {
      name: "turmaId",
      placeholder: "Turma",
      type: "SELECT",
      required: true,
      options: [
        { label: "Turma A", value: 1 },
        { label: "Turma B", value: 2 },
      ],
    },

    { name: "file", placeholder: "Foto", type: "FILE", required: true },

    // Responsável
    {
      name: "responsavel.nomeCompleto",
      placeholder: "Nome do Responsável",
      type: "TEXT",
      required: true,
    },
    {
      name: "responsavel.cpf",
      placeholder: "CPF do Responsável",
      type: "TEXT",
      mask: "999.999.999-99",
      required: true,
    },
    {
      name: "responsavel.rg",
      placeholder: "RG do Responsável",
      type: "TEXT",
      mask: "99.999.999-9",
      required: true,
    },
    {
      name: "responsavel.telefone1",
      placeholder: "Telefone 1 do Responsável",
      type: "TEXT",
      mask: "(99) 99999-9999",
      required: true,
    },
    {
      name: "responsavel.telefone2",
      placeholder: "Telefone 2 do Responsável",
      type: "TEXT",
      mask: "(99) 99999-9999",
    },
    {
      name: "responsavel.email",
      placeholder: "Email do Responsável",
      type: "TEXT",
      required: true,
    },
  ];

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/alunos`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao criar aluno:", errorText);
        alert("Erro ao criar aluno: " + errorText);
        return;
      }

      const data = await response.json();
      console.log("Aluno criado com sucesso:", data);
      alert("Aluno criado com sucesso!");
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição");
    }
  };
  return (
    <div style={style.mainContainer}>
      <button
        onClick={() => {
          if (type === "ALUNO") setType("FUNCIONARIO");
          if (type === "FUNCIONARIO") setType("ALUNO");
        }}
      >
        mudar tipo
      </button>
      {type === "ALUNO" ? (
        <DynamicForm onSubmit={handleSubmit} fields={alunoFields} />
      ) : (
        <div>
          <p>Não implementado</p>
        </div>
      )}
    </div>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    flexDirection: "column",
    margin: 10,
  },
});
