import { Route, Routes } from "react-router";
import { useEffect } from "react";
import { useAuth } from "./Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import Login from "./Login";
import "./Utils/global.css";
import Home from "./Protected/Home";

export default function App() {
  const { isLogged, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    const isInProtected = location?.pathname.startsWith("/app");

    if (!isLogged && isInProtected) navigate("/login");

    if (isLogged && location?.pathname === "/login") navigate("/app/home");
  }, [isLogged, isLoading, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app">
        <Route path="home" element={<Home />} />
      </Route>
    </Routes>
  );
}
