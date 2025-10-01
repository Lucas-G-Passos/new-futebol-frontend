export type User = {
  id: string;
  username: string;
  password: string;
  email?: string | null;
  permissions: [{ permission: string }];
  funcionario?: Funcionario;
};

export type Funcionario = {
  nome: string;
  dataNascimento: string;
  telefone1: string;
  telefone2?: string | null;
  cpf: string;
  rg: string;
  dataAdmissao: string;
  foto?: string | null;
  jornadaEscala?: string | null;
  situacao?: "OK" | "DESLIGADO";
  user?: User;
};

export interface Responsavel {
  aluno?: Aluno;
  cpf: string;
  rg: string;
  nomeCompleto: string;
  telefone1: string;
  telefone2?: string;
  email: string;
}

export interface Turma {
  codigoTurma?: string;
  nome?: string;
  descricao?: string;
  diaSemana?: DayOfWeek[];
  horaInicio?: string; // LocalTime → string (HH:mm:ss)
  horaTermino?: string; // LocalTime → string (HH:mm:ss)
  local?: string;
  alunos?: Aluno[];
}

export interface Aluno {
  id: number;
  nomeCompleto: string;
  dataNascimento?: Date; // LocalDate → string (YYYY-MM-DD)
  dataMatricula?: Date; // LocalDate → string (YYYY-MM-DD)
  telefone1: string;
  telefone2?: string;
  cpf: string;
  rg: string;
  alergia?: string;
  usoMedicamento?: string;
  horarioMedicamento?: string; // LocalTime → string (HH:mm:ss)
  colegio: string;
  colegioAno?: string;
  time?: string;
  indicacao?: string;
  observacao?: string;
  url?: string;
  responsavel?: Responsavel;
  turma?: Turma;
}

// Optional enum for Java DayOfWeek
export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export type FieldConfig = {
  name: string;
  placeholder: string;
  type: "TEXT" | "NUMBER" | "DATE" | "SELECT" | "FILE" | "CHECKBOX" | "TIME";
  options?: { label: string; value: string | number }[];
  defaultValue?: any;
  mask?: string;
  required?: boolean;
};

export type Campos = {
  sections: Section[];
  image?: string; // foto ou url
};

type Section = {
  label: string;
  value: string | number | boolean;
  field: {
    type: string;
    highlight?: boolean; // se true, mostra em bold
  };
};
