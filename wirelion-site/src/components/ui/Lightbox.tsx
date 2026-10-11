"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useFocusTrap } from "@/lib/useFocusTrap";

export type LightboxItem = { src: string; alt: string; caption?: string };

/** Full-screen image viewer: focus trap, Esc to close, ←/→ to page. */
export default function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const open = index !== null;
  useFocusTrap(ref, open, onClose);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (index === null || items.length < 2) return;
    function onKey(e: KeyboardEvent) {
      if (index === null) return;
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, items.length, onIndex]);

  if (index === null) return null;
  const item = items[index]!;
  const many = items.length > 1;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${items.length}`}
      className="fixed inset-0 z-[90] flex flex-col bg-black/95 text-white"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between p-3 sm:p-4">
        <span className="text-sm font-bold tracking-[0.1em]">
          {index + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="inline-flex h-12 w-12 items-center justify-center border-2 border-white bg-black"
        >
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="relative mx-3 flex-1 sm:mx-16" onClick={onClose}>
        <Image src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" onClick={(e) => e.stopPropagation()} />
      </div>
      <div className="flex min-h-[72px] items-center justify-between gap-4 p-3 sm:p-4">
        {many ? (
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => onIndex((index - 1 + items.length) % items.length)}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center border-2 border-white bg-black"
          >
            <ArrowLeft aria-hidden="true" />
          </button>
        ) : (
          <span />
        )}
        <p className="text-center text-sm leading-relaxed text-white/85">{item.caption ?? item.alt}</p>
        {many ? (
          <button
            type="button"
            aria-label="Next image"
            onClick={() => onIndex((index + 1) % items.length)}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center border-2 border-white bg-black"
          >
            <ArrowRight aria-hidden="true" />
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
