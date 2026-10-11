import type { Metadata } from "next";
import Gallery from "@/components/ui/Gallery";
import { media, site } from "@/lib/content";
import { sizeOf } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description: site.about.intro.slice(0, 155).replace(/\s+\S*$/, "") + "…",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { about } = site;
  const gallery = media.gallery.map((g) => ({ ...g, ...sizeOf(g.src) }));
  return (
    <>
      <div className="wrap py-12 lg:py-16">
        <p className="eyebrow">WHO WE ARE</p>
        <h1 className="h-giant mt-1">ABOUT THE PRIDE</h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,68ch)_1fr] lg:gap-16">
          <div className="grid max-w-[68ch] gap-6 text-[1.02rem] leading-[1.8] text-muted">
            <p className="text-[1.12rem] text-ink">{about.intro}</p>
            <p>{about.mission}</p>
            <blockquote className="brutal my-2 bg-mint p-6 text-[clamp(1.2rem,2.6vw,1.6rem)] font-extrabold leading-snug tracking-tight text-ink">
              <p>“From logic circuits and Arduino to digital systems and Verilog.”</p>
            </blockquote>
            <p>{about.beyond}</p>
            <p>{about.closing}</p>
          </div>

          <ul className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {about.pillars.map((p, i) => (
              <li key={p.title} className="brutal bg-elevated p-5">
                <p className="text-xs font-bold tracking-[0.14em] text-muted">0{i + 1}</p>
                <h2 className="mt-1 text-lg font-extrabold tracking-tight">{p.title}</h2>
                <p className="body-copy mt-1 !text-[0.95rem]">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="on-band border-y-2 py-5">
        <p className="wrap flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm font-bold tracking-[0.16em] sm:text-base">
          <span>FOUNDED {site.founded}</span>
          <span aria-hidden="true">·</span>
          <span>{site.memberCountLabel} MEMBERS</span>
          <span aria-hidden="true">·</span>
          <span>UCCS</span>
        </p>
      </div>

      <section className="wrap py-14 lg:py-20" aria-labelledby="gallery">
        <p className="eyebrow">PHOTOS</p>
        <h2 id="gallery" className="h-section mt-1">
          GALLERY
        </h2>
        <div className="mt-10">
          <Gallery items={gallery} />
        </div>
      </section>
    </>
  );
}
