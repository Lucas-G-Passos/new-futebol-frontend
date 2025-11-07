import type { Aluno, Funcionario, User, Turma, Filial, Pagamento, Responsavel, IntervaloInadimplencia } from './Types';
import { DayOfWeek } from './Types';

// Helper functions to generate fake Brazilian data
const generateCPF = (): string => {
  const n = () => Math.floor(Math.random() * 10);
  return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
};

const generateRG = (): string => {
  const n = () => Math.floor(Math.random() * 10);
  return `${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}`;
};

const generatePhone = (): string => {
  const n = () => Math.floor(Math.random() * 10);
  return `(${n()}${n()}) 9${n()}${n()}${n()}${n()}-${n()}${n()}${n()}${n()}`;
};


const generateCardNumber = (): string => {
  const n = () => Math.floor(Math.random() * 10);
  return `${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}`;
};

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Brazilian names
const firstNames = [
  'João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Juliana', 'Carlos', 'Fernanda',
  'Rafael', 'Beatriz', 'Gabriel', 'Larissa', 'Felipe', 'Camila', 'Bruno',
  'Amanda', 'Matheus', 'Letícia', 'Gustavo', 'Isabela', 'Thiago', 'Mariana',
  'Diego', 'Bruna', 'Rodrigo', 'Vitória', 'Leonardo', 'Natália', 'Vitor',
  'Gabriela', 'Henrique', 'Carolina', 'Daniel', 'Bianca', 'Marcelo', 'Aline',
  'André', 'Renata', 'Fernando', 'Patrícia', 'Ricardo', 'Cristina', 'Paulo',
  'Jéssica', 'Alexandre', 'Vanessa', 'Vinícius', 'Daniela', 'Leandro', 'Priscila'
];

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Ferreira',
  'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho',
  'Gomes', 'Martins', 'Rocha', 'Ribeiro', 'Alves', 'Monteiro', 'Mendes', 'Barros',
  'Freitas', 'Barbosa', 'Pinto', 'Moreira', 'Cavalcanti', 'Dias', 'Castro', 'Campos'
];

const cities = [
  { cidade: 'São Paulo', estado: 'SP', cep: '01310-100', rua: 'Av. Paulista' },
  { cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20040-020', rua: 'Av. Rio Branco' },
  { cidade: 'Belo Horizonte', estado: 'MG', cep: '30130-100', rua: 'Av. Afonso Pena' },
  { cidade: 'Porto Alegre', estado: 'RS', cep: '90040-020', rua: 'Av. Borges de Medeiros' },
  { cidade: 'Curitiba', estado: 'PR', cep: '80020-100', rua: 'Av. Marechal Deodoro' },
  { cidade: 'Salvador', estado: 'BA', cep: '40020-100', rua: 'Av. Sete de Setembro' },
  { cidade: 'Fortaleza', estado: 'CE', cep: '60060-100', rua: 'Av. Beira Mar' },
  { cidade: 'Brasília', estado: 'DF', cep: '70040-020', rua: 'Esplanada dos Ministérios' },
  { cidade: 'Recife', estado: 'PE', cep: '50030-230', rua: 'Av. Boa Viagem' },
  { cidade: 'Manaus', estado: 'AM', cep: '69005-140', rua: 'Av. Eduardo Ribeiro' }
];

const schools = [
  'Colégio Dom Bosco', 'Escola Estadual São José', 'Colégio Santa Maria',
  'EMEF Prof. João Silva', 'Instituto Santa Terezinha', 'Colégio Anglo',
  'Escola Municipal Castro Alves', 'Colégio Objetivo', 'ETEC Getúlio Vargas',
  'Escola São Paulo'
];

const teams = [
  'Flamengo', 'Corinthians', 'Palmeiras', 'São Paulo', 'Santos', 'Grêmio',
  'Internacional', 'Cruzeiro', 'Atlético Mineiro', 'Botafogo', 'Vasco', 'Fluminense'
];

const allergies = [
  'Nenhuma', 'Poeira', 'Amendoim', 'Lactose', 'Glúten', 'Frutos do mar',
  'Pólen', 'Ácaros', null
];

const medications = [
  'Nenhum', 'Antialérgico', 'Vitamina D', 'Ômega 3', null
];

// Generate Filiais
export const filiais: Filial[] = Array.from({ length: 8 }, (_, i) => {
  const location = cities[i];
  return {
    id: i + 1,
    nome: `Filial ${location.cidade}`,
    cep: parseInt(location.cep.replace('-', '')),
    rua: location.rua,
    enderecoNumero: `${Math.floor(Math.random() * 2000) + 1}`,
    cidade: location.cidade,
    estado: location.estado,
    turmas: []
  };
});

// Generate Turmas
export const turmas: Turma[] = Array.from({ length: 30 }, (_, i) => {
  const days = [
    [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
    [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
    [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY],
    [DayOfWeek.SATURDAY],
    [DayOfWeek.SUNDAY]
  ];

  const times = [
    { inicio: '08:00:00', termino: '10:00:00' },
    { inicio: '10:00:00', termino: '12:00:00' },
    { inicio: '14:00:00', termino: '16:00:00' },
    { inicio: '16:00:00', termino: '18:00:00' },
    { inicio: '18:00:00', termino: '20:00:00' }
  ];

  const categories = ['Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16', 'Adulto'];
  const filial = filiais[i % filiais.length];
  const daySchedule = days[i % days.length];
  const timeSchedule = times[i % times.length];
  const category = categories[Math.floor(i / 5) % categories.length];

  return {
    id: i + 1,
    codigoTurma: `T${String(i + 1).padStart(3, '0')}`,
    nome: `${category} - ${filial.cidade}`,
    descricao: `Turma de futebol ${category}`,
    diaSemana: daySchedule,
    horaInicio: timeSchedule.inicio,
    horaTermino: timeSchedule.termino,
    local: `Campo ${Math.floor(i % 3) + 1}`,
    filialNome: filial.nome,
    filialId: filial.id,
    alunos: []
  };
});

// Generate Users
export const users: User[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  username: i === 0 ? 'admin' : `user${i}`,
  password: '123456',
  email: i === 0 ? 'admin@futebol.com' : `user${i}@futebol.com`,
  permissions: i === 0
    ? [{ permission: 'ADMIN' }]
    : [{ permission: 'USER' }]
}));

// Generate Funcionarios
export const funcionarios: Funcionario[] = Array.from({ length: 120 }, (_, i) => {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const middleName = randomElement(lastNames);
  const birthDate = randomDate(new Date(1970, 0, 1), new Date(2000, 11, 31));
  const admissionDate = randomDate(new Date(2015, 0, 1), new Date(2024, 11, 31));

  return {
    nome: `${firstName} ${middleName} ${lastName}`,
    dataNascimento: birthDate.toISOString().split('T')[0],
    telefone1: generatePhone(),
    telefone2: Math.random() > 0.5 ? generatePhone() : null,
    cpf: generateCPF(),
    rg: generateRG(),
    dataAdmissao: admissionDate.toISOString().split('T')[0],
    foto: `https://i.pravatar.cc/150?img=${i + 1}`,
    jornadaEscala: randomElement(['40h/semana', '44h/semana', '20h/semana', '30h/semana']) || undefined,
    situacao: Math.random() > 0.1 ? 'OK' : 'DESLIGADO',
    user: i < users.length ? users[i] : undefined
  };
});

// Generate Alunos with Responsaveis and Pagamentos
export const alunos: Aluno[] = Array.from({ length: 150 }, (_, i) => {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const middleName = randomElement(lastNames);
  const birthDate = randomDate(new Date(2005, 0, 1), new Date(2018, 11, 31));
  const enrollmentDate = randomDate(new Date(2020, 0, 1), new Date(2024, 11, 31));
  const location = randomElement(cities);
  const turma = turmas[i % turmas.length];
  const valorFatura = [100, 150, 200, 250, 300][Math.floor(Math.random() * 5)];
  const isAdimplente = Math.random() > 0.2; // 80% adimplente
  const dataPagamento = Math.floor(Math.random() * 28) + 1; // 1-28

  // Generate responsavel
  const responsavelFirstName = randomElement(firstNames);
  const responsavelLastName = randomElement(lastNames);
  const responsavel: Responsavel = {
    cpf: generateCPF(),
    rg: generateRG(),
    nomeCompleto: `${responsavelFirstName} ${middleName} ${responsavelLastName}`,
    telefone1: generatePhone(),
    telefone2: Math.random() > 0.5 ? generatePhone() : undefined,
    email: `${responsavelFirstName.toLowerCase()}.${responsavelLastName.toLowerCase()}@email.com`
  };

  // Generate payment history
  const numPayments = Math.floor(Math.random() * 12) + 1; // 1-12 payments
  const pagamentos: Pagamento[] = Array.from({ length: numPayments }, (_, j) => {
    const paymentDate = new Date(2024, j, dataPagamento);
    return {
      id: i * 100 + j + 1,
      dataPago: paymentDate,
      valorPago: valorFatura + (Math.random() > 0.9 ? Math.floor(Math.random() * 50) - 25 : 0), // Sometimes varies
      metodoPagamento: randomElement(['DINHEIRO', 'PIX', 'CARTAO'] as const),
      isAutomatized: Math.random() > 0.3,
      observacao: Math.random() > 0.8 ? 'Pagamento em atraso' : ''
    };
  });

  // Generate inadimplência intervals for some students
  const intervalosInadimplencia: IntervaloInadimplencia[] = !isAdimplente && Math.random() > 0.5 ? [{
    id: i + 1,
    dataInicio: randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
    dataTermino: Math.random() > 0.5 ? randomDate(new Date(2024, 6, 1), new Date(2024, 11, 31)) : null,
    causaInicio: 'Falta de pagamento',
    causaTermino: Math.random() > 0.5 ? 'Pagamento regularizado' : null,
    pagamentoTermino: null
  }] : [];

  const valorDevido = isAdimplente ? 0 : Math.floor(Math.random() * 3 + 1) * valorFatura;

  const aluno: Aluno = {
    id: i + 1,
    nomeCompleto: `${firstName} ${middleName} ${lastName}`,
    dataNascimento: birthDate,
    dataMatricula: enrollmentDate,
    telefone1: generatePhone(),
    telefone2: Math.random() > 0.5 ? generatePhone() : undefined,
    cpf: generateCPF(),
    rg: generateRG(),
    alergia: randomElement(allergies) || undefined,
    usoMedicamento: randomElement(medications) || undefined,
    horarioMedicamento: Math.random() > 0.7 ? `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:00:00` : undefined,
    colegio: randomElement(schools),
    colegioAno: `${Math.floor(Math.random() * 9) + 1}º ano`,
    time: randomElement(teams),
    indicacao: Math.random() > 0.5 ? randomElement(['Amigo', 'Internet', 'Outdoor', 'Redes sociais']) : undefined,
    observacao: Math.random() > 0.8 ? 'Aluno dedicado' : undefined,
    acordo: Math.random() > 0.9 ? 'Desconto de 10%' : undefined,
    cep: location.cep,
    rua: location.rua,
    enderecoNumero: `${Math.floor(Math.random() * 2000) + 1}`,
    cidade: location.cidade,
    estado: location.estado,
    isAtivo: Math.random() > 0.05, // 95% active
    filePath: undefined,
    url: `https://i.pravatar.cc/150?img=${i + 100}`,
    turmaId: turma.id,
    turmaNome: turma.nome,
    isAdimplente,
    valorFatura,
    valorDevido,
    dataPagamento,
    numeroCartao: Math.random() > 0.5 ? generateCardNumber() : undefined,
    pagamento: pagamentos,
    intervalosInadimplencia,
    responsavel,
    turma
  };

  return aluno;
});

// Update turmas with alunos
turmas.forEach(turma => {
  turma.alunos = alunos.filter(a => a.turmaId === turma.id);
});

// Update filiais with turmas
filiais.forEach(filial => {
  filial.turmas = turmas.filter(t => t.filialId === filial.id);
});

// Mock API class to simulate backend operations
class MockAPI {
  private static instance: MockAPI;

  private constructor() {
    // Initialize from localStorage if exists
    const storedAlunos = localStorage.getItem('mockAlunos');
    if (storedAlunos) {
      try {
        const parsed = JSON.parse(storedAlunos);
        alunos.length = 0;
        alunos.push(...parsed.map((a: any) => ({
          ...a,
          dataNascimento: a.dataNascimento ? new Date(a.dataNascimento) : undefined,
          dataMatricula: a.dataMatricula ? new Date(a.dataMatricula) : undefined,
          pagamento: a.pagamento?.map((p: any) => ({
            ...p,
            dataPago: new Date(p.dataPago)
          })),
          intervalosInadimplencia: a.intervalosInadimplencia?.map((i: any) => ({
            ...i,
            dataInicio: new Date(i.dataInicio),
            dataTermino: i.dataTermino ? new Date(i.dataTermino) : null
          }))
        })));
      } catch (e) {
        console.error('Error loading mock data from localStorage', e);
      }
    }
  }

  static getInstance(): MockAPI {
    if (!MockAPI.instance) {
      MockAPI.instance = new MockAPI();
    }
    return MockAPI.instance;
  }

  private saveAlunos() {
    localStorage.setItem('mockAlunos', JSON.stringify(alunos));
  }

  // Delay to simulate network request
  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auth
  async login(username: string, _password: string): Promise<{ token: string }> {
    await this.delay();
    const user = users.find(u => u.username === username);
    if (!user) throw new Error('Invalid credentials');
    return { token: 'mock-jwt-token-' + user.id };
  }

  async checkToken(): Promise<{ valid: boolean }> {
    await this.delay(100);
    return { valid: true };
  }

  async getCurrentUser(): Promise<User> {
    await this.delay(100);
    return users[0]; // Return admin user
  }

  // Users
  async getAllUsers(): Promise<User[]> {
    await this.delay();
    return [...users];
  }

  async createUser(user: Partial<User>): Promise<User> {
    await this.delay();
    const newUser: User = {
      id: String(users.length + 1),
      username: user.username || '',
      password: user.password || '',
      email: user.email || null,
      permissions: user.permissions || [{ permission: 'USER' }]
    };
    users.push(newUser);
    return newUser;
  }

  async updateUser(user: Partial<User>): Promise<User> {
    await this.delay();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...user };
    return users[index];
  }

  // Alunos
  async searchAlunos(nome: string): Promise<Aluno[]> {
    await this.delay();
    const search = nome.toLowerCase();
    return alunos.filter(a =>
      a.nomeCompleto.toLowerCase().includes(search) ||
      a.responsavel?.nomeCompleto.toLowerCase().includes(search)
    );
  }

  async getAniversariantes(): Promise<Aluno[]> {
    await this.delay();
    const currentMonth = new Date().getMonth();
    return alunos.filter(a => a.dataNascimento && new Date(a.dataNascimento).getMonth() === currentMonth);
  }

  async getInadimplentes(): Promise<Aluno[]> {
    await this.delay();
    return alunos.filter(a => !a.isAdimplente);
  }

  async getAllAlunos(): Promise<Aluno[]> {
    await this.delay();
    return [...alunos];
  }

  async createAluno(aluno: Partial<Aluno>): Promise<Aluno> {
    await this.delay();
    const newAluno: Aluno = {
      id: Math.max(...alunos.map(a => a.id), 0) + 1,
      nomeCompleto: aluno.nomeCompleto || '',
      telefone1: aluno.telefone1 || '',
      cpf: aluno.cpf || generateCPF(),
      rg: aluno.rg || generateRG(),
      colegio: aluno.colegio || '',
      ...aluno,
      url: aluno.url || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      pagamento: [],
      intervalosInadimplencia: []
    } as Aluno;
    alunos.push(newAluno);
    this.saveAlunos();
    return newAluno;
  }

  async updateAluno(aluno: Partial<Aluno>): Promise<Aluno> {
    await this.delay();
    const index = alunos.findIndex(a => a.id === aluno.id);
    if (index === -1) throw new Error('Aluno not found');
    alunos[index] = { ...alunos[index], ...aluno };
    this.saveAlunos();
    return alunos[index];
  }

  async deleteAluno(id: number): Promise<void> {
    await this.delay();
    const index = alunos.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Aluno not found');
    alunos.splice(index, 1);
    this.saveAlunos();
  }

  async getContratoBlob(id: number): Promise<Blob> {
    await this.delay();
    // Return a mock PDF blob
    const pdfContent = `Mock PDF Contract for Aluno ID: ${id}`;
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  // Funcionarios
  async searchFuncionarios(nome: string): Promise<Funcionario[]> {
    await this.delay();
    const search = nome.toLowerCase();
    return funcionarios.filter(f => f.nome.toLowerCase().includes(search));
  }

  async getAllFuncionarios(): Promise<Funcionario[]> {
    await this.delay();
    return [...funcionarios];
  }

  // Turmas
  async getAllTurmas(): Promise<{ turmas: Turma[] }> {
    await this.delay();
    return { turmas: [...turmas] };
  }

  async createTurma(turma: Partial<Turma>): Promise<Turma> {
    await this.delay();
    const newTurma: Turma = {
      id: Math.max(...turmas.map(t => t.id), 0) + 1,
      ...turma,
      alunos: []
    } as Turma;
    turmas.push(newTurma);
    return newTurma;
  }

  async updateTurma(turma: Partial<Turma>): Promise<Turma> {
    await this.delay();
    const index = turmas.findIndex(t => t.id === turma.id);
    if (index === -1) throw new Error('Turma not found');
    turmas[index] = { ...turmas[index], ...turma };
    return turmas[index];
  }

  // Filiais
  async getAllFiliais(): Promise<{ filiais: Filial[] }> {
    await this.delay();
    return { filiais: [...filiais] };
  }

  async createFilial(filial: Partial<Filial>): Promise<Filial> {
    await this.delay();
    const newFilial: Filial = {
      id: Math.max(...filiais.map(f => f.id), 0) + 1,
      nome: filial.nome || '',
      cep: filial.cep || 0,
      rua: filial.rua || '',
      enderecoNumero: filial.enderecoNumero || '',
      cidade: filial.cidade || '',
      estado: filial.estado || '',
      turmas: []
    };
    filiais.push(newFilial);
    return newFilial;
  }

  async updateFilial(id: number, filial: Partial<Filial>): Promise<Filial> {
    await this.delay();
    const index = filiais.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Filial not found');
    filiais[index] = { ...filiais[index], ...filial };
    return filiais[index];
  }

  // Pagamentos
  async createPagamento(pagamento: any): Promise<void> {
    await this.delay();
    // Find aluno by responsavel name or cpf
    const aluno = alunos.find(a =>
      a.responsavel?.nomeCompleto === pagamento.nomeResponsavel ||
      a.responsavel?.cpf === pagamento.comprovanteCpf
    );

    if (aluno) {
      const newPagamento: Pagamento = {
        id: Math.max(...alunos.flatMap(a => a.pagamento || []).map(p => p.id), 0) + 1,
        dataPago: new Date(pagamento.dataPagamento),
        valorPago: pagamento.valorPagamento,
        metodoPagamento: pagamento.metodoPagamento,
        isAutomatized: pagamento.isAutomatized,
        observacao: pagamento.observacao || ''
      };

      if (!aluno.pagamento) aluno.pagamento = [];
      aluno.pagamento.push(newPagamento);

      // Update inadimplencia status
      const totalPago = aluno.pagamento.reduce((sum, p) => sum + p.valorPago, 0);
      const totalDevido = (aluno.valorFatura || 0) * 12;
      aluno.isAdimplente = totalPago >= totalDevido - (aluno.valorFatura || 0);
      aluno.valorDevido = Math.max(0, totalDevido - totalPago);

      this.saveAlunos();
    }
  }

  async createDivida(data: { id: number; divida: number; observacao: string }): Promise<void> {
    await this.delay();
    const aluno = alunos.find(a => a.id === data.id);
    if (aluno) {
      aluno.valorDevido = (aluno.valorDevido || 0) + data.divida;
      aluno.isAdimplente = false;
      this.saveAlunos();
    }
  }

  async conciliacaoCartao(_file: File): Promise<{ alunosToUpdate: Aluno[], pagamentosToCreate: Pagamento[], failedFields: Map<String, String> }> {
    await this.delay(500);
    // Simulate parsing CSV and matching with alunos
    const randomAlunos = alunos.slice(0, Math.floor(Math.random() * 10) + 5);
    const pagamentosToCreate: Pagamento[] = randomAlunos.map((a, i) => ({
      id: Math.max(...alunos.flatMap(a => a.pagamento || []).map(p => p.id), 0) + i + 1,
      dataPago: new Date(),
      valorPago: a.valorFatura || 150,
      metodoPagamento: 'CARTAO',
      isAutomatized: true,
      observacao: 'Conciliação automática'
    }));

    return {
      alunosToUpdate: randomAlunos,
      pagamentosToCreate,
      failedFields: new Map()
    };
  }

  async conciliacaoPix(_file: File): Promise<{ alunosToUpdate: Aluno[], pagamentosToCreate: Pagamento[], failedFields: Map<String, String> }> {
    await this.delay(500);
    const randomAlunos = alunos.slice(0, Math.floor(Math.random() * 5) + 2);
    const pagamentosToCreate: Pagamento[] = randomAlunos.map((a, i) => ({
      id: Math.max(...alunos.flatMap(a => a.pagamento || []).map(p => p.id), 0) + i + 1,
      dataPago: new Date(),
      valorPago: a.valorFatura || 150,
      metodoPagamento: 'PIX',
      isAutomatized: true,
      observacao: 'Conciliação PIX automática'
    }));

    return {
      alunosToUpdate: randomAlunos,
      pagamentosToCreate,
      failedFields: new Map()
    };
  }
}

export const mockAPI = MockAPI.getInstance();
export default mockAPI;
