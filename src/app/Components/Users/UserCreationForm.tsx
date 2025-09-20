import { title } from "process";
import { StyleSheet } from "../../Utils/Stylesheet";
import Colors from "../../Utils/Colors";
import { useState } from "react";
import { User } from "../../Utils/Types";

export default function UserCreationForm() {
  const handleSubmit = async (user: User) => {
    if (!user) return;
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/create`,
      {
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          permissions: user.permissions,
          email: user?.email,
        }),
      }
    );
  };
  const [user, setUser] = useState<User>();
  return (
    <form action={handleSubmit(user)}>
      <div style={style.title}>Criação de usuário</div>
    </form>
  );
}

const style = StyleSheet.create({
  title: { color: Colors.primaryLight },
});
