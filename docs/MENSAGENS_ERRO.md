# Mensagens de Erro - Frontend

Este documento lista as mensagens de erro comuns do frontend, seus significados e como resolvê-las.

## 📋 Índice

- [Erros de Autenticação](#erros-de-autenticação)
- [Erros de Rede](#erros-de-rede)
- [Erros de Validação](#erros-de-validação)
- [Erros de Upload de Arquivo](#erros-de-upload-de-arquivo)
- [Erros do Navegador](#erros-do-navegador)
- [Debug e Logs](#debug-e-logs)

## 🔐 Erros de Autenticação

### "Usuário ou senha incorretos"

**Origem:** `AuthContext.tsx:login()`

**Causa:** Credenciais inválidas no login

**Solução:**
- Verificar username e password
- Verificar se o usuário existe no banco de dados
- Senha é case-sensitive

```typescript
// Exemplo de verificação
console.log("Username:", username);
console.log("Password length:", password.length);
```

### "Token inválido ou expirado"

**Origem:** Requisições com status 401

**Causa:**
- Token JWT expirado (após 7 dias)
- Token malformado
- Cookies não estão sendo enviados

**Solução:**
```typescript
// Verificar se cookies estão habilitados
console.log(document.cookie);

// Limpar cookies e fazer novo login
document.cookie.split(";").forEach((c) => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/,
    "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

### "Erro ao verificar autenticação"

**Origem:** `App.tsx` ao verificar token no mount

**Causa:**
- Backend não está rodando
- URL do backend incorreta
- Problemas de CORS

**Solução:**
```bash
# Verificar se backend está rodando
curl http://localhost:6060/user/check

# Verificar variável de ambiente
echo $VITE_BACKEND_URL

# Ver logs do frontend
# Abrir DevTools > Console
```

## 🌐 Erros de Rede

### "Network Error" / "Failed to fetch"

**Causa:**
- Backend offline
- URL incorreta no `.env`
- Firewall bloqueando conexão
- Problemas de CORS

**Solução:**

1. **Verificar Backend:**
```bash
# Testar manualmente
curl http://localhost:6060/user/check

# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f
```

2. **Verificar VITE_BACKEND_URL:**
```bash
# Frontend .env
cat futebol/.env

# Deve conter:
VITE_BACKEND_URL=http://localhost:6060
```

3. **Verificar CORS:**
- O backend deve permitir a origem do frontend
- Configurado em `SecurityConfig.java`
- Origins permitidos: `localhost:5173`, `192.168.1.171:5173`

### "ERR_CONNECTION_REFUSED"

**Causa:** Backend não está rodando ou porta incorreta

**Solução:**
```bash
# Iniciar backend
cd FutebolBackend
docker-compose up -d

# Verificar porta
lsof -i :6060
```

### "ERR_NAME_NOT_RESOLVED"

**Causa:** Nome do host inválido

**Solução:**
- Usar IP ao invés de hostname
- Exemplo: `http://192.168.1.171:6060` ao invés de `http://meu-servidor:6060`

## ✅ Erros de Validação

### "Erro ao pegar usuários" / "Erro ao pegar alunos"

**Origem:** `useEffect()` nas páginas de listagem

**Causa:**
- Endpoint retornou erro 4xx/5xx
- Dados malformados
- Permissões insuficientes

**Solução:**
```typescript
// Ver detalhes do erro
try {
  const response = await fetch(url, options);
  console.log("Status:", response.status);
  const text = await response.text();
  console.log("Response:", text);
} catch (error) {
  console.error("Full error:", error);
}
```

### "Erro ao criar [entidade]"

**Origem:** Funções `handleCreate*()`

**Causas Comuns:**
1. Campos obrigatórios faltando
2. CPF/RG duplicado
3. Formato de data inválido
4. Relacionamento inválido (turmaId, funcionarioId)

**Exemplo - Criar Aluno:**
```typescript
// Campos obrigatórios:
- nomeCompleto
- telefone1
- cpf (único, 11 dígitos)
- rg (único, 9 dígitos)
- dataNascimento
```

**Debug:**
```typescript
const handleCreateAluno = async (formData: Record<string, any>) => {
  console.log("FormData being sent:", formData);

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error(errorText);
    }
  } catch (error: any) {
    console.error("Full error object:", error);
    alert("Erro: " + error.message);
  }
};
```

### "CPF inválido" / "RG inválido"

**Origem:** Validação do backend ou duplicação

**Solução:**
- CPF deve ter 11 dígitos numéricos
- RG deve ter 9 dígitos numéricos
- Verificar se já existe no banco

```typescript
// Exemplo de máscara no frontend
const cleanCpf = cpf.replace(/\D/g, ""); // Remove não-numéricos
console.log("CPF limpo:", cleanCpf, "Length:", cleanCpf.length);
```

## 📤 Erros de Upload de Arquivo

### "Erro ao fazer upload de arquivo"

**Causas:**
1. Arquivo muito grande (verificar limite do backend)
2. Tipo de arquivo não suportado
3. Permissões do diretório de storage no backend

**Solução:**

```typescript
// Verificar tamanho do arquivo
const file = fileInput.files[0];
console.log("File size (MB):", file.size / 1024 / 1024);
console.log("File type:", file.type);

// Limitar tamanho (exemplo: 5MB)
if (file.size > 5 * 1024 * 1024) {
  alert("Arquivo muito grande. Máximo 5MB");
  return;
}
```

**Backend:**
```bash
# Verificar permissões do storage
ls -la $STORAGE/pictures/aluno
ls -la $STORAGE/pictures/funcionario

# Ajustar se necessário
chmod -R 755 $STORAGE
```

### "File path is null"

**Causa:** Arquivo não foi enviado corretamente ou não foi salvo

**Solução:**
```typescript
// Verificar se arquivo está no FormData
const formData = new FormData();
if (file) {
  formData.append("file", file);
  console.log("File appended:", file.name);
} else {
  console.log("No file selected");
}
```

## 🌐 Erros do Navegador

### "Cookies blocked"

**Causa:** Navegador bloqueando cookies third-party

**Solução:**
1. Usar mesmo domínio para frontend e backend (produção)
2. Configurar `SameSite=None; Secure` nos cookies (HTTPS necessário)
3. Temporariamente: permitir cookies third-party no navegador

### "CORS policy error"

**Erro Completo:**
```
Access to fetch at 'http://localhost:6060/...' from origin
'http://localhost:5173' has been blocked by CORS policy
```

**Causa:** Backend não está permitindo origem do frontend

**Solução:**

Verificar `SecurityConfig.java`:
```java
// Deve incluir:
configuration.setAllowedOrigins(Arrays.asList(
  "http://localhost:5173",
  "http://192.168.1.171:5173"
));
configuration.setAllowCredentials(true);
```

### "localStorage is not defined"

**Causa:** Tentando acessar localStorage durante SSR (não aplicável a este projeto)

**Nota:** Este projeto usa cookies, não localStorage

## 🐛 Debug e Logs

### Habilitar Logs Detalhados

**1. Console do Navegador:**
```javascript
// Abrir DevTools (F12)
// Aba Console

// Ver todas as requisições
// Aba Network > Filter: Fetch/XHR
```

**2. Logs de Requisições:**
```typescript
// Adicionar em qualquer fetch
console.log("Request URL:", url);
console.log("Request options:", options);
console.log("Request body:", body);

const response = await fetch(url, options);

console.log("Response status:", response.status);
console.log("Response headers:", [...response.headers.entries()]);

const data = await response.json();
console.log("Response data:", data);
```

**3. Logs do Estado:**
```typescript
// Em componentes
useEffect(() => {
  console.log("State updated:", { users, alunos, turmas });
}, [users, alunos, turmas]);
```

### Ferramentas de Debug

**React DevTools:**
- Instalar extensão do navegador
- Ver estado dos componentes
- Ver Context values

**Network Tab:**
- Ver todas as requisições
- Ver headers e cookies
- Ver request/response bodies

**Application Tab:**
- Ver cookies armazenados
- Ver localStorage/sessionStorage
- Clear storage

### Checklist de Debug

Quando algo não funciona:

1. ✅ Backend está rodando?
   ```bash
   curl http://localhost:6060/user/check
   ```

2. ✅ Variável de ambiente configurada?
   ```bash
   cat futebol/.env
   ```

3. ✅ Token/Cookie válido?
   ```javascript
   console.log(document.cookie);
   ```

4. ✅ CORS configurado?
   - Ver console do navegador para erros CORS

5. ✅ Dados estão corretos?
   ```javascript
   console.log("Data being sent:", data);
   ```

6. ✅ Resposta do backend?
   ```javascript
   console.log("Response:", await response.text());
   ```

## 🔧 Soluções Rápidas

### Limpar Tudo e Recomeçar

**Frontend:**
```bash
cd futebol

# Limpar node_modules
rm -rf node_modules yarn.lock
yarn install

# Limpar cache do Vite
rm -rf .vite

# Restart dev server
yarn dev
```

**Backend:**
```bash
cd FutebolBackend

# Restart containers
docker-compose down
docker-compose up -d

# Ver logs
docker-compose logs -f
```

**Navegador:**
```
1. Abrir DevTools (F12)
2. Application tab
3. Clear site data
4. Fechar e reabrir navegador
5. Fazer login novamente
```

### Testar Endpoints Manualmente

```bash
# Login
curl -X POST http://localhost:6060/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt -v

# Usar cookie em outras requisições
curl http://localhost:6060/user/all \
  -b cookies.txt -v

# Check endpoint
curl http://localhost:6060/user/check
```

## 📞 Quando Pedir Ajuda

Incluir nas informações:

1. **Mensagem de erro completa** (screenshot)
2. **Console logs** (DevTools > Console)
3. **Network logs** (DevTools > Network)
4. **Versões:**
   ```bash
   node -v
   yarn -v
   docker --version
   ```
5. **Ambiente:** Desenvolvimento / Staging / Produção
6. **Passos para reproduzir** o erro

## 📚 Referências

- [Integração com API](./INTEGRACAO_API.md) - Documentação de endpoints
- [Mensagens de Erro do Backend](../../FutebolBackend/docs/MENSAGENS_ERRO.md) - Erros do lado do servidor
- [Setup](../../SETUP.md) - Configuração inicial do sistema
