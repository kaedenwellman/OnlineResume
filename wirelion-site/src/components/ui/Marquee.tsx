/** Infinitely scrolling band of focus areas. Pauses on hover; static under reduced motion. */
export default function Marquee({ items }: { items: string[] }) {
  const run = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-4 text-sm font-bold uppercase tracking-[0.12em] sm:text-base">
          {item}
          <span aria-hidden="true" className="pl-8 text-band-muted">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="What we work on" className="marquee overflow-hidden border-y-2 border-ink bg-band py-4 text-band-ink">
      <div className="marquee-track">
        {run(false)}
        {run(true)}
        {run(true)}
        {run(true)}
      </div>
    </section>
  );
}
