import { ArrowDown, ArrowRight } from "lucide-react";

import { Magnetic } from "@/components/effects/magnetic";
import { Particles } from "@/components/effects/particles";
import { site } from "@/data/site";

/**
 * Server component — the entire above-the-fold entrance runs on CSS
 * keyframes (see anim-rise / anim-rise-lcp), so first paint never waits
 * for hydration. The headline animates transform only, keeping LCP early.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden" aria-label="Introduction">
      <Particles />

      <div className="container-site relative z-10 py-32">
        <p className="eyebrow anim-rise mb-6" style={{ "--enter-delay": "0.5s" } as React.CSSProperties}>
          {site.name} · {site.title}
        </p>

        <h1
          className="anim-rise-lcp max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-7xl"
          style={{ "--enter-delay": "0.55s" } as React.CSSProperties}
        >
          I turn ambitious ideas into{" "}
          <em className="font-serif font-normal not-italic [font-style:italic] text-gradient">
            intelligent
          </em>
          , production-grade products.
        </h1>

        <p
          className="anim-rise mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted"
          style={{ "--enter-delay": "0.7s" } as React.CSSProperties}
        >
          {site.intro}
        </p>

        <div
          className="anim-rise mt-12 flex flex-wrap items-center gap-4"
          style={{ "--enter-delay": "0.85s" } as React.CSSProperties}
        >
          <Magnetic>
            <a
              href="#work"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-base font-medium text-background transition-all duration-300 hover:bg-accent-bright hover:shadow-[0_0_40px_rgba(139,147,255,0.4)]"
            >
              Explore my work
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-line-strong px-7 text-base text-foreground transition-all duration-300 hover:border-accent/60 hover:bg-accent-dim"
            >
              Start a conversation
            </a>
          </Magnetic>
        </div>

        <div
          className="anim-rise mt-20 flex items-center gap-3 text-sm text-subtle"
          style={{ "--enter-delay": "1s" } as React.CSSProperties}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          Open to interesting product collaborations · {site.location}
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="anim-rise absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-subtle transition-colors hover:text-foreground"
        style={{ "--enter-delay": "1.8s" } as React.CSSProperties}
      >
        <ArrowDown className="size-5 animate-float" />
      </a>
    </section>
  );
}
