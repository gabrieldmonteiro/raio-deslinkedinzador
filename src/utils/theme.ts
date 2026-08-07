/**
 * Theme persistence and DOM application.
 * Only preference stored in localStorage — never user post text.
 */

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "raio-theme";

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredTheme(): ThemeMode | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark") {
      return value;
    }
  } catch {
    // Private mode / blocked storage — fall through to system theme.
  }
  return null;
}

function writeStoredTheme(theme: ThemeMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore write failures; UI still works for the session.
  }
}

/** Apply theme via data-theme on <html> (CSS variables in index.css). */
export function applyTheme(theme: ThemeMode): void {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}

/** Prefer stored choice; otherwise follow OS prefers-color-scheme. */
export function resolveInitialTheme(): ThemeMode {
  return readStoredTheme() ?? getSystemTheme();
}

export function persistTheme(theme: ThemeMode): void {
  writeStoredTheme(theme);
}
