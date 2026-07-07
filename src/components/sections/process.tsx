"use client";

import * as React from "react";

import { Reveal } from "@/components/effects/reveal";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/data/process";
import { cn } from "@/lib/utils";

export function Process() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = processSteps[activeIndex] ?? processSteps[0]!;

  return (
    <section id="process" className="scroll-mt-24 py-28 md:py-40" aria-label="Engineering process">
      <div className="container-site">
        <SectionHeading
          eyebrow="Process"
          title="From idea to production, on purpose."
          description="A repeatable loop for shipping products that work — select any stage to see what it produces."
        />

        <Reveal>
          {/* Stage selector — connected pipeline on desktop, wrapping pills on mobile */}
          <div className="relative mb-10 flex flex-wrap items-center justify-center gap-2 md:justify-between md:gap-0">
            <div className="absolute left-0 right-0 top-1/2 hidden h-px bg-line md:block" aria-hidden />
            {processSteps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
                className={cn(
                  "relative z-10 flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all duration-300",
                  index === activeIndex
                    ? "border-accent/60 bg-raised text-foreground shadow-[0_0_24px_rgba(139,147,255,0.18)]"
                    : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground",
                )}
              >
                <Icon
                  name={step.icon}
                  className={cn("size-4", index === activeIndex ? "text-accent" : "text-subtle")}
                />
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{index + 1}</span>
              </button>
            ))}
          </div>

          {/* Active stage detail — re-keyed so the CSS entrance replays on change */}
          <div className="overflow-hidden rounded-3xl border border-line bg-surface">
            <div
              key={active.id}
              className="panel-in grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12"
            >
              <div>
                <p className="eyebrow mb-2">
                  Stage {String(activeIndex + 1).padStart(2, "0")} / {String(processSteps.length).padStart(2, "0")}
                </p>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {active.label}
                </h3>
                <p className="max-w-lg text-pretty leading-relaxed text-muted">{active.description}</p>
              </div>
              <ul className="flex flex-col gap-2.5 md:min-w-56">
                {active.outputs.map((output) => (
                  <li
                    key={output}
                    className="flex items-center gap-3 rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground"
                  >
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                    {output}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
