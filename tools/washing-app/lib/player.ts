import { getHP, getMP, getQuestHP } from "@/app/utils/hp-mp-helper";
import {
  getAPResetsHPWash,
  getHPGainByAP,
  getMPLossByAP,
} from "@/app/utils/wash-helper";
import { HPQuest } from "@/app/models/hp-quest";
import { Job } from "@/app/models/job";
import { GearItem, GearSlot } from "@/app/models/gear";
import { Action, BreakoutPlan, Stats } from "@/app/models/player";

export const INITIAL_MP = 5;
export const INITIAL_HP = 50;
export const MAX_LEVEL = 200;

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
  public inventory: GearItem[] = [];
  public equipped: GearItem[] = [];
  public breakoutPlan: BreakoutPlan = {};

  constructor(
    job: Job,
    level: number,
    args?: Stats,
    hpQuests: HPQuest[] = [],
    inventory: GearItem[] = []
  ) {
    this.job = job;
    this.level = level;
    this.inventory = inventory;
    if (args) {
      this.stats = args;
    }
    this.hpQuests = hpQuests;

    // Ensure we have a breakout entry for the starting level
    this.breakoutPlan[this.level] = {
      actions: [],
      equips: [],
    };

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
    this.updateEquippedForLevel();
  }

  public levelUp() {
    if (this.level < MAX_LEVEL) {
      this.level++;
      this.stats.ap += 5;
    }
    this.breakoutPlan[this.level] = {
      actions: [],
      equips: [],
    };

    this.updateEquippedForLevel();

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
    const intBonus = Math.floor(this.totalInt / 10);
    this.mpGain += intBonus;
    this.stats.naturalMP = getMP(this.job, this.level);
  }

  public washHP() {
    const possibleWashes = getAPResetsHPWash(this.job, this.level, this.mp);
    const apResets = Math.min(possibleWashes, this.stats.ap);
    this.mpGain -= getMPLossByAP(this.job, apResets);
    this.hpGain += getHPGainByAP(this.job, true) * apResets;
    if (apResets > 0) {
      this.breakoutPlan[this.level].actions.push({
        type: Action.HP_WASH,
        ap: apResets,
      });
    }
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

  get bonusIntFromGear(): number {
    return this.equipped.reduce((sum, item) => sum + item.int, 0);
  }

  get totalInt(): number {
    return this.stats.int + this.bonusIntFromGear;
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

    if (args.int) {
      this.breakoutPlan[this.level].actions.push({
        type: Action.ADD_INT,
        ap: args.int,
      });
    }
    if (args.str || args.dex || args.luk) {
      this.breakoutPlan[this.level].actions.push({
        type: Action.ADD_MAIN_STAT,
        ap: totalAP,
      });
    }
  }

  private updateEquippedForLevel() {
    if (!this.inventory.length) {
      this.equipped = [];
      return;
    }

    const bySlot = new Map<GearSlot, GearItem[]>();
    for (const item of this.inventory) {
      if (!bySlot.has(item.slot)) {
        bySlot.set(item.slot, []);
      }
      bySlot.get(item.slot)!.push(item);
    }

    const newEquipped: GearItem[] = [];

    const sortByIntThenLevel = (a: GearItem, b: GearItem) => {
      if (b.int !== a.int) return b.int - a.int;
      if (a.requiredLevel !== b.requiredLevel)
        return a.requiredLevel - b.requiredLevel;
      return 0;
    };

    const bestForSlot = (slot: GearSlot): GearItem | undefined => {
      const items = bySlot.get(slot);
      if (!items || !items.length) return undefined;
      const candidates = items.filter(
        (item) => item.requiredLevel <= this.level
      );
      if (!candidates.length) return undefined;
      candidates.sort(sortByIntThenLevel);
      return candidates[0];
    };

    const bestOverall = bestForSlot(GearSlot.Overall);
    const bestTop = bestForSlot(GearSlot.Top);
    const bestBottom = bestForSlot(GearSlot.Bottom);

    let useOverall = false;

    if (bestOverall && !bestTop && !bestBottom) {
      useOverall = true;
    } else if (!bestOverall && (bestTop || bestBottom)) {
      useOverall = false;
    } else if (bestOverall && (bestTop || bestBottom)) {
      const overallInt = bestOverall.int;
      const topBottomInt = (bestTop?.int ?? 0) + (bestBottom?.int ?? 0);
      useOverall = overallInt >= topBottomInt;
    }

    if (useOverall && bestOverall) {
      newEquipped.push(bestOverall);
    } else {
      if (bestTop) newEquipped.push(bestTop);
      if (bestBottom) newEquipped.push(bestBottom);
    }

    bySlot.delete(GearSlot.Overall);
    bySlot.delete(GearSlot.Top);
    bySlot.delete(GearSlot.Bottom);

    bySlot.forEach((items) => {
      const candidates = items.filter(
        (item) => item.requiredLevel <= this.level
      );
      if (!candidates.length) return;

      candidates.sort(sortByIntThenLevel);

      const item = candidates[0];

      const equippedItem = this.equipped.find(
        (equipped) => equipped.slot === item.slot
      );
      const intGain = item.int - (equippedItem?.int ?? 0);
      this.breakoutPlan[this.level].equips.push({
        item,
        oldItem: equippedItem,
        intGain,
      });
      newEquipped.push(item);
    });

    this.equipped = newEquipped;
  }
}
