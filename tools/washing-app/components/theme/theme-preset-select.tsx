"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { setCookie } from "cookies-next/client";

const PRESET_THEMES = [
  { value: "amethyst-haze", label: "Amethyst Haze" },
  { value: "caffeine", label: "Caffeine" },
  { value: "northern-lights", label: "Northern Lights" },
] as const;

interface ThemePresetSelectProps {
  defaultThemePreset: string;
}

export function ThemePresetSelect({
  defaultThemePreset,
}: ThemePresetSelectProps) {
  const [themePreset, setThemePreset] = useState<string>(defaultThemePreset);

  useEffect(() => {
    const themePreset = document.documentElement.dataset.themePreset;
    setThemePreset(themePreset || "northern-lights");
  }, []);

  useEffect(() => {
    setCookie("themePreset", themePreset);
    document.documentElement.dataset.themePreset = themePreset;
  }, [themePreset]);

  return (
    <Select value={themePreset} onValueChange={setThemePreset}>
      <SelectTrigger
        size="sm"
        aria-label="Select visual theme"
        className="min-w-40"
      >
        <SelectValue placeholder="Select visual theme">
          {PRESET_THEMES.find((theme) => theme.value === themePreset)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {PRESET_THEMES.map((theme) => (
          <SelectItem key={theme.value} value={theme.value}>
            {theme.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
