"use client";

import { useMemo } from "react";
import { Action, BreakoutPlan as BreakoutPlanType } from "@/app/models/player";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BreakoutPlanProps {
  breakoutPlan: BreakoutPlanType;
}

type EventGroup = {
  kind: "event";
  level: number;
  actionsSummary: string;
  actions: string[];
  equips: string[];
};

type PatternRangeGroup = {
  kind: "patternRange";
  startLevel: number;
  endLevel: number;
  perLevelHPWashes: number;
  perLevelIntAP: number;
  perLevelMainStatAP: number;
};

type PlanGroup = EventGroup | PatternRangeGroup;

export const BreakoutPlan = ({ breakoutPlan }: BreakoutPlanProps) => {
  const {
    groups,
    firstWashLevel,
    lastWashLevel,
    totalHPWashes,
  }: {
    groups: PlanGroup[];
    firstWashLevel?: number;
    lastWashLevel?: number;
    totalHPWashes: number;
  } = useMemo(() => {
    const entries = Object.entries(breakoutPlan)
      .map(([level, details]) => ({
        level: Number(level),
        details,
      }))
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

    for (const { level, details } of entries) {
      const hpWashActions = details.actions.filter(
        (a) => a.type === Action.HP_WASH
      );
      const addIntActions = details.actions.filter(
        (a) => a.type === Action.ADD_INT
      );
      const addMainStatActions = details.actions.filter(
        (a) => a.type === Action.ADD_MAIN_STAT
      );

      const levelHPWashes = hpWashActions.reduce((sum, a) => sum + a.ap, 0);
      const intAP = addIntActions.reduce((sum, a) => sum + a.ap, 0);
      const mainStatAP = addMainStatActions.reduce((sum, a) => sum + a.ap, 0);

      const hasEquips = details.equips.length > 0;
      const hasHPWash = levelHPWashes > 0;

      if (levelHPWashes > 0) {
        totalHPWashes += levelHPWashes;
        if (firstWashLevel === undefined) firstWashLevel = level;
        lastWashLevel = level;
      }

      const equipSummaries = details.equips.map((e) => {
        const name = e.item.name || e.item.id || "New gear";
        if (e.oldItem) {
          const oldName = e.oldItem.name || e.oldItem.id || "old gear";
          return `${name} (+${e.intGain} INT over ${oldName})`;
        }
        return `${name} (+${e.intGain} INT)`;
      });

      const hasAnyAPChange = intAP > 0 || mainStatAP > 0 || levelHPWashes > 0;

      // If this level has any gear changes, always treat as discrete event
      if (hasEquips) {
        flushPatternGroup();

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

        groups.push({
          kind: "event",
          level,
          actionsSummary,
          actions,
          equips: equipSummaries,
        });
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
  }, [breakoutPlan]);

  return (
    <Card className="flex-1 min-w-0">
      <CardHeader className="space-y-2">
        <CardTitle>Washing Playbook</CardTitle>
        <CardDescription>
          Condensed washing and stat allocation plan by level range.
        </CardDescription>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {totalHPWashes > 0 && (
            <div>
              <span className="font-medium">
                {totalHPWashes.toLocaleString()}
              </span>{" "}
              total HP washes
              {firstWashLevel !== undefined && lastWashLevel !== undefined && (
                <span>
                  {" "}
                  (levels {firstWashLevel}–{lastWashLevel})
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
        {groups.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No actions or gear changes recorded yet. Submit the form to generate
            a washing plan.
          </div>
        ) : (
          <ol className="space-y-2 text-sm">
            {groups.map((group, idx) => {
              if (group.kind === "event") {
                return (
                  <li
                    key={`event-${group.level}-${idx}`}
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
              }

              // Pattern range group (same per-level washes/stats, no gear)
              const {
                startLevel,
                endLevel,
                perLevelHPWashes,
                perLevelIntAP,
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
                summaryParts.push(
                  `Wash ${perLevelHPWashes} AP for HP per level (≈${totalWashes} total washes)`
                );
              }
              if (perLevelIntAP > 0) {
                summaryParts.push(
                  `Allocate ${perLevelIntAP} AP into INT per level`
                );
              }
              if (perLevelMainStatAP > 0) {
                summaryParts.push(
                  `Allocate ${perLevelMainStatAP} AP into your main stat per level`
                );
              }

              return (
                <li
                  key={`range-${startLevel}-${endLevel}-${idx}`}
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
                  <div className="mt-1.5 text-[0.7rem] text-muted-foreground">
                    These levels primarily allocate stats with no washes or gear
                    changes.
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};
