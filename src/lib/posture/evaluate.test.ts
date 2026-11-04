import { describe, expect, it } from "vitest";

import { evaluateHeaders, unknownChecks } from "./evaluate";

const status = (results: ReturnType<typeof evaluateHeaders>, id: string) => results.find((r) => r.id === id)!.status;

describe("evaluateHeaders", () => {
  it("reports missing headers as missing, never as passing", () => {
    const results = evaluateHeaders("https://example.com/", new Headers());
    expect(status(results, "https")).toBe("pass");
    for (const id of ["hsts", "csp", "nosniff", "referrer", "permissions"]) expect(status(results, id)).toBe("missing");
  });

  it("passes a strong configuration", () => {
    const results = evaluateHeaders(
      "https://example.com/",
      new Headers({
        "strict-transport-security": "max-age=63072000; includeSubDomains",
        "content-security-policy": "default-src 'self'; script-src 'self'; frame-ancestors 'none'; object-src 'none'",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
        "permissions-policy": "camera=()",
      }),
    );
    expect(results.every((r) => r.status === "pass")).toBe(true);
  });

  it("marks a CSP that allows inline scripts as partial and says why", () => {
    const results = evaluateHeaders(
      "https://example.com/",
      new Headers({ "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; frame-ancestors 'none'; object-src 'none'" }),
    );
    const csp = results.find((r) => r.id === "csp")!;
    expect(csp.status).toBe("partial");
    expect(csp.detail).toContain("'unsafe-inline'");
  });

  it("marks a short HSTS max-age and an unsafe referrer policy as partial", () => {
    const results = evaluateHeaders(
      "https://example.com/",
      new Headers({ "strict-transport-security": "max-age=300", "referrer-policy": "unsafe-url" }),
    );
    expect(status(results, "hsts")).toBe("partial");
    expect(status(results, "referrer")).toBe("partial");
  });

  it("uses the last valid Referrer-Policy token", () => {
    const results = evaluateHeaders("https://example.com/", new Headers({ "referrer-policy": "unsafe-url, no-referrer" }));
    expect(status(results, "referrer")).toBe("pass");
  });

  it("fails HTTPS for a plain http URL", () => {
    expect(status(evaluateHeaders("http://example.com/", new Headers()), "https")).toBe("missing");
  });
});

describe("unknownChecks", () => {
  it("reports every check as unknown with the reason", () => {
    const results = unknownChecks("the site did not respond");
    expect(results).toHaveLength(6);
    expect(results.every((r) => r.status === "unknown" && r.detail.includes("did not respond"))).toBe(true);
  });
});
