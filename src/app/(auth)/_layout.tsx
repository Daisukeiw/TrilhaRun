import React from "react";
import { Stack } from "expo-router";

// Grupo (auth): login e cadastro, usados na Web e no celular.
// O grupo não aparece na URL: continuam sendo /login e /register.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
