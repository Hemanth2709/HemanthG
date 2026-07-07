import { Quote } from "lucide-react";

import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="scroll-mt-24 py-28 md:py-40" aria-label="Testimonials">
      <div className="container-site">
        <SectionHeading
          eyebrow="Testimonials"
          title="Words from collaborators."
          align="center"
        />

        {testimonials.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={index} delay={(index % 3) * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7">
                  <Quote className="mb-4 size-5 text-accent" aria-hidden />
                  <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-6">
                    <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-xs text-subtle">{testimonial.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-dashed border-line-strong p-10 text-center md:p-14">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(139,147,255,0.05), transparent 70%)",
                }}
              />
              <Quote className="mx-auto mb-5 size-6 text-accent" aria-hidden />
              <p className="text-pretty text-lg leading-relaxed text-muted">
                This space is reserved for the people I build with next.
              </p>
              <p className="mt-3 text-sm text-subtle">
                Worked with me?{" "}
                <a
                  href={`mailto:${site.email}?subject=Recommendation for ${site.name}`}
                  className="text-accent transition-colors hover:text-accent-bright"
                >
                  I'd love a few words.
                </a>
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
