import Colors from "../../Utils/Colors";
import { StyleSheet } from "../../Utils/Stylesheet";
import type { Aluno } from "../../Utils/Types";
import { SearchResults } from "../Search/SearchField";

export default function GenericSearcher({
  data,
  onClick,
  title,
}: {
  data: Array<Aluno>;
  onClick: (aluno: Aluno) => void | Promise<void>;
  title: string;
}) {
  return (
    <div style={style.mainContainer}>
      <h1 style={style.title}>{title}</h1>
      <SearchResults data={data} type="ALUNO" onClick={onClick} />
    </div>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "20px",
    backgroundColor: Colors.surface,
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  title: {
    color: Colors.primary,
    fontSize: "24px",
    fontWeight: "700",
    margin: 0,
    marginBottom: "4px",
  },
});
