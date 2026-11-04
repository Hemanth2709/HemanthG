/** Normalised public threat-intelligence item. Fields come from the source, never invented. */
export interface IntelItem {
  id: string;
  title: string;
  /** Link to the authoritative page for this item. */
  href: string;
  /** e.g. "CVSS 9.8 critical"; only when the source provides it. */
  severity?: string;
  /** The source's own dates, as given (ISO date or date-time). */
  published?: string;
  updated?: string;
  /** For KEV: the date CISA added it to the catalogue. */
  added?: string;
  /** Affected product or package, when the source names it. */
  product?: string;
}

export type IntelResult =
  | {
      ok: true;
      source: IntelSource;
      items: IntelItem[];
      /** When this server retrieved the data (ISO). */
      retrievedAt: string;
      /** The source's own release/version marker, if any. */
      sourceVersion?: string;
    }
  | { ok: false; source: IntelSource; reason: string; retrievedAt: string };

export interface IntelSource {
  id: "kev" | "nvd" | "ghsa";
  name: string;
  description: string;
  homepage: string;
}
