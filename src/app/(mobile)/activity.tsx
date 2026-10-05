import React, { useEffect } from "react";
import { Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DistanceCard, GpsBadge, MiniStat } from "@/components/trilha/Dashboard";
import { LiveMap } from "@/components/trilha/LiveMap";
import { Avatar, TrilhaHeader } from "@/components/trilha/TrilhaHeader";
import { Trilha } from "@/constants/colors";
import { getActivityLabel } from "@/constants/activityTypes";
import { useActivity } from "@/context/ActivityContext";
import { formatTime } from "@/utils/formatTime";
import {
  calculateAveragePace,
  calculateAverageSpeed,
  getMetricLabel,
  getMetricValue,
} from "@/utils/metrics";

// ATIVIDADE EM ANDAMENTO: tempo, distância, ritmo e o trajeto ao vivo.
// Todos os números vêm do ActivityContext, que recebe os pontos do GPS.
export default function ActivityScreen() {
  const router = useRouter();
  const { status, type, elapsedSeconds, distance, route, finishActivity } = useActivity();

  // Se a tela for aberta sem atividade em andamento, volta para a Home.
  useEffect(() => {
    if (status === "idle") router.replace("/");
  }, [status, router]);

  // Bloqueia o botão "voltar" do Android durante a atividade.
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, []);

  function handleFinish() {
    Alert.alert("Finalizar atividade?", "Você verá o resumo em seguida.", [
      { text: "Continuar", style: "cancel" },
      {
        text: "Finalizar",
        style: "destructive",
        onPress: () => {
          finishActivity();
          router.replace("/summary");
        },
      },
    ]);
  }

  // Métrica ao vivo calculada com a distância e o tempo atuais.
  const metric = getMetricValue({
    type,
    averageSpeed: calculateAverageSpeed(distance, elapsedSeconds),
    averagePace: calculateAveragePace(distance, elapsedSeconds),
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TrilhaHeader
          subtitle="Gravando atividade em tempo real"
          right={
            <View style={styles.right}>
              <GpsBadge active />
              <Avatar />
            </View>
          }
        />

        <View style={styles.chips}>
          <View style={styles.chip}>
            <View style={styles.dot} />
            <Text style={styles.chipText}>GPS ATIVO · {route.length} PONTOS</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="flash-outline" size={13} color={Trilha.primary} />
            <Text style={styles.chipText}>{getActivityLabel(type).toUpperCase()}</Text>
          </View>
        </View>

        <LiveMap route={route} />

        <View style={{ height: 14 }} />
        <DistanceCard
          km={(distance / 1000).toFixed(2)}
          note="Mantenha o aplicativo aberto durante a atividade"
        />

        <View style={styles.stats}>
          <MiniStat label="TEMPO" value={formatTime(elapsedSeconds)} />
          <MiniStat label={getMetricLabel(type).toUpperCase()} value={metric} />
        </View>

        <Pressable
          onPress={handleFinish}
          style={({ pressed }) => [styles.finish, pressed && { opacity: 0.8 }]}
        >
          <Ionicons name="stop" size={18} color={Trilha.white} />
          <Text style={styles.finishText}>Finalizar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Trilha.bg },
  content: { padding: 18, paddingBottom: 32 },
  right: { flexDirection: "row", alignItems: "center" },
  chips: { flexDirection: "row", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Trilha.surface,
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 34,
  },
  chipText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5, color: Trilha.text },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Trilha.primary },
  stats: { flexDirection: "row", gap: 12, marginTop: 12 },
  finish: {
    flexDirection: "row",
    gap: 10,
    height: 56,
    borderRadius: 28,
    backgroundColor: Trilha.danger,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  finishText: { color: Trilha.white, fontSize: 16, fontWeight: "800" },
});
