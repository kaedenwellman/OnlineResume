import type { Metadata } from "next";
import { Plus } from "lucide-react";
import JoinButton from "@/components/sections/JoinButton";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Join",
  description: "Join the Wire Lion Engineering Club through Mountain Lion Connect. No experience needed.",
  alternates: { canonical: "/join" },
};

export default function JoinPage() {
  const { join } = site;
  return (
    <div className="wrap py-12 lg:py-16">
      <p className="eyebrow">MEMBERSHIP</p>
      <h1 className="h-giant mt-1">{join.headline}</h1>
      <p className="body-copy mt-6 max-w-[62ch]">{join.body}</p>

      <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {/* The drawn "wire" connecting the steps: vertical on phones, horizontal on desktop. */}
        <svg aria-hidden="true" className="pointer-events-none absolute left-[38px] top-6 h-[calc(100%-3rem)] w-[4px] overflow-visible md:hidden" preserveAspectRatio="none" viewBox="0 0 4 100">
          <line x1="2" y1="0" x2="2" y2="100" className="join-wire" strokeWidth="3" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
        </svg>
        <svg aria-hidden="true" className="pointer-events-none absolute left-[10%] right-[10%] top-[38px] hidden h-[4px] overflow-visible md:block" preserveAspectRatio="none" viewBox="0 0 100 4">
          <line x1="0" y1="2" x2="100" y2="2" className="join-wire" strokeWidth="3" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
        </svg>
        {join.steps.map((s) => (
          <li key={s.n} className="relative flex gap-5 md:flex-col">
            <span className="brutal relative z-[1] flex h-[78px] w-[78px] shrink-0 items-center justify-center bg-butter text-3xl font-extrabold">
              {s.n}
            </span>
            <div className="brutal flex-1 bg-elevated p-5">
              <h2 className="text-lg font-extrabold leading-tight tracking-tight">{s.title}</h2>
              <p className="body-copy mt-2 !text-[0.95rem]">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14">
        <JoinButton size="xl" className="w-full md:w-auto" />
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">
          Discord, meeting times, and announcements are shared with members through Mountain Lion Connect.
        </p>
      </div>

      <section className="mt-16 border-t-2 border-ink pt-12" aria-labelledby="faq">
        <h2 id="faq" className="h-section">
          FAQ
        </h2>
        <div className="mt-8 grid max-w-[860px] gap-4">
          {join.faq.map((f) => (
            <details key={f.q} className="brutal group bg-elevated">
              <summary className="flex min-h-[60px] items-center justify-between gap-4 px-5 py-4 text-base font-bold">
                {f.q}
                <Plus aria-hidden="true" className="faq-icon shrink-0 transition-transform" size={22} />
              </summary>
              <p className="body-copy border-t-2 border-ink px-5 py-4">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
