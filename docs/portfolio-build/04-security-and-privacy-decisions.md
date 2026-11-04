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

## Portfolio security posture

Planned in M6: real security headers in `next.config` and a section that
reports the deployed site's actual response headers.
