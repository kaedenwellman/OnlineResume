"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "./ThemeToggle";

/*
 * The header lion mark. The boot intro measures `[data-lion-mark]` and flies
 * the logo onto it. In BLACK mode, hovering swaps in a tiny muted crop of the
 * logo-pulse loop for an eye flash (loaded only on first hover).
 */
const SIZE = 30;
// lion-head.png is the 360×362 region at x=76, y=0 of the 512×512 logo.
const SCALE = SIZE / 360;

export default function HeaderMark() {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);
  const [armed, setArmed] = useState(false);
  const pulse = theme === "black" && hovered;

  return (
    <span
      className="relative inline-block h-[34px] w-[34px] shrink-0 overflow-hidden border-2 border-ink bg-black"
      onPointerEnter={() => {
        setHovered(true);
        if (theme === "black") setArmed(true);
      }}
      onPointerLeave={() => setHovered(false)}
    >
      <Image
        src="/brand/lion-head.png"
        alt=""
        width={SIZE}
        height={SIZE}
        priority
        data-lion-mark=""
        className="block h-[30px] w-[30px] object-cover"
      />
      {armed && (
        <video
          aria-hidden="true"
          muted
          loop
          playsInline
          autoPlay
          className="pointer-events-none absolute max-w-none transition-opacity duration-150"
          style={{
            width: 512 * SCALE,
            height: 512 * SCALE,
            left: -76 * SCALE,
            top: 0,
            opacity: pulse ? 1 : 0,
          }}
        >
          <source src="/brand/logo-pulse.webm" type="video/webm" />
          <source src="/brand/logo-pulse.mp4" type="video/mp4" />
        </video>
      )}
    </span>
  );
}
