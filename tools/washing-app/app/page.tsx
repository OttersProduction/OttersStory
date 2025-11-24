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
import { Player } from "@/app/models/player";
import { GearItem, GearSlot } from "@/app/models/gear";

export default function Home() {
  const [formvalues, setFormvalues] = useState<FormValues | undefined>(
    undefined
  );

  const handleSubmit = (values: FormValues) => {
    setFormvalues(values);
  };

  const plan = useMemo(() => {
    if (!formvalues) return undefined;

    const inventory: GearItem[] = formvalues.gearItems.map((item, index) => ({
      id: item.id ?? `${item.slot}-${index}`,
      name: item.name,
      slot: item.slot as GearSlot,
      requiredLevel: item.requiredLevel,
      int: item.int,
    }));

    // Create Player instance from form values
    const player = new Player(
      formvalues.job,
      formvalues.level,
      {
        str: formvalues.str,
        dex: formvalues.dex,
        int: formvalues.int,
        luk: formvalues.luk,
        naturalHP: formvalues.hp,
        naturalMP: formvalues.mp,
        ap: formvalues.ap,
      },
      formvalues.hpQuests,
      inventory
    );

    return createHPWashPlan(
      player,
      formvalues.targetLevel,
      formvalues.targetHP,
      formvalues.targetInt,
      formvalues.washingMode
    );
  }, [formvalues]);

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

        <InitalForm onSubmit={handleSubmit} />

        {plan && formvalues && (
          <>
            <PlanBreakdown {...plan} />

            <Graph job={formvalues.job} data={plan.data} />
          </>
        )}
      </div>
    </div>
  );
}
