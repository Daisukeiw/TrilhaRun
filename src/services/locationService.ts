import * as Location from "expo-location";
import { LocationPoint } from "@/types/activity";

// Ignora leituras muito imprecisas (ex.: GPS ainda "esquentando").
const MAX_ACCURACY_METERS = 50;

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

// Começa a "escutar" o GPS. Cada nova posição chama onNewPoint.
// Retorna a subscription, que precisa ser guardada para parar depois.
export async function startLocationTracking(
  onNewPoint: (point: LocationPoint) => void
): Promise<Location.LocationSubscription> {
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 2000, // no máximo uma leitura a cada 2 s...
      distanceInterval: 5, // ...ou quando andar 5 m
    },
    (location) => {
      const accuracy = location.coords.accuracy;
      if (accuracy != null && accuracy > MAX_ACCURACY_METERS) return;
      onNewPoint(toLocationPoint(location));
    }
  );
}

export function stopLocationTracking(subscription: Location.LocationSubscription | null): void {
  subscription?.remove();
}

function toLocationPoint(location: Location.LocationObject): LocationPoint {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: location.timestamp,
  };
}
