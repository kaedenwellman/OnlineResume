import type { Metadata } from "next";
import Image from "next/image";
import FeaturedVideo from "@/components/sections/FeaturedVideo";
import { media } from "@/lib/content";

export const metadata: Metadata = {
  title: "Learn",
  description: "Short electrical & computer engineering explainers from Wire Lion members.",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  const [featured, ...rest] = media.videos;
  return (
    <div className="wrap py-12 lg:py-16">
      <p className="eyebrow">LIBRARY</p>
      <h1 className="h-giant mt-1">LEARN</h1>
      <p className="body-copy mt-5 max-w-[56ch]">Short explainers from Wire Lion members.</p>

      {featured && (
        <section className="mt-12" aria-label="Featured video">
          <FeaturedVideo video={featured} />
        </section>
      )}

      {/* Future videos render here as cards; nothing is shown until they exist. */}
      {rest.length > 0 && (
        <section className="mt-16 border-t-2 border-ink pt-12">
          <h2 className="h-section">MORE VIDEOS</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((v) => (
              <li key={v.slug} className="card">
                <div className="card-media relative aspect-video bg-black">
                  <Image src={v.poster} alt="" fill sizes="(min-width:1024px) 30vw, 92vw" className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold uppercase">{v.title}</h3>
                  {v.subtitle && <p className="eyebrow mt-1">{v.subtitle}</p>}
                  <a href={v.src} className="link-arrow mt-3 inline-block py-2">
                    WATCH →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
