import type { Region } from "react-native-maps";
import { LocationPoint } from "@/types/activity";

// Calcula o "quadro" do mapa que enquadra todo o percurso.
export function getRegionFromRoute(route: LocationPoint[]): Region {
  const latitudes = route.map((p) => p.latitude);
  const longitudes = route.map((p) => p.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    // 1.5 = margem em volta do trajeto; 0.005 evita zoom exagerado
    latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.005),
    longitudeDelta: Math.max((maxLon - minLon) * 1.5, 0.005),
  };
}
