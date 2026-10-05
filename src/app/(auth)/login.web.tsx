import { useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";

import { Alert } from "@/components/alert";
import { AuthWebLayout } from "@/components/trilha/AuthWebLayout";
import { Field } from "@/components/trilha/Field";
import { PrimaryButton } from "@/components/trilha/PrimaryButton";
import { Trilha } from "@/constants/colors";
import { useLoginForm } from "@/hooks/useLoginForm";

// Login do SITE (navegador). A versão do celular está em login.tsx.
// O Expo Router escolhe este arquivo automaticamente na Web por causa do sufixo ".web".
export default function LoginWeb() {
  // A lógica (valores, validação, chamada à API) fica no hook; esta tela só desenha.
  const { name, setName, senha, setSenha, loading, submit, alertProps, showAlert } = useLoginForm();
  // senhaRef permite pular do campo de usuário para o de senha ao apertar "próximo".
  const senhaRef = useRef<TextInput>(null);

  return (
    <>
      <AuthWebLayout
        eyebrow="BEM-VINDO DE VOLTA"
        title="Entrar"
        subtitle="Acesse sua conta para continuar."
      >
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

        <View style={styles.forgotRow}>
          <Text
            style={styles.forgot}
            onPress={() =>
              showAlert("Recuperar senha", "Este recurso ainda não está disponível.", "info")
            }
          >
            Esqueceu a senha?
          </Text>
        </View>

        <PrimaryButton title="Entrar" onPress={submit} loading={loading} />

        <Text style={styles.footer}>
          Não tem uma conta?{" "}
          <Link href="/register" style={styles.link}>
            Cadastre-se gratuitamente
          </Link>
        </Text>
      </AuthWebLayout>

      <Alert {...alertProps} />
    </>
  );
}

const styles = StyleSheet.create({
  forgotRow: { alignItems: "flex-end", marginBottom: 18 },
  forgot: { fontSize: 13, fontWeight: "800", color: Trilha.primary },
  footer: { textAlign: "center", color: Trilha.muted, marginTop: 20, fontSize: 14 },
  link: { color: Trilha.primary, fontWeight: "800" },
});
