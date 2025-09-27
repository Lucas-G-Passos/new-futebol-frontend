import { X } from "@phosphor-icons/react";
import { useAuth } from "../Context/AuthContext";
import Colors from "../Utils/Colors";
import { StyleSheet } from "../Utils/Stylesheet";

export default function ErrorDisplay() {
  const { error, clearError } = useAuth();
  return (
    <>
      {error ? (
        <button style={style.errorContainer} onClick={clearError}>
          <p style={style.error}>{error}</p>
          <div style={style.iconContainer}>
            <X size={25} color={"red"} />
          </div>
        </button>
      ) : (
        <></>
      )}
    </>
  );
}

const style = StyleSheet.create({
  errorContainer: {
    margin: 15,
    minWidth: "10vw",
    color: "black",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
    backgroundColor: "#e6a8a8ff",
    borderRadius: 16,
    padding: 10,
    border: "2px solid",
    borderColor: "#fc7c7cff",
    cursor: "pointer",
  },
  error: {
    userSelect: "none",
    fontSize: 16,
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "none",
  },
});
