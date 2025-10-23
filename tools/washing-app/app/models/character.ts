import { Job } from "./job";

/**
 * Core character properties for washing optimization
 */
export interface Character {
  level: number;
  job: Job;
  baseINT: number;
  naturalHP: number;
  washedHP: number;
  naturalMP: number;
  washedMP: number;
  freshAP: number;
  minimumMP: number;
  mapleWarriorLevel: number;
  hpGoal: number;
  levelGoal: number;
  mpGoal?: number;
}
