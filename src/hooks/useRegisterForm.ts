import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useAlertState } from "./useAlertState";

export const MIN_PASSWORD = 8;

// 0 a 4 barras: tamanho, número, letra maiúscula e símbolo.
export function passwordStrength(password: string): number {
  if (!password) return 0;
  let score = password.length >= MIN_PASSWORD ? 1 : 0;
  if (/\d/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.max(score, 1);
}

// Lógica do formulário de cadastro. As telas (mobile e web) só desenham a interface.
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

    // Validações simples de formulário.
    if (!name.trim() || !email.trim() || !senha.trim()) {
      showAlert(
        "Campos obrigatórios",
        "Preencha usuário, e-mail e senha para continuar.",
        "warning"
      );
      return;
    }

    if (!email.includes("@")) {
      showAlert("E-mail inválido", "Digite um e-mail válido.", "warning");
      return;
    }

    // O CEP é opcional; se preenchido, precisa ter 8 números.
    const cepDigits = cep.replace(/\D/g, "");
    if (cepDigits && cepDigits.length !== 8) {
      showAlert("CEP inválido", "O CEP deve ter 8 números.", "warning");
      return;
    }

    if (senha.length < MIN_PASSWORD) {
      showAlert("Senha curta", `A senha deve ter no mínimo ${MIN_PASSWORD} caracteres.`, "warning");
      return;
    }

    if (senha !== confirmarSenha) {
      showAlert("Senhas diferentes", "A senha e a confirmação precisam ser iguais.", "error");
      return;
    }

    setLoading(true);
    // Cadastra o usuário via API (AuthContext.signUp).
    const result = await signUp(name.trim(), senha, email.trim(), cepDigits);
    setLoading(false);

    if (result.success) {
      showAlert(
        "Conta criada!",
        "Sua conta foi criada com sucesso. Faça login para continuar.",
        "success"
      );

      // Pequeno delay para o usuário ver o alerta antes de voltar ao login.
      redirectTimer.current = setTimeout(() => {
        router.replace("/login");
      }, 1200);
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
