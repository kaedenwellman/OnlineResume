"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import Lightbox from "./Lightbox";
import ComingSoonArt from "./ComingSoonArt";

type Img = { src: string; alt: string };

/** Project image carousel: arrow buttons, swipe, ←/→ keys, index, lightbox. */
export default function Carousel({ images, title, placeholder }: { images: Img[]; title: string; placeholder: { category: string; pumpkin: boolean } }) {
  const [i, setI] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const n = images.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  if (!n) {
    return (
      <div className="brutal relative aspect-square overflow-hidden bg-black">
        <ComingSoonArt category={placeholder.category} pumpkin={placeholder.pumpkin} />
      </div>
    );
  }

  const img = images[i]!;
  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${title} photos`}
      className="outline-none"
      tabIndex={n > 1 ? 0 : -1}
      onKeyDown={(e) => {
        if (n < 2) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        }
      }}
    >
      <div
        className="brutal relative aspect-square overflow-hidden bg-black"
        onTouchStart={(e) => {
          const t = e.touches[0]!;
          touch.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!start || n < 2) return;
          const t = e.changedTouches[0]!;
          const dx = t.clientX - start.x;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(t.clientY - start.y)) go(dx < 0 ? 1 : -1);
        }}
      >
        <button
          type="button"
          className="absolute inset-0 cursor-zoom-in"
          onClick={() => setLightbox(i)}
          aria-label={`Open image ${i + 1} of ${n} full screen: ${img.alt}`}
        >
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            sizes="(min-width:1024px) 45vw, 100vw"
            className="object-contain"
          />
        </button>
        <span className="pointer-events-none absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center border-2 border-ink bg-elevated" aria-hidden="true">
          <Maximize2 size={16} />
        </span>
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-elevated"
            >
              <ArrowLeft aria-hidden="true" size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-elevated"
            >
              <ArrowRight aria-hidden="true" size={20} />
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex gap-1" role="group" aria-label="Choose image">
            {images.map((im, k) => (
              <button
                key={im.src}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Show image ${k + 1}`}
                aria-current={k === i || undefined}
                className="flex h-11 w-11 items-center justify-center"
              >
                <span className={`block h-3.5 w-3.5 border-2 border-ink ${k === i ? "bg-ink" : "bg-transparent"}`} />
              </button>
            ))}
          </div>
          <span className="text-sm font-bold tracking-[0.1em]" aria-live="polite">
            {i + 1} / {n}
          </span>
        </div>
      )}
      <Lightbox items={images} index={lightbox} onIndex={(k) => { setLightbox(k); setI(k); }} onClose={() => setLightbox(null)} />
    </section>
  );
}
