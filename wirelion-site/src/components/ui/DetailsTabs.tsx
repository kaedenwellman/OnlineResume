"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export type Tab = { id: string; label: string; content: ReactNode };

/** Square-chip tab selector (the reference's SIZE row) with proper tablist semantics. */
export default function DetailsTabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const base = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  if (!tabs.length) return null;

  const focus = (i: number) => {
    const k = (i + tabs.length) % tabs.length;
    setActive(k);
    refs.current[k]?.focus();
  };

  return (
    <div>
      <p className="eyebrow mb-3 !font-bold !text-ink">DETAILS</p>
      <div
        role="tablist"
        aria-label={label}
        className="flex flex-wrap gap-2"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") focus(active + 1);
          else if (e.key === "ArrowLeft") focus(active - 1);
          else if (e.key === "Home") focus(0);
          else if (e.key === "End") focus(tabs.length - 1);
          else return;
          e.preventDefault();
        }}
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${base}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className="chip !min-h-[44px] !px-3 !text-[0.75rem]"
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-5 outline-none"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
