# 03 · Threatscape interactions

Section `#threatscape` (homepage section 01). A local simulation with
synthetic data: nothing is sent anywhere and nothing about the visitor is
collected.

## Model (`src/lib/threatscape/`)

| File | Contents |
|---|---|
| `types.ts` | Typed model: components, graph, scenarios, controls, evaluation results |
| `catalogue.ts` | 12 components, each with the explainer the brief requires (what it is, why it matters, example, risks, defences, CWE/OWASP where accurate, related link); `CONNECTS_TO` rules |
| `controls.ts` | 14 defensive controls, each with *reduces* and *does not solve* |
| `scenarios.ts` | Scenarios: entry and target component, preconditions, impact, per-component step text with synthetic samples, and the effect of each control (blocks / reduces / detects) |
| `engine.ts` | Pure functions: `findPath`, `evaluate`, `connectionError`, add/remove/connect/disconnect, `defaultGraph` |

**How evaluation works.** `findPath` takes the shortest request path from an
entry component to a target, following request-flow edges only. Edges from
Runtime monitoring and Container runtime mean "observes" and "hosts", never
request flow. A control acts only if a component of its kind is on the path;
monitoring acts on what it observes. Walking the path, the first *blocks*
stops the attack (later steps are marked unreached). Otherwise the outcome
is *reduced*, *detected* or *open*. If no path exists the outcome is *no
path*. A control that is on but has nothing to act on is reported as
inactive ("no WAF on the path").

## What works in M2 (verified in a browser)

| Interaction | Desktop (≥1024 px, fine pointer) | Small screens |
|---|---|---|
| Inspect a component (explainer panel) | Click a node | – |
| Add components | Drag from the palette, or click to add at the centre | – |
| Connect | Drag between handles, or "Connect to" in the inspector (keyboard) | – |
| Invalid connections | Refused, with a reason (`connectionError`) | – |
| Remove | Delete/Backspace, or "Remove component" | – |
| Views | Infrastructure, Threat, Defence, DevSecOps | Combined walk-through, with the pipeline below it |
| Guided scenarios (7, M3) | Step through the path (Previous/Next, or click a step); path drawn in the threat colour | Same steps and samples |
| Defensive controls | Toggle in Defence view; outcome and node badges update | Same toggles |
| Reset | Restores the default architecture and clears controls | Same |

The end-to-end check (Playwright, 2026-11-04):
1. With no controls the outcome is **Attack succeeds**.
2. Parameterized queries → **Blocked**.
3. With only WAF rules on → **Impact reduced**.
4. Connecting Browser → Web app directly → the WAF is bypassed, the outcome
   goes back to **Attack succeeds**, and the WAF control shows "no waf on the
   path".

## Scenarios (M3)

| Scenario | Path | Root-cause control (blocks) | Other controls |
|---|---|---|---|
| SQL injection (CWE-89) | Browser → … → Database | Parameterized queries; SAST | WAF (reduces), least-privilege DB (reduces), monitoring (detects) |
| Stored XSS (CWE-79) | Browser → … → Web app | Output encoding + CSP; SAST at the web app | WAF (reduces), monitoring (detects, only once monitoring observes the web app) |
| IDOR (CWE-639, CWE-862) | Browser → … → Database | Object-level authorization | SAST heuristics (reduces), rate limiting (reduces, needs a gateway), monitoring (detects) |
| SSRF (CWE-918) | Browser → … → API → Secrets | Egress allowlist | SAST (reduces), WAF (reduces), least-privilege IAM (reduces) |
| Credential exposure (CWE-200, CWE-798) | Browser → … → Web app | Secrets manager (server-only secrets); SAST | Monitoring (detects, needs monitoring on the web app) |
| Denial of service, conceptual (CWE-400, CWE-770) | Browser → … → API | None: no single control is shown as fixing it | CDN (needs a CDN), rate limiting (needs a gateway), WAF (reduces), monitoring (detects) |
| Privilege escalation via mass assignment (CWE-915, CWE-269) | Browser → … → Database | Input allowlist; SAST | Monitoring (detects), least-privilege DB (shown as little help, on purpose) |

Several controls start inactive on the default architecture and become
active only when the visitor adds the component they need: a CDN, an API
gateway, or monitoring connected to the web app. That is what makes the drag
and connect interactions teach something rather than decorate.

`ScenarioControl.at` lets a scenario place a control somewhere other than its
default component. For example, SAST acts at the web app for XSS and credential exposure.

## DevSecOps view (M3)

`src/lib/threatscape/pipeline.ts`, in eight stages: Code → Git → SAST →
Dependency scan → Build → Container scan → Deploy → Runtime monitoring. Each
stage covers what it does, what it helps catch, typical tools, and "in my
work", stated only where true. SAST links to the Sentinel Rules Marketplace
listing. Dependency scanning and runtime monitoring are reported as *not set
up on this site yet*, and container scanning as *not applicable* (Vercel, no
image).

## Not yet

- The 3D view (M4).
