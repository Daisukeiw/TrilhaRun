import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebNav } from "@/components/WebNav";
import { HeroArt } from "./HeroArt";
import { Trilha } from "@/constants/colors";

const HIGHLIGHTS = [
  { icon: "navigate-outline", text: "GPS em tempo real no aplicativo" },
  { icon: "map-outline", text: "Percurso desenhado no mapa" },
  { icon: "time-outline", text: "Histórico das suas atividades" },
] as const;

interface Props {
  eyebrow: string; // texto pequeno acima do título do cartão
  title: string;
  subtitle: string;
  children: ReactNode; // campos e botões do formulário
}

// Moldura das telas de login/cadastro na WEB.
// Tela larga (>= 900 px): apresentação à esquerda + formulário à direita.
// Tela estreita: só o formulário, centralizado.
export function AuthWebLayout({ eyebrow, title, subtitle, children }: Props) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  return (
    <View style={styles.page}>
      <WebNav />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.container, isWide && styles.containerWide]}>
          {isWide ? (
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>PASSADA POR PASSADA</Text>
              <Text style={styles.heroTitle}>Cada quilômetro conta.</Text>
              <Text style={styles.heroText}>
                Entre na sua conta para continuar. O acompanhamento das atividades é feito no
                aplicativo mobile, usando o GPS do celular.
              </Text>

              <View style={styles.highlights}>
                {HIGHLIGHTS.map((item) => (
                  <View key={item.text} style={styles.highlightRow}>
                    <View style={styles.iconCircle}>
                      <Ionicons name={item.icon} size={16} color={Trilha.primary} />
                    </View>
                    <Text style={styles.highlightText}>{item.text}</Text>
                  </View>
                ))}
              </View>

              <HeroArt badge="GPS TRACKING ATIVO" chip="+18.420 KM" />
            </View>
          ) : null}

          <View style={[styles.formCol, isWide && styles.formColWide]}>
            <View style={[styles.card, isWide && styles.cardWide]}>
              <Text style={styles.cardEyebrow}>{eyebrow}</Text>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
              {children}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Trilha.bg },
  scroll: { flexGrow: 1, justifyContent: "center" },
  container: { width: "100%", maxWidth: 1080, alignSelf: "center", padding: 18 },
  containerWide: { flexDirection: "row", alignItems: "center", gap: 56, padding: 40 },

  hero: { flex: 1 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, color: Trilha.primary },
  heroTitle: { fontSize: 42, fontWeight: "900", color: Trilha.text, lineHeight: 46, marginTop: 8 },
  heroText: { fontSize: 16, color: Trilha.muted, lineHeight: 24, marginTop: 12, maxWidth: 480 },
  highlights: { gap: 12, marginVertical: 24 },
  highlightRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Trilha.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightText: { fontSize: 15, fontWeight: "600", color: Trilha.text },

  formCol: { width: "100%", maxWidth: 440, alignSelf: "center" },
  formColWide: { width: 440, flexShrink: 0 },
  card: { backgroundColor: Trilha.surface, borderRadius: 24, padding: 22 },
  cardWide: { padding: 28 },
  cardEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2, color: Trilha.primary },
  cardTitle: { fontSize: 28, fontWeight: "900", color: Trilha.text, marginTop: 4 },
  cardSubtitle: {
    fontSize: 13,
    color: Trilha.muted,
    marginTop: 6,
    marginBottom: 22,
    lineHeight: 19,
  },
});
