/**
 * Simplified line-art outline of the lion head, in the 512×512 coordinate
 * space of /public/brand/logo-full.png (and logo-pulse.*), so it sits exactly
 * on top of the logo. Hand-authored from the logo and checked with
 * `/?introDebug=1`. /public/brand/lion-outline.svg is generated from this
 * file by `npm run outline`.
 *
 * Most features are authored for the left half and mirrored across x = 256.
 */
export type Pt = readonly [number, number];
export type OutlinePath = { id: string; lines: Pt[][] };

type Def = { id: string; lines: Pt[][]; mirror?: boolean };

const DEFS: Def[] = [
  // Outer silhouette: ear, top of head to the centre notch.
  { id: "head", lines: [[[132, 122], [132, 84], [140, 62], [156, 52], [204, 88], [212, 78], [232, 64], [248, 64], [256, 76]]] },
  // Inner ear chevron.
  { id: "ear", lines: [[[152, 74], [194, 106], [150, 144]]] },
  // Side of the head down the cheek to the whisker pad.
  { id: "cheek", lines: [[[145, 142], [145, 189], [176, 214], [182, 232], [214, 262]]] },
  // Eye (closed shape, inner corner points down toward the nose).
  { id: "eye", lines: [[[162, 159], [182, 160], [199, 165], [222, 182], [235, 200], [222, 199], [195, 195], [179, 179], [162, 159]]] },
  // Brow circuit trace ending in a pad.
  { id: "brow", lines: [[[232, 80], [222, 88], [222, 117], [199, 140]]] },
  // Side of the nose bridge to the nose tip.
  { id: "nose", lines: [[[229, 205], [229, 239], [256, 249]]] },
  // Muzzle to the mouth.
  { id: "mouth", lines: [[[214, 262], [245, 265], [245, 279], [256, 284]]] },
  // Whiskers.
  { id: "whiskers", lines: [[[200, 267], [222, 267]], [[200, 279], [222, 279]], [[200, 290], [222, 290]]] },
  // Lower jaw and chin.
  { id: "jaw", lines: [[[215, 299], [256, 322]]] },
  { id: "chin", lines: [[[200, 304], [222, 320], [256, 342]]] },
  // Circuit traces below the cheeks, ending in pads.
  { id: "traceA", lines: [[[137, 282], [137, 228], [150, 215]]] },
  { id: "traceB", lines: [[[165, 304], [165, 250]]] },
  // Centre forehead traces (not mirrored).
  { id: "centerL", lines: [[[239, 80], [239, 140], [232, 150], [232, 170]]], mirror: false },
  { id: "centerM", lines: [[[249, 82], [249, 166]]], mirror: false },
  { id: "centerR", lines: [[[265, 82], [265, 185]]], mirror: false },
];

/** Round terminal pads: [x, y, r, mirror?]. */
const PAD_DEFS: [number, number, number, boolean][] = [
  [199, 140, 4, true],
  [137, 282, 5, true],
  [165, 304, 5, true],
  [249, 169, 3.5, false],
  [265, 189, 3.5, false],
  [232, 174, 3.5, false],
];

const mirrorPt = ([x, y]: Pt): Pt => [512 - x, y];

export const OUTLINE: OutlinePath[] = DEFS.flatMap((d) => {
  const base = { id: d.id, lines: d.lines };
  if (d.mirror === false) return [base];
  return [
    { id: `${d.id}-l`, lines: d.lines },
    { id: `${d.id}-r`, lines: d.lines.map((l) => l.map(mirrorPt)) },
  ];
});

export const PADS: { x: number; y: number; r: number }[] = PAD_DEFS.flatMap(([x, y, r, m]) =>
  m ? [{ x, y, r }, { x: 512 - x, y, r }] : [{ x, y, r }],
);

export const toD = (lines: Pt[][], map: (p: Pt) => Pt = (p) => p) =>
  lines
    .map((l) =>
      l
        .map((p, i) => {
          const [x, y] = map(p);
          return `${i ? "L" : "M"}${+x.toFixed(2)} ${+y.toFixed(2)}`;
        })
        .join(""),
    )
    .join("");
