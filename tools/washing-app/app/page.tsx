"use client";

import { useMemo, useState } from "react";
import { Job } from "@/app/models/job";
import { getHP, getMP } from "@/app/utils/hp-mp-helper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Graph from "@/components/logical/graph";
import { JobSelect } from "@/components/logical/job-select";

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<Job>(Job.BEGINNER);

  const chartData = useMemo(() => {
    const data = [];
    for (let level = 1; level <= 200; level++) {
      data.push({
        level,
        hp: getHP(selectedJob, level),
        mp: getMP(selectedJob, level),
      });
    }
    return data;
  }, [selectedJob]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MapleStory Washing Calculator
          </h1>
          <p className="text-gray-600">
            Visualize HP and MP growth by class and level
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Selection</CardTitle>
            <CardDescription>
              Choose a class to see its HP and MP progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobSelect job={selectedJob} onSelectJob={setSelectedJob} />
          </CardContent>
        </Card>

        {selectedJob && <Graph job={selectedJob} data={chartData} />}
      </div>
    </div>
  );
}
