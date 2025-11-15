import { getMainStatKey, Job, MIN_MAIN_STATS } from "@/app/models/job";
import { Player } from "@/app/models/player";
import { clamp } from "@/app/utils/math";
import { HPWashPlan } from "@/app/models/hp-wash";
import { HPQuest } from "@/app/models/hp-quest";

type WashingMode = "hp" | "none" | "mp";

/**
 * Simulates HP washing for a player from level 1 to targetLevel
 */
const simulateWashing = (
  player: Player,
  targetLevel: number,
  targetInt: number,
  washingMode: WashingMode = "hp"
) => {
  const data = [];

  const mainStatKey = getMainStatKey(player.job);
  const minMainStat = MIN_MAIN_STATS[player.job] || 0;
  let totalAPResets = 0;

  while (player.level <= targetLevel) {
    data.push({
      level: player.level,
      hp: player.hp,
      mp: player.mp,

      int: player.stats.int,
      [mainStatKey]: player.stats[mainStatKey],
    });
    player.levelUp();

    // Only perform washing if mode is "hp"
    if (washingMode === "hp") {
      totalAPResets += player.washHP();
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

  // Only count INT-based AP resets if washing is enabled
  if (washingMode === "hp" && player.job !== Job.MAGICIAN) {
    totalAPResets += player.stats.int - 4;
  }

  return { player, data, totalAPResets };
};

/**
 * Finds the optimal INT needed to reach targetHP at targetLevel using binary search
 */
const findOptimalInt = (
  player: Player,
  targetLevel: number,
  targetHP: number,
  washingMode: WashingMode = "hp"
): number => {
  // If washing is disabled, we can't optimize INT for HP washing
  if (washingMode !== "hp") {
    return 4; // Return minimum INT
  }

  let low = 4; // Minimum INT
  let high = 500; // Maximum reasonable INT
  let bestInt = 4;

  // Binary search for the optimal INT
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    // Create a fresh player for each simulation to avoid mutation
    const freshPlayer = new Player(
      player.job,
      player.level,
      { ...player.stats },
      player.hpQuestsList
    );
    const { player: simulatedPlayer } = simulateWashing(
      freshPlayer,
      targetLevel,
      mid,
      washingMode
    );

    if (simulatedPlayer.hp >= targetHP) {
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
  player: Player,
  targetLevel: number,
  targetHP: number,
  targetInt?: number,
  washingMode: WashingMode = "hp"
): HPWashPlan => {
  // If targetInt is not specified and washing is enabled, calculate the optimal INT needed
  const effectiveInt =
    targetInt !== undefined
      ? targetInt
      : findOptimalInt(player, targetLevel, targetHP, washingMode);

  // Create a fresh player for the final simulation to avoid mutation
  const freshPlayer = new Player(
    player.job,
    player.level,
    { ...player.stats },
    player.hpQuestsList
  );
  const {
    data,
    player: simulatedPlayer,
    totalAPResets,
  } = simulateWashing(freshPlayer, targetLevel, effectiveInt, washingMode);

  const hpDifference = targetHP - simulatedPlayer.hp;

  return {
    data,
    hpDifference,
    finalHP: simulatedPlayer.hp,
    finalMP: simulatedPlayer.mp,
    finalInt: simulatedPlayer.stats.int,
    totalAPResets,
  };
};
