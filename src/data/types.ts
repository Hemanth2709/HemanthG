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
  resumeUrl: string;
  keywords: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "file";
}

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export interface AboutPrinciple {
  icon: "compass" | "layers" | "zap" | "rocket";
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  name: string;
  timeframe: string;
  category: string;
  /** Accent hue (deg) used to generate the project's visual identity. */
  hue: number;
  problem: string;
  solution: string;
  architecture: string[];
  challenges: string[];
  decisions: string[];
  results: string[];
  lessons: string;
  technologies: string[];
  links: {
    demo?: string;
    github?: string;
  };
}

export interface ProcessStep {
  id: string;
  label: string;
  icon: "search" | "pen-tool" | "network" | "code" | "cloud" | "gauge" | "refresh";
  description: string;
  outputs: string[];
}

export interface AICapability {
  icon: "bot" | "workflow" | "sparkles" | "braces" | "server" | "shield";
  title: string;
  description: string;
  signals: string[];
}

export interface AgentPipelineNode {
  id: string;
  label: string;
  sublabel: string;
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
  icon:
    | "code"
    | "layout"
    | "server"
    | "cloud"
    | "brain"
    | "database"
    | "boxes"
    | "git-branch"
    | "workflow"
    | "plug";
  title: string;
  blurb: string;
  items: string[];
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}
