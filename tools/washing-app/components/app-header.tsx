import Link from "next/link";
import Image from "next/image";

import ThemeToggle from "@/components/theme/theme-toggle";
import { ThemePresetSelect } from "@/components/theme/theme-preset-select";

interface AppHeaderProps {
  defaultTheme: string;
  defaultThemePreset: string;
}
export function AppHeader({
  defaultTheme,
  defaultThemePreset,
}: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 px-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10">
              <Image
                src="/Logo.png"
                alt="OtterStory Washing Logo"
                fill
                sizes="40px"
                className="rounded-full object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground sm:text-lg">
                MapleStory Washing Calculator
              </h1>
            </div>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-3 px-2">
          <ThemePresetSelect defaultThemePreset={defaultThemePreset} />
          <ThemeToggle defaultTheme={defaultTheme} />
        </div>
      </div>
    </header>
  );
}
