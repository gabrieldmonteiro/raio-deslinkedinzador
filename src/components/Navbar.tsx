/**
 * Top navigation: brand home shortcut, page links, theme toggle.
 * Soft routing only — buttons call onNavigate with AppPage ids.
 */

import type { AppPage } from "../utils/constants";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  page: AppPage;
  onNavigate: (page: AppPage) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const NAV_ITEMS: Array<{ id: AppPage; label: string }> = [
  { id: "home", label: "Início" },
  { id: "about", label: "Sobre" },
  { id: "how-to-use", label: "Como usar" },
];

export function Navbar({
  page,
  onNavigate,
  isDark,
  onToggleTheme,
}: NavbarProps) {
  return (
    <nav className="navbar" aria-label="Principal">
      <div className="navbar-inner">
        <button
          type="button"
          className="navbar-brand"
          onClick={() => onNavigate("home")}
          aria-label="Raio DesLinkedinzador — Início"
        >
          <span aria-hidden="true">⚡</span>
        </button>

        <div className="navbar-links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`navbar-link ${page === item.id ? "is-active" : ""}`}
              onClick={() => onNavigate(item.id)}
              aria-current={page === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>

        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </nav>
  );
}
