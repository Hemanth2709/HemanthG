import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TagList } from "@/components/ui/tag";
import { experience } from "@/data/experience";

export function Experience() {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-20 border-t border-line py-24 md:py-36" aria-label="Experience">
      <div className="container-site">
        <SectionHeading
          index="02"
          label="Experience"
          title={["Three roles.", "From mobile apps to production infrastructure."]}
        />

        <ol className="border-t border-line">
          {experience.map((entry, index) => (
            <li key={entry.company} className="grid gap-8 border-b border-line py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
              <Reveal className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <p className="font-mono text-xs text-subtle">
                    <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mx-2 text-faint">/</span>
                    {entry.period}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
                    {entry.company}
                  </h3>
                  <p className="mt-1.5 text-muted">{entry.role}</p>
                  <p className="mt-1 text-sm text-subtle">{entry.location}</p>
                  {entry.note ? <p className="mt-4 text-sm leading-relaxed text-muted">{entry.note}</p> : null}
                  <div className="mt-6">
                    <TagList items={entry.technologies} />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.06} className="flex flex-col gap-9 lg:col-span-7 lg:col-start-6">
                {entry.groups.map((group, groupIndex) => (
                  <div key={group.title ?? groupIndex}>
                    {group.title ? <h4 className="label mb-4">{group.title}</h4> : null}
                    <ul className="flex flex-col gap-3">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="grid grid-cols-[1.25rem_1fr] text-[15px] leading-relaxed text-muted"
                        >
                          <span aria-hidden className="mt-[0.7em] h-px w-2.5 bg-faint" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
