import { Control } from "react-hook-form";
import * as z from "zod";
import { DEFAULT_PREFERENCES } from "@/app/models/defaults";
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
import { Button } from "@/components/ui/button";

// Schema & defaults for the settings section
export const settingsSchema = z.object({
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

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const SETTINGS_DEFAULTS: SettingsFormValues = {
  targetLevel: DEFAULT_PREFERENCES.levelGoal,
  targetHP: DEFAULT_PREFERENCES.hpGoal,
  targetInt: undefined,
  washingMode: "hp",
};

interface SettingsFormProps {
  control: Control<any>;
}

export const SettingsForm = ({ control }: SettingsFormProps) => {
  return (
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
              name="washingMode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid [grid-template-areas:'hp_mp'_'none_none'] sm:[grid-template-areas:'hp_none_mp'] gap-2">
                      <Button
                        type="button"
                        variant={field.value === "hp" ? "default" : "outline"}
                        className="[grid-area:hp]"
                        onClick={() => field.onChange("hp")}
                      >
                        HP Washing
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "none" ? "default" : "outline"}
                        className="[grid-area:none]"
                        onClick={() => field.onChange("none")}
                      >
                        Nothing
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "mp" ? "default" : "outline"}
                        className="[grid-area:mp]"
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
  );
};


