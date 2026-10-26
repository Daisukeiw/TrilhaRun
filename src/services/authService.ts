import { loginUser, registerUser, getApiErrorInfo } from "@/integration/authIntegration";

// REGRAS DE NEGÓCIO DA AUTENTICAÇÃO.
// Funções sem React: recebem dados, aplicam as regras e devolvem um resultado.
// Os hooks (estado da tela) e o AuthContext (estado da sessão) só chamam estas funções.

export const MIN_PASSWORD = 8;

// Erro de validação, pronto para virar um alerta na tela.
export type ValidationError = { title: string; message: string };

// Resultado de login/cadastro na API.
export type AuthResult = { success: true } | { success: false; message: string };

export type RegisterData = {
  username: string;
  email: string;
  cep: string;
  password: string;
  confirmPassword: string;
};

const NETWORK_ERROR =
  "Não foi possível conectar ao servidor. Ele pode estar iniciando (pode levar até 1 minuto). Aguarde um pouco e tente novamente.";

// ---------- validações ----------

export function validateLogin(username: string, password: string): ValidationError | null {
  if (!username.trim() || !password.trim()) {
    return { title: "Campos obrigatórios", message: "Preencha o usuário e a senha para continuar." };
  }
  return null;
}

export function validateRegister(data: RegisterData): ValidationError | null {
  if (!data.username.trim() || !data.email.trim() || !data.password.trim()) {
    return {
      title: "Campos obrigatórios",
      message: "Preencha usuário, e-mail e senha para continuar.",
    };
  }
  if (!data.email.includes("@")) {
    return { title: "E-mail inválido", message: "Digite um e-mail válido." };
  }
  // O CEP é opcional; se preenchido, precisa ter 8 números.
  const cep = onlyDigits(data.cep);
  if (cep && cep.length !== 8) {
    return { title: "CEP inválido", message: "O CEP deve ter 8 números." };
  }
  if (data.password.length < MIN_PASSWORD) {
    return {
      title: "Senha curta",
      message: `A senha deve ter no mínimo ${MIN_PASSWORD} caracteres.`,
    };
  }
  if (data.password !== data.confirmPassword) {
    return { title: "Senhas diferentes", message: "A senha e a confirmação precisam ser iguais." };
  }
  return null;
}

// 0 a 4 barras: tamanho, número, letra maiúscula e símbolo.
export function passwordStrength(password: string): number {
  if (!password) return 0;
  let score = password.length >= MIN_PASSWORD ? 1 : 0;
  if (/\d/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.max(score, 1);
}

// "03870-000" -> "03870000"
function onlyDigits(text: string): string {
  return text.replace(/\D/g, "");
}

// ---------- chamadas à API (via integration) ----------

export async function authenticate(username: string, password: string): Promise<AuthResult> {
  try {
    await loginUser(username.trim(), password);
    return { success: true };
  } catch (error) {
    console.warn("[authService] login erro:", error);
    const { status, serverMessage } = getApiErrorInfo(error);

    if (status === undefined) return { success: false, message: NETWORK_ERROR };
    if (status >= 400 && status < 500) {
      return {
        success: false,
        message: withServerMessage("Usuário ou senha inválidos. Tente novamente.", serverMessage),
      };
    }
    return { success: false, message: serverErrorMessage(status) };
  }
}

export async function createAccount(data: RegisterData): Promise<AuthResult> {
  try {
    await registerUser(data.username.trim(), data.password, data.email.trim(), onlyDigits(data.cep));
    return { success: true };
  } catch (error) {
    console.warn("[authService] cadastro erro:", error);
    const { status, serverMessage } = getApiErrorInfo(error);

    if (status === undefined) return { success: false, message: NETWORK_ERROR };
    if (status === 403) {
      return {
        success: false,
        message: withServerMessage(
          "O servidor recusou o cadastro (403 Forbidden). Tente outro nome de usuário; se continuar, a recusa vem do próprio servidor.",
          serverMessage
        ),
      };
    }
    if (status === 400 || status === 409 || status === 422) {
      return {
        success: false,
        message: withServerMessage(
          "Não foi possível criar a conta: o usuário já existe ou algum dado é inválido.",
          serverMessage
        ),
      };
    }
    return { success: false, message: serverErrorMessage(status) };
  }
}

function withServerMessage(text: string, serverMessage?: string): string {
  return serverMessage ? `${text} (${serverMessage})` : text;
}

function serverErrorMessage(status: number): string {
  return `O servidor respondeu com erro ${status}. Tente novamente em instantes.`;
}
