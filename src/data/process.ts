import type { ProcessStep } from "./types";

/** The loop every rule in Sentinel-Security goes through. */
export const processSteps: ProcessStep[] = [
  {
    id: "model",
    label: "Model",
    description:
      "Pin down the weakness: what the vulnerable code looks like, what makes it exploitable, and the CWE and OWASP category it belongs to.",
    outputs: ["Vulnerable example", "Fixed example", "CWE / OWASP mapping"],
  },
  {
    id: "test",
    label: "Test",
    description:
      "Write the fixtures before the rule: lines that must be flagged, and safe look-alikes that must not be.",
    outputs: ["ruleid fixtures", "ok fixtures", "Failing run"],
  },
  {
    id: "rule",
    label: "Rule",
    description:
      "Write the Semgrep pattern, scoped tightly enough that generic code doesn't match, until every fixture passes.",
    outputs: ["YAML rule", "Metadata", "Passing fixtures"],
  },
  {
    id: "measure",
    label: "Measure",
    description:
      "Scan the deliberately vulnerable app and score the result against its ground truth: what was caught, what was missed, what was wrong.",
    outputs: ["Precision", "Recall", "Missed cases"],
  },
  {
    id: "automate",
    label: "Automate",
    description:
      "Run validation, fixtures and examples in GitHub Actions on every push, with the Semgrep version pinned.",
    outputs: ["CI workflow", "Pinned versions", "Green main"],
  },
  {
    id: "document",
    label: "Document",
    description:
      "Record the fix, the false positives and the known misses, then feed the misses back in as the next round of tests.",
    outputs: ["Remediation guide", "Limitations", "Next fixtures"],
  },
];
