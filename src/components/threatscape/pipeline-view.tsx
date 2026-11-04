"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { PIPELINE } from "@/lib/threatscape/pipeline";
import { cn } from "@/lib/utils";

/** DevSecOps view: a secure delivery pipeline, one stage at a time. */
export function PipelineView({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState("sast");
  const stage = PIPELINE.find((item) => item.id === active) ?? PIPELINE[0]!;
  return (
    <div className={cn("flex h-full flex-col", compact ? "gap-4" : "gap-6 p-5")}>
      <ol className={cn("flex", compact ? "flex-col gap-1.5" : "flex-wrap items-center gap-y-3")} aria-label="Delivery pipeline">
        {PIPELINE.map((item, index) => (
          <li key={item.id} className={cn("flex items-center", compact && "w-full")}>
            <button
              type="button"
              onClick={() => setActive(item.id)}
              aria-pressed={active === item.id}
              className={cn(
                "rounded-md border px-3 py-2 text-left text-[13px] transition-colors",
                compact && "w-full",
                active === item.id ? "border-defence bg-defence-dim text-foreground" : "border-line-strong text-muted hover:text-foreground",
              )}
            >
              <span className="mr-2 font-mono text-[10.5px] text-subtle">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
            {!compact && index < PIPELINE.length - 1 ? <ArrowRight aria-hidden className="mx-1.5 size-3.5 text-faint" /> : null}
          </li>
        ))}
      </ol>

      <div className={cn("grid gap-6", !compact && "md:grid-cols-[1.2fr_1fr]")} aria-live="polite">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-defence">Stage {PIPELINE.indexOf(stage) + 1}</p>
          <h3 className="mt-1 font-display text-2xl font-medium text-foreground">{stage.label}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{stage.what}</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <h4 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">Helps catch</h4>
              <ul className="mt-1.5 list-disc pl-4 text-sm leading-relaxed text-muted">
                {stage.catches.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">Typical tools</h4>
              <ul className="mt-1.5 list-disc pl-4 text-sm leading-relaxed text-muted">
                {stage.tools.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <h4 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">In my work</h4>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{stage.mine.text}</p>
          {stage.mine.link ? (
            <a
              href={stage.mine.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex items-center gap-1 text-sm text-accent hover:text-accent-bright"
            >
              {stage.mine.link.label}
              <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
        </div>
      </div>
      <p className="text-xs text-subtle">No single stage makes delivery secure; each catches a different class of problem.</p>
    </div>
  );
}
