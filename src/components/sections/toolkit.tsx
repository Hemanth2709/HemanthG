import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { toolkit } from "@/data/toolkit";

export function Toolkit() {
  return (
    <section id="toolkit" className="scroll-mt-20 border-t border-line py-24 md:py-32" aria-label="Toolkit">
      <div className="container-site">
        <SectionHeading
          eyebrow="Toolkit"
          title="What I work with"
          description="Listed only if it's used in the work on this page or in my public repositories."
        />

        <Reveal>
          <dl className="divide-y divide-line border-y border-line">
            {toolkit.map((category) => (
              <div key={category.title} className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="font-mono text-xs uppercase tracking-[0.16em] text-subtle sm:pt-0.5">
                  {category.title}
                </dt>
                <dd className="flex flex-wrap gap-x-5 gap-y-1 text-foreground">
                  {category.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
