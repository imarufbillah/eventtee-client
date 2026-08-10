"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <Button variant="ghost" size="icon-sm" className="size-8 rounded-full">
        <Sun className="size-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="size-8 rounded-full transition-transform active:scale-95"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="size-4 text-amber-400 transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="size-4 text-slate-700 transition-all duration-300 rotate-0 scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
