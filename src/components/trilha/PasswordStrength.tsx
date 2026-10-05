import React from "react";
import { StyleSheet, View } from "react-native";
import { Trilha } from "@/constants/colors";

// Quatro barrinhas que acendem conforme a força da senha (0 a 4).
export function PasswordStrength({ strength }: { strength: number }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={[styles.bar, i <= strength && styles.on]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6, marginTop: -6, marginBottom: 14 },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Trilha.surfaceStrong },
  on: { backgroundColor: Trilha.primary },
});
