export type User = {
  id?: string;
  username: string;
  password: string;
  email?: string | null;
  permissions: string[];
  filialIds: Array<number>;
  filialNames: Array<String>;
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

  dataNascimento?: string; // YYYY-MM-DD
  dataMatricula?: string; // YYYY-MM-DD
  horarioMedicamento?: string; // HH:mm:ss

  telefone1: string;
  telefone2?: string;

  cpf: string;
  rg: string;

  alergia?: string;
  usoMedicamento?: string;

  colegio: string;
  colegioAno?: string;
  time?: string;
  indicacao?: string;
  observacao?: string;
  acordo?: string;

  cep?: string;
  rua?: string;
  enderecoNumero?: string;
  cidade?: string;
  estado?: string;

  isAtivo?: boolean;

  filePath?: string;
  atestadoFile?: string;
  atestadoUrl?: string;
  url?: string;

  turmaId?: number;
  turmaNome?: string;

  isAdimplente?: boolean;

  valorFatura?: number; // BigDecimal → number
  valorDevido?: number; // BigDecimal → number
  valorUniforme?: number; // BigDecimal → number

  dataPagamento?: number; // backend usa int

  numeroCartao?: string;

  apelido?: string;
  nRegistro?: number;

  pagamento?: Pagamento[];
  intervalosInadimplencia?: IntervaloInadimplencia[];

  diasExtras: Array<string>

  responsavel?: {
    nomeCompleto: string;
    cpf: string;
    rg: string;
    telefone1: string;
    telefone2?: string;
    email?: string;
  };
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
    | "TEXTIFCHECKBOXOK"
    | "IFOKCHECKBOXGROUP";
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

export interface IntervaloInadimplencia {
  id: number;
  dataInicio: Date;
  dataTermino?: Date | null;
  causaInicio: string;
  causaTermino?: string | null;
  pagamentoTermino?: Pagamento | null;
}

export interface ConciliacaoResponse {
  alunosToUpdate: Aluno[];
  pagamentosToCreate: Pagamento[];
  failedFields: Map<String, String>;
}

export interface DashBoard {
  adimplentes: number;
  inadimplentes: number;
  total: number;
  ativos: number;
  inativos: number;
  valorEsperado: number;
  valorRecebido: number;
  analytics: Array<Analytics>;
}

export interface Analytics {
  expectedValue: number;
  receivedValue: number;
  month: number;
  year: number;
}

// WhatsApp Types
export interface SessionDto {
  name: string;
  me: Me | null;
  status: string;
}

export interface Me {
  id: string;
  lid: string;
  jid: string;
  pushName: string;
}

export interface PersonSelector {
  id: number;
  isResponsavel: boolean;
  phone2: boolean;
}

export interface SendResponse {
  code: number;
  recepient: string;
}
