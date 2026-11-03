import type { ExperienceEntry } from "./types";

/** From the owner's CV. Metrics are the owner's own figures. */
export const experience: ExperienceEntry[] = [
  {
    company: "Ralecon IT Consulting Services",
    role: "Full Stack Developer",
    period: "Jul 2025 – Present",
    location: "Bengaluru, India",
    groups: [
      {
        title: "Infrastructure & DevOps",
        items: [
          "Diagnosed and resolved backend infrastructure issues across multiple cloud servers on DigitalOcean and AWS.",
          "Configured NGINX as a reverse proxy and load balancer for reliable multi-server deployments.",
          "Provisioned new NGINX, PHP and MySQL environments and managed end-to-end deployment pipelines.",
          "Led full-cycle migrations of legacy and decommissioned sites: audited codebases, resolved outdated dependencies, re-architected deployment configuration and validated in production.",
          "Configured DNS records, SSL/TLS certificates and SMTP for production environments.",
        ],
      },
      {
        title: "Product development",
        items: [
          "Led development of a Contract Management System with end-to-end encryption (React, Node.js, AWS Lambda, MySQL).",
          "Architected an OAuth 2.0 identity provider with role-based access control, used across multiple internal products (Next.js, PostgreSQL).",
          "Built on AWS Lambda, API Gateway, EC2 and IAM for scalable, cost-efficient infrastructure.",
        ],
      },
      {
        title: "Internal tooling",
        items: [
          "Built audit tools that let teams monitor, inspect and act on operational data without engineering help.",
          "Built a modular tooling system with the SEO team, reducing their dependency on engineering for routine tasks.",
        ],
      },
    ],
    technologies: ["Next.js", "React", "Node.js", "PostgreSQL", "MySQL", "AWS", "DigitalOcean", "NGINX", "Linux"],
  },
  {
    company: "Ginger Media Group",
    role: "Software Engineer",
    period: "Feb 2024 – Jun 2025",
    location: "Bengaluru, India",
    groups: [
      {
        items: [
          "Built reusable React components across web and mobile apps, accelerating feature delivery by 50%.",
          "Implemented user profile and admin modules, increasing user engagement by 20%.",
          "Optimised a 0.5 GB+ file upload pipeline and filtering system, improving processing speed by 35%.",
          "Migrated backend services to AWS Lambda, reducing infrastructure cost and improving scalability.",
          "Helped diagnose and resolve priority production incidents.",
        ],
      },
    ],
    technologies: ["React", "Next.js", "Node.js", "AWS Lambda", "API Gateway", "MySQL"],
  },
  {
    company: "Swift Ride",
    role: "Android Developer · Co-founder",
    period: "Nov 2021 – Nov 2023",
    location: "Bengaluru, India",
    note: "Startup co-founded with friends during my B.Tech.",
    groups: [
      {
        items: [
          "Refactored the Kotlin codebase, improving app load speed by 30%.",
          "Delivered user-driven features iteratively, growing the active user base by 35%.",
          "Led Android release and testing cycles in Android Studio, keeping releases stable.",
        ],
      },
    ],
    technologies: ["Kotlin", "Android Studio"],
  },
];
