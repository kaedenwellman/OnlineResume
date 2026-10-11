/**
 * Designed placeholder for projects without photos (HANDOFF §6.4): dim Tron
 * grid, dashed inset border, COMING SOON + category. Jack-o'-lantern projects
 * get a circuit-line pumpkin with slowly blinking LED eyes.
 */
export default function ComingSoonArt({ category, pumpkin = false }: { category: string; pumpkin?: boolean }) {
  return (
    <div className="tron-grid absolute inset-0 flex items-center justify-center text-[#cff0ff]" role="img" aria-label={`Coming soon: ${category.toLowerCase()} project artwork`}>
      <div className="absolute inset-3 border-2 border-dashed border-[#2ea8ff]/60" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center" aria-hidden="true">
        {pumpkin && <Pumpkin />}
        <span className="text-lg font-extrabold tracking-[0.14em] sm:text-xl">COMING SOON</span>
        <span className="text-[0.72rem] font-medium tracking-[0.14em] text-[#9AA7B6]">{category}</span>
      </div>
    </div>
  );
}

function Pumpkin() {
  return (
    <svg viewBox="0 0 120 110" className="h-auto w-[44%] max-w-[150px] overflow-visible" fill="none" strokeLinecap="square" strokeLinejoin="miter">
      <g stroke="#2EA8FF" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 4px rgba(46,168,255,.8))" }}>
        {/* stem */}
        <path d="M60 22 V10 L68 4" />
        {/* outline, built from straight PCB-style segments */}
        <path d="M60 22 L40 20 L20 30 L8 50 L8 70 L18 90 L38 102 L60 104 L82 102 L102 90 L112 70 L112 50 L100 30 L80 20 Z" />
        {/* ribs as traces */}
        <path d="M44 21 L32 40 L30 70 L40 100" opacity=".55" />
        <path d="M76 21 L88 40 L90 70 L80 100" opacity=".55" />
        {/* mouth trace */}
        <path d="M34 76 L44 84 L52 78 L60 86 L68 78 L76 84 L86 76" />
      </g>
      <g fill="#0E1218" stroke="#CFF0FF" strokeWidth="1.5">
        <circle cx="34" cy="76" r="2.5" />
        <circle cx="86" cy="76" r="2.5" />
      </g>
      {/* LED eyes */}
      <g className="led-blink">
        <circle cx="44" cy="56" r="7" fill="#2EA8FF" opacity=".35" />
        <circle cx="76" cy="56" r="7" fill="#2EA8FF" opacity=".35" />
        <circle cx="44" cy="56" r="3.5" fill="#E6F7FF" />
        <circle cx="76" cy="56" r="3.5" fill="#E6F7FF" />
      </g>
    </svg>
  );
}
