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
| Views | Infrastructure, Threat, Defence | Combined walk-through |
| Guided scenario: SQL injection | Step through the path (Previous/Next, or click a step); path drawn in the threat colour | Same steps and samples |
| Defensive controls | Toggle in Defence view; outcome and node badges update | Same toggles |
| Reset | Restores the default architecture and clears controls | Same |

The end-to-end check (Playwright, 2026-11-04):
1. With no controls the outcome is **Attack succeeds**.
2. Parameterized queries → **Blocked**.
3. With only WAF rules on → **Impact reduced**.
4. Connecting Browser → Web app directly → the WAF is bypassed, the outcome
   goes back to **Attack succeeds**, and the WAF control shows "no waf on the
   path".

## Not yet (later milestones)

- Scenarios other than SQL injection, and the DevSecOps pipeline view (M3).
- The 3D view (M4).
