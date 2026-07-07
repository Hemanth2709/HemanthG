import type { AgentPipelineNode, AICapability } from "./types";

export const aiIntro = {
  headline: "AI-first, not AI-flavored.",
  description:
    "I design systems where intelligence is part of the architecture — grounded, observable, and safe to put in front of real users. Not chatbots bolted onto products, but products rebuilt around what models make possible.",
};

export const aiCapabilities: AICapability[] = [
  {
    icon: "bot",
    title: "Agents & Orchestration",
    description:
      "Durable, tool-using agents with human approval gates, scoped permissions, and full execution traces.",
    signals: ["Workflow graphs", "Tool registries", "Human-in-the-loop"],
  },
  {
    icon: "sparkles",
    title: "LLM Integrations",
    description:
      "Retrieval-grounded generation with strict citations, structured outputs, and provider-agnostic model layers.",
    signals: ["RAG pipelines", "Structured output", "Prompt evals"],
  },
  {
    icon: "workflow",
    title: "Intelligent Automation",
    description:
      "Replacing brittle scripts with resilient pipelines — idempotent, replayable, and observable end to end.",
    signals: ["Event-driven", "Idempotency", "Dead-letter recovery"],
  },
  {
    icon: "braces",
    title: "APIs & Contracts",
    description:
      "Typed, versioned interfaces between models and products — JSON-schema validated at every boundary.",
    signals: ["Schema validation", "Streaming APIs", "SDK design"],
  },
  {
    icon: "server",
    title: "Backend Systems",
    description:
      "The unglamorous foundation AI products need: queues, caches, vector search, and databases that scale.",
    signals: ["Queues & workers", "pgvector", "Caching layers"],
  },
  {
    icon: "shield",
    title: "Quality & Safety",
    description:
      "Eval suites, grounding checks, and cost/latency budgets — so quality is measured, not assumed.",
    signals: ["Eval harnesses", "Guardrails", "Cost tracking"],
  },
];

/** Nodes for the animated agent-pipeline diagram. */
export const agentPipeline: AgentPipelineNode[] = [
  { id: "input", label: "Input", sublabel: "user intent" },
  { id: "plan", label: "Plan", sublabel: "LLM reasoning" },
  { id: "tools", label: "Tools", sublabel: "scoped actions" },
  { id: "verify", label: "Verify", sublabel: "grounding checks" },
  { id: "output", label: "Output", sublabel: "traced result" },
];
