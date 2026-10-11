import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { imageSize } from "image-size";

/** Intrinsic size of an image in /public, read at build time (prevents layout shift). */
export function sizeOf(src: string): { width: number; height: number } {
  try {
    const { width, height } = imageSize(readFileSync(join(process.cwd(), "public", src)));
    if (width && height) return { width, height };
  } catch {
    /* fall through */
  }
  throw new Error(`Image not found or unreadable: /public${src} (check the path in /content)`);
}
