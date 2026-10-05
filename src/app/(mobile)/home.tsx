import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ACTIVITY_TYPES } from "@/constants/activityTypes";
import { useActivity } from "@/context/ActivityContext";
import { useAuth } from "@/context/AuthContext";
import { ActivityType } from "@/types/activity";
import { DistanceCard, GpsBadge } from "@/components/trilha/Dashboard";
import { LiveMap } from "@/components/trilha/LiveMap";
import { TrilhaHeader, Avatar } from "@/components/trilha/TrilhaHeader";
import { Trilha } from "@/constants/colors";

// HOME DO APP: escolher o tipo de atividade, iniciar o GPS, abrir o histórico ou sair.

// Ícone de cada tipo de atividade nos botões de seleção.
const TYPE_ICONS: Record<ActivityType, React.ComponentProps<typeof Ionicons>["name"]> = {
  running: "flash-outline",
  walking: "walk-outline",
  cycling: "bicycle-outline",
};

export default function HomeScreen() {
  const router = useRouter();
  const { startActivity } = useActivity();
  const { signOut } = useAuth();
  const [selectedType, setSelectedType] = useState<ActivityType>("running");
  const [starting, setStarting] = useState(false);

  async function handleStart() {
    setStarting(true);
    const started = await startActivity(selectedType); // pede permissão + liga o GPS
    setStarting(false);

    if (started) {
      router.push("/activity");
    } else {
      Alert.alert(
        "Não foi possível usar o GPS",
        "Permita o acesso à localização e verifique se o GPS do celular está ligado."
      );
    }
  }

  // Encerra a sessão local e volta para a tela de login.
  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TrilhaHeader
          subtitle="Gravar atividade em tempo real"
          right={
            <View style={styles.right}>
              <GpsBadge active={false} />
              <Avatar />
            </View>
          }
        />

        <Text style={styles.sectionLabel}>ESCOLHA A ATIVIDADE</Text>
        <View style={styles.chips}>
          {ACTIVITY_TYPES.map((item) => {
            const selected = item.value === selectedType;
            return (
              <Pressable
                key={item.value}
                onPress={() => setSelectedType(item.value)}
                style={[styles.chip, selected && styles.chipOn]}
              >
                <Ionicons
                  name={TYPE_ICONS[item.value]}
                  size={15}
                  color={selected ? Trilha.white : Trilha.text}
                />
                <Text style={[styles.chipText, selected && styles.chipTextOn]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <LiveMap route={[]} />

        <View style={{ height: 14 }} />
        <DistanceCard km="0.00" note="Pronto para começar" />

        <Pressable
          onPress={handleStart}
          disabled={starting}
          style={({ pressed }) => [styles.cta, (pressed || starting) && { opacity: 0.8 }]}
        >
          <Ionicons name="play" size={18} color={Trilha.white} />
          <Text style={styles.ctaText}>{starting ? "Ligando GPS..." : "Iniciar atividade"}</Text>
        </Pressable>

        <Pressable style={styles.secondary} onPress={() => router.push("/history")}>
          <Ionicons name="time-outline" size={18} color={Trilha.primary} />
          <Text style={styles.secondaryText}>Histórico</Text>
        </Pressable>

        <Pressable style={styles.logout} onPress={handleSignOut} hitSlop={10}>
          <Ionicons name="log-out-outline" size={16} color={Trilha.danger} />
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Trilha.bg },
  content: { padding: 18, paddingBottom: 32 },
  right: { flexDirection: "row", alignItems: "center" },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: Trilha.muted,
    marginTop: 6,
    marginBottom: 10,
  },
  chips: { flexDirection: "row", gap: 8, marginBottom: 14 },
  chip: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    height: 42,
    borderRadius: 21,
    backgroundColor: Trilha.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: { backgroundColor: Trilha.primary },
  chipText: { fontSize: 12, fontWeight: "800", color: Trilha.text },
  chipTextOn: { color: Trilha.white },
  cta: {
    flexDirection: "row",
    gap: 10,
    height: 56,
    borderRadius: 28,
    backgroundColor: Trilha.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  ctaText: { color: Trilha.white, fontSize: 16, fontWeight: "800" },
  secondary: {
    flexDirection: "row",
    gap: 8,
    height: 50,
    borderRadius: 25,
    backgroundColor: Trilha.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    marginTop: 16,
    padding: 4,
  },
  logoutText: { fontSize: 14, fontWeight: "800", color: Trilha.danger },
  secondaryText: { color: Trilha.primary, fontSize: 15, fontWeight: "800" },
});
