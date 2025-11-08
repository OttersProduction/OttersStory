import { Job, WARRIOR } from "@/app/models/job";
import { clamp } from "@/app/utils/math";
import { HPQuest } from "@/app/models/hp-quest";
import { INITIAL_MP } from "@/app/models/player";

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
  let bonusMP = 10.5;
  if (Job.BEGINNER === job) {
    return Math.round(INITIAL_MP + (clamp(level, 1, 200) - 1) * bonusMP);
  }
  const firstJobMP = INITIAL_MP + (clamp(level, 1, 10) - 1) * bonusMP;
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
  const advancementBonusHP = getAdvancementBonusHP(job, level);
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
    return warriorHP + advancementBonusHP;
  }

  return (
    firstJobHP + (clamp(level, 11, 200) - 1) * bonusHP + advancementBonusHP
  );
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
    if (level < minLevel) return acc;

    const hp = typeof hpValue === "function" ? hpValue(job) : hpValue;
    return { ...acc, [quest]: hp };
  }, {} as Record<HPQuest, number>);

  const total_hp = Object.values(breakdown).reduce((acc, hp) => acc + hp, 0);

  return { total_hp, breakdown };
};
