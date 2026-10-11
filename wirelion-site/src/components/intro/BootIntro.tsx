"use client";

/**
 * Boot intro (HANDOFF §5): black screen → Tron-blue wires race in from the
 * edges → they trace the lion outline → the real logo ignites → it flies into
 * the header mark while a scanline wipe reveals the site.
 *
 * The overlay markup is server-rendered so the site never flashes before the
 * intro. An inline <head> script (see layout.tsx) sets one of these classes on
 * <html> before first paint:
 *   no-intro      already seen this session → CSS hides the overlay
 *   intro-on      play it (plus intro-rm for prefers-reduced-motion)
 *   intro-debug   /?introDebug=1: outline over the logo at 60%, paused
 *
 * The animation is one requestAnimationFrame timeline that writes styles
 * directly (no React re-renders); Motion handles the FLIP flight.
 */
import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { OUTLINE, PADS, toD, type Pt } from "./lionOutline";
import { WIRES } from "./wires";

const SVG_NS = "http://www.w3.org/2000/svg";
const BOOT_TEXT = "WIRE LION // SYS BOOT … OK";

// Timeline, in seconds (total ≈ 3.6s).
const T = {
  wiresIn: 0.35,
  wireDur: 0.95,
  traceDur: 0.55,
  ignite: 2.3,
  flight: 2.7,
  flightDur: 0.85,
  wipeStart: 2.75,
  wipeDur: 0.7,
  reveal: 3.2,
  end: 3.6,
};
// Where the eye-lightning flash peaks inside logo-pulse (3.36s loop).
const PULSE_FLASH = 1.7;
// lion-head.png is the 360×362 crop at x=76, y=0 of the 512×512 logo.
const HEAD = { x: 76, w: 360, h: 362 };

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const easeOut = (p: number) => 1 - (1 - p) ** 3;
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent: Element) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  parent.appendChild(node);
  return node;
}

type Stroke = { core: SVGPathElement; glow: SVGPathElement; len: number; start: number; dur: number };

export default function BootIntro() {
  const [gone, setGone] = useState(false);
  const [debug, setDebug] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro-on")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the decision is made before hydration by the head script
      setGone(true);
      return;
    }
    const mode: "full" | "reduced" | "debug" = html.classList.contains("intro-debug")
      ? "debug"
      : html.classList.contains("intro-rm")
        ? "reduced"
        : "full";
    if (mode === "debug") setDebug(true);
    else {
      try {
        sessionStorage.setItem("wl-intro-seen", "1");
      } catch {
        /* storage blocked: the intro simply plays again next time */
      }
    }

    const root = rootRef.current!;
    const svg = svgRef.current!;
    const logo = logoRef.current!;
    const video = videoRef.current!;
    const head = headRef.current!;
    // The logo is painted through <canvas> (fed by a hidden <video>) so the
    // decorative intro never becomes the page's Largest Contentful Paint.
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    const paintLogo = () => {
      if (ctx && video.readyState >= 2) ctx.drawImage(video, 0, 0, 512, 512);
    };
    const headImg = new Image();
    headImg.onload = () => head.getContext("2d")?.drawImage(headImg, 0, 0);
    headImg.src = "/brand/lion-head.png";

    /* ----------------------------------------------------------- layout */
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const L = Math.round(Math.min(vw * 0.8, vh * 0.56, 460));
    const ox = Math.round((vw - L) / 2);
    const oy = Math.round(Math.max(24, (vh - L) / 2 - vh * 0.04));
    const k = L / 512;
    const map = ([x, y]: Pt): Pt => [ox + x * k, oy + y * k];
    Object.assign(logo.style, { left: `${ox}px`, top: `${oy}px`, width: `${L}px`, height: `${L}px` });
    Object.assign(head.style, {
      left: `${HEAD.x * k}px`,
      top: "0px",
      width: `${HEAD.w * k}px`,
      height: `${HEAD.h * k}px`,
    });
    svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);

    // Pick a source the browser can play (Safari: mp4).
    const webm = video.canPlayType('video/webm; codecs="vp9"') || video.canPlayType("video/webm");
    video.muted = true;
    video.src = webm ? "/brand/logo-pulse.webm" : "/brand/logo-pulse.mp4";
    video.load();

    /* ------------------------------------------------------- build scene */
    const glowG = svg.querySelector<SVGGElement>("[data-glow]")!;
    const coreG = svg.querySelector<SVGGElement>("[data-core]")!;
    const wireGlowG = svg.querySelector<SVGGElement>("[data-wire-glow]")!;
    const wireCoreG = svg.querySelector<SVGGElement>("[data-wire-core]")!;
    const sparkG = svg.querySelector<SVGGElement>("[data-sparks]")!;
    const padG = svg.querySelector<SVGGElement>("[data-pads]")!;
    const blur = svg.querySelector<SVGFEGaussianBlurElement>("#wl-blur feGaussianBlur")!;

    const wires: (Stroke & { spark: SVGGElement; pad: SVGCircleElement })[] = WIRES.map((w) => {
      const first = map(w.points[0]!);
      const edge: Pt =
        w.from === "left"
          ? [-8, first[1]]
          : w.from === "right"
            ? [vw + 8, first[1]]
            : w.from === "top"
              ? [first[0], -8]
              : [first[0], vh + 8];
      const pts = [edge, ...w.points.map(map)];
      const d = toD([pts]);
      const glow = el("path", { d }, wireGlowG);
      const core = el("path", { d }, wireCoreG);
      const len = core.getTotalLength();
      for (const p of [glow, core]) {
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      }
      const spark = el("g", { opacity: 0 }, sparkG);
      el("circle", { r: 6, fill: "#2EA8FF", opacity: 0.55, filter: "url(#wl-spark)" }, spark);
      el("circle", { r: 2, fill: "#FFFFFF" }, spark);
      const end = pts[pts.length - 1]!;
      const pad = el("circle", { cx: end[0], cy: end[1], r: 3.5, fill: "#000", stroke: "#CFF0FF", "stroke-width": 1.5 }, padG);
      pad.style.transformOrigin = `${end[0]}px ${end[1]}px`;
      pad.style.transform = "scale(0)";
      return { core, glow, len, start: T.wiresIn + w.delay, dur: T.wireDur, spark, pad };
    });

    // Each outline path draws outward from the nearest wire landing point.
    const landings = WIRES.map((w) => ({ p: w.points[w.points.length - 1]!, t: T.wiresIn + w.delay + T.wireDur }));
    const latestStart = T.ignite - T.traceDur;
    const traces: Stroke[] = [];
    const padTimes: number[] = PADS.map(() => latestStart);

    const nearest = (pt: Pt) => {
      let best = { d: Infinity, t: latestStart };
      for (const l of landings) {
        const d = Math.hypot(pt[0] - l.p[0], pt[1] - l.p[1]);
        if (d < best.d) best = { d, t: l.t };
      }
      return best;
    };

    for (const path of OUTLINE) {
      let pieces: Pt[][] = path.lines;
      let startAt = latestStart;
      if (path.lines.length === 1) {
        const line = path.lines[0]!;
        let bi = 0;
        let best = { d: Infinity, t: latestStart };
        line.forEach((p, i) => {
          const n = nearest(p);
          if (n.d < best.d) {
            best = n;
            bi = i;
          }
        });
        startAt = best.t + (best.d / 512) * 0.9;
        if (bi === line.length - 1) pieces = [[...line].reverse()];
        else if (bi > 0) pieces = [line.slice(0, bi + 1).reverse(), line.slice(bi)];
      } else {
        startAt = Math.min(...path.lines.flat().map((p) => { const n = nearest(p); return n.t + (n.d / 512) * 0.9; }));
      }
      startAt = Math.min(startAt, latestStart);
      for (const piece of pieces) {
        const d = toD([piece], map);
        const glow = el("path", { d }, glowG);
        const core = el("path", { d }, coreG);
        const len = core.getTotalLength();
        for (const p of [glow, core]) {
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
        }
        traces.push({ core, glow, len, start: startAt, dur: T.traceDur });
      }
    }
    const outlinePads = PADS.map((p, i) => {
      const [cx, cy] = map([p.x, p.y]);
      padTimes[i] = Math.min(nearest([p.x, p.y]).t + 0.25, latestStart + 0.3);
      const c = el("circle", { cx, cy, r: Math.max(2, p.r * k), fill: "none", stroke: "#CFF0FF", "stroke-width": 1.5 }, coreG);
      c.style.transformOrigin = `${cx}px ${cy}px`;
      c.style.transform = "scale(0)";
      return c;
    });

    /* ------------------------------------------------------- lifecycle */
    let raf = 0;
    let done = false;
    let flight: ReturnType<typeof animate> | null = null;
    let fade: { stop: () => void } | null = null;
    const timers: number[] = [];

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      flight?.stop();
      html.classList.remove("intro-on", "intro-rm", "intro-debug");
      html.classList.add("no-intro");
      const active = document.activeElement;
      if (!active || active === document.body || root.contains(active)) {
        document.getElementById("main")?.focus({ preventScroll: true });
      }
      setGone(true);
    };

    const skip = () => {
      if (done || fade) return;
      cancelAnimationFrame(raf);
      flight?.stop();
      html.classList.remove("intro-on");
      fade = animate(root, { opacity: 0 }, { duration: 0.2, ease: "easeOut" });
      timers.push(window.setTimeout(finish, 220));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    root.addEventListener("pointerdown", skip);
    window.addEventListener("resize", skip);
    skipRef.current?.focus({ preventScroll: true });

    if (mode === "debug") {
      // Static: everything drawn, wires dimmed, outline at 60% over the logo.
      [...wires, ...traces].forEach((s) => {
        s.core.style.strokeDashoffset = "0";
        s.glow.style.strokeDashoffset = "0";
      });
      wires.forEach((w) => (w.pad.style.transform = "scale(1)"));
      outlinePads.forEach((c) => (c.style.transform = "scale(1)"));
      svg.querySelector<SVGGElement>("[data-wires]")!.style.opacity = "0.35";
      svg.querySelector<SVGGElement>("[data-outline]")!.style.opacity = "0.6";
      svg.style.zIndex = "1"; // outline on top of the logo
      // A contrasting stroke so misalignment is easy to spot against the glow.
      coreG.style.stroke = "#FF3EC8";
      glowG.style.display = "none";
      if (cursorRef.current) cursorRef.current.style.display = "none";
      return () => {
        window.removeEventListener("keydown", onKey);
        root.removeEventListener("pointerdown", skip);
        window.removeEventListener("resize", skip);
      };
    }

    if (mode === "reduced") {
      // No wires, no flight: the static logo for 400ms, then fade to the site.
      svg.style.display = "none";
      if (cursorRef.current) cursorRef.current.style.display = "none";
      canvas.style.opacity = "1";
      video.addEventListener("loadeddata", paintLogo);
      paintLogo();
      timers.push(
        window.setTimeout(() => {
          html.classList.remove("intro-on");
          root.style.transition = "opacity 300ms linear";
          root.style.opacity = "0";
          timers.push(window.setTimeout(finish, 320));
        }, 400),
      );
      return () => {
        window.removeEventListener("keydown", onKey);
        root.removeEventListener("pointerdown", skip);
        window.removeEventListener("resize", skip);
        timers.forEach(clearTimeout);
      };
    }

    /* ---------------------------------------------------------- frames */
    const wiresG = svg.querySelector<SVGGElement>("[data-wires]")!;
    const outlineG = svg.querySelector<SVGGElement>("[data-outline]")!;
    const bg = bgRef.current!;
    const line = lineRef.current!;
    const text = textRef.current!;
    const grid = gridRef.current!;
    const cursor = cursorRef.current!;
    const skipBtn = skipRef.current!;
    let videoStarted = false;
    let flightStarted = false;
    let flightAt = T.flight;
    let flightDone = false;
    let revealed = false;
    let t0 = 0;

    const frame = (now: number) => {
      if (!t0) t0 = now;
      const t = (now - t0) / 1000;

      // Power on.
      cursor.style.opacity = t < T.wiresIn ? "" : "0";
      text.textContent = BOOT_TEXT.slice(0, Math.round(span(t, 0.05, 0.55) * BOOT_TEXT.length));
      text.style.opacity = String(1 - span(t, T.flight, T.flight + 0.3));
      grid.style.opacity = String(0.08 * span(t, 0, T.wiresIn) * (1 - span(t, T.ignite, T.flight + 0.4)));

      // Wires in, with a spark riding each tip and a pad popping on landing.
      for (const w of wires) {
        const p = span(t, w.start, w.start + w.dur);
        const e = easeOut(p);
        const off = `${w.len * (1 - e)}`;
        w.core.style.strokeDashoffset = off;
        w.glow.style.strokeDashoffset = off;
        if (p > 0 && p < 1) {
          const pt = w.core.getPointAtLength(w.len * e);
          w.spark.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          w.spark.setAttribute("opacity", "1");
        } else w.spark.setAttribute("opacity", "0");
        const s = span(t, w.start + w.dur, w.start + w.dur + 0.18);
        w.pad.style.transform = `scale(${s < 1 ? s * 1.35 : 1})`;
      }

      // Lion trace.
      for (const s of traces) {
        const off = `${s.len * (1 - easeOut(span(t, s.start, s.start + s.dur)))}`;
        s.core.style.strokeDashoffset = off;
        s.glow.style.strokeDashoffset = off;
      }
      outlinePads.forEach((c, i) => {
        const s = span(t, padTimes[i]!, padTimes[i]! + 0.18);
        c.style.transform = `scale(${s < 1 ? s * 1.3 : 1})`;
      });

      // Ignite: flash the outline, then cross-fade to the pulsing logo.
      const flash = span(t, T.ignite, T.ignite + 0.12) * (1 - span(t, T.ignite + 0.12, T.ignite + 0.4));
      glowG.style.opacity = String(0.55 + 0.45 * flash);
      blur.setAttribute("stdDeviation", String(3.5 + 6 * flash));
      coreG.style.stroke = flash > 0.05 ? "#FFFFFF" : "";
      outlineG.style.opacity = String(1 - span(t, T.ignite + 0.15, T.flight + 0.05));
      wiresG.style.opacity = String(
        t < T.ignite ? 1 : t < T.ignite + 0.2 ? 1 - 0.75 * span(t, T.ignite, T.ignite + 0.2) : 0.25 * (1 - span(t, T.ignite + 0.2, T.flight + 0.2)),
      );
      if (!videoStarted && t >= T.ignite - 0.45) {
        videoStarted = true;
        try {
          video.currentTime = Math.max(0, PULSE_FLASH - 0.6);
        } catch {
          /* not seekable yet: plays from the start */
        }
        void video.play().catch(() => {});
      }
      const logoIn = span(t, T.ignite + 0.05, T.ignite + 0.3);
      head.style.opacity = String(span(t, T.flight, T.flight + 0.35));
      const logoOpacity = logoIn * (1 - span(t, T.flight + 0.25, T.flight + 0.6));
      canvas.style.opacity = String(logoOpacity);
      if (logoOpacity > 0) paintLogo();

      // Float into the header mark (FLIP).
      if (!flightStarted && t >= T.flight) {
        flightStarted = true;
        flightAt = t;
        const target = document.querySelector<HTMLElement>("[data-lion-mark]")?.getBoundingClientRect();
        if (target && target.width > 0) {
          const s = target.width / (HEAD.w * k);
          const dx = target.left - ox - HEAD.x * k * s;
          const dy = target.top - oy;
          logo.style.transformOrigin = "0 0";
          flight = animate(logo, { x: dx, y: dy, scale: s }, { duration: T.flightDur, ease: [0.65, 0, 0.3, 1] });
        } else {
          flight = animate(logo, { opacity: 0 }, { duration: 0.4 });
        }
        flight.then(() => (flightDone = true));
      }

      // Scanline wipe, top to bottom.
      const w = easeInOut(span(t, T.wipeStart, T.wipeStart + T.wipeDur));
      bg.style.clipPath = `inset(${(w * 100).toFixed(2)}% 0 0 0)`;
      grid.style.clipPath = bg.style.clipPath;
      line.style.transform = `translateY(${(w * vh).toFixed(1)}px)`;
      line.style.opacity = w > 0 && w < 1 ? "1" : "0";
      skipBtn.style.opacity = String(1 - span(t, T.wipeStart, T.wipeStart + 0.3));

      if (!revealed && t >= T.reveal) {
        revealed = true;
        html.classList.add("intro-reveal");
      }
      // Reveal the header mark only once the flying logo has actually landed.
      // (Time-based fallback in case the animation promise never settles.)
      const landed = flightDone || (flightStarted && t >= flightAt + T.flightDur + 0.3);
      if (landed) html.classList.remove("intro-on");
      if (landed && t >= T.end) {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      flight?.stop();
      window.removeEventListener("keydown", onKey);
      root.removeEventListener("pointerdown", skip);
      window.removeEventListener("resize", skip);
    };
  }, []);

  if (gone) return null;

  return (
    <div id="boot" ref={rootRef} className="select-none">
      <div aria-hidden="true" className="absolute inset-0">
        <div ref={bgRef} className="boot-bg" />
        <div ref={gridRef} className="boot-grid" />
        <div ref={cursorRef} className="boot-cursor absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 bg-[#2EA8FF] shadow-[0_0_12px_#2EA8FF]" />

        <svg ref={svgRef} className="absolute inset-0 h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <filter id="wl-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
            <filter id="wl-spark" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <g style={{ mixBlendMode: "screen" }}>
            <g data-wires="">
              <g data-wire-glow="" stroke="#2EA8FF" strokeWidth="6" opacity="0.55" filter="url(#wl-blur)" />
              <g data-wire-core="" stroke="#CFF0FF" strokeWidth="1.75" />
              <g data-pads="" />
            </g>
            <g data-outline="">
              <g data-glow="" stroke="#2EA8FF" strokeWidth="6" opacity="0.55" filter="url(#wl-blur)" />
              <g data-core="" stroke="#CFF0FF" strokeWidth="1.75" />
            </g>
            <g data-sparks="" />
          </g>
        </svg>

        <div ref={logoRef} className="absolute left-1/2 top-1/3 h-0 w-0">
          {debug && (
            // eslint-disable-next-line @next/next/no-img-element -- debug-only overlay, must be the exact 512px source
            <img src="/brand/logo-full.png" alt="" className="absolute inset-0 h-full w-full" />
          )}
          <video ref={videoRef} muted playsInline loop preload="auto" className="absolute left-0 top-0 h-[2px] w-[2px] opacity-0" />
          <canvas ref={canvasRef} width={512} height={512} className="absolute inset-0 h-full w-full opacity-0" />
          <canvas ref={headRef} width={HEAD.w} height={HEAD.h} className="absolute max-w-none opacity-0" />
        </div>

        <div
          ref={lineRef}
          className="absolute left-0 right-0 top-0 h-[2px] bg-[#CFF0FF] opacity-0 shadow-[0_0_10px_2px_#2EA8FF]"
        />
        <p
          ref={textRef}
          className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.08em] text-[#7FCBFF]"
        >
          {debug ? "INTRO DEBUG: OUTLINE AT 60% OVER THE LOGO. PRESS ESC OR TAP TO CLOSE." : ""}
        </p>
      </div>

      <button
        ref={skipRef}
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="boot-skip boot-skip-in absolute bottom-4 right-4 min-h-[44px] border-2 border-[#2EA8FF] bg-black/70 px-5 text-xs font-bold tracking-[0.14em] text-[#CFF0FF]"
      >
        SKIP ▸▸<span className="sr-only"> intro</span>
      </button>
    </div>
  );
}
