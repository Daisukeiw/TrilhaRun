import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { RouteMap } from "@/components/RouteMap";
import { StatCard } from "@/components/StatCard";
import { getActivityLabel } from "@/constants/activityTypes";
import { Colors } from "@/constants/colors";
import { deleteActivity, getActivityById } from "@/storage/activityStorage";
import { Activity } from "@/types/activity";
import { formatDistance } from "@/utils/distance";
import { formatDateTime, formatTime } from "@/utils/formatTime";
import { getMetricLabel, getMetricValue } from "@/utils/metrics";

// DETALHES: dados completos de uma atividade salva + mapa com o percurso.
// Recebe o id pela rota (/activity-details?id=...) e busca no AsyncStorage.
export default function ActivityDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega a atividade quando a tela abre (ou se o id mudar).
  useEffect(() => {
    getActivityById(id)
      .then(setActivity)
      .finally(() => setLoading(false));
  }, [id]);

  function handleDelete() {
    Alert.alert("Excluir atividade?", "Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteActivity(id);
          router.back();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Detalhes" onBackPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  if (!activity) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Detalhes" onBackPress={() => router.back()} />
        <Text style={styles.message}>Atividade não encontrada.</Text>
      </SafeAreaView>
    );
  }

  // A linha do percurso (Polyline) precisa de pelo menos 2 pontos.
  const hasRoute = activity.route.length >= 2;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Detalhes" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.type}>{getActivityLabel(activity.type)}</Text>
        <Text style={styles.date}>{formatDateTime(activity.startedAt)}</Text>

        <View style={styles.stats}>
          <StatCard label="Distância" value={formatDistance(activity.distance)} />
          <StatCard label="Duração" value={formatTime(activity.duration)} />
          <StatCard label={getMetricLabel(activity.type)} value={getMetricValue(activity)} />
          <StatCard label="Pontos GPS" value={String(activity.route.length)} />
        </View>

        <Text style={styles.sectionTitle}>Percurso</Text>
        {hasRoute ? (
          <RouteMap route={activity.route} />
        ) : (
          <Text style={styles.message}>Não há pontos suficientes para desenhar o percurso.</Text>
        )}

        <View style={styles.deleteButton}>
          <Button title="Excluir atividade" variant="danger" onPress={handleDelete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 24 },
  content: { paddingBottom: 32 },
  type: { fontSize: 28, fontWeight: "900", color: Colors.primary },
  date: { fontSize: 14, color: Colors.muted, marginTop: 4, marginBottom: 20 },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    marginTop: 28,
    marginBottom: 12,
  },
  message: { color: Colors.muted, fontSize: 15, marginTop: 8 },
  deleteButton: { marginTop: 28 },
});
