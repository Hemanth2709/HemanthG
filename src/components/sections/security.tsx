import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

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
      "Scans this site in CI on every push",
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
  { value: "10", label: "rules" },
  { value: "94", label: "test cases" },
  { value: "75%", label: "precision" },
  { value: "65%", label: "recall" },
];

export function Security() {
  return (
    <section
      id="security"
      className="relative scroll-mt-20 border-t border-line bg-surface/40 py-24 md:py-36"
      aria-label="Security"
    >
      <div className="container-site">
        <SectionHeading
          index="05"
          label="Security"
          title={["Security should be part of engineering,", "not an afterthought."]}
          description="Security has grown out of my engineering work rather than replacing it. This is what I've done so far, and the evidence for it."
        />

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

        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <p className="label">Evidence</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Sentinel-Security v0.1.1
            </h3>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">
              Measured against a deliberately vulnerable NestJS and Next.js app with 26 planted vulnerabilities and 20
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

          <div className="flex flex-col gap-14 lg:col-span-8">
            <Benchmark />
            <Coverage />
          </div>
        </div>
      </div>
    </section>
  );
}
