import { Job } from "./job";

export const DEFAULT_APR_COST_NX = 3100;
export const DEFAULT_APR_COST_MESO = 10_500_000;
export const DEFAULT_HP_GOAL = 19_500;
export const DEFAULT_LEVEL_GOAL = 175;
export const DEFAULT_CLASS = Job.NIGHT_LORD;

export const DEFAULT_PREFERENCES = {
  job: DEFAULT_CLASS,
  hpGoal: DEFAULT_HP_GOAL,
  levelGoal: DEFAULT_LEVEL_GOAL,
  aprCostMeso: DEFAULT_APR_COST_MESO,
  aprCostNX: DEFAULT_APR_COST_NX,
};
