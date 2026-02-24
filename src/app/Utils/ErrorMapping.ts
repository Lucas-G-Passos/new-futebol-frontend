// Map backend error codes to user-friendly Portuguese messages
export const mapErrorMessage = (error: any): string => {
  // Handle Response objects
  if (error?.status) {
    switch (error.status) {
      case 400:
        return "Dados inválidos. Verifique as informações e tente novamente.";
      case 401:
        return "Não autorizado. Faça login novamente.";
      case 403:
        return "Você não tem permissão para realizar esta ação.";
      case 404:
        return "Recurso não encontrado.";
      case 409:
        // Handle duplicate key errors with field info
        if (error.details?.field) {
          return `${getFieldLabel(error.details.field)} "${error.details.value}" já existe.`;
        }
        return "Registro duplicado. Verifique os dados e tente novamente.";
      case 422:
        return "Erro de validação. Verifique os campos e tente novamente.";
      case 500:
        return "Erro no servidor. Tente novamente mais tarde.";
      case 502:
        return "Serviço indisponível. Tente novamente em instantes.";
      case 503:
        return "Sistema em manutenção. Tente novamente mais tarde.";
      default:
        return `Erro (${error.status}). Tente novamente.`;
    }
  }

  // Handle Error objects with message
  if (error?.message) {
    // Map common backend error messages
    const msg = error.message.toLowerCase();

    if (msg.includes("username") && msg.includes("exists")) {
      return "Nome de usuário já está em uso.";
    }
    if (msg.includes("email") && msg.includes("exists")) {
      return "E-mail já está cadastrado.";
    }
    if (msg.includes("credentials")) {
      return "Usuário ou senha incorretos.";
    }
    if (msg.includes("duplicate")) {
      return "Registro duplicado encontrado.";
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return "Erro de conexão. Verifique sua internet.";
    }

    // Return original message if no mapping
    return error.message;
  }

  // Fallback for unknown errors
  return "Ocorreu um erro inesperado. Tente novamente.";
};

// Map field names to Portuguese labels
const getFieldLabel = (field: string): string => {
  const fieldLabels: Record<string, string> = {
    username: "Nome de usuário",
    email: "E-mail",
    cpf: "CPF",
    rg: "RG",
    telefone: "Telefone",
    nome: "Nome",
    nomeCompleto: "Nome completo",
  };

  return fieldLabels[field] || field;
};

// Parse fetch Response and extract error info
export const parseResponseError = async (
  response: Response
): Promise<{ message: string; details?: any }> => {
  try {
    const data = await response.json();

    // Backend error format: { error: "CODE", message: "...", details: {...} }
    if (data.message) {
      return {
        message: mapErrorMessage({ ...data, status: response.status }),
        details: data.details,
      };
    }

    return { message: mapErrorMessage({ status: response.status }) };
  } catch {
    // If not JSON, return text or generic message
    const text = await response.text();
    return {
      message: text || mapErrorMessage({ status: response.status }),
    };
  }
};
