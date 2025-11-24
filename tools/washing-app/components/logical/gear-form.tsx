import { Control, useFieldArray } from "react-hook-form";
import { FormValues } from "@/components/logical/form";
import { GearSlot } from "@/app/models/gear";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GearFormProps {
  control: Control<FormValues>;
}

export const GearForm = ({ control }: GearFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gearItems",
  });

  return (
    <div className="pt-4 border-t border-border">
      <h3 className="text-xs font-semibold text-foreground mb-4">Gear</h3>
      <div className="space-y-2">
        {fields.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Add INT gear items to include them in MP gain calculations.
          </p>
        )}
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap items-center gap-2 rounded-md border border-border px-3 py-2"
            >
              <FormField
                control={control}
                name={`gearItems.${index}.slot`}
                render={({ field }) => (
                  <FormItem className="w-28">
                    <FormLabel className="text-[10px] text-muted-foreground">
                      Slot
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger size="sm">
                          <SelectValue placeholder="Slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(GearSlot).map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`gearItems.${index}.name`}
                render={({ field }) => (
                  <FormItem className="min-w-[140px] flex-1">
                    <FormLabel className="text-[10px] text-muted-foreground">
                      Item
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Zakum Helmet"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`gearItems.${index}.requiredLevel`}
                render={({ field }) => (
                  <FormItem className="w-20">
                    <FormLabel className="text-[10px] text-muted-foreground">
                      Req. Lv
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
                            e.target.value ? parseInt(e.target.value) || 0 : 0
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`gearItems.${index}.int`}
                render={({ field }) => (
                  <FormItem className="w-20">
                    <FormLabel className="text-[10px] text-muted-foreground">
                      INT
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
                            e.target.value ? parseInt(e.target.value) || 0 : 0
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: `${Date.now()}-${fields.length}`,
              name: "",
              slot: GearSlot.Hat,
              requiredLevel: 1,
              int: 0,
            })
          }
        >
          Add gear item
        </Button>
      </div>
    </div>
  );
}


