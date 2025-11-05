export type User = {
  id?: string;
  username: string;
  password: string;
  email?: string | null;
  permissions: [{ permission: string }];
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

  [key: string]: any;
}

export interface Turma {
  id: number;
  codigoTurma?: string;
  nome?: string;
  descricao?: string;
  diaSemana?: DayOfWeek[];
  horaInicio?: string; // LocalTime → string (HH:mm:ss)
  horaTermino?: string; // LocalTime → string (HH:mm:ss)
  local?: string;
  filialNome?: string;
  filialId?: number;
  alunos?: Aluno[];
}
export interface Filial {
  id: number;
  nome: string;
  cep: number;
  rua: string;
  enderecoNumero: string;
  cidade: string;
  estado: string;
  turmas: Turma[];
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
  acordo: string;
  pagamentos: Pagamento[];
  valorFatura: number;
  valorDevido: number;
  dataPagamento: Date;
  turmaNome: string;

  [key: string]: any;
}

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
  type:
    | "TEXT"
    | "NUMBER"
    | "DATE"
    | "SELECT"
    | "FILE"
    | "CHECKBOX"
    | "TIME"
    | "CHECKBOXGROUP"
    | "HIDDEN"
    | "TEXTIFCHECKBOXOK";
  options?: { label: string; value: string | number }[];
  defaultValue?: any;
  mask?: string;
  required?: boolean;
  ifCheckboxOk?: {
    defaultValue?: any;
    mask?: string;
    required?: boolean;
    checkBoxLabel: string;
  };
};

export type Campos = {
  sections: Section[];
  image?: string;
};

type Section = {
  label: string;
  value: string | number | boolean;
  field: {
    type: string;
    highlight?: boolean;
  };
};

export interface Pagamento {
  id: number;
  dataPago: Date;
  valorPago: number;
  metodoPagamento: "DINHEIRO" | "PIX" | "CARTAO";
  isAutomatized: boolean;
  observacao: string;
}

export interface ConciliacaoResponse {
  alunosToUpdate: Aluno[];
  pagamentosToCreate: Pagamento[];
  failedFields: Map<String, String>;
}
