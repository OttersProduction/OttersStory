import { Player } from "@/lib/player";
import { GearItem } from "./gear";

export interface WashPlan {
  data: {
    [x: string]: number;
    level: number;
    hp: number;
    mp: number;
    int: number;
  }[];
  hpDifference: number;
  totalAPResets: number;
  player: Player;
}
