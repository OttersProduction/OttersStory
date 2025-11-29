"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  characterSchema,
  CHARACTER_DEFAULTS,
} from "@/components/logical/character-form";
import {
  settingsSchema,
  SETTINGS_DEFAULTS,
} from "@/components/logical/settings-form";
import {
  bonusesSchema,
  BONUSES_DEFAULTS,
} from "@/components/logical/bonuses-form";
import { CharacterForm } from "@/components/logical/character-form";
import { SettingsForm } from "@/components/logical/settings-form";
import { BonusesForm } from "@/components/logical/bonuses-form";

const formSchema = characterSchema.merge(settingsSchema).merge(bonusesSchema);

export type FormValues = z.infer<typeof formSchema>;

export const DEFAULT_FORM_VALUES: FormValues = {
  ...CHARACTER_DEFAULTS,
  ...SETTINGS_DEFAULTS,
  ...BONUSES_DEFAULTS,
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
          <CharacterForm control={form.control} />
          <div className="flex flex-col gap-4">
            <SettingsForm control={form.control} />
            <BonusesForm control={form.control} />
          </div>
        </div>
        <Button className="sm:w-auto w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
