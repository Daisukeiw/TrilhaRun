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
import { HeroArt } from "@/components/trilha/HeroArt";
import { PrimaryButton } from "@/components/trilha/PrimaryButton";
import { TrilhaHeader } from "@/components/trilha/TrilhaHeader";
import { Trilha } from "@/constants/colors";
import { useLoginForm } from "@/hooks/useLoginForm";

// Login do APLICATIVO (celular). A versão do navegador está em login.web.tsx.
export default function Login() {
  // A lógica (valores, validação, chamada à API) fica no hook; esta tela só desenha.
  const { name, setName, senha, setSenha, loading, submit, alertProps, showAlert } = useLoginForm();
  // senhaRef permite pular do campo de usuário para o de senha ao apertar "próximo".
  const senhaRef = useRef<TextInput>(null);

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
          subtitle="Entrar na sua conta"
          onBack={router.canGoBack() ? () => router.back() : undefined}
        />

        <HeroArt badge="GPS TRACKING ATIVO" chip="+18.420 KM" />

        <View style={styles.welcome}>
          <View style={styles.iconCircle}>
            <Ionicons name="walk" size={22} color={Trilha.primary} />
          </View>
          <Text style={styles.eyebrow}>PASSADA POR PASSADA</Text>
          <Text style={styles.title}>Bem-vindo de volta, atleta!</Text>
          <Text style={styles.subtitle}>
            Acesse sua conta para continuar registrando suas corridas, trilhas e recordes pessoais.
          </Text>
        </View>

        <Field
          label="Nome de usuário"
          icon="person-outline"
          placeholder="ex.: maratonista"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => senhaRef.current?.focus()}
        />
        <Field
          ref={senhaRef}
          label="Sua senha"
          icon="lock-closed-outline"
          placeholder="Digite sua senha de acesso"
          value={senha}
          onChangeText={setSenha}
          secret
          returnKeyType="go"
          onSubmitEditing={submit}
        />

        <Pressable
          style={styles.forgotRow}
          onPress={() =>
            showAlert("Recuperar senha", "Este recurso ainda não está disponível.", "info")
          }
        >
          <Text style={styles.forgot}>Esqueceu a senha?</Text>
        </Pressable>

        <PrimaryButton title="Entrar na Trilha" onPress={submit} loading={loading} />

        <View style={styles.signup}>
          <View style={styles.openTag}>
            <Ionicons name="checkmark-circle-outline" size={13} color={Trilha.primary} />
            <Text style={styles.openTagText}>Comunidade Aberta</Text>
          </View>
          <Text style={styles.signupQuestion}>Não tem uma conta no TrilhaRun?</Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.signupLink}>Cadastre-se gratuitamente →</Text>
          </Pressable>
        </View>
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
  welcome: {
    alignItems: "center",
    backgroundColor: Trilha.surface,
    borderRadius: 24,
    padding: 20,
    marginTop: 14,
    marginBottom: 22,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Trilha.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2, color: Trilha.primary },
  title: { fontSize: 26, fontWeight: "900", color: Trilha.text, textAlign: "center", marginTop: 4 },
  subtitle: {
    fontSize: 13,
    color: Trilha.muted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 19,
  },
  forgotRow: { alignSelf: "flex-end", marginBottom: 18 },
  forgot: { fontSize: 13, fontWeight: "800", color: Trilha.primary },
  signup: {
    alignItems: "center",
    backgroundColor: Trilha.surface,
    borderRadius: 24,
    padding: 18,
    marginTop: 14,
  },
  openTag: { flexDirection: "row", gap: 6, alignItems: "center", marginBottom: 6 },
  openTagText: {
    fontSize: 11,
    color: Trilha.primary,
    fontWeight: "700",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
  },
  signupQuestion: { fontSize: 13, color: Trilha.muted },
  signupLink: { fontSize: 15, fontWeight: "800", color: Trilha.primary, marginTop: 6 },
});
