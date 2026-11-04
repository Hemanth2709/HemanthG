import type { IntelResult } from "@/lib/intel/types";

import type { Step, Workflow } from "./workflow-engine";

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);
const stamp = (iso: string) => `${iso.slice(0, 16).replace("T", " ")} UTC`;

/**
 * The threat-intel workflow, built on the server from the same real CISA
 * KEV and NVD data as the "In the wild" feed. If a source is unavailable it
 * says so; no CVE, severity or date is ever made up.
 */
export function intelWorkflow(kev: IntelResult, nvd: IntelResult): Workflow {
  const steps: Step[] = [{ kind: "cmd", text: "curl -s $CISA_KEV_JSON | jq '.vulnerabilities[-3:]'" }];

  if (kev.ok && kev.items.length > 0) {
    steps.push({ kind: "progress", label: "Fetching CISA KEV catalogue", ms: 900 });
    for (const item of kev.items.slice(0, 3)) {
      steps.push({
        kind: "check",
        label: item.id,
        detail: item.product ? clip(item.product, 30) : undefined,
        result: "warn",
        resultText: item.added ? `KEV ${item.added}` : "KEV",
        ms: 380,
      });
    }
  } else {
    steps.push({ kind: "line", text: `CISA KEV unavailable${kev.ok ? "" : `: ${clip(kev.reason, 40)}`}`, tone: "muted" });
  }

  steps.push({ kind: "cmd", text: "curl -s \"$NVD_CVE_API?cvssV3Severity=CRITICAL\"" });
  if (nvd.ok && nvd.items.length > 0) {
    steps.push({ kind: "progress", label: "Querying NVD · last 7 days", ms: 900 });
    for (const item of nvd.items.slice(0, 2)) {
      steps.push({
        kind: "check",
        label: item.id,
        detail: item.severity,
        result: "crit",
        resultText: "critical",
        ms: 380,
      });
    }
  } else {
    steps.push({ kind: "line", text: `NVD unavailable${nvd.ok ? "" : `: ${clip(nvd.reason, 40)}`}`, tone: "muted" });
  }

  const retrieved = kev.ok ? kev.retrievedAt : nvd.ok ? nvd.retrievedAt : null;
  steps.push({
    kind: "line",
    text: retrieved ? `real public data · retrieved ${stamp(retrieved)}` : "no public data available right now",
    tone: retrieved ? "ok" : "muted",
  });

  return { id: "intel", title: "Threat intelligence", cwd: "~/intel", data: "live", steps };
}
