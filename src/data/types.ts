/**
 * Content-layer types.
 *
 * Every section renders from typed data in `src/data`. Edit the data
 * files, not the components, to change content. Only verified facts go
 * in: nothing planned is shown as done.
 */

export interface SiteConfig {
  name: string;
  initials: string;
  /** Short title used in metadata, e.g. "Software Engineer". */
  title: string;
  /** Small label above the hero headline. */
  heroLabel: string;
  /** Hero headline, one entry per line. */
  headline: string[];
  intro: string;
  /** One-line description for metadata and the footer. */
  description: string;
  url: string;
  email: string;
  location: string;
  /** Set to a path in /public once a resume PDF exists; links hide while null. */
  resumeUrl: string | null;
  keywords: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin";
  handle: string;
}

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export interface TimelineItem {
  period: string;
  title: string;
  detail: string;
}

export interface ExperienceGroup {
  /** Optional heading for a group of highlights, e.g. "Infrastructure & DevOps". */
  title?: string;
  items: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  note?: string;
  groups: ExperienceGroup[];
  technologies: string[];
}

/** "Private": built, but the source and deployment are not public. */
export type ProjectStatus = "Released" | "Live" | "Private" | "Professional work" | "In progress" | "Planned";

/** One box in a simplified architecture diagram. */
export interface FlowNode {
  label: string;
  detail?: string;
  /** Highlight the node that carries the security control. */
  emphasis?: boolean;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  name: string;
  category: string;
  status: ProjectStatus;
  /** Where the work was done, e.g. "Ralecon IT Consulting Services". */
  context: string;
  summary: string;
  problem?: string;
  contribution: string;
  highlights: string[];
  technologies: string[];
  flow: FlowNode[];
  links: ProjectLink[];
}

export interface PlannedProject {
  name: string;
  category: string;
  summary: string;
  technologies: string[];
}

export interface CoverageRow {
  detects: string;
  rule: string;
  cwe: string;
  owasp: string;
  severity: "ERROR" | "WARNING";
}

export interface BenchmarkRow {
  release: string;
  findings: number;
  truePositives: number;
  falsePositives: number;
  precision: string;
  recall: string;
}

export interface SkillDomain {
  title: string;
  /** Where the skill is evidenced, shown as a small note. */
  evidence: string;
  items: string[];
}

export interface Achievement {
  title: string;
  detail: string;
}
