import { Job } from "@/app/models/job";
import { Player } from "@/app/models/player";
import { clamp } from "@/app/utils/math";

/**
 * Simulates HP washing for a player from level 1 to targetLevel
 */
const simulateHPWashing = (
  job: Job,
  targetLevel: number,
  targetInt: number
): { finalHP: number; data: any[] } => {
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

  return { finalHP: player.hp, data };
};

/**
 * Finds the optimal INT needed to reach targetHP at targetLevel using binary search
 */
const findOptimalInt = (
  job: Job,
  targetLevel: number,
  targetHP: number
): number => {
  let low = 4; // Minimum INT
  let high = 999; // Maximum reasonable INT
  let bestInt = 4;

  // Binary search for the optimal INT
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { finalHP } = simulateHPWashing(job, targetLevel, mid);

    if (finalHP >= targetHP) {
      // We reached the target, try with less INT
      bestInt = mid;
      high = mid - 1;
    } else {
      // Need more INT
      low = mid + 1;
    }
  }

  return bestInt;
};

export const createHPWashPlan = (
  job: Job,
  targetLevel: number,
  targetHP: number,
  targetInt?: number
) => {
  // If targetInt is not specified, calculate the optimal INT needed
  const effectiveInt =
    targetInt !== undefined
      ? targetInt
      : findOptimalInt(job, targetLevel, targetHP);

  const { data } = simulateHPWashing(job, targetLevel, effectiveInt);
  return data;
};
