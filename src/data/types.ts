/**
 * Content-layer types.
 *
 * Every section of the site renders from typed data in `src/data`.
 * Edit the data files — never the components — to change content.
 */

export interface SiteConfig {
  name: string;
  initials: string;
  title: string;
  tagline: string;
  intro: string;
  url: string;
  email: string;
  location: string;
  keywords: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail";
}

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export interface AboutPrinciple {
  title: string;
  description: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  name: string;
  /** Short label shown above the name, e.g. "Semgrep rule pack". */
  category: string;
  timeframe: string;
  /** Current state, stated plainly (e.g. "v0.1.1 released"). */
  status: string;
  summary: string;
  problem: string;
  solution: string;
  /** How it works, one line per part. */
  architecture: string[];
  decisions: string[];
  results: string[];
  /** What it cannot do. Shown with the same weight as results. */
  limitations: string[];
  technologies: string[];
  links: ProjectLink[];
}

/** One rule in the coverage table. */
export interface CoverageRow {
  detects: string;
  rule: string;
  cwe: string;
  owasp: string;
  severity: "ERROR" | "WARNING";
}

/** Benchmark result for one release of the rule pack. */
export interface BenchmarkRow {
  release: string;
  findings: number;
  truePositives: number;
  falsePositives: number;
  precision: string;
  recall: string;
}

/** A project that has not been built yet. */
export interface PlannedProject {
  name: string;
  focus: string;
  summary: string;
}

export interface ProcessStep {
  id: string;
  label: string;
  description: string;
  outputs: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  technologies: string[];
}

export interface ToolkitCategory {
  title: string;
  items: string[];
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}
