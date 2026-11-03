import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { about, achievements, education, languages, timeline } from "@/data/about";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-line py-24 md:py-36" aria-label="About">
      <div className="container-site">
        <SectionHeading index="01" label="About" title={about.headline} />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-5 lg:col-span-7 lg:col-start-1">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.05}>
                <p
                  className={
                    index === 0
                      ? "text-pretty text-xl leading-relaxed text-foreground md:text-2xl md:leading-relaxed"
                      : "max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <dl className="flex flex-col gap-8">
              <div>
                <dt className="label">Education</dt>
                <dd className="mt-3 text-sm leading-relaxed">
                  <p className="text-foreground">{education.degree}</p>
                  <p className="text-muted">{education.school}</p>
                  <p className="mt-1 font-mono text-xs text-subtle">
                    {education.period} · {education.grade}
                  </p>
                </dd>
              </div>
              <div>
                <dt className="label">Recognition</dt>
                <dd className="mt-3">
                  <ul className="flex flex-col gap-3">
                    {achievements.map((item) => (
                      <li key={item.title} className="text-sm leading-relaxed">
                        <span className="text-foreground">{item.title}</span>
                        <span className="text-muted"> · {item.detail}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="label">Languages</dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{languages}</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* Professional timeline */}
        <Reveal className="mt-20 md:mt-28">
          <p className="label mb-6">Timeline</p>
          <ol className="grid border-l border-line-strong md:grid-cols-5 md:border-t md:border-l-0">
            {timeline.map((item, index) => {
              const current = index === timeline.length - 1;
              return (
                <li key={item.title} className="relative pb-7 pl-6 md:pt-6 md:pr-4 md:pb-0 md:pl-0">
                  <span
                    aria-hidden
                    className={
                      "absolute top-1.5 -left-[4.5px] size-2 rounded-full md:-top-[4.5px] md:left-0 " +
                      (current ? "bg-accent ring-4 ring-accent/15" : "border border-line-strong bg-background")
                    }
                  />
                  <p className="font-mono text-xs text-subtle">{item.period}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.detail}</p>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
