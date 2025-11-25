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
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:gap-8">
        <div className="text-center px-2">
          <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
            MapleStory Washing Calculator
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
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
