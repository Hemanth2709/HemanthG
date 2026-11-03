import type { BenchmarkRow, CoverageRow, PlannedProject, Project } from "./types";

/**
 * Featured work. Sentinel-Security figures can be checked in its public
 * repository; professional projects are described only as far as the
 * owner's CV describes them. Architecture diagrams are simplified and
 * show only the components named there.
 */
export const featured: Project = {
  slug: "sentinel-security",
  name: "Sentinel-Security",
  category: "Application Security / SAST",
  status: "Released",
  context: "Open source · v0.1.1",
  summary:
    "Custom Semgrep rules that find security mistakes in NestJS and Next.js code, with tests for every rule and a benchmark that measures how often they're right.",
  problem:
    "General-purpose scanners don't know framework conventions. A ValidationPipe without whitelist, a secret in a NEXT_PUBLIC_ variable or CORS that trusts any origin all look like ordinary code, so they reach review, or production, unflagged.",
  contribution:
    "Designed and wrote all ten rules, the test fixtures, the deliberately vulnerable benchmark app, the scoring and the CI pipeline.",
  highlights: [
    "Each rule is mapped to a CWE and an OWASP category, with a vulnerable example, a fix and the reasoning",
    "47 must-flag and 47 must-ignore test cases, passing on Linux and Windows",
    "75% precision and 65% recall on a benchmark app with 26 planted vulnerabilities",
    "The benchmark found a real miss, which became the v0.1.1 fix",
  ],
  technologies: ["Semgrep", "TypeScript", "NestJS", "Next.js", "Python", "GitHub Actions"],
  flow: [
    { label: "Weakness", detail: "CWE · OWASP" },
    { label: "Fixtures", detail: "must flag / must not" },
    { label: "Rule", detail: "Semgrep YAML", emphasis: true },
    { label: "Benchmark", detail: "ground truth" },
    { label: "CI", detail: "every push" },
  ],
  links: [
    { label: "Repository", href: "https://github.com/Hemanth2709/SentinelRules" },
    { label: "v0.1.1 release", href: "https://github.com/Hemanth2709/SentinelRules/releases/tag/v0.1.1" },
  ],
};

export const projects: Project[] = [
  {
    slug: "seo-audit",
    name: "AI SEO Agentic Audit Tool",
    category: "Full-Stack / Distributed Systems / AI",
    status: "Private",
    context: "Source not public",
    summary:
      "A distributed SEO auditing platform: it crawls a site, runs technical and semantic analysis in background workers, and generates a report.",
    contribution: "Designed and built the platform. The source code and implementation details are private.",
    highlights: [
      "Crawling and analysis run in background workers",
      "Technical SEO analysis alongside semantic analysis of page content",
      "Findings compiled into a generated report",
    ],
    technologies: [],
    flow: [
      { label: "Crawler", detail: "site pages" },
      { label: "Background workers", detail: "distributed jobs", emphasis: true },
      { label: "Analysis", detail: "technical · semantic" },
      { label: "Report", detail: "generated" },
    ],
    links: [],
  },
  {
    slug: "identity-provider",
    name: "Identity Provider",
    category: "Identity & Access / SSO",
    status: "Professional work",
    context: "Ralecon IT Consulting Services",
    summary:
      "A centralised identity provider that gives users one login across multiple internal products, with managed roles, a client application registry and secure token issuance.",
    problem: "Several internal products each needed sign-in. The goal was less authentication complexity and more secure onboarding.",
    contribution: "Architected the platform, implementing OAuth 2.0 with role-based access control.",
    highlights: [
      "One login across multiple internal products",
      "Role-based access control and a client application registry",
      "Reduced authentication complexity across the product suite",
    ],
    technologies: ["Next.js", "PostgreSQL", "OAuth 2.0", "RBAC"],
    flow: [
      { label: "Products", detail: "registered clients" },
      { label: "Identity provider", detail: "OAuth 2.0 · RBAC", emphasis: true },
      { label: "Tokens", detail: "secure issuance" },
      { label: "PostgreSQL", detail: "users · roles · clients" },
    ],
    links: [],
  },
  {
    slug: "contract-management",
    name: "Contract Management System",
    category: "Secure Platforms / Serverless",
    status: "Professional work",
    context: "Ralecon IT Consulting Services",
    summary:
      "A secure contract lifecycle platform with end-to-end encryption, role-based dashboards for creation and approval workflows, and audit trails.",
    problem: "Contracts go through creation and approval by different roles, and their contents have to stay protected throughout.",
    contribution: "Led development of the platform, frontend to serverless backend.",
    highlights: [
      "End-to-end encryption of contract data",
      "Role-based dashboards for creation and approval workflows",
      "Audit trails, plus Google Analytics for usage insight",
    ],
    technologies: ["React", "Node.js", "AWS Lambda", "API Gateway", "MySQL"],
    flow: [
      { label: "React app", detail: "role dashboards" },
      { label: "API Gateway" },
      { label: "Lambda", detail: "Node.js" },
      { label: "Encryption", detail: "end to end", emphasis: true },
      { label: "MySQL", detail: "contracts · audit trail" },
    ],
    links: [],
  },
  {
    slug: "ginger-services",
    name: "Services Portal",
    category: "Microservices / Serverless",
    status: "Live",
    context: "Ginger Media Group",
    summary:
      "A microservices-based service management platform for internal and external users, on a serverless backend.",
    contribution: "Built as a Software Engineer at Ginger Media Group.",
    highlights: [
      "Serverless architecture on AWS Lambda and API Gateway significantly reduced infrastructure cost",
      "Next.js server-side rendering cut TTFB by 30% and improved SEO",
    ],
    technologies: ["Next.js", "Node.js", "AWS Lambda", "API Gateway", "MySQL"],
    flow: [
      { label: "Next.js", detail: "server-rendered" },
      { label: "API Gateway" },
      { label: "Lambda services", detail: "Node.js", emphasis: true },
      { label: "MySQL" },
    ],
    links: [{ label: "services.gingermediagroup.com", href: "https://services.gingermediagroup.com" }],
  },
  {
    slug: "gogig",
    name: "gOGig",
    category: "Frontend Engineering",
    status: "Live",
    context: "gogig.in",
    summary:
      "The frontend of a freelance gig marketplace, built component-first with reusable, responsive UI connected to REST APIs for real-time data.",
    contribution: "Built the frontend as a library of reusable, responsive components.",
    highlights: ["Component-first architecture", "Responsive UI on REST APIs with real-time data updates"],
    technologies: ["React", "TypeScript", "MUI", "REST APIs"],
    flow: [
      { label: "Components", detail: "MUI · TypeScript", emphasis: true },
      { label: "React app" },
      { label: "REST APIs", detail: "real-time data" },
    ],
    links: [{ label: "gogig.in", href: "https://gogig.in" }],
  },
];

/** Blueprints only. Never shown as built. */
export const planned: PlannedProject[] = [
  {
    name: "Nexus",
    category: "Multi-tenant SaaS",
    summary: "Tenant isolation, RBAC and authentication, with tests that try to read another tenant's data.",
    technologies: ["NestJS", "PostgreSQL"],
  },
  {
    name: "Gatekeeper",
    category: "API security",
    summary: "An API gateway with hashed API keys and Redis rate limiting that holds under concurrent load.",
    technologies: ["Node.js", "Redis"],
  },
  {
    name: "CloudForge",
    category: "Infrastructure as code",
    summary: "AWS infrastructure in Terraform with Docker and CI/CD, deployable from a clean account.",
    technologies: ["Terraform", "AWS", "Docker"],
  },
  {
    name: "TraceFlow",
    category: "Observability",
    summary: "OpenTelemetry traces with Prometheus and Grafana, used to find a simulated failure.",
    technologies: ["OpenTelemetry", "Prometheus", "Grafana"],
  },
  {
    name: "Pulse",
    category: "Performance",
    summary: "Scheduled Lighthouse and Core Web Vitals audits that catch a regression between runs.",
    technologies: ["Lighthouse", "Core Web Vitals"],
  },
];

/** What the rules detect. Mirrors the rule catalogue in the repository. */
export const coverage: CoverageRow[] = [
  { detects: "SQL built from user input", rule: "sql-injection-raw-query", cwe: "CWE-89", owasp: "A03", severity: "ERROR" },
  { detects: "Expired JWTs accepted", rule: "jwt-ignore-expiration", cwe: "CWE-613", owasp: "A07", severity: "ERROR" },
  { detects: "JWT verified without an algorithm list", rule: "jwt-verify-missing-algorithms", cwe: "CWE-347", owasp: "A02", severity: "WARNING" },
  { detects: "Request bodies not whitelisted", rule: "nestjs-validation-pipe-missing-whitelist", cwe: "CWE-915", owasp: "A08", severity: "WARNING" },
  { detects: "Secrets shipped to the browser", rule: "next-public-secret-env", cwe: "CWE-200", owasp: "A01", severity: "ERROR" },
  { detects: "Unsanitized HTML rendering", rule: "react-dangerously-set-inner-html", cwe: "CWE-79", owasp: "A03", severity: "WARNING" },
  { detects: "Session cookies missing flags", rule: "insecure-session-cookie", cwe: "CWE-1004", owasp: "A05", severity: "WARNING" },
  { detects: "CORS trusting any origin with credentials", rule: "cors-credentials-any-origin", cwe: "CWE-942", owasp: "A05", severity: "ERROR" },
  { detects: "NestJS routes without a guard", rule: "nestjs-route-missing-guard", cwe: "CWE-862", owasp: "A01", severity: "WARNING" },
  { detects: "Next.js handlers without an auth check", rule: "nextjs-handler-missing-auth-check", cwe: "CWE-862", owasp: "A01", severity: "WARNING" },
];

/** Ground-truth benchmark: 26 planted vulnerabilities, 20 safe look-alikes. */
export const benchmark: BenchmarkRow[] = [
  { release: "v0.1.0", findings: 19, truePositives: 14, falsePositives: 5, precision: "74%", recall: "61%" },
  { release: "v0.1.1", findings: 20, truePositives: 15, falsePositives: 5, precision: "75%", recall: "65%" },
];
