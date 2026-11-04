# 05 · Architecture and technical decisions

## Existing stack (inspected 2026-11-04)

Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS v4, Lucide
icons. Static output deployed on Vercel. Content lives in typed data files
(`src/data/*.ts`); one component per section (`src/components/sections`).
CI: `.github/workflows/sentinel-rules.yml` (Sentinel Rules Action, code
scanning upload).

## M1 decisions

- **Restructure, not rewrite.** About, Experience and Skills became body
  components (`AboutBody`, `ExperienceBody`, `SkillsBody`) composed by a new
  `Journey` section; the old Security section was split into
  `SecurityPractice` and `SentinelEvidence` (`security-practice.tsx`). Content
  and data files are unchanged.
- **New shared component:** `Subsection` (heading + note for parts inside a
  section).
- **New data:** `src/data/writing.ts` (`WritingEntry` type).
- **Dependency added:** `three@0.180.0` and `@types/three@0.180.0` (exact
  versions). Not yet imported anywhere; reserved for the M4 3D view.

## M2 decisions

- **Graph editor: React Flow** (`@xyflow/react@12.9.3`, exact). Reliable
  dragging, connecting, selection and keyboard focus. It is used as a
  controlled component: the source of truth is our own `Graph` state, so the
  engine (and the 3D view in M4) never depend on React Flow types.
- **Pure engine, tested.** All attack-path logic lives in
  `src/lib/threatscape/engine.ts`, with no DOM or React, covered by Vitest.
- **Lazy loading.** `ThreatscapeLoader` waits until the section is within
  600 px of the viewport. It then loads either the workbench (React Flow and
  its CSS) on screens ≥ 1024 px with a fine pointer, or the stepper
  everywhere else. Phones never download React Flow (verified: no React Flow
  DOM on a 390 px viewport). The server-rendered section keeps its heading,
  intro and a fixed-height placeholder, so there is no layout shift.
- **Accessibility.** Views are a `tablist`. Every canvas action has a button
  or select alternative (add, connect, remove, step). Nodes and edges have
  `aria-label`s. The outcome is an `aria-live` status. Path animation is off
  under `prefers-reduced-motion`.
- **Dependency added:** `vitest@3.2.4` (dev), with `npm test` and
  `vitest.config.ts`.

## M4 decisions

- **Plain three.js, not React Three Fiber.** `three@0.180.0` was already a
  dependency. The scene is small (fewer than 20 meshes), so one imperative
  `useEffect` with explicit disposal is simpler than adding R3F and Drei.
- **One state, two renderings.** The 3D view takes `Graph` and `Evaluation`
  as props; there is no 3D-specific model to keep in sync.
- **Structure editing only in 2D.** Dragging in 3D is imprecise and hard to
  make accessible; the brief asks for keyboard accessibility.

## M5 decisions

- **Server-side fetching with ISR, no database.** The brief says not to add
  a database unless persistence is required. Page-level `revalidate = 6h`
  gives caching, background refresh and stale-on-error from the platform.
- **No client-side calls.** They would expose visitors to third-party
  requests and rate limits; the server fetches once per regeneration.
- **`server-only@0.0.1`** guards the fetchers from being bundled for the
  browser, where the optional API keys would leak.
- Optional environment variables: `NVD_API_KEY` (higher NVD rate limit) and
  `GITHUB_TOKEN` (a fine-grained token with no permissions, for the advisory
  API's authenticated rate limit). Neither is required.

## M6 decisions

- **Headers in `next.config.ts`** (`headers()`), so they apply to every
  route on any host. CSP keeps `'unsafe-inline'` for scripts: the page is
  statically generated with ISR, so there is no per-request nonce. The
  posture section reports this as Partial rather than hiding it.
- **Posture check fetches the deployed site server-side**, from
  `POSTURE_URL`, else Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, else
  `site.url`. Evaluation (`src/lib/posture/evaluate.ts`) is a pure function;
  a check that cannot run is "unknown", never "pass".

## M7 decisions

- **Scroll reveal is CSS only.** The old `Reveal` was a client component
  with an IntersectionObserver per instance; hydrating dozens of them cost
  mobile Total Blocking Time (Lighthouse mobile performance 84, TBT 420 ms).
  It is now a server component that adds a `.reveal` class; the animation is
  a scroll-driven `animation-timeline: view()` inside
  `@supports (animation-timeline: view())` and
  `prefers-reduced-motion: no-preference`. Browsers without support, and
  visitors with JavaScript off, just see the content. The `<noscript>`
  style that used to un-hide content was removed because nothing is hidden
  without the animation.
- **ESLint added** (`eslint@9.36.0`, `eslint-config-next@15.5.4`,
  `@eslint/eslintrc@3.3.1`, exact versions) with a flat config
  (`eslint.config.mjs`) extending `next/core-web-vitals` and
  `next/typescript`. `npm run lint` now runs `eslint .`.
- **Accessibility fixes from axe:** small text moved from `text-faint` to
  `text-subtle` where contrast fell short; the Inspector became a
  `role="region"` instead of a nested `<aside>`; React Flow nodes and edges
  get a visible `:focus-visible` outline; the React Flow attribution badge
  is restyled for contrast; the navbar home link uses `title` instead of an
  `aria-label` that did not match its visible text.
