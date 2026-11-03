import { site } from "@/data/site";

/** Personal wordmark: a small bordered monogram and the name. */
export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className="flex size-7 items-center justify-center rounded-md border border-line-strong font-mono text-[10px] font-semibold tracking-wider text-accent"
      >
        {site.initials}
      </span>
      <span className="text-sm font-medium tracking-tight text-foreground">{site.name}</span>
    </span>
  );
}
