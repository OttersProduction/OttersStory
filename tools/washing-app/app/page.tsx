"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Graph from "@/components/logical/graph";

import { createHPWashPlan } from "./utils/hp-wash";
import { PlanBreakdown } from "@/components/logical/plan-breakdown";
import { FormValues, InitalForm } from "@/components/logical/form";

export default function Home() {
  const [formvalues, setFormvalues] = useState<FormValues | undefined>(
    undefined
  );

  const handleSubmit = (values: FormValues) => {
    setFormvalues(values);
  };

  const hpPlan = useMemo(
    () =>
      formvalues
        ? createHPWashPlan(
            formvalues.job,
            formvalues.targetLevel,
            formvalues.targetHP,
            formvalues.hpQuests,
            formvalues.targetInt
          )
        : undefined,
    [formvalues]
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            MapleStory Washing Calculator
          </h1>
          <p className="text-muted-foreground">
            Visualize HP and MP growth by class and level
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Choose a class, set your target level and HP goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <InitalForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>

        {hpPlan && formvalues && (
          <>
            <PlanBreakdown {...hpPlan} />

            <Graph job={formvalues.job} data={hpPlan.data} />
          </>
        )}
      </div>
    </div>
  );
}
