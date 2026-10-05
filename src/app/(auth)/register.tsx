import { useRef } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Alert } from "@/components/alert";
import { Field } from "@/components/trilha/Field";
import { PasswordStrength } from "@/components/trilha/PasswordStrength";
import { PrimaryButton } from "@/components/trilha/PrimaryButton";
import { TrilhaHeader } from "@/components/trilha/TrilhaHeader";
import { Trilha } from "@/constants/colors";
import { MIN_PASSWORD, useRegisterForm } from "@/hooks/useRegisterForm";

// Cadastro do APLICATIVO (celular). A versão do navegador está em register.web.tsx.
export default function Register() {
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TrilhaHeader
          subtitle="Criar nova conta"
          onBack={() => (router.canGoBack() ? router.back() : router.replace("/login"))}
        />

        <View style={styles.hero}>
          <View style={styles.heroTag}>
            <Ionicons name="flash" size={11} color={Trilha.primary} />
            <Text style={styles.heroTagText}>INÍCIO DE PERFORMANCE</Text>
          </View>
          <Text style={styles.heroTitle}>Crie sua conta atlética</Text>
          <Text style={styles.heroSub}>
            Junte-se à comunidade de corredores e acompanhe cada quilômetro com precisão GPS.
          </Text>
        </View>

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

        <Pressable style={styles.loginLink} onPress={() => router.replace("/login")}>
          <Text style={styles.loginText}>
            Já tem conta? <Text style={styles.loginStrong}>Entrar na Trilha</Text>
          </Text>
        </Pressable>
      </ScrollView>

      <Alert {...alertProps} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Trilha.bg },
  content: {
    padding: 18,
    paddingTop: 44,
    paddingBottom: 36,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  hero: {
    backgroundColor: Trilha.surface,
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  heroTag: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 8 },
  heroTagText: { fontSize: 10, fontWeight: "800", letterSpacing: 1.1, color: Trilha.primary },
  heroTitle: { fontSize: 30, fontWeight: "900", color: Trilha.text, lineHeight: 34 },
  heroSub: { fontSize: 13, color: Trilha.muted, marginTop: 8, lineHeight: 19 },
  cta: { marginTop: 8 },
  loginLink: { alignSelf: "center", marginTop: 18, padding: 6 },
  loginText: { fontSize: 13, color: Trilha.muted },
  loginStrong: { fontWeight: "800", color: Trilha.primary },
});
