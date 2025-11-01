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

export type validateProps =
  | {
      key: "job";
      value: Job;
    }
  | {
      key: "hpGoal";
      value: number;
    }
  | {
      key: "levelGoal";
      value: number;
    }
  | {
      key: "aprCostMeso";
      value: number;
    }
  | {
      key: "aprCostNX";
      value: number;
    }
  | {
      key: "theme";
      value: "light" | "dark";
    };
