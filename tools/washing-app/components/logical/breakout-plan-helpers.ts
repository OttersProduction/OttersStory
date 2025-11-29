import { Action, BreakoutPlan as BreakoutPlanType } from "@/app/models/player";

export type EventGroup = {
  kind: "event";
  level: number;
  actionsSummary: string;
  actions: string[];
  equips: string[];
};

export type PatternRangeGroup = {
  kind: "patternRange";
  startLevel: number;
  endLevel: number;
  perLevelHPWashes: number;
  perLevelIntAP: number;
  perLevelMainStatAP: number;
};

export type PlanGroup = EventGroup | PatternRangeGroup;

type AggregatedLevel = {
  level: number;
  levelHPWashes: number;
  intAP: number;
  mainStatAP: number;
  hasEquips: boolean;
  hasHPWash: boolean;
  hasAnyAPChange: boolean;
  equipSummaries: string[];
};

export type PlanBuildResult = {
  groups: PlanGroup[];
  firstWashLevel?: number;
  lastWashLevel?: number;
  totalHPWashes: number;
};

const aggregateLevel = (
  level: number,
  details: BreakoutPlanType[number]
): AggregatedLevel => {
  const hpWashActions = details.actions.filter(
    (a) => a.type === Action.HP_WASH
  );
  const addIntActions = details.actions.filter((a) => a.type === Action.ADD_INT);
  const addMainStatActions = details.actions.filter(
    (a) => a.type === Action.ADD_MAIN_STAT
  );

  const levelHPWashes = hpWashActions.reduce((sum, a) => sum + a.ap, 0);
  const intAP = addIntActions.reduce((sum, a) => sum + a.ap, 0);
  const mainStatAP = addMainStatActions.reduce((sum, a) => sum + a.ap, 0);

  const hasEquips = details.equips.length > 0;
  const hasHPWash = levelHPWashes > 0;
  const hasAnyAPChange = intAP > 0 || mainStatAP > 0 || levelHPWashes > 0;

  const equipSummaries = details.equips.map((e) => {
    const name = e.item.name || e.item.id || "New gear";
    if (e.oldItem) {
      const oldName = e.oldItem.name || e.oldItem.id || "old gear";
      return `${name} (+${e.intGain} INT over ${oldName})`;
    }
    return `${name} (+${e.intGain} INT)`;
  });

  return {
    level,
    levelHPWashes,
    intAP,
    mainStatAP,
    hasEquips,
    hasHPWash,
    hasAnyAPChange,
    equipSummaries,
  };
};

const buildEventGroup = (levelInfo: AggregatedLevel): EventGroup => {
  const { level, levelHPWashes, intAP, mainStatAP, equipSummaries } = levelInfo;

  const actionParts: string[] = [];
  if (levelHPWashes > 0) {
    actionParts.push(`${levelHPWashes} HP washes`);
  }
  if (intAP > 0) {
    actionParts.push(`+${intAP} INT (AP)`);
  }
  if (mainStatAP > 0) {
    actionParts.push(`+${mainStatAP} main stat (AP)`);
  }

  const actionsSummary =
    actionParts.length > 0 ? actionParts.join(", ") : "Gear change only";

  const actions: string[] = [];
  if (levelHPWashes > 0) {
    actions.push(`Use ${levelHPWashes} AP resets for HP washing.`);
  }
  if (intAP > 0) {
    actions.push(`Allocate ${intAP} AP into INT.`);
  }
  if (mainStatAP > 0) {
    actions.push(`Allocate ${mainStatAP} AP into your main stat.`);
  }

  return {
    kind: "event",
    level,
    actionsSummary,
    actions,
    equips: equipSummaries,
  };
};

export const buildPlanGroups = (
  breakoutPlan: BreakoutPlanType
): PlanBuildResult => {
  const levels = Object.entries(breakoutPlan)
    .map(([level, details]) => aggregateLevel(Number(level), details))
    .sort((a, b) => a.level - b.level);

  let firstWashLevel: number | undefined;
  let lastWashLevel: number | undefined;
  let totalHPWashes = 0;

  const groups: PlanGroup[] = [];
  let currentPatternGroup: PatternRangeGroup | undefined;

  const flushPatternGroup = () => {
    if (!currentPatternGroup) return;
    groups.push(currentPatternGroup);
    currentPatternGroup = undefined;
  };

  for (const levelInfo of levels) {
    const {
      level,
      levelHPWashes,
      intAP,
      mainStatAP,
      hasEquips,
      hasHPWash,
      hasAnyAPChange,
    } = levelInfo;

    if (hasHPWash) {
      totalHPWashes += levelHPWashes;
      if (firstWashLevel === undefined) firstWashLevel = level;
      lastWashLevel = level;
    }

    // Any gear changes are always their own event
    if (hasEquips) {
      flushPatternGroup();
      groups.push(buildEventGroup(levelInfo));
      continue;
    }

    // Levels with only washes / stat AP (no gear)
    if (hasAnyAPChange) {
      const pattern = {
        perLevelHPWashes: levelHPWashes,
        perLevelIntAP: intAP,
        perLevelMainStatAP: mainStatAP,
      };

      if (
        currentPatternGroup &&
        level === currentPatternGroup.endLevel + 1 &&
        currentPatternGroup.perLevelHPWashes === pattern.perLevelHPWashes &&
        currentPatternGroup.perLevelIntAP === pattern.perLevelIntAP &&
        currentPatternGroup.perLevelMainStatAP === pattern.perLevelMainStatAP
      ) {
        currentPatternGroup.endLevel = level;
      } else {
        flushPatternGroup();
        currentPatternGroup = {
          kind: "patternRange",
          startLevel: level,
          endLevel: level,
          ...pattern,
        };
      }
    } else {
      // No relevant actions on this level – break any ongoing pattern range
      flushPatternGroup();
    }
  }

  flushPatternGroup();

  return {
    groups,
    firstWashLevel,
    lastWashLevel,
    totalHPWashes,
  };
};


