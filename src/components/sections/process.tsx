"use client";

import * as React from "react";

import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/data/process";
import { cn } from "@/lib/utils";

/** Scroll distance (in viewport heights) devoted to each stage. */
const VH_PER_STEP = 0.7;

/**
 * Scroll-driven scrollytelling: the section is a tall scroll track with
 * a sticky panel inside. Scrolling through the track advances the active
 * stage automatically; clicking a stage scrolls to its slice of the
 * track, so the URL of truth is always the scroll position.
 *
 * Perf notes: the scroll listener is passive and rAF-throttled, React
 * state only updates when the discrete step index changes, and the
 * continuous progress line is driven by a CSS variable + scaleX
 * (compositor-only, no re-render per frame).
 */
export function Process() {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeIndexRef = React.useRef(0);
  const active = processSteps[activeIndex] ?? processSteps[0]!;

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      if (range <= 0) return;
      const progress = Math.min(Math.max(-rect.top / range, 0), 1);

      // Continuous progress → CSS var (no React involved)
      progressRef.current?.style.setProperty("--progress", progress.toFixed(4));

      // Discrete step → state, only when it actually changes
      const index = Math.min(Math.floor(progress * processSteps.length), processSteps.length - 1);
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /** Scroll the page so the track progress lands mid-slice of step `index`. */
  const scrollToStep = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    const targetProgress = (index + 0.5) / processSteps.length;
    const top = window.scrollY + rect.top + targetProgress * range;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section id="process" className="scroll-mt-24" aria-label="Engineering process">
      {/* Tall scroll track: its height is the scrub timeline */}
      <div
        ref={trackRef}
        style={{ height: `${Math.round((processSteps.length * VH_PER_STEP + 1) * 100)}svh` }}
      >
        <div className="sticky top-0 flex min-h-svh items-center py-24">
          <div ref={progressRef} className="container-site w-full">
            <SectionHeading
              eyebrow="Process"
              title="From idea to production, on purpose."
              description="A repeatable loop for shipping products that work — keep scrolling to move through the stages."
            />

            {/* Stage selector — connected pipeline on desktop, wrapping pills on mobile */}
            <div className="relative mb-10 flex flex-wrap items-center justify-center gap-2 md:justify-between md:gap-0">
              <div className="absolute left-0 right-0 top-1/2 hidden h-px bg-line md:block" aria-hidden />
              {/* Continuous scroll-progress line, scaleX driven by --progress */}
              <div
                aria-hidden
                className="absolute left-0 right-0 top-1/2 hidden h-px origin-left bg-accent/70 md:block"
                style={{ transform: "scaleX(var(--progress, 0))" }}
              />
              {processSteps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => scrollToStep(index)}
                  aria-pressed={index === activeIndex}
                  className={cn(
                    "relative z-10 flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all duration-300",
                    index === activeIndex
                      ? "border-accent/60 bg-raised text-foreground shadow-[0_0_24px_rgba(139,147,255,0.18)]"
                      : index < activeIndex
                        ? "border-line bg-surface text-foreground/70 hover:border-line-strong hover:text-foreground"
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
                    Stage {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(processSteps.length).padStart(2, "0")}
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
          </div>
        </div>
      </div>
    </section>
  );
}
