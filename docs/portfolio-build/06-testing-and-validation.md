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

## M6 (2026-11-04)

| Check | Command | Result |
|---|---|---|
| Unit tests | `npm test` | 47/47 (7 new posture tests: missing never passes, strong config passes, `'unsafe-inline'` is partial, short HSTS and unsafe referrer are partial, multi-token Referrer-Policy, http fails, unknown reasons) |
| Headers sent | `curl -D - http://localhost:3100/` | All six headers present with the values in [10](10-security-posture.md) |
| CSP compatibility | Re-ran the M2, M3 and M4 Playwright scripts with CSP on | Same outcomes, no console errors or CSP violations |
| Posture section | Playwright | Reports the live production site: HTTPS and HSTS present, four headers missing (the deployed version predates this change) |
| Layout | Playwright full page at 1440, 820, 390 px | No overflow, after fixing the stepper's scenario select (was 398 px wide at 390 px) |

## M7 (2026-11-04)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass, 0 problems (after fixing 3 unescaped apostrophes, 1 `useMemo` dependency warning and the config's anonymous default export) |
| Unit tests | `npm test` | 47/47 pass (3 files) |
| Types | `npx tsc --noEmit` | Pass |
| Build | `npx next build` | Pass; `/` is ISR (Revalidate 6h), 11.4 kB route, 115 kB first-load JS |
| Accessibility | axe-core 4.10.3 via Playwright, full page, 1440×900 and 390×844, Threatscape loaded | 0 violations on both (54 and 51 passing rules), after the fixes in [05](05-architecture-and-technical-decisions.md#m7-decisions). Re-run on the final build |
| Lighthouse desktop | Lighthouse 12.6.1, production server on localhost | Performance 100, Accessibility 100, Best practices 100, SEO 100 |
| Lighthouse mobile | Lighthouse 12.6.1, default mobile throttling | Before CSS reveal: Performance 84 (TBT 420 ms). After: Performance 94–95 across runs (LCP 2.5–2.6 s, TBT 160–190 ms, CLS 0); Accessibility, Best practices and SEO 100 |
| Keyboard | Playwright script at 1440×1000 | Tab from Infrastructure reaches the Threat tab and Enter selects it; Enter on the palette's "API gateway" button adds a node (8 → 9) and opens it in the Inspector; a focused canvas node shows a 3 px solid outline. Other controls are native buttons, selects and checkboxes but were not each driven by keyboard in a script |
| Reduced motion | Same script, `reducedMotion: "reduce"` | 0 animated edges in Threat view. 3D pulses and the reveal animation are gated on the same preference in code (`scene3d.tsx`, `globals.css`) but were not measured separately |
| Layout | Playwright full page at 1440, 820 and 390 px | No horizontal overflow |

Lighthouse runs locally do not include Vercel's CDN, so field numbers on the
deployed site will differ.

## M8 · Hero: Visitor Intelligence and simulated session (2026-11-04)

The production build ran locally with `VERCEL=1`. Playwright injected
documentation-range IPs and Vercel geolocation headers, so the trusted code
path ran end to end. It has **not** been run on a real Vercel deployment.

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass, 0 problems |
| Unit tests | `npm test` | 71/71 pass. New tests: 15 for visitor header parsing (trusted only on Vercel, malformed values dropped, IPv6, partial data) and the User-Agent parser (8 real UAs, unknown → null); 9 for the workflow engine (typing, progressive output, progress, check states, leave/next/loop, determinism, resting frame) and the workflow data (no destructive or offensive commands; first workflow is SentinelRules; static ones are marked simulated) |
| Types | `npx tsc --noEmit` | Pass |
| Build | `npm run build` (`next build`) | Pass. `/` is still static ISR (Revalidate 6h, 13.9 kB route, 117 kB first load); `/api/visitor` is the only dynamic route |
| Endpoint | `curl -D -` with and without geo headers | Returns only the caller's own values; `Cache-Control: private, no-store, max-age=0`, `CDN-Cache-Control: no-store`, `Vercel-CDN-Cache-Control: no-store` |
| No cross-visitor caching | Two browser contexts with different IPs (203.0.113.24 Bengaluru, 198.51.100.77 Mysuru) | Each saw only its own IP and city |
| Lookup failure | Playwright, `/api/visitor` aborted | "Public IP: Unavailable", "Location unavailable"; device fields still shown; LIVE shown |
| Device fields | Playwright at 1440, 820, 390 px | Browser "Chrome 153", OS "Linux", screen, viewport, 2× DPR, en-US, UTC, "4g (effective)"; viewport updates on resize (1440 × 900 → 1280 × 800) |
| Typing | Samples every 120 ms | `admin@edge-01:~ $` → `… $ sys` → `… $ systemc` → … → `… $ systemctl status ss` |
| Rotation | 75 s on desktop | All 7 workflows seen in order, then back to SentinelRules |
| Real intel workflow | Desktop | 3 real KEV entries (dates added 2026-11-03, 2026-10-30, 2026-10-30) and the NVD query, retrieved at build time |
| Reduced motion | `reducedMotion: "reduce"` | Stream text identical after 3 s (static first frame) |
| Layout shift | PerformanceObserver over about 8 s | 0.0000 at 1440, 820 and 390 px. An earlier bottom-anchored stream scored 0.037 on tablet and was fixed |
| Overflow | Playwright | None at 1440, 820 or 390 px |
| Console and network | Playwright | No console errors; no requests to external hosts |
| Accessibility | axe-core 4.10.3 | 0 violations at desktop (53 passing rules) and mobile (50) |
| Lighthouse desktop | Lighthouse 12.6.1, `CHROME_PATH` set | 100 / 100 / 100 / 100, LCP 0.6 s, TBT 0 ms, CLS 0 |
| Lighthouse mobile | Same, default throttling, 4 runs | Performance 72 (cold first run), 93, 91, 95; Accessibility, Best practices and SEO 100; CLS 0. `main` measured the same way: 95, 96, 96, 95 |

A correction to this milestone's own process: the first Lighthouse
re-runs failed silently, because this version needs `CHROME_PATH` as an
environment variable. The script then re-read the M7 report files, so the
early "84" figures were stale. Only the runs in the table above are real.
