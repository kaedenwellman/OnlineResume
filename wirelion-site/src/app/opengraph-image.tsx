import { ImageResponse } from "next/og";
import { OG_SIZE, ogFonts, publicImageDataUrl, tronGrid } from "@/lib/og";

export const alt = "Wire Lion Engineering Club, UCCS";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const logo = await publicImageDataUrl("/brand/logo-full.png");
  return new ImageResponse(
    (
      <div style={{ ...tronGrid, width: "100%", height: "100%", display: "flex", alignItems: "center", padding: 64, gap: 56, fontFamily: "JetBrains Mono", color: "#E6EEF7" }}>
        {logo && (
          <img src={logo} width={460} height={460} alt="" style={{ border: "4px solid #2EA8FF" }} />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>
            WIRE<span style={{ background: "#2EA8FF", color: "#07090D", padding: "0 10px" }}>LION</span>
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.05 }}>ENGINEERING CLUB</div>
          <div style={{ fontSize: 30, color: "#9AA7B6", letterSpacing: 4 }}>UCCS // ECE</div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
