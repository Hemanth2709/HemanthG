import { ArrowRight } from "lucide-react";

import { ScanExcerpt } from "@/components/sections/scan-excerpt";
import { site } from "@/data/site";

/**
 * Server component. The entrance runs on CSS keyframes (anim-rise /
 * anim-rise-lcp), so first paint never waits for hydration. The headline
 * animates transform only, keeping LCP early.
 */
export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28" aria-label="Introduction">
      <div className="container-site grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="eyebrow anim-rise mb-6">{site.title}</p>

          <h1
            className="anim-rise-lcp text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
            style={{ "--enter-delay": "0.05s" } as React.CSSProperties}
          >
            {site.tagline}
          </h1>

          <p
            className="anim-rise mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted"
            style={{ "--enter-delay": "0.15s" } as React.CSSProperties}
          >
            {site.intro}
          </p>

          <div
            className="anim-rise mt-10 flex flex-wrap items-center gap-3"
            style={{ "--enter-delay": "0.25s" } as React.CSSProperties}
          >
            <a
              href="#work"
              className="group inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-accent-bright"
            >
              Read the case study
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://github.com/Hemanth2709/SentinelRules"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-md border border-line-strong px-5 text-sm text-foreground transition-colors hover:border-accent/60 hover:bg-accent-dim"
            >
              View on GitHub
            </a>
          </div>

          <p
            className="anim-rise mt-10 font-mono text-xs text-subtle"
            style={{ "--enter-delay": "0.35s" } as React.CSSProperties}
          >
            {site.location}
          </p>
        </div>

        <div className="anim-rise min-w-0" style={{ "--enter-delay": "0.3s" } as React.CSSProperties}>
          <ScanExcerpt />
        </div>
      </div>
    </section>
  );
}
