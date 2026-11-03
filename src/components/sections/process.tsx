import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/data/process";

export function Process() {
  return (
    <section id="approach" className="scroll-mt-20 border-t border-line py-24 md:py-32" aria-label="Approach">
      <div className="container-site">
        <SectionHeading
          eyebrow="Approach"
          title="How a rule gets made"
          description="Every rule in Sentinel-Security went through the same six steps. The last one feeds the first."
        />

        <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step.id} className="flex flex-col bg-background p-6">
              <Reveal delay={(index % 3) * 0.05} className="flex h-full flex-col">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{step.label}</h3>
                </div>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">{step.description}</p>
                <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 font-mono text-xs text-subtle">
                  {step.outputs.map((output) => (
                    <li key={output}>{output}</li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
