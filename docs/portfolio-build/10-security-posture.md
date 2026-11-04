# 10 · Security posture of this site

## Headers set (M6, `next.config.ts`)

Sent on every response (verified with `curl -D -` against `next start`):

| Header | Value |
|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains` (Vercel also sends its own, with `preload`) |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()` |
| X-Frame-Options | `DENY` (older browsers; `frame-ancestors` covers modern ones) |

**Known limitation: `'unsafe-inline'` in `script-src`.** The page is
statically generated (ISR), so a per-request nonce is not available, and
Next.js App Router hydration uses inline scripts. A nonce-based CSP would
require rendering every request dynamically. The posture section reports
this honestly as **Partial**. Inline styles are allowed for React Flow and
the 3D labels.

Checked with the CSP active: hydration, React Flow, the 3D view and all
scenario interactions run with no console errors or CSP violations.

## Posture section (`#posture`, "This site")

- `src/lib/posture/fetch.ts` (server only) fetches the **deployed
  production site**: `POSTURE_URL` if set, else Vercel's
  `VERCEL_PROJECT_PRODUCTION_URL`, else `site.url`. It runs when the page is
  regenerated (every 6 hours), with an 8 s timeout.
- `src/lib/posture/evaluate.ts` is a pure evaluation of the **observed**
  headers: pass / partial / missing, with the observed value shown verbatim.
  If the site can't be reached or returns an error, every check is
  **Unknown** with the reason. Nothing is hardcoded as passing.
- The page states that this covers observable website configuration, not
  the visitor's device or the full security of the hosting environment.
- It shows header values only, which are public anyway. No secrets,
  infrastructure details or internal data.

**Current live result (2026-11-04, before this change is deployed):** HTTPS
and HSTS present; CSP, X-Content-Type-Options, Referrer-Policy and
Permissions-Policy missing. After deployment, the next regeneration should
show CSP as Partial and the rest as Present.

## Site URL correction

`site.url` was `https://hemanthg.dev`, which does not resolve (connection
fails). It is now `https://hemanth-g-portfolio.vercel.app`, where the site is
actually served. Metadata, the sitemap, robots and the OG image use it. If
the owner adds a custom domain, change `site.url`.
