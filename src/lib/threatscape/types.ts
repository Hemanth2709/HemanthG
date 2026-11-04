/**
 * Threatscape shared model. The 2D graph editor and the 3D view both read
 * this state; nothing here touches the DOM, so the logic is unit-testable.
 * Everything is a local simulation with synthetic data.
 */

export type ComponentKind =
  | "client"
  | "cdn"
  | "waf"
  | "gateway"
  | "web"
  | "api"
  | "auth"
  | "db"
  | "cache"
  | "secrets"
  | "container"
  | "monitor";

/** Where a component sits, used for layout lanes and colour. */
export type Zone = "internet" | "edge" | "app" | "data" | "platform";

export interface Reference {
  label: string;
  href: string;
}

/** The contextual panel content required by the brief (section 4.6). */
export interface Explainer {
  what: string;
  why: string;
  example: string;
  risks: string[];
  defences: string[];
  /** Only mappings that genuinely apply. */
  cwe?: string[];
  owasp?: string[];
  related?: Reference;
}

export interface ComponentDef {
  kind: ComponentKind;
  label: string;
  /** Short technology hint shown under the label. */
  tech: string;
  zone: Zone;
  explain: Explainer;
}

export interface GraphNode {
  id: string;
  kind: ComponentKind;
  /** Position on the 2D canvas (flow coordinates). */
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type ScenarioId = "sql-injection" | "xss" | "idor" | "ssrf" | "credential-exposure" | "ddos" | "privilege-escalation";

export type ControlId =
  | "parameterized-queries"
  | "waf-rules"
  | "least-privilege-db"
  | "runtime-monitoring"
  | "sast"
  | "output-encoding-csp"
  | "object-authorization"
  | "egress-allowlist"
  | "secrets-manager"
  | "rate-limiting"
  | "cdn-shield"
  | "iam-least-privilege"
  | "container-scanning"
  | "dependency-scanning"
  | "input-allowlist";

/** What a control does to the attack at the step where it applies. */
export type Effect = "blocks" | "reduces" | "detects";

export interface ControlDef {
  id: ControlId;
  label: string;
  /** The control only takes effect if a component of this kind is on the path. */
  appliesTo: ComponentKind;
  summary: string;
  /** What risk it reduces. */
  reduces: string;
  /** What it does not solve (the brief requires saying this every time). */
  doesNotSolve: string;
  related?: Reference;
}

export interface ScenarioStep {
  kind: ComponentKind;
  /** What happens at this component during the simulated attack. */
  text: string;
  /** Synthetic request or payload shown for this step, if any. */
  sample?: string;
}

export interface ScenarioControl {
  control: ControlId;
  effect: Effect;
  /** Where the control acts in this scenario, if not its default component. */
  at?: ComponentKind;
  /** Why this control has this effect in this scenario. */
  note: string;
}

export interface ScenarioDef {
  id: ScenarioId;
  title: string;
  summary: string;
  cwe: string[];
  owasp: string[];
  /** The attack starts at a component of this kind... */
  entry: ComponentKind;
  /** ...and succeeds if it reaches one of this kind. */
  target: ComponentKind;
  preconditions: string[];
  impact: string;
  /** Step text per component kind; kinds without text are pass-through. */
  steps: ScenarioStep[];
  controls: ScenarioControl[];
  related?: Reference;
}

export type Outcome = "no-path" | "open" | "detected" | "reduced" | "blocked";

export interface StepResult {
  nodeId: string;
  kind: ComponentKind;
  text: string;
  sample?: string;
  /** Applied controls that act at this step, with their effect. */
  effects: { control: ControlId; effect: Effect; note: string }[];
  /** True once an earlier step blocked the attack. */
  unreached: boolean;
}

export interface Evaluation {
  outcome: Outcome;
  /** Node ids from entry to target, or null when no path exists. */
  path: string[] | null;
  steps: StepResult[];
  /** Controls the visitor applied that have nothing to act on in this architecture. */
  inactive: ControlId[];
}
