import { Outlet } from "react-router";
import { StyleSheet } from "../Utils/Stylesheet";
import Colors from "../Utils/Colors";
import { useAuth } from "../Context/AuthContext";
import { UserCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PencilSimpleLineIcon,
  UsersFourIcon,
} from "@phosphor-icons/react";

export default function Navbar() {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={style.mainContainer}>
      <div style={style.navbar}>
        <div
          style={style.logoContainer}
          onClick={() => {
            if (isMobile) setMenuOpen((prev) => !prev);
          }}
        >
          <img src="/logo.png" style={style.logo} />
        </div>

        {!isMobile && (
          <div style={style.buttonContainer}>
            <NavButton
              path="/app/search"
              label="Pesquisa"
              icon={<MagnifyingGlassIcon size={32} />}
            />
            <NavButton
              path="/app/form"
              label="Form"
              icon={<PencilSimpleLineIcon size={32} />}
            />
            <NavButton
              path="/app/turmas"
              label="Turmas"
              icon={<UsersFourIcon size={32} />}
            />
            <NavButton
              path="/app/users"
              label="Usuários"
              icon={<UserCircleIcon size={32} />}
            />
          </div>
        )}

        <div style={style.profileContainer}>
          {user ? (
            <div style={{ marginLeft: "auto" }}>
              <div style={style.profileRow}>
                <div>
                  <UserCircleIcon size={32} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {user.username}
                  <div style={{ fontSize: 11, fontStyle: "italic" }}>
                    {user.permissions.map((p) => (
                      <>{p.permission}, </>
                    ))}
                  </div>
                </div>
              </div>
              {user.email === null && (
                <div style={{ fontStyle: "italic", fontSize: "0.8em" }}>
                  Considere criar um usuário com email.
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {isMobile && menuOpen && (
        <div style={{ ...style.mobileMenuRow, padding: 0 }}>
          <NavButton
            path="/app/search"
            label="Pesquisa"
            icon={<MagnifyingGlassIcon size={32} />}
          />
          <NavButton
            path="/app/form"
            label="Form"
            icon={<PencilSimpleLineIcon size={32} />}
          />
          <NavButton
            path="/app/turmas"
            label="Turmas"
            icon={<UsersFourIcon size={32} />}
          />
          <NavButton
            path="/app/users"
            label="Usuários"
            icon={<UserCircleIcon size={32} />}
          />
        </div>
      )}
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
  setOpen,
}: {
  path: string;
  icon: React.ReactNode;
  label: string;
  setOpen?: (a: boolean) => void;
}) {
  const navigate = useNavigate();
  const [isHovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...style.navButton,
        borderColor: isHovered ? Colors.primary : Colors.border,
      }}
      onClick={() => {
        if (setOpen) setOpen(false);
        navigate(path);
      }}
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
    height: "10vh",
    backgroundColor: Colors.backgroundAlt,
    borderBottom: "1px solid",
    borderColor: Colors.border,
    width: "100vw",
    display: "flex",
    position: "fixed",
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
    cursor: "pointer",
  },
  profileRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  logo: { width: "5em" },
  content: {
    flex: 1,
    overflow: "auto",
    paddingTop: "11vh",
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
  mobileMenuRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.backgroundAlt,
    borderBottom: `1px solid ${Colors.border}`,
    padding: 10,
    marginTop: "10vh", // ensures it appears under the navbar
    position: "fixed",
    width: "100vw",
    zIndex: 1,
  },
});
