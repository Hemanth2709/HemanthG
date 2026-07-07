# Hemanth G — AI Product Engineer Portfolio

A premium, dark-first portfolio built to feel like a SaaS product landing page rather than a résumé. Every section renders from typed content data, so updating the site never means touching a component.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · shadcn-style UI primitives · Lucide icons

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (fully static)
npm run typecheck  # strict TypeScript check
```

## Editing content (no code required)

All copy lives in `src/data/` — components render whatever these files contain:

| File | Controls |
| --- | --- |
| `site.ts` | Name, title, tagline, email, socials, navigation |
| `about.ts` | About narrative + engineering principles |
| `projects.ts` | Case studies (problem, solution, architecture, results…) |
| `process.ts` | Engineering process stages |
| `ai.ts` | AI capability cards + agent pipeline diagram |
| `experience.ts` | Timeline entries |
| `toolkit.ts` | Technology categories |
| `stats.ts` | Animated statistics |
| `testimonials.ts` | Recommendations (renders an invitation state while empty) |

`src/data/types.ts` documents the shape of everything.

**Resume:** drop your PDF at `public/resume.pdf` (the path is configured in `site.ts`).

**Contact form:** currently composes a pre-filled email client draft — no backend needed. To use a real endpoint, swap `handleSubmit` in `src/components/sections/contact.tsx`.

**Domain:** update `site.url` in `src/data/site.ts` before deploying so Open Graph, sitemap, and structured data point at the right host.

## Architecture

```
src/
├── app/                  # App Router: layout, page, SEO routes
│   ├── layout.tsx        # Fonts, metadata, JSON-LD structured data
│   ├── opengraph-image.tsx  # OG card generated at build time
│   ├── sitemap.ts / robots.ts
│   └── globals.css       # Design tokens (Tailwind v4 @theme) + utilities
├── components/
│   ├── effects/          # Reveal, Magnetic, CursorGlow, Counter, Aurora, LoadingScreen
│   ├── layout/           # Navbar (active-section tracking), Footer
│   ├── sections/         # One component per page section
│   └── ui/               # Button, Badge, Icon registry, SectionHeading
├── data/                 # ← all portfolio content (typed)
└── lib/                  # cn() utility
```

### Design notes

- **Project visuals are generative** — each case study gets an abstract system diagram tinted with its own hue (`hue` field in `projects.ts`). No image assets to maintain, crisp at any resolution.
- **Motion respects `prefers-reduced-motion`** everywhere; cursor effects only mount on fine-pointer (desktop) devices.
- **Fully static output** — every route prerenders; first-load JS is ~168 kB.
- **SEO** — Open Graph + Twitter cards, generated OG image, sitemap, robots, and Schema.org `Person` JSON-LD.
