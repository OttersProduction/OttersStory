"use client";

import React, { useState } from "react";
import { Job } from "./models/job";
import { HPQuest } from "./models/hp-quest";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, Settings, Target, Trophy } from "lucide-react";

export default function WashingCalculator() {
  const [selectedJob, setSelectedJob] = useState<Job>(Job.BEGINNER);
  const [hpGoal, setHpGoal] = useState<number>(0);
  const [targetLevel, setTargetLevel] = useState<number>(1);
  const [selectedQuests, setSelectedQuests] = useState<
    Record<HPQuest, boolean>
  >({} as Record<HPQuest, boolean>);

  const handleQuestToggle = (quest: HPQuest) => {
    setSelectedQuests((prev) => ({
      ...prev,
      [quest]: !prev[quest],
    }));
  };

  const allQuests = Object.values(HPQuest);

  const getQuestDisplayName = (quest: HPQuest): string => {
    switch (quest) {
      case HPQuest.WaterSpring:
        return "Water from the Spring of Youth";
      case HPQuest.Olaf1:
        return "Adventure Assignment 1";
      case HPQuest.Olaf2:
        return "Adventure Assignment 2";
      case HPQuest.Olaf3:
        return "Adventure Assignment 3";
      case HPQuest.Olaf4:
        return "Adventure Assignment 4";
      case HPQuest.Olaf5:
        return "Adventure Assignment 5";
      case HPQuest.Olaf6:
        return "Adventure Assignment 6";
      case HPQuest.Olaf7:
        return "Adventure Assignment 7";
      case HPQuest.Olaf8:
        return "Adventure Assignment 8";
      case HPQuest.Olaf9:
        return "Adventure Assignment 9";
      case HPQuest.Olaf10:
        return "Adventure Assignment 10";
      case HPQuest.ElixerOfLife:
        return "Elixer of Life";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Calculator className="h-10 w-10 text-primary" />
              HP/MP Washing Calculator
            </h1>
            <p className="text-xl text-muted-foreground">
              Calculate optimal washing strategies for your character
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Character Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Character Settings
                </CardTitle>
                <CardDescription>
                  Configure your character's job class and target goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Selection */}
                <div className="space-y-2">
                  <Label htmlFor="job-select">Job Class</Label>
                  <Select
                    value={selectedJob}
                    onValueChange={(value) => setSelectedJob(value as Job)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Job).map((job) => (
                        <SelectItem key={job} value={job}>
                          {job.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* HP Goal */}
                <div className="space-y-2">
                  <Label htmlFor="hp-goal">HP Goal</Label>
                  <Input
                    id="hp-goal"
                    type="number"
                    value={hpGoal}
                    onChange={(e) => setHpGoal(parseInt(e.target.value) || 0)}
                    placeholder="Enter target HP"
                    min="0"
                  />
                </div>

                {/* Target Level */}
                <div className="space-y-2">
                  <Label htmlFor="target-level">Target Level</Label>
                  <Input
                    id="target-level"
                    type="number"
                    value={targetLevel}
                    onChange={(e) =>
                      setTargetLevel(parseInt(e.target.value) || 1)
                    }
                    placeholder="Enter target level"
                    min="1"
                    max="200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* HP Quest Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  HP Quest Settings
                </CardTitle>
                <CardDescription>
                  Select HP quests to include in your calculations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quest Selection */}
                <div className="space-y-4">
                  <Label>Select HP Quests</Label>
                  <div className="grid grid-cols-2 gap-3 p-3 border rounded-md">
                    {allQuests.map((quest) => (
                      <div key={quest} className="flex items-center space-x-2">
                        <Checkbox
                          id={quest}
                          checked={selectedQuests[quest] || false}
                          onCheckedChange={() => handleQuestToggle(quest)}
                        />
                        <Label
                          htmlFor={quest}
                          className="text-sm whitespace-nowrap"
                        >
                          {getQuestDisplayName(quest)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* INT Gear Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                INT Gear (Coming Soon)
              </CardTitle>
              <CardDescription>
                This feature will allow you to input INT gear bonuses to
                calculate their impact on washing efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-6 text-center">
                <div className="text-muted-foreground mb-4">
                  <Calculator className="mx-auto h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  INT Gear Calculator
                </h3>
                <p className="text-muted-foreground mb-4">
                  This feature will allow you to input INT gear bonuses to
                  calculate their impact on washing efficiency.
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Add INT gear items</p>
                  <p>• Calculate total INT bonus</p>
                  <p>• Optimize washing strategy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" className="px-8">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Washing
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
