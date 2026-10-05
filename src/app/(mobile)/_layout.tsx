import React from "react";
import { Platform } from "react-native";
import { Redirect, Stack } from "expo-router";

export default function MobileLayout() {
  // As telas do app (GPS, mapa, histórico) não existem na Web:
  // quem abrir qualquer uma delas no navegador é levado ao login.
  if (Platform.OS === "web") return <Redirect href="/login" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="activity" options={{ gestureEnabled: false }} />
      <Stack.Screen name="summary" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
