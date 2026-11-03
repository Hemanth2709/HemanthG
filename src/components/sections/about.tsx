import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { aboutNarrative, principles } from "@/data/about";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-line py-24 md:py-32" aria-label="About">
      <div className="container-site">
        <SectionHeading eyebrow="About" title={aboutNarrative.headline} />

        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div className="flex max-w-prose flex-col gap-5">
            {aboutNarrative.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <p className="text-pretty text-base leading-relaxed text-muted md:text-lg">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.16em] text-subtle">How I work</h3>
            <ol className="flex flex-col divide-y divide-line border-y border-line">
              {principles.map((principle, index) => (
                <li key={principle.title} className="grid grid-cols-[2rem_1fr] gap-x-3 py-5">
                  <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-medium text-foreground">{principle.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{principle.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
