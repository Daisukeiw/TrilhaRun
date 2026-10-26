import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { passwordStrength, validateRegister } from "@/services/authService";
import { useAlertState } from "./useAlertState";

// ESTADO e FLUXO da tela de cadastro (celular e web usam o mesmo hook).
// Guarda os campos, o carregamento e o alerta; as regras ficam no authService.
export function useRegisterForm() {
  const { signUp } = useAuth();
  const { alertProps, showAlert } = useAlertState();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Guarda o timer do redirecionamento para cancelá-lo se a tela for fechada antes.
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  async function submit() {
    if (loading) return;

    const data = { username: name, email, cep, password: senha, confirmPassword: confirmarSenha };

    const invalid = validateRegister(data);
    if (invalid) {
      showAlert(invalid.title, invalid.message, "warning");
      return;
    }

    setLoading(true);
    const result = await signUp(data);
    setLoading(false);

    if (result.success) {
      showAlert(
        "Conta criada!",
        "Sua conta foi criada com sucesso. Faça login para continuar.",
        "success"
      );
      // Pequeno delay para o usuário ver o alerta antes de voltar ao login.
      redirectTimer.current = setTimeout(() => router.replace("/login"), 1200);
    } else {
      showAlert("Não foi possível cadastrar", result.message, "error");
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    cep,
    setCep,
    senha,
    setSenha,
    confirmarSenha,
    setConfirmarSenha,
    strength: passwordStrength(senha),
    loading,
    submit,
    alertProps,
    showAlert,
  };
}
