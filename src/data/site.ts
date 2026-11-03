import type { NavItem, SiteConfig, SocialLink } from "./types";

export const site: SiteConfig = {
  name: "Hemanth G",
  initials: "HG",
  title: "Software Engineer · Application Security",
  tagline: "I build web products, and the tooling that finds security bugs in them.",
  intro:
    "Software engineer working with Next.js and NestJS on AWS, moving into application security. Right now that means Sentinel-Security: Semgrep rules that catch NestJS and Next.js vulnerabilities, measured against a deliberately vulnerable app.",
  url: "https://hemanthg.dev",
  email: "geniushemu2000@gmail.com",
  location: "India · Remote-friendly",
  keywords: [
    "Application Security",
    "AppSec",
    "Software Engineer",
    "Semgrep",
    "Static analysis",
    "NestJS",
    "Next.js",
    "TypeScript",
    "DevSecOps",
  ],
};

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/Hemanth2709", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hemanth-g", icon: "linkedin" },
  { label: "Email", href: "mailto:geniushemu2000@gmail.com", icon: "mail" },
];

export const navigation: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "Contact", href: "#contact" },
];
