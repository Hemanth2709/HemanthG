import type { Reference } from "./types";

export interface PipelineStage {
  id: string;
  label: string;
  what: string;
  /** Risks this stage helps identify or reduce. */
  catches: string[];
  /** Typical tools or techniques. */
  tools: string[];
  /** How the owner's own work relates, stated only where it is true. */
  mine: { text: string; link?: Reference };
}

/** A secure delivery workflow, in order (brief section 4.5). */
export const PIPELINE: PipelineStage[] = [
  {
    id: "code",
    label: "Code",
    what: "Developers write and review changes, ideally with security checks running in the editor too.",
    catches: ["Obvious mistakes before they are committed", "Unsafe patterns flagged by editor linting"],
    tools: ["Code review", "Editor Semgrep / ESLint security plugins", "Pre-commit hooks"],
    mine: { text: "This portfolio and Sentinel Rules are written in TypeScript and reviewed in pull requests." },
  },
  {
    id: "git",
    label: "Git",
    what: "Version control with protected branches: changes reach main only through reviewed pull requests with passing checks.",
    catches: ["Unreviewed changes", "Secrets committed by mistake (with secret scanning)"],
    tools: ["Branch protection", "Required status checks", "Secret scanning", "Signed commits"],
    mine: { text: "Changes to this site go through GitHub pull requests, and each one runs the Sentinel Rules check." },
  },
  {
    id: "sast",
    label: "SAST",
    what: "Static analysis reads the source code and flags dangerous patterns: injection, unsafe rendering, weak auth configuration.",
    catches: ["SQL injection", "XSS", "SSRF", "Mass assignment", "Secrets in client code", "Missing auth checks (heuristic)"],
    tools: ["Semgrep", "CodeQL", "SonarQube"],
    mine: {
      text: "Sentinel Rules is my Semgrep rule pack for NestJS and Next.js. Its GitHub Action scans this site on every push and uploads the results to GitHub code scanning.",
      link: { label: "Sentinel Rules on the GitHub Marketplace", href: "https://github.com/marketplace/actions/sentinel-rules" },
    },
  },
  {
    id: "dependency-scan",
    label: "Dependency scan",
    what: "Third-party packages are checked against vulnerability databases, and updates are proposed automatically.",
    catches: ["Known vulnerable packages (CVEs)", "Outdated transitive dependencies"],
    tools: ["Dependabot", "npm audit", "OSV-Scanner", "Snyk"],
    mine: { text: "Not set up on this site yet: no automated dependency scanning runs in its CI today." },
  },
  {
    id: "build",
    label: "Build",
    what: "A reproducible build from locked dependencies, producing the artefact that will be deployed.",
    catches: ["Unpinned or tampered dependencies (with lockfiles and provenance)", "Build-time secrets leaking into artefacts"],
    tools: ["Lockfiles", "Isolated CI runners", "Build provenance (SLSA)"],
    mine: { text: "This site is built with next build on Vercel for every push, from the npm lockfile." },
  },
  {
    id: "container-scan",
    label: "Container scan",
    what: "Container images are scanned for vulnerable OS packages and misconfiguration before they are pushed to a registry.",
    catches: ["CVEs in base images", "Running as root", "Secrets baked into image layers"],
    tools: ["Trivy", "Grype", "Docker Scout"],
    mine: { text: "Not applicable to this site: it deploys to Vercel without a container image." },
  },
  {
    id: "deploy",
    label: "Deploy",
    what: "The artefact is released with least-privilege credentials, ideally to a preview first, with the ability to roll back.",
    catches: ["Over-privileged deploy credentials", "Configuration drift", "Untested changes reaching production"],
    tools: ["Preview environments", "Infrastructure as code", "OIDC short-lived credentials"],
    mine: { text: "Vercel builds a preview deployment of every pull request to this site." },
  },
  {
    id: "runtime",
    label: "Runtime monitoring",
    what: "Logs, metrics and alerts on the running system, so attacks and failures are noticed.",
    catches: ["Attacks in progress", "Anomalous traffic or errors", "Abuse of leaked credentials"],
    tools: ["Centralized logging", "Alerting", "Runtime security agents", "WAF logs"],
    mine: { text: "Not set up for this site, which is static with no backend of its own." },
  },
];
