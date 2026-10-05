import React from "react";
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Trilha } from "@/constants/colors";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Botão principal verde com seta (login e cadastro, Web e Mobile).
export function PrimaryButton({ title, onPress, loading = false, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.button, (pressed || loading) && { opacity: 0.8 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={Trilha.white} />
      ) : (
        <>
          <Text style={styles.text}>{title}</Text>
          <Ionicons name="arrow-forward" size={18} color={Trilha.white} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: 10,
    height: 56,
    borderRadius: 28,
    backgroundColor: Trilha.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: Trilha.white, fontSize: 16, fontWeight: "800" },
});
