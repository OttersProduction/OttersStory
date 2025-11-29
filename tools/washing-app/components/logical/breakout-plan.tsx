"use client";

import { useMemo, useState } from "react";
import { Action, BreakoutPlan as BreakoutPlanType } from "@/app/models/player";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface BreakoutPlanProps {
  breakoutPlan: BreakoutPlanType;
}

export const BreakoutPlan = ({ breakoutPlan }: BreakoutPlanProps) => {
  const {
    levels,
    firstWashLevel,
    lastWashLevel,
    totalHPWashes,
  }: {
    levels: {
      level: number;
      actionsSummary: string;
      actions: string[];
      equips: string[];
    }[];
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

    const levels = entries.map(({ level, details }) => {
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

      const actionParts: string[] = [];
      if (levelHPWashes > 0) {
        actionParts.push(`${levelHPWashes} HP washes`);
      }
      const intAP = addIntActions.reduce((sum, a) => sum + a.ap, 0);
      if (intAP > 0) {
        actionParts.push(`+${intAP} INT (AP)`);
      }
      const mainStatAP = addMainStatActions.reduce((sum, a) => sum + a.ap, 0);
      if (mainStatAP > 0) {
        actionParts.push(`+${mainStatAP} main stat (AP)`);
      }

      const actionsSummary =
        actionParts.length > 0 ? actionParts.join(", ") : "No AP changes";

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
        level,
        actionsSummary,
        actions,
        equips: equipSummaries,
      };
    });

    return {
      levels,
      firstWashLevel,
      lastWashLevel,
      totalHPWashes,
    };
  }, [breakoutPlan]);

  const visibleLevels = useMemo(
    () =>
      levels.filter((lvl) => {
        return lvl.actions.length > 0 || lvl.equips.length > 0;
      }),
    [levels]
  );

  return (
    <Card className="flex-1 min-w-0">
      <CardHeader className="space-y-2">
        <CardTitle>Washing Playbook</CardTitle>
        <CardDescription>
          Step-by-step AP and gear changes to follow each level.
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
        {visibleLevels.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No actions or gear changes recorded yet. Submit the form to generate
            a washing plan.
          </div>
        ) : (
          <ol className="space-y-2 text-sm">
            {visibleLevels.map((lvl) => (
              <li
                key={lvl.level}
                className="rounded-md border border-border bg-muted/40 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Level {lvl.level}
                  </span>
                  <span className="text-xs text-foreground">
                    {lvl.actionsSummary}
                  </span>
                </div>
                {(lvl.actions.length > 0 || lvl.equips.length > 0) && (
                  <ul className="mt-1.5 space-y-0.5">
                    {lvl.actions.map((text, idx) => (
                      <li key={`a-${idx}`} className="text-xs text-foreground">
                        • {text}
                      </li>
                    ))}
                    {lvl.equips.map((text, idx) => (
                      <li key={`e-${idx}`} className="text-xs text-foreground">
                        • Equip {text}.
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};
