import { parseResponseError } from "./ErrorMapping";

// Fetch wrapper that automatically handles errors
export const apiCall = async (
  url: string,
  options?: RequestInit,
  errorHandler?: (error: string) => void
): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await parseResponseError(response);

      // Use custom error handler if provided, otherwise throw
      if (errorHandler) {
        errorHandler(error.message);
      } else {
        throw new Error(error.message);
      }
    }

    return response;
  } catch (error: any) {
    // Network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      const networkError = "Erro de conexão. Verifique sua internet.";
      if (errorHandler) {
        errorHandler(networkError);
      } else {
        throw new Error(networkError);
      }
    }

    throw error;
  }
};

// Hook-based API caller is not needed here since we can't use hooks outside of React
// Instead, components should use useError hook directly and pass errorHandler to apiCall
