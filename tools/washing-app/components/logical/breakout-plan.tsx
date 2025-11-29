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
import { buildPlanGroups, PlanBuildResult } from "./breakout-plan-helpers";
import {
  BreakoutEventRow,
  BreakoutPatternRangeRow,
} from "./breakout-plan-rows";

interface BreakoutPlanProps {
  breakoutPlan: BreakoutPlanType;
}

export const BreakoutPlan = ({ breakoutPlan }: BreakoutPlanProps) => {
  const {
    groups,
    firstWashLevel,
    lastWashLevel,
    totalHPWashes,
  }: PlanBuildResult = useMemo(
    () => buildPlanGroups(breakoutPlan),
    [breakoutPlan]
  );

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
            {groups.map((group, idx) =>
              group.kind === "event" ? (
                <BreakoutEventRow group={group} index={idx} key={idx} />
              ) : (
                <BreakoutPatternRangeRow group={group} index={idx} key={idx} />
              )
            )}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};
