import type { WritingEntry } from "./types";

const DOCS = "https://github.com/Hemanth2709/SentinelRules/blob/main/docs";

/**
 * Real, published writing only. Everything here is a document in the
 * public SentinelRules repository. No articles are listed until they exist.
 */
export const writing: WritingEntry[] = [
  {
    title: "Benchmark methodology",
    kind: "Method",
    summary: "How the rules are measured: a ground-truth app with planted bugs and safe look-alikes, and predictions recorded before each scan.",
    href: `${DOCS}/benchmark-methodology.md`,
  },
  {
    title: "Benchmark results",
    kind: "Results",
    summary: "Every scan so far, real applications and the ground-truth app, including the false positives and the misses.",
    href: `${DOCS}/benchmark-results.md`,
  },
  {
    title: "Rule-writing guide",
    kind: "Guide",
    summary: "How a Semgrep rule in the pack is built and tested, using the SQL-injection rule as the worked example.",
    href: `${DOCS}/rule-writing-guide.md`,
  },
  {
    title: "False-positive considerations",
    kind: "Notes",
    summary: "The false-positive classes of each rule and how to deal with them in review.",
    href: `${DOCS}/false-positives.md`,
  },
  {
    title: "Decision log",
    kind: "Decisions",
    summary: "Why the project works the way it does: one record per design decision, with the trade-offs.",
    href: `${DOCS}/decisions/decision-log.md`,
  },
  {
    title: "Secure coding patterns",
    kind: "Learning notes",
    summary: "The secure counterpart to each weakness the rules cover, pointing to the before/after code in each rule's remediation guide.",
    href: `${DOCS}/learning-notes/secure-coding-patterns.md`,
  },
  {
    title: "TypeScript security patterns",
    kind: "Learning notes",
    summary: "The vulnerable TypeScript patterns the rule pack detects, such as dynamic SQL and JWT verification options, and why each is dangerous.",
    href: `${DOCS}/learning-notes/typescript-security-patterns.md`,
  },
  {
    title: "Lessons learned",
    kind: "Learning notes",
    summary: "Notes from building the first rules and benchmark scans: what was harder to detect than expected, and why false positives occurred.",
    href: `${DOCS}/learning-notes/lessons-learned.md`,
  },
];
