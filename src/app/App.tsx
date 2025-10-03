import { Route, Routes } from "react-router";
import { useEffect } from "react";
import { useAuth } from "./Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import Login from "./Login";
import "./Utils/global.css";
import Home from "./Protected/Home";
import Navbar from "./Components/Navbar";
import Search from "./Protected/Search";
import UserManagement from "./Protected/UserManagement";
import CreationFormPage from "./Protected/CreationFormPage";
import Turmas from "./Protected/Turmas";

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
      </Route>
    </Routes>
  );
}
