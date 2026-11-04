# Implementation handover

Portfolio upgrade for `Hemanth2709/HemanthG`, following
[BRIEF.md](BRIEF.md). Written for an independent review (for example by
ChatGPT or Codex). Everything below is stated as implemented and checked
only where it was; gaps are listed in sections 2 and 11.

- Branch: `claude/zealous-franklin-4fgini`, open as PR #9 against `main`.
- Milestones M1–M7, all on 2026-11-04. Milestone details are in
  [07](07-milestone-log.md); test evidence is in [06](06-testing-and-validation.md).

## Concise change summary (for independent review)

1. **Page restructured** into Hero → 01 Threatscape → 02 Selected work →
   03 Engineering journey → 04 Research & writing → 05 This site (posture)
   → 06 Contact. Existing content kept; About, Experience, Security
   practice and Skills now sit inside Engineering journey.
2. **Threatscape**, an interactive, simulated architecture:
   - a typed graph model with a pure, unit-tested engine;
   - a React Flow editor on desktop and a step-through fallback on small
     screens;
   - four views (Infrastructure, Threat, Defence, DevSecOps), seven
     scenarios and 15 defensive controls;
   - an eight-stage DevSecOps pipeline;
   - an optional three.js 3D view of the same state.
3. **"In the wild" intel feed**:
   - real data from CISA KEV, NVD and the GitHub Advisory Database;
   - fetched on the server only, cached with ISR for 6 hours;
   - shows the source dates and the retrieval time;
   - each source fails on its own, without affecting the others.
4. **Security headers** (CSP, HSTS, nosniff, Referrer-Policy,
   Permissions-Policy, X-Frame-Options), plus a **posture section**. The
   section checks the deployed site's real response headers on the server
   and reports pass, partial, missing or unknown, so nothing is hardcoded.
5. **Visual system**:
   - Space Grotesk display type alongside Inter and IBM Plex Mono;
   - semantic threat and defence colour tokens;
   - no terminal or neon clichés.
6. **Quality**:
   - Vitest (47 tests) and ESLint added;
   - axe shows 0 violations;
   - Lighthouse desktop scores 100 in all four categories, and mobile
     performance is 94–95;
   - the scroll reveal now uses CSS only.
7. **No visitor tracking of any kind**: no analytics, cookies, storage,
   fingerprinting or probing.

## 1. Summary of what was implemented

The site keeps the existing Next.js 15 / React 19 / Tailwind v4 app and its
content. On top of that, the work added:

- **Threatscape** (`#threatscape`): an editable architecture of 8 default
  components (12 kinds available) where visitors can:
  - inspect a component (what / why / example / risks / defences /
    CWE / OWASP / related link);
  - add components by drag or click, connect them (invalid connections
    are refused with a reason) and remove them;
  - step through an attack path for one of 7 scenarios;
  - toggle controls and see the outcome change: *Attack succeeds*,
    *Detected*, *Impact reduced* or *Blocked*;
  - view the pipeline, and reset everything.
- **Phone and tablet fallback:** the stepper walks through the same
  scenarios on the default architecture, with the same controls, and never
  loads React Flow.
- **3D view:** a read-only layered scene, with selection synced to the
  inspector. three.js loads only when 3D is chosen.
- **Intel feed** at the end of the Threatscape section.
- **Posture section** ("This site") and real security headers.
- **Research & writing:** links to 8 real Sentinel Rules documents.
- **Milestone documentation:** `docs/portfolio-build/00`–`10` and this file.

## 2. Original scope versus delivered scope

| Brief item | Delivered | Notes |
|---|---|---|
| §3 One portfolio, suggested flow | Yes | Adds a "This site" posture section before Contact |
| §4.1 Layered or 3D scene | Yes | 2D layered editor plus a 3D view. Component kinds: browser, CDN, WAF, API gateway, web app, API, auth, database, cache, secrets manager, container (Docker/Kubernetes), monitoring. **No separate "cloud" or "Kubernetes cluster" node**; CI/CD is the DevSecOps view, not a node |
| §4.2 Select, inspect, drag, connect, switch views, reset, guided examples | Yes (desktop) | Small screens get guided examples only, with no editing (by design) |
| §4.3 Seven scenarios | Yes, all seven | DDoS is conceptual, and no single control is shown as fixing it |
| §4.4 Controls | Partly | 15 controls, each with "reduces" and "does not solve" text. WAF, IAM / authorization, rate limiting, parameterized queries, output encoding + CSP, secrets management, SAST, dependency and container scanning, and runtime monitoring are covered. **Encryption and DAST are not modelled as controls** |
| §4.5 DevSecOps pipeline | Yes | 8 stages with what / catches / tools / "in my work". SAST links to the Sentinel Rules Marketplace listing |
| §4.6 Explainability | Yes | CWE and OWASP mappings only where accurate; a related link where one exists |
| §5 Public threat intel | Yes | The GitHub column has **not been seen working live** (see section 11) |
| §6 Visitor privacy | Yes | Nothing is collected |
| §7 Posture | Yes | Covers HTTPS, HSTS, CSP, nosniff, Referrer-Policy and Permissions-Policy |
| §8 Selected work | Kept existing case studies | **TracerFlow and AI Health Prediction left out**, at the owner's request, until details are confirmed |
| §9 Technical guidance | Mostly | Not used: R3F, Drei, GSAP or Framer Motion (see section 13) |
| §10 Acceptance | See section 9 | |
| §11–12 Docs and handover | Yes | |

## 3. Milestone-by-milestone changes

| Milestone | Commit | Changes |
|---|---|---|
| (before the brief) | `396475d`, `7629dbc` | The workflow uses the Sentinel Rules v0.2.0 Marketplace Action; the site shows Sentinel Rules v0.2.0 |
| M1 | `1304e96` | Docs skeleton, fonts and colour tokens, new section order, Journey and Writing sections, `Subsection` |
| M2 | `83587c4` | Threatscape types and engine with tests, React Flow workbench, stepper, lazy loader, SQL injection end to end |
| M3 | `ca105f8` | Six more scenarios, input-allowlist control, per-scenario control placement (`at`), pipeline view |
| M4 | `d4c22fd` | three.js 3D view, 2D/3D toggle, WebGL detection |
| M5 | `178eaa0` | Intel fetchers (server-only) with fixtures and tests, feed UI, `RelativeTime`, ISR |
| M6 | `aa03966` | Security headers, posture evaluation and fetch, posture section, `site.url` fix, screenshots |
| M7 | this commit | ESLint, accessibility and contrast fixes, focus styles, CSS-only reveal, navbar label fix, docs 05–08 and this handover |

## 4. Files created, modified and deleted

Compared with `origin/main`, the M7 changes included.

**Created**
- **Docs:**
  - `docs/portfolio-build/BRIEF.md`;
  - `00-product-and-design-direction.md`;
  - `01-information-architecture.md`;
  - `02-visual-system.md`;
  - `03-threatscape-interactions.md`;
  - `04-security-and-privacy-decisions.md`;
  - `05-architecture-and-technical-decisions.md`;
  - `06-testing-and-validation.md`;
  - `07-milestone-log.md`;
  - `08-known-issues-and-follow-ups.md`;
  - `09-public-threat-intelligence.md`;
  - `10-security-posture.md`;
  - `IMPLEMENTATION-HANDOVER.md`.
- **Engine:** `src/lib/threatscape/` holds `types.ts`, `catalogue.ts`,
  `controls.ts`, `scenarios.ts`, `engine.ts`, `pipeline.ts` and
  `engine.test.ts`.
- **Intel:** `src/lib/intel/` holds `types.ts`, `fetchers.ts`,
  `fetchers.test.ts`, and `__fixtures__/` with `README.md`,
  `kev.sample.json` and `nvd.sample.json`.
- **Posture:** `src/lib/posture/` holds `evaluate.ts`, `evaluate.test.ts`
  and `fetch.ts`.
- **Threatscape UI:** `src/components/threatscape/` holds:
  - `component-node.tsx`, `panels.tsx` and `use-threatscape.ts`;
  - `workbench.tsx`, `stepper.tsx` and `loader.tsx`;
  - `pipeline-view.tsx` and `scene3d.tsx`;
  - `intel-feed.tsx` and `relative-time.tsx`.
- **Sections:** `src/components/sections/` gains `threatscape.tsx`,
  `journey.tsx`, `writing.tsx` and `posture.tsx`.
- **Other source:**
  - `src/components/ui/subsection.tsx`;
  - `src/data/writing.ts`;
  - `src/test/empty.ts`.
- **Config:** `vitest.config.ts` and `eslint.config.mjs`.
- **Screenshots:** `shots/m6-top.png`, `m6-full.png`, `m6-t-top.png`,
  `m6-t-full.png`, `m6-m-top.png` and `m6-m-full.png`.

**Modified**
- **Config and CI:**
  - `.github/workflows/sentinel-rules.yml`;
  - `README.md`;
  - `next.config.ts`;
  - `package.json` and `package-lock.json`.
- **App:** `src/app/globals.css`, `src/app/layout.tsx` and
  `src/app/page.tsx`.
- **Shared components:**
  - `src/components/effects/reveal.tsx`;
  - `src/components/layout/navbar.tsx`;
  - `src/components/ui/flow.tsx`;
  - `src/components/ui/section-heading.tsx`.
- **Sections:** in `src/components/sections/`:
  - `about.tsx`, `contact.tsx`, `experience.tsx`, `hero.tsx` and
    `skills.tsx`;
  - `security-benchmark.tsx` and `security-coverage.tsx`;
  - `projects/featured.tsx`, `projects/index.tsx` and
    `projects/project-row.tsx`.
- **Data:** in `src/data/`: `about.ts`, `projects.ts`, `site.ts` and
  `types.ts`.

**Renamed or deleted**
- `src/components/sections/security.tsx` was renamed to
  `security-practice.tsx` and split into `SecurityPractice` and
  `SentinelEvidence`.
- No other files were deleted.

## 5. Architecture and dependency decisions

Full detail: [05](05-architecture-and-technical-decisions.md).

- **One typed `Graph` state** (`use-threatscape.ts`) feeds the 2D editor,
  the stepper and the 3D view. The engine is pure TypeScript with no React
  and no DOM.
- **React Flow is a controlled view over that state.** The engine never
  imports React Flow types.
- **Engine rules:**
  - the attack path is the shortest path over request-flow edges only;
  - edges from monitoring and container are observe or host edges, and
    never carry requests;
  - effects rank `blocks > reduces > detects`;
  - a control with nothing to act on is shown as inactive, with the reason.
- **Lazy loading:**
  - the Threatscape bundle loads only within 600 px of the viewport;
  - desktop (≥ 1024 px with a fine pointer) gets the workbench;
  - everything else gets the stepper;
  - three.js loads only on the switch to 3D.
- **Data:**
  - ISR (`revalidate = 21600`), with no database;
  - fetchers are marked `server-only`, so the optional API keys cannot
    reach the browser bundle.
- **Dependencies added** (exact versions):
  - `three@0.180.0`, `@types/three@0.180.0`;
  - `@xyflow/react@12.9.3`;
  - `server-only@0.0.1`;
  - dev: `vitest@3.2.4`, `eslint@9.36.0`, `eslint-config-next@15.5.4`,
    `@eslint/eslintrc@3.3.1`.

## 6. Threatscape interactions that genuinely work

Each of these was checked in a real browser with Playwright against a
production build. Details are in [03](03-threatscape-interactions.md) and
[06](06-testing-and-validation.md).

- **Inspecting:** clicking a node opens its explainer in the Inspector.
- **Adding:** a palette item can be dragged onto the canvas, or clicked or
  pressed with Enter to add it at the centre.
- **Connecting:**
  - by dragging between handles, or with "Connect to" in the Inspector;
  - incompatible connections are refused with a reason.
- **Removing:** with Delete or Backspace, or the "Remove component" button.
- **Views:** Infrastructure, Threat, Defence and DevSecOps, as a keyboard
  tablist.
- **Scenarios:** seven of them, stepped with Previous/Next or by clicking
  a step.
- **SQL injection, end to end:**
  1. With no controls, the attack succeeds.
  2. Parameterized queries block it.
  3. With WAF rules only, the impact is reduced.
  4. Connecting the browser straight to the web app bypasses the WAF: the
     attack succeeds again and the WAF shows "no waf on the path".
- **The other six scenarios:** each goes from *Attack succeeds* to
  *Blocked* with its root-cause control. DDoS goes only as far as
  *Impact reduced*.
- **Context-dependent controls:** some controls only become active after
  the visitor adds what they need:
  - a CDN;
  - an API gateway, for rate limiting;
  - monitoring connected to the web app, for XSS and credential exposure.
- **3D view:**
  - renders the same state;
  - clicking a box selects it in the Inspector;
  - switching back to 2D restores the editor.
- **Reset** restores the default architecture and clears all controls.
- **Small screens:** the stepper has no horizontal overflow at 390 px.
- **Reduced motion:** no animated edges.

## 7. Data sources, endpoints, caching and timestamps

Full detail: [09](09-public-threat-intelligence.md).

| Source | Endpoint | Shown |
|---|---|---|
| CISA KEV | `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json` | 5 most recently added entries, plus the catalogue version |
| NVD API 2.0 | `https://services.nvd.nist.gov/rest/json/cves/2.0` (`pubStartDate` / `pubEndDate` over the last 7 days, `cvssV3Severity=CRITICAL`) | 5 newest critical CVEs, with CVSS as given |
| GitHub advisories | `https://api.github.com/advisories?type=reviewed&ecosystem=npm&severity=critical&sort=published&direction=desc` | 5 newest critical npm advisories |
| Posture | `GET` on the deployed site (see section 12) | Response headers only |

**Caching and freshness**
- Every source is fetched on the server at build or regeneration time,
  with an 8 s timeout per source.
- The page uses ISR and regenerates every 6 hours. If regeneration fails,
  the previous page keeps being served.
- Each source shows its own dates (added, published, updated) separately
  from the *Retrieved* time.
- In the browser, *Retrieved* is rendered as a relative time and marked
  "may be stale" when it is more than 24 hours old.

**When a source fails**
- A failing source shows "Unavailable: <reason>", and its entries are
  never invented.
- Incomplete entries are skipped, and severity appears only when the
  source provides it.

## 8. Security and privacy controls implemented

Detail: [04](04-security-and-privacy-decisions.md) and
[10](10-security-posture.md).

**Visitor privacy**
- No analytics, cookies, `localStorage` or `sessionStorage`.
- No fingerprinting, network or port probing, or IP or location display.
- Fonts are self-hosted with `next/font`.
- The browser makes no requests to external hosts (verified in
  Playwright).
- Threatscape's state lives only in React memory.

**Headers** (`next.config.ts`)
- **CSP:**
  - `default-src 'self'`;
  - `script-src 'self' 'unsafe-inline'`;
  - `style-src 'self' 'unsafe-inline'`;
  - `img-src 'self' data: blob:`;
  - `font-src 'self'`;
  - `connect-src 'self'`;
  - `frame-ancestors 'none'`;
  - `base-uri 'self'`;
  - `form-action 'self'`;
  - `object-src 'none'`;
  - `upgrade-insecure-requests`.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`
- `X-Frame-Options: DENY`
- `poweredByHeader: false`, so no `X-Powered-By` header is sent.

**Posture section**
- Fetches the deployed site's headers on the server and grades them with
  the pure `evaluateHeaders`.
- A missing header never passes.
- `'unsafe-inline'` is graded Partial.
- A check that can't run is reported as unknown.
- The section states that it covers observable configuration only.

**Secrets:** `NVD_API_KEY` and `GITHUB_TOKEN` are read only by
`server-only` modules.

## 9. Validation commands and actual outcomes

Final runs on the M7 code, 2026-11-04:

| Command | Outcome |
|---|---|
| `npm run lint` | Pass, 0 problems |
| `npm test` | 47/47 pass across 3 files: engine 31, intel fetchers 9, posture 7 |
| `npx tsc --noEmit` | Pass |
| `npx next build` | Pass. `/` is ISR, Revalidate 6h; route 11.4 kB, first-load JS 115 kB, shared 103 kB |
| axe-core 4.10.3 (Playwright, 1440×900 and 390×844) | 0 violations on both |
| Keyboard script (Playwright) | Tab and Enter select the Threat tab; Enter on a palette item adds a node and opens the Inspector; focused nodes show a 3 px outline |
| Reduced-motion script | 0 animated edges in Threat view |

Earlier runs (M7, before the final lint fixes, with no visual change
since):

| Check | Outcome |
|---|---|
| Lighthouse 12.6.1, desktop | 100 / 100 / 100 / 100 |
| Lighthouse 12.6.1, mobile | Performance 94–95 (LCP 2.5–2.6 s, TBT 160–190 ms, CLS 0); Accessibility, Best practices and SEO 100. Before the CSS reveal, mobile performance was 84 (TBT 420 ms) |
| Overflow (1440, 820 and 390 px) | None |
| Browser end-to-end scripts per milestone | Results as listed in section 6 |

Lighthouse ran against `next start` on localhost, without Vercel's CDN.
The Playwright, axe and Lighthouse scripts lived in a temporary scratchpad
and are **not committed** (see section 11, item 2).

## 10. Screenshots

The screenshots are in `shots/`, captured at M6 from a local production
build:

| Width | Top of page | Full page |
|---|---|---|
| 1440 px | `m6-top.png` | `m6-full.png` |
| 820 px | `m6-t-top.png` | `m6-t-full.png` |
| 390 px | `m6-m-top.png` | `m6-m-full.png` |

M7 changed only contrast, focus outlines and how the reveal animates, so
the layout is unchanged since these were taken. There are no recordings.
`shots/` can be removed before merging if screenshots shouldn't live in
the repository.

## 11. Known bugs, limitations, incomplete work and technical debt

Full list: [08](08-known-issues-and-follow-ups.md). The most important:

1. **The GitHub advisory column has not been seen working live.** The
   sandbox proxy returned HTTP 401/403, and the Vercel preview sits behind
   auth. Check it on the deployed site, and add `GITHUB_TOKEN` if it is
   rate-limited.
2. **No committed UI or end-to-end tests.** Only the engine, the fetchers
   and the posture evaluation have automated tests. The browser checks were
   one-off Playwright scripts.
3. **The CSP allows `'unsafe-inline'` scripts.** Static generation gives
   no nonce. The posture section reports this as Partial.
4. **The posture section shows the previous deployment's headers** until
   ISR regenerates, which takes up to 6 hours after deploy.
5. **`site.url` changed** from `hemanthg.dev`, which does not resolve, to
   `https://hemanth-g-portfolio.vercel.app`. The owner needs to confirm
   this.
6. **Model gaps:**
   - Encryption and DAST are not controls;
   - there are no Kubernetes or cloud nodes;
   - the 3D view doesn't highlight the active step;
   - the 3D canvas is not keyboard-operable (2D is the accessible editor);
   - the model is deliberately simplified (one shortest path, no
     probabilities).
7. **Small screens can't edit the architecture.** They get the walkthrough
   only.
8. **TracerFlow and AI Health Prediction aren't included.**
9. **The KEV feed is about 1.8 MB**, close to Next.js's 2 MB fetch-cache
   limit.
10. **The CSP blocks the Vercel toolbar on preview deployments.**
11. **The scroll reveal animates only where scroll-driven animations are
    supported.** Elsewhere, content is shown without animation.

## 12. Deployment and environment variables

Deploy as before on Vercel; no new build settings are needed.

| Variable | Required | Purpose |
|---|---|---|
| `NVD_API_KEY` | No | Higher NVD rate limit. Free from NIST |
| `GITHUB_TOKEN` | No, but recommended | Authenticated rate limit for the advisory API. Use a fine-grained token with **no** repository permissions |
| `POSTURE_URL` | No | URL the posture check fetches. If unset, the check uses `VERCEL_PROJECT_PRODUCTION_URL` (set by Vercel), then `site.url` |

All three are server-side only. Never prefix them with `NEXT_PUBLIC_`.

After deploying, either redeploy or wait for regeneration before the
posture section reflects the new headers.

## 13. Deviations from the brief, with reasons

- **Plain three.js instead of React Three Fiber and Drei.** The scene has
  fewer than 20 meshes, so one effect with explicit disposal is simpler
  than adding two dependencies.
- **No GSAP or Framer Motion.** CSS transitions and a CSS scroll-driven
  reveal cover what's needed. The JavaScript reveal cost about 10 points of
  mobile performance.
- **Small screens get a walkthrough, not an editor.** Node editing isn't
  usable at phone width. The brief allows a simplified fallback.
- **An extra "This site" section** (posture), as allowed by brief §7.
- **`site.url` changed** because the configured domain doesn't resolve.
- **The CSP keeps `'unsafe-inline'`.** A nonce needs dynamic rendering,
  which would lose ISR caching. The trade-off is reported on the site.
- **Some projects are left out:** TracerFlow and AI Health Prediction,
  until the owner confirms details (brief §8).
- **Encryption, DAST, and Kubernetes or cloud nodes** aren't modelled yet.
  This is a scope gap, not a decision; see section 14.

## 14. Suggested next steps

1. Deploy, then check the GitHub column and the posture section on
   production. Set `GITHUB_TOKEN`.
2. Confirm the domain and update `site.url` if a custom domain is added.
3. Commit the Playwright end-to-end checks as tests and run them in CI,
   alongside `npm run lint` and `npm test`.
4. Add Encryption and DAST controls with honest "does not solve" text.
   Consider an internal-service or metadata node for SSRF, and a
   Kubernetes or cloud node.
5. Emphasise the active step in the 3D view.
6. Add TracerFlow and AI Health Prediction once their details are
   confirmed.
7. Publish articles and list them in Research & writing.
8. Consider a nonce-based CSP only if moving to dynamic rendering is
   acceptable.
