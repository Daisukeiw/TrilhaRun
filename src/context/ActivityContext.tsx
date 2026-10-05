import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { LocationSubscription } from "expo-location";
import {
  requestLocationPermission,
  startLocationTracking,
  stopLocationTracking,
} from "@/services/locationService";
import { Activity, ActivityType, LocationPoint } from "@/types/activity";
import { calculateDistance, calculateTotalDistance } from "@/utils/distance";
import { calculateAveragePace, calculateAverageSpeed } from "@/utils/metrics";

type ActivityStatus = "idle" | "tracking" | "finished";

// Só guarda pontos a pelo menos 3 m do anterior (reduz a "tremida" do GPS).
const MIN_DISTANCE_BETWEEN_POINTS = 3;

interface ActivityContextData {
  status: ActivityStatus;
  type: ActivityType;
  elapsedSeconds: number;
  distance: number; // metros
  route: LocationPoint[];
  finishedActivity: Activity | null;
  startActivity: (type: ActivityType) => Promise<boolean>;
  finishActivity: () => Activity;
  discardActivity: () => void;
}

const ActivityContext = createContext<ActivityContextData | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ActivityStatus>("idle");
  const [type, setType] = useState<ActivityType>("running");
  const [route, setRoute] = useState<LocationPoint[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finishedActivity, setFinishedActivity] = useState<Activity | null>(null);

  // Refs guardam valores que não precisam redesenhar a tela.
  const subscriptionRef = useRef<LocationSubscription | null>(null);
  const startedAtRef = useRef<Date | null>(null);

  // A distância é sempre derivada da rota: não tem como ficar fora de sincronia.
  const distance = useMemo(() => calculateTotalDistance(route), [route]);

  // Cronômetro: a cada segundo recalcula (agora - início).
  useEffect(() => {
    if (status !== "tracking") return;

    const interval = setInterval(() => {
      if (startedAtRef.current) {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current.getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Segurança: se o provider sumir, para o GPS.
  useEffect(() => {
    return () => stopLocationTracking(subscriptionRef.current);
  }, []);

  function addPoint(point: LocationPoint) {
    setRoute((previous) => {
      const last = previous[previous.length - 1];
      if (last && calculateDistance(last, point) < MIN_DISTANCE_BETWEEN_POINTS) {
        return previous;
      }
      return [...previous, point];
    });
  }

  // true = GPS iniciou; false = permissão negada ou erro.
  async function startActivity(selectedType: ActivityType): Promise<boolean> {
    if (status === "tracking") return true;

    const granted = await requestLocationPermission();
    if (!granted) return false;

    try {
      setType(selectedType);
      setRoute([]);
      setElapsedSeconds(0);
      setFinishedActivity(null);
      startedAtRef.current = new Date();

      subscriptionRef.current = await startLocationTracking(addPoint);
      setStatus("tracking");
      return true;
    } catch {
      startedAtRef.current = null;
      return false;
    }
  }

  function finishActivity(): Activity {
    stopLocationTracking(subscriptionRef.current);
    subscriptionRef.current = null;

    const finishedAt = new Date();
    const startedAt = startedAtRef.current ?? finishedAt;
    const duration = Math.floor((finishedAt.getTime() - startedAt.getTime()) / 1000);

    const activity: Activity = {
      id: Date.now().toString(),
      type,
      distance,
      duration,
      averageSpeed: calculateAverageSpeed(distance, duration),
      averagePace: calculateAveragePace(distance, duration),
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      route,
    };

    setElapsedSeconds(duration);
    setFinishedActivity(activity);
    setStatus("finished");
    return activity;
  }

  function discardActivity() {
    stopLocationTracking(subscriptionRef.current);
    subscriptionRef.current = null;
    startedAtRef.current = null;
    setRoute([]);
    setElapsedSeconds(0);
    setFinishedActivity(null);
    setStatus("idle");
  }

  return (
    <ActivityContext.Provider
      value={{
        status,
        type,
        elapsedSeconds,
        distance,
        route,
        finishedActivity,
        startActivity,
        finishActivity,
        discardActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity(): ActivityContextData {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity deve ser usado dentro de <ActivityProvider>");
  }
  return context;
}
