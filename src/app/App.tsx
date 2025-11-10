import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import Navbar from "./Components/Navbar";
import { useAuth } from "./Context/AuthContext";
import Login from "./Login";
import CreationFormPage from "./Pages/CreationFormPage";
import Filial from "./Pages/Filial";
import Home from "./Pages/Home";
import Pagamentos from "./Pages/Pagamentos";
import Search from "./Pages/Search";
import Turmas from "./Pages/Turmas";
import UserManagement from "./Pages/UserManagement";
import "./Utils/global.css";

export default function App() {
  const { isLogged, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    const isInProtected = location?.pathname.startsWith("/app");

    if (!isLogged && isInProtected) navigate("/");

    if (isLogged && location?.pathname === "/") navigate("/app/home");
  }, [isLogged, isLoading]);
  if (isLoading) return null;
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<Navbar />}>
        <Route path="home" element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="turmas" element={<Turmas />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="form" element={<CreationFormPage />} />
        <Route path="pagamentos" element={<Pagamentos />} />
        <Route path="filiais" element={<Filial />} />
      </Route>
    </Routes>
  );
}
