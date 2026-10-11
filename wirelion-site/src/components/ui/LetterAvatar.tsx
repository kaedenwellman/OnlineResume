import { initials } from "@/lib/shared";

const BG = ["bg-mint", "bg-lav", "bg-peach", "bg-butter"];

export default function LetterAvatar({ name, index }: { name: string; index: number }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${BG[index % BG.length]}`} aria-hidden="true">
      <span className="text-[clamp(3.5rem,12vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em]">{initials(name)}</span>
    </div>
  );
}
