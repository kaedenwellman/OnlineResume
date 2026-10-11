/** Client-safe helpers (no JSON or zod imports, so they stay out of client bundles). */
export const STATUS_ICON = {
  COMPLETE: "●",
  "IN PROGRESS": "◐",
  UPCOMING: "○",
} as const;

export const PASTELS = ["mint", "peach", "lav", "butter"] as const;
export type Pastel = (typeof PASTELS)[number];
export const pastelAt = (i: number): Pastel => PASTELS[i % PASTELS.length]!;

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
}
