"use client";
import { Moon, Sun } from "lucide-react";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
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
    setTheme(checked ? "dark" : "light");
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
