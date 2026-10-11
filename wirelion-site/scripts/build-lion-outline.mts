// Writes /public/brand/lion-outline.svg from src/components/intro/lionOutline.ts.
// Run with: npm run outline
import { writeFileSync } from "node:fs";
import { OUTLINE, PADS, toD } from "../src/components/intro/lionOutline.ts";

const paths = OUTLINE.map((p) => `  <path id="${p.id}" d="${toD(p.lines)}"/>`).join("\n");
const pads = PADS.map((p) => `  <circle cx="${p.x}" cy="${p.y}" r="${p.r}"/>`).join("\n");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" stroke="#CFF0FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
${paths}
${pads}
</svg>
`;
writeFileSync(new URL("../public/brand/lion-outline.svg", import.meta.url), svg);
console.log(`lion-outline.svg: ${OUTLINE.length} paths, ${PADS.length} pads`);
