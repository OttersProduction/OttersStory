import { Job, WARRIOR } from "@/app/models/job";
import { clamp } from "@/app/utils/math";
import { HPQuest } from "../models/hp-quest";

export const getMinimumMP = (job: Job, level: number) => {
  switch (job) {
    case Job.NIGHT_LORD:
    case Job.SHADOWER:
    case Job.MARKSMAN:
    case Job.BOWMASTER:
      return Math.floor(14 * level + 148);

    case Job.CORSAIR:
    case Job.BUCCANEER:
      return Math.floor(18 * level + 111);

    case Job.DARK_KNIGHT:
    case Job.PALADIN:
    case Job.HERO:
      return Math.floor(4 * level + 156);

    case Job.MAGICIAN:
      return Math.floor(22 * level + 488);

    case Job.BEGINNER:
      return Math.floor(10 * level + 2);
  }
};

export const getMP = (job: Job, level: number, int: number = 4) => {
  let bonusMP = 11;
  if (Job.BEGINNER === job) {
    return 5 + (clamp(level, 1, 200) - 1) * bonusMP;
  }
  const firstJobMP = 5 + (clamp(level, 1, 10) - 1) * bonusMP;
  if (level <= 10) {
    return firstJobMP;
  }

  switch (job) {
    case Job.NIGHT_LORD:
    case Job.SHADOWER:
    case Job.BOWMASTER:
    case Job.MARKSMAN:
      bonusMP = 15;
      break;
    case Job.CORSAIR:
    case Job.BUCCANEER:
      bonusMP = 20;
      break;
    case Job.DARK_KNIGHT:
    case Job.PALADIN:
    case Job.HERO:
      bonusMP = 5;
      break;
    case Job.MAGICIAN:
      bonusMP = 23;
      break;
  }

  bonusMP += Math.floor(int / 10);

  if (job === Job.MAGICIAN) {
    let mageMP = firstJobMP + (clamp(level, 11, 14) - 1) * bonusMP;
    if (level > 14) {
      mageMP = mageMP + (clamp(level, 15, 200) - 1) * (bonusMP + 20);
    }
    return mageMP;
  }

  return firstJobMP + (clamp(level, 11, 200) - 1) * bonusMP;
};

export const getHP = (job: Job, level: number) => {
  if (Job.BEGINNER === job) {
    return 14 * clamp(level, 1, 200) + 36;
  }

  const firstJobHP = 14 * clamp(level, 1, 10) + 36;
  if (level <= 10) {
    return firstJobHP;
  }

  let bonusHP = 22;
  let advancmentBonusHP = getAdvancementBonusHP(job, level);
  switch (job) {
    case Job.NIGHT_LORD:
    case Job.SHADOWER:
    case Job.BOWMASTER:
    case Job.MARKSMAN:
      bonusHP = 22;
      break;
    case Job.CORSAIR:
    case Job.BUCCANEER:
      bonusHP = 25;
      break;
    case Job.DARK_KNIGHT:
    case Job.PALADIN:
    case Job.HERO:
      bonusHP = 26;
      break;
    case Job.MAGICIAN:
      bonusHP = 12;
      break;
  }

  if (WARRIOR.includes(job)) {
    let warriorHP = firstJobHP + (clamp(level, 11, 14) - 1) * bonusHP;
    if (level > 14) {
      warriorHP = warriorHP + (clamp(level, 15, 200) - 1) * (bonusHP + 40);
    }
    return warriorHP + advancmentBonusHP;
  }

  return firstJobHP + (clamp(level, 11, 200) - 1) * bonusHP + advancmentBonusHP;
};

export const getAdvancementBonusHP = (job: Job, level: number) => {
  if (job === Job.BEGINNER || job === Job.MAGICIAN) return 0;
  if (WARRIOR.includes(job)) {
    if (level >= 10 && level < 30) return 225;
    if (level >= 30 && level < 70) return 225 + 325;
    if (level >= 70 && level < 120) return 225 + 325 + 1025;
    if (level >= 120 && level <= 200) return 225 + 325 + 1025 + 1_825;
  }

  if (level >= 10 && level < 30) return 162;
  if (level >= 30 && level < 70) return 162 + 325;
  if (level >= 70 && level < 120) return 162 + 325 + 625;
  if (level >= 120 && level <= 200) return 162 + 325 + 625 + 925;

  return 0;
};

export const getQuestHP = (quests: HPQuest[], job: Job, level: number) => {
  const breakdown = quests.reduce((acc, quest) => {
    if (quest === HPQuest.WaterSpring && level >= 70) {
      acc = {
        ...acc,
        [HPQuest.WaterSpring]: WARRIOR.includes(job)
          ? 1_000
          : job === Job.MAGICIAN
          ? 250
          : 500,
      };
    }
    if (quests.includes(HPQuest.Olaf1) && level >= 20) {
      acc = { ...acc, [HPQuest.Olaf1]: 200 };
    }
    if (quests.includes(HPQuest.Olaf2) && level >= 40) {
      acc = { ...acc, [HPQuest.Olaf2]: 225 };
    }
    if (quests.includes(HPQuest.Olaf3) && level >= 60) {
      acc = { ...acc, [HPQuest.Olaf3]: 250 };
    }
    if (quests.includes(HPQuest.Olaf4) && level >= 80) {
      acc = { ...acc, [HPQuest.Olaf4]: 275 };
    }
    if (quests.includes(HPQuest.Olaf5) && level >= 100) {
      acc = { ...acc, [HPQuest.Olaf5]: 300 };
    }
    if (quests.includes(HPQuest.Olaf6) && level >= 120) {
      acc = { ...acc, [HPQuest.Olaf1]: 350 };
    }
    if (quests.includes(HPQuest.Olaf7) && level >= 140) {
      acc = { ...acc, [HPQuest.Olaf7]: 400 };
    }
    if (quests.includes(HPQuest.Olaf8) && level >= 160) {
      acc = { ...acc, [HPQuest.Olaf8]: 450 };
    }
    if (quests.includes(HPQuest.Olaf9) && level >= 180) {
      acc = { ...acc, [HPQuest.Olaf9]: 550 };
    }
    return acc;
  }, {} as Record<HPQuest, number>);

  const total_hp = Object.values(breakdown).reduce(
    (acc, prev) => (acc += prev),
    0
  );

  return { total_hp, breakdown };
};
