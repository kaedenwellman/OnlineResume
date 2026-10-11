import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Download } from "lucide-react";
import Carousel from "@/components/ui/Carousel";
import DetailsTabs, { type Tab } from "@/components/ui/DetailsTabs";
import TechBadges from "@/components/ui/TechBadges";
import ProjectCard, { isPumpkin } from "@/components/ui/ProjectCard";
import { getProject, projects, type Project } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} · Wire Lion`, description: p.summary, url: `/projects/${p.slug}` },
  };
}

function buildTabs(p: Project): Tab[] {
  const tabs: Tab[] = [
    {
      id: "overview",
      label: "OVERVIEW",
      content: (
        <div>
          <p className="body-copy">{p.description}</p>
          {p.concepts.length > 0 && (
            <>
              <h2 className="eyebrow mt-6 !font-bold !text-ink">CONCEPTS</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {p.concepts.map((c) => (
                  <li key={c} className="tag bg-elevated">
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ),
    },
  ];
  if (p.specs.length)
    tabs.push({
      id: "specs",
      label: "SPECS",
      content: (
        <table className="w-full border-2 border-ink text-left text-sm">
          <caption className="sr-only">Specifications</caption>
          <tbody>
            {p.specs.map((s) => (
              <tr key={s.label} className="border-b-2 border-ink last:border-b-0">
                <th scope="row" className="w-[38%] border-r-2 border-ink bg-lav px-3 py-3 align-top text-xs font-bold tracking-[0.1em]">
                  {s.label}
                </th>
                <td className="bg-elevated px-3 py-3">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    });
  if (p.build.length)
    tabs.push({
      id: "build",
      label: "BUILD",
      content: (
        <ol className="grid gap-3">
          {p.build.map((step, i) => (
            <li key={i} className="flex gap-4 border-2 border-ink bg-elevated p-3">
              <span className="text-lg font-extrabold leading-tight" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[0.95rem] leading-relaxed">
                <span className="sr-only">Step {i + 1}: </span>
                {step}
              </span>
            </li>
          ))}
        </ol>
      ),
    });
  if (p.troubleshooting.length)
    tabs.push({
      id: "debug",
      label: "DEBUG",
      content: (
        <ul className="grid gap-3">
          {p.troubleshooting.map((t, i) => (
            <li key={i} className="flex gap-3 border-2 border-ink bg-elevated p-3 text-[0.95rem] leading-relaxed">
              <span aria-hidden="true" className="font-extrabold">
                ⚠
              </span>
              {t}
            </li>
          ))}
        </ul>
      ),
    });
  if (p.contributors.length || p.contributorsFallback)
    tabs.push({
      id: "team",
      label: "TEAM",
      content: p.contributors.length ? (
        <dl className="grid gap-4">
          {p.contributors.map((c) => (
            <div key={c.role}>
              <dt className="eyebrow !font-bold !text-ink">{c.role}</dt>
              <dd className="mt-1 text-[0.95rem] leading-relaxed text-muted">{c.names.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="body-copy">{p.contributorsFallback}</p>
      ),
    });
  return tabs;
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const others = projects.filter((o) => o.slug !== p.slug).slice(0, 3);

  return (
    <>
      <div className="wrap py-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="text-sm tracking-[0.06em]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="inline-block py-2 text-muted hover:text-ink hover:underline">
                HOME
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li>
              <Link href="/projects" className="inline-block py-2 text-muted hover:text-ink hover:underline">
                PROJECTS
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li aria-current="page" className="font-bold uppercase">
              {p.title}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[45fr_55fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Carousel images={p.images} title={p.title} placeholder={{ category: p.category, pumpkin: isPumpkin(p) }} />
          </div>

          <div>
            <p className="brutal inline-block bg-lav px-4 py-2 text-2xl font-extrabold tracking-[0.02em] sm:text-3xl">{p.status}</p>
            <h1 className="mt-6 text-[clamp(2.2rem,6vw,4.25rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">{p.title}</h1>
            <p className="body-copy mt-5 max-w-[62ch]">{p.summary}</p>

            <div className="mt-8">
              <DetailsTabs tabs={buildTabs(p)} label={`${p.title} details`} />
            </div>

            <p className="mt-8 flex flex-wrap gap-x-4 gap-y-1 text-xs tracking-[0.14em] text-muted">
              <span>{p.category}</span>
              <span aria-hidden="true">/</span>
              <span>{p.level}</span>
            </p>

            <div className="mt-6">
              {p.doc ? (
                <a
                  href={p.doc.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary press min-h-[60px] w-full text-base"
                >
                  <Download aria-hidden="true" size={20} /> {p.doc.label.replace(/^↓\s*/, "")}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : p.cta ? (
                <Link href={p.cta.href} className="btn btn-primary press min-h-[60px] w-full text-base">
                  {p.cta.label} <ArrowRight aria-hidden="true" size={20} />
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="btn min-h-[60px] w-full cursor-not-allowed border-dashed bg-transparent text-base text-muted"
                >
                  {p.docPendingLabel ?? "TECH DOC COMING SOON"}
                </span>
              )}
            </div>

            <div className="mt-5">
              <TechBadges tech={p.tech} />
            </div>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section className="border-t-2 border-ink py-14 lg:py-20">
          <div className="wrap">
            <h2 className="h-section">MORE PROJECTS</h2>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {others.map((o) => (
                <li key={o.slug}>
                  <ProjectCard project={o} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
