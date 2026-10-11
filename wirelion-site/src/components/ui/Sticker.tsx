/** Butter starburst sticker ("40+ MEMBERS"), rotated −12° with a slow wobble. */
export default function Sticker({ line1, line2, className = "" }: { line1: string; line2: string; className?: string }) {
  const points = 18;
  const pts = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? 50 : 39;
    const a = (Math.PI * i) / points - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

  return (
    <div className={`sticker pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="-2 -2 104 104" className="h-full w-full overflow-visible">
        <polygon points={pts} fill="var(--ink)" transform="translate(3 3)" />
        <polygon points={pts} fill="var(--accent-butter)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="miter" />
        <text x="50" y="47" textAnchor="middle" fontWeight="800" fontSize="17" fill="var(--ink)" fontFamily="var(--font-mono)">
          {line1}
        </text>
        <text x="50" y="62" textAnchor="middle" fontWeight="700" fontSize="9.5" letterSpacing="1" fill="var(--ink)" fontFamily="var(--font-mono)">
          {line2}
        </text>
      </svg>
    </div>
  );
}
