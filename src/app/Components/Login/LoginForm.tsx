import { useAuth } from "../../Context/AuthContext";
import Colors from "../../Utils/Colors";
import { StyleSheet } from "../../Utils/Stylesheet";
import { useState, useRef, useEffect } from "react";

export default function LoginForm({
  setUsername,
  setPassword,
  login,
}: {
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  login: () => Promise<void>;
}) {
  const [username, setUsernameLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [buttonHover, setButtonHover] = useState<boolean>(false);

  const { isLoading } = useAuth();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.style.width = `${Math.max(5, username.length + 1)}ch`;
    }
  }, [username]);

  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.style.width = `${Math.max(5, password.length + 1)}ch`;
    }
  }, [password]);

  return (
    <form action={login} style={style.mainContainer}>
      <div style={style.imageContainer}>
        <img src="/logo.png" style={style.image} />
        <h1 style={{ color: "red" }}>BETA TEST</h1>
      </div>
      <div style={style.textBoxContainer}>
        <input
          placeholder="Username"
          ref={usernameRef}
          type="text"
          style={style.textBox}
          value={username}
          onChange={(e) => {
            setUsernameLocal(e.target.value);
            setUsername(e.target.value);
          }}
        />
        <input
          placeholder="Senha"
          ref={passwordRef}
          type="password"
          style={style.textBox}
          value={password}
          onChange={(e) => {
            setPasswordLocal(e.target.value);
            setPassword(e.target.value);
          }}
        />
      </div>
      <div style={style.submitContainer}>
        <button
          type="submit"
          style={{
            ...style.submit,
            borderColor: buttonHover ? Colors.primary : Colors.border,
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {isLoading ? "Carregando..." : "Login"}
        </button>
      </div>
    </form>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    minHeight: "50vh",
    maxWidth: "70vw",
    borderRadius: 16,
    border: "1px solid",
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  image: { width: "16em" },
  textBoxContainer: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "2em",
    flex: 1,
  },
  textBox: {
    minWidth: "90%",
    maxWidth: "50ch",
    border: "1px solid",
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundAlt,
    height: "3em",
    borderRadius: 16,
    color: Colors.primary,
    fontSize: 18,
    transition: "width 0.2s",
  },
  submitContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  submit: {
    width: "17em",
    height: "2.2em",
    fontSize: "2em",
    border: "1px solid",
    borderRadius: 12,
    backgroundColor: Colors.backgroundAlt,
    color: Colors.primary,
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
});
