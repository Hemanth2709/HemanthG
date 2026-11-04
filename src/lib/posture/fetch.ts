import "server-only";

import { site } from "@/data/site";

import { evaluateHeaders, unknownChecks, type CheckResult } from "./evaluate";

export interface PostureReport {
  /** The URL whose response headers were evaluated. */
  url: string;
  checkedAt: string;
  ok: boolean;
  checks: CheckResult[];
}

/**
 * The deployed production site: POSTURE_URL if set, else Vercel's production
 * domain, else site.url. Fetched on the server; the visitor is not involved.
 */
function target(): string {
  if (process.env.POSTURE_URL) return process.env.POSTURE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/`;
  return `${site.url}/`;
}

export async function fetchPosture(): Promise<PostureReport> {
  const url = target();
  const checkedAt = new Date().toISOString();
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 21600 },
      headers: { "User-Agent": "hemanthg-portfolio (security posture self-check)" },
    });
    if (!response.ok) return { url, checkedAt, ok: false, checks: unknownChecks(`the site returned HTTP ${response.status}`) };
    return { url: response.url || url, checkedAt, ok: true, checks: evaluateHeaders(response.url || url, response.headers) };
  } catch {
    return { url, checkedAt, ok: false, checks: unknownChecks("the site could not be reached") };
  }
}
