import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import type { User } from "../Utils/types";

type AuthContextType = {
  isLogged: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
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
  clearError: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setLogged] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      return;
    };
    checkToken();
  }, []);

  const login = async (usernam: string, passwor: string) => {
    if (!usernam || !passwor) {
      setError("Username e senha são obrigatórios!");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.VITE_BACKEND_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
          headers: {
            Authorization: `Bearer ${resToken}`,
            "Content-Type": "application/json",
          },
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
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      setToken(null);
      setUser(null);
      setLogged(false);
    } catch (error) {
      console.error(error);
      setError("Erro ao fazer logout");
    } finally {
      setLoading(false);
    }
  };
  const clearError = () => {
    setError("");
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
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
