// Tipos principais do app. Todas as outras camadas importam daqui.

export type ActivityType = "running" | "walking" | "cycling";

// Um ponto registrado pelo GPS.
export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number; // milissegundos
}

// Uma atividade finalizada (é isso que vai para o AsyncStorage).
export interface Activity {
  id: string;
  type: ActivityType;
  distance: number; // metros
  duration: number; // segundos
  averageSpeed?: number; // km/h (usada no ciclismo)
  averagePace?: number; // min/km (usada em corrida e caminhada)
  startedAt: string; // ISO 8601
  finishedAt: string; // ISO 8601
  route: LocationPoint[];
}
