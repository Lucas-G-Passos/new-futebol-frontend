import type { FieldConfig } from "../../Utils/Types";
import type { Aluno } from "../../Utils/Types";

export function escapeForRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function applyMask(value: string, mask: string): string {
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

export function removeMask(value: string): string {
  return value.replace(/\D/g, "");
}

export function maskToRegex(mask: string): RegExp {
  const escaped = escapeForRegex(mask);
  const regexStr = "^" + escaped.replace(/9/g, "\\d") + "$";
  return new RegExp(regexStr);
}

export function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return "N/A";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ensureNumber(value: number | undefined): number {
  return value ?? 0;
}

export function cleanValueForSubmission(value: string, mask?: string): string {
  if (!mask || !value) return value;
  const cleaned = removeMask(value);
  return cleaned.length > 0 ? cleaned : value;
}

export function formatDisplayValue(
  value: any,
  field: FieldConfig,
  data?: Aluno,
): string {
  if (!value) return "Não informado";

  if (field.name === "turmaId") {
    return (data as any)?.turmaNome || "Não informado";
  }

  switch (field.type) {
    case "DATE":
      try {
        return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
      } catch {
        return "Data inválida";
      }
    case "TIME":
      try {
        const [hours, minutes] = value.split(":");
        return `${hours}:${minutes}`;
      } catch {
        return value;
      }
    case "SELECT":
      const option = field.options?.find((opt) => opt.value === value);
      return option?.label || value;
    case "CHECKBOX":
      return value ? "Sim" : "Não";
    case "CHECKBOXGROUP":
    case "IFOKCHECKBOXGROUP":
      if (Array.isArray(value) && value.length > 0) {
        // Map the values to their labels
        const labels = value.map((v) => {
          const option = field.options?.find((opt) => opt.value === v);
          return option?.label || v;
        });
        return labels.join(", ");
      }
      return "Nenhum";

    default:
      if (field.mask && value) {
        return applyMask(removeMask(value), field.mask);
      }
      return value;
  }
}

export function getFieldValue(fieldName: string, data: Aluno): any {
  if (fieldName.includes(".")) {
    const [parent, child] = fieldName.split(".");
    return (data[parent as keyof Aluno] as any)?.[child] || "";
  }
  return data[fieldName as keyof Aluno] || "";
}

export function getFieldGroups(alunoFields: FieldConfig[]) {
  return {
    personal: alunoFields.filter((field) =>
      [
        "nomeCompleto",
        "apelido",
        "dataNascimento",
        "dataMatricula",
        "telefone1",
        "telefone2",
        "cpf",
        "rg",
        "nRegistro",
        "diasExtras",
      ].includes(field.name),
    ),
    school: alunoFields.filter((field) =>
      ["colegio", "colegioAno"].includes(field.name),
    ),
    health: alunoFields.filter((field) =>
      ["alergia", "usoMedicamento", "horarioMedicamento", "atestado"].includes(
        field.name,
      ),
    ),
    additional: alunoFields.filter((field) =>
      [
        "time",
        "indicacao",
        "observacao",
        "acordo",
        "valorUniforme",
        "isAtivo",
      ].includes(field.name),
    ),
    turma: alunoFields.filter((field) => ["turmaId"].includes(field.name)),
    responsible: alunoFields.filter((field) =>
      field.name.startsWith("responsavel."),
    ),
    endereco: alunoFields.filter((field) =>
      ["rua", "cep", "cidade", "estado", "enderecoNumero"].includes(field.name),
    ),
  };
}
