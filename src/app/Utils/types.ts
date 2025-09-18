export type User = {
  id: string;
  username: string;
  password: string;
  email?: string | null;
  permissions: [{ permission: string }];
  funcionario?: Funcionario;
};

export type Funcionario = {
  id: number;
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
