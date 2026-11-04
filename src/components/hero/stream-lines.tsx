import { cn } from "@/lib/utils";

import type { Frame, RenderLine, Tone } from "./workflow-engine";

/*
 * Presentational pieces of the session, with no hooks, so the server can
 * render the first frame as plain HTML (static-session.tsx) and the client
 * animation renders exactly the same markup (code-stream.tsx).
 */

export const STAGE_CLASS = "flex h-full flex-col gap-5 font-mono text-[11px] leading-[1.55] md:text-[12px] lg:text-[12.5px]";
export const BOX_CLASS = "relative h-full overflow-hidden";
export const LIST_CLASS = "absolute inset-x-0 top-0 flex flex-col gap-[0.35em]";

const TONE: Record<Tone, string> = {
  plain: "text-foreground/80",
  muted: "text-muted/80",
  info: "text-cyan",
  ok: "text-success",
  warn: "text-warn",
  crit: "text-error",
};

const RESULT_TEXT = { pass: "passed", warn: "warning", crit: "finding" } as const;
const RESULT_TONE = { pending: "text-cyan", pass: "text-success", warn: "text-warn", crit: "text-error" } as const;

function Glyph({ state }: { state: "pending" | "pass" | "warn" | "crit" }) {
  if (state === "pending") return <span className="hero-spin inline-block size-2.5 rounded-full border border-cyan/70 border-t-transparent" />;
  return <span className={cn("inline-block w-2.5 text-center", RESULT_TONE[state])}>{state === "pass" ? "✓" : state === "warn" ? "!" : "✕"}</span>;
}

function Line({ line }: { line: RenderLine }) {
  switch (line.kind) {
    case "cmd":
      return (
        <div className="flex gap-2 whitespace-pre">
          <span className="text-cyan/70">{line.cwd}</span>
          <span className="text-faint">$</span>
          <span className="text-foreground">
            {line.text}
            {line.typing ? <span className="hero-caret" /> : null}
          </span>
        </div>
      );
    case "line":
      return <div className={cn("whitespace-pre", TONE[line.tone])}>{line.text}</div>;
    case "check":
      return (
        <div
          className={cn(
            "relative -mx-2 flex items-center gap-2.5 rounded-sm px-2",
            line.state === "pending" && "hero-scan",
            line.state === "crit" && "bg-error/[0.06]",
          )}
        >
          <Glyph state={line.state} />
          <span className="min-w-0 truncate text-foreground/85">{line.label}</span>
          {line.detail ? <span className="shrink-0 text-faint">{line.detail}</span> : null}
          <span key={line.state} className={cn("ml-auto shrink-0 pl-3", RESULT_TONE[line.state], line.state !== "pending" && "hero-flash")}>
            {line.state === "pending" ? "running" : (line.resultText ?? RESULT_TEXT[line.state])}
          </span>
        </div>
      );
    case "progress":
      return (
        <div className="flex items-center gap-3">
          <span className="text-muted/90">{line.label}</span>
          <span className="relative h-[3px] w-28 shrink-0 overflow-hidden rounded-full bg-line-strong">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-electric to-cyan"
              style={{ width: `${Math.round(line.fraction * 100)}%` }}
            />
          </span>
          <span className="w-9 text-right tabular-nums text-faint">{Math.round(line.fraction * 100)}%</span>
        </div>
      );
  }
}

/** `still`: keys of lines already on screen, which must not fade in again (the static → live swap). */
export function StreamLines({ frame, maxLines = 18, still }: { frame: Frame; maxLines?: number; still?: Set<string> }) {
  return (
    <>
      {frame.lines.slice(-maxLines).map((line) => (
        <div key={line.key} className={still?.has(line.key) ? undefined : "hero-line-in"}>
          <Line line={line} />
        </div>
      ))}
      {frame.phase !== "run" ? (
        <div className="flex gap-2">
          <span className="text-cyan/70">{frame.lines[0]?.kind === "cmd" ? frame.lines[0].cwd : "~"}</span>
          <span className="text-faint">$</span>
          <span className="hero-caret hero-caret-idle" />
        </div>
      ) : null}
    </>
  );
}
