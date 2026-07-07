# Hemanth G — AI Product Engineer Portfolio

A premium, dark-first portfolio built to feel like a SaaS product landing page rather than a résumé. Every section renders from typed content data, so updating the site never means touching a component.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · shadcn-style UI primitives · Lucide icons — no animation library; all motion is compositor-friendly CSS driven by a few hundred bytes of IntersectionObserver/rAF glue.

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
- **Fully static output** — every route prerenders; SEO covers Open Graph + Twitter cards, a generated OG image, sitemap, robots, and Schema.org `Person` JSON-LD.

### Performance architecture

Audited with Lighthouse: **100 performance / 100 accessibility / 100 best-practices / 100 SEO** on desktop (mobile-throttled runs score 94–98 in CI containers; CLS is 0 everywhere).

- **CSS-only animation system.** Every animation runs on `transform`/`opacity` (compositor-only). Scroll reveals are one shared `IntersectionObserver` flipping a `data-inview` attribute; CSS transitions — including the SVG line-draw in project diagrams — key off it. Tab/stage switches replay a keyframe by re-keying the panel.
- **Zero-JS hero.** The floating particle background is one inline SVG animated by CSS keyframes; particles come from a seeded PRNG so SSR markup is deterministic. The headline's entrance animates transform only (never opacity), so LCP is recorded at first paint.
- **Disciplined pointer effects.** Card parallax and magnetic buttons bind passive, rAF-throttled listeners; element rects are measured once per hover (no layout in the hot path); an IntersectionObserver detaches card listeners off-screen; coarse pointers and reduced-motion never bind at all. JS writes only `--mx`/`--my` CSS variables — CSS renders the tilt and glare.
- **Critical path.** The global stylesheet is inlined (`experimental.inlineCss`) so nothing render-blocks; fonts use `display: optional` with size-adjusted fallbacks (no swap reflow, no late LCP); below-the-fold sections are code-split via `next/dynamic` and wrapped in `content-visibility: auto` containers with reserved intrinsic size (no CLS).
