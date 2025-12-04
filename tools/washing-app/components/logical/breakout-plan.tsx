"use client";

import { useState } from "react";
import { BreakoutPlan as BreakoutPlanType } from "@/app/models/player";
import { Button } from "@/components/ui/button";
import { BreakoutPlanSimple } from "./breakout-plan-simple";
import { BreakoutPlanComplex } from "./breakout-plan-complex";

interface BreakoutPlanProps {
  breakoutPlan: BreakoutPlanType;
}

type BreakoutViewMode = "simple" | "complex";

export const BreakoutPlan = ({ breakoutPlan }: BreakoutPlanProps) => {
  const [mode, setMode] = useState<BreakoutViewMode>("simple");

  console.log(breakoutPlan);
  return (
    <div className="flex-1 min-w-0 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="text-sm font-semibold text-foreground">
            Washing Plan View
          </div>
          <div className="text-xs text-muted-foreground">
            {mode === "simple"
              ? "High-level INT, HP washing, and main stat ranges."
              : "Detailed per-level actions and gear changes."}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={mode === "simple" ? "default" : "outline"}
            onClick={() => setMode("simple")}
          >
            Simple
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "complex" ? "default" : "outline"}
            onClick={() => setMode("complex")}
          >
            Detailed
          </Button>
        </div>
      </div>

      {mode === "simple" ? (
        <BreakoutPlanSimple breakoutPlan={breakoutPlan} />
      ) : (
        <BreakoutPlanComplex breakoutPlan={breakoutPlan} />
      )}
    </div>
  );
};
