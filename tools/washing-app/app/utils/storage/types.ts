import { Job } from "@/app/models/job";

export interface UserPreferences {
  job: Job;
  hpGoal: number;
  levelGoal: number;
  aprCostMeso: number;
  aprCostNX: number;
  theme: "light" | "dark";
}

export type PreferenceKey = keyof UserPreferences;

export interface StorageError {
  message: string;
  key?: string;
  value?: any;
}
