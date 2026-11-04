import { CATALOGUE, canConnect } from "./catalogue";
import { CONTROLS } from "./controls";
import type {
  ComponentKind,
  ControlId,
  Evaluation,
  Graph,
  GraphEdge,
  GraphNode,
  Outcome,
  ScenarioDef,
  StepResult,
} from "./types";

/**
 * Edges from these kinds describe observation or hosting, not request flow:
 * monitoring watches a component, a container runtime hosts one. They are
 * never part of an attack path, but controls on them act on what they
 * watch or host.
 */
const NON_FLOW: ComponentKind[] = ["monitor", "container"];

function kindOf(graph: Graph, id: string): ComponentKind | undefined {
  return graph.nodes.find((node) => node.id === id)?.kind;
}

export function isFlowEdge(graph: Graph, edge: GraphEdge): boolean {
  const kind = kindOf(graph, edge.source);
  return kind !== undefined && !NON_FLOW.includes(kind);
}

/**
 * Shortest request path from any `entry` component to any `target`
 * component, following flow edges in their direction. Shortest is what an
 * attacker takes: if the browser can reach the web app without passing the
 * WAF, the WAF is not on the path.
 */
export function findPath(graph: Graph, entry: ComponentKind, target: ComponentKind): string[] | null {
  const adjacency = new Map<string, string[]>();
  for (const edge of graph.edges) {
    if (!isFlowEdge(graph, edge)) continue;
    adjacency.set(edge.source, [...(adjacency.get(edge.source) ?? []), edge.target]);
  }
  const starts = graph.nodes.filter((node) => node.kind === entry).map((node) => node.id);
  const previous = new Map<string, string | null>(starts.map((id) => [id, null]));
  const queue = [...starts];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (kindOf(graph, current) === target && !starts.includes(current)) {
      const path: string[] = [];
      for (let at: string | null = current; at !== null; at = previous.get(at) ?? null) path.unshift(at);
      return path;
    }
    for (const next of adjacency.get(current) ?? []) {
      if (!previous.has(next)) {
        previous.set(next, current);
        queue.push(next);
      }
    }
  }
  return null;
}

/** Nodes on the path that a component of `kind` observes or hosts (via its outgoing edges). */
function attachedTo(graph: Graph, kind: ComponentKind, path: string[]): string[] {
  const sources = new Set(graph.nodes.filter((node) => node.kind === kind).map((node) => node.id));
  return path.filter((id) => graph.edges.some((edge) => sources.has(edge.source) && edge.target === id));
}

/**
 * Evaluate a scenario against the current architecture and applied
 * controls. Pure: same inputs, same result.
 */
export function evaluate(graph: Graph, scenario: ScenarioDef, applied: ReadonlySet<ControlId>): Evaluation {
  const path = findPath(graph, scenario.entry, scenario.target);
  const relevant = scenario.controls.filter((item) => applied.has(item.control));

  if (!path) {
    return { outcome: "no-path", path: null, steps: [], inactive: relevant.map((item) => item.control) };
  }

  const steps: StepResult[] = path.map((nodeId) => {
    const kind = kindOf(graph, nodeId)!;
    const step = scenario.steps.find((item) => item.kind === kind);
    return {
      nodeId,
      kind,
      text: step?.text ?? `The request passes through the ${CATALOGUE[kind].label.toLowerCase()}.`,
      sample: step?.sample,
      effects: [],
      unreached: false,
    };
  });

  const inactive: ControlId[] = [];
  for (const item of relevant) {
    const where = CONTROLS[item.control].appliesTo;
    // Monitoring and container controls act on what they observe or host;
    // every other control acts at a component of its kind on the path.
    const targets = NON_FLOW.includes(where)
      ? attachedTo(graph, where, path)
      : path.filter((id) => kindOf(graph, id) === where);
    const first = targets[0];
    if (!first) {
      inactive.push(item.control);
      continue;
    }
    steps.find((step) => step.nodeId === first)!.effects.push({ control: item.control, effect: item.effect, note: item.note });
  }

  let outcome: Outcome = "open";
  let blocked = false;
  for (const step of steps) {
    if (blocked) {
      step.unreached = true;
      continue;
    }
    if (step.effects.some((effect) => effect.effect === "blocks")) blocked = true;
  }
  const all = steps.flatMap((step) => (step.unreached ? [] : step.effects));
  if (blocked) outcome = "blocked";
  else if (all.some((effect) => effect.effect === "reduces")) outcome = "reduced";
  else if (all.some((effect) => effect.effect === "detects")) outcome = "detected";

  return { outcome, path, steps, inactive };
}

/** Validate a proposed connection: known nodes, sensible direction, no duplicates or self-loops. */
export function connectionError(graph: Graph, source: string, target: string): string | null {
  if (source === target) return "A component cannot connect to itself.";
  const from = kindOf(graph, source);
  const to = kindOf(graph, target);
  if (!from || !to) return "Unknown component.";
  if (graph.edges.some((edge) => edge.source === source && edge.target === target)) return "Already connected.";
  if (!canConnect(from, to)) {
    return `${CATALOGUE[from].label} does not connect to ${CATALOGUE[to].label} in this model.`;
  }
  return null;
}

let counter = 0;
export function newNodeId(kind: ComponentKind): string {
  counter += 1;
  return `${kind}-${Date.now().toString(36)}-${counter}`;
}

export function addNode(graph: Graph, kind: ComponentKind, x: number, y: number): { graph: Graph; node: GraphNode } {
  const node: GraphNode = { id: newNodeId(kind), kind, x, y };
  return { graph: { ...graph, nodes: [...graph.nodes, node] }, node };
}

export function removeNode(graph: Graph, id: string): Graph {
  return {
    nodes: graph.nodes.filter((node) => node.id !== id),
    edges: graph.edges.filter((edge) => edge.source !== id && edge.target !== id),
  };
}

export function connect(graph: Graph, source: string, target: string): Graph {
  if (connectionError(graph, source, target)) return graph;
  return { ...graph, edges: [...graph.edges, { id: `e-${source}-${target}`, source, target }] };
}

export function disconnect(graph: Graph, edgeId: string): Graph {
  return { ...graph, edges: graph.edges.filter((edge) => edge.id !== edgeId) };
}

/** Starting architecture: a typical Next.js + NestJS deployment. */
export function defaultGraph(): Graph {
  const nodes: GraphNode[] = [
    { id: "client", kind: "client", x: 0, y: 130 },
    { id: "waf", kind: "waf", x: 165, y: 130 },
    { id: "web", kind: "web", x: 330, y: 40 },
    { id: "api", kind: "api", x: 495, y: 130 },
    { id: "db", kind: "db", x: 660, y: 130 },
    { id: "auth", kind: "auth", x: 495, y: 280 },
    { id: "secrets", kind: "secrets", x: 660, y: 280 },
    { id: "monitor", kind: "monitor", x: 330, y: 280 },
  ];
  const pairs: [string, string][] = [
    ["client", "waf"],
    ["waf", "web"],
    ["web", "api"],
    ["api", "db"],
    ["api", "auth"],
    ["api", "secrets"],
    ["monitor", "api"],
    ["monitor", "db"],
  ];
  return { nodes, edges: pairs.map(([source, target]) => ({ id: `e-${source}-${target}`, source, target })) };
}
