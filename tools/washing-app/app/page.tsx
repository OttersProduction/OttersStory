"use client";

import { useMemo, useState } from "react";
import { Job } from "@/app/models/job";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

import Graph from "@/components/logical/graph";
import { JobSelect } from "@/components/logical/job-select";

import { createHPWashPlan } from "./utils/hp-wash";
import { Button } from "@/components/ui/button";
import { PlanBreakdown } from "@/components/logical/plan-breakdown";
import { DEFAULT_PREFERENCES } from "@/app/models/defaults";

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<Job>(DEFAULT_PREFERENCES.job);
  const [targetLevel, setTargetLevel] = useState<number>(
    DEFAULT_PREFERENCES.levelGoal
  );
  const [targetInt, setTargetInt] = useState<number | undefined>(undefined);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [targetHP, setTargetHP] = useState<number>(DEFAULT_PREFERENCES.hpGoal);

  const hpPlan = useMemo(
    () => createHPWashPlan(selectedJob, targetLevel, targetHP, targetInt),
    [selectedJob, targetLevel, targetHP, targetInt]
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 max-w-lg w-full sm:w-32">
                <Label htmlFor="job-select" className="mb-2 block">
                  Class
                </Label>
                <JobSelect job={selectedJob} onSelectJob={setSelectedJob} />
              </div>
              <div className="flex-1 max-w-lg w-full sm:w-32">
                <Label htmlFor="target-level" className="mb-2 block">
                  Target Level
                </Label>
                <Input
                  id="target-level"
                  type="number"
                  min="4"
                  max="200"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex-1 max-w-lg w-full sm:w-32">
                <Label htmlFor="target-hp" className="mb-2 block">
                  Target HP
                </Label>
                <Input
                  id="target-hp"
                  type="number"
                  min="0"
                  max="99999"
                  value={targetHP}
                  onChange={(e) => setTargetHP(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button className="flex ms-auto" variant="outline" size={"sm"}>
                  Advanced
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isAdvancedOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="w-full sm:w-xs">
                  <Label htmlFor="target-int" className="mb-2 block">
                    Target INT (Optional)
                  </Label>
                  <Input
                    id="target-int"
                    type="number"
                    min="4"
                    max="999"
                    value={targetInt ?? ""}
                    onChange={(e) =>
                      setTargetInt(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                    placeholder="Auto-calculate optimal INT"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to automatically calculate the minimum INT
                    needed
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        <PlanBreakdown {...hpPlan} />
        {selectedJob && <Graph job={selectedJob} data={hpPlan.data} />}
      </div>
    </div>
  );
}
