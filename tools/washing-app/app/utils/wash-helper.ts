import { Job } from "../models/job";
import { getMinimumMP } from "./hp-mp-helper";

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

export const getMPLossByAP = (job: Job, ap: number) => {
  return MP_LOSS_PER_WASH[job] * ap;
};

export const getMPGainByAP = (job: Job, int: number = 4) => {
  let bonusMP = 7;
  switch (job) {
    case Job.DARK_KNIGHT:
    case Job.PALADIN:
    case Job.HERO:
      bonusMP = 3;
      break;
    case Job.CORSAIR:
    case Job.BUCCANEER:
    case Job.NIGHT_LORD:
    case Job.SHADOWER:
    case Job.BOWMASTER:
    case Job.MARKSMAN:
      bonusMP = 11;
      break;
    case Job.MAGICIAN:
      bonusMP = 19;
      break;
  }
  return bonusMP + Math.floor(int / 10);
};

export const getHPGainByAP = (job: Job, freshAP: boolean = true) => {
  let bonusHP = 11;

  switch (job) {
    case Job.DARK_KNIGHT:
    case Job.PALADIN:
    case Job.HERO:
      bonusHP = freshAP ? 22.5 : 22;
      break;
    case Job.CORSAIR:
    case Job.BUCCANEER:
      bonusHP = freshAP ? 20 : 18;
      break;
    case Job.BOWMASTER:
    case Job.MARKSMAN:
      bonusHP = 18;
      break;
    case Job.NIGHT_LORD:
    case Job.SHADOWER:
      bonusHP = freshAP ? 22 : 18;
      break;
    case Job.MAGICIAN:
      bonusHP = freshAP ? 8 : 15;
      break;
  }
  return bonusHP;
};

export const getAPResetsHPWash = (job: Job, level: number, mp: number) => {
  const minMP = getMinimumMP(job, level);
  if (mp > minMP) {
    const mpDiff = mp - minMP;
    const apResets = Math.floor(mpDiff / MP_LOSS_PER_WASH[job]);
    return apResets;
  }
  return 0;
};
