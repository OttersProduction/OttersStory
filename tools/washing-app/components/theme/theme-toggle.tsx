"use client";
import { Moon, Sun } from "lucide-react";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { Switch } from "@/components/ui/switch";

const ThemeToggle = ({ defaultTheme }: { defaultTheme: string }) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const theme = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    setTheme(theme);
  }, []);

  useEffect(() => {
    setCookie("theme", theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const isDark = theme === "dark";

  const handleCheckedChange = (checked: boolean) => {
    const nextTheme = checked ? "dark" : "light";
    setTheme(nextTheme);

    const themePreset =
      document.documentElement.dataset.themePreset || "northern-lights";

    posthog.capture("theme_mode_changed", {
      theme_mode: nextTheme,
      theme_preset: themePreset,
      $set: {
        theme_mode: nextTheme,
        theme_preset: themePreset,
      },
    });
  };

  const thumbIcon = isDark ? (
    <Moon className="h-3.5 w-3.5" color="var(--color-primary)" />
  ) : (
    <Sun className="h-3.5 w-3.5" color="var(--color-primary)" />
  );

  return (
    <Switch
      checked={isDark}
      onCheckedChange={handleCheckedChange}
      aria-label="Toggle dark mode"
      thumbChildren={thumbIcon}
    />
  );
};

export default ThemeToggle;
