import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface HeaderProps {
  title: string;
  onBackPress?: () => void; // se não for passado, não mostra o botão voltar
}

// Cabeçalho do tema claro: botão "Voltar" opcional + título centralizado.
export function Header({ title, onBackPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      {onBackPress ? (
        <Pressable onPress={onBackPress} hitSlop={12}>
          <Text style={styles.back}>Voltar</Text>
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.backPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  title: { fontSize: 18, fontWeight: "800", color: Colors.text },
  back: { fontSize: 15, fontWeight: "600", color: Colors.primary },
  backPlaceholder: { width: 56 },
});
