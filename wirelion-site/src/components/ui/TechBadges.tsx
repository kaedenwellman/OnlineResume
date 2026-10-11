import { pastelAt } from "@/lib/shared";

const BG = { mint: "bg-mint", peach: "bg-peach", lav: "bg-lav", butter: "bg-butter" } as const;

/** The project's tech[] as pastel bordered boxes (mint → peach → lavender → butter). */
export default function TechBadges({ tech, label = "Technologies" }: { tech: string[]; label?: string }) {
  if (!tech.length) return null;
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tech.map((t, i) => (
        <li key={t} className={`tag min-h-[36px] px-3 ${BG[pastelAt(i)]}`}>
          {t}
        </li>
      ))}
    </ul>
  );
}
