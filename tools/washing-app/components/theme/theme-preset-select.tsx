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
import posthog from "posthog-js";

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

  const handlePresetChange = (value: string) => {
    setThemePreset(value);

    const mode = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    const label =
      PRESET_THEMES.find((theme) => theme.value === value)?.label ?? value;

    posthog.capture("theme_preset_changed", {
      theme_preset: value,
      theme_preset_label: label,
      theme_mode: mode,
      $set: {
        theme_preset: value,
        theme_preset_label: label,
        theme_mode: mode,
      },
    });
  };

  return (
    <Select value={themePreset} onValueChange={handlePresetChange}>
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
