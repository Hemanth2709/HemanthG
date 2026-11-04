/**
 * Evaluate the security headers a deployed response actually returned.
 * Pure: takes the observed URL and headers, returns per-check results.
 * Nothing is hardcoded as passing; a check without data is "unknown".
 */

export type CheckStatus = "pass" | "partial" | "missing" | "unknown";

export interface CheckResult {
  id: "https" | "hsts" | "csp" | "nosniff" | "referrer" | "permissions";
  label: string;
  status: CheckStatus;
  /** The header value exactly as observed, if any. */
  observed?: string;
  /** Why this status, in one sentence. */
  detail: string;
}

const SAFE_REFERRER = new Set(["no-referrer", "same-origin", "strict-origin", "strict-origin-when-cross-origin"]);

export function evaluateHeaders(url: string, headers: Headers): CheckResult[] {
  const get = (name: string) => headers.get(name) ?? undefined;
  const results: CheckResult[] = [];

  results.push(
    url.startsWith("https://")
      ? { id: "https", label: "HTTPS", status: "pass", observed: new URL(url).origin, detail: "The page was retrieved over HTTPS." }
      : { id: "https", label: "HTTPS", status: "missing", observed: url, detail: "The page was retrieved without HTTPS." },
  );

  const hsts = get("strict-transport-security");
  const maxAge = Number(/max-age=(\d+)/i.exec(hsts ?? "")?.[1] ?? NaN);
  results.push(
    !hsts
      ? { id: "hsts", label: "HSTS", status: "missing", detail: "No Strict-Transport-Security header." }
      : Number.isFinite(maxAge) && maxAge >= 15552000
        ? { id: "hsts", label: "HSTS", status: "pass", observed: hsts, detail: "Browsers are told to use HTTPS for at least six months." }
        : { id: "hsts", label: "HSTS", status: "partial", observed: hsts, detail: "Present, but max-age is missing or shorter than six months." },
  );

  const csp = get("content-security-policy");
  if (!csp) {
    results.push({ id: "csp", label: "Content-Security-Policy", status: "missing", detail: "No Content-Security-Policy header." });
  } else {
    const directives = new Map(
      csp.split(";").map((part) => {
        const [name = "", ...values] = part.trim().split(/\s+/);
        return [name.toLowerCase(), values] as const;
      }),
    );
    const scriptSrc = directives.get("script-src") ?? directives.get("default-src") ?? [];
    const weak: string[] = [];
    if (scriptSrc.includes("'unsafe-inline'")) weak.push("script-src allows 'unsafe-inline'");
    if (scriptSrc.includes("'unsafe-eval'")) weak.push("script-src allows 'unsafe-eval'");
    if (!directives.has("frame-ancestors")) weak.push("no frame-ancestors");
    if (!directives.has("object-src") && !(directives.get("default-src") ?? []).includes("'none'")) weak.push("object-src not restricted");
    results.push(
      weak.length === 0
        ? { id: "csp", label: "Content-Security-Policy", status: "pass", observed: csp, detail: "A restrictive policy is set." }
        : { id: "csp", label: "Content-Security-Policy", status: "partial", observed: csp, detail: `Present, with limitations: ${weak.join("; ")}.` },
    );
  }

  const nosniff = get("x-content-type-options");
  results.push(
    nosniff?.toLowerCase() === "nosniff"
      ? { id: "nosniff", label: "X-Content-Type-Options", status: "pass", observed: nosniff, detail: "Browsers will not guess content types." }
      : { id: "nosniff", label: "X-Content-Type-Options", status: nosniff ? "partial" : "missing", observed: nosniff, detail: "Should be exactly nosniff." },
  );

  const referrer = get("referrer-policy");
  const policies = (referrer ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  results.push(
    !referrer
      ? { id: "referrer", label: "Referrer-Policy", status: "missing", detail: "No Referrer-Policy header (browsers fall back to their default)." }
      : SAFE_REFERRER.has(policies.at(-1) ?? "")
        ? { id: "referrer", label: "Referrer-Policy", status: "pass", observed: referrer, detail: "Full URLs are not sent to other sites." }
        : { id: "referrer", label: "Referrer-Policy", status: "partial", observed: referrer, detail: "Set, but may send full URLs to other sites." },
  );

  const permissions = get("permissions-policy");
  results.push(
    permissions
      ? { id: "permissions", label: "Permissions-Policy", status: "pass", observed: permissions, detail: "Browser features the site does not use are turned off." }
      : { id: "permissions", label: "Permissions-Policy", status: "missing", detail: "No Permissions-Policy header." },
  );

  return results;
}

/** Every check as unknown, for when the site could not be retrieved. */
export function unknownChecks(reason: string): CheckResult[] {
  const ids: [CheckResult["id"], string][] = [
    ["https", "HTTPS"],
    ["hsts", "HSTS"],
    ["csp", "Content-Security-Policy"],
    ["nosniff", "X-Content-Type-Options"],
    ["referrer", "Referrer-Policy"],
    ["permissions", "Permissions-Policy"],
  ];
  return ids.map(([id, label]) => ({ id, label, status: "unknown", detail: `Not checked: ${reason}.` }));
}
