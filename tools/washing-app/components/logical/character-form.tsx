import { Control } from "react-hook-form";
import * as z from "zod";
import { Job } from "@/app/models/job";
import { DEFAULT_PREFERENCES } from "@/app/models/defaults";
import { JobSelect } from "@/components/logical/job-select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GearForm } from "@/components/logical/gear-form";
import { gearSchema, GEAR_DEFAULTS } from "@/components/logical/gear-form";

export const characterSchema = z
  .object({
    job: z.custom<Job>((val: unknown) => val !== undefined, {
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
  })
  .merge(gearSchema);

export type CharacterFormValues = z.infer<typeof characterSchema>;

export const CHARACTER_DEFAULTS: CharacterFormValues = {
  job: DEFAULT_PREFERENCES.job,
  level: 1,
  hp: 50,
  mp: 5,
  str: 4,
  dex: 4,
  int: 4,
  luk: 4,
  ap: 9,
  ...GEAR_DEFAULTS,
};

interface CharacterFormProps {
  control: Control<any>;
}

export const CharacterForm = ({ control }: CharacterFormProps) => {
  return (
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
          <div className="flex gap-4">
            <FormField
              control={control}
              name="job"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">Class</FormLabel>
                  <FormControl>
                    <JobSelect job={field.value} onSelectJob={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
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
          <div className="flex flex-col gap-4 pt-4 border-t border-border md:flex-row">
            <div className="space-y-4 md:min-w-[160px]">
              <h3 className="text-xs font-semibold text-foreground">Vitals</h3>
              <div className="space-y-4">
                <FormField
                  control={control}
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
                  control={control}
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

            <div className="space-y-4 flex-1">
              <h3 className="text-xs font-semibold text-foreground">Stats</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <FormField
                  control={control}
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
                  control={control}
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
                  control={control}
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
                  control={control}
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
                control={control}
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

          <GearForm control={control} />
        </div>
      </CardContent>
    </Card>
  );
};
