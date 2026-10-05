import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface StatCardProps {
  label: string;
  value: string;
}

// Cartão de estatística: rótulo pequeno em cima e valor grande embaixo.
export function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    minWidth: "45%",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  label: { fontSize: 13, color: Colors.muted, marginBottom: 6 },
  value: { fontSize: 24, fontWeight: "800", color: Colors.text },
});
