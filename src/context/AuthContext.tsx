import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerUser, loginUser, getApiErrorInfo } from "@/integration/authIntegration";

// Resultado de login/cadastro: as telas mostram `message` quando success é false.
export type AuthResult = { success: true } | { success: false; message: string };

type AuthContextData = {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<AuthResult>;
  signUp: (username: string, password: string, email?: string, cep?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const NETWORK_ERROR =
  "Não foi possível conectar ao servidor. Ele pode estar iniciando (pode levar até 1 minuto). Aguarde um pouco e tente novamente.";

function withServerMessage(text: string, serverMessage?: string): string {
  return serverMessage ? `${text} (${serverMessage})` : text;
}

// CONTEXTO DE AUTENTICAÇÃO: guarda quem está logado e oferece signIn, signUp e signOut.
// As telas não falam com a API diretamente: chamam estas funções, que usam a integração.
const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ao abrir o app: se há usuário salvo no aparelho, a sessão é restaurada (fica logado).
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await AsyncStorage.getItem("@Auth:user");

        if (storedUser) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.warn("[AuthContext] Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // Login utilizando a sessão por cookie da API.
  async function signIn(username: string, password: string): Promise<AuthResult> {
    try {
      await loginUser(username, password);

      await AsyncStorage.setItem("@Auth:user", username);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.warn("[AuthContext] signIn erro:", error);

      const { status, serverMessage } = getApiErrorInfo(error);

      if (status === undefined) {
        return { success: false, message: NETWORK_ERROR };
      }
      if (status >= 400 && status < 500) {
        return {
          success: false,
          message: withServerMessage("Usuário ou senha inválidos. Tente novamente.", serverMessage),
        };
      }
      return {
        success: false,
        message: `O servidor respondeu com erro ${status}. Tente novamente em instantes.`,
      };
    }
  }

  // Cadastro
  async function signUp(
    username: string,
    password: string,
    email: string = "",
    cep: string = ""
  ): Promise<AuthResult> {
    try {
      await registerUser(username, password, email, cep);
      return { success: true };
    } catch (error) {
      console.warn("[AuthContext] signUp erro:", error);

      const { status, serverMessage } = getApiErrorInfo(error);

      if (status === undefined) {
        return { success: false, message: NETWORK_ERROR };
      }
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
      return {
        success: false,
        message: `O servidor respondeu com erro ${status}. Tente novamente em instantes.`,
      };
    }
  }

  // Logout
  async function signOut() {
    setIsAuthenticated(false);

    await AsyncStorage.removeItem("@Auth:user");
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth precisa ser usado dentro de um <AuthProvider>");
  }

  return context;
}
