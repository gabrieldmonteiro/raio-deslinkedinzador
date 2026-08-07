/**
 * App shell: soft navigation between home / about / how-to-use + theme toggle.
 * No React Router — page is React state so GitHub Pages stays a pure SPA.
 */

import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { About } from "./components/About";
import { HowToUse } from "./components/HowToUse";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { useTheme } from "./hooks/useTheme";
import type { AppPage } from "./utils/constants";

export default function App() {
  const [page, setPage] = useState<AppPage>("home");
  const { isDark, toggleTheme } = useTheme();

  // Reset scroll when switching "pages" in this single-document app.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="app">
      <div className="bg-grid" aria-hidden="true" />

      <Navbar
        page={page}
        onNavigate={setPage}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="shell">
        {page === "home" && (
          <HomePage onOpenHowToUse={() => setPage("how-to-use")} />
        )}
        {page === "about" && <About />}
        {page === "how-to-use" && (
          <HowToUse onGoHome={() => setPage("home")} />
        )}
        <Footer />
      </main>
    </div>
  );
}
