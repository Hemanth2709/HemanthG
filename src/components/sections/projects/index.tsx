import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Status } from "@/components/ui/status";
import { featured, planned, projects } from "@/data/projects";

import { FeaturedProject } from "./featured";
import { ProjectRow } from "./project-row";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 border-t border-line py-24 md:py-36" aria-label="Projects">
      <div className="container-site">
        <SectionHeading
          index="03"
          label="Projects"
          title={["Selected work.", "Open source, and what I've built on the job."]}
          description="Professional projects are described only as far as I can share them publicly. Diagrams are simplified."
        />

        <FeaturedProject project={featured} />

        <div className="mt-8 border-t border-line">
          {projects.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index + 2} />
          ))}
        </div>

        <Reveal className="mt-24 md:mt-32">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label">Building next</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Planned projects
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                Blueprints, not finished work. Each moves up to the list above only once it's built and tested.
              </p>
            </div>
          </div>

          <ul className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-5">
            {planned.map((item) => (
              <li
                key={item.name}
                className="border-b border-line py-6 sm:pr-6 lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0"
              >
                <Status status="Planned" />
                <p className="mt-4 text-lg font-medium text-foreground">{item.name}</p>
                <p className="mt-1 font-mono text-xs text-subtle">{item.category}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.summary}</p>
                <p className="mt-4 font-mono text-[11px] text-faint">{item.technologies.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
