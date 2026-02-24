import { createContext, useContext, useState, ReactNode } from "react";

type ErrorSeverity = "info" | "warning" | "error" | "success";

type ErrorItem = {
  id: string;
  message: string;
  severity: ErrorSeverity;
  duration?: number; // auto-dismiss after ms
};

type ErrorContextType = {
  errors: ErrorItem[];
  addError: (
    message: string,
    severity?: ErrorSeverity,
    duration?: number
  ) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errors, setErrors] = useState<ErrorItem[]>([]);

  const addError = (
    message: string,
    severity: ErrorSeverity = "error",
    duration?: number
  ) => {
    const id = Date.now().toString() + Math.random();
    const newError: ErrorItem = { id, message, severity, duration };

    setErrors((prev) => [...prev, newError]);

    if (duration) {
      setTimeout(() => removeError(id), duration);
    }
  };

  const removeError = (id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  };

  const clearErrors = () => setErrors([]);

  return (
    <ErrorContext.Provider
      value={{ errors, addError, removeError, clearErrors }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) throw new Error("useError must be used within ErrorProvider");
  return context;
};
