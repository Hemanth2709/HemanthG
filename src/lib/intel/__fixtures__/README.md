`kev.sample.json` and `nvd.sample.json` are trimmed copies of real responses
from the CISA KEV feed and the NVD API 2.0 (retrieved 2026-11-04), plus one
deliberately incomplete KEV entry. They are test fixtures only and are
never shown on the site.

The GitHub advisory fixture is built inside the test from the documented
response shape (https://docs.github.com/rest/security-advisories/global-advisories),
because the development sandbox cannot reach api.github.com. Its ids are
obviously synthetic (`GHSA-test-…`).
