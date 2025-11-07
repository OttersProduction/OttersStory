import { getHP, getMP } from "../utils/hp-mp-helper";
import {
  getAPResetsHPWash,
  getHPGainByAP,
  getMPLossByAP,
} from "../utils/wash-helper";
import { Job } from "./job";

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
    naturalHP: 50,
    naturalMP: 50,
    ap: 0,
  };
  private job: Job = Job.BEGINNER;
  private mpGain: number = 0;
  private hpGain: number = 0;
  public level: number = 1;

  constructor(job: Job, level: number, args?: Stats) {
    this.job = job;
    this.level = level;
    if (args) {
      this.stats = args;
    }
  }

  public levelUp() {
    this.level++;
    this.stats.naturalHP = getHP(this.job, this.level);
    this.stats.naturalMP = getMP(this.job, this.level, this.stats.int);
  }

  public washHP() {
    const apResets = getAPResetsHPWash(this.job, this.level, this.mp);
    this.mpGain -= getMPLossByAP(this.job, apResets);
    this.hpGain += getHPGainByAP(this.job, true) * apResets;
  }

  get mp() {
    return this.stats.naturalMP + this.mpGain;
  }
  get hp() {
    return this.stats.naturalHP + this.hpGain;
  }

  public addStats(args: Partial<Stats>) {
    this.stats.str += args.str ?? 0;
    this.stats.dex += args.dex ?? 0;
    this.stats.int += args.int ?? 0;
    this.stats.luk += args.luk ?? 0;
  }
}
