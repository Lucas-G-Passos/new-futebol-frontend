import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../Utils/Types";
import mockAPI from "../Utils/mockData";

type AuthContextType = {
  isLogged: boolean;
  isLoading: boolean;
  user: User | null;
  setUserG: (user: User) => Promise<any>;
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
  setUserG: async () => {},
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
    // Auto-login with mock user
    const autoLogin = async () => {
      try {
        setLoading(true);
        const mockUser = await mockAPI.getCurrentUser();
        setUser(mockUser);
        setToken('mock-jwt-token');
        setLogged(true);
      } catch (error) {
        console.error('Auto-login error:', error);
        setLogged(false);
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, []);

  const login = async (usernam: string, passwor: string) => {
    if (!usernam || !passwor) {
      setLocalError("Username e senha são obrigatórios!");
      return;
    }
    try {
      setLoading(true);
      setLocalError(null);

      const resToken = await mockAPI.login(usernam, passwor);
      setToken(resToken.token);

      const mockUser = await mockAPI.getCurrentUser();
      setUser(mockUser);
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
  const setUserG = async (user: User) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        isLoading,
        user,
        setUserG,
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
