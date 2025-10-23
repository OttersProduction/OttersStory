import { Job } from "./job";

export const DEFAULT_CLASS =
  (localStorage.getItem("lastSelectedClass") as Job) || Job.NIGHT_LORD;

export const DEFAULT_APR_COST_NX = 3100;
export const DEFAULT_APR_COST_MESO = 10_500_000;
export const DEFAULT_HP_GOAL = 19_500;
export const DEFAULT_LEVEL_GOAL = 175;
