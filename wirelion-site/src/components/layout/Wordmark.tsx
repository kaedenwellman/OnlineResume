import Image from "next/image";
import type { ReactNode } from "react";

/** WIRE + LION (highlighted), preceded by the lion-head mark. */
export type WordmarkParts = { plain: string; highlighted: string };

export default function Wordmark({
  parts,
  mark,
  className = "",
}: {
  parts: WordmarkParts;
  mark?: ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark === undefined ? <LionMark /> : mark}
      <span className="text-[1.3rem] font-extrabold leading-none tracking-tight sm:text-[1.45rem]">
        {parts.plain}
        <span className="wordmark-hl">{parts.highlighted}</span>
      </span>
    </span>
  );
}

export function LionMark() {
  return (
    <span className="relative inline-block h-[34px] w-[34px] shrink-0 overflow-hidden border-2 border-ink bg-black">
      <Image src="/brand/lion-head.png" alt="" width={30} height={30} className="block h-[30px] w-[30px] object-cover" />
    </span>
  );
}
