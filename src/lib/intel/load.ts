import "server-only";

import { cache } from "react";

import { fetchGhsa, fetchKev, fetchNvd } from "./fetchers";

/**
 * All three sources, fetched once per page generation. Both the hero's
 * threat-intel workflow and the "In the wild" feed read from this, so the
 * sources are never called twice for one render (React `cache`).
 */
export const loadIntel = cache(async () => {
  const [kev, nvd, ghsa] = await Promise.all([fetchKev(), fetchNvd(), fetchGhsa()]);
  return { kev, nvd, ghsa };
});
