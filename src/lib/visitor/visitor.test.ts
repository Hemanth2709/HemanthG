import { describe, expect, it } from "vitest";

import { readNetwork } from "./network";
import { parseUserAgent } from "./user-agent";

const vercelHeaders = (extra: Record<string, string> = {}) =>
  new Headers({
    "x-real-ip": "203.0.113.24",
    "x-forwarded-for": "203.0.113.24",
    "x-vercel-ip-city": "Bengaluru",
    "x-vercel-ip-country-region": "KA",
    "x-vercel-ip-country": "IN",
    ...extra,
  });

describe("readNetwork", () => {
  it("reads Vercel's headers on Vercel", () => {
    expect(readNetwork(vercelHeaders(), true)).toEqual({
      source: "vercel",
      ip: "203.0.113.24",
      city: "Bengaluru",
      region: "KA",
      countryCode: "IN",
    });
  });

  it("trusts nothing off Vercel, where the client could set these headers", () => {
    expect(readNetwork(vercelHeaders(), false)).toEqual({
      source: "none",
      ip: null,
      city: null,
      region: null,
      countryCode: null,
    });
  });

  it("decodes URL-encoded city names", () => {
    expect(readNetwork(vercelHeaders({ "x-vercel-ip-city": "S%C3%A3o%20Paulo" }), true).city).toBe("São Paulo");
  });

  it("drops malformed values instead of showing them", () => {
    const result = readNetwork(
      vercelHeaders({
        "x-real-ip": "<script>",
        "x-forwarded-for": "not-an-ip",
        "x-vercel-ip-city": "%E0%A4%A",
        "x-vercel-ip-country": "India",
        "x-vercel-ip-country-region": "Karnataka",
      }),
      true,
    );
    expect(result).toEqual({ source: "none", ip: null, city: null, region: null, countryCode: null });
  });

  it("falls back to the first x-forwarded-for entry and accepts IPv6", () => {
    const headers = new Headers({ "x-forwarded-for": "2001:DB8::1, 10.0.0.1" });
    expect(readNetwork(headers, true).ip).toBe("2001:db8::1");
  });

  it("keeps partial data: an IP without a location", () => {
    const result = readNetwork(new Headers({ "x-real-ip": "198.51.100.7" }), true);
    expect(result).toMatchObject({ source: "vercel", ip: "198.51.100.7", city: null, countryCode: null });
  });
});

describe("parseUserAgent", () => {
  const cases: [string, string, string | null, string | null][] = [
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Chrome",
      "131",
      "Windows",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
      "Edge",
      "131",
      "Windows",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
      "Safari",
      "18",
      "macOS",
    ],
    ["Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0", "Firefox", "133", "Linux"],
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
      "Safari",
      "18",
      "iOS",
    ],
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1",
      "Chrome",
      "131",
      "iOS",
    ],
    [
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      "Chrome",
      "131",
      "Android",
    ],
    [
      "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36",
      "Samsung Internet",
      "26",
      "Android",
    ],
  ];

  it.each(cases)("%s", (ua, browser, version, os) => {
    expect(parseUserAgent(ua)).toEqual({ browser, version, os });
  });

  it("returns nulls for an unknown agent rather than guessing", () => {
    expect(parseUserAgent("curl/8.5.0")).toEqual({ browser: null, version: null, os: null });
  });
});
