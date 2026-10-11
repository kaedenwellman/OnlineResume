"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "./Lightbox";
import type { GalleryItem } from "@/lib/content";

const LABEL_BG = ["bg-mint", "bg-peach", "bg-lav", "bg-butter"];
const CORNER = ["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"];

/** Brutal photo grid; each photo opens the lightbox with its caption. */
export default function Gallery({ items }: { items: (GalleryItem & { width: number; height: number })[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {items.map((g, i) => (
          <li key={g.src} className="mb-6 break-inside-avoid">
            <figure className="brutal bg-elevated">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="relative block w-full overflow-hidden"
                aria-label={`Open photo: ${g.alt}`}
              >
                <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(min-width:1024px) 30vw, (min-width:640px) 46vw, 92vw" className="h-auto w-full transition-transform duration-300 hover:scale-[1.03]" />
                <span className={`tag absolute ${CORNER[i % 4]} ${LABEL_BG[i % 4]}`}>{g.label}</span>
              </button>
              {g.caption && <figcaption className="border-t-2 border-ink p-3 text-sm leading-relaxed text-muted">{g.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox
        items={items.map((g) => ({ src: g.src, alt: g.alt, caption: g.caption }))}
        index={open}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
