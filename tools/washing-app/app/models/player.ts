import { GearItem } from "./gear";

export interface Stats {
  str: number;
  dex: number;
  int: number;
  luk: number;
  naturalHP: number;
  naturalMP: number;
  ap: number;
}

export enum Action {
  HP_WASH = "hp_wash",
  MP_WASH = "mp_wash",
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
