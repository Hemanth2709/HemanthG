import type { ToolkitCategory } from "./types";

/** Only tools used in work shown on this site or in public repositories. */
export const toolkit: ToolkitCategory[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python"],
  },
  {
    title: "Web",
    items: ["Next.js", "React", "NestJS", "Node.js"],
  },
  {
    title: "Data & APIs",
    items: ["GraphQL", "Prisma", "TypeORM", "REST"],
  },
  {
    title: "Security",
    items: ["Semgrep", "OWASP Top 10", "CWE", "Static analysis"],
  },
  {
    title: "Delivery",
    items: ["GitHub Actions", "AWS", "Vercel", "Git"],
  },
];
