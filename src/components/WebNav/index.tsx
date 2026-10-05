import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { Avatar } from "@/components/trilha/TrilhaHeader";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

// Barra de navegação do site (só usada na Web).
// Lê a sessão no AuthContext para decidir o que mostrar à direita:
//  - deslogado → links "Entrar" e "Cadastrar";
//  - logado    → ícone de perfil (só visual) e "Sair", que encerra a sessão e volta ao login.
export function WebNav() {
  const { isAuthenticated, isLoading, signOut } = useAuth();

  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <Link href="/about" style={styles.brand}>
          TrilhaRun
        </Link>

        <View style={styles.links}>
          <Link href="/about" style={styles.link}>
            Sobre
          </Link>

          {/* Enquanto a sessão salva é carregada, não mostra nada (evita "piscar" o Entrar). */}
          {isLoading ? null : isAuthenticated ? (
            <>
              <Text
                style={styles.logout}
                onPress={() => signOut().then(() => router.replace("/login"))}
              >
                Sair
              </Text>
              <View accessibilityLabel="Perfil">
                <Avatar size={36} />
              </View>
            </>
          ) : (
            <>
              <Link href="/login" style={styles.link}>
                Entrar
              </Link>
              <Link href="/register" style={[styles.link, styles.highlight]}>
                Cadastrar
              </Link>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inner: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  brand: { fontSize: 20, fontWeight: "900", color: Colors.primary },
  links: { flexDirection: "row", alignItems: "center", gap: 20 },
  link: { fontSize: 15, fontWeight: "600", color: Colors.text },
  highlight: { color: Colors.primary },
  logout: { fontSize: 15, fontWeight: "700", color: Colors.danger },
});
