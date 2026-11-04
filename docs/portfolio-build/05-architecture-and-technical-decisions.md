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
