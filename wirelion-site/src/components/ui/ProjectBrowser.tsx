"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Project, ProjectStatus } from "@/lib/content";

type Filter = "ALL" | ProjectStatus;

const toParam = (f: Filter) => f.toLowerCase().replace(/\s+/g, "-");

/**
 * Filter chips + search over the project grid. The filter and query sync to
 * the URL (`?status=complete&q=arduino`) so a filtered view is shareable.
 * Rendered fully on the server (unfiltered) so the static HTML has every card.
 */
export default function ProjectBrowser({
  projects,
  limit,
  heading,
  headingLevel = "h2",
  syncUrl = true,
  viewAllHref,
}: {
  projects: Project[];
  limit?: number;
  heading: string;
  headingLevel?: "h1" | "h2";
  syncUrl?: boolean;
  viewAllHref?: string;
}) {
  const searchId = useId();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  const filters = useMemo<Filter[]>(() => {
    const list: Filter[] = ["ALL", "COMPLETE"];
    if (projects.some((p) => p.status === "IN PROGRESS")) list.push("IN PROGRESS");
    list.push("UPCOMING");
    return list;
  }, [projects]);

  // Read the initial state from the URL once on mount.
  useEffect(() => {
    if (!syncUrl) return;
    const sp = new URLSearchParams(window.location.search);
    const s = sp.get("status");
    const match = filters.find((f) => toParam(f) === s);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time read of the URL after hydration */
    if (match) setFilter(match);
    const q = sp.get("q");
    if (q) setQuery(q);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [syncUrl, filters]);

  // Write the state back to the URL without adding history entries.
  useEffect(() => {
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    if (filter === "ALL") url.searchParams.delete("status");
    else url.searchParams.set("status", toParam(filter));
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [filter, query, syncUrl]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter !== "ALL" && p.status !== filter) return false;
      if (!q) return true;
      return [p.title, p.category, p.summary, ...p.tech].some((s) => s.toLowerCase().includes(q));
    });
  }, [projects, filter, query]);

  const shown = limit ? results.slice(0, limit) : results;
  const H = headingLevel;

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">BROWSE</p>
          <H className={`${H === "h1" ? "h-giant" : "h-section"} mt-1`}>{heading}</H>
        </div>
        <div className="relative w-full md:max-w-[340px]">
          <label htmlFor={searchId} className="sr-only">
            Search projects
          </label>
          <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH PROJECTS..."
            autoComplete="off"
            className="h-[52px] w-full border-2 border-ink bg-elevated pl-11 pr-4 text-sm tracking-[0.08em] placeholder:text-muted placeholder:opacity-100 focus-visible:outline-[3px]"
          />
        </div>
      </div>

      <div role="group" aria-label="Filter by status" className="mt-8 flex flex-wrap gap-3">
        {filters.map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className="chip press">
            {f}
          </button>
        ))}
      </div>

      <hr className="rule mt-6" />

      <p className="sr-only" aria-live="polite">
        {results.length} {results.length === 1 ? "project" : "projects"} shown
      </p>

      {shown.length ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4 xl:gap-8">
          {shown.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard project={p} priority={i < 2 && headingLevel === "h1"} headingAs={headingLevel === "h1" ? "h2" : "h3"} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="brutal mt-8 bg-elevated p-8 text-center font-bold tracking-[0.06em]">
          NO MATCHES. TRY &quot;ARDUINO&quot; OR &quot;SOLDERING&quot;.
        </div>
      )}

      {viewAllHref && (
        <div className="mt-10">
          <Link href={viewAllHref} className="link-arrow">
            VIEW ALL PROJECTS →
          </Link>
        </div>
      )}
    </div>
  );
}
