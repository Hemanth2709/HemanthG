import { Reveal } from "@/components/effects/reveal";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { aboutNarrative, principles } from "@/data/about";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-28 md:py-40" aria-label="About">
      <div className="container-site">
        <SectionHeading eyebrow="About" title={aboutNarrative.headline} />

        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            {aboutNarrative.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <p className="text-pretty text-base leading-relaxed text-muted md:text-lg">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.08}>
                <div className="group h-full rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:border-line-strong hover:bg-raised">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-accent-dim text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon name={principle.icon} className="size-5" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{principle.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{principle.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
