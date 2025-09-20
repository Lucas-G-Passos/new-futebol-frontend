import { StyleSheet } from "../Utils/Stylesheet";

export default function UserManagement() {
  return <div style={style.mainContainer}>Usuarios</div>;
}

const style = StyleSheet.create({
  mainContainer: { flex: 1, overflow: "auto" },
});
