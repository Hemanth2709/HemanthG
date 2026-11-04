import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/reveal";

import { Benchmark } from "./security-benchmark";
import { Coverage } from "./security-coverage";

const practice = [
  {
    title: "In my day job",
    points: [
      "OAuth 2.0 single sign-on with role-based access control",
      "End-to-end encryption for contract data",
      "DNS, SSL/TLS and NGINX configuration for production servers",
    ],
  },
  {
    title: "In the open",
    points: [
      "Sentinel-Security: SAST rules for NestJS and Next.js",
      "Every rule mapped to a CWE and an OWASP Top 10 category",
      "Published as a GitHub Action; scans this site in CI on every push",
    ],
  },
  {
    title: "Learning next",
    points: [
      "Identity and access management, starting with Microsoft Entra ID",
      "DevSecOps tooling in CI/CD pipelines",
      "Cloud security on AWS",
    ],
  },
];

const figures = [
  { value: "14", label: "rules" },
  { value: "144", label: "test cases" },
  { value: "74%", label: "precision" },
  { value: "67%", label: "recall" },
];

/** Day-job, open-source and learning columns, shown in Engineering Journey. */
export function SecurityPractice() {
  return (
        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {practice.map((column, index) => (
            <Reveal key={column.title} delay={index * 0.05} className="bg-background p-6 md:p-8">
              <h3 className="label">{column.title}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {column.points.map((point) => (
                  <li key={point} className="grid grid-cols-[1.25rem_1fr] text-sm leading-relaxed text-muted">
                    <span aria-hidden className="mt-[0.7em] h-px w-2.5 bg-accent/70" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
  );
}

/** Sentinel-Security figures, benchmark and rule tables, shown in Selected Work. */
export function SentinelEvidence() {
  return (
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="min-w-0 lg:col-span-4">
            <p className="label">Evidence</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Sentinel-Security v0.2.0
            </h3>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">
              Measured against a deliberately vulnerable NestJS and Next.js app with 30 planted vulnerabilities and 24
              safe look-alikes, with each outcome predicted before the scan.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6">
              {figures.map((figure) => (
                <div key={figure.label} className="flex flex-col">
                  <dt className="order-2 mt-1 text-sm text-muted">{figure.label}</dt>
                  <dd className="order-1 font-mono text-3xl font-medium tracking-tight text-foreground tabular-nums">
                    {figure.value}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href="https://github.com/Hemanth2709/SentinelRules/blob/main/docs/benchmark-results.md"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-1.5 text-sm text-foreground transition-colors duration-200 hover:text-accent-bright"
            >
              Read the benchmark method
              <ArrowUpRight className="size-4 text-subtle transition-colors group-hover:text-accent-bright" />
            </a>
          </Reveal>

          <div className="flex min-w-0 flex-col gap-14 lg:col-span-8">
            <Benchmark />
            <Coverage />
          </div>
        </div>
  );
}
