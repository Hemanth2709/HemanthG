import { ArrowDownRight, ArrowRight, Github } from "lucide-react";

import { HeroBackground } from "@/components/hero/hero-background";
import { SessionActivator } from "@/components/hero/session-activator";
import { StaticSession } from "@/components/hero/static-session";
import { VisitorPanel } from "@/components/hero/visitor-panel";
import { WORKFLOWS } from "@/components/hero/workflow-data";
import { intelWorkflow } from "@/components/hero/workflow-intel";
import { site, socials } from "@/data/site";
import { loadIntel } from "@/lib/intel/load";

const delay = (seconds: number) => ({ "--enter-delay": `${seconds}s` }) as React.CSSProperties;
const github = socials.find((social) => social.icon === "github");

/**
 * Two layers. Content (left): positioning, headline, intro, actions and the
 * Visitor Intelligence panel; server-rendered with CSS-only entrance.
 * Stage (right on large screens, a short band below the content on smaller
 * ones): the simulated security session over an ambient background, with
 * no container edges, masked into the page. The threat-intel workflow uses
 * the same real data as the "In the wild" feed (fetched once per ISR run).
 */
export async function Hero() {
  const { kev, nvd } = await loadIntel();
  const workflows = [...WORKFLOWS, intelWorkflow(kev, nvd)];

  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden" aria-label="Introduction">
      <HeroBackground />

      <div className="container-site relative z-10 grid pt-28 pb-6 md:pt-36 lg:min-h-[54rem] lg:grid-cols-[minmax(0,35rem)_1fr] lg:gap-10 lg:pb-24 xl:grid-cols-[minmax(0,37rem)_1fr]">
        <div>
          <p className="label anim-rise text-accent!" style={delay(0.1)}>
            {site.heroLabel}
          </p>

          <h1
            className="anim-rise-lcp mt-6 font-display text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-6xl xl:text-[4.1rem]"
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

          <div className="anim-rise mt-9 flex flex-wrap items-center gap-x-4 gap-y-4" style={delay(0.4)}>
            <a
              href="#work"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-foreground pr-4 pl-5 text-sm font-medium text-background transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-accent-bright"
            >
              Explore my work
              <ArrowDownRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            {github ? (
              <a
                href={github.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-background/40 px-5 text-sm text-foreground transition-colors duration-200 hover:border-accent/60"
              >
                <Github className="size-4" aria-hidden />
                GitHub
              </a>
            ) : null}
            {site.resumeUrl ? (
              <a
                href={site.resumeUrl}
                className="inline-flex h-11 items-center rounded-full border border-line-strong bg-background/40 px-5 text-sm text-foreground transition-colors duration-200 hover:border-accent/60"
              >
                Resume
              </a>
            ) : null}
            <a
              href="#contact"
              className="group ml-1 inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-foreground"
            >
              Get in touch
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="anim-rise mt-10 max-w-[35rem]" style={delay(0.55)}>
            <VisitorPanel />
          </div>
        </div>
        <div aria-hidden className="hidden lg:block" />
      </div>

      <div aria-hidden className="hero-stage anim-fade relative h-[15rem] md:h-[19rem] lg:absolute lg:top-0 lg:right-0 lg:h-[min(100svh,58rem)] lg:min-h-[44rem] lg:w-[54%]" style={delay(0.5)}>
        <div className="hero-tilt container-site h-full pt-4 pb-6 lg:max-w-none lg:pt-36 lg:pr-[max(3.5rem,calc((100vw-80rem)/2+3.5rem))] lg:pb-16 lg:pl-20">
          <div className="relative h-full">
            <StaticSession workflows={workflows} />
            <SessionActivator workflows={workflows} />
          </div>
        </div>
      </div>
    </section>
  );
}
