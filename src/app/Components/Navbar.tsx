import { Outlet } from "react-router";
import { StyleSheet } from "../Utils/Stylesheet";
import Colors from "../Utils/Colors";
import { useAuth } from "../Context/AuthContext";
import { UserCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <div style={style.mainContainer}>
      <div style={style.navbar}>
        <div style={style.logoContainer}>
          <img src="/logo.png" style={style.logo} />
        </div>
        <div style={style.buttonContainer}>
          <NavButton
            path="/app/users"
            label="Users"
            icon={<UserCircleIcon size={32} />}
          />
          <NavButton
            path="/app/search"
            label="teste"
            icon={<UserCircleIcon size={32} />}
          />
          <NavButton
            path="/app/search"
            label="teste"
            icon={<UserCircleIcon size={32} />}
          />
          <NavButton
            path="/app/search"
            label="teste"
            icon={<UserCircleIcon size={32} />}
          />
        </div>
        <div style={style.profileContainer}>
          {user ? (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div>
                  {user.funcionario && user.funcionario.foto ? (
                    <img
                      src={user.funcionario.foto}
                      style={{ width: "4em", borderRadius: "50%" }}
                    />
                  ) : (
                    <>
                      <UserCircleIcon size={32} />
                    </>
                  )}
                </div>
                {user.username}
                {user.permissions.some((p) => p.permission === "admin") && (
                  <div style={{ color: "red", fontWeight: "bold" }}>Admin</div>
                )}
              </div>
              {user.funcionario === null && (
                <div style={{ fontStyle: "italic", fontSize: "0.8em" }}>
                  Considere criar um usuário vinculado a um funcionário
                </div>
              )}
            </div>
          ) : (
            <div>Não logado</div>
          )}
        </div>
      </div>
      <div style={style.content}>
        <Outlet />
      </div>
    </div>
  );
}
function NavButton({
  path,
  icon,
  label,
}: {
  path: string;
  icon: React.ReactNode;
  label: string;
}) {
  const navigate = useNavigate();
  const [isHovered, setHovered] = useState<boolean>(false);
  return (
    <div
      style={{
        ...style.navButton,
        borderColor: isHovered ? Colors.primary : Colors.border,
      }}
      onClick={() => navigate(`${path}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      {label}
    </div>
  );
}
const style = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    minWidth: "100vw",
    flex: 1,
  },
  navbar: {
    boxSizing: "border-box",
    padding: 15,
    minHeight: "5vh",
    backgroundColor: Colors.backgroundAlt,
    borderBottom: "1px solid",
    borderColor: Colors.border,
    width: "100vw",
    display: "flex",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 4,
    display: "flex",
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  profileContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  logo: { width: "5em" },
  content: {
    flex: 1,
    overflow: "auto",
  },
  navButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    margin: 5,
    padding: 5,
    border: "1px solid",
    maxWidth: "5em",
    minHeight: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    transition: "all .2s ease-in",
    userSelect: "none",
    cursor: "pointer",
  },
});
