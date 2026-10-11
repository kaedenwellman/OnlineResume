/**
 * Boot-intro wire routes, in the same 512×512 logo coordinate space as
 * lionOutline.ts. Each wire enters from a screen edge: at runtime a point on
 * that edge is prepended (same y for left/right, same x for top/bottom), so
 * routes stay orthogonal or 45° whatever the viewport size. The last point
 * must land on the lion outline. Left-side wires are mirrored for the right.
 *
 * Tweak `delay` (seconds, 0–0.6) to change the stagger.
 */
import type { Pt } from "./lionOutline";

export type Edge = "left" | "right" | "top" | "bottom";
export type Wire = { from: Edge; points: Pt[]; delay: number };

type Def = Wire & { mirror?: boolean };

const DEFS: Def[] = [
  { from: "left", points: [[110, 100], [132, 122]], delay: 0.05 },
  { from: "left", points: [[121, 213], [145, 189]], delay: 0.3 },
  { from: "left", points: [[146, 175], [162, 159]], delay: 0.45 },
  { from: "bottom", points: [[137, 282]], delay: 0.15 },
  { from: "bottom", points: [[180, 319], [165, 304]], delay: 0.4 },
  { from: "top", points: [[232, 64]], delay: 0.2 },
  { from: "bottom", points: [[256, 342]], delay: 0.55, mirror: false },
  { from: "top", points: [[256, 76]], delay: 0, mirror: false },
];

const flip = (e: Edge): Edge => (e === "left" ? "right" : e === "right" ? "left" : e);

export const WIRES: Wire[] = DEFS.flatMap(({ mirror, ...w }) =>
  mirror === false
    ? [w]
    : [
        w,
        {
          from: flip(w.from),
          points: w.points.map(([x, y]) => [512 - x, y] as const),
          // Offset the mirrored twin a little so the two sides don't move in lockstep.
          delay: Math.min(0.6, w.delay + 0.08),
        },
      ],
);
