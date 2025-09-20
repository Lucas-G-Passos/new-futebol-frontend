import { Route, Routes } from "react-router";
import { useEffect } from "react";
import { useAuth } from "./Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import Login from "./Login";
import "./Utils/global.css";
import Home from "./Protected/Home";
import Navbar from "./Components/Navbar";
import Search from "./Protected/Search";
import TurmaManagement from "./Protected/TurmaManagement";
import UserManagement from "./Protected/UserManagement";

export default function App() {
  const { isLogged, isLoading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    const isInProtected = location?.pathname.startsWith("/app");

    if (!isLogged && isInProtected) navigate("/");

    if (isLogged && location?.pathname === "/") navigate("/app/home");

    console.log("isLoading? " + isLoading);
    console.log("IsLogged? " + isLogged);
    console.log("IsInProtected? " + isInProtected);
    console.log("Pathname " + location.pathname);
    console.log("User: " + JSON.stringify(user));
    console.log("Running?");
  }, [isLogged, isLoading, location.pathname]);
  if (isLoading) return null;
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<Navbar />}>
        <Route path="home" element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="turma" element={<TurmaManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}
