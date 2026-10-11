import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Sticker from "@/components/ui/Sticker";
import Marquee from "@/components/ui/Marquee";
import ProjectBrowser from "@/components/ui/ProjectBrowser";
import FeaturedVideo from "@/components/sections/FeaturedVideo";
import JoinButton from "@/components/sections/JoinButton";
import { buildsShipped, media, projects, site, socialLinks, upcomingProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/url";

const LABEL_BG = ["bg-mint", "bg-peach", "bg-lav", "bg-butter"];
// Asymmetric photo grid: one tall feature, one wide, two squares.
const PHOTO_LAYOUT = [
  "col-span-2 row-span-2 sm:col-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1 sm:col-span-2",
];
const CORNER = ["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"];

export default function HomePage() {
  const next = upcomingProjects[0];
  const video = media.videos[0];
  const specs = [
    ["FOUNDED", String(site.founded)],
    ["MEMBERS", site.memberCountLabel],
    ["BUILDS SHIPPED", String(buildsShipped)],
    ...(next ? [["NEXT", next.teaser ?? next.title]] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-full.png`,
    description: site.tagline,
    foundingDate: String(site.founded),
    ...(site.contact.address && {
      address: { "@type": "PostalAddress", streetAddress: site.contact.address },
    }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks.map((s) => s.href) }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. Hero */}
      <section className="relative overflow-hidden">
        <Sticker
          line1={site.memberCountLabel}
          line2="MEMBERS"
          className="absolute -right-8 top-4 z-10 h-[124px] w-[124px] sm:-right-6 sm:top-6 sm:h-[160px] sm:w-[160px] lg:-right-10 lg:h-[190px] lg:w-[190px]"
        />
        <div className="wrap grid gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1fr_360px] lg:items-end lg:gap-14 lg:pb-20 lg:pt-20">
          <div data-stagger="">
            <p className="eyebrow pr-24 [--i:0] sm:pr-0">UCCS // ELECTRICAL &amp; COMPUTER ENGINEERING</p>
            <h1 className="h-giant mt-4 max-w-[13ch] [--i:1]">{site.heroHeadline}</h1>
            <p className="body-copy mt-6 max-w-[56ch] [--i:2]">{site.heroSubhead}</p>
            <div className="mt-8 flex flex-col gap-4 [--i:3] sm:flex-row sm:flex-wrap">
              <JoinButton />
              <Link href="/projects" className="btn btn-secondary press">
                SEE PROJECTS
              </Link>
            </div>
          </div>

          <div className="brutal bg-elevated text-sm">
            <p className="border-b-2 border-ink bg-ink px-4 py-2 text-xs font-bold tracking-[0.14em] text-bg">SPEC SHEET</p>
            <dl aria-label="Club spec sheet">
            {specs.map(([k, v], i) => (
              <div
                key={k}
                className={`flex items-baseline justify-between gap-4 px-4 py-3 ${i < specs.length - 1 ? "border-b-2 border-dashed border-ink/40" : ""}`}
              >
                <dt className="eyebrow">{k}</dt>
                <dd className="text-right font-extrabold tracking-[0.04em]">{v}</dd>
              </div>
            ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 2. Marquee */}
      <Marquee items={site.focusAreas} />

      {/* 3. Projects */}
      <section className="wrap py-16 lg:py-24">
        <ProjectBrowser projects={projects} limit={8} heading="ALL PROJECTS" syncUrl={false} viewAllHref="/projects" />
      </section>

      {/* 4. What we do */}
      <section className="border-t-2 border-ink py-16 lg:py-24">
        <div className="wrap">
          <p className="eyebrow">IN THE LAB</p>
          <h2 className="h-section mt-1">WHAT WE DO</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <ul className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[190px] sm:grid-cols-3 lg:auto-rows-[200px]">
              {media.gallery.slice(0, 4).map((g, i) => (
                <li key={g.src} className={`brutal relative overflow-hidden bg-black ${PHOTO_LAYOUT[i]}`}>
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover" />
                  <span className={`tag absolute ${CORNER[i]} ${LABEL_BG[i]}`}>{g.label}</span>
                </li>
              ))}
            </ul>
            <ul className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {site.about.pillars.map((p, i) => (
                <li key={p.title} className="brutal bg-elevated p-5">
                  <p className="text-xs font-bold tracking-[0.14em] text-muted">0{i + 1}</p>
                  <h3 className="mt-1 text-lg font-extrabold tracking-tight">{p.title}</h3>
                  <p className="body-copy mt-1 !text-[0.95rem]">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <Link href="/about" className="link-arrow">
              ABOUT THE CLUB →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Featured video */}
      {video && (
        <section className="border-t-2 border-ink py-16 lg:py-24">
          <div className="wrap">
            <p className="eyebrow">LEARN</p>
            <h2 className="h-section mt-1 max-w-[20ch]">{video.title.toUpperCase()}</h2>
            <div className="mt-10">
              <FeaturedVideo video={video} compact />
            </div>
            <div className="mt-10">
              <Link href="/learn" className="link-arrow">
                MORE IN LEARN →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. Up next */}
      {upcomingProjects.length > 0 && (
        <section className="wrap pb-16 lg:pb-24" aria-label="Up next">
          {upcomingProjects.map((p) => (
            <div key={p.slug} className="brutal mt-6 grid gap-6 bg-butter p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-xs font-bold tracking-[0.16em]">UP NEXT: {p.teaser ?? p.category}</p>
                <h2 className="mt-3 text-[clamp(1.6rem,4vw,2.75rem)] font-extrabold uppercase leading-[1] tracking-tight">{p.title}</h2>
                <p className="mt-4 max-w-[60ch] text-[1rem] leading-relaxed">{p.summary}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                {p.cta && (
                  <Link href={p.cta.href} className="btn btn-primary press">
                    {p.cta.label} <ArrowRight aria-hidden="true" size={18} />
                  </Link>
                )}
                <Link href={`/projects/${p.slug}`} className="btn btn-secondary press">
                  DETAILS
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 7. Join band */}
      <section className="on-band border-y-2 py-16 lg:py-24">
        <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="h-section">{site.join.headline}</h2>
            <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-band-muted">{site.tagline}</p>
          </div>
          <JoinButton />
        </div>
      </section>
    </>
  );
}
