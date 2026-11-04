# 08 · Known issues and follow-ups

| # | Issue | Since | Plan |
|---|---|---|---|
| 1 | No lint configuration (`next lint` prompts for setup) | Before M1 | Add ESLint flat config in M7 |
| 2 | No automated tests for UI components; only the engine is unit-tested | M2 | Add component tests in M7 if time allows |
| 3 | Research & writing lists repository documents only; there are no articles yet | M1 | Add articles when the owner publishes them |
| 4 | TracerFlow and AI Health Prediction not included | M1 | Waiting on details from the owner |
| 6 | Small screens get the walk-through on the default architecture only; editing needs a larger screen | M2 | By design; documented in the UI |
| 7 | React Flow's attribution badge is shown (MIT licence; the project asks for it unless you use their Pro plan) | M2 | Keep |
| 9 | SSRF's target is modelled as the "Secrets manager" component, standing in for internal services and cloud metadata | M3 | A dedicated "internal service / metadata" component could be added |
| 10 | The model is deliberately simplified: one shortest path, one entry point, no timing or probability | M3 | By design; it explains concepts, it does not score risk |
| 11 | The 3D view does not follow the active step in Threat view (it highlights the whole path) | M4 | Small follow-up: emphasise the active step's box |
| 12 | The 3D canvas is not keyboard-operable; the same information and selection are available in the 2D canvas and inspector | M4 | By design; documented in the canvas `aria-label` |
