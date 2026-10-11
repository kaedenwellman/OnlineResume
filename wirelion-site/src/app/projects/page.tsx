import type { Metadata } from "next";
import ProjectBrowser from "@/components/ui/ProjectBrowser";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Every Wire Lion build: Arduino projects, soldering kits, sensor circuits and competitions.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="wrap py-12 lg:py-16">
      <ProjectBrowser projects={projects} heading="ALL PROJECTS" headingLevel="h1" />
    </div>
  );
}
