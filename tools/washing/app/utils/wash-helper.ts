import { Job } from "../models/job";

export const HP_GAIN_PER_WASH = {
  [Job.BEGINNER]: 10,
  [Job.MAGICIAN]: 15,
  [Job.PALADIN]: 52,
  [Job.DARK_KNIGHT]: 52,
  [Job.HERO]: 52,
  [Job.BUCCANEER]: 38,
  [Job.CORSAIR]: 20,
  [Job.MARKSMAN]: 18,
  [Job.BOWMASTER]: 18,
  [Job.NIGHT_LORD]: 18,
  [Job.SHADOWER]: 18,
};

export const MP_LOSS_PER_WASH = {
  [Job.BEGINNER]: 8,
  [Job.MAGICIAN]: 20,
  [Job.PALADIN]: 4,
  [Job.DARK_KNIGHT]: 4,
  [Job.HERO]: 4,
  [Job.BUCCANEER]: 16,
  [Job.CORSAIR]: 16,
  [Job.MARKSMAN]: 12,
  [Job.BOWMASTER]: 12,
  [Job.NIGHT_LORD]: 12,
  [Job.SHADOWER]: 12,
};
