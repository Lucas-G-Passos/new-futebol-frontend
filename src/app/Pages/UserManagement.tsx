import { useEffect, useState } from "react";
import UserTable from "../Components/Users/UsersTable";
import { StyleSheet } from "../Utils/Stylesheet";
import { type FieldConfig, type User } from "../Utils/Types";
import DynamicForm from "../Components/CreationForm/DynamicForm";
import Colors from "../Utils/Colors";
import mockAPI from "../Utils/mockData";

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

const fieldsEdit: FieldConfig[] = [
  {
    name: "username",
    placeholder: "Username",
    type: "TEXT",
    required: true,
  },
  {
    name: "password",
    placeholder: "Senha",
    type: "TEXTIFCHECKBOXOK",
    ifCheckboxOk: { checkBoxLabel: "Alterar senha?", required: true },
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
  const [editForm, setEditForm] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Record<string, any> | null>(
    null
  );
  const [refresh, setRefresh] = useState<boolean>(false);
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await mockAPI.getAllUsers();
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
      };
      console.log("Userdata: " + userData);

      const result = await mockAPI.createUser(userData);

      console.log("Usuario Criado!" + result);

      setCreateForm(false);
      setRefresh(!refresh);
      alert("Usuário criado com sucesso!");
    } catch (error: any) {
      console.error("Error creating usuario:", error);
      alert("Erro ao criar usuário: " + error.message);
    }
  };

  const handleEditUser = async (formData: Record<string, any>) => {
    try {
      setEditForm(true);
      const userData = {
        id: formData.id,
        username: formData.username,
        email: formData.email || undefined,
        password: formData.password,
        permissions: formData.permissions,
        funcionarioId: formData.funcionarioId,
      };

      await mockAPI.updateUser(userData);

      console.log("User edit data prepared:", userData);

      alert("Usuário alterado com sucesso!");

      setEditForm(false);
      setRefresh(!refresh);
    } catch (error: any) {
      console.error("Error editing user:", error);
      alert("Erro ao editar usuário: " + error.message);
    }
  };

  const handleSelectUserForEdit = (formData: Record<string, any>) => {
    console.log("Selecting user:", formData);
    setSelectedUser(formData);
    setEditForm(true);
  };

  return (
    <div style={style.mainContainer}>
      <div style={style.header}>
        <h1 style={style.title}>Usuários</h1>
        <button onClick={() => setCreateForm(true)} style={style.createButton}>
          + Novo Usuário
        </button>
      </div>

      {showCreateForm && (
        <div style={style.formOverlay}>
          <div style={style.formContainer}>
            <DynamicForm
              onSubmit={handleCreateUser}
              fields={fields}
              title="Criar Novo Usuário"
              sendAs="JSON"
            />
          </div>
        </div>
      )}

      {editForm &&
        selectedUser &&
        (() => {
          let userFieldsWithDefaults: FieldConfig[] = fieldsEdit.map(
            (field) => ({
              ...field,
              defaultValue: selectedUser ? selectedUser[field.name] ?? "" : "",
            })
          );
          userFieldsWithDefaults.push({
            name: "id",
            type: "HIDDEN",
            placeholder: "",
            defaultValue: selectedUser.id,
            required: true,
          });

          return (
            <div style={style.formOverlay}>
              <div style={style.formContainer}>
                <DynamicForm
                  onSubmit={handleEditUser}
                  fields={userFieldsWithDefaults}
                  title={`Editar Usuário: ${selectedUser.username}`}
                  sendAs="JSON"
                />
              </div>
            </div>
          );
        })()}

      {users && <UserTable data={users} onEdit={handleSelectUserForEdit} />}
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
