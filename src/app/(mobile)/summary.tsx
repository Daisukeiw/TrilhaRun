import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { StatCard } from "@/components/StatCard";
import { getActivityLabel } from "@/constants/activityTypes";
import { Colors } from "@/constants/colors";
import { useActivity } from "@/context/ActivityContext";
import { saveActivity } from "@/storage/activityStorage";
import { formatDistance } from "@/utils/distance";
import { formatDateTime, formatTime } from "@/utils/formatTime";
import { getMetricLabel, getMetricValue } from "@/utils/metrics";

// RESUMO: aparece logo após finalizar. Mostra a atividade (ainda só na memória)
// e deixa o usuário salvar no aparelho ou descartar.
export default function SummaryScreen() {
  const router = useRouter();
  const { finishedActivity, discardActivity } = useActivity();
  const [saving, setSaving] = useState(false);

  // Sem atividade finalizada, não há o que mostrar.
  useEffect(() => {
    if (!finishedActivity) router.replace("/");
  }, [finishedActivity, router]);

  if (!finishedActivity) return null;

  // Grava no AsyncStorage (storage/activityStorage) e abre o histórico.
  async function handleSave() {
    if (!finishedActivity) return;
    try {
      setSaving(true);
      await saveActivity(finishedActivity);
      router.replace("/history");
    } catch {
      setSaving(false);
      Alert.alert("Erro", "Não foi possível salvar a atividade. Tente novamente.");
    }
  }

  function handleDiscard() {
    Alert.alert("Descartar atividade?", "Os dados desta atividade serão perdidos.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Descartar",
        style: "destructive",
        onPress: () => {
          discardActivity();
          router.replace("/");
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Resumo" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.type}>{getActivityLabel(finishedActivity.type)}</Text>
        <Text style={styles.date}>{formatDateTime(finishedActivity.startedAt)}</Text>

        <View style={styles.stats}>
          <StatCard label="Distância" value={formatDistance(finishedActivity.distance)} />
          <StatCard label="Duração" value={formatTime(finishedActivity.duration)} />
          <StatCard
            label={getMetricLabel(finishedActivity.type)}
            value={getMetricValue(finishedActivity)}
          />
          <StatCard label="Pontos GPS" value={String(finishedActivity.route.length)} />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button title="Salvar atividade" onPress={handleSave} loading={saving} />
        <Button title="Descartar" variant="secondary" onPress={handleDiscard} disabled={saving} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  content: { paddingBottom: 24 },
  type: { fontSize: 28, fontWeight: "900", color: Colors.primary, marginTop: 8 },
  date: { fontSize: 14, color: Colors.muted, marginTop: 4, marginBottom: 24 },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actions: { gap: 12 },
});
