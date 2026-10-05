import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { ActivityCard } from "@/components/ActivityCard";
import { Header } from "@/components/header";
import { Colors } from "@/constants/colors";
import { getActivities } from "@/storage/activityStorage";
import { Activity } from "@/types/activity";

// HISTÓRICO: lista as atividades salvas no aparelho. Tocar em uma abre os detalhes.
export default function HistoryScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  // useFocusEffect roda toda vez que a tela ganha foco (ex.: voltar dos detalhes
  // depois de excluir), então a lista sempre está atualizada.
  useFocusEffect(
    useCallback(() => {
      getActivities().then(setActivities);
    }, [])
  );

  function goToHome() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Histórico" onBackPress={goToHome} />

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onPress={() => router.push({ pathname: "/activity-details", params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhuma atividade salva ainda. Inicie uma na tela inicial.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 24 },
  empty: { textAlign: "center", color: Colors.muted, marginTop: 48, fontSize: 15 },
});
