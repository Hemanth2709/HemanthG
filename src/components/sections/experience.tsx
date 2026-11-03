import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/data/experience";

/** Renders nothing until src/data/experience.ts has real entries. */
export function Experience() {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-20 border-t border-line py-24 md:py-32" aria-label="Experience">
      <div className="container-site">
        <SectionHeading eyebrow="Experience" title="Where I've worked" />

        <ol className="divide-y divide-line border-y border-line">
          {experience.map((entry) => (
            <li key={`${entry.company}-${entry.period}`} className="grid gap-4 py-8 md:grid-cols-[14rem_1fr] md:gap-10">
              <Reveal>
                <p className="font-mono text-xs text-subtle">{entry.period}</p>
                <p className="mt-2 font-medium text-foreground">{entry.company}</p>
                <p className="text-sm text-muted">{entry.location}</p>
              </Reveal>
              <Reveal delay={0.05}>
                <h3 className="font-medium text-foreground">{entry.role}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{entry.summary}</p>
                {entry.achievements.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-2">
                    {entry.achievements.map((item) => (
                      <li key={item} className="grid grid-cols-[1rem_1fr] gap-2 text-sm leading-relaxed text-muted">
                        <span aria-hidden className="text-subtle">
                          —
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {entry.technologies.length > 0 ? (
                  <p className="mt-4 font-mono text-xs text-subtle">{entry.technologies.join(" · ")}</p>
                ) : null}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
