# 06 · Testing and validation

Each entry records commands actually run and their real output.

## M1 (2026-11-04)

| Check | Command | Result |
|---|---|---|
| Types | `npx tsc --noEmit` | Pass, no errors |
| Production build | `npx next build` | Pass, 8/8 static pages; shared first-load JS 102 kB |
| Layout | Playwright full-page render at 1440×900 and 390×844 | No horizontal overflow (`scrollWidth` equals viewport), no console errors |
| Lint | `npm run lint` | Not available: `next lint` is not configured in this repo and prompts for setup (pre-existing) |
| Unit tests | – | No test framework in the repo yet (added in M2) |

## M2 (2026-11-04)

| Check | Command | Result |
|---|---|---|
| Unit tests | `npm test` (Vitest) | 13/13 pass: path finding (flow vs monitoring edges, WAF bypass, unreachable target), SQL-injection outcomes for each control, inactive controls, connection validation |
| Types | `npx tsc --noEmit` | Pass |
| Build | `npx next build` | Pass; shared first-load JS 103 kB (React Flow is in a lazy chunk) |
| End to end | Playwright script at 1440×1000: inspect API node; Threat view and step 4/5; Defence: parameterized queries; WAF only; connect Browser → Web app | Outcomes: Attack succeeds → Blocked; WAF only → Impact reduced; after bypass → Attack succeeds and "no waf on the path" shown. No console errors |
| Small screen | Playwright 390×844, touch | Stepper renders, no React Flow in the DOM, no horizontal overflow |

## M3 (2026-11-04)

| Check | Command | Result |
|---|---|---|
| Unit tests | `npm test` | 31/31 pass. New tests: all seven scenarios present; each has a path and is open on the default architecture; every control explained; no control marked as blocking DDoS; XSS monitoring inactive until monitoring observes the web app; rate limiting needs a gateway; SAST placed at the web app for XSS |
| Types / build | `npx tsc --noEmit`, `npx next build` | Pass |
| End to end | Playwright at 1440×1000, Defence view per scenario | XSS, IDOR, SSRF, credential exposure, privilege escalation: Attack succeeds → Blocked with their root-cause control. DDoS: Attack succeeds → Impact reduced (WAF). XSS monitoring shows "no runtime monitoring on the path". DevSecOps → SAST links to the Marketplace listing. No console errors |

## M4 (2026-11-04)

| Check | Command | Result |
|---|---|---|
| Types / build / unit tests | `npx tsc --noEmit`, `npx next build`, `npm test` | Pass; 31/31 |
| 3D in a browser | Playwright with SwiftShader WebGL at 1440×1000: Threat view → 3D | Canvas renders. Labels "Browser · 01 … Database · 05" mark the path. Three JS chunks load only on the switch to 3D. Clicking the API box opens "API service" in the inspector. Back to 2D restores 8 nodes. No console errors |

## M5 (2026-11-04)

| Check | Command | Result |
|---|---|---|
| Unit tests | `npm test` | 40/40 (9 new fetcher tests) |
| Build | `npx next build` | Pass; `/` is now ISR with Revalidate 6h |
| Live render | Production server + Playwright | KEV: 5 real entries (catalogue 2026.11.03). NVD: 5 real critical CVEs from the last 7 days with CVSS. GitHub: "Unavailable: the source returned HTTP 401" (sandbox proxy). No browser requests to external hosts; no console errors |
