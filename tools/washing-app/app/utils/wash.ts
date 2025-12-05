import { getMainStatKey, Job, MIN_MAIN_STATS } from "@/app/models/job";
import { Player } from "@/lib/player";
import { WashPlan } from "@/app/models/wash-plan";
import { getExcessMPAP } from "./wash-helper";

type WashingMode = "hp" | "none" | "mp";

/**
 * Simulates HP washing for a player from level 1 to targetLevel
 */
const simulateWashing = (
  player: Player,
  targetLevel: number,
  targetInt: number,
  washingMode: WashingMode = "hp",
  levelToMpWash: number = 0
) => {
  const data = [];

  const investedHP = 1;
  const mainStatKey = getMainStatKey(player.job);
  const minMainStat = MIN_MAIN_STATS[player.job] || 0;
  let totalAPResets = 0;

  while (player.level < targetLevel) {
    data.push({
      level: player.level,
      hp: player.hp,
      mp: player.mp,

      int: player.totalInt,
      [mainStatKey]: player.stats[mainStatKey],
    });
    player.levelUp();

    if (player.level >= targetLevel) {
      player.addStats({ ap_hp: investedHP });
    }

    // First priority: Reach minimum main stat requirement
    if (player.stats[mainStatKey] < minMainStat && player.stats.ap > 0) {
      const apToMinMainStat = Math.min(
        player.stats.ap,
        minMainStat - player.stats[mainStatKey]
      );
      if (apToMinMainStat > 0) {
        player.addStats({ [mainStatKey]: apToMinMainStat });
      }
    }

    // Use ALL remaining AP at this level
    while (player.stats.ap > 0) {
      if (washingMode === "hp") {
        totalAPResets += player.washHP();
      }

      if (
        washingMode === "mp" &&
        player.level >= levelToMpWash &&
        getExcessMPAP(player.job, player.level, player.mp) > 0
      ) {
        player.addStats({ ap_mp: 1 });

        if (targetInt > player.stats.int) {
          totalAPResets += 1;
          player.removeStats({ ap_mp: 1 });
        }
      }
      //we used all ap on mp noting left for main stat
      if (player.stats.ap === 0) {
        break;
      }

      // Second priority: Add INT up to target if we still have AP remaining
      if (targetInt > player.stats.int) {
        player.addStats({ int: 1 });
      } else {
        player.addStats({ [mainStatKey]: 1 });
      }
    }
  }

  // Only count INT-based AP resets if washing is enabled
  if (player.job !== Job.MAGICIAN) {
    const excessMP = Math.max(
      getExcessMPAP(player.job, player.level, player.mp) - investedHP,
      0
    );

    const investedMPAP = player.stats.ap_mp;
    const excessInt = Math.max(player.stats.int - 4, 0);
    for (let i = investedMPAP; i < excessMP; i++) {
      totalAPResets += player.removeStats({ ap_mp: 1 });
      player.addStats({ ap_hp: 1 }, false);
    }
    totalAPResets += player.removeStats({ ap_mp: investedMPAP });

    totalAPResets += player.removeStats({ int: excessInt });
    totalAPResets +=
      player.removeStats({ ap_mp: investedHP }) ||
      player.removeStats({ ap_hp: investedHP });

    player.addStats({ [mainStatKey]: excessInt + investedHP + investedMPAP });
  }

  data.push({
    level: player.level,
    hp: player.hp,
    mp: player.mp,

    int: player.totalInt,
    [mainStatKey]: player.stats[mainStatKey],
  });

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
  if (washingMode === "none") {
    return 4; // Return minimum INT
  }

  let low = 4; // Minimum INT
  let high = 500; // Maximum reasonable INT
  let bestInt = 4;

  // Binary search for the optimal INT
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    // Create a fresh player for each simulation to avoid mutation
    // Use original HP/MP values to preserve washed gains
    const freshPlayer = new Player(
      player.job,
      player.level,
      {
        ...player.stats,
        naturalHP: player.hp,
        naturalMP: player.mp,
      },
      player.hpQuestsList,
      player.inventory
    );
    const { player: simulatedPlayer } = simulateWashing(
      freshPlayer,
      targetLevel,
      mid,
      washingMode
    );

    if (simulatedPlayer.hp > targetHP) {
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

export const createWashPlan = (
  player: Player,
  targetLevel: number,
  targetHP: number,
  targetInt?: number,
  washingMode: WashingMode = "hp"
): WashPlan => {
  // If targetInt is not specified and washing is enabled, calculate the optimal INT needed
  const effectiveInt =
    targetInt !== undefined
      ? targetInt
      : findOptimalInt(player, targetLevel, targetHP, washingMode);

  // Create a fresh player for the final simulation to avoid mutation
  // Use original HP/MP values to preserve washed gains
  const freshPlayer = new Player(
    player.job,
    player.level,
    {
      ...player.stats,
      naturalHP: player.hp,
      naturalMP: player.mp,
    },
    player.hpQuestsList,
    player.inventory
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
    totalAPResets: totalAPResets === 1 ? 0 : totalAPResets,
    player: simulatedPlayer,
    finalInt: effectiveInt,
  };
};
