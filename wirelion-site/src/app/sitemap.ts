import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { SITE_URL } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/learn", "/team", "/about", "/join"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
