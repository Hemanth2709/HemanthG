import { Counter } from "@/components/effects/counter";
import { Reveal } from "@/components/effects/reveal";
import { stats } from "@/data/stats";

export function Stats() {
  return (
    <section className="border-y border-line bg-surface/50 py-20 md:py-24" aria-label="Statistics">
      <div className="container-site">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-5">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="flex flex-col items-center text-center">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="text-4xl font-semibold tracking-tight text-gradient md:text-5xl"
              />
              <p className="mt-3 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="mt-1 max-w-40 text-xs leading-relaxed text-subtle">{stat.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
