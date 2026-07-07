import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "insight-engine",
    name: "Insight Engine",
    timeframe: "2025",
    category: "AI Analytics Platform",
    hue: 235,
    problem:
      "Product teams drown in qualitative feedback — support tickets, reviews, interviews — but insights stay locked in unstructured text. Manual tagging took analysts days per cycle and the taxonomy drifted with every hire.",
    solution:
      "An LLM-powered analytics platform that ingests feedback from any channel, clusters it into living themes, and answers natural-language questions with citations back to source quotes. Teams went from weekly digests to real-time, queryable insight.",
    architecture: [
      "Event-driven ingestion pipeline normalizing feedback from webhooks, CSV, and API sources into a unified schema",
      "Embedding + HDBSCAN clustering layer with LLM-generated theme labels, re-evaluated incrementally as data arrives",
      "RAG query service with hybrid search (dense + BM25) and strict citation grounding",
      "Next.js dashboard streaming answers token-by-token over server-sent events",
    ],
    challenges: [
      "Theme stability — naive re-clustering renamed everything nightly, destroying trust in the dashboard",
      "Hallucinated summaries when clusters were thin; needed guardrails before enterprise rollout",
    ],
    decisions: [
      "Anchored clusters to persistent centroids so themes evolve instead of being replaced — trading marginal purity for continuity users could trust",
      "Made every generated claim carry a citation or get suppressed; an unverifiable insight is worse than no insight",
      "Chose Postgres + pgvector over a dedicated vector DB to keep the operational surface small at this scale",
    ],
    results: [
      "Cut insight turnaround from ~5 days of manual tagging to under an hour",
      "94% of generated theme labels accepted by analysts without edits",
      "Scaled to 250k+ feedback items with sub-second hybrid search",
    ],
    lessons:
      "Trust is the real product in AI analytics. The clustering math was the easy half — the hard half was designing for verifiability, so users could always trace an insight back to a human voice.",
    technologies: ["Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL", "pgvector", "OpenAI API", "Redis"],
    links: {
      github: "https://github.com/Hemanth2709",
    },
  },
  {
    slug: "relay-agents",
    name: "Relay",
    timeframe: "2024 — 2025",
    category: "Agent Orchestration Framework",
    hue: 165,
    problem:
      "Internal ops teams were stitching LLM calls together with brittle scripts. Every workflow — triage, enrichment, follow-ups — was a one-off with no retries, no observability, and no way to keep a human in the loop safely.",
    solution:
      "A typed agent-orchestration layer where workflows are declared as graphs of tools, model calls, and approval gates. Runs are durable, resumable, and fully traced — turning fragile automation scripts into dependable systems.",
    architecture: [
      "Declarative workflow graphs compiled to a durable state machine with checkpointed steps",
      "Tool registry with JSON-schema validated inputs/outputs and per-tool permission scopes",
      "Queue-backed executor with exponential backoff, idempotency keys, and dead-letter handling",
      "Trace viewer reconstructing every run — prompts, tool calls, token costs — for debugging and audit",
    ],
    challenges: [
      "Long-running workflows crossing model timeouts and worker restarts without losing state",
      "Preventing agents from acting outside intended scopes as tool count grew",
    ],
    decisions: [
      "Persisted every step transition before execution — recovery replays state, never re-runs side effects",
      "Human approval gates as first-class graph nodes rather than ad-hoc pauses, so escalation is designed, not patched in",
      "Kept the model layer provider-agnostic behind one interface; swapping models became a config change during evaluation",
    ],
    results: [
      "12+ production workflows migrated off cron scripts in the first quarter",
      "Mean time to debug a failed automation dropped from hours to minutes via full traces",
      "Zero unauthorized tool executions since scoped permissions shipped",
    ],
    lessons:
      "Agents are distributed systems wearing a trench coat. Durability, idempotency, and observability matter more than clever prompting — the prompt is 10% of the work.",
    technologies: ["TypeScript", "Node.js", "BullMQ", "PostgreSQL", "Redis", "Anthropic API", "Docker", "AWS"],
    links: {
      github: "https://github.com/Hemanth2709",
    },
  },
  {
    slug: "shipboard",
    name: "Shipboard",
    timeframe: "2024",
    category: "Developer Productivity SaaS",
    hue: 25,
    problem:
      "Small engineering teams lose release context across GitHub, CI, and chat. 'What actually shipped this week, and did it break anything?' took an engineer an afternoon to answer — every week.",
    solution:
      "A release-intelligence dashboard that connects to GitHub and CI, assembles a live timeline of deploys, and writes human-quality changelogs and stakeholder updates automatically from merged PRs and deployment events.",
    architecture: [
      "GitHub App with webhook ingestion, signature verification, and replay-safe event processing",
      "Aggregation layer correlating PRs, CI runs, and deploy markers into release units",
      "LLM summarization pass with structured output for changelogs, categorized by audience",
      "Edge-cached dashboard with ISR pages per team, loading in under a second globally",
    ],
    challenges: [
      "Webhook delivery is at-least-once and out-of-order — early versions double-counted deploys",
      "Changelog tone: raw LLM output read like marketing copy; engineers didn't trust it",
    ],
    decisions: [
      "Modeled ingestion as an idempotent event log keyed on delivery IDs, replayable from scratch to rebuild state",
      "Grounded summaries strictly in PR titles, labels, and diffs stats — with a 'show sources' toggle per changelog line",
      "Shipped read-only mode first to build trust before any write-back automation",
    ],
    results: [
      "Release notes that took ~3 hours weekly now generate in seconds and get lightly edited",
      "Adopted by 8 teams internally within two months of the pilot",
      "p95 dashboard load of 800ms across regions via ISR + edge caching",
    ],
    lessons:
      "Automation earns adoption through accuracy, not magic. Grounding every generated line in verifiable sources converted the skeptics — the feature that mattered most was the one that showed the receipts.",
    technologies: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "Prisma", "OpenAI API", "Vercel", "GitHub API"],
    links: {
      github: "https://github.com/Hemanth2709",
    },
  },
];
