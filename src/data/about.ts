import type { AboutPrinciple } from "./types";

export const aboutNarrative = {
  headline: "Software is a product decision long before it's a technical one.",
  paragraphs: [
    "I build at the intersection of product thinking and systems engineering. Before writing a line of code, I want to understand the user, the constraint, and the metric that matters — because elegant architecture in service of the wrong problem is still the wrong product.",
    "My work spans the full lifecycle: shaping ambiguous ideas into specs, designing architectures that scale past the demo, and shipping software that survives contact with real users. I gravitate toward AI-first products — systems where LLMs, agents, and automation aren't bolted on, but designed in from the first diagram.",
    "I optimize for leverage: small, sharp teams shipping fast with clean abstractions, strong typing, and boring, reliable infrastructure underneath ambitious interfaces.",
  ],
};

export const principles: AboutPrinciple[] = [
  {
    icon: "compass",
    title: "Start from the problem",
    description:
      "Every build begins with the user's job-to-be-done and a success metric. Technology choices follow — never the other way around.",
  },
  {
    icon: "layers",
    title: "Architect for change",
    description:
      "Products evolve. I design modular systems with clear seams, so tomorrow's pivot is a refactor — not a rewrite.",
  },
  {
    icon: "zap",
    title: "Ship to learn",
    description:
      "Working software beats perfect plans. I ship thin vertical slices early, instrument everything, and let real usage steer the roadmap.",
  },
  {
    icon: "rocket",
    title: "Own the outcome",
    description:
      "From first wireframe to production dashboards — I take ideas the whole distance and stay accountable for what happens after launch.",
  },
];
