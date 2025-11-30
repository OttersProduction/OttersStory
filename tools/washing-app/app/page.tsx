"use client";

import { useMemo, useState } from "react";

import Graph from "@/components/logical/graph";

import { createHPWashPlan } from "./utils/hp-wash";
import { WashingOverview } from "@/components/logical/washing-overview";
import { FormValues, InitalForm } from "@/components/logical/form";
import { Player } from "@/lib/player";
import { GearItem, GearSlot } from "@/app/models/gear";
import { BreakoutPlan } from "@/components/logical/breakout-plan";

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
        <InitalForm onSubmit={handleSubmit} />

        {plan && formvalues && (
          <>
            <WashingOverview {...plan} />

            <div className="flex sm:flex-row flex-col gap-4">
              <div className="flex-1 flex flex-col gap-4">
                <BreakoutPlan breakoutPlan={plan.player.breakoutPlan} />
              </div>
              <div className="flex-1 min-w-0">
                <Graph
                  job={formvalues.job}
                  data={plan.data}
                  targetHP={formvalues.targetHP}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
