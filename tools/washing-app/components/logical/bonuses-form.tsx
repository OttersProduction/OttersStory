import { Control } from "react-hook-form";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HPQuest } from "@/app/models/hp-quest";

// Schema & defaults for the bonuses section (HP quests)
export const bonusesSchema = z.object({
  hpQuests: z.array(z.enum(HPQuest)),
});

export type BonusesFormValues = z.infer<typeof bonusesSchema>;

export const BONUSES_DEFAULTS: BonusesFormValues = {
  hpQuests: [],
};

interface BonusesFormProps {
  control: Control<any>;
}

export const BonusesForm = ({ control }: BonusesFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HP Quests</CardTitle>
        <CardDescription>
          Choose the HP quests you want to complete
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
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
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            field.onChange([...field.value, quest]);
                          } else {
                            field.onChange(
                              field.value.filter((q: HPQuest) => q !== quest)
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
  );
};


