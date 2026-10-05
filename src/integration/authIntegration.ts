import axios from "axios";
import { apiClient } from "./apiClient";

// Cria o usuário na API. O corpo da resposta não é usado: basta não dar erro.
export async function registerUser(
  username: string,
  password: string,
  email: string = "",
  cep: string = ""
): Promise<void> {
  await apiClient.post("/fatec/login/v1/create", { username, password, email, cep });
}

// Faz login na API. A sessão é o cookie que o servidor devolve, não o corpo da resposta.
export async function loginUser(username: string, password: string): Promise<void> {
  await apiClient.post("/fatec/login/v1/auth", { username, password });
}

// Informações úteis de um erro da API.
// status fica undefined quando o servidor nem respondeu (sem internet, timeout...).
export interface ApiErrorInfo {
  status?: number;
  serverMessage?: string;
}

export function getApiErrorInfo(error: unknown): ApiErrorInfo {
  if (!axios.isAxiosError(error)) return {};

  const data = error.response?.data;
  let serverMessage: string | undefined;

  if (typeof data === "string") {
    serverMessage = data.trim();
  } else if (data && typeof data === "object") {
    const body = data as { message?: unknown; error?: unknown };
    const text = body.message ?? body.error;
    if (typeof text === "string") serverMessage = text.trim();
  }

  // Ignora páginas HTML de erro ou textos longos demais para um alerta.
  if (serverMessage && (serverMessage.startsWith("<") || serverMessage.length > 120)) {
    serverMessage = undefined;
  }

  return { status: error.response?.status, serverMessage: serverMessage || undefined };
}
