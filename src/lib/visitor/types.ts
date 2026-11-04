/**
 * What the visitor endpoint returns: the visitor's own request metadata,
 * read from headers set by the hosting platform. Every field is either a
 * real value or null; nothing is guessed.
 */
export interface VisitorNetwork {
  /** "vercel" when the values come from Vercel's edge headers; "none" when they cannot be trusted or are absent. */
  source: "vercel" | "none";
  ip: string | null;
  city: string | null;
  /** ISO 3166-2 subdivision code as given by the platform, e.g. "KA". */
  region: string | null;
  /** ISO 3166-1 alpha-2 country code, e.g. "IN". */
  countryCode: string | null;
}

/** Read in the visitor's browser and never sent anywhere. */
export interface VisitorDevice {
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  screen: string | null;
  viewport: string | null;
  pixelRatio: string | null;
  language: string | null;
  timezone: string | null;
  connection: string | null;
}
