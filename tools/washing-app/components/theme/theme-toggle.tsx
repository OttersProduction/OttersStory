"use client";
import { Moon, Sun } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";

const ThemeToggle = ({ defaultTheme }: { defaultTheme: string }) => {
  const [theme, setTheme] = useState(defaultTheme);

  const handleChange = (value: string) => {
    setTheme(value);
  };

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

  return (
    <Select value={theme} onValueChange={handleChange}>
      <SelectTrigger size="sm" aria-label="Select theme">
        <SelectValue>
          {theme === "light" && (
            <span className="flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5" />
              <span>Light</span>
            </span>
          )}
          {theme === "dark" && (
            <span className="flex items-center gap-1.5">
              <Moon className="h-3.5 w-3.5" />
              <span>Dark</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="light">
          <span className="flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5" />
            <span>Light</span>
          </span>
        </SelectItem>
        <SelectItem value="dark">
          <span className="flex items-center gap-1.5">
            <Moon className="h-3.5 w-3.5" />
            <span>Dark</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ThemeToggle;
