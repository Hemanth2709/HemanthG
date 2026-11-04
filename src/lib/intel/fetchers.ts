import "server-only";

import type { IntelItem, IntelResult, IntelSource } from "./types";

/** Six hours. Matches `revalidate` on the page. */
export const REVALIDATE_SECONDS = 21600;
const TIMEOUT_MS = 8000;
const LIMIT = 5;

export const SOURCES: Record<IntelSource["id"], IntelSource> = {
  kev: {
    id: "kev",
    name: "CISA Known Exploited Vulnerabilities",
    description: "Recently added: vulnerabilities CISA has evidence are exploited in the wild.",
    homepage: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
  },
  nvd: {
    id: "nvd",
    name: "NIST National Vulnerability Database",
    description: "Critical CVEs (CVSS v3.1) published in the last seven days.",
    homepage: "https://nvd.nist.gov/",
  },
  ghsa: {
    id: "ghsa",
    name: "GitHub Security Advisories",
    description: "Recent critical, reviewed advisories for npm packages.",
    homepage: "https://github.com/advisories?query=ecosystem%3Anpm+severity%3Acritical",
  },
};

const str = (value: unknown): string | undefined => (typeof value === "string" && value.trim() ? value.trim() : undefined);
const clip = (text: string, max = 180) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);
const nvdLink = (cve: string) => `https://nvd.nist.gov/vuln/detail/${encodeURIComponent(cve)}`;

async function getJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "hemanthg-portfolio (threat feed)", ...headers },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function failure(source: IntelSource, error: unknown): IntelResult {
  const reason =
    error instanceof Error
      ? error.name === "TimeoutError" || error.name === "AbortError"
        ? "the source did not respond in time"
        : error.message.startsWith("HTTP")
          ? `the source returned ${error.message}`
          : "the response could not be read"
      : "unknown error";
  return { ok: false, source, reason, retrievedAt: new Date().toISOString() };
}

/** CISA KEV: newest additions to the catalogue. */
export async function fetchKev(): Promise<IntelResult> {
  const source = SOURCES.kev;
  try {
    const data = (await getJson("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json")) as {
      catalogVersion?: unknown;
      vulnerabilities?: unknown;
    };
    if (!Array.isArray(data.vulnerabilities)) throw new Error("shape");
    const items: IntelItem[] = data.vulnerabilities
      .map((raw: Record<string, unknown>) => {
        const id = str(raw.cveID);
        const title = str(raw.vulnerabilityName);
        const added = str(raw.dateAdded);
        if (!id || !title || !added) return null;
        return {
          id,
          title: clip(title),
          href: nvdLink(id),
          added,
          product: [str(raw.vendorProject), str(raw.product)].filter(Boolean).join(" · ") || undefined,
        } satisfies IntelItem;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => (b.added ?? "").localeCompare(a.added ?? "") || b.id.localeCompare(a.id))
      .slice(0, LIMIT);
    return { ok: true, source, items, retrievedAt: new Date().toISOString(), sourceVersion: str(data.catalogVersion) };
  } catch (error) {
    return failure(source, error);
  }
}

/** NVD API 2.0: critical CVEs published in the last seven days. */
export async function fetchNvd(now = new Date()): Promise<IntelResult> {
  const source = SOURCES.nvd;
  try {
    const end = now.toISOString().slice(0, 19) + ".000";
    const start = new Date(now.getTime() - 7 * 864e5).toISOString().slice(0, 19) + ".000";
    const url =
      "https://services.nvd.nist.gov/rest/json/cves/2.0" +
      `?pubStartDate=${start}&pubEndDate=${end}&cvssV3Severity=CRITICAL&resultsPerPage=40`;
    const key = process.env.NVD_API_KEY;
    const data = (await getJson(url, key ? { apiKey: key } : {})) as { vulnerabilities?: unknown };
    if (!Array.isArray(data.vulnerabilities)) throw new Error("shape");
    const items: IntelItem[] = data.vulnerabilities
      .map((entry: { cve?: Record<string, unknown> }) => {
        const cve = entry.cve ?? {};
        const id = str(cve.id);
        const description = (cve.descriptions as { lang?: string; value?: string }[] | undefined)?.find((d) => d.lang === "en")?.value;
        if (!id || !str(description)) return null;
        const metric = (cve.metrics as { cvssMetricV31?: { cvssData?: { baseScore?: number; baseSeverity?: string } }[] } | undefined)
          ?.cvssMetricV31?.[0]?.cvssData;
        const severity =
          typeof metric?.baseScore === "number" && str(metric.baseSeverity)
            ? `CVSS ${metric.baseScore.toFixed(1)} ${metric.baseSeverity!.toLowerCase()}`
            : undefined;
        return { id, title: clip(description!), href: nvdLink(id), severity, published: str(cve.published), updated: str(cve.lastModified) } satisfies IntelItem;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""))
      .slice(0, LIMIT);
    return { ok: true, source, items, retrievedAt: new Date().toISOString() };
  } catch (error) {
    return failure(source, error);
  }
}

/** GitHub Advisory Database: recent critical, reviewed npm advisories. */
export async function fetchGhsa(): Promise<IntelResult> {
  const source = SOURCES.ghsa;
  try {
    const token = process.env.GITHUB_TOKEN;
    const data = await getJson(
      "https://api.github.com/advisories?type=reviewed&ecosystem=npm&severity=critical&sort=published&direction=desc&per_page=10",
      { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    );
    if (!Array.isArray(data)) throw new Error("shape");
    const items: IntelItem[] = data
      .map((raw: Record<string, unknown>) => {
        const ghsa = str(raw.ghsa_id);
        const summary = str(raw.summary);
        const href = str(raw.html_url);
        if (!ghsa || !summary || !href?.startsWith("https://github.com/")) return null;
        const cvss = (raw.cvss as { score?: number } | undefined)?.score;
        const pkg = (raw.vulnerabilities as { package?: { name?: string } }[] | undefined)?.[0]?.package?.name;
        return {
          id: str(raw.cve_id) ?? ghsa,
          title: clip(summary),
          href,
          severity: typeof cvss === "number" && cvss > 0 ? `CVSS ${cvss.toFixed(1)} critical` : "critical",
          published: str(raw.published_at),
          updated: str(raw.updated_at),
          product: str(pkg) ? `npm · ${pkg}` : undefined,
        } satisfies IntelItem;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, LIMIT);
    return { ok: true, source, items, retrievedAt: new Date().toISOString() };
  } catch (error) {
    return failure(source, error);
  }
}
