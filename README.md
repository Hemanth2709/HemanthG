# Hemanth G: portfolio

Personal site of Hemanth G, a software engineer moving into application security. The main case study is [Sentinel-Security](https://github.com/Hemanth2709/SentinelRules), a Semgrep rule pack for NestJS and Next.js.

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
| `site.ts` | Name, title, tagline, email, socials, navigation |
| `about.ts` | About text and working principles |
| `projects.ts` | Case study, benchmark table, rule coverage table, planned projects |
| `process.ts` | The six steps behind each rule |
| `experience.ts` | Work history (the section is hidden while this is empty) |
| `toolkit.ts` | Tools, grouped by category |
| `stats.ts` | Figures shown under the hero |

Only verified content goes in these files. Every number about Sentinel-Security comes from its repository (tests, CHANGELOG, `docs/benchmark-results.md`).

The scan excerpt in the hero (`src/components/sections/scan-excerpt.tsx`) is copied from a real run of Sentinel-Security v0.1.1 on that repository's `examples/vulnerable` directory. Re-run the scan and update it when the rules change.

**Contact form:** composes a pre-filled email; nothing is sent from the page.

**Domain:** update `site.url` in `src/data/site.ts` so Open Graph, the sitemap and structured data point at the right host.

## Structure

```
src/
├── app/                     # layout, page, OG image, sitemap, robots, globals.css (design tokens)
├── components/
│   ├── effects/             # Reveal (scroll-in transition)
│   ├── layout/              # Navbar, Footer
│   ├── sections/            # One component per section; projects/ holds the case study and tables
│   └── ui/                  # Badge, Icon, SectionHeading
├── data/                    # All content (typed)
└── lib/                     # cn() helper
```

## Design

- One accent colour (amber), which also marks WARNING findings; red marks ERROR, green marks passing results.
- Real artifacts instead of illustrations: scan output, the benchmark table, the rule table.
- Motion is limited to short entrance transitions and respects `prefers-reduced-motion`.
- Fully static output with Open Graph, Twitter cards, sitemap, robots and Schema.org `Person` JSON-LD.

## Security scanning

`.github/workflows/sentinel-rules.yml` scans this repository with Sentinel-Security (pinned to the v0.1.1 commit) on every push and pull request.
