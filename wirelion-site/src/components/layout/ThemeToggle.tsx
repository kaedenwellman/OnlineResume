"use client";

import { useSyncExternalStore } from "react";

type Theme = "cream" | "black";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "black" ? "black" : "cream";

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => "cream" as Theme);
}

export function setTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem("wl-theme", t);
  } catch {
    /* storage unavailable: the theme still applies for this page view */
  }
}

/** Two-segment CREAM | BLACK switch. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  return (
    <div role="group" aria-label="Color theme" className={`inline-flex border-2 border-ink ${className}`}>
      {(["cream", "black"] as const).map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          onClick={() => setTheme(t)}
          className={`min-h-[40px] min-w-[44px] px-2.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] transition-colors ${
            theme === t ? "bg-ink text-bg" : "bg-elevated text-ink hover:bg-bg"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
