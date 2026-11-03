import { ArrowDownRight, ArrowRight } from "lucide-react";

import { HeroNetwork } from "@/components/sections/hero-network";
import { site } from "@/data/site";

const meta = [
  { label: "Based in", value: site.location },
  { label: "Experience", value: "3.5+ years" },
  { label: "Builds", value: "Full-stack web apps" },
  { label: "Focus", value: "Application security" },
];

const delay = (seconds: number) => ({ "--enter-delay": `${seconds}s` }) as React.CSSProperties;

/**
 * Server component. The entrance is CSS-only, so the hero is readable
 * before (and without) JavaScript. The headline animates transform only.
 */
export function Hero() {
  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden" aria-label="Introduction">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[38rem]"
        style={{
          background: "radial-gradient(ellipse 55% 60% at 70% 0%, rgba(101,169,255,0.07), transparent 70%)",
        }}
      />

      <div className="container-site relative grid items-center gap-12 pt-28 pb-16 md:pt-36 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:pb-24">
        <div>
          <p className="label anim-rise text-accent!" style={delay(0.1)}>
            {site.heroLabel}
          </p>

          <h1
            className="anim-rise-lcp mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-6xl xl:text-[4.25rem]"
            style={delay(0.18)}
          >
            {site.headline.map((line, index) => (
              <span key={line} className={index === 0 ? "block" : "block text-muted"}>
                {line}
              </span>
            ))}
          </h1>

          <p
            className="anim-rise mt-7 max-w-[34rem] text-pretty text-base leading-relaxed text-muted md:text-lg"
            style={delay(0.3)}
          >
            {site.intro}
          </p>

          <div className="anim-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" style={delay(0.4)}>
            <a
              href="#projects"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-foreground pr-4 pl-5 text-sm font-medium text-background transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-accent-bright"
            >
              Explore my work
              <ArrowDownRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            {site.resumeUrl ? (
              <a
                href={site.resumeUrl}
                className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-sm text-foreground transition-colors duration-200 hover:border-accent/60"
              >
                View resume
              </a>
            ) : null}
            <a
              href="#contact"
              className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-foreground"
            >
              Get in touch
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>

          <dl
            className="anim-rise mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4"
            style={delay(0.55)}
          >
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="label">{item.label}</dt>
                <dd className="mt-1.5 text-sm text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="anim-fade mx-auto w-full max-w-[34rem] lg:max-w-none" style={delay(0.35)}>
          <HeroNetwork />
        </div>
      </div>
    </section>
  );
}
