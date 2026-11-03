import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/reveal";
import { Flow } from "@/components/ui/flow";
import { Status } from "@/components/ui/status";
import { TagList } from "@/components/ui/tag";
import type { Project } from "@/data/types";

/** Editorial project entry: name and facts on the left, detail and diagram on the right. */
export function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <article
      aria-label={`Project: ${project.name}`}
      className="group/row grid gap-8 border-b border-line py-12 md:py-16 lg:grid-cols-12 lg:gap-10"
    >
      <Reveal className="lg:col-span-5">
        <p className="font-mono text-xs text-subtle">
          <span className="text-accent">{String(index).padStart(2, "0")}</span>
          <span className="mx-2 text-faint">/</span>
          {project.category}
        </p>
        <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground transition-colors duration-300 md:text-4xl">
          {project.name}
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Status status={project.status} />
          <span className="text-sm text-subtle">{project.context}</span>
        </div>
        <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted">{project.summary}</p>

        {project.links.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-2">
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 font-mono text-xs text-foreground underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-accent-bright hover:decoration-accent"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5 text-subtle transition-colors group-hover:text-accent-bright" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </Reveal>

      <Reveal delay={0.06} className="flex flex-col gap-8 lg:col-span-7">
        <div className="grid gap-8 sm:grid-cols-2">
          {project.problem ? (
            <div>
              <h4 className="label mb-3">Problem</h4>
              <p className="text-pretty text-sm leading-relaxed text-muted">{project.problem}</p>
            </div>
          ) : null}
          <div>
            <h4 className="label mb-3">My contribution</h4>
            <p className="text-pretty text-sm leading-relaxed text-muted">{project.contribution}</p>
          </div>
        </div>

        <ul className="flex flex-col gap-2.5">
          {project.highlights.map((item) => (
            <li key={item} className="grid grid-cols-[1.25rem_1fr] text-sm leading-relaxed text-foreground/85">
              <span aria-hidden className="mt-[0.7em] h-px w-2.5 bg-accent/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Flow nodes={project.flow} />
        <TagList items={project.technologies} />
      </Reveal>
    </article>
  );
}
