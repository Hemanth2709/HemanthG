import type { Achievement, TimelineItem } from "./types";

export const about = {
  headline: ["Engineering across the stack.", "Thinking beyond the code."],
  paragraphs: [
    "I'm a full stack developer with 3.5+ years of experience shipping web applications, cloud infrastructure and internal platforms. Most of my work is in TypeScript, React, Next.js, Node.js and NestJS, running on AWS and DigitalOcean.",
    "The part I enjoy most is the layer underneath the app: deployment pipelines, Linux servers, NGINX load balancing, DNS and SSL, and server migrations that end with systems that simply run.",
    "Security grew out of that work. I've built an OAuth 2.0 single sign-on identity provider with role-based access control and a contract platform with end-to-end encryption. Sentinel-Security, my Semgrep rule pack, is where I'm turning that into a focus.",
    "Before my current role I co-founded a startup with friends during my B.Tech, which taught me to own problems end to end.",
  ],
};

export const timeline: TimelineItem[] = [
  { period: "2019 – 2023", title: "B.Tech, REVA University", detail: "Electronics and Computer Engineering" },
  { period: "2021 – 2023", title: "Swift Ride", detail: "Co-founded; Android developer" },
  { period: "2024 – 2025", title: "Ginger Media Group", detail: "Software Engineer" },
  { period: "2025 – now", title: "Ralecon IT Consulting", detail: "Full Stack Developer" },
  { period: "2026", title: "Sentinel-Security", detail: "Open-source Semgrep rules, v0.1.1" },
];

export const achievements: Achievement[] = [
  { title: "CISCO Thinqbator", detail: "Selected for the programme for startups and innovators" },
  { title: "₹5 Lakh seed grant", detail: "Awarded by RISE X Runway to develop and scale tech projects" },
  { title: "RISE X Runway", detail: "Innovative Start-up Certificate" },
  { title: "Tim Draper cohort", detail: "Worked with 50+ entrepreneurial leaders; milestones delivered ahead of schedule" },
];

export const education = {
  degree: "B.Tech, Electronics and Computer Engineering",
  school: "REVA University, Bengaluru",
  period: "2019 – 2023",
  grade: "CGPA 8.56 / 10",
};

export const languages = "English (fluent) · Kannada (native) · Tamil, Hindi, Telugu (conversational)";
