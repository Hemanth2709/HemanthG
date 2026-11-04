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
