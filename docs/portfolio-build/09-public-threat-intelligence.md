# 09 · Public threat intelligence

"In the wild", at the end of the Threatscape section. Real public data,
fetched **on the server only** when the page is generated or regenerated.
Visitors' browsers never call these APIs (verified: no external requests
from the page in Playwright).

## Sources and endpoints

| Source | Endpoint | What is shown | Auth |
|---|---|---|---|
| CISA KEV | `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json` | The 5 most recently added entries: CVE, name, vendor · product, date added; plus the catalogue version | None |
| NIST NVD API 2.0 | `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=…&pubEndDate=…&cvssV3Severity=CRITICAL` | 5 newest critical CVEs published in the last 7 days: id, English description, CVSS v3.1 score and severity as given, published and updated dates | Optional `NVD_API_KEY` |
| GitHub Advisory Database | `https://api.github.com/advisories?type=reviewed&ecosystem=npm&severity=critical&sort=published&direction=desc` | 5 newest critical, reviewed npm advisories: CVE (or GHSA) id, summary, CVSS if present, package, dates | Optional `GITHUB_TOKEN` |

Code: `src/lib/intel/fetchers.ts` (server-only), `src/components/threatscape/intel-feed.tsx`.

## Caching and timestamps

- The page sets `export const revalidate = 21600` (6 hours), so it is
  regenerated in the background at most every 6 hours (Next.js ISR on
  Vercel). Each fetch uses the same `revalidate`.
- **Retrieved** is the time this server fetched the data. The visitor's
  browser renders it as relative time and adds "may be stale" past 24 hours.
  The page shows the source's own dates (KEV *added*, NVD and GitHub
  *published* / *updated*) separately from retrieval time.
- If regeneration fails, Next.js keeps serving the previous page, and its
  older *Retrieved* time makes the age visible.

## Failure handling

- An 8 s timeout per source; one failing source never affects the others or the page.
- An HTTP error, timeout or malformed response gives "Unavailable: <reason>.
  Nothing is shown rather than old or invented data."
- Entries missing required fields are skipped, not filled in. Severity is
  shown only when the source provides it. GitHub links must be on
  `https://github.com/`.
- Text is rendered as text (React escaping); descriptions are trimmed to 180
  characters.

## Verified

- `npm test`: 9 fetcher tests with recorded KEV and NVD responses and a
  synthetic GitHub-shaped fixture (`src/lib/intel/__fixtures__`). They cover
  ordering, skipped incomplete entries, HTTP 503/403, malformed JSON, network
  failure, the 7-day NVD window and the GitHub link check.
- Production build in the development sandbox: KEV and NVD rendered real
  entries. GitHub showed "Unavailable: the source returned HTTP 401", because
  the sandbox's network proxy blocks `api.github.com`. **The GitHub column
  has not yet been seen working live**; check it on the Vercel preview
  (see [08](08-known-issues-and-follow-ups.md)).
