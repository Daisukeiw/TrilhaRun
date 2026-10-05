import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity } from "@/types/activity";

const ACTIVITIES_KEY = "@meu_percurso:activities";

// O AsyncStorage só guarda texto, então a lista inteira é salva como JSON.

export async function getActivities(): Promise<Activity[]> {
  const json = await AsyncStorage.getItem(ACTIVITIES_KEY);
  return json ? (JSON.parse(json) as Activity[]) : [];
}

export async function saveActivity(activity: Activity): Promise<void> {
  const activities = await getActivities();
  // A mais recente fica no topo do histórico.
  await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify([activity, ...activities]));
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const activities = await getActivities();
  return activities.find((activity) => activity.id === id) ?? null;
}

export async function deleteActivity(id: string): Promise<void> {
  const activities = await getActivities();
  await AsyncStorage.setItem(
    ACTIVITIES_KEY,
    JSON.stringify(activities.filter((activity) => activity.id !== id))
  );
}
