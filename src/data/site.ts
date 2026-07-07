import type { NavItem, SiteConfig, SocialLink } from "./types";

export const site: SiteConfig = {
  name: "Hemanth G",
  initials: "HG",
  title: "AI Product Engineer",
  tagline: "I turn ambitious ideas into intelligent, production-grade products.",
  intro:
    "Full-stack engineer with a product mindset — designing, architecting, and shipping AI-first systems that hold up in the real world.",
  url: "https://hemanthg.dev",
  email: "geniushemu2000@gmail.com",
  location: "India · Remote-friendly",
  resumeUrl: "/resume.pdf",
  keywords: [
    "AI Product Engineer",
    "Full-Stack Engineer",
    "LLM Integrations",
    "Next.js",
    "TypeScript",
    "AI Agents",
    "Product Engineering",
  ],
};

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/Hemanth2709", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hemanth-g", icon: "linkedin" },
  { label: "Email", href: "mailto:geniushemu2000@gmail.com", icon: "mail" },
  { label: "Resume", href: "/resume.pdf", icon: "file" },
];

export const navigation: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "AI", href: "#ai" },
  { label: "Experience", href: "#experience" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "Contact", href: "#contact" },
];
