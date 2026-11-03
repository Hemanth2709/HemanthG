import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { planned, projects } from "@/data/projects";

import { Benchmark } from "./benchmark";
import { CaseStudy } from "./case-study";
import { Coverage } from "./coverage";

export function Projects() {
  return (
    <section id="work" className="scroll-mt-20 border-t border-line py-24 md:py-32" aria-label="Work">
      <div className="container-site">
        <SectionHeading
          eyebrow="Work"
          title="Sentinel-Security"
          description="One project, documented in full: what it catches, how it was measured, and where it falls short."
        />

        <div className="flex flex-col gap-20 md:gap-24">
          {projects.map((project) => (
            <CaseStudy key={project.slug} project={project} />
          ))}

          <Benchmark />
          <Coverage />

          <Reveal>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Building next</h3>
              <span className="rounded-sm border border-line-strong px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                Planned · not started
              </span>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {planned.map((item) => (
                <li
                  key={item.name}
                  className="grid gap-1 py-4 md:grid-cols-[9rem_13rem_1fr] md:items-baseline md:gap-6"
                >
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="font-mono text-xs text-subtle">{item.focus}</p>
                  <p className="text-sm leading-relaxed text-muted">{item.summary}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
