import { describe, expect, it } from "vitest";

import { WORKFLOWS } from "./workflow-data";
import { compile, frameAt, restingTime, signature, TIMING, type Workflow } from "./workflow-engine";

const demo: Workflow[] = [
  {
    id: "a",
    title: "A",
    cwd: "~",
    data: "simulated",
    steps: [
      { kind: "cmd", text: "ls" },
      { kind: "line", text: "ok", tone: "ok" },
      { kind: "progress", label: "scan", ms: 1000 },
      { kind: "check", label: "rule", result: "warn" },
    ],
  },
  { id: "b", title: "B", cwd: "~", data: "live", steps: [{ kind: "line", text: "b" }] },
];

describe("workflow engine", () => {
  const timeline = compile(demo);
  const cmdEnd = TIMING.cmdLead + 2 * TIMING.typeChar + TIMING.cmdTail;

  it("compiles consecutive, non-overlapping workflows", () => {
    const [a, b] = timeline.workflows;
    expect(a!.start).toBe(0);
    expect(b!.start).toBe(a!.end);
    expect(timeline.duration).toBe(a!.end + b!.end);
  });

  it("types commands progressively", () => {
    expect(frameAt(timeline, 0).lines[0]).toMatchObject({ kind: "cmd", text: "", typing: true });
    expect(frameAt(timeline, TIMING.cmdLead + TIMING.typeChar).lines[0]).toMatchObject({ text: "l", typing: true });
    expect(frameAt(timeline, cmdEnd).lines[0]).toMatchObject({ text: "ls", typing: false });
  });

  it("reveals output progressively and fills progress bars", () => {
    expect(frameAt(timeline, cmdEnd - 1).lines).toHaveLength(1);
    expect(frameAt(timeline, cmdEnd).lines).toHaveLength(2);
    const mid = frameAt(timeline, cmdEnd + TIMING.line + 500);
    expect(mid.lines[2]).toMatchObject({ kind: "progress" });
    expect((mid.lines[2] as { fraction: number }).fraction).toBeCloseTo(0.5, 2);
    expect(mid.scanning).toBe(true);
  });

  it("runs a check as pending, then resolves it", () => {
    const checkStart = cmdEnd + TIMING.line + 1000;
    expect(frameAt(timeline, checkStart + 10).lines[3]).toMatchObject({ kind: "check", state: "pending" });
    const done = frameAt(timeline, checkStart + TIMING.check);
    expect(done.lines[3]).toMatchObject({ state: "warn" });
    expect(done.counts.warn).toBe(1);
    expect(done.phase).toBe("hold");
    expect(done.progress).toBe(1);
  });

  it("leaves, moves to the next workflow, and loops", () => {
    const [a] = timeline.workflows;
    expect(frameAt(timeline, a!.end - 1).phase).toBe("leave");
    expect(frameAt(timeline, a!.end).index).toBe(1);
    expect(frameAt(timeline, timeline.duration).index).toBe(0);
    expect(frameAt(timeline, timeline.duration + 5)).toEqual(frameAt(timeline, 5));
  });

  it("is deterministic", () => {
    expect(frameAt(timeline, 1234)).toEqual(frameAt(timeline, 1234));
    expect(signature(frameAt(timeline, 1234))).toBe(signature(frameAt(timeline, 1234)));
  });

  it("rests on the completed first workflow (SSR and reduced motion)", () => {
    const frame = frameAt(timeline, restingTime(timeline));
    expect(frame.index).toBe(0);
    expect(frame.phase).toBe("hold");
    expect(frame.lines).toHaveLength(4);
  });
});

describe("workflow data", () => {
  it("contains no destructive or offensive commands", () => {
    const banned = /\brm -rf\b|mkfs|dd if=|nmap|hydra|sqlmap|metasploit|msfconsole|nc -e|\/etc\/shadow|curl[^|]*\|\s*(ba)?sh|chmod 777|DROP TABLE|' OR 1=1/i;
    for (const workflow of WORKFLOWS) {
      for (const step of workflow.steps) {
        const text =
          step.kind === "cmd" || step.kind === "line"
            ? step.text
            : step.kind === "check"
              ? `${step.label} ${step.detail ?? ""}`
              : step.kind === "progress"
                ? step.label
                : "";
        expect(text).not.toMatch(banned);
      }
    }
  });

  it("starts with the SentinelRules workflow and marks every static workflow as simulated", () => {
    expect(WORKFLOWS[0]!.id).toBe("sentinel");
    expect(WORKFLOWS.every((w) => w.data === "simulated")).toBe(true);
  });
});
