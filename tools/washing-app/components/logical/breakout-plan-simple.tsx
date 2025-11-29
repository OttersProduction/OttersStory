"use client";

import { useMemo } from "react";
import { BreakoutPlan as BreakoutPlanType } from "@/app/models/player";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AggregatedLevel,
  buildAggregatedLevels,
} from "./breakout-plan-helpers";

interface BreakoutPlanSimpleProps {
  breakoutPlan: BreakoutPlanType;
}

type LevelRange = {
  start: number;
  end: number;
};

const buildRanges = (
  levels: AggregatedLevel[],
  predicate: (level: AggregatedLevel) => boolean
): LevelRange[] => {
  const ranges: LevelRange[] = [];
  let current: LevelRange | undefined;

  for (const level of levels) {
    const active = predicate(level);
    if (active) {
      if (!current) {
        current = { start: level.level, end: level.level };
      } else if (level.level === current.end + 1) {
        current.end = level.level;
      } else {
        ranges.push(current);
        current = { start: level.level, end: level.level };
      }
    } else if (current) {
      ranges.push(current);
      current = undefined;
    }
  }

  if (current) {
    ranges.push(current);
  }

  return ranges;
};

const formatRangeLabel = (range: LevelRange): string => {
  if (range.start === range.end) {
    return `Level ${range.start}`;
  }
  return `Levels ${range.start}–${range.end}`;
};

export const BreakoutPlanSimple = ({
  breakoutPlan,
}: BreakoutPlanSimpleProps) => {
  const levels = useMemo(
    () => buildAggregatedLevels(breakoutPlan),
    [breakoutPlan]
  );

  const totalIntAP = useMemo(
    () => levels.reduce((sum, lvl) => sum + lvl.intAP, 0),
    [levels]
  );
  const totalHPWashes = useMemo(
    () => levels.reduce((sum, lvl) => sum + lvl.levelHPWashes, 0),
    [levels]
  );
  const totalMainStatAP = useMemo(
    () => levels.reduce((sum, lvl) => sum + lvl.mainStatAP, 0),
    [levels]
  );

  const intRanges = useMemo(
    () => buildRanges(levels, (lvl) => lvl.intAP > 0),
    [levels]
  );
  const washRanges = useMemo(
    () => buildRanges(levels, (lvl) => lvl.levelHPWashes > 0),
    [levels]
  );
  const mainStatRanges = useMemo(
    () => buildRanges(levels, (lvl) => lvl.mainStatAP > 0),
    [levels]
  );

  const equipEvents = useMemo(
    () => levels.filter((lvl) => lvl.hasEquips),
    [levels]
  );

  return (
    <div className="flex flex-col gap-3">
      <Card className="gap-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Stat Allocation Summary</CardTitle>
          <CardDescription>
            Level ranges where you add INT, HP wash, and main stat.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2 text-sm space-y-3">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                INT allocation
              </div>
              {totalIntAP > 0 && (
                <div className="text-[11px] text-muted-foreground">
                  Total: {totalIntAP} AP
                </div>
              )}
            </div>
            {intRanges.length === 0 ? (
              <div className="text-xs text-muted-foreground">
                No INT allocation.
              </div>
            ) : (
              <ul className="space-y-0.5">
                {intRanges.map((range, idx) => (
                  <li key={`int-${idx}`} className="text-xs text-foreground">
                    • {formatRangeLabel(range)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                HP washing
              </div>
              {totalHPWashes > 0 && (
                <div className="text-[11px] text-muted-foreground">
                  Total: {totalHPWashes} washes
                </div>
              )}
            </div>
            {washRanges.length === 0 ? (
              <div className="text-xs text-muted-foreground">
                No HP washing.
              </div>
            ) : (
              <ul className="space-y-0.5">
                {washRanges.map((range, idx) => (
                  <li key={`wash-${idx}`} className="text-xs text-foreground">
                    • {formatRangeLabel(range)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Main stat allocation
              </div>
              {totalMainStatAP > 0 && (
                <div className="text-[11px] text-muted-foreground">
                  Total: {totalMainStatAP} AP
                </div>
              )}
            </div>
            {mainStatRanges.length === 0 ? (
              <div className="text-xs text-muted-foreground">
                No main stat allocation.
              </div>
            ) : (
              <ul className="space-y-0.5">
                {mainStatRanges.map((range, idx) => (
                  <li key={`main-${idx}`} className="text-xs text-foreground">
                    • {formatRangeLabel(range)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gear Progression</CardTitle>
          <CardDescription>
            Levels where you change or upgrade gear for INT.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2 text-xs space-y-1.5">
          {equipEvents.length === 0 ? (
            <div className="text-muted-foreground">No gear changes.</div>
          ) : (
            <ul className="space-y-0.5">
              {equipEvents.map((lvl, idx) => (
                <li
                  key={`equip-${lvl.level}-${idx}`}
                  className="text-foreground"
                >
                  <span className="font-medium">Level {lvl.level}:</span>{" "}
                  {lvl.equipSummaries.join("; ")}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
