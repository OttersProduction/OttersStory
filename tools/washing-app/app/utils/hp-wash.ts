import { getMainStatKey, Job, MIN_MAIN_STATS } from "@/app/models/job";
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
  const player = new Player(job, 1);
  const mainStatKey = getMainStatKey(job);
  const minMainStat = MIN_MAIN_STATS[job] || 0;

  while (player.level <= targetLevel) {
    data.push({
      level: player.level,
      hp: player.hp,
      mp: player.mp,

      int: player.stats.int,
      [mainStatKey]: player.stats[mainStatKey],
    });
    player.levelUp();
    if (player.level >= 10) {
      player.washHP();
    }

    // Calculate available AP to allocate (max 5 per level)

    // First priority: Reach minimum main stat requirement
    if (player.stats[mainStatKey] < minMainStat) {
      const mainStatNeeded = clamp(
        minMainStat - player.stats[mainStatKey],
        0,
        player.stats.ap
      );
      player.addStats({ [mainStatKey]: mainStatNeeded });
    }

    // Second priority: Add INT up to target if we still have AP remaining
    if (targetInt > player.stats.int) {
      const intToAdd = clamp(targetInt - player.stats.int, 0, player.stats.ap);
      player.addStats({ int: intToAdd });
    }
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
