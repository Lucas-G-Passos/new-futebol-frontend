import { useState, forwardRef, useImperativeHandle } from "react";
import { StyleSheet } from "../../Utils/Stylesheet";
import { useAuth } from "../../Context/AuthContext";
import Colors from "../../Utils/Colors";

type SearchFieldProps = {
  value?: string;
  onSearch: (query: string) => Promise<any>;
  onResult: (data: any) => void;
  types: "SELECT" | "TEXT";
  options?: { label: string; value: string }[];
};

export default forwardRef(function SearchField(
  { value = "", onSearch, onResult, types, options }: SearchFieldProps,
  ref: React.Ref<{ getValue: () => string; setValue: (value: string) => void }>
) {
  const [searchValue, setSearchValue] = useState<string>(value);
  const { setError } = useAuth();

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    getValue: () => searchValue,
    setValue: (value: string) => setSearchValue(value),
  }));

  const handleSearch = async () => {
    try {
      const result = await onSearch(searchValue);
      onResult(result);
    } catch (err: any) {
      console.error("Erro na busca:", err);
      onResult(null);
      setError(err);
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={style.mainContainer}>
      {types === "TEXT" && (
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite para buscar"
          style={style.input}
        />
      )}

      {types === "SELECT" && (
        <select
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={style.select}
        >
          <option value="">Selecione uma opção</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      <button onClick={handleSearch} style={style.button}>
        Buscar
      </button>
    </div>
  );
});

const style = StyleSheet.create({
  mainContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    padding: "16px",
    backgroundColor: Colors.surface,
    borderRadius: "8px",
  },
  input: {
    flex: 1,
    padding: "8px 12px",
    border: `1px solid ${Colors.border}`,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: "4px",
    fontSize: "14px",
    color: "white",
  },
  select: {
    flex: 1,
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "white",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: Colors.primary,
    color: "black",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
});
