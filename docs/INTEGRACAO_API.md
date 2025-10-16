# Integração com API - Frontend

Este documento descreve como o frontend se integra com a API do backend, incluindo todos os endpoints utilizados, exemplos de requisição/resposta e padrões de autenticação.

## 📋 Índice

- [Configuração Base](#configuração-base)
- [Autenticação](#autenticação)
- [Endpoints de Usuário](#endpoints-de-usuário)
- [Endpoints de Alunos](#endpoints-de-alunos)
- [Endpoints de Funcionários](#endpoints-de-funcionários)
- [Endpoints de Turmas](#endpoints-de-turmas)
- [Endpoints de Pagamentos](#endpoints-de-pagamentos)
- [Integração Externa](#integração-externa)
- [Padrões de Requisição](#padrões-de-requisição)
- [Tratamento de Erros](#tratamento-de-erros)

## 🔧 Configuração Base

### URL do Backend

A URL do backend é configurada através da variável de ambiente `VITE_BACKEND_URL`:

```typescript
const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Exemplo: http://192.168.1.171:6060
```

### Configuração Padrão de Requisições

Todas as requisições incluem:

```typescript
fetch(url, {
  method: "GET|POST|PATCH|DELETE",
  credentials: "include", // Envia cookies automaticamente
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data) // Quando aplicável
})
```

## 🔐 Autenticação

### Login

**Arquivo:** `src/app/Context/AuthContext.tsx`

```typescript
// POST /user/login
const login = async (username: string, password: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user/login`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    }
  );

  if (!response.ok) {
    throw new Error("Usuário ou senha incorretos");
  }

  // Cookie JWT definido automaticamente pelo backend
};
```

**Requisição:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Resposta:** Status 200 OK (sem corpo)
- Cookie `token` definido com JWT (7 dias de validade)

### Verificar Token

```typescript
// GET /user/check
const checkToken = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user/check`,
    { credentials: "include" }
  );

  return response.ok;
};
```

**Resposta:**
```json
{
  "valid": "true"
}
```

### Obter Usuário Logado

```typescript
// GET /user/get
const getUser = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user/get`,
    { credentials: "include" }
  );

  const user = await response.json();
  return user;
};
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "admin",
  "email": "admin@futebol.com",
  "permissions": [
    { "permission": "ADMIN" },
    { "permission": "ALUNOS" }
  ],
  "funcionario": {
    "nome": "João Silva",
    "cpf": "12345678900"
  }
}
```

## 👤 Endpoints de Usuário

### Listar Todos os Usuários

**Arquivo:** `src/app/Pages/UserManagement.tsx`

```typescript
// GET /user/all
const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/user/all`,
  { credentials: "include" }
);
const users = await response.json();
```

**Resposta:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "email": "admin@futebol.com",
    "permissions": ["ADMIN", "ALUNOS", "PAGAMENTOS"],
    "funcionarioId": 1
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "username": "joao",
    "email": "joao@futebol.com",
    "permissions": ["ALUNOS"],
    "funcionarioId": null
  }
]
```

### Criar Usuário

```typescript
// POST /user/create
const userData = {
  username: "novo_usuario",
  email: "email@exemplo.com",
  password: "senha123",
  permissions: ["ALUNOS", "TURMAS"],
  funcionarioId: 5 // Opcional
};

const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/user/create`,
  {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  }
);
```

**Requisição:**
```json
{
  "username": "novo_usuario",
  "email": "email@exemplo.com",
  "password": "senha123",
  "permissions": ["ALUNOS", "TURMAS"],
  "funcionarioId": 5
}
```

**Resposta:** Status 200 OK
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "username": "novo_usuario",
  "email": "email@exemplo.com",
  "permissions": ["ALUNOS", "TURMAS"],
  "funcionarioId": 5
}
```

### Atualizar Usuário

```typescript
// PATCH /user/update
const userData = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "usuario_atualizado",
  email: "novo_email@exemplo.com",
  password: "nova_senha123",
  permissions: ["ADMIN"],
  funcionarioId: 3
};

const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/user/update`,
  {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  }
);
```

## 🎓 Endpoints de Alunos

### Buscar Alunos

**Arquivo:** `src/app/Pages/Search.tsx`

```typescript
// GET /alunos/search?nome={nome}
const searchAlunos = async (nome: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/alunos/search?nome=${encodeURIComponent(nome)}`,
    { credentials: "include" }
  );

  return await response.json();
};
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nomeCompleto": "Pedro Santos",
    "dataNascimento": "2010-05-15",
    "telefone1": "11987654321",
    "cpf": "12345678900",
    "colegio": "Escola ABC",
    "colegioAno": "8º Ano",
    "url": "/alunos/files/1"
  }
]
```

### Listar Todos os Alunos

```typescript
// GET /alunos/all
const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/alunos/all`,
  { credentials: "include" }
);
```

### Criar Aluno

**Arquivo:** `src/app/Components/Search/DetailsAluno.tsx`

```typescript
// POST /alunos (multipart/form-data)
const formData = new FormData();
formData.append("nomeCompleto", "João Silva");
formData.append("dataNascimento", "2010-05-15");
formData.append("telefone1", "11987654321");
formData.append("cpf", "12345678900");
formData.append("rg", "123456789");
// ... outros campos
formData.append("file", fileInput.files[0]); // Arquivo opcional

const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/alunos`,
  {
    method: "POST",
    credentials: "include",
    body: formData // Sem Content-Type, browser define automaticamente
  }
);
```

**Campos do Aluno:**
- `nomeCompleto` (obrigatório)
- `dataNascimento`, `dataMatricula`
- `telefone1` (obrigatório), `telefone2`
- `cpf` (obrigatório, único), `rg` (obrigatório, único)
- `alergia`, `usoMedicamento`, `horarioMedicamento`
- `colegio`, `colegioAno`, `time`, `indicacao`, `observacao`
- `cep`, `rua`, `enderecoNumero`, `cidade`, `estado`
- `isAdimplente`, `valorFatura`, `dataPagamento`
- `isAtivo`
- `turmaId` (opcional)
- **Responsável:**
  - `responsavelCpf`, `responsavelRg`
  - `responsavelNomeCompleto`, `responsavelTelefone1`, `responsavelTelefone2`
  - `responsavelEmail`
- `file` (documento/foto - opcional)

### Atualizar Aluno

```typescript
// PATCH /alunos (multipart/form-data)
const formData = new FormData();
formData.append("id", "1");
formData.append("nomeCompleto", "João Silva Atualizado");
// ... outros campos
formData.append("file", newFile); // Opcional, substitui arquivo anterior

const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/alunos`,
  {
    method: "PATCH",
    credentials: "include",
    body: formData
  }
);
```

### Deletar Aluno

```typescript
// DELETE /alunos?id={id}
const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/alunos?id=${alunoId}`,
  {
    method: "DELETE",
    credentials: "include"
  }
);
```

### Gerar Contrato PDF

```typescript
// GET /alunos/contrato?id={id}
const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/alunos/contrato?id=${alunoId}`,
  { credentials: "include" }
);

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
window.open(url, "_blank");
```

### Baixar Arquivo do Aluno

```typescript
// GET /alunos/files/{id}
const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/alunos/files/${alunoId}`;
// Usar diretamente em <img src={imageUrl} />
```

## 👔 Endpoints de Funcionários

### Buscar Funcionários

**Arquivo:** `src/app/Pages/Search.tsx`

```typescript
// GET /funcionarios/search?nome={nome}
const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/funcionarios/search?nome=${encodeURIComponent(nome)}`,
  { credentials: "include" }
);
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Maria Oliveira",
    "telefone1": "11998765432",
    "cpf": "98765432100",
    "dataAdmissao": "2020-01-15",
    "url": "/funcionarios/foto/1"
  }
]
```

### Listar Todos os Funcionários

```typescript
// GET /funcionarios/all
const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/funcionarios/all`,
  { credentials: "include" }
);
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Maria Oliveira",
    "dataNascimento": "1985-03-20",
    "telefone1": "11998765432",
    "telefone2": "11987654321",
    "cpf": "98765432100",
    "rg": "987654321",
    "dataAdmissao": "2020-01-15",
    "foto": "/path/to/foto.jpg",
    "jornadaEscala": "Segunda a Sexta, 8h-17h",
    "situacao": "OK",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "maria"
    }
  }
]
```

### Criar Funcionário

```typescript
// POST /funcionarios (multipart/form-data)
const formData = new FormData();
formData.append("nome", "Carlos Silva");
formData.append("dataNascimento", "1990-07-10");
formData.append("telefone1", "11987654321");
formData.append("cpf", "12312312312");
formData.append("rg", "121212121");
formData.append("dataAdmissao", "2024-01-01");
formData.append("jornadaEscala", "Seg-Sex 9h-18h");
formData.append("situacao", "OK");
formData.append("file", photoFile); // Foto opcional

const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/funcionarios`,
  {
    method: "POST",
    credentials: "include",
    body: formData
  }
);
```

## 🏫 Endpoints de Turmas

### Listar Todas as Turmas

**Arquivo:** `src/app/Pages/Turmas.tsx`

```typescript
// GET /turmas/all
const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/turmas/all`,
  { credentials: "include" }
);
```

**Resposta:**
```json
{
  "turmas": [
    {
      "id": 1,
      "codigoTurma": "TUR001",
      "nome": "Iniciante Manhã",
      "descricao": "Turma para iniciantes",
      "diaSemana": ["MONDAY", "WEDNESDAY", "FRIDAY"],
      "horaInicio": "08:00:00",
      "horaTermino": "09:30:00",
      "local": "Campo A",
      "alunos": [
        {
          "id": 1,
          "nomeCompleto": "Pedro Santos",
          "colegio": "Escola ABC",
          "colegioAno": "8º Ano",
          "telefone1": "11987654321"
        }
      ]
    }
  ]
}
```

### Criar Turma

```typescript
// POST /turmas
const turmaData = {
  codigoTurma: "TUR002",
  nome: "Avançado Tarde",
  descricao: "Turma para alunos avançados",
  diaSemana: ["TUESDAY", "THURSDAY"],
  horaInicio: "14:00:00",
  horaTermino: "15:30:00",
  local: "Campo B"
};

const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/turmas`,
  {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(turmaData)
  }
);
```

### Atualizar Turma

```typescript
// PATCH /turmas
const turmaData = {
  id: 1,
  codigoTurma: "TUR001",
  nome: "Iniciante Manhã Atualizado",
  descricao: "Nova descrição",
  diaSemana: ["MONDAY", "WEDNESDAY"],
  horaInicio: "09:00:00",
  horaTermino: "10:30:00",
  local: "Campo C"
};

const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/turmas`,
  {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(turmaData)
  }
);
```

## 💰 Endpoints de Pagamentos

### Registrar Pagamento

```typescript
// POST /pagamentos
const pagamentoData = {
  responsavelId: 1,
  comprovanteCpf: "12345678900",
  nomeResponsavel: "Maria Santos",
  valorPagamento: 150.00,
  valorComprovante: 150.00,
  dataPagamento: "2024-03-15",
  metodoPagamento: "PIX",
  isAutomatized: false,
  alunoId: 5
};

const response = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/pagamentos`,
  {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pagamentoData)
  }
);
```

**Métodos de Pagamento:** `DINHEIRO`, `PIX`, `CARTAO`

## 🌐 Integração Externa

### Busca de CEP

**Serviço:** OpenCEP

```typescript
// GET https://opencep.com/v1/{cep}.json
const fetchCep = async (cep: string) => {
  const response = await fetch(`https://opencep.com/v1/${cep}.json`);
  const data = await response.json();

  return {
    rua: data.logradouro,
    cidade: data.localidade,
    estado: data.uf
  };
};
```

**Resposta:**
```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "complemento": "",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP",
  "ibge": "3550308"
}
```

## 📝 Padrões de Requisição

### Requisição JSON

```typescript
const response = await fetch(url, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});
```

### Requisição Multipart (Upload de Arquivos)

```typescript
const formData = new FormData();
formData.append("campo", "valor");
formData.append("file", fileInput.files[0]);

const response = await fetch(url, {
  method: "POST",
  credentials: "include",
  body: formData
  // NÃO incluir Content-Type, browser define automaticamente
});
```

### Tratamento de Resposta

```typescript
try {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro na requisição");
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error("Erro:", error);
  alert("Erro: " + error.message);
}
```

## ❌ Tratamento de Erros

### Erros Comuns

**401 Unauthorized:**
```typescript
if (response.status === 401) {
  // Token inválido ou expirado
  // Redirecionar para login
  window.location.href = "/";
}
```

**403 Forbidden:**
```typescript
if (response.status === 403) {
  // Usuário não tem permissão
  alert("Você não tem permissão para esta ação");
}
```

**500 Internal Server Error:**
```typescript
if (response.status === 500) {
  const errorText = await response.text();
  alert("Erro no servidor: " + errorText);
}
```

### Padrão de Try-Catch

```typescript
const handleCreateAluno = async (formData: Record<string, any>) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erro ao criar aluno");
    }

    const result = await response.json();
    alert("Aluno criado com sucesso!");

    // Atualizar lista
    setRefresh(!refresh);
  } catch (error: any) {
    console.error("Error creating aluno:", error);
    alert("Erro ao criar aluno: " + error.message);
  }
};
```

## 🔄 Refresh de Dados

Padrão usado em todas as páginas:

```typescript
const [refresh, setRefresh] = useState<boolean>(false);

useEffect(() => {
  const getData = async () => {
    // Fetch dados
  };
  getData();
}, [refresh]);

// Após operação de sucesso:
setRefresh(!refresh); // Dispara novo fetch
```

## 📚 Referências

- Consulte [MENSAGENS_ERRO.md](./MENSAGENS_ERRO.md) para detalhes sobre erros
- Veja a [Referência da API Backend](../../FutebolBackend/docs/REFERENCIA_API.md) para documentação completa dos endpoints
