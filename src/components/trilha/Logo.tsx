import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Trilha } from "@/constants/colors";

// Selo do app: quadrado verde com uma montanha.
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: Trilha.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24">
        <Path d="M2 20 L9 7 L13 14 L16 9 L22 20 Z" fill={Trilha.white} />
      </Svg>
    </View>
  );
}
