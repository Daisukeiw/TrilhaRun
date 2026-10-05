import { useState } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useAlertState } from "./useAlertState";

// Lógica do formulário de login. As telas (mobile e web) só desenham a interface.
export function useLoginForm() {
  const { signIn } = useAuth();
  const { alertProps, showAlert } = useAlertState();

  const [name, setName] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (loading) return;

    if (!name.trim() || !senha.trim()) {
      showAlert("Campos obrigatórios", "Preencha o usuário e a senha para continuar.", "warning");
      return;
    }

    setLoading(true);
    // Valida via API (AuthContext.signIn): a sessão é o cookie devolvido pelo servidor.
    const result = await signIn(name.trim(), senha);
    setLoading(false);

    if (result.success) {
      // Na Web o destino é o site; no celular, o app.
      router.replace(Platform.OS === "web" ? "/about" : "/home");
    } else {
      showAlert("Não foi possível entrar", result.message, "error");
    }
  }

  return { name, setName, senha, setSenha, loading, submit, alertProps, showAlert };
}
