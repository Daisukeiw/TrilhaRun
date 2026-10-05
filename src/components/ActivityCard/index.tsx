import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import { getActivityLabel } from "@/constants/activityTypes";
import { Activity } from "@/types/activity";
import { formatDistance } from "@/utils/distance";
import { formatDateTime, formatTime } from "@/utils/formatTime";
import { getMetricValue } from "@/utils/metrics";

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
}

// Cartão de uma atividade no histórico: tipo, data, distância, duração e ritmo/velocidade.
export function ActivityCard({ activity, onPress }: ActivityCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.topRow}>
        <Text style={styles.type}>{getActivityLabel(activity.type)}</Text>
        <Text style={styles.date}>{formatDateTime(activity.startedAt)}</Text>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.stat}>{formatDistance(activity.distance)}</Text>
        <Text style={styles.stat}>{formatTime(activity.duration)}</Text>
        <Text style={styles.stat}>{getMetricValue(activity)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  pressed: { opacity: 0.7 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  type: { fontSize: 17, fontWeight: "800", color: Colors.primary },
  date: { fontSize: 13, color: Colors.muted },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  stat: { fontSize: 15, fontWeight: "600", color: Colors.text },
});
