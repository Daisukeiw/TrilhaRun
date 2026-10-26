import { useState } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { validateLogin } from "@/services/authService";
import { useAlertState } from "./useAlertState";

// ESTADO e FLUXO da tela de login (celular e web usam o mesmo hook).
// Guarda os campos, o carregamento e o alerta; as regras ficam no authService.
export function useLoginForm() {
  const { signIn } = useAuth();
  const { alertProps, showAlert } = useAlertState();

  const [name, setName] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (loading) return;

    const invalid = validateLogin(name, senha);
    if (invalid) {
      showAlert(invalid.title, invalid.message, "warning");
      return;
    }

    setLoading(true);
    const result = await signIn(name, senha);
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
