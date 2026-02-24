import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./app/Context/AuthContext.tsx";
import { ErrorProvider } from "./app/Context/ErrorContext.tsx";
import ToastContainer from "./app/Components/Toast/ToastContainer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer />
    </ErrorProvider>
  </StrictMode>
);
