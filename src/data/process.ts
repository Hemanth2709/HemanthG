import type { ProcessStep } from "./types";

export const processSteps: ProcessStep[] = [
  {
    id: "research",
    label: "Research",
    icon: "search",
    description:
      "Understand the user, the constraint, and the metric that defines success. Talk to people, read the data, map what exists.",
    outputs: ["Problem statement", "Success metrics", "Constraints map"],
  },
  {
    id: "design",
    label: "Design",
    icon: "pen-tool",
    description:
      "Shape the experience before the implementation. Flows, states, and edge cases — sketched, challenged, and simplified.",
    outputs: ["User flows", "Interface states", "Scope cutlines"],
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: "network",
    description:
      "Choose boring technology with sharp seams. Design the data model, the failure modes, and the path to scale.",
    outputs: ["System diagram", "Data model", "Failure playbook"],
  },
  {
    id: "build",
    label: "Build",
    icon: "code",
    description:
      "Ship thin vertical slices with strict types and tests where they pay rent. Working software over perfect plans.",
    outputs: ["Typed codebase", "CI pipeline", "Preview deploys"],
  },
  {
    id: "deploy",
    label: "Deploy",
    icon: "cloud",
    description:
      "Automate the path to production: reproducible builds, progressive rollouts, and one-command rollbacks.",
    outputs: ["Zero-downtime deploys", "Rollback plan", "Runbooks"],
  },
  {
    id: "measure",
    label: "Measure",
    icon: "gauge",
    description:
      "Instrument what matters — product analytics, tracing, cost, and quality signals — so decisions come from evidence.",
    outputs: ["Dashboards", "Alerting", "Eval suites"],
  },
  {
    id: "iterate",
    label: "Iterate",
    icon: "refresh",
    description:
      "Feed real usage back into the roadmap. Double down on what works, delete what doesn't, and keep the system simple.",
    outputs: ["Prioritized backlog", "Refactor budget", "Next bet"],
  },
];
