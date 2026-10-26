import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  authenticate,
  createAccount,
  type AuthResult,
  type RegisterData,
} from "@/services/authService";

type AuthContextData = {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<AuthResult>;
  signUp: (data: RegisterData) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

// CONTEXTO DE AUTENTICAÇÃO: guarda o ESTADO da sessão (logado ou não) para o app inteiro.
// As regras (validação, mensagens de erro) ficam em services/authService.
const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ao abrir o app: se há usuário salvo no aparelho, a sessão é restaurada (fica logado).
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await AsyncStorage.getItem("@Auth:user");
        if (storedUser) setIsAuthenticated(true);
      } catch (error) {
        console.warn("[AuthContext] Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  // Login: o service chama a API (que devolve o cookie de sessão); aqui só atualizamos o estado.
  async function signIn(username: string, password: string): Promise<AuthResult> {
    const result = await authenticate(username, password);
    if (result.success) {
      await AsyncStorage.setItem("@Auth:user", username.trim());
      setIsAuthenticated(true);
    }
    return result;
  }

  // Cadastro: não muda a sessão (o usuário ainda precisa fazer login).
  function signUp(data: RegisterData): Promise<AuthResult> {
    return createAccount(data);
  }

  async function signOut() {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("@Auth:user");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signUp, signOut }}>
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
