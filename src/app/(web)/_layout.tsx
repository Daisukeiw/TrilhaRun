import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Redirect, Slot } from "expo-router";
import { WebNav } from "@/components/WebNav";
import { Colors } from "@/constants/colors";

// LAYOUT DO SITE: barra de navegação (WebNav) no topo e a página atual embaixo.
export default function WebLayout() {
  // O site só existe no navegador. No celular, vai para o app.
  if (Platform.OS !== "web") return <Redirect href="/" />;

  return (
    <View style={styles.container}>
      <WebNav />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
});
