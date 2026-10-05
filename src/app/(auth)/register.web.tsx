import { useRef } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { Link } from "expo-router";

import { Alert } from "@/components/alert";
import { AuthWebLayout } from "@/components/trilha/AuthWebLayout";
import { Field } from "@/components/trilha/Field";
import { PasswordStrength } from "@/components/trilha/PasswordStrength";
import { PrimaryButton } from "@/components/trilha/PrimaryButton";
import { Trilha } from "@/constants/colors";
import { MIN_PASSWORD, useRegisterForm } from "@/hooks/useRegisterForm";

// Cadastro do SITE (navegador). A versão do celular está em register.tsx.
// O Expo Router escolhe este arquivo automaticamente na Web por causa do sufixo ".web".
export default function RegisterWeb() {
  const {
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
    strength,
    loading,
    submit,
    alertProps,
  } = useRegisterForm();

  // Refs dos campos: ao apertar "próximo" no teclado, o foco vai para o campo seguinte.
  const emailRef = useRef<TextInput>(null);
  const cepRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const confirmarRef = useRef<TextInput>(null);

  return (
    <>
      <AuthWebLayout
        eyebrow="INÍCIO DE PERFORMANCE"
        title="Crie sua conta"
        subtitle="Cadastre-se para usar o Meu Percurso no aplicativo."
      >
        <Field
          label="Nome de usuário"
          icon="person-outline"
          placeholder="Ex: alex_silva"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <Field
          ref={emailRef}
          label="E-mail"
          icon="mail-outline"
          placeholder="seu.email@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => cepRef.current?.focus()}
        />
        <Field
          ref={cepRef}
          label="CEP"
          hint="Opcional"
          icon="location-outline"
          placeholder="00000-000"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
          maxLength={9}
          returnKeyType="next"
          onSubmitEditing={() => senhaRef.current?.focus()}
        />
        <Field
          ref={senhaRef}
          label="Criar senha"
          hint={`Mínimo ${MIN_PASSWORD} caracteres`}
          icon="lock-closed-outline"
          placeholder="••••••••"
          value={senha}
          onChangeText={setSenha}
          secret
          returnKeyType="next"
          onSubmitEditing={() => confirmarRef.current?.focus()}
        />
        <PasswordStrength strength={strength} />
        <Field
          ref={confirmarRef}
          label="Confirmar senha"
          icon="refresh-circle-outline"
          placeholder="••••••••"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secret
          returnKeyType="go"
          onSubmitEditing={submit}
        />

        <PrimaryButton title="Criar conta" onPress={submit} loading={loading} style={styles.cta} />

        <Text style={styles.footer}>
          Já tem conta?{" "}
          <Link href="/login" style={styles.link}>
            Entrar
          </Link>
        </Text>
      </AuthWebLayout>

      <Alert {...alertProps} />
    </>
  );
}

const styles = StyleSheet.create({
  cta: { marginTop: 8 },
  footer: { textAlign: "center", color: Trilha.muted, marginTop: 20, fontSize: 14 },
  link: { color: Trilha.primary, fontWeight: "800" },
});
