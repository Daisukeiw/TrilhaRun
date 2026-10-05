import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Colors } from "@/constants/colors";
import { LocationPoint } from "@/types/activity";
import { getRegionFromRoute } from "@/utils/mapRegion";

// Versão MOBILE do mapa. Na Web o Expo usa o arquivo index.web.tsx desta pasta,
// porque o react-native-maps só funciona em iOS/Android.

interface RouteMapProps {
  route: LocationPoint[];
}

export function RouteMap({ route }: RouteMapProps) {
  const start = route[0];
  const end = route[route.length - 1];

  return (
    <MapView style={styles.map} initialRegion={getRegionFromRoute(route)}>
      <Polyline coordinates={route} strokeColor={Colors.primary} strokeWidth={5} />
      <Marker coordinate={start} title="Início" pinColor={Colors.mapStart} />
      <Marker coordinate={end} title="Fim" pinColor={Colors.mapEnd} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { height: 300, borderRadius: 14 },
});
