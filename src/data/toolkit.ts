import type { ToolkitCategory } from "./types";

export const toolkit: ToolkitCategory[] = [
  {
    icon: "code",
    title: "Languages",
    blurb: "Strictly typed by default.",
    items: ["TypeScript", "Python", "JavaScript", "SQL", "Go"],
  },
  {
    icon: "layout",
    title: "Frameworks",
    blurb: "Product surfaces that feel fast.",
    items: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    icon: "server",
    title: "Backend",
    blurb: "APIs built to be depended on.",
    items: ["Node.js", "FastAPI", "tRPC", "GraphQL", "REST"],
  },
  {
    icon: "cloud",
    title: "Cloud",
    blurb: "Boring, reliable, automated.",
    items: ["AWS", "GCP", "Vercel", "Cloudflare", "Serverless"],
  },
  {
    icon: "brain",
    title: "AI",
    blurb: "Grounded and evaluated, not guessed.",
    items: ["Anthropic API", "OpenAI API", "RAG", "Embeddings", "Eval pipelines"],
  },
  {
    icon: "database",
    title: "Databases",
    blurb: "The data model is the product.",
    items: ["PostgreSQL", "pgvector", "Redis", "Prisma", "SQLite"],
  },
  {
    icon: "boxes",
    title: "Infrastructure",
    blurb: "Reproducible from a clean checkout.",
    items: ["Docker", "Kubernetes", "Terraform", "Nginx", "Message queues"],
  },
  {
    icon: "git-branch",
    title: "DevOps",
    blurb: "Ship on green, roll back in one command.",
    items: ["GitHub Actions", "CI/CD", "Observability", "Feature flags", "Tracing"],
  },
  {
    icon: "workflow",
    title: "Automation",
    blurb: "Durable pipelines over fragile scripts.",
    items: ["Agent workflows", "Event-driven jobs", "Webhooks", "Schedulers", "ETL"],
  },
  {
    icon: "plug",
    title: "APIs",
    blurb: "Contracts first, integrations second.",
    items: ["OpenAPI", "JSON Schema", "Streaming (SSE)", "OAuth", "Third-party SDKs"],
  },
];
