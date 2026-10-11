import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex flex-col items-start gap-8 py-16 lg:py-24">
      <svg viewBox="0 0 420 120" className="h-auto w-full max-w-[520px]" fill="none" aria-hidden="true">
        <g stroke="var(--ink)" strokeWidth="4" strokeLinecap="square">
          <path d="M0 60 H120 L150 30 H180" />
          <path d="M240 90 H270 L300 60 H420" />
          {/* frayed ends */}
          <path d="M180 30 L192 22 M180 30 L194 32 M180 30 L190 40" strokeWidth="2.5" />
          <path d="M240 90 L228 82 M240 90 L226 92 M240 90 L230 100" strokeWidth="2.5" />
        </g>
        <circle cx="0" cy="60" r="7" fill="var(--accent-butter)" stroke="var(--ink)" strokeWidth="3" />
        <circle cx="420" cy="60" r="7" fill="var(--accent-butter)" stroke="var(--ink)" strokeWidth="3" />
        <g fill="var(--accent-blue)">
          <path d="M204 48 l8 -10 l-2 9 h8 l-10 13 l2 -9 z" />
        </g>
      </svg>
      <div>
        <p className="eyebrow">ERROR</p>
        <h1 className="h-giant mt-1">404: OPEN CIRCUIT</h1>
        <p className="body-copy mt-5 max-w-[52ch]">This trace doesn&apos;t connect to anything. The page may have moved, or the link has a typo.</p>
      </div>
      <Link href="/" className="btn btn-primary press">
        BACK TO HOME
      </Link>
    </div>
  );
}
