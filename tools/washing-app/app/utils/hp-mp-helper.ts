import { Job, WARRIOR } from "@/app/models/job";
import { clamp } from "@/app/utils/math";
import { HPQuest } from "@/app/models/hp-quest";

export const getLevelUpMP = (job: Job, level: number) => {
  let levelUpMP = 11;

  if (level <= 10) {
    return levelUpMP;
  }

  switch (job) {
    case Job.NIGHT_LORD:
    case Job.SHADOWER:
    case Job.BOWMASTER:
    case Job.MARKSMAN:
      levelUpMP = 15;
      break;
    case Job.CORSAIR:
    case Job.BUCCANEER:
      levelUpMP = 20;
      break;
    case Job.DARK_KNIGHT:
    case Job.PALADIN:
    case Job.HERO:
      levelUpMP = 5;
      break;
    case Job.MAGICIAN:
      levelUpMP = 23;
      break;
  }

  if (job === Job.MAGICIAN && level > 14) {
    return levelUpMP + 20;
  }

  return levelUpMP;
};

export const getLevelUpHP = (job: Job, level: number) => {
  let levelUpHP = 22;

  switch (job) {
    case Job.NIGHT_LORD:
    case Job.SHADOWER:
    case Job.BOWMASTER:
    case Job.MARKSMAN:
      levelUpHP = 22;
      break;
    case Job.CORSAIR:
    case Job.BUCCANEER:
      levelUpHP = 25;
      break;
    case Job.DARK_KNIGHT:
    case Job.PALADIN:
    case Job.HERO:
      levelUpHP = 26;
      break;
    case Job.MAGICIAN:
      levelUpHP = 12;
      break;
  }
  if (WARRIOR.includes(job) && level > 14) {
    levelUpHP += 40;
  }
  return levelUpHP;
};

const MP_MAP = (() => {
  const map = Object.keys(Job).reduce((acc, job) => {
    acc[job as Job] = { 1: 5 };
    for (let level = 2; level <= 200; level++) {
      acc[job as Job][level] =
        acc[job as Job][level - 1] + getLevelUpMP(job as Job, level);
    }
    return acc;
  }, {} as Record<Job, Record<number, number>>);

  return map;
})();

const HP_MAP = (() => {
  const map = Object.keys(Job).reduce((acc, job) => {
    acc[job as Job] = { 1: 50 };
    for (let level = 2; level <= 10; level++) {
      acc[job as Job][level] = 14 * clamp(level, 1, 200) + 36;
    }
    for (let level = 11; level <= 200; level++) {
      if (job === Job.BEGINNER) {
        acc[job as Job][level] = 14 * clamp(level, 1, 200) + 36;
      } else {
        acc[job as Job][level] =
          acc[job as Job][level - 1] + getLevelUpHP(job as Job, level);
      }
    }
    return acc;
  }, {} as Record<Job, Record<number, number>>);

  return map;
})();

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

export const getMP = (job: Job, level: number) => {
  const mp = MP_MAP[job][level];

  return mp;
};

export const getHP = (job: Job, level: number) => {
  const advancementBonusHP = getAdvancementBonusHP(job, level);

  const hp = HP_MAP[job][level];

  return hp + advancementBonusHP;
};

export const getAdvancementBonusHP = (job: Job, level: number) => {
  if (job === Job.BEGINNER || job === Job.MAGICIAN) return 0;
  if (WARRIOR.includes(job)) {
    if (level >= 10 && level < 30) return 225;
    if (level >= 30 && level < 70) return 225 + 325;
    if (level >= 70 && level < 120) return 225 + 325 + 1025;
    if (level >= 120) return 225 + 325 + 1025 + 1_825;
  }

  if (level >= 10 && level < 30) return 162;
  if (level >= 30 && level < 70) return 162 + 325;
  if (level >= 70 && level < 120) return 162 + 325 + 625;
  if (level >= 120) return 162 + 325 + 625 + 925;

  return 0;
};

export const getQuestHP = (quests: HPQuest[], job: Job, level: number) => {
  // Quest requirements lookup: [minLevel, HP value or function]
  const questRequirements: Record<
    HPQuest,
    [number, number | ((job: Job) => number)]
  > = {
    [HPQuest.WaterSpring]: [
      70,
      (job: Job) =>
        WARRIOR.includes(job) ? 1_000 : job === Job.MAGICIAN ? 250 : 500,
    ],
    [HPQuest.Olaf1]: [20, 200],
    [HPQuest.Olaf2]: [40, 225],
    [HPQuest.Olaf3]: [60, 250],
    [HPQuest.Olaf4]: [80, 275],
    [HPQuest.Olaf5]: [100, 300],
    [HPQuest.Olaf6]: [120, 350],
    [HPQuest.Olaf7]: [140, 400],
    [HPQuest.Olaf8]: [160, 450],
    [HPQuest.Olaf9]: [180, 550],
    [HPQuest.Olaf10]: [200, 0], // Placeholder if needed
    [HPQuest.ElixerOfLife]: [120, 0], // Placeholder if needed
  };

  const breakdown = quests.reduce((acc, quest) => {
    const requirement = questRequirements[quest];
    if (!requirement) return acc;

    const [minLevel, hpValue] = requirement;
    if (level <= minLevel) return acc;

    const hp = typeof hpValue === "function" ? hpValue(job) : hpValue;
    return { ...acc, [quest]: hp };
  }, {} as Record<HPQuest, number>);

  const total_hp = Object.values(breakdown).reduce((acc, hp) => acc + hp, 0);

  return { total_hp, breakdown };
};
