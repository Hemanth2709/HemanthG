# Personal Cybersecurity Portfolio --- Claude Build Brief

> **Purpose:** Use this document as the source of truth when designing
> and implementing the personal portfolio. Keep the work within the
> scope below. Do not silently change the visual direction or add
> invasive visitor-tracking features.

## 1. Product direction

Build a single, cohesive personal portfolio for a software engineer
transitioning into cybersecurity, with a primary focus on **Application
Security**, followed by **Cloud Security** and **DevSecOps**.

The portfolio should feel like a polished, premium website first---not a
terminal simulator, hacker-themed landing page, or generic SOC
dashboard.

The central design idea is:

**Experimental editorial design × cybersecurity × infrastructure
engineering.**

The experience should be distinctive, intriguing, technically credible,
accessible, responsive, and performant.

## 2. Visual direction and constraints

### Desired aesthetic

-   Sophisticated, contemporary, editorial, and cinematic.
-   Strong typography, deliberate whitespace, asymmetrical layouts, and
    carefully composed grids.
-   Dark or deep-neutral foundation is acceptable, but it must feel like
    a designed website rather than a hacker interface.
-   Use a restrained, considered palette: charcoal/ink, off-white, cool
    greys, muted metallic tones, and carefully selected accent colours.
-   Use colour semantically: threat indicators may use restrained warm
    tones; defensive controls may use a restrained contrasting accent.
-   Abstract 3D objects and technical visualizations should feel
    art-directed and purposeful.
-   Smooth transitions and scroll-led storytelling, without motion for
    motion's sake.

### Explicitly avoid

-   Neon-green-on-black as the dominant identity.
-   Matrix rain, fake terminal screens, green command-line aesthetics,
    random padlocks, stock cybersecurity clichés, and excessive glowing
    effects.
-   Excessive glassmorphism, cluttered dashboards, and unnecessary 3D
    decoration.
-   Fake scanning animations, fabricated statistics, fake security
    scores, or claims that are not backed by real implementation/data.

### Typography

Choose a coherent editorial display typeface, a highly legible body
typeface, and a monospace face only for small technical labels or code.
Suggested starting points: Space Grotesk or Sora for display, Inter for
body, and IBM Plex Mono for technical metadata. Validate the final
pairing in the actual design.

## 3. Portfolio structure

All experiences must be integrated into **one portfolio website**, with
consistent navigation, visual language, routing, and responsive
behaviour. Threatscape is a section/experience within the portfolio, not
a separate website or standalone product.

Suggested homepage flow:

1.  **Hero / Introduction** --- clear professional identity, concise
    positioning, strong visual composition, and routes into the work.
2.  **Threatscape** --- the signature interactive cybersecurity and
    DevOps experience described below.
3.  **Selected Work** --- real projects presented as technical case
    studies.
4.  **Engineering Journey** --- progression from software engineering
    into security.
5.  **Research & Writing** --- security notes, technical articles, and
    research.
6.  **Contact** --- simple, professional closing section.

The exact order can be refined if the design benefits, but keep the
narrative coherent and do not let the interactive section overwhelm the
portfolio's primary purpose: presenting the person and their engineering
work.

## 4. Signature experience: THREATSCAPE

**Working title:** THREATSCAPE\
**Tagline:** Explore. Understand. Secure.

Create an interactive, visually compelling cybersecurity and DevOps
environment. It should be inspired by the feeling of an experimental
interactive design tool: visitors can select, drag, drop, connect,
inspect, and explore elements.

It should not look like a conventional security operations dashboard.

### 4.1 Main visual environment

Create an art-directed 3D or layered interactive infrastructure scene.
It may include: - Cloud infrastructure - Web application - API gateway /
API service - Authentication or identity service - Database -
Containers - Kubernetes cluster - CI/CD pipeline - Firewall / WAF -
Monitoring or runtime security

Use a clear visual hierarchy and readable labels. The environment should
be understandable without requiring visitors to guess what objects mean.

### 4.2 Interaction model

Visitors should be able to: - Select infrastructure components. -
Inspect a component and read a concise explanation. - Drag components
into a workspace where practical. - Connect compatible components. -
Switch between infrastructure, threat, defence, and DevSecOps views. -
Reset the scene to a useful starting configuration. - Explore guided
examples without needing to build everything themselves.

Do not make drag-and-drop a gimmick. Every interaction should teach or
demonstrate a real technical concept.

### 4.3 Threat scenarios

Include safe, simulated examples such as: - SQL injection - Cross-site
scripting (XSS) - Broken object-level authorization / IDOR - SSRF -
Credential exposure - DDoS concepts - Privilege escalation

Show a hypothetical attack path through the selected architecture.
Explain the preconditions, potential impact, and relevant mitigations.
Keep all demonstrations local to the simulation and use synthetic data.
Never attack real infrastructure.

### 4.4 Defensive controls

Allow visitors to explore controls such as: - WAF - Authentication and
authorization / IAM - Rate limiting - Parameterized queries - Output
encoding and Content Security Policy - Secrets management - Encryption -
SAST and DAST - Dependency and container scanning - Runtime monitoring

When a control is applied, explain what risk it reduces and what it does
not solve. Avoid implying that one control makes a system completely
secure.

### 4.5 DevSecOps pipeline view

Provide an interactive pipeline showing a credible secure delivery
workflow, for example:

Code → Git → SAST → Dependency Scan → Build → Container Scan → Deploy →
Runtime Monitoring

Selecting a stage should explain: - What the stage does. - Which risks
it helps identify or reduce. - Typical tools or techniques. - Where
relevant, how the user's own work relates to it.

Link the SAST stage to the user's Semgrep rules project when the
repository details are confirmed.

### 4.6 Explainability

Every meaningful node or scenario should have a contextual information
panel containing: - What it is. - Why it matters. - A realistic
example. - Risks or failure modes. - Relevant defensive practices. -
Relevant CWE / OWASP mapping where accurate. - A link to a related
portfolio project or article, when available.

## 5. Public threat intelligence

The portfolio may automatically display a small, curated public
threat-intelligence feed without asking visitors to opt in.

Potential sources: - NIST National Vulnerability Database (NVD) - CISA
Known Exploited Vulnerabilities (KEV) Catalog - GitHub Security
Advisories - Relevant vendor security advisories

Requirements: - Fetch and present genuine public information. - Show
source attribution and the last successful update time. - Distinguish
publication date, update date, and retrieval time where relevant. -
Handle API limits, outages, stale data, and missing fields gracefully. -
Cache responses appropriately; do not make the page depend on a
third-party feed being available. - Never fabricate CVEs, severity
values, counts, or live status. - Keep the feed concise and visually
integrated into the design.

## 6. Visitor privacy and ethical boundaries

The user does **not** want an opt-in visitor-analysis flow or a visitor
fingerprinting feature.

The default experience must not collect or expose visitors'
personal/device/network information.

Do not implement: - Browser fingerprinting. - Device or local-network
scanning. - Port scanning or probing visitors' devices. - Covert
IP/location collection for display. - Collection of sensitive device
details. - Persistent visitor tracking for this feature. - Attempts to
identify individual visitors.

It is fine to use ordinary, non-identifying browser capabilities
required for responsive rendering and normal website operation. Do not
turn those capabilities into a visitor intelligence profile.

The public threat-intelligence feed and the simulated Threatscape
experience should work without collecting visitor data or requiring
consent.

## 7. Security posture of the portfolio itself

A section may report the real security configuration of this portfolio,
based on its deployed HTTP responses. Potential checks include: -
HTTPS - HSTS - Content-Security-Policy - X-Content-Type-Options -
Referrer-Policy - Permissions-Policy

Requirements: - Report only verified configuration. - Do not hardcode
success states. - Explain that the assessment covers observable website
configuration, not the visitor's device or the complete security of the
hosting environment. - Do not expose secrets, internal infrastructure
details, or sensitive operational data. - If a check cannot be
performed, report it as unknown/unavailable rather than passed.

## 8. Selected work and professional story

Present projects as evidence of engineering ability, not as decorative
cards. Each case study should explain: - Problem and motivation. - What
was built. - Architecture and important design decisions. - Security
relevance. - Testing and validation. - Limitations and future
improvements. - Repository/demo links, once verified.

Known project context to consider: - **Sentinel** --- Semgrep security
rules for identifying common security mistakes in modern application
code. Confirm exact repository name, scope, rules, tests, and
implementation before describing specifics. - **TracerFlow** --- include
only after confirming its actual functionality and current state. - **AI
Health Prediction** --- include only with an accurate explanation of the
implemented work and avoid overstating its capabilities.

Engineering journey should communicate that the move into cybersecurity
builds on practical software engineering experience across application
development, backend systems, and cloud/infrastructure work. Do not
invent employers, dates, credentials, certifications, or achievements.

## 9. Technical implementation guidance

Use the existing repository's conventions and installed dependencies
where possible. Do not replace working architecture without a clear
reason.

Potential technologies, subject to the existing project: - Next.js and
TypeScript - Tailwind CSS or the repository's existing styling system -
React Three Fiber / Three.js for the 3D scene - Drei for useful 3D
helpers - React Flow or an equivalent graph editor for reliable
node-based drag/drop and connections - GSAP for complex scroll-led
transitions - Framer Motion for UI transitions

Architecture guidance: - Keep the 3D scene and graph editor separate
where that improves usability; synchronize them through a shared, typed
graph/state model. - Lazy-load expensive interactive experiences. -
Provide a graceful 2D or simplified fallback on mobile and low-powered
devices. - Respect `prefers-reduced-motion`. - Preserve keyboard
accessibility and visible focus states. - Avoid blocking the initial
page load with 3D assets. - Optimize models, textures, bundles, and
animation loops. - Keep data fetching server-side where appropriate and
never expose API secrets in client code. - Use environment variables for
secrets and document required configuration. - Do not add a database
unless persistence is genuinely required.

## 10. Quality and acceptance criteria

The work is acceptable only when:

-   The site feels like one cohesive, professional portfolio.
-   The visual identity is cybersecurity-related without relying on
    neon-green terminal clichés.
-   Threatscape is integrated into the portfolio, not a separate
    application.
-   The interactive scene has meaningful selection and exploration
    behaviour.
-   At least one guided threat scenario and one defensive mitigation
    flow work end-to-end.
-   The DevSecOps pipeline communicates a technically credible workflow.
-   Public intelligence is sourced, timestamped, cached, and resilient
    to upstream failure.
-   No visitor fingerprinting, device scanning, or covert visitor
    profiling is implemented.
-   Security posture results are based on real observable configuration.
-   The site is responsive, accessible, and performance-conscious.
-   No fake data, fake scans, or unsupported security claims are
    presented.
-   Existing working functionality is not broken.

## 11. Working method and milestone documentation

Work in small, reviewable milestones. Before moving to the next major
milestone: 1. State the scope and expected outcome. 2. Inspect the
existing repository and identify relevant files. 3. Implement only the
agreed scope. 4. Run relevant checks and tests. 5. Report files changed
and why. 6. Record decisions, trade-offs, and known limitations. 7.
Update the documentation described below.

Create a documentation directory, for example:

`docs/portfolio-build/`

Suggested files: - `00-product-and-design-direction.md` -
`01-information-architecture.md` - `02-visual-system.md` -
`03-threatscape-interactions.md` -
`04-security-and-privacy-decisions.md` -
`05-architecture-and-technical-decisions.md` -
`06-testing-and-validation.md` - `07-milestone-log.md` -
`08-known-issues-and-follow-ups.md`

For every significant feature, add a short explanation of what it does,
why it exists, how it works, important dependencies, security
implications, and how it was tested.

Do not claim a feature is complete unless it has been implemented and
verified.

## 12. Required final implementation report for review

When the implementation work is finished, produce a detailed handover
report at:

`docs/portfolio-build/IMPLEMENTATION-HANDOVER.md`

The report must include:

1.  Summary of what was implemented.
2.  Original scope versus delivered scope.
3.  Milestone-by-milestone changes.
4.  Exact files created, modified, and deleted.
5.  Architecture and dependency decisions.
6.  Threatscape interactions that genuinely work.
7.  Data sources, API endpoints, caching, and timestamps used.
8.  Security and privacy controls implemented.
9.  Tests, build, lint, and other validation commands run, with actual
    outcomes.
10. Screenshots or recordings of important experiences, if available.
11. Known bugs, limitations, incomplete work, and technical debt.
12. Deployment/environment-variable instructions.
13. Any deviations from this brief, with reasons.
14. Suggested next steps.

Also include a concise change summary that can be reviewed
independently. Do not report planned work as completed work.

## 13. Instructions to Claude

First inspect the existing project and report its current structure,
stack, and state. Then propose a milestone plan before making broad
changes.

Treat this document as the design and product brief, not permission to
rewrite the entire application. Preserve working code and existing
project decisions unless a change is justified and explained.

If a requirement conflicts with the existing repository or cannot be
implemented safely, explain the constraint and propose the smallest
sensible alternative. Do not invent project details or claim unverified
functionality.

**The final deliverable must be a polished, working personal
portfolio---not merely a mockup or a collection of disconnected demos.**

------------------------------------------------------------------------

# Review notes

This section is intentionally left blank for the owner to add feedback
after reviewing Claude's implementation and handover report.

## \## Owner review

## \## Issues to verify

## \## Approved follow-up changes
