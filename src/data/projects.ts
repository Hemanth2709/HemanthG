import type { BenchmarkRow, CoverageRow, PlannedProject, Project } from "./types";

/**
 * Only shipped work goes here. Every number below can be checked in the
 * linked repository (tests, CHANGELOG, docs/benchmark-results.md).
 */
export const projects: Project[] = [
  {
    slug: "sentinel-security",
    name: "Sentinel-Security",
    category: "Semgrep rule pack · NestJS & Next.js",
    timeframe: "2026",
    status: "v0.1.1 released",
    summary:
      "Custom Semgrep rules that find common security mistakes in NestJS and Next.js code, with tests for every rule and a benchmark that measures how often they are right.",
    problem:
      "General-purpose scanners don't know framework conventions. A ValidationPipe without whitelist, a secret in a NEXT_PUBLIC_ variable or CORS that reflects any origin all look like ordinary code, so they reach review, or production, unflagged.",
    solution:
      "Ten Semgrep rules, one per pattern, each mapped to a CWE and an OWASP category, with a vulnerable example, a fixed version and the reasoning behind the fix. They run in CI on every push, so a regression in a rule can't merge.",
    architecture: [
      "One YAML rule per weakness, scoped with pattern-inside and metavariable checks so generic method names like .query() don't match",
      "Annotated fixtures for every rule: lines that must be flagged and lines that must not",
      "A deliberately vulnerable NestJS + Next.js app with 26 planted bugs and 20 safe look-alikes, scored by a script against a ground truth",
      "GitHub Actions running validation, all fixtures and the examples, pinned to Semgrep 1.180.0",
    ],
    decisions: [
      "Prefer precision on review-style rules: a noisy rule gets turned off, a documented gap can be covered another way",
      "Write the failing test before changing a rule, so every fix comes with proof it was needed",
      "Record a prediction for each benchmark case before scanning, so the results can't be tuned after the fact",
    ],
    results: [
      "47 must-flag and 47 must-ignore test cases, all passing on Linux and Windows",
      "75% precision and 65% recall on the ground-truth benchmark (v0.1.1)",
      "The benchmark found a real miss, SQL appended inside an if, which became the v0.1.1 fix",
      "Runs in this site's CI on every push",
    ],
    limitations: [
      "Single-file analysis: global guards and options defined in other files are invisible",
      "The authorization rules are heuristics: all 5 benchmark false positives are public routes like login",
      "No findings is not proof of safety: SQL built in a helper function is still missed",
    ],
    technologies: ["Semgrep", "TypeScript", "NestJS", "Next.js", "Python", "GitHub Actions"],
    links: [
      { label: "Repository", href: "https://github.com/Hemanth2709/SentinelRules" },
      { label: "Release notes", href: "https://github.com/Hemanth2709/SentinelRules/releases/tag/v0.1.1" },
    ],
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

/** Planned, not started. Shown as such. */
export const planned: PlannedProject[] = [
  {
    name: "Nexus",
    focus: "Multi-tenant SaaS",
    summary: "Tenant isolation enforced at the data layer, with tests that try to read another tenant's data.",
  },
  {
    name: "Gatekeeper",
    focus: "API gateway",
    summary: "API-key auth with hashed keys and Redis rate limiting that holds under concurrent load.",
  },
  {
    name: "CloudForge",
    focus: "Infrastructure as code",
    summary: "Terraform on AWS, deployable from a clean account, with a demonstrated rollback.",
  },
  {
    name: "TraceFlow",
    focus: "Observability",
    summary: "OpenTelemetry traces across services, used to find a simulated failure.",
  },
  {
    name: "Pulse",
    focus: "Web performance",
    summary: "Scheduled Lighthouse audits that catch a real regression between two runs.",
  },
];
