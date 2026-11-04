import { cn } from "@/lib/utils";

import type { Frame } from "./workflow-engine";

/** Telemetry strip above the stream. Everything is derived from the same frame. */
export function SessionHeader({ frame, titles }: { frame: Frame; titles: string[] }) {
  const live = frame.workflow.data === "live";
  return (
    <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase">
      <div className="flex items-center gap-3 text-subtle">
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
          <span className={cn("size-1.5 rounded-full", live ? "bg-success" : "bg-violet", frame.scanning && "hero-blink")} />
          {live ? "Real public data" : "Simulated session"}
        </span>
        <span className="hidden text-faint sm:inline">·</span>
        <span className="shrink-0 tabular-nums text-muted">
          {String(frame.index + 1).padStart(2, "0")}/{String(frame.total).padStart(2, "0")}
        </span>
        <span className="truncate text-foreground/80 normal-case tracking-normal">{frame.workflow.title}</span>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5" aria-hidden>
        {titles.map((title, i) => (
          <span
            key={title}
            className={cn(
              "h-[2px] flex-1 overflow-hidden rounded-full",
              i < frame.index ? "bg-cyan/35" : "bg-line-strong",
            )}
          >
            {i === frame.index ? (
              <span
                className="block h-full rounded-full bg-gradient-to-r from-electric to-cyan transition-[width] duration-300 ease-out"
                style={{ width: `${Math.round(frame.progress * 100)}%` }}
              />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SessionFooter({ frame }: { frame: Frame }) {
  const { pass, warn, crit } = frame.counts;
  return (
    <div className="hidden flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10.5px] text-subtle md:flex">
      <span className="tabular-nums">
        <span className="text-success">✓</span> {pass} passed
      </span>
      <span className="tabular-nums">
        <span className="text-warn">!</span> {warn} to review
      </span>
      <span className="tabular-nums">
        <span className="text-error">✕</span> {crit} {crit === 1 ? "finding" : "findings"}
      </span>
      <span className="ml-auto text-faint">
        {frame.workflow.data === "live" ? "CISA KEV · NVD, refreshed every 6 h" : "illustrative output · not a live scan"}
      </span>
    </div>
  );
}
