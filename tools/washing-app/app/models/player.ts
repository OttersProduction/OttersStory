import { getHP, getMP, getQuestHP } from "@/app/utils/hp-mp-helper";
import {
  getAPResetsHPWash,
  getHPGainByAP,
  getMPLossByAP,
} from "@/app/utils/wash-helper";
import { HPQuest } from "@/app/models/hp-quest";
import { Job } from "@/app/models/job";

export const INITIAL_MP = 5;
export const INITIAL_HP = 50;
export const MAX_LEVEL = 200;
interface Stats {
  str: number;
  dex: number;
  int: number;
  luk: number;
  naturalHP: number;
  naturalMP: number;
  ap: number;
}
export class Player {
  public stats: Stats = {
    str: 4,
    dex: 4,
    int: 4,
    luk: 4,
    naturalHP: INITIAL_HP,
    naturalMP: INITIAL_MP,
    ap: 9,
  };
  public job: Job = Job.BEGINNER;
  private mpGain: number = 0;
  private hpGain: number = 0;
  public level: number = 1;
  private hpQuests: HPQuest[] = [];
  private additionalHP: number = 0;

  constructor(job: Job, level: number, args?: Stats, hpQuests: HPQuest[] = []) {
    this.job = job;
    this.level = level;
    if (args) {
      this.stats = args;
    }
    this.hpQuests = hpQuests;

    // Calculate base HP/MP for the starting level to preserve washed gains
    if (args) {
      // Calculate base HP for the starting level (without quest HP, since we don't know
      // which quests were already completed - that info is lost)
      // The hpGain will include both washed HP and HP from quests already completed
      const baseHP = getHP(job, level);

      // Calculate base MP for the starting level with current INT
      const baseMP = getMP(job, level);

      // Calculate washed gains: difference between user's input and base values
      // This preserves the washed HP/MP through level ups
      // Note: hpGain includes both washed HP and HP from quests already completed
      this.hpGain = args.naturalHP - baseHP;
      this.mpGain = args.naturalMP - baseMP;

      // Set naturalHP and naturalMP to base values (not user's input)
      // The total HP/MP will be naturalHP/MP + hpGain/mpGain
      this.stats.naturalHP = baseHP;
      this.stats.naturalMP = baseMP;

      // additionalHP starts at 0 and will accumulate as we level up and complete quests
      this.additionalHP = 0;
    }
  }

  public levelUp() {
    if (this.level < MAX_LEVEL) {
      this.level++;
      this.stats.ap += 5;
    }
    const { total_hp, breakdown } = getQuestHP(
      this.hpQuests,
      this.job,
      this.level
    );
    this.additionalHP += total_hp;
    this.hpQuests = this.hpQuests.filter(
      (quest) => !Object.keys(breakdown).includes(quest)
    );

    this.stats.naturalHP = getHP(this.job, this.level) + this.additionalHP;
    const intBonus = Math.floor(this.stats.int / 10);
    this.mpGain += intBonus;
    this.stats.naturalMP = getMP(this.job, this.level);
  }

  public washHP() {
    const possibleWashes = getAPResetsHPWash(this.job, this.level, this.mp);
    const apResets = Math.min(possibleWashes, this.stats.ap);
    this.mpGain -= getMPLossByAP(this.job, apResets);
    this.hpGain += getHPGainByAP(this.job, true) * apResets;
    return apResets;
  }

  get mp() {
    return Math.round(this.stats.naturalMP + this.mpGain);
  }
  get hp() {
    return Math.round(this.stats.naturalHP + this.hpGain);
  }

  get hpQuestsList(): HPQuest[] {
    return [...this.hpQuests];
  }

  // Getters to expose gains for cloning
  get currentHPGain(): number {
    return this.hpGain;
  }

  get currentMPGain(): number {
    return this.mpGain;
  }

  public addStats(args: Partial<Stats>) {
    const totalAP =
      (args.str ?? 0) + (args.dex ?? 0) + (args.int ?? 0) + (args.luk ?? 0);
    if (totalAP > this.stats.ap) {
      throw new Error(`Total AP cannot be greater than ${this.stats.ap}`);
    }
    this.stats.ap -= totalAP;
    this.stats.str += args.str ?? 0;
    this.stats.dex += args.dex ?? 0;
    this.stats.int += args.int ?? 0;
    this.stats.luk += args.luk ?? 0;
  }
}
