"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { JobSelect } from "@/components/logical/job-select";
import { Job } from "@/app/models/job";
import { DEFAULT_PREFERENCES } from "@/app/models/defaults";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { HPQuest } from "@/app/models/hp-quest";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  job: z.custom<Job>((val) => val !== undefined, {
    message: "Please select a job",
  }),
  targetLevel: z
    .number()
    .min(4, { message: "Level must be at least 4" })
    .max(200, { message: "Level cannot exceed 200" }),
  targetHP: z
    .number()
    .min(0, { message: "HP must be at least 0" })
    .max(99999, { message: "HP cannot exceed 99999" }),
  hpQuests: z.array(z.enum(HPQuest)),
  targetInt: z
    .number()
    .min(4, { message: "INT must be at least 4" })
    .max(999, { message: "INT cannot exceed 999" })
    .optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const DEFAULT_FORM_VALUES: FormValues = {
  job: DEFAULT_PREFERENCES.job,
  targetLevel: DEFAULT_PREFERENCES.levelGoal,
  targetHP: DEFAULT_PREFERENCES.hpGoal,
  hpQuests: [],
  targetInt: undefined,
};

interface InitalFormProps {
  onSubmit: (values: FormValues) => void;
}
export const InitalForm = ({ onSubmit }: InitalFormProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <FormItem className="flex-1 max-w-lg w-full sm:w-32">
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <JobSelect job={field.value} onSelectJob={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetLevel"
            render={({ field }) => (
              <FormItem className="flex-1 max-w-lg w-full sm:w-32">
                <FormLabel>Target Level</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="4"
                    max="200"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetHP"
            render={({ field }) => (
              <FormItem className="flex-1 max-w-lg w-full sm:w-32">
                <FormLabel>Target HP</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="99999"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <CollapsibleContent className="grid sm:grid-cols-[1fr_auto] gap-12 pt-4">
            <FormField
              control={form.control}
              name="hpQuests"
              render={({ field }) => (
                <FormItem className="w-full sm:w-xs">
                  <FormLabel>HP Quests</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.values(HPQuest).map((quest) => (
                        <div key={quest} className="flex items-center gap-2">
                          <Checkbox
                            key={quest}
                            id={quest}
                            value={quest}
                            checked={field.value.includes(quest)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, quest]);
                              } else {
                                field.onChange(
                                  field.value.filter((q) => q !== quest)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={quest}>
                            {quest
                              .replace("Olaf", "Olaf's")
                              .replace("ElixerOfLife", "Elixer of Life")
                              .replace("WaterSpring", "Water Spring")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetInt"
              render={({ field }) => (
                <FormItem className="w-full sm:w-xs">
                  <FormLabel>Target INT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      max="999"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to automatically calculate the minimum INT
                    needed
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CollapsibleContent>
        </Collapsible>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
