import { stats } from "@/data/stats";

/** Static figures from Sentinel-Security v0.1.1. No count-up: they're data, not decoration. */
export function Stats() {
  return (
    <section className="border-t border-line" aria-label="Sentinel-Security v0.1.1 in numbers">
      <div className="container-site py-10 md:py-12">
        <p className="mb-6 font-mono text-xs text-subtle">Sentinel-Security v0.1.1</p>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-5">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col bg-background p-5 ${index === stats.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <dt className="order-2 mt-1 text-sm text-foreground">{stat.label}</dt>
              <dd className="order-1 font-mono text-3xl font-medium tracking-tight text-foreground tabular-nums">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </dd>
              <dd className="order-3 mt-1 text-xs leading-relaxed text-subtle">{stat.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
