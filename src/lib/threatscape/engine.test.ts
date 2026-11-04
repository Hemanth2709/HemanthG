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
