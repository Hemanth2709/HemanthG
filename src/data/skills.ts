import type { SkillDomain } from "./types";

/** From the owner's CV, grouped by engineering domain. No ratings. */
export const skills: SkillDomain[] = [
  {
    title: "Application security",
    evidence: "Sentinel-Security",
    items: ["Semgrep", "SAST", "OWASP Top 10", "CWE", "Secure coding"],
  },
  {
    title: "Auth & security",
    evidence: "Identity provider, contract platform",
    items: ["OAuth 2.0", "SSO", "RBAC", "JWT", "End-to-end encryption"],
  },
  {
    title: "Frontend",
    evidence: "Ginger Media Group, gOGig",
    items: ["React", "Next.js (SSR)", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "MUI", "React Native"],
  },
  {
    title: "Backend",
    evidence: "Ralecon, Ginger Media Group",
    items: ["Node.js", "NestJS", "REST APIs", "Microservices", "Serverless"],
  },
  {
    title: "Cloud & infrastructure",
    evidence: "Ralecon",
    items: [
      "AWS Lambda",
      "API Gateway",
      "EC2",
      "IAM",
      "DigitalOcean",
      "NGINX",
      "Docker",
      "Linux",
      "DNS",
      "SSL/TLS",
      "SMTP",
      "Server migrations",
    ],
  },
  {
    title: "Databases",
    evidence: "Ralecon, Ginger Media Group",
    items: ["PostgreSQL", "MySQL", "Firebase"],
  },
  {
    title: "Mobile",
    evidence: "Swift Ride",
    items: ["Kotlin", "Android Studio", "React Native"],
  },
  {
    title: "Languages",
    evidence: "",
    items: ["TypeScript", "JavaScript", "Python", "Java", "Kotlin", "C/C++"],
  },
  {
    title: "Tools",
    evidence: "",
    items: ["Git", "GitHub", "GitLab", "Postman", "Figma", "Notion", "Slack", "Claude Code"],
  },
];

/** Being learned now: shown separately, never mixed with the above. */
export const learning = [
  "Terraform",
  "Kubernetes",
  "CI/CD with GitHub Actions",
  "Prometheus & Grafana",
  "DevSecOps tooling",
  "Microsoft Entra ID",
];
