"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

/**
 * Bordered 16:9 player. Native controls, no autoplay, plays inline on iOS.
 * Only the poster loads up front (preload="metadata").
 */
export default function VideoPlayer({
  src,
  poster,
  title,
  captions,
}: {
  src: string;
  poster: string;
  title: string;
  captions?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  return (
    <div className="brutal relative aspect-video overflow-hidden bg-black">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full"
        poster={poster}
        preload="metadata"
        controls={started}
        playsInline
        onPlay={() => setStarted(true)}
        aria-label={title}
      >
        <source src={src} type="video/mp4" />
        {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
      </video>
      {!started && (
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            void ref.current?.play();
          }}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={`Play video: ${title}`}
        >
          <span className="press inline-flex h-20 w-20 items-center justify-center border-2 border-[#E6EEF7] bg-[#141414] text-[#E6EEF7] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 sm:h-24 sm:w-24">
            <Play aria-hidden="true" size={36} fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}
