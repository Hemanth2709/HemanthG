import type { VisitorNetwork } from "./types";

const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const IPV6 = /^[0-9a-f:]{2,39}$/i;

function ip(value: string | null): string | null {
  const candidate = value?.split(",")[0]?.trim();
  if (!candidate) return null;
  if (IPV4.test(candidate)) return candidate;
  if (candidate.includes(":") && IPV6.test(candidate)) return candidate.toLowerCase();
  return null;
}

function city(value: string | null): string | null {
  if (!value) return null;
  try {
    // Vercel URL-encodes the city name (e.g. "S%C3%A3o%20Paulo").
    const decoded = decodeURIComponent(value).trim();
    return decoded.length > 0 && decoded.length <= 80 ? decoded : null;
  } catch {
    return null;
  }
}

function code(value: string | null, pattern: RegExp): string | null {
  const trimmed = value?.trim().toUpperCase();
  return trimmed && pattern.test(trimmed) ? trimmed : null;
}

const NONE: VisitorNetwork = { source: "none", ip: null, city: null, region: null, countryCode: null };

/**
 * Extract the visitor's own network metadata from request headers.
 *
 * Forwarding headers are only trusted on Vercel: its edge overwrites
 * `x-real-ip`, `x-forwarded-for` and the `x-vercel-ip-*` geolocation
 * headers with its own values, so a client cannot spoof them there.
 * Anywhere else (local dev, another proxy) the same headers could be set by
 * the client, so nothing is reported. No lookup service is called: the
 * visitor's IP is not sent to any third party.
 */
export function readNetwork(headers: Headers, onVercel: boolean): VisitorNetwork {
  if (!onVercel) return NONE;
  const address = ip(headers.get("x-real-ip")) ?? ip(headers.get("x-forwarded-for"));
  const result: VisitorNetwork = {
    source: "vercel",
    ip: address,
    city: city(headers.get("x-vercel-ip-city")),
    region: code(headers.get("x-vercel-ip-country-region"), /^[A-Z0-9]{1,3}$/),
    countryCode: code(headers.get("x-vercel-ip-country"), /^[A-Z]{2}$/),
  };
  return result.ip || result.city || result.countryCode ? result : NONE;
}
