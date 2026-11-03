import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/reveal";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/types";

interface CaseStudyProps {
  project: Project;
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-subtle">{title}</h4>
      {children}
    </div>
  );
}

function List({ items, marker }: { items: string[]; marker: string }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[1rem_1fr] gap-2 text-sm leading-relaxed text-muted">
          <span aria-hidden className={marker}>
            —
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CaseStudy({ project }: CaseStudyProps) {
  return (
    <article aria-label={`Case study: ${project.name}`} className="grid gap-12 lg:grid-cols-[18rem_1fr] lg:gap-16">
      <Reveal className="lg:sticky lg:top-24 lg:self-start">
        <p className="font-mono text-xs text-subtle">{project.category}</p>
        <p className="mt-4 text-pretty leading-relaxed text-foreground">{project.summary}</p>

        <dl className="mt-6 grid grid-cols-[5.5rem_1fr] gap-y-2 border-t border-line pt-5 text-sm">
          <dt className="text-subtle">Status</dt>
          <dd className="flex items-center gap-2 text-foreground">
            <span className="size-1.5 rounded-full bg-pass" aria-hidden />
            {project.status}
          </dd>
          <dt className="text-subtle">Year</dt>
          <dd className="text-foreground">{project.timeframe}</dd>
        </dl>

        <ul className="mt-6 flex flex-col gap-2 border-t border-line pt-5">
          {project.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent-bright"
              >
                {link.label}
                <ArrowUpRight className="size-4 text-subtle transition-colors group-hover:text-accent-bright" />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
          {project.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.08} className="flex flex-col gap-10">
        <div className="grid gap-10 md:grid-cols-2">
          <Block title="Problem">
            <p className="text-pretty text-sm leading-relaxed text-muted md:text-base">{project.problem}</p>
          </Block>
          <Block title="Approach">
            <p className="text-pretty text-sm leading-relaxed text-muted md:text-base">{project.solution}</p>
          </Block>
        </div>

        <Block title="How it works">
          <List items={project.architecture} marker="text-subtle" />
        </Block>

        <Block title="Decisions">
          <List items={project.decisions} marker="text-subtle" />
        </Block>

        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
          <div className="bg-surface p-5">
            <h4 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-pass">
              Results
            </h4>
            <List items={project.results} marker="text-pass" />
          </div>
          <div className="bg-surface p-5">
            <h4 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              Limitations
            </h4>
            <List items={project.limitations} marker="text-accent" />
          </div>
        </div>
      </Reveal>
    </article>
  );
}
