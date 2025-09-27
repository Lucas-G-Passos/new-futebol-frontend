import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../Utils/Types";

type AuthContextType = {
  isLogged: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  setError: (errorMessage: string) => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  isLoading: true,
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  error: null,
  setError: () => {},
  clearError: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setLogged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/check`,
          { credentials: "include" }
        );
        if (!response.ok) {
          setLogged(false);
          return;
        }
        const userCharacteristics = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/get`,
          {
            credentials: "include",
          }
        );
        if (!userCharacteristics) {
          throw new Error("Erro ao pegar informações do usuário");
        }
        const user = await userCharacteristics.json();
        setUser(user);
        setLogged(true);
      } catch (error) {
        console.error(error);
      }
    };

    checkToken();
  }, []);

  const login = async (usernam: string, passwor: string) => {
    if (!usernam || !passwor) {
      setLocalError("Username e senha são obrigatórios!");
      return;
    }
    try {
      setLoading(true);
      setLocalError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username: usernam, password: passwor }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Username ou senha inválidos");
        } else if (response.status >= 500) {
          throw new Error("Erro no servidor, tente novamente mais tarde");
        } else {
          throw new Error("Erro ao fazer login");
        }
      }

      const resToken = await response.text();
      setToken(resToken);
      const userCharacteristics = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/get`,
        {
          credentials: "include",
        }
      );

      if (!userCharacteristics.ok) {
        if (userCharacteristics.status === 401) {
          throw new Error("Username ou senha inválidos");
        } else if (response.status >= 500) {
          throw new Error("Erro no servidor, tente novamente mais tarde");
        } else {
          throw new Error("Erro ao fazer login");
        }
      }
      const user = await userCharacteristics.json();
      setUser(user);
      setLogged(true);
    } catch (error: any) {
      console.error("Erro ao fazer login: ", error);
      setLocalError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      setLoading(true);
      setLocalError(null);
      setToken(null);
      setUser(null);
      setLogged(false);
    } catch (error) {
      console.error(error);
      setLocalError("Erro ao fazer logout");
    } finally {
      setLoading(false);
    }
  };
  const clearError = () => {
    setLocalError("");
  };
  const setError = (errorMessage: string) => {
    setLocalError(errorMessage);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        isLoading,
        user,
        token,
        login,
        logout,
        error,
        setError,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
