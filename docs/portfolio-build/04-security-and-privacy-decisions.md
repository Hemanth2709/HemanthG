# 04 · Security and privacy decisions

## Visitor privacy (applies to every milestone)

The site does not and will not implement browser fingerprinting, device or
local-network scanning, port probing, or persistent visitor tracking.

**Changed in M8 at the owner's request:** the hero's Visitor Intelligence
panel shows visitors their *own* public IP, approximate location and
browser environment. The data is never stored, logged or shared, and no
third party is called. See
[11](11-hero-visitor-intelligence-and-animation.md#privacy-and-data-retention).
The earlier rule against displaying IP or location is replaced by these
limits:

- display only, to the same visitor;
- IP and location come only from the host's own edge headers, trusted only
  on Vercel;
- device details are computed in the browser and never leave it;
- nothing is persisted;
- the endpoint is never cached.

The site has **no analytics, no cookies and no client-side storage**. The
host (Vercel) keeps its own standard request logs, as any host does. The
site adds nothing to them. Fonts
are self-hosted by `next/font`, so there are no third-party font requests.

Threatscape (M2) keeps all state in React memory. It sends no requests, uses
no storage, and reads only `matchMedia` (screen width, pointer type,
reduced-motion preference) to choose a layout. That is ordinary responsive
rendering and is never recorded.

## Portfolio security posture (M6)

Real security headers are set in `next.config.ts`, and a section reports the
deployed site's actual response headers. See
[10-security-posture.md](10-security-posture.md).

## Public threat feed (M5)

The feed is fetched by the server; visitors' browsers make no requests to
NVD, CISA or GitHub, and nothing about the visitor is involved. Optional API
keys are read from server environment variables and never reach the client
bundle (`server-only`).
