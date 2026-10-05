import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

// PÁGINA "SOBRE" DO SITE: apresenta o app e deixa claro que o rastreamento
// acontece no celular. FEATURES e STEPS são só dados; o JSX percorre (map) e desenha.
const FEATURES = [
  {
    icon: "📍",
    title: "GPS",
    text: "Usa a localização do celular para acompanhar onde você está.",
  },
  { icon: "🏃", title: "Corrida", text: "Mostra distância, tempo e ritmo médio em min/km." },
  { icon: "🚶", title: "Caminhada", text: "Mesmo acompanhamento da corrida, com o seu ritmo." },
  { icon: "🚴", title: "Ciclismo", text: "Mostra a velocidade média em km/h." },
  { icon: "🗺️", title: "Percursos", text: "Desenha o trajeto feito em um mapa." },
  { icon: "📊", title: "Histórico", text: "Guarda suas atividades no próprio aparelho." },
];

const STEPS = [
  "Você escolhe o tipo de atividade e toca em iniciar.",
  "O aplicativo pede permissão para usar a localização.",
  "Enquanto você se move, o GPS envia sua posição (latitude e longitude) a cada poucos segundos.",
  "O app soma a distância entre os pontos e conta o tempo.",
  "Ao finalizar, você vê um resumo e pode salvar a atividade no celular.",
];

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <Text style={styles.title}>Como funciona o Meu Percurso</Text>
        <Text style={styles.lead}>
          O Meu Percurso é um aplicativo para acompanhar suas atividades físicas usando o GPS do
          celular. Serve para saber quanto você percorreu, em quanto tempo e por onde passou.
        </Text>

        <Text style={styles.sectionTitle}>Principais recursos</Text>
        <View style={styles.grid}>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <Text style={styles.icon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Como as atividades são registradas</Text>
        {STEPS.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Web e Mobile</Text>
        <View style={styles.compare}>
          <View style={styles.compareCard}>
            <Text style={styles.featureTitle}>Aplicativo Mobile</Text>
            <Text style={styles.featureText}>
              É onde a atividade acontece: GPS, cronômetro, resumo, histórico e mapa do percurso.
              Usa os recursos nativos do celular.
            </Text>
          </View>
          <View style={styles.compareCard}>
            <Text style={styles.featureTitle}>Versão Web</Text>
            <Text style={styles.featureText}>
              É a porta de entrada: apresenta o app, com login e cadastro. O acompanhamento da
              atividade não é feito pelo navegador.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: 40, paddingHorizontal: 24 },
  page: { width: "100%", maxWidth: 960, alignSelf: "center" },
  title: { fontSize: 36, fontWeight: "900", color: Colors.text },
  lead: { fontSize: 17, lineHeight: 26, color: Colors.muted, marginTop: 12, maxWidth: 680 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginTop: 40,
    marginBottom: 16,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  featureCard: {
    flexGrow: 1,
    flexBasis: 260,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  icon: { fontSize: 28, marginBottom: 8 },
  featureTitle: { fontSize: 17, fontWeight: "800", color: Colors.text, marginBottom: 6 },
  featureText: { fontSize: 15, lineHeight: 22, color: Colors.muted },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 12 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primarySoft,
    color: Colors.primary,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 28,
  },
  stepText: { flex: 1, fontSize: 16, lineHeight: 24, color: Colors.text },
  compare: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  compareCard: {
    flexGrow: 1,
    flexBasis: 300,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
});
