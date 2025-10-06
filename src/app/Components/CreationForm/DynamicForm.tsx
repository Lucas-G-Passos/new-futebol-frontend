import { useEffect, useState, useRef } from "react";
import Colors from "../../Utils/Colors";
import { StyleSheet } from "../../Utils/Stylesheet";
import type { FieldConfig } from "../../Utils/Types";

type Props = {
  fields: FieldConfig[];
  onSubmit: (formData: any) => Promise<void>;
  title: string;
  sendAs: "JSON" | "FORMDATA";
};

function escapeForRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyMask(value: string, mask: string): string {
  let result = "";
  let valIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (valIndex >= value.length) break;

    const m = mask[i];
    if (m === "9") {
      if (/\d/.test(value[valIndex])) {
        result += value[valIndex];
        valIndex++;
      } else {
        valIndex++;
        i--;
      }
    } else {
      result += m;
      if (value[valIndex] === m) {
        valIndex++;
      }
    }
  }

  return result;
}

function removeMask(value: string): string {
  return value.replace(/\D/g, "");
}

function cleanValueForSubmission(value: string, mask?: string): string {
  if (!mask || !value) return value;

  const cleaned = removeMask(value);

  return cleaned.length > 0 ? cleaned : value;
}

function maskToRegex(mask: string): RegExp {
  const escaped = escapeForRegex(mask);
  const regexStr = "^" + escaped.replace(/9/g, "\\d") + "$";
  return new RegExp(regexStr);
}

export default function DynamicForm({
  fields,
  onSubmit,
  title,
  sendAs,
}: Props) {
  const [isHovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formState, setFormState] = useState<Record<string, any>>(
    Object.fromEntries(
      fields.map((f) => [
        f.name,
        f.defaultValue ?? (f.type === "CHECKBOXGROUP" ? [] : ""),
      ])
    )
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cepTimerRef = useRef<number | null>(null);

  const handleChange = (name: string, rawValue: any, mask?: string) => {
    let value = rawValue;
    let errorMsg = "";

    if (mask && typeof rawValue === "string") {
      const digits = rawValue.replace(/\D/g, "");
      value = applyMask(digits, mask);

      const regex = maskToRegex(mask);
      if (value && !regex.test(value)) {
        errorMsg = "Formato inválido";
      }
    }

    setFormState((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    // If the user is typing the CEP, debounce a lookup and autofill address fields
    if (name === "cep" && typeof value === "string") {
      const digits = value.replace(/\D/g, "");

      // clear existing timer
      if (cepTimerRef.current) {
        window.clearTimeout(cepTimerRef.current);
        cepTimerRef.current = null;
      }

      if (digits.length >= 8) {
        // debounce API call by 500ms
        cepTimerRef.current = window.setTimeout(async () => {
          try {
            const res = await fetch(`https://opencep.com/v1/${digits}.json`);
            if (!res.ok) throw new Error("CEP não encontrado");
            const data: any = await res.json();

            // Map API fields to our form fields: logradouro -> rua, localidade -> cidade, uf -> estado
            setFormState((prev) => ({
              ...prev,
              rua: data.logradouro ?? prev.rua,
              cidade: data.localidade ?? prev.cidade,
              estado: data.uf ?? prev.estado,
            }));

            setErrors((prev) => ({ ...prev, cep: "" }));
          } catch (err: any) {
            setErrors((prev) => ({ ...prev, cep: "CEP não encontrado" }));
          } finally {
            cepTimerRef.current = null;
          }
        }, 500);
      }
    }
  };

  const handleCheckboxGroupChange = (
    fieldName: string,
    optionValue: string,
    isChecked: boolean
  ) => {
    setFormState((prev) => {
      const currentValues = prev[fieldName] || [];
      let newValues;

      if (isChecked) {
        newValues = [...currentValues, optionValue];
      } else {
        newValues = currentValues.filter(
          (value: string) => value !== optionValue
        );
      }

      return { ...prev, [fieldName]: newValues };
    });

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sendAs === "FORMDATA") {
      const newErrors: Record<string, string> = {};
      fields.forEach((field) => {
        const value = formState[field.name];

        if (field.required) {
          let empty = false;

          if (field.type === "CHECKBOX") {
            empty = value !== true;
          } else if (field.type === "CHECKBOXGROUP") {
            empty = !value || value.length === 0;
          } else {
            empty = value === "" || value == null;
          }

          if (empty) {
            newErrors[field.name] = "Campo obrigatório";
            return;
          }
        }

        if (field.mask && value && typeof value === "string") {
          const regex = maskToRegex(field.mask);
          if (!regex.test(value)) {
            newErrors[field.name] = "Formato inválido";
          }
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data = new FormData();

      for (const [key, value] of Object.entries(formState)) {
        const fieldConfig = fields.find((f) => f.name === key);

        if (value instanceof File) {
          data.append(key, value);
        } else if (fieldConfig?.mask && typeof value === "string") {
          const cleanedValue = cleanValueForSubmission(value, fieldConfig.mask);
          data.append(key, cleanedValue);
        } else if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      }
      await onSubmit(data);
    }
    if (sendAs === "JSON") {
      const jsonData: Record<string, any> = {};

      for (const [key, value] of Object.entries(formState)) {
        const fieldConfig = fields.find((f) => f.name === key);

        if (fieldConfig?.mask && typeof value === "string") {
          jsonData[key] = cleanValueForSubmission(value, fieldConfig.mask);
        } else {
          jsonData[key] = value;
        }
      }

      await onSubmit(jsonData);
    }
  };

  return (
    <form
      style={{ ...style.mainContainer, width: isMobile ? "80vw" : "50vw" }}
      onSubmit={handleSubmit}
    >
      <h1 style={{ color: Colors.primary, textAlign: "center" }}>{title}</h1>
      {fields.map((field) => {
        const [isHoveredField, setHoveredField] = useState(false);
        const error = errors[field.name];

        const labelWithRequired = (
          <p style={style.label}>
            {field.placeholder}{" "}
            {field.required && <span style={{ color: "red" }}>*</span>}
          </p>
        );

        switch (field.type) {
          case "TEXT":
          case "NUMBER":
          case "DATE":
          case "TIME":
            return (
              <div style={style.fieldGroup} key={field.name}>
                {labelWithRequired}
                <input
                  type={field.type.toLowerCase()}
                  placeholder={field.placeholder}
                  value={formState[field.name] ?? ""}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value, field.mask)
                  }
                  style={{
                    ...style.input,
                    borderColor: error
                      ? "red"
                      : isHoveredField
                      ? Colors.primary
                      : Colors.border,
                    backgroundColor: isHoveredField
                      ? Colors.surfaceAlt
                      : Colors.inputBackground,
                  }}
                  onMouseEnter={() => setHoveredField(true)}
                  onMouseLeave={() => setHoveredField(false)}
                />
                {error && <span style={style.error}>{error}</span>}
              </div>
            );
          case "FILE":
            return (
              <div style={style.fieldGroup} key={field.name}>
                {labelWithRequired}
                <input
                  type="file"
                  onChange={(e) =>
                    handleChange(field.name, e.target.files?.[0] ?? null)
                  }
                  style={style.input}
                />
                {error && <span style={style.error}>{error}</span>}
              </div>
            );
          case "SELECT":
            return (
              <div style={style.fieldGroup} key={field.name}>
                {labelWithRequired}
                <select
                  value={formState[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  style={{
                    ...style.input,
                    borderColor: error ? "red" : Colors.border,
                  }}
                >
                  <option value="">Selecione...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {error && <span style={style.error}>{error}</span>}
              </div>
            );
          case "CHECKBOX":
            return (
              <div style={style.checkboxWrapper} key={field.name}>
                <label style={style.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={!!formState[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    style={style.checkbox}
                  />
                  {field.placeholder}{" "}
                  {field.required && <span style={{ color: "red" }}>*</span>}
                </label>
                {error && <span style={style.error}>{error}</span>}
              </div>
            );
          case "CHECKBOXGROUP":
            return (
              <div style={style.fieldGroup} key={field.name}>
                {labelWithRequired}
                <div style={style.checkboxGroup}>
                  {field.options?.map((option) => {
                    const isChecked = (formState[field.name] || []).includes(
                      option.value
                    );
                    return (
                      <label
                        key={option.value}
                        style={style.checkboxGroupLabel}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (typeof option.value === "number") return;
                            handleCheckboxGroupChange(
                              field.name,
                              option.value,
                              e.target.checked
                            );
                          }}
                          style={style.checkbox}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
                {error && <span style={style.error}>{error}</span>}
              </div>
            );
        }
      })}
      <button
        type="submit"
        style={{
          ...style.button,
          backgroundColor: !isHovered ? Colors.surfaceAlt : Colors.primary,
          color: isHovered ? Colors.black : Colors.primary,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Salvar
      </button>
    </form>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    width: "50vw",
    minHeight: "50vh",
    borderRadius: 16,
    border: `1px solid ${Colors.border}`,
    backgroundColor: Colors.surface,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textLight,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${Colors.border}`,
    backgroundColor: Colors.inputBackground,
    color: Colors.text,
    fontSize: 14,
    transition: "all .2s ease",
  },
  error: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "12px",
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    border: `1px solid ${Colors.border}`,
  },
  checkboxGroupLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontSize: 14,
    color: Colors.text,
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: Colors.primary,
    cursor: "pointer",
  },
  button: {
    marginTop: 8,
    padding: "12px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    color: Colors.black,
    fontWeight: "600",
    fontSize: 15,
    transition: "all .2s ease",
  },
});
