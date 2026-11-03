import type { AboutPrinciple } from "./types";

export const aboutNarrative = {
  headline: "Most security bugs are ordinary code.",
  paragraphs: [
    "I build products in TypeScript: Next.js front ends and NestJS APIs, deployed on AWS. That's the code I know best, and it's where I'm focusing as I move into application security.",
    "The bugs that matter in web apps are rarely exotic. A route without a guard, a cookie without Secure, a query assembled with string concatenation. I want those caught automatically, before review, with an explanation of the fix.",
    "I'm making that move in the open. Every rule, test and benchmark result on this page is in a public repository, including the cases the rules still miss.",
  ],
};

export const principles: AboutPrinciple[] = [
  {
    title: "Failing test first",
    description: "A rule change starts with a fixture that fails. If I can't show the miss, I don't change the rule.",
  },
  {
    title: "Measure against ground truth",
    description: "Precision and recall come from labelled cases, predicted before the scan, not from impressions.",
  },
  {
    title: "Write down the blind spots",
    description: "Every rule documents what it can't see. A scanner that hides its gaps is worse than none.",
  },
];
