import { Activity, ActivityType } from "@/types/activity";

// km/h
export function calculateAverageSpeed(
  distanceMeters: number,
  durationSeconds: number
): number | undefined {
  if (distanceMeters <= 0 || durationSeconds <= 0) return undefined;
  return distanceMeters / 1000 / (durationSeconds / 3600);
}

// min/km
export function calculateAveragePace(
  distanceMeters: number,
  durationSeconds: number
): number | undefined {
  if (distanceMeters <= 0 || durationSeconds <= 0) return undefined;
  return durationSeconds / 60 / (distanceMeters / 1000);
}

// 5.53 min/km -> "5:32"
export function formatPace(pace?: number): string {
  if (!pace || !isFinite(pace) || pace > 60) return "--:--";
  const totalSeconds = Math.round(pace * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Ciclismo usa velocidade; corrida e caminhada usam ritmo.
export function getMetricLabel(type: ActivityType): string {
  return type === "cycling" ? "Velocidade média" : "Ritmo médio";
}

export function getMetricValue(
  activity: Pick<Activity, "type" | "averageSpeed" | "averagePace">
): string {
  if (activity.type === "cycling") {
    return activity.averageSpeed ? `${activity.averageSpeed.toFixed(1)} km/h` : "-- km/h";
  }
  return `${formatPace(activity.averagePace)} /km`;
}
