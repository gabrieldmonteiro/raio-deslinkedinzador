import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  persistTheme,
  resolveInitialTheme,
} from "./theme";

describe("theme utils", () => {
  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.colorScheme = "";
    vi.restoreAllMocks();
  });

  it("applies data-theme and color-scheme", () => {
    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("persists and resolves a stored theme", () => {
    persistTheme("dark");
    expect(resolveInitialTheme()).toBe("dark");
  });

  it("falls back to system preference when nothing is stored", () => {
    window.localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) =>
        ({
          matches: query.includes("dark"),
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    });

    expect(resolveInitialTheme()).toBe("dark");
  });
});
