# 08 · Known issues and follow-ups

| # | Issue | Since | Plan |
|---|---|---|---|
| 1 | ~~No lint configuration~~ | Before M1 | Resolved in M7: ESLint flat config, `npm run lint` passes |
| 2 | No automated UI component tests; engine, intel fetchers and posture evaluation are unit-tested (47 tests) and the UI was checked with Playwright scripts that are not in the repo | M2 | Not done in M7. Follow-up: commit Playwright end-to-end tests and run them in CI |
| 3 | Research & writing lists repository documents only; there are no articles yet | M1 | Add articles when the owner publishes them |
| 4 | TracerFlow and AI Health Prediction not included | M1 | Waiting on details from the owner |
| 6 | Small screens get the walk-through on the default architecture only; editing needs a larger screen | M2 | By design; documented in the UI |
| 7 | React Flow's attribution badge is shown (MIT licence; the project asks for it unless you use their Pro plan) | M2 | Keep |
| 9 | SSRF's target is modelled as the "Secrets manager" component, standing in for internal services and cloud metadata | M3 | A dedicated "internal service / metadata" component could be added |
| 10 | The model is deliberately simplified: one shortest path, one entry point, no timing or probability | M3 | By design; it explains concepts, it does not score risk |
| 11 | The 3D view does not follow the active step in Threat view (it highlights the whole path) | M4 | Small follow-up: emphasise the active step's box |
| 12 | The 3D canvas is not keyboard-operable; the same information and selection are available in the 2D canvas and inspector | M4 | By design; documented in the canvas `aria-label` |
| 13 | The GitHub advisory column could not be verified live from the development sandbox (proxy returns 401) | M5 | Check on the Vercel preview; if rate-limited there, add a `GITHUB_TOKEN` |
| 14 | The KEV feed is about 1.8 MB, close to Next.js's 2 MB fetch-cache limit; above it the data is not cached per fetch (the page is still cached by ISR) | M5 | Acceptable; switch to the CSV or a filtered mirror if it grows past 2 MB |
| 15 | CSP allows `'unsafe-inline'` scripts (static generation, no nonce) | M6 | Reported as Partial on the site; a nonce CSP would need dynamic rendering |
| 16 | The posture section shows the previous deployment's headers until the page regenerates after deploying (up to 6 hours) | M6 | Expected with ISR; trigger a redeploy to refresh sooner |
| 17 | Vercel preview deployments use the toolbar script from vercel.live, which the CSP blocks on previews | M6 | Production is unaffected; allow `https://vercel.live` only if the toolbar is wanted on previews |
| 18 | The `site.url` was changed from `hemanthg.dev` (does not resolve) to `https://hemanth-g-portfolio.vercel.app` | M6 | Owner to confirm, or supply a custom domain |
| 19 | The scroll reveal needs scroll-driven animation support (Chromium 115+, Safari 26); elsewhere content appears without animation | M7 | By design |
