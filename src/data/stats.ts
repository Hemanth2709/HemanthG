import type { Stat } from "./types";

/** Sentinel-Security v0.1.1. Each figure is in the repository. */
export const stats: Stat[] = [
  {
    value: 10,
    suffix: "",
    label: "Security rules",
    description: "Each mapped to a CWE and an OWASP category",
  },
  {
    value: 94,
    suffix: "",
    label: "Test cases",
    description: "47 that must be flagged, 47 that must not",
  },
  {
    value: 26,
    suffix: "",
    label: "Planted vulnerabilities",
    description: "In the benchmark app, alongside 20 safe look-alikes",
  },
  {
    value: 75,
    suffix: "%",
    label: "Precision",
    description: "Findings that were real bugs",
  },
  {
    value: 65,
    suffix: "%",
    label: "Recall",
    description: "Planted bugs found, in the categories the rules cover",
  },
];
