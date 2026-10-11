import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

/** JetBrains Mono for ImageResponse (satori reads .woff, not .woff2). */
export async function ogFonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [regular, bold] = await Promise.all([
    readFile(join(dir, "jetbrains-mono-latin-400-normal.woff")),
    readFile(join(dir, "jetbrains-mono-latin-800-normal.woff")),
  ]);
  return [
    { name: "JetBrains Mono", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: bold, weight: 800 as const, style: "normal" as const },
  ];
}

/** A /public image as a PNG data URL (satori can't decode webp, so convert with sharp). */
export async function publicImageDataUrl(src: string, width?: number): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", src));
    if (src.endsWith(".png") && !width) return `data:image/png;base64,${buf.toString("base64")}`;
    const sharp = (await import("sharp")).default;
    const png = await sharp(buf).resize(width ? { width, withoutEnlargement: true } : undefined).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Shared Tron backdrop for OG cards. */
export const tronGrid = {
  backgroundColor: "#07090D",
  backgroundImage:
    "linear-gradient(rgba(46,168,255,0.16) 2px, transparent 2px), linear-gradient(90deg, rgba(46,168,255,0.16) 2px, transparent 2px)",
  backgroundSize: "48px 48px",
};
