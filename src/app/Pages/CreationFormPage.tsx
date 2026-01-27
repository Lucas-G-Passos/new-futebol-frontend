import { StyleSheet } from "../Utils/Stylesheet";
import Colors from "../Utils/Colors";
import DynamicForm from "../Components/CreationForm/DynamicForm";
import { useEffect, useState } from "react";
import type { FieldConfig } from "../Utils/Types";
import ErrorDisplay from "../Components/ErrorDisplay";
import { useAuth } from "../Context/AuthContext";

export default function CreationFormPage() {
  const [alunoFields, setAlunoFields] = useState<FieldConfig[]>([
    {
      name: "nomeCompleto",
      placeholder: "Nome Completo",
      type: "TEXT",
      required: true,
    },
    {
      name: "apelido",
      placeholder: "Apelido",
      type: "TEXT",
    },
    {
      name:"nRegistro",
      placeholder: "Número de Registro",
      type: "NUMBER",
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

    { name: "isAtivo", placeholder: "Ativo", type: "CHECKBOX", required: true },

    {
      name: "turmaId",
      placeholder: "Turma",
      type: "SELECT",
      required: true,
      options: [],
    },

    { name: "file", placeholder: "Foto", type: "FILE" },

    { name: "atestado", placeholder: "Atestado Médico", type: "FILE" },

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
    {
      name: "cep",
      placeholder: "CEP",
      type: "TEXT",
      required: true,
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
      placeholder: "Estado",
      type: "SELECT",
      required: true,
      options: [
        { label: "Acre", value: "AC" },
        { label: "Alagoas", value: "AL" },
        { label: "Amapá", value: "AP" },
        { label: "Amazonas", value: "AM" },
        { label: "Bahia", value: "BA" },
        { label: "Ceará", value: "CE" },
        { label: "Distrito Federal", value: "DF" },
        { label: "Espírito Santo", value: "ES" },
        { label: "Goiás", value: "GO" },
        { label: "Maranhão", value: "MA" },
        { label: "Mato Grosso", value: "MT" },
        { label: "Mato Grosso do Sul", value: "MS" },
        { label: "Minas Gerais", value: "MG" },
        { label: "Pará", value: "PA" },
        { label: "Paraíba", value: "PB" },
        { label: "Paraná", value: "PR" },
        { label: "Pernambuco", value: "PE" },
        { label: "Piauí", value: "PI" },
        { label: "Rio de Janeiro", value: "RJ" },
        { label: "Rio Grande do Norte", value: "RN" },
        { label: "Rio Grande do Sul", value: "RS" },
        { label: "Rondônia", value: "RO" },
        { label: "Roraima", value: "RR" },
        { label: "Santa Catarina", value: "SC" },
        { label: "São Paulo", value: "SP" },
        { label: "Sergipe", value: "SE" },
        { label: "Tocantins", value: "TO" },
      ],
    },
    {
      name: "valorFatura",
      placeholder: "Valor da Fatura",
      type: "TEXT",
      required: true,
      mask: "numberOnly",
    },
    {
      name: "numeroCartao",
      placeholder: "Últimos 4 dígitos do cartão pagador",
      type: "NUMBER",
      required: true,
      mask: "numberOnly",
    },
    {
      name: "dataPagamento",
      placeholder: "Dia a se pagar",
      type: "TEXT",
    },
  ]);
  const { setError } = useAuth();

  useEffect(() => {
    const getTurmas = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/turmas/all`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error(await response.text());

        const turmas = await response.json();

        const turmaOptions = turmas.turmas.map((t: any) => ({
          label: t.nome,
          value: t.id,
        }));

        setAlunoFields((prev) =>
          prev.map((field) =>
            field.name === "turmaId"
              ? { ...field, options: turmaOptions }
              : field
          )
        );
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      }
    };

    getTurmas();
  }, []);
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
        throw new Error(errorText);
      }

      alert("Aluno criado com sucesso!");
    } catch (err: any) {
      console.error("Erro na requisição:", err);
      setError("Erro ao criar aluno: " + err.message);
    }
  };

  return (
    <div style={style.mainContainer}>
      <DynamicForm
        onSubmit={handleSubmit}
        fields={alunoFields}
        title="Criação de Aluno"
        sendAs="FORMDATA"
      />

      <ErrorDisplay />
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
