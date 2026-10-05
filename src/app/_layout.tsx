import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ActivityProvider } from "@/context/ActivityContext";
import { AuthProvider } from "@/context/AuthContext";

// LAYOUT RAIZ: envolve o app inteiro.
// Os Providers ficam aqui para que qualquer tela acesse a sessão (AuthProvider)
// e a atividade em andamento (ActivityProvider). <Slot /> desenha a rota atual.
export default function RootLayout() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <StatusBar style="dark" />
        <Slot />
      </ActivityProvider>
    </AuthProvider>
  );
}
