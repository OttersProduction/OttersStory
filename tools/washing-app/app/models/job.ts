export enum Job {
  NIGHT_LORD = "NIGHT_LORD",
  SHADOWER = "SHADOWER",
  BOWMASTER = "BOWMASTER",
  MARKSMAN = "MARKSMAN",
  CORSAIR = "CORSAIR",
  BUCCANEER = "BUCCANEER",
  HERO = "HERO",
  DARK_KNIGHT = "DARK_KNIGHT",
  PALADIN = "PALADIN",
  MAGICIAN = "MAGICIAN",
  BEGINNER = "BEGINNER",
}

export const WARRIOR = [Job.DARK_KNIGHT, Job.PALADIN, Job.HERO];
export const THIEF = [Job.NIGHT_LORD, Job.SHADOWER];
export const PIRATE = [Job.CORSAIR, Job.BUCCANEER];

export const MIN_MAIN_STATS = {
  [Job.DARK_KNIGHT]: 35,
  [Job.PALADIN]: 35,
  [Job.HERO]: 35,
  [Job.NIGHT_LORD]: 25,
  [Job.SHADOWER]: 25,
  [Job.CORSAIR]: 20,
  [Job.BUCCANEER]: 20,
  [Job.BOWMASTER]: 25,
  [Job.MARKSMAN]: 25,
  [Job.MAGICIAN]: 20,
  [Job.BEGINNER]: 0,
};

export const getMainStatKey = (job: Job): "str" | "dex" | "luk" | "int" => {
  switch (job) {
    case Job.HERO:
    case Job.PALADIN:
    case Job.DARK_KNIGHT:
      return "str";
    case Job.BOWMASTER:
    case Job.MARKSMAN:
    case Job.CORSAIR:
    case Job.BUCCANEER:
    case Job.NIGHT_LORD:
    case Job.SHADOWER:
      return "dex";
    case Job.MAGICIAN:
      return "int";
    case Job.BEGINNER:
    default:
      return "str"; // Default, though BEGINNER has no requirement
  }
};
