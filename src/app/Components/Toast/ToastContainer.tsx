import { useError } from "../../Context/ErrorContext";
import Toast from "./Toast";
import { StyleSheet } from "../../Utils/Stylesheet";

export default function ToastContainer() {
  const { errors, removeError } = useError();

  return (
    <div style={style.container}>
      {errors.map((error) => (
        <Toast
          key={error.id}
          message={error.message}
          severity={error.severity}
          onClose={() => removeError(error.id)}
        />
      ))}
    </div>
  );
}

const style = StyleSheet.create({
  container: {
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 400,
  },
});
