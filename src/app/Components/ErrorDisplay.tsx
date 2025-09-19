import { X } from "@phosphor-icons/react";
import { useAuth } from "../Context/AuthContext";
import Colors from "../Utils/Colors";
import { StyleSheet } from "../Utils/Stylesheet";

export default function ErrorDisplay() {
  const { error, clearError } = useAuth();
  return (
    <>
      {error ? (
        <div style={style.errorContainer}>
          <p style={style.error}>{error}</p>
          <button type="button" onClick={clearError} style={style.button}>
            <X size={25} color={Colors.error} />
          </button>
        </div>
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
    color: Colors.error,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  error: {
    userSelect: "none",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },
});
