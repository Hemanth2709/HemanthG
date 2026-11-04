# 11 · Hero: Visitor Intelligence and the simulated security session

Milestone M8 (2026-11-04). This covers the two hero features from the owner's
brief "Visitor Intelligence & Cinematic Cybersecurity Hero". Nothing else on
the page changed: navigation, Threatscape, Selected work, Journey, Writing,
the posture section, SEO and ISR all stay as they were. The only exception is
the shared intel loader described below.

## Decisions taken from the brief

| Question | Decision | Why |
|---|---|---|
| ISP / network provider | **Not shown** | Vercel's headers have no ISP. Getting it would mean sending every visitor's IP to a third-party lookup service, which the brief rules out ("do not send the visitor's IP to unnecessary third-party services") and allows omitting ("omit it or show Unavailable") |
| Privacy note | "Location is approximate and IP-derived. No visitor information is stored **by this site**." | The brief asks for the note to be accurate. The site's own code stores nothing, but Vercel, the host, keeps its own standard request logs, so the unqualified sentence would overstate it |
| Hero facts strip (Based in / Experience / Builds / Focus) | Removed | The panel takes its place below the actions, and the facts are already in the Journey section |
| Resume button | Shown only when `site.resumeUrl` is set (it is `null` today) | Adding a link to nothing would be a fake affordance |
| SentinelRules rule count | "Loaded 14 rules from 12 files" | Counted on SentinelRules `main` (12 rule files, 14 rule IDs). The brief's sample said 8 |

## Feature 1: Visitor Intelligence panel

`src/components/hero/visitor-panel.tsx` is a client component placed below
the hero actions.

### Data sources

| Field | Source | Where it is read | Fallback |
|---|---|---|---|
| Public IP | `x-real-ip`, else the first entry of `x-forwarded-for` | Server, `GET /api/visitor` | `Unavailable` |
| City | `x-vercel-ip-city` (URL-decoded) | Server | `Location unavailable` (when city, region and country are all missing) |
| Region | `x-vercel-ip-country-region` (ISO 3166-2 code, e.g. `KA`) | Server | omitted from the location string |
| Country | `x-vercel-ip-country` (ISO 3166-1 alpha-2) → name via `Intl.DisplayNames` | Server, name built in the browser | omitted |
| Browser and major version | `navigator.userAgent`, parsed by `src/lib/visitor/user-agent.ts` | Browser | `Unavailable` |
| Operating system | Same parser; name only | Browser | `Unavailable` |
| Screen | `window.screen.width × height` | Browser, updates on resize | `Unavailable` |
| Viewport | `window.innerWidth × innerHeight` | Browser, updates on resize | — |
| Pixel ratio | `window.devicePixelRatio` | Browser, updates on resize | `Unavailable` |
| Language | `navigator.language` | Browser | `Unavailable` |
| Timezone | `Intl.DateTimeFormat().resolvedOptions().timeZone` | Browser | `Unavailable` |
| Connection | Network Information API: `connection.type`, else `effectiveType` shown as e.g. "4g (effective)" | Browser (Chromium only) | `Unavailable` (Safari, Firefox) |

OS versions are deliberately left out. Browsers freeze them in the
User-Agent (Windows 11 reports as 10, macOS as 10.15.7, Android as 10), so
showing one would usually be wrong. Only the low-entropy User-Agent string is
used: no `getHighEntropyValues`, no canvas or WebGL probing, and no font or
plugin enumeration.

### How IP geolocation works

1. Vercel's edge network terminates the visitor's connection. It writes the
   client IP into `x-real-ip` and `x-forwarded-for`, and its own geolocation
   lookup into the `x-vercel-ip-*` headers, overwriting any values the
   client sent.
2. `src/app/api/visitor/route.ts` (`dynamic = "force-dynamic"`) passes the
   request headers to `readNetwork()` (`src/lib/visitor/network.ts`).
3. `readNetwork()` trusts those headers **only when `process.env.VERCEL ===
   "1"`**. Anywhere else (local development, another host or proxy) a client
   could set them itself, so it returns all nulls with `source: "none"`.
   Values are validated before use: the IP must match IPv4 or IPv6 syntax, a
   country must be two letters, a region at most three characters, and a
   city must decode cleanly and be 80 characters or fewer. Anything else
   becomes null.
4. The response is `{ source, ip, city, region, countryCode }` with
   `Cache-Control: private, no-store, max-age=0` plus `CDN-Cache-Control` and
   `Vercel-CDN-Cache-Control: no-store`, so no cache can hand one visitor's
   response to another. It also sets `X-Robots-Tag: noindex`.
5. The panel fetches it with `cache: "no-store"` and a 5 s timeout.

No external geolocation provider is called. Location accuracy is whatever
Vercel's IP database gives, usually city level and sometimes wrong (VPNs,
mobile carriers, corporate proxies).

### Privacy and data retention

- The site stores nothing:
  - the endpoint holds no database, file, cookie or log statement;
  - the panel uses no `localStorage`, `sessionStorage` or IndexedDB.
- Device fields are computed in the browser and never sent anywhere. The
  only request the panel makes is `GET /api/visitor`, which carries no
  payload.
- **Not covered by "this site stores nothing":** Vercel, as the host, records
  requests in its own platform logs, like any web host. This is why the note
  says "by this site".
- No analytics, cookies, permission prompts (no GPS), LAN access, port scans
  or third-party calls. The CSP (`connect-src 'self'`) would block a
  third-party call anyway.
- The homepage stays statically generated (ISR). Only `/api/visitor` is
  dynamic, so the page itself can never contain per-visitor data.

### States

| State | What shows |
|---|---|
| Loading | Header says "Collecting environment information..."; every value is a skeleton bar of fixed height, so there is no layout shift |
| Success | Green pulsing dot and "LIVE" (the dot is static under reduced motion) |
| Partial | Each field shows its own value or `Unavailable` |
| Lookup failed (HTTP error, network error or 5 s timeout) | Public IP `Unavailable`, location `Location unavailable`; device fields still show. "LIVE" still appears, because the device data is live |
| Off Vercel (local dev) | Same as a failed lookup: the endpoint returns nulls |

## Feature 2: simulated security session

### Architecture

```
src/components/hero/
  workflow-engine.ts      pure: types, compile(workflows) → timeline, frameAt(timeline, t) → frame
  workflow-data.ts        six static workflows (data only)
  workflow-intel.ts       builds the 7th workflow from real CISA KEV + NVD data (server)
  stream-lines.tsx        hook-free markup for lines (shared by server and client)
  security-indicators.tsx telemetry header (workflow n/7, progress) and footer (counts, disclaimer)
  static-session.tsx      server: renders the first frame as plain HTML (never hydrated)
  session-activator.tsx   client: lazy-loads the live animation when worth it
  security-animation.tsx  client: one requestAnimationFrame clock → frameAt → render
  code-stream.tsx         client: the stream, with transform-based scrolling
  hero-background.tsx     server: lighting, grid, topology, data-flow trails, particles (SVG + CSS)
src/components/sections/hero.tsx   composes everything
src/lib/intel/load.ts             React cache() wrapper so the hero and "In the wild" share one fetch
```

**The engine is deterministic.** `compile()` turns each workflow into a
timeline with fixed start and end times for every step:

| Step | Duration |
|---|---|
| Command | 280 ms lead + 32 ms per character + 340 ms tail |
| Output line | 150 ms |
| Check | 520 ms (or its own `ms`) |
| Progress | its `ms` |
| End of each workflow | 2.8 s hold, then a 650 ms leave transition |

`frameAt(timeline, t)` is a pure function of time. It returns the typed
prefix of the current command, the lines revealed so far, each check's state
(pending, then pass, warn or crit), the progress fraction, the phase
(run, hold or leave) and the counts. There are no independent timers. The
component advances one clock and re-renders only when `signature(frame)`
changes: a new character, a new line, a resolved check, or about every 2 %
of progress.

What animates, and how:

| Effect | How |
|---|---|
| Typing, line reveals, progress bars, check state changes | The engine |
| New lines easing in | CSS `hero-line-in` |
| Glide when the stream overflows (phones) | `transform` |
| Running check | Spinner and a highlight sweep (`hero-scan`) |
| Resolved result | Flashes once (`hero-flash`) |
| Cursor | Blinks while idle |
| Workflow change | Fades and lifts (opacity and transform driven by `frame.leave`) |
| Telemetry bar | Fills per workflow |
| Ambient background | CSS only: data-flow trails on topology links, nodes breathing, particles drifting |

The ambient effects are not driven by the engine, so they keep running
during the hold.

**No box.** The stage has no border or background. On large screens it is
masked into the page with two intersecting gradients: left to right, it
fades out toward the headline; top to bottom, it fades at both edges. It also
has a slight 3D tilt (`perspective(1500px) rotateY(-9deg)`). The lighting and
grid are full-bleed radial gradients.

### Workflow sequence

| # | Workflow | Data | Content |
|---|---|---|---|
| 1 | SentinelRules analysis | Simulated | `semgrep scan --config rules/ app/`, 14 rules from 12 files, 7 real rule IDs with their real CWEs (one critical finding, one to review, five passed), CWE → OWASP 2021 mapping as given in the rules' metadata, a fix hint, SARIF written |
| 2 | Linux hardening review | Simulated | `systemctl status ssh`, `ufw status verbose`, `journalctl -u nginx`, `ss -tuln` |
| 3 | Container security | Simulated | `docker image inspect` (non-root user), `docker scout quickview`, `docker compose ps` |
| 4 | Secure code review | Simulated | DTO whitelist, guards, ownership check, bound parameters, pinned JWT algorithms, redirect allow-list (CWE-915/862/639/89/347/601) |
| 5 | Cloud posture | Simulated | S3 public-access block, IAM role with no wildcards, TLS 1.3 via `openssl s_client` (`api.example.com`), `checkov` with one failed check |
| 6 | DevSecOps pipeline | Simulated | build → unit tests → SAST (Sentinel Rules) → dependency scan → container scan → deploy to staging → monitoring |
| 7 | Threat intelligence | **Real** | The 3 newest CISA KEV entries (CVE, vendor · product, date added) and 2 newest critical NVD CVEs (with CVSS as given), plus the retrieval time. The same data as "In the wild"; if a source is down it says "unavailable" |

**Honesty markers:**
- The telemetry header reads "SIMULATED SESSION" for workflows 1–6 and "REAL
  PUBLIC DATA" for workflow 7.
- The footer reads "illustrative output · not a live scan" for 1–6, and
  "CISA KEV · NVD, refreshed every 6 h" for 7.
- The SentinelRules workflow ends with "simulated run".
- Hosts are placeholders (`api.example.com`, `edge-01`, `secure-app`).
- A unit test fails if any workflow contains destructive or offensive
  commands (`rm -rf`, `nmap`, `sqlmap`, `curl | sh`, injection payloads and
  so on).

### Performance decisions

- **No new dependencies.** No three.js, canvas, video or Framer Motion; only
  React, CSS and SVG.
- **The first frame is server-rendered HTML that React never hydrates**
  (`StaticSession`). On a phone, hydrating the full stream was a large share
  of the main-thread work.
- **`SessionActivator`** loads `security-animation.tsx` as a separate chunk
  only when all of these hold:
  - the page has finished loading;
  - the main thread is idle (`requestIdleCallback`, or 1.2 s in Safari);
  - the stage is on screen;
  - reduced motion is off.

  The live animation starts from exactly the static frame. The static copy is
  then hidden, and lines already on screen do not fade in again, so the swap
  is invisible.
- **The clock stops** when the stage is off-screen or the tab is hidden. The
  hero gets `data-paused`, which pauses the CSS decorations too.
- **Layout shift stays at 0.** Lines are top-anchored, and overflow scrolls
  with `transform`; an earlier bottom-anchored version scored 0.037 CLS on
  tablet.
- **One intel fetch.** The threat-intel workflow reuses the page's ISR fetch
  through `loadIntel()` (React `cache`), so CISA and NVD are not called twice
  per regeneration.

### Mobile and tablet fallback

Below 1024 px the stage is not a background. It's a short band after the
Visitor Intelligence panel (15 rem on phones, 19 rem on tablets), so the
headline, intro, actions and panel come first and nothing overlaps them.

In that band:
- the band fades out at the bottom, and only the last lines that fit are
  visible;
- there's no tilt, topology or particles (the particles also stay hidden
  below 768 px);
- the counts footer is hidden;
- the header still says "Simulated session".

The animation only starts once the band is scrolled into view.

### Reduced motion

With `prefers-reduced-motion: reduce`:
- the live animation is never loaded, and the static first frame (the
  finished SentinelRules workflow) stays;
- the topology trails, node breathing, particles and the panel's LIVE ping
  are hidden;
- the global reduced-motion rule shortens every other animation to a
  single 0.01 ms run.

If the setting changes while the page is open, the animation returns to the
first frame and stops.

### Accessibility

- The whole stage and the background are `aria-hidden`. They are
  decorative, and the page's content doesn't depend on them.
- The panel is a labelled `section` with an `h2`. Its status is in a
  `role="status"` element.
- Keyboard navigation is unchanged: the stage has no focusable elements.

## Known limitations

1. **Not yet production-verified.** The `/api/visitor` path that trusts
   Vercel's headers was tested locally with `VERCEL=1` and injected
   headers. It has not been seen on a real Vercel deployment. After
   deploying, open the site and check that the panel shows your real IP
   and city.
2. **No ISP field** (a privacy decision, above).
3. **City accuracy depends on Vercel's IP database.** Behind a VPN, a
   mobile carrier or a corporate proxy, the location will be that network's.
4. **The connection type** is Chromium-only. Elsewhere it shows
   `Unavailable`, as designed.
5. **The CVE IDs and dates in workflow 7** change every 6 hours. Between
   regenerations they can be up to 6 hours old, and they show the
   retrieval time.
6. **Lighthouse mobile performance** (local, simulated throttling): 91–95
   on this branch, plus one cold first run at 72, against 95–96 on `main`.
   The branch adds about 13 KB of page weight. Desktop scores 100.
7. **Reduced-motion visitors only see workflow 1**, as a static frame. This
   is intended.
