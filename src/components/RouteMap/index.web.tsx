import React from "react";
import { Text } from "react-native";
import { Colors } from "@/constants/colors";
import { LocationPoint } from "@/types/activity";

// Versão WEB: não existe mapa, só um aviso.
// (Esta tela nem aparece na Web, mas o arquivo precisa existir para o build não quebrar.)

interface RouteMapProps {
  route: LocationPoint[];
}

export function RouteMap(_props: RouteMapProps) {
  return (
    <Text style={{ color: Colors.muted }}>O mapa está disponível apenas no aplicativo mobile.</Text>
  );
}
