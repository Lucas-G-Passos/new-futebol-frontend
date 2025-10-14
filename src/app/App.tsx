import { Route, Routes } from "react-router";
import { useEffect } from "react";
import { useAuth } from "./Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import Login from "./Login";
import "./Utils/global.css";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Search from "./Pages/Search";
import UserManagement from "./Pages/UserManagement";
import CreationFormPage from "./Pages/CreationFormPage";
import Turmas from "./Pages/Turmas";

export default function App() {
  const { isLogged, isLoading, setUserG } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    const isInProtected = location?.pathname.startsWith("/app");

    if (!isLogged && isInProtected) navigate("/");

    if (isLogged && location?.pathname === "/") navigate("/app/home");
    const getUser = async () => {
      if (isLogged) {
        const userCharacteristics = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/get`,
          {
            credentials: "include",
          }
        );
        const user = await userCharacteristics.json();
        setUserG(user);
      }
    };
    getUser();
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
