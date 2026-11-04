# 02 · Visual system

## Typography (M1)

| Role | Face | Where |
|---|---|---|
| Display | Space Grotesk 500/600 (`font-display`) | Hero headline, section and subsection headings, project and company names |
| Body | Inter | All running text and UI |
| Technical | IBM Plex Mono 400/500 (`font-mono`) | Small labels, metadata, rule IDs, code |

Loaded with `next/font` (self-hosted, `display: "optional"` so text never
reflows on a late font). JetBrains Mono was replaced by IBM Plex Mono as the
brief suggests.

## Colour tokens (`src/app/globals.css`)

Base: `background #090b10`, `surface #10141c`, `raised #151b25`, text
`foreground #f1f5f9` / `muted #94a3b8` / `subtle #7c8ba1` (AA on background).

Semantic roles added in M1, for Threatscape and security content:

| Token | Value | Meaning |
|---|---|---|
| `threat` / `threat-dim` | `#e8875f` | Attack paths, threat indicators. Restrained warm, not alarm red |
| `defence` / `defence-dim` | `#65a9ff` | Defensive controls (same hue as the accent) |
| `metal` | `#c3ccd8` | Muted metallic for infrastructure objects |

`error #f87171` / `warn #fbbf24` remain reserved for rule severity
(ERROR / WARNING) in the Sentinel tables.
