/**
 * Light/dark theme hook.
 * Syncs React state ↔ DOM data-theme ↔ localStorage; follows OS if no preference.
 */

import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  persistTheme,
  resolveInitialTheme,
  type ThemeMode,
} from "../utils/theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => resolveInitialTheme());

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  // If the user never picked a theme, track system changes live.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (window.localStorage.getItem("raio-theme")) {
          return;
        }
      } catch {
        // Storage unavailable — still follow system.
      }
      setThemeState(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggleTheme, isDark: theme === "dark" };
}
