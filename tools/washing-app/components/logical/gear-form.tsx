import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { GearSlot, gearItems } from "@/app/models/gear";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";

// Allow any defined GearSlot value in the schema (Hat, Face, Weapon, Shield, etc.)
export const characterGearSlotEnum = z.nativeEnum(GearSlot);

export const characterGearItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().min(1, "Item name is required"),
  slot: characterGearSlotEnum,
  requiredLevel: z
    .number()
    .min(1, { message: "Required level must be at least 1" })
    .max(200, { message: "Required level cannot exceed 200" }),
  int: z
    .number()
    .min(0, { message: "INT must be at least 0" })
    .max(999, { message: "INT cannot exceed 999" }),
});

export const gearSchema = z.object({
  gearItems: z.array(characterGearItemSchema),
});

export type GearFormValues = z.infer<typeof gearSchema>;

export const GEAR_DEFAULTS: GearFormValues = {
  gearItems: [],
};

interface GearFormProps {
  control: Control<any>;
}

export const GearForm = ({ control }: GearFormProps) => {
  const { setValue } = useFormContext();
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
        <div className="space-y-2 divide-y divide-border px-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap items-center gap-3 pb-6"
            >
              <FormField
                control={control}
                name={`gearItems.${index}.id`}
                render={({ field }) => (
                  <FormItem className="min-w-[180px] flex-1">
                    <FormLabel className="text-[10px] text-muted-foreground">
                      Item
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={
                          field.value !== undefined ? String(field.value) : ""
                        }
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selected = gearItems.find(
                            (item) => String(item.id) === value
                          );
                          if (selected) {
                            // Populate dependent fields based on selected gear item
                            setValue(
                              `gearItems.${index}.name`,
                              selected.name
                            );
                            setValue(
                              `gearItems.${index}.slot`,
                              selected.slot
                            );
                            setValue(
                              `gearItems.${index}.requiredLevel`,
                              selected.requiredLevel
                            );
                            // Default INT to the item's INT (user can override)
                            setValue(`gearItems.${index}.int`, selected.int);
                          }
                        }}
                      >
                        <SelectTrigger size="sm">
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(GearSlot).map((slot) => {
                            const itemsForSlot = gearItems
                              .filter((item) => item.slot === slot)
                              
                            if (!itemsForSlot.length) return null;

                            return (
                              <SelectGroup key={slot}>
                                <SelectLabel>{slot}</SelectLabel>
                                {itemsForSlot.map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={String(item.id)}
                                  >
                                    {item.name} (Lv {item.requiredLevel})
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-auto mt-auto"
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
          onClick={() => {
            const defaultItem = gearItems[0];
            append({
              id: defaultItem.id,
              name: defaultItem.name,
              slot: defaultItem.slot,
              requiredLevel: defaultItem.requiredLevel,
              int: defaultItem.int,
            });
          }}
        >
          Add gear item
        </Button>
      </div>
    </div>
  );
}


