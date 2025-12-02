import { GearItem } from "./gear";

export interface Stats {
  ap_mp: number;
  ap_hp: number;
  str: number;
  dex: number;
  int: number;
  luk: number;
  naturalHP: number;
  naturalMP: number;
  ap: number;
}

export enum Action {
  ADD_HP = "add_hp",
  REMOVE_HP = "remove_hp",
  ADD_MP = "add_mp",
  REMOVE_MP = "remove_mp",
  ADD_INT = "add_int",
  REMOVE_INT = "remove_int",
  ADD_MAIN_STAT = "add_main_stat",
}

export type BreakoutPlan = {
  [level: number]: {
    actions: {
      type: Action;
      ap: number;
    }[];

    equips: {
      item: GearItem;
      oldItem?: GearItem;
      intGain: number;
    }[];
  };
};
