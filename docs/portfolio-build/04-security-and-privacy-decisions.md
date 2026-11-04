# 04 · Security and privacy decisions

## Visitor privacy (applies to every milestone)

The site does not and will not implement browser fingerprinting, device or
local-network scanning, port probing, IP/location collection for display,
collection of device details, or persistent visitor tracking.

The site has **no analytics, no cookies and no client-side storage**. Fonts
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
