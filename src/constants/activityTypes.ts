import { ActivityType } from "@/types/activity";

// Tipos de atividade e o nome em português de cada um (botões da home e cartões).
export const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: "running", label: "Corrida" },
  { value: "walking", label: "Caminhada" },
  { value: "cycling", label: "Ciclismo" },
];

export function getActivityLabel(type: ActivityType): string {
  return ACTIVITY_TYPES.find((item) => item.value === type)?.label ?? type;
}
