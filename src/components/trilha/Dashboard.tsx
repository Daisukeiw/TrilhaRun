import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Trilha } from "@/constants/colors";

// Selo "GPS OK" do cabeçalho.
export function GpsBadge({ active }: { active: boolean }) {
  return (
    <View style={styles.gps}>
      <Text style={styles.gpsLabel}>GPS</Text>
      <Text style={[styles.gpsValue, !active && { color: Trilha.muted }]}>
        {active ? "OK" : "PRONTO"}
      </Text>
    </View>
  );
}

// Cartão grande com a distância percorrida.
export function DistanceCard({ km, note }: { km: string; note: string }) {
  return (
    <View style={styles.distance}>
      <Text style={styles.distanceLabel}>DISTÂNCIA PERCORRIDA</Text>
      <View style={styles.distanceRow}>
        <Text style={styles.distanceValue}>{km}</Text>
        <Text style={styles.distanceUnit}>KM</Text>
      </View>
      <Text style={styles.distanceNote}>{note}</Text>
    </View>
  );
}

// Cartão pequeno com rótulo + valor.
export function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.mini}>
      <Text style={styles.miniLabel}>{label}</Text>
      <Text style={styles.miniValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gps: {
    backgroundColor: Trilha.surface,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    marginRight: 6,
  },
  gpsLabel: { fontSize: 8, fontWeight: "800", letterSpacing: 0.8, color: Trilha.muted },
  gpsValue: { fontSize: 12, fontWeight: "900", color: Trilha.primary },
  distance: {
    backgroundColor: Trilha.surface,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
  },
  distanceLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.1, color: Trilha.muted },
  distanceRow: { flexDirection: "row", alignItems: "flex-end", gap: 6, marginVertical: 4 },
  distanceValue: {
    fontSize: 58,
    fontWeight: "900",
    color: Trilha.text,
    fontVariant: ["tabular-nums"],
  },
  distanceUnit: { fontSize: 20, fontWeight: "900", color: Trilha.primary, marginBottom: 12 },
  distanceNote: { fontSize: 12, fontWeight: "700", color: Trilha.primary },
  mini: { flex: 1, backgroundColor: Trilha.surface, borderRadius: 20, padding: 16 },
  miniLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: Trilha.muted,
    marginBottom: 6,
  },
  miniValue: { fontSize: 26, fontWeight: "900", color: Trilha.text, fontVariant: ["tabular-nums"] },
});
