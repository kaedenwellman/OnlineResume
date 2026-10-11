import { ImageResponse } from "next/og";
import { getProject, projects } from "@/lib/content";
import { OG_SIZE, ogFonts, publicImageDataUrl, tronGrid } from "@/lib/og";

export const alt = "Wire Lion project";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  const cover = p?.images[0] ? await publicImageDataUrl(p.images[0].src, 1000) : null;
  return new ImageResponse(
    (
      <div style={{ ...tronGrid, width: "100%", height: "100%", display: "flex", fontFamily: "JetBrains Mono", color: "#E6EEF7" }}>
        <div style={{ width: 630, height: 630, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "4px solid #2EA8FF", background: "#000" }}>
          {cover ? (
            <img src={cover} width={630} height={630} alt="" style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, border: "4px dashed rgba(46,168,255,0.7)", padding: "60px 70px" }}>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: 4 }}>COMING SOON</div>
              <div style={{ fontSize: 26, color: "#9AA7B6", letterSpacing: 4 }}>{p?.category ?? ""}</div>
            </div>
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 52 }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>
            WIRE<span style={{ background: "#2EA8FF", color: "#07090D", padding: "0 6px" }}>LION</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 22, color: "#9AA7B6", letterSpacing: 3 }}>{p?.category ?? "PROJECT"}</div>
            <div style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.02, textTransform: "uppercase" }}>{p?.title ?? "Project"}</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#2EA8FF" }}>{p?.status ?? ""}</div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
