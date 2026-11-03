import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/reveal";
import { Flow } from "@/components/ui/flow";
import { Status } from "@/components/ui/status";
import { TagList } from "@/components/ui/tag";
import type { Project } from "@/data/types";

/** The lead project: full-width, with the evidence beside it. */
export function FeaturedProject({ project }: { project: Project }) {
  return (
    <article
      aria-label={`Featured project: ${project.name}`}
      className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 70% at 100% 0%, rgba(101,169,255,0.08), transparent 70%)" }}
      />

      <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-14">
        <Reveal className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="label text-accent!">Featured · {project.category}</span>
            <Status status={project.status} />
          </div>

          <h3 className="mt-6 text-4xl font-semibold tracking-[-0.035em] text-foreground md:text-6xl">{project.name}</h3>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">{project.summary}</p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
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

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {project.links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  index === 0
                    ? "group inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors duration-200 hover:bg-accent-bright"
                    : "group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-foreground"
                }
              >
                {link.label}
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col gap-10 lg:col-span-5">
          <div>
            <h4 className="label mb-4">How each rule is built</h4>
            <Flow nodes={project.flow} stackOnDesktop caption="The loop every rule goes through" />
          </div>
          <div>
            <h4 className="label mb-4">Results</h4>
            <ul className="flex flex-col gap-2.5">
              {project.highlights.map((item) => (
                <li key={item} className="grid grid-cols-[1.25rem_1fr] text-sm leading-relaxed text-muted">
                  <span aria-hidden className="mt-[0.45em] size-1.5 rounded-full bg-success/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <TagList items={project.technologies} />
        </Reveal>
      </div>
    </article>
  );
}
