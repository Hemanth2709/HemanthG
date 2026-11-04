import type { Workflow } from "./workflow-engine";

/**
 * Illustrative, defensive workflows for the hero background. The output is
 * simulated: it is labelled as such on screen and never presented as a real
 * scan. Rule IDs, CWE and OWASP mappings are the real ones from
 * github.com/Hemanth2709/SentinelRules (main, 14 rules in 12 files).
 *
 * The threat-intel workflow is built separately from real public data
 * (see workflow-intel.ts).
 */

export const SENTINEL_RULE_COUNT = 14;
export const SENTINEL_RULE_FILES = 12;

const sentinel: Workflow = {
  id: "sentinel",
  title: "SentinelRules analysis",
  cwd: "~/sentinel-rules",
  data: "simulated",
  steps: [
    { kind: "cmd", text: "semgrep scan --config rules/ app/" },
    { kind: "line", text: `Loaded ${SENTINEL_RULE_COUNT} rules from ${SENTINEL_RULE_FILES} files`, tone: "info" },
    { kind: "line", text: "Targets: TypeScript · NestJS · Next.js · React", tone: "muted" },
    { kind: "progress", label: "Parsing source files", ms: 1300 },
    { kind: "check", label: "sql-injection-raw-query", detail: "CWE-89", result: "crit", resultText: "1 finding", ms: 700 },
    { kind: "check", label: "jwt-ignore-expiration", detail: "CWE-613", result: "pass" },
    { kind: "check", label: "nestjs-route-missing-guard", detail: "CWE-862", result: "warn", resultText: "review" },
    { kind: "check", label: "react-dangerously-set-inner-html", detail: "CWE-79", result: "pass" },
    { kind: "check", label: "next-public-secret-env", detail: "CWE-200", result: "pass" },
    { kind: "check", label: "insecure-session-cookie", detail: "CWE-1004", result: "pass" },
    { kind: "check", label: "ssrf-user-controlled-url", detail: "CWE-918", result: "pass" },
    { kind: "line", text: "Mapping findings to OWASP Top 10 (2021)", tone: "muted" },
    { kind: "line", text: "  CWE-89  → A03:2021 Injection", tone: "plain" },
    { kind: "line", text: "  CWE-862 → A01:2021 Broken Access Control", tone: "plain" },
    { kind: "line", text: "  fix: bind parameters instead of string concat", tone: "info" },
    { kind: "progress", label: "Writing SARIF report", ms: 800 },
    { kind: "line", text: "✓ sentinel.sarif · 2 findings · simulated run", tone: "ok" },
  ],
};

const appsec: Workflow = {
  id: "appsec",
  title: "Secure code review",
  cwd: "~/orders-api",
  data: "simulated",
  steps: [
    { kind: "cmd", text: "npm run lint:security" },
    { kind: "check", label: "DTOs validated (whitelist: true)", detail: "CWE-915", result: "pass" },
    { kind: "check", label: "Guards on every controller route", detail: "CWE-862", result: "pass" },
    { kind: "check", label: "Ownership check on GET /orders/:id", detail: "CWE-639", result: "pass" },
    { kind: "check", label: "Queries use bound parameters", detail: "CWE-89", result: "pass" },
    { kind: "check", label: "JWT algorithms pinned (RS256)", detail: "CWE-347", result: "pass" },
    { kind: "check", label: "Redirect targets allow-listed", detail: "CWE-601", result: "warn", resultText: "1 to review" },
    { kind: "line", text: "Mapped to OWASP Top 10: A01 · A03 · A07 · A08", tone: "muted" },
  ],
};

const linux: Workflow = {
  id: "linux",
  title: "Linux hardening review",
  cwd: "admin@edge-01:~",
  data: "simulated",
  steps: [
    { kind: "cmd", text: "systemctl status ssh" },
    { kind: "line", text: "● ssh.service - OpenBSD Secure Shell server", tone: "plain" },
    { kind: "line", text: "  Active: active (running) · PasswordAuthentication no", tone: "ok" },
    { kind: "cmd", text: "sudo ufw status verbose" },
    { kind: "line", text: "Status: active", tone: "ok" },
    { kind: "line", text: "Default: deny (incoming), allow (outgoing)", tone: "plain" },
    { kind: "line", text: "443/tcp  ALLOW IN  Anywhere", tone: "muted" },
    { kind: "line", text: "22/tcp   LIMIT IN  Anywhere", tone: "muted" },
    { kind: "cmd", text: "journalctl -u nginx --since today" },
    { kind: "progress", label: "Reading journal", ms: 900 },
    { kind: "line", text: "429 rate limit applied on /api/login (12 times)", tone: "warn" },
    { kind: "cmd", text: "ss -tuln" },
    { kind: "line", text: "tcp  LISTEN  0.0.0.0:443", tone: "plain" },
    { kind: "line", text: "tcp  LISTEN  0.0.0.0:22", tone: "plain" },
    { kind: "line", text: "tcp  LISTEN  127.0.0.1:5432   local only", tone: "plain" },
    { kind: "check", label: "No unexpected listening services", result: "pass" },
  ],
};

const container: Workflow = {
  id: "container",
  title: "Container security",
  cwd: "~/secure-app",
  data: "simulated",
  steps: [
    { kind: "cmd", text: "docker image inspect secure-app -f '{{.Config.User}}'" },
    { kind: "line", text: "app", tone: "plain" },
    { kind: "check", label: "Runs as non-root user", result: "pass" },
    { kind: "cmd", text: "docker scout quickview secure-app:1.4.2" },
    { kind: "progress", label: "Indexing SBOM · 214 packages", ms: 1400 },
    { kind: "line", text: "Base image   node:22-alpine", tone: "muted" },
    { kind: "line", text: "Image        0C  0H  2M  5L", tone: "warn" },
    { kind: "check", label: "No critical or high vulnerabilities", result: "pass" },
    { kind: "check", label: "Read-only root filesystem", result: "pass" },
    { kind: "cmd", text: "docker compose ps" },
    { kind: "line", text: "secure-app   running (healthy)", tone: "ok" },
    { kind: "line", text: "postgres     running (healthy)", tone: "ok" },
  ],
};

const cloud: Workflow = {
  id: "cloud",
  title: "Cloud posture",
  cwd: "~/infra",
  data: "simulated",
  steps: [
    { kind: "cmd", text: "aws s3api get-public-access-block --bucket app-assets" },
    { kind: "line", text: "BlockPublicAcls: true · BlockPublicPolicy: true", tone: "ok" },
    { kind: "cmd", text: "aws iam list-attached-role-policies --role-name api-task" },
    { kind: "line", text: "orders-read (customer managed, 3 actions)", tone: "plain" },
    { kind: "check", label: "No wildcard actions on api-task", detail: "least privilege", result: "pass" },
    { kind: "cmd", text: "openssl s_client -connect api.example.com:443 -brief" },
    { kind: "line", text: "Protocol version: TLSv1.3", tone: "ok" },
    { kind: "check", label: "TLS 1.0 and 1.1 disabled", result: "pass" },
    { kind: "cmd", text: "checkov -d . --compact" },
    { kind: "progress", label: "Evaluating Terraform", ms: 1300 },
    { kind: "line", text: "Passed checks: 46, Failed checks: 1", tone: "warn" },
    { kind: "line", text: "CKV_AWS_18 S3 access logging disabled · s3.tf", tone: "warn" },
  ],
};

const devsecops: Workflow = {
  id: "devsecops",
  title: "DevSecOps pipeline",
  cwd: "~/orders-api",
  data: "simulated",
  steps: [
    { kind: "cmd", text: "git push origin main" },
    { kind: "line", text: "pipeline triggered · main@a1f9c3e", tone: "info" },
    { kind: "check", label: "build", detail: "tsc · next build", result: "pass", ms: 700 },
    { kind: "check", label: "unit tests", detail: "vitest", result: "pass", ms: 700 },
    { kind: "check", label: "SAST", detail: "Sentinel Rules", result: "pass", ms: 800 },
    { kind: "check", label: "dependency scan", detail: "npm audit", result: "warn", resultText: "2 moderate", ms: 700 },
    { kind: "check", label: "container scan", detail: "docker scout", result: "pass", ms: 700 },
    { kind: "check", label: "deploy · staging", detail: "health checks", result: "pass", ms: 800 },
    { kind: "check", label: "runtime monitoring", detail: "alerts armed", result: "pass" },
    { kind: "line", text: "✓ promoted to production · simulated pipeline", tone: "ok" },
  ],
};

/** Static workflows in order. The live threat-intel workflow is appended after these. */
export const WORKFLOWS: Workflow[] = [sentinel, linux, container, appsec, cloud, devsecops];
