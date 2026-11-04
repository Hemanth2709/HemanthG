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
