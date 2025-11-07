import { Job } from "@/app/models/job";
import { Player } from "@/app/models/player";
import { clamp } from "@/app/utils/math";

export const createHPWashPlan = (
  job: Job,
  targetLevel: number,
  targetInt: number = 4
) => {
  const data = [];

  const player = new Player(job, 0);

  while (player.level < targetLevel) {
    player.levelUp();
    player.washHP();
    if (targetInt > player.stats.int) {
      player.addStats({ int: clamp(targetInt - player.stats.int, 0, 5) });
    }

    data.push({
      level: player.level,
      hp: player.hp,
      mp: player.mp,
      int: player.stats.int,
    });
  }

  return data;
};
