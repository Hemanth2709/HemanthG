import { Reveal } from "@/components/effects/reveal";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/data/experience";

/**
 * Server component — the timeline spine grows via the `.spine-grow`
 * CSS transition when the wrapping <Reveal> enters the viewport.
 */
export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-28 md:py-40" aria-label="Experience">
      <div className="container-site">
        <SectionHeading
          eyebrow="Experience"
          title="Where the lessons came from."
          description="A path through agencies, startups, and independent product work — each stop compounding into how I build today."
        />

        <Reveal y={0} className="relative mx-auto max-w-3xl">
          {/* Animated spine */}
          <div
            aria-hidden
            className="spine-grow absolute bottom-0 left-4 top-2 w-px bg-gradient-to-b from-accent/60 via-line-strong to-transparent md:left-1/2"
          />

          <ol className="flex flex-col gap-14">
            {experience.map((entry, index) => {
              const alignRight = index % 2 === 1;
              return (
                <li key={`${entry.company}-${entry.period}`} className="relative">
                  {/* Node */}
                  <span
                    aria-hidden
                    className="absolute left-4 top-2 z-10 size-3 -translate-x-1/2 rounded-full border-2 border-accent bg-background shadow-[0_0_12px_rgba(139,147,255,0.5)] md:left-1/2"
                  />
                  <Reveal
                    delay={0.1}
                    className={`ml-10 md:ml-0 md:w-[calc(50%-2.5rem)] ${alignRight ? "md:ml-auto" : ""}`}
                  >
                    <div className="group rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:border-line-strong hover:bg-raised md:p-7">
                      <p className="font-mono text-xs text-accent">{entry.period}</p>
                      <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                        {entry.role}
                      </h3>
                      <p className="text-sm text-muted">
                        {entry.company} · {entry.location}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-muted">{entry.summary}</p>
                      <ul className="mt-4 flex flex-col gap-2">
                        {entry.achievements.map((achievement, achievementIndex) => (
                          <li
                            key={achievementIndex}
                            className="flex gap-3 text-sm leading-relaxed text-foreground/90"
                          >
                            <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {entry.technologies.map((tech) => (
                          <Badge key={tech} className="px-2.5 py-0.5 text-[0.65rem]">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
