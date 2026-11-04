/**
 * Deterministic timeline for the hero's simulated security session.
 *
 * Workflows (data) are compiled once into a timeline with fixed start and
 * end times for every step. `frameAt(timeline, t)` is a pure function that
 * returns exactly what should be on screen at time t: no random timers and
 * no independent animations. The component only advances one clock.
 */

export type Tone = "plain" | "muted" | "info" | "ok" | "warn" | "crit";
export type CheckResult = "pass" | "warn" | "crit";

export type Step =
  /** A command typed character by character. */
  | { kind: "cmd"; text: string }
  /** An output line that appears at once. */
  | { kind: "line"; text: string; tone?: Tone }
  /** A check that runs (pending) and then resolves. */
  | { kind: "check"; label: string; detail?: string; result: CheckResult; resultText?: string; ms?: number }
  /** A progress bar that fills over `ms`. */
  | { kind: "progress"; label: string; ms: number }
  | { kind: "pause"; ms: number };

export interface Workflow {
  id: string;
  /** Shown in the telemetry strip, e.g. "SentinelRules analysis". */
  title: string;
  /** Prompt shown before commands, e.g. "~/sentinel-rules". */
  cwd: string;
  /** Whether the output is real public data (threat intel) or illustrative. */
  data: "simulated" | "live";
  steps: Step[];
}

export const TIMING = {
  typeChar: 32,
  cmdLead: 280,
  cmdTail: 340,
  line: 150,
  check: 520,
  hold: 2800,
  leave: 650,
};
export type Timing = typeof TIMING;

interface TimedStep {
  step: Step;
  start: number;
  end: number;
}

interface TimedWorkflow {
  workflow: Workflow;
  start: number;
  /** When the last step finishes. */
  runEnd: number;
  /** Includes the hold and the leave transition. */
  end: number;
  steps: TimedStep[];
}

export interface Timeline {
  workflows: TimedWorkflow[];
  duration: number;
  timing: Timing;
}

function stepDuration(step: Step, timing: Timing): number {
  switch (step.kind) {
    case "cmd":
      return timing.cmdLead + step.text.length * timing.typeChar + timing.cmdTail;
    case "line":
      return timing.line;
    case "check":
      return step.ms ?? timing.check;
    case "progress":
    case "pause":
      return step.ms;
  }
}

export function compile(workflows: Workflow[], timing: Timing = TIMING): Timeline {
  let cursor = 0;
  const timed = workflows.map((workflow) => {
    const start = cursor;
    let local = 0;
    const steps = workflow.steps.map((step) => {
      const from = local;
      local += stepDuration(step, timing);
      return { step, start: from, end: local };
    });
    const runEnd = local;
    const end = runEnd + timing.hold + timing.leave;
    cursor += end;
    return { workflow, start, runEnd, end, steps };
  });
  return { workflows: timed, duration: cursor, timing };
}

export type RenderLine =
  | { key: string; kind: "cmd"; cwd: string; text: string; typing: boolean }
  | { key: string; kind: "line"; text: string; tone: Tone }
  | {
      key: string;
      kind: "check";
      label: string;
      detail?: string;
      state: "pending" | CheckResult;
      resultText?: string;
    }
  | { key: string; kind: "progress"; label: string; fraction: number };

export interface Frame {
  index: number;
  total: number;
  workflow: Pick<Workflow, "id" | "title" | "data">;
  lines: RenderLine[];
  phase: "run" | "hold" | "leave";
  /** 0 → 1 during the leave transition. */
  leave: number;
  /** Share of this workflow's steps that have finished, 0 → 1. */
  progress: number;
  /** A progress bar or a check is running right now. */
  scanning: boolean;
  counts: Record<CheckResult, number>;
}

/** Start of the first workflow's hold: everything typed, nothing leaving. Used for SSR and reduced motion. */
export function restingTime(timeline: Timeline): number {
  return timeline.workflows[0]?.runEnd ?? 0;
}

export function frameAt(timeline: Timeline, time: number): Frame {
  const { workflows, duration, timing } = timeline;
  const t = duration > 0 ? ((time % duration) + duration) % duration : 0;
  const index = Math.max(
    0,
    workflows.findIndex((w) => t < w.start + w.end),
  );
  const current = workflows[index]!;
  const local = t - current.start;

  const lines: RenderLine[] = [];
  const counts: Record<CheckResult, number> = { pass: 0, warn: 0, crit: 0 };
  let finished = 0;
  let scanning = false;

  current.steps.forEach(({ step, start, end }, i) => {
    if (local < start) return;
    const running = local < end;
    if (!running) finished += 1;
    const key = `${current.workflow.id}-${i}`;
    switch (step.kind) {
      case "cmd": {
        const typed = running
          ? Math.min(step.text.length, Math.max(0, Math.floor((local - start - timing.cmdLead) / timing.typeChar)))
          : step.text.length;
        lines.push({ key, kind: "cmd", cwd: current.workflow.cwd, text: step.text.slice(0, typed), typing: running });
        break;
      }
      case "line":
        lines.push({ key, kind: "line", text: step.text, tone: step.tone ?? "plain" });
        break;
      case "check":
        if (running) scanning = true;
        else counts[step.result] += 1;
        lines.push({
          key,
          kind: "check",
          label: step.label,
          detail: step.detail,
          state: running ? "pending" : step.result,
          resultText: step.resultText,
        });
        break;
      case "progress":
        if (running) scanning = true;
        lines.push({ key, kind: "progress", label: step.label, fraction: running ? (local - start) / (end - start) : 1 });
        break;
      case "pause":
        break;
    }
  });

  const leaveStart = current.end - timing.leave;
  const phase = local < current.runEnd ? "run" : local < leaveStart ? "hold" : "leave";

  return {
    index,
    total: workflows.length,
    workflow: { id: current.workflow.id, title: current.workflow.title, data: current.workflow.data },
    lines,
    phase,
    leave: phase === "leave" ? (local - leaveStart) / timing.leave : 0,
    progress: current.steps.length ? finished / current.steps.length : 1,
    scanning,
    counts,
  };
}

/** Cheap identity for a frame, so the component re-renders only when something visible changed. */
export function signature(frame: Frame): string {
  const last = frame.lines[frame.lines.length - 1];
  let tail = "";
  if (last?.kind === "cmd") tail = `${last.text.length}${last.typing ? "t" : ""}`;
  else if (last?.kind === "check") tail = last.state;
  else if (last?.kind === "progress") tail = String(Math.round(last.fraction * 50));
  return `${frame.index}|${frame.lines.length}|${tail}|${frame.phase}|${Math.round(frame.leave * 12)}`;
}
