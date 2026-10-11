"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Wordmark, { type WordmarkParts } from "./Wordmark";
import HeaderMark from "./HeaderMark";
import ThemeToggle from "./ThemeToggle";
import { NAV } from "./nav";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function Header({ wordmark }: { wordmark: WordmarkParts }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useFocusTrap(menuRef, open, () => {
    setOpen(false);
    toggleRef.current?.focus();
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-bg/95 backdrop-blur-[2px] xl:top-3">
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <Link href="/" aria-label="Wire Lion home" className="-m-1 p-1">
          <Wordmark parts={wordmark} mark={<HeaderMark />} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`inline-flex min-h-[44px] items-center px-3 text-sm font-bold tracking-[0.08em] underline-offset-[6px] hover:underline ${
                isActive(n.href) ? "underline decoration-2" : ""
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/join" className="btn btn-primary press ml-3 min-h-[44px] py-2" aria-current={isActive("/join") ? "page" : undefined}>
            JOIN
          </Link>
          <ThemeToggle className="ml-4" />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/join" className="btn btn-primary press min-h-[44px] px-4 py-2">
            JOIN
          </Link>
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-[48px] w-[48px] items-center justify-center border-2 border-ink bg-elevated"
          >
            <Menu aria-hidden="true" size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg lg:hidden"
        >
          <div className="flex h-[68px] items-center justify-between border-b-2 border-ink px-4 sm:px-6">
            <Wordmark parts={wordmark} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              className="inline-flex h-[48px] w-[48px] items-center justify-center border-2 border-ink bg-elevated"
            >
              <X aria-hidden="true" size={22} />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col gap-3 p-4 sm:p-6">
            {[{ href: "/", label: "HOME" }, ...NAV, { href: "/join", label: "JOIN" }].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={(n.href === "/" ? pathname === "/" : isActive(n.href)) ? "page" : undefined}
                className={`press flex min-h-[64px] items-center justify-between border-2 border-ink px-5 text-[1.6rem] font-extrabold tracking-tight ${
                  n.href === "/join" ? "bg-ink text-bg" : "bg-elevated"
                }`}
              >
                {n.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between border-t-2 border-ink p-4 sm:p-6">
            <span className="eyebrow">THEME</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
