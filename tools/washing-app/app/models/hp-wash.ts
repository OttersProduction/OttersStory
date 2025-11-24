export interface HPWashPlan {
  data: {
    [x: string]: number;
    level: number;
    hp: number;
    mp: number;
    int: number;
  }[];
  hpDifference: number;
  totalAPResets: number;
  finalHP: number;
  finalMP: number;
  finalInt: number;
  baseInt: number;
  gearInt: number;
}
