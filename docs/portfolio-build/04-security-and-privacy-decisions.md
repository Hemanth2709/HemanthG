# 04 · Security and privacy decisions

## Visitor privacy (applies to every milestone)

The site does not and will not implement browser fingerprinting, device or
local-network scanning, port probing, IP/location collection for display,
collection of device details, or persistent visitor tracking.

As of M1 the site has **no analytics, no cookies, no storage** beyond the
`sessionStorage`-free static page. Fonts are self-hosted by `next/font`, so
there are no third-party font requests.

## Portfolio security posture

Planned in M6: real security headers in `next.config` and a section that
reports the deployed site's actual response headers.
