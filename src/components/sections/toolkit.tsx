import { Reveal } from "@/components/effects/reveal";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { toolkit } from "@/data/toolkit";

export function Toolkit() {
  return (
    <section id="toolkit" className="scroll-mt-24 py-28 md:py-40" aria-label="Technical toolkit">
      <div className="container-site">
        <SectionHeading
          eyebrow="Toolkit"
          title="Tools chosen deliberately."
          description="No percentage bars, no logo walls — just the technologies I reach for, grouped by the job they do."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {toolkit.map((category, index) => (
            <Reveal key={category.title} delay={(index % 5) * 0.06}>
              <div className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-raised">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-accent-dim text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon name={category.icon} className="size-4" />
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">{category.title}</h3>
                </div>
                <p className="mb-4 text-xs italic leading-relaxed text-subtle">{category.blurb}</p>
                <ul className="mt-auto flex flex-col gap-1.5">
                  {category.items.map((item) => (
                    <li key={item} className="text-sm text-muted transition-colors group-hover:text-foreground/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
