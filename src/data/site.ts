import type { NavItem, SiteConfig, SocialLink } from "./types";

export const site: SiteConfig = {
  name: "Hemanth G",
  initials: "HG",
  title: "Software Engineer",
  heroLabel: "Software Engineer / Application Security",
  headline: ["Engineering software.", "Securing what matters."],
  intro:
    "Full stack developer with 3.5+ years building web applications, backend systems and the cloud infrastructure underneath them. I work in TypeScript, Next.js, Node.js and AWS, and I'm moving deliberately into application security.",
  description:
    "Full stack developer building web apps and the cloud infrastructure behind them, with a growing focus on application security.",
  url: "https://hemanthg.dev",
  email: "hemanth.dev.g@gmail.com",
  location: "Bengaluru, India",
  resumeUrl: null,
  keywords: [
    "Hemanth G",
    "Full Stack Developer",
    "Software Engineer",
    "Application Security",
    "Cloud Infrastructure",
    "DevSecOps",
    "AWS",
    "Next.js",
    "Node.js",
    "NestJS",
    "Semgrep",
    "Bengaluru",
  ],
};

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/Hemanth2709", icon: "github", handle: "Hemanth2709" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hemanthg-dev/",
    icon: "linkedin",
    handle: "hemanthg-dev",
  },
];

export const navigation: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];
