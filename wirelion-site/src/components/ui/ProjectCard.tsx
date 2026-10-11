import Image from "next/image";
import Link from "next/link";
import ComingSoonArt from "./ComingSoonArt";
import { STATUS_ICON } from "@/lib/shared";
import type { Project } from "@/lib/content";

export const isPumpkin = (p: Project) => /jack-o|lantern|pumpkin/i.test(`${p.slug} ${p.title}`);

/** Mirrors the reference product card; the whole card is one link. */
export default function ProjectCard({
  project,
  priority = false,
  headingAs: H = "h3",
}: {
  project: Project;
  priority?: boolean;
  headingAs?: "h2" | "h3";
}) {
  const cover = project.images[0];
  return (
    <Link href={`/projects/${project.slug}`} className="card press group h-full">
      <div className="card-media aspect-square bg-black">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority={priority}
            sizes="(min-width:1280px) 22vw, (min-width:1024px) 30vw, (min-width:640px) 46vw, 92vw"
            className="object-cover"
          />
        ) : (
          <ComingSoonArt category={project.category} pumpkin={isPumpkin(project)} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <span className="eyebrow">{project.category}</span>
        <H className="text-[1.05rem] font-bold uppercase leading-snug tracking-[0.01em]">{project.title}</H>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-[0.95rem] font-extrabold tracking-[0.04em]">
            <span aria-hidden="true">{STATUS_ICON[project.status]} </span>
            {project.status}
          </span>
          <span className="tag !text-[0.62rem]">{project.level}</span>
        </div>
      </div>
    </Link>
  );
}
