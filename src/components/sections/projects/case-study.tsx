"use client";

import { ArrowUpRight, CheckCircle2, Github, Lightbulb } from "lucide-react";
import * as React from "react";

import { ParallaxCard } from "@/components/effects/parallax-card";
import { Reveal } from "@/components/effects/reveal";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/types";
import { cn } from "@/lib/utils";

import { ProjectVisual } from "./project-visual";

const deepDiveTabs = [
  { id: "architecture", label: "Architecture" },
  { id: "challenges", label: "Challenges" },
  { id: "decisions", label: "Decisions" },
] as const;

type TabId = (typeof deepDiveTabs)[number]["id"];

interface CaseStudyProps {
  project: Project;
  /** Alternates the visual/content columns for rhythm. */
  reversed: boolean;
}

export function CaseStudy({ project, reversed }: CaseStudyProps) {
  const [tab, setTab] = React.useState<TabId>("architecture");
  const tabContent: Record<TabId, string[]> = {
    architecture: project.architecture,
    challenges: project.challenges,
    decisions: project.decisions,
  };

  return (
    <article
      className={cn(
        "grid items-start gap-10 lg:grid-cols-2 lg:gap-16",
        reversed && "lg:[&>*:first-child]:order-2",
      )}
      aria-label={`Case study: ${project.name}`}
    >
      <Reveal className="cq lg:sticky lg:top-28">
        <ParallaxCard className="rounded-3xl">
          <ProjectVisual name={project.name} category={project.category} hue={project.hue} />
        </ParallaxCard>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent-bright"
            >
              Live demo
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              <Github className="size-4" />
              Source
            </a>
          )}
          <span className="ml-auto font-mono text-xs text-subtle">{project.timeframe}</span>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="flex flex-col gap-8">
        <div>
          <h3 className="eyebrow mb-3">Problem</h3>
          <p className="text-pretty leading-relaxed text-muted">{project.problem}</p>
        </div>

        <div>
          <h3 className="eyebrow mb-3">Solution</h3>
          <p className="text-pretty leading-relaxed text-muted">{project.solution}</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface">
          <div className="flex border-b border-line" role="tablist" aria-label="Technical deep dive">
            {deepDiveTabs.map((item) => (
              <button
                key={item.id}
                id={`tab-${project.slug}-${item.id}`}
                role="tab"
                aria-selected={tab === item.id}
                aria-controls={`panel-${project.slug}-${item.id}`}
                onClick={() => setTab(item.id)}
                className={cn(
                  "relative flex-1 border-b px-4 py-3 text-xs font-medium transition-colors duration-300 md:text-sm",
                  tab === item.id
                    ? "-mb-px border-accent text-foreground"
                    : "border-transparent text-subtle hover:text-muted",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            key={tab}
            id={`panel-${project.slug}-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${project.slug}-${tab}`}
            className="panel-in p-5"
          >
            <ul className="flex flex-col gap-3">
              {tabContent[tab].map((line, index) => (
                <li key={index} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="eyebrow mb-3">Results</h3>
          <ul className="flex flex-col gap-2.5">
            {project.results.map((result, index) => (
              <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                {result}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 rounded-2xl border border-line bg-accent-dim/40 p-5">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <p className="text-sm italic leading-relaxed text-muted">{project.lessons}</p>
        </div>
      </Reveal>
    </article>
  );
}
