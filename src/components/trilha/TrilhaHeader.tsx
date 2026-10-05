import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "./Logo";
import { Trilha } from "@/constants/colors";

interface Props {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

// Barra superior: [voltar] [logo + título] .......... [conteúdo opcional à direita]
// O lado direito só aparece quando a tela passa `right` (home e atividade mostram GPS + avatar;
// login e cadastro não passam nada, porque o usuário ainda não entrou).
export function TrilhaHeader({ title = "TrilhaRun", subtitle, onBack, right }: Props) {
  return (
    <View style={styles.bar}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={10} style={styles.back}>
          <Ionicons name="arrow-back" size={20} color={Trilha.text} />
        </Pressable>
      ) : null}
      <Logo />
      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

// Avatar provisório (sem foto): círculo com ícone de pessoa.
export function Avatar({ size = 32 }: { size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name="person" size={size * 0.55} color={Trilha.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  back: { padding: 4 },
  titles: { flex: 1 },
  title: { fontSize: 17, fontWeight: "800", color: Trilha.text },
  subtitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: Trilha.muted,
    textTransform: "uppercase",
  },
  avatar: {
    backgroundColor: Trilha.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Trilha.white,
  },
});
