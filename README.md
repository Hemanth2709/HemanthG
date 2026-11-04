# Hemanth G: portfolio

Personal site of Hemanth G, a full stack developer moving into application security and cloud infrastructure. The featured project is [Sentinel-Security](https://github.com/Hemanth2709/SentinelRules), a Semgrep rule pack for NestJS and Next.js.

**Stack:** Next.js 15 (App Router), TypeScript (strict), Tailwind CSS v4, Lucide icons. No animation library.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (fully static)
npm run typecheck  # strict TypeScript check
```

## Editing content

All copy lives in `src/data/`. Components render whatever these files contain, and `src/data/types.ts` documents the shapes.

| File | Controls |
| --- | --- |
| `site.ts` | Name, hero copy, email, location, socials, navigation, resume link |
| `about.ts` | About text, timeline, recognition, education, languages |
| `experience.ts` | Work history |
| `projects.ts` | Featured project, other projects, planned projects, security benchmark and rule tables |
| `skills.ts` | Skills by domain, and what's being learned |

Only verified content goes in these files. Every number about Sentinel-Security comes from its repository (tests, CHANGELOG, `docs/benchmark-results.md`).

**Resume:** put the PDF in `public/` and set `resumeUrl` in `site.ts` (for example `"/resume.pdf"`). The Resume buttons appear only once it is set.

**Domain:** update `site.url` in `src/data/site.ts` so Open Graph, the sitemap and structured data point at the right host.

## Structure

```
src/
├── app/                     # layout, page, OG image, sitemap, robots, globals.css (design tokens)
├── components/
│   ├── effects/             # Reveal (scroll-in transition)
│   ├── layout/              # Navbar, Footer, Wordmark
│   ├── sections/            # One component per section; projects/ holds the featured and row layouts
│   └── ui/                  # Flow, Status, Tag, Icon, SectionHeading
├── data/                    # All content (typed)
└── lib/                     # cn() helper
```

## Design

- Dark editorial palette with one blue accent; violet only marks identity, and severity colours appear only in security findings.
- The hero network (`hero-network.tsx`) is plain SVG and CSS, server-rendered; its pulses stop under `prefers-reduced-motion`.
- Short CSS entrance and scroll reveals, no animation library. Content stays visible without JavaScript.
- Fully static output with Open Graph, Twitter cards, sitemap, robots and Schema.org `Person` JSON-LD.

## Security scanning

`.github/workflows/sentinel-rules.yml` scans this repository on every push and pull request with the [Sentinel Rules GitHub Action](https://github.com/marketplace/actions/sentinel-rules) v0.2.0 (pinned to its commit SHA). Findings fail the job and are uploaded to the Security tab.
