import { afterEach, describe, expect, it, vi } from "vitest";

import kevSample from "./__fixtures__/kev.sample.json";
import nvdSample from "./__fixtures__/nvd.sample.json";
import { fetchGhsa, fetchKev, fetchNvd } from "./fetchers";

function mockFetch(body: unknown, status = 200) {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(body), { status })));
}

afterEach(() => vi.unstubAllGlobals());

describe("fetchKev", () => {
  it("returns the newest additions, newest first, with NVD links and the catalogue version", async () => {
    mockFetch(kevSample);
    const result = await fetchKev();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.items).toHaveLength(5);
    expect(result.sourceVersion).toBe(kevSample.catalogVersion);
    const added = result.items.map((item) => item.added!);
    expect([...added].sort().reverse()).toEqual(added);
    expect(result.items.every((item) => item.href.startsWith("https://nvd.nist.gov/vuln/detail/CVE-"))).toBe(true);
  });

  it("skips entries with missing fields instead of inventing them", async () => {
    mockFetch(kevSample);
    const result = await fetchKev();
    expect(result.ok && result.items.some((item) => item.id === "CVE-0000-MISSING")).toBe(false);
  });

  it("reports an HTTP error as unavailable", async () => {
    mockFetch({}, 503);
    const result = await fetchKev();
    expect(result).toMatchObject({ ok: false, reason: "the source returned HTTP 503" });
  });

  it("reports a malformed response as unavailable", async () => {
    mockFetch({ unexpected: true });
    expect((await fetchKev()).ok).toBe(false);
  });

  it("reports a network failure as unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("fetch failed"))));
    expect(await fetchKev()).toMatchObject({ ok: false, reason: "the response could not be read" });
  });
});

describe("fetchNvd", () => {
  it("parses CVEs with English descriptions and real CVSS values only", async () => {
    mockFetch(nvdSample);
    const result = await fetchNvd(new Date("2026-11-04T00:00:00Z"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.items.length).toBeGreaterThan(0);
    for (const item of result.items) {
      expect(item.id).toMatch(/^CVE-\d{4}-\d+$/);
      if (item.severity) expect(item.severity).toMatch(/^CVSS \d+\.\d (critical|high|medium|low)$/);
    }
  });

  it("asks for the last seven days of critical CVEs", async () => {
    const spy = vi.fn(async () => new Response(JSON.stringify({ vulnerabilities: [] })));
    vi.stubGlobal("fetch", spy);
    await fetchNvd(new Date("2026-11-04T12:00:00Z"));
    const url = String((spy.mock.calls[0] as unknown[])[0]);
    expect(url).toContain("pubStartDate=2026-10-28T12:00:00.000");
    expect(url).toContain("pubEndDate=2026-11-04T12:00:00.000");
    expect(url).toContain("cvssV3Severity=CRITICAL");
  });
});

describe("fetchGhsa", () => {
  const advisory = (n: number, extra: Record<string, unknown> = {}) => ({
    ghsa_id: `GHSA-test-000${n}`,
    cve_id: n === 1 ? null : `CVE-2026-0000${n}`,
    summary: `Synthetic advisory ${n}`,
    html_url: `https://github.com/advisories/GHSA-test-000${n}`,
    severity: "critical",
    cvss: { score: n === 2 ? null : 9.8 },
    published_at: "2026-11-01T10:00:00Z",
    updated_at: "2026-11-02T10:00:00Z",
    vulnerabilities: [{ package: { ecosystem: "npm", name: `pkg-${n}` } }],
    ...extra,
  });

  it("uses the CVE id when present, the GHSA id otherwise, and keeps only github.com links", async () => {
    mockFetch([advisory(1), advisory(2), advisory(3, { html_url: "https://evil.example/x" })]);
    const result = await fetchGhsa();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.items.map((item) => item.id)).toEqual(["GHSA-test-0001", "CVE-2026-00002"]);
    expect(result.items[0]!.severity).toBe("CVSS 9.8 critical");
    expect(result.items[1]!.severity).toBe("critical");
    expect(result.items[0]!.product).toBe("npm · pkg-1");
  });

  it("reports rate limiting as unavailable", async () => {
    mockFetch({ message: "API rate limit exceeded" }, 403);
    expect(await fetchGhsa()).toMatchObject({ ok: false, reason: "the source returned HTTP 403" });
  });
});
