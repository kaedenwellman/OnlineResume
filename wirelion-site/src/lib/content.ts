/**
 * Typed loaders for /content/*.json.
 *
 * Every file is validated with zod at build time, so a typo in the JSON fails
 * `next build` with a readable message instead of shipping a broken page.
 * Unknown keys (including the human-only `_note`-style fields) are stripped
 * by zod and never reach a component.
 */
import { z } from "zod";
import siteJson from "../../content/site.json";
import projectsJson from "../../content/projects.json";
import teamJson from "../../content/team.json";
import mediaJson from "../../content/media.json";

const nonEmpty = z.string().trim().min(1);
const localPath = z.string().startsWith("/", "paths must start with / (relative to /public)");

/* ---------------------------------------------------------------- site.json */
const SiteSchema = z.object({
  name: nonEmpty,
  shortName: nonEmpty,
  wordmark: z.object({ plain: nonEmpty, highlighted: nonEmpty }),
  school: nonEmpty,
  founded: z.number().int(),
  memberCountLabel: nonEmpty,
  tagline: nonEmpty,
  heroHeadline: nonEmpty,
  heroSubhead: nonEmpty,
  focusAreas: z.array(nonEmpty).min(1),
  about: z.object({
    intro: nonEmpty,
    mission: nonEmpty,
    beyond: nonEmpty,
    closing: nonEmpty,
    pillars: z.array(z.object({ title: nonEmpty, body: nonEmpty })),
  }),
  join: z.object({
    mountainLionConnectUrl: z.url(),
    headline: nonEmpty,
    body: nonEmpty,
    steps: z.array(z.object({ n: nonEmpty, title: nonEmpty, body: nonEmpty })),
    faq: z.array(z.object({ q: nonEmpty, a: nonEmpty })),
  }),
  contact: z.object({
    address: z.string(),
    email: z.string(),
    emailLabel: z.string().optional(),
    showEmail: z.boolean(),
  }),
  social: z.object({
    instagram: z.string(),
    discord: z.string(),
    linkedin: z.string(),
    github: z.string(),
    youtube: z.string(),
  }),
});

/* ------------------------------------------------------------ projects.json */
export const STATUSES = ["COMPLETE", "IN PROGRESS", "UPCOMING"] as const;

const ImageSchema = z.object({ src: localPath, alt: nonEmpty });

const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers and dashes"),
  title: nonEmpty,
  category: nonEmpty,
  status: z.enum(STATUSES),
  level: nonEmpty,
  teaser: z.string().optional(),
  summary: nonEmpty,
  description: nonEmpty,
  tech: z.array(nonEmpty).default([]),
  concepts: z.array(nonEmpty).default([]),
  specs: z.array(z.object({ label: nonEmpty, value: nonEmpty })).default([]),
  build: z.array(nonEmpty).default([]),
  troubleshooting: z.array(nonEmpty).default([]),
  images: z.array(ImageSchema).default([]),
  doc: z.object({ src: localPath, label: nonEmpty }).nullable().default(null),
  docPendingLabel: z.string().optional(),
  cta: z.object({ label: nonEmpty, href: nonEmpty }).optional(),
  contributors: z.array(z.object({ role: nonEmpty, names: z.array(nonEmpty) })).default([]),
  contributorsFallback: z.string().optional(),
});

const ProjectsSchema = z
  .object({ projects: z.array(ProjectSchema) })
  .superRefine((v, ctx) => {
    const seen = new Set<string>();
    v.projects.forEach((p, i) => {
      if (seen.has(p.slug)) {
        ctx.addIssue({ code: "custom", message: `duplicate slug "${p.slug}"`, path: ["projects", i, "slug"] });
      }
      seen.add(p.slug);
    });
  });

/* ---------------------------------------------------------------- team.json */
const PersonSchema = z.object({
  slug: nonEmpty,
  name: nonEmpty,
  role: nonEmpty,
  badge: z.string().optional(),
  photo: z.string().default(""),
});
const TeamSchema = z.object({ officers: z.array(PersonSchema), advisors: z.array(PersonSchema) });

/* --------------------------------------------------------------- media.json */
const VideoSchema = z.object({
  slug: nonEmpty,
  title: nonEmpty,
  subtitle: z.string().optional(),
  description: z.string().optional(),
  chapters: z.array(z.object({ label: nonEmpty })).default([]),
  src: localPath,
  poster: localPath,
  captions: localPath.optional(),
  durationSeconds: z.number().optional(),
  level: z.string().optional(),
  tags: z.array(nonEmpty).default([]),
  credit: z.string().optional(),
});
const GallerySchema = z.object({
  src: localPath,
  alt: nonEmpty,
  label: nonEmpty,
  caption: z.string().optional(),
});
const MediaSchema = z.object({ videos: z.array(VideoSchema), gallery: z.array(GallerySchema) });

/* ----------------------------------------------------------------- loaders */
function parse<T extends z.ZodType>(schema: T, data: unknown, file: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`\n\n✖ /content/${file} is invalid:\n${z.prettifyError(result.error)}\n`);
  }
  return result.data;
}

export type Site = z.infer<typeof SiteSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectStatus = Project["status"];
export type Person = z.infer<typeof PersonSchema>;
export type Video = z.infer<typeof VideoSchema>;
export type GalleryItem = z.infer<typeof GallerySchema>;

export const site: Site = parse(SiteSchema, siteJson, "site.json");
export const projects: Project[] = parse(ProjectsSchema, projectsJson, "projects.json").projects;
export const team = parse(TeamSchema, teamJson, "team.json");
export const media = parse(MediaSchema, mediaJson, "media.json");

/* ----------------------------------------------------------------- helpers */
export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const buildsShipped = projects.filter((p) => p.status === "COMPLETE").length;
export const upcomingProjects = projects.filter((p) => p.status === "UPCOMING");

/** Social links with a value, in a fixed order. Empty values are never shown. */
export const socialLinks = (
  [
    ["instagram", "Instagram"],
    ["discord", "Discord"],
    ["linkedin", "LinkedIn"],
    ["github", "GitHub"],
    ["youtube", "YouTube"],
  ] as const
)
  .map(([key, label]) => ({ key, label, href: site.social[key].trim() }))
  .filter((s) => s.href.length > 0);

export { STATUS_ICON, PASTELS, pastelAt, initials, type Pastel } from "./shared";
