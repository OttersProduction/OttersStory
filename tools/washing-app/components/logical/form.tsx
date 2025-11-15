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
import { HPQuest } from "@/app/models/hp-quest";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const formSchema = z.object({
  job: z.custom<Job>((val) => val !== undefined, {
    message: "Please select a job",
  }),
  level: z
    .number()
    .min(1, { message: "Level must be at least 1" })
    .max(200, { message: "Level cannot exceed 200" }),
  hp: z
    .number()
    .min(0, { message: "HP must be at least 0" })
    .max(99999, { message: "HP cannot exceed 99999" }),
  mp: z
    .number()
    .min(0, { message: "MP must be at least 0" })
    .max(99999, { message: "MP cannot exceed 99999" }),
  str: z
    .number()
    .min(4, { message: "STR must be at least 4" })
    .max(999, { message: "STR cannot exceed 999" }),
  dex: z
    .number()
    .min(4, { message: "DEX must be at least 4" })
    .max(999, { message: "DEX cannot exceed 999" }),
  int: z
    .number()
    .min(4, { message: "INT must be at least 4" })
    .max(999, { message: "INT cannot exceed 999" }),
  luk: z
    .number()
    .min(4, { message: "LUK must be at least 4" })
    .max(999, { message: "LUK cannot exceed 999" }),
  ap: z
    .number()
    .min(0, { message: "AP must be at least 0" })
    .max(9999, { message: "AP cannot exceed 9999" }),
  hpQuests: z.array(z.enum(HPQuest)),
  targetLevel: z
    .number()
    .min(4, { message: "Level must be at least 4" })
    .max(200, { message: "Level cannot exceed 200" }),
  targetHP: z
    .number()
    .min(0, { message: "HP must be at least 0" })
    .max(99999, { message: "HP cannot exceed 99999" }),
  targetInt: z
    .number()
    .min(4, { message: "INT must be at least 4" })
    .max(999, { message: "INT cannot exceed 999" })
    .optional(),
  washingMode: z.enum(["hp", "none", "mp"]),
});

export type FormValues = z.infer<typeof formSchema>;

export const DEFAULT_FORM_VALUES: FormValues = {
  job: DEFAULT_PREFERENCES.job,
  level: 1,
  hp: 50,
  mp: 5,
  str: 4,
  dex: 4,
  int: 4,
  luk: 4,
  ap: 9,
  hpQuests: [],
  targetLevel: DEFAULT_PREFERENCES.levelGoal,
  targetHP: DEFAULT_PREFERENCES.hpGoal,
  targetInt: undefined,
  washingMode: "hp",
};

interface InitalFormProps {
  onSubmit: (values: FormValues) => void;
}
export const InitalForm = ({ onSubmit }: InitalFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Character</CardTitle>
              <CardDescription>
                Current character stats and attributes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Character Info Section */}
                <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
                  <FormField
                    control={form.control}
                    name="job"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Class</FormLabel>
                        <FormControl>
                          <JobSelect
                            job={field.value}
                            onSelectJob={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel className="text-xs">Level</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value?.toString() ?? ""}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Vitals and Stats Combined */}
                <div className="flex gap-4 pt-4 border-t border-border">
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-foreground">
                      Vitals
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="mp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              MP
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value?.toString() ?? ""}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              HP
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value?.toString() ?? ""}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-foreground">
                      Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="str"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              STR
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value?.toString() ?? ""}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dex"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              DEX
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value?.toString() ?? ""}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="int"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              INT
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value?.toString() ?? ""}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="luk"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">
                              LUK
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value?.toString() ?? ""}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-auto">
                    <FormField
                      control={form.control}
                      name="ap"
                      render={({ field }) => (
                        <FormItem className="w-18">
                          <FormLabel className="text-xs text-muted-foreground">
                            Available AP
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              value={field.value?.toString() ?? ""}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Gear Section */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-xs font-semibold text-foreground mb-4">
                    Gear
                  </h3>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 flex-col">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Set your goals and washing preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Target Goals Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">
                      Target Goals
                    </h3>
                    <FormField
                      control={form.control}
                      name="targetLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Target Level
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              value={field.value?.toString() ?? ""}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
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
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Target HP
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              value={field.value?.toString() ?? ""}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetInt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Target INT (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              value={
                                field.value !== undefined
                                  ? field.value.toString()
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseInt(e.target.value) || undefined
                                    : undefined
                                )
                              }
                              placeholder="Optional"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />

                  {/* Washing Mode Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Washing Mode
                    </h3>
                    <FormField
                      control={form.control}
                      name="washingMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={
                                  field.value === "hp" ? "default" : "outline"
                                }
                                className="flex-1"
                                onClick={() => field.onChange("hp")}
                              >
                                HP Washing
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  field.value === "none" ? "default" : "outline"
                                }
                                className="flex-1"
                                onClick={() => field.onChange("none")}
                              >
                                Nothing
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  field.value === "mp" ? "default" : "outline"
                                }
                                className="flex-1"
                                onClick={() => field.onChange("mp")}
                              >
                                MP Washing
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HP Quests</CardTitle>
                <CardDescription>
                  Choose the HP quests you want to complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="hpQuests"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-xs">
                      <FormLabel>HP Quests</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4">
                          {Object.values(HPQuest).map((quest) => (
                            <div
                              key={quest}
                              className="flex items-center gap-2"
                            >
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
              </CardContent>
            </Card>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
