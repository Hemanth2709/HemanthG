import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/data/projects";

import { CaseStudy } from "./case-study";

export function Projects() {
  return (
    <section id="work" className="scroll-mt-24 py-28 md:py-40" aria-label="Featured projects">
      <div className="container-site">
        <SectionHeading
          eyebrow="Featured Work"
          title="Case studies, not screenshots."
          description="Each project below tells the full story — the problem it solves, the system behind it, the trade-offs made, and what shipped."
        />

        <div className="flex flex-col gap-28 md:gap-40">
          {projects.map((project, index) => (
            <CaseStudy key={project.slug} project={project} reversed={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
