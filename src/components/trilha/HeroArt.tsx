import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { Trilha } from "@/constants/colors";

// Ilustração provisória (montanhas + trilha) no lugar da foto de capa.
export function HeroArt({ badge, chip }: { badge: string; chip: string }) {
  return (
    <View style={styles.card}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 320 150"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Trilha.art.skyTop} />
            <Stop offset="1" stopColor={Trilha.art.skyBottom} />
          </LinearGradient>
        </Defs>
        <Rect width="320" height="150" fill="url(#sky)" />
        <Path
          d="M0 110 L70 55 L120 95 L180 40 L250 100 L320 60 L320 150 L0 150 Z"
          fill={Trilha.art.mountainBack}
        />
        <Path
          d="M0 130 L60 90 L130 125 L210 80 L320 125 L320 150 L0 150 Z"
          fill={Trilha.art.mountainFront}
        />
        <Path
          d="M40 150 C120 120 170 140 240 100"
          stroke={Trilha.art.path}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={styles.badge}>
        <Ionicons name="navigate" size={10} color={Trilha.primary} />
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
      <View style={styles.chip}>
        <Ionicons name="locate" size={11} color={Trilha.white} />
        <Text style={styles.chipText}>{chip}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: 150, borderRadius: 24, overflow: "hidden", backgroundColor: Trilha.surface },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Trilha.badgeBg,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.6, color: Trilha.primary },
  chip: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Trilha.primary,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  chipText: { fontSize: 10, fontWeight: "800", color: Trilha.white },
});
