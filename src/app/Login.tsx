import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import { StyleSheet } from "./Utils/Stylesheet";
import LoginForm from "./Components/Login/LoginForm";
import colors from "./Utils/Colors";
import ErrorDisplay from "./Components/ErrorDisplay";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, error, clearError, setError } = useAuth();

  const handleSetUsername = (username: string) => {
    setUsername(username);
  };
  const handleSetPassword = (password: string) => {
    setPassword(password);
  };
  const handleLogin = async () => {
    if (username === "" || password === "")
      setError("Username e senha são obrigatórios");
    login(username, password);
  };

  useEffect(() => {
    console.log(username + " " + password);
  }, [username, password]);

  return (
    <div style={style.mainContainer}>
      <LoginForm
        setUsername={handleSetUsername}
        setPassword={handleSetPassword}
        login={handleLogin}
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
    backgroundColor: colors.background,
    flexDirection: "column",
  },
  error: {
    color: colors.error,
  },
});
