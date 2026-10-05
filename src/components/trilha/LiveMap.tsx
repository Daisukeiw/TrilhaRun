import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { LocationPoint } from "@/types/activity";
import { Trilha } from "@/constants/colors";

// Tamanho do desenho em unidades do SVG. O viewBox estica o desenho para o tamanho real do cartão.
const W = 320;
const H = 200;
const PAD = 36;

// Desenha o trajeto do GPS em um cartão estilizado (sem precisar de chave de mapa).
export function LiveMap({ route, height = 210 }: { route: LocationPoint[]; height?: number }) {
  const { d, start, end } = useMemo(() => {
    if (route.length < 2) return { d: "", start: null, end: null };

    const lats = route.map((p) => p.latitude);
    const lons = route.map((p) => p.longitude);
    const minLat = Math.min(...lats),
      maxLat = Math.max(...lats);
    const minLon = Math.min(...lons),
      maxLon = Math.max(...lons);

    // Corrige a distorção da longitude pela latitude média.
    const k = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
    const spanX = Math.max((maxLon - minLon) * k, 1e-6);
    const spanY = Math.max(maxLat - minLat, 1e-6);
    const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
    const offX = (W - spanX * scale) / 2;
    const offY = (H - spanY * scale) / 2;

    // Converte cada latitude/longitude em um ponto x/y do desenho.
    // O y é invertido porque no SVG ele cresce para baixo (e a latitude cresce para cima).
    const pts = route.map((p) => ({
      x: offX + (p.longitude - minLon) * k * scale,
      y: H - (offY + (p.latitude - minLat) * scale),
    }));
    return {
      d: pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" "),
      start: pts[0],
      end: pts[pts.length - 1],
    };
  }, [route]);

  return (
    <View style={[styles.card, { height }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {[0.25, 0.5, 0.75].map((f) => (
          <React.Fragment key={f}>
            <Line x1={W * f} y1={0} x2={W * f} y2={H} stroke={Trilha.line} strokeWidth={1} />
            <Line x1={0} y1={H * f} x2={W} y2={H * f} stroke={Trilha.line} strokeWidth={1} />
          </React.Fragment>
        ))}
        {d ? (
          <>
            <Path
              d={d}
              stroke={Trilha.primary}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle
              cx={start!.x}
              cy={start!.y}
              r={6}
              fill={Trilha.white}
              stroke={Trilha.primary}
              strokeWidth={3}
            />
            <SvgText
              x={start!.x + 10}
              y={start!.y + 16}
              fontSize={10}
              fontWeight="bold"
              fill={Trilha.muted}
            >
              KM 0
            </SvgText>
            <Circle cx={end!.x} cy={end!.y} r={13} fill={Trilha.primary} opacity={0.18} />
            <Circle
              cx={end!.x}
              cy={end!.y}
              r={8}
              fill={Trilha.primary}
              stroke={Trilha.white}
              strokeWidth={3}
            />
          </>
        ) : null}
      </Svg>

      <Text style={styles.tag}>LIVE MAP</Text>
      {!d ? (
        <Text style={styles.waiting}>O trajeto aparece aqui quando o GPS começar a registrar.</Text>
      ) : null}
      <Text style={styles.points}>PONTOS GPS: {route.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Trilha.surface, borderRadius: 24, overflow: "hidden" },
  tag: {
    position: "absolute",
    top: 12,
    left: 14,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: Trilha.primary,
    backgroundColor: Trilha.labelBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
  waiting: {
    position: "absolute",
    alignSelf: "center",
    top: "44%",
    fontSize: 12,
    color: Trilha.muted,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  points: {
    position: "absolute",
    bottom: 10,
    right: 14,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: Trilha.muted,
  },
});
