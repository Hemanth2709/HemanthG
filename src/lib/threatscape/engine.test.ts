import { describe, expect, it } from "vitest";

import { connect, connectionError, defaultGraph, disconnect, evaluate, findPath, removeNode } from "./engine";
import { SCENARIOS } from "./scenarios";
import type { ControlId } from "./types";

const sqli = SCENARIOS["sql-injection"]!;
const none = new Set<ControlId>();

describe("findPath", () => {
  it("follows the request flow from the browser to the database", () => {
    expect(findPath(defaultGraph(), "client", "db")).toEqual(["client", "waf", "web", "api", "db"]);
  });

  it("never routes through monitoring edges", () => {
    // monitor -> db exists, but monitoring observes; it does not carry requests.
    const path = findPath(defaultGraph(), "client", "db")!;
    expect(path).not.toContain("monitor");
  });

  it("takes the shortest route, so a direct link bypasses the WAF", () => {
    const graph = connect(defaultGraph(), "client", "web");
    expect(findPath(graph, "client", "db")).toEqual(["client", "web", "api", "db"]);
  });

  it("returns null when the target is unreachable", () => {
    const graph = disconnect(defaultGraph(), "e-api-db");
    expect(findPath(graph, "client", "db")).toBeNull();
  });
});

describe("evaluate: SQL injection", () => {
  it("is open with no controls", () => {
    const result = evaluate(defaultGraph(), sqli, none);
    expect(result.outcome).toBe("open");
    expect(result.steps.map((step) => step.kind)).toEqual(["client", "waf", "web", "api", "db"]);
  });

  it("is blocked at the API by parameterized queries, and later steps are unreached", () => {
    const result = evaluate(defaultGraph(), sqli, new Set<ControlId>(["parameterized-queries"]));
    expect(result.outcome).toBe("blocked");
    const api = result.steps.find((step) => step.kind === "api")!;
    expect(api.effects.map((effect) => effect.control)).toContain("parameterized-queries");
    expect(result.steps.find((step) => step.kind === "db")!.unreached).toBe(true);
  });

  it("is only reduced by the WAF", () => {
    expect(evaluate(defaultGraph(), sqli, new Set<ControlId>(["waf-rules"])).outcome).toBe("reduced");
  });

  it("marks the WAF control inactive when the WAF is bypassed", () => {
    const graph = connect(defaultGraph(), "client", "web");
    const result = evaluate(graph, sqli, new Set<ControlId>(["waf-rules"]));
    expect(result.outcome).toBe("open");
    expect(result.inactive).toEqual(["waf-rules"]);
  });

  it("detects through monitoring that watches a component on the path", () => {
    const result = evaluate(defaultGraph(), sqli, new Set<ControlId>(["runtime-monitoring"]));
    expect(result.outcome).toBe("detected");
  });

  it("does not detect when the monitor is removed", () => {
    const result = evaluate(removeNode(defaultGraph(), "monitor"), sqli, new Set<ControlId>(["runtime-monitoring"]));
    expect(result.outcome).toBe("open");
    expect(result.inactive).toEqual(["runtime-monitoring"]);
  });

  it("reports no path when the API cannot reach the database", () => {
    const result = evaluate(disconnect(defaultGraph(), "e-api-db"), sqli, none);
    expect(result.outcome).toBe("no-path");
    expect(result.steps).toEqual([]);
  });

  it("prefers blocked over reduced when both apply", () => {
    const result = evaluate(defaultGraph(), sqli, new Set<ControlId>(["waf-rules", "parameterized-queries"]));
    expect(result.outcome).toBe("blocked");
  });
});

describe("connectionError", () => {
  it("rejects self-loops, duplicates and nonsensical directions", () => {
    const graph = defaultGraph();
    expect(connectionError(graph, "api", "api")).toMatch(/itself/);
    expect(connectionError(graph, "client", "waf")).toMatch(/Already/);
    expect(connectionError(graph, "db", "client")).toMatch(/does not connect/);
    expect(connectionError(graph, "client", "web")).toBeNull();
  });
});

describe("all scenarios", () => {
  const all = Object.values(SCENARIOS).filter((s): s is NonNullable<typeof s> => Boolean(s));

  it("covers the seven scenarios in the brief", () => {
    expect(all.map((s) => s.id).sort()).toEqual(
      ["credential-exposure", "ddos", "idor", "privilege-escalation", "sql-injection", "ssrf", "xss"].sort(),
    );
  });

  it.each(all.map((s) => [s.id, s] as const))("%s has a path in the default architecture and is open with no controls", (_id, scenario) => {
    const result = evaluate(defaultGraph(), scenario, none);
    expect(result.path).not.toBeNull();
    expect(result.outcome).toBe("open");
  });

  it.each(all.map((s) => [s.id, s] as const))("%s explains every control and never claims a single control fixes DDoS", (_id, scenario) => {
    for (const item of scenario.controls) expect(item.note.length).toBeGreaterThan(20);
    if (scenario.id === "ddos") expect(scenario.controls.every((item) => item.effect !== "blocks")).toBe(true);
  });

  it("XSS monitoring is inactive until monitoring observes the web app", () => {
    const xss = SCENARIOS.xss!;
    const on = new Set<ControlId>(["runtime-monitoring"]);
    expect(evaluate(defaultGraph(), xss, on).inactive).toEqual(["runtime-monitoring"]);
    const watched = connect(defaultGraph(), "monitor", "web");
    expect(evaluate(watched, xss, on).outcome).toBe("detected");
  });

  it("rate limiting needs an API gateway on the path", () => {
    const idor = SCENARIOS.idor!;
    expect(evaluate(defaultGraph(), idor, new Set<ControlId>(["rate-limiting"])).inactive).toEqual(["rate-limiting"]);
  });

  it("SAST blocks XSS at the web app (control placed per scenario)", () => {
    const result = evaluate(defaultGraph(), SCENARIOS.xss!, new Set<ControlId>(["sast"]));
    expect(result.outcome).toBe("blocked");
    expect(result.steps.find((step) => step.kind === "web")!.effects[0]!.control).toBe("sast");
  });
});
