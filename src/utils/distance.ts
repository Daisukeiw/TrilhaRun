import { LocationPoint } from "@/types/activity";

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Fórmula de Haversine: distância em metros entre duas coordenadas,
// considerando a Terra como uma esfera.
export function calculateDistance(a: LocationPoint, b: LocationPoint): number {
  const deltaLat = toRadians(b.latitude - a.latitude);
  const deltaLon = toRadians(b.longitude - a.longitude);

  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Soma a distância de cada par de pontos consecutivos.
export function calculateTotalDistance(points: LocationPoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += calculateDistance(points[i - 1], points[i]);
  }
  return total;
}

// 1234 -> "1.23 km"
export function formatDistance(meters: number): string {
  return `${(meters / 1000).toFixed(2)} km`;
}
