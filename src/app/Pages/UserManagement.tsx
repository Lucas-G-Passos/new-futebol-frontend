import { useEffect, useState } from "react";
import UserTable from "../Components/Users/UsersTable";
import { StyleSheet } from "../Utils/Stylesheet";
import type { FieldConfig, User } from "../Utils/Types";
import DynamicForm from "../Components/CreationForm/DynamicForm";

const fields: FieldConfig[] = [
  {
    name: "username",
    placeholder: "Username",
    type: "TEXT",
    required: true,
  },
  {
    name: "password",
    placeholder: "Senha",
    type: "TEXT",
    required: true,
  },
  {
    name: "email",
    placeholder: "E-Mail",
    type: "TEXT",
  },
  {
    name: "permissions",
    type: "CHECKBOXGROUP",
    placeholder: "Permissões",
    options: [
      { label: "Admin", value: "ADMIN" },
      { label: "Alunos", value: "ALUNOS" },
      { label: "Funcionarios", value: "FUNCIONARIOS" },
      { label: "Pagamentos", value: "PAGAMENTOS" },
      { label: "Turmas", value: "TURMAS" },
    ],
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [showCreateForm, setCreateForm] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/all`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Erro ao pegar usuários");
        const data = await response.json();
        setUsers(data);
      } catch (e) {
        alert(e);
      }
    };
    getData();
  }, [refresh]);

  const handleCreateUser = async (formdata: Record<string, any>) => {
    try {
      const userData: User = {
        username: formdata.username,
        email: formdata?.email,
        password: formdata.password,
        permissions: formdata.permissions,
        funcionarioId: formdata.funcionarioId,
      };
      console.log("Userdata: " + userData);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao criar turma");
      }

      const result = await response.json();

      console.log("Usuario Criado!" + result);

      setCreateForm(false);
      setRefresh(!refresh);
      alert("Usuário criado com sucesso!");
    } catch (error: any) {
      console.error("Error creating usuario:", error);
      alert("Erro ao criar usuário: " + error.message);
    }
  };

  return (
    <div style={style.mainContainer}>
      <h1>Usuários</h1>
      {users && <UserTable data={users} onEdit={() => {}} />}
      {showCreateForm && (
        <DynamicForm
          fields={fields}
          title="Criação de usuário"
          sendAs="JSON"
          onSubmit={handleCreateUser}
        />
      )}
    </div>
  );
}

const style = StyleSheet.create({
  mainContainer: { flex: 1, overflow: "auto" },
});
