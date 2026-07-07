import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    company: "Independent / Product Studio",
    role: "AI Product Engineer",
    period: "2024 — Present",
    location: "Remote",
    summary:
      "Partnering with founders and small teams to take AI-first products from concept to production — owning design, architecture, and delivery end to end.",
    achievements: [
      "Shipped 3 production AI systems spanning analytics, agent orchestration, and release intelligence",
      "Designed retrieval and evaluation pipelines that made LLM output trustworthy enough for enterprise users",
      "Established typed, modular architectures that let solo-maintained products evolve without rewrites",
    ],
    technologies: ["TypeScript", "Next.js", "Python", "PostgreSQL", "LLM APIs", "AWS"],
  },
  {
    company: "Growth-stage Startup",
    role: "Senior Full-Stack Engineer",
    period: "2022 — 2024",
    location: "Bengaluru, India",
    summary:
      "Led feature teams across a high-traffic SaaS platform — from real-time collaboration features to the internal platform that sped up every other team.",
    achievements: [
      "Re-architected the core API layer, cutting p95 latency by 60% under 3× traffic growth",
      "Introduced the design-system + component library adopted across 4 product squads",
      "Mentored 5 engineers; drove the RFC process that replaced ad-hoc architecture decisions",
    ],
    technologies: ["React", "Node.js", "GraphQL", "Redis", "Kubernetes", "GCP"],
  },
  {
    company: "Digital Agency",
    role: "Full-Stack Engineer",
    period: "2020 — 2022",
    location: "Chennai, India",
    summary:
      "Built and launched client products across fintech, e-commerce, and media — learning to ship fast without leaving wreckage behind.",
    achievements: [
      "Delivered 10+ client applications from kickoff to production handover",
      "Standardized the agency's deployment pipeline, reducing launch-week incidents to near zero",
      "Owned client-facing architecture reviews, translating business goals into technical plans",
    ],
    technologies: ["JavaScript", "Vue", "Django", "PostgreSQL", "Docker", "CI/CD"],
  },
];
