import { Reveal } from "@/components/effects/reveal";
import { ThreatscapeLoader } from "@/components/threatscape/loader";
import { SectionHeading } from "@/components/ui/section-heading";

/** THREATSCAPE: an interactive, simulated architecture to explore attacks and defences. */
export function Threatscape() {
  return (
    <section id="threatscape" className="scroll-mt-20 border-t border-line py-24 md:py-36" aria-label="Threatscape">
      <div className="container-site">
        <SectionHeading
          index="01"
          label="Threatscape"
          title={["Explore. Understand.", "Secure."]}
          description="A small model of a real web architecture. Inspect each part, change how it connects, follow an attack through it, and see what each defence does, and what it doesn't."
        />
        <Reveal>
          <ThreatscapeLoader />
        </Reveal>
        <p className="mt-4 font-mono text-[11px] text-subtle">
          A local simulation with synthetic data. Nothing is sent anywhere and nothing about you is collected.
        </p>
      </div>
    </section>
  );
}
