"use client";

import { EventGroup, PatternRangeGroup } from "./breakout-plan-helpers";

interface BreakoutEventRowProps {
  group: EventGroup;
  index: number;
}

export const BreakoutEventRow = ({ group, index }: BreakoutEventRowProps) => {
  return (
    <li
      key={`event-${group.level}-${index}`}
      className="rounded-md border border-border bg-muted/40 px-3 py-2"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Level {group.level}
        </span>
      </div>
      {(group.actions.length > 0 || group.equips.length > 0) && (
        <ul className="mt-1.5 space-y-0.5">
          {group.actions.map((text, i) => (
            <li
              key={`a-${group.level}-${i}`}
              className="text-xs text-foreground"
            >
              • {text}
            </li>
          ))}
          {group.equips.map((text, i) => (
            <li
              key={`e-${group.level}-${i}`}
              className="text-xs text-foreground"
            >
              • Equip {text}.
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

interface BreakoutPatternRangeRowProps {
  group: PatternRangeGroup;
  index: number;
}

export const BreakoutPatternRangeRow = ({
  group,
  index,
}: BreakoutPatternRangeRowProps) => {
  const {
    startLevel,
    endLevel,
    perLevelHPWashes,
    perLevelMPAP,
    perLevelRemovedMPAP,
    perLevelIntAP,
    perLevelRemovedIntAP,
    perLevelMainStatAP,
  } = group;

  const title =
    startLevel === endLevel
      ? `Level ${startLevel}`
      : `Levels ${startLevel}–${endLevel}`;

  const levelCount = endLevel - startLevel + 1;
  const summaryParts: string[] = [];

  if (perLevelHPWashes > 0) {
    const totalWashes = perLevelHPWashes * levelCount;
    if (levelCount === 1) {
      summaryParts.push(`Wash ${perLevelHPWashes} AP for HP`);
    } else {
      summaryParts.push(
        `Wash ${perLevelHPWashes} AP for HP per level (≈${totalWashes} total washes)`
      );
    }
  }
  if (perLevelMPAP > 0) {
    const totalMP = perLevelMPAP * levelCount;
    if (levelCount === 1) {
      summaryParts.push(`Allocate ${perLevelMPAP} AP into MP (MP washing)`);
    } else {
      summaryParts.push(
        `Allocate ${perLevelMPAP} AP into MP per level (≈${totalMP} total AP)`
      );
    }
  }
  if (perLevelIntAP > 0) {
    if (levelCount === 1) {
      summaryParts.push(`Allocate ${perLevelIntAP} AP into INT`);
    } else {
      summaryParts.push(`Allocate ${perLevelIntAP} AP into INT per level`);
    }
  }
  if (perLevelRemovedIntAP > 0) {
    if (levelCount === 1) {
      summaryParts.push(`Use ${perLevelRemovedIntAP} AP resets to remove INT`);
    } else {
      summaryParts.push(
        `Use ${perLevelRemovedIntAP} AP resets to remove INT per level`
      );
    }
  }
  if (perLevelRemovedMPAP > 0) {
    if (levelCount === 1) {
      summaryParts.push(`Use ${perLevelRemovedMPAP} AP resets to remove MP`);
    } else {
      summaryParts.push(
        `Use ${perLevelRemovedMPAP} AP resets to remove MP per level`
      );
    }
  }
  if (perLevelMainStatAP > 0) {
    if (levelCount === 1) {
      summaryParts.push(
        `Allocate ${perLevelMainStatAP} AP into your main stat`
      );
    } else {
      summaryParts.push(
        `Allocate ${perLevelMainStatAP} AP into your main stat per level`
      );
    }
  }

  return (
    <li
      key={`range-${startLevel}-${endLevel}-${index}`}
      className="rounded-md border border-border bg-muted/20 px-3 py-2"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
      </div>
      {summaryParts.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {summaryParts.map((text, i) => (
            <li
              key={`s-${startLevel}-${endLevel}-${i}`}
              className="text-xs text-foreground"
            >
              • {text}.
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
