import { readNetwork } from "@/lib/visitor/network";

/**
 * GET /api/visitor: the caller's own public IP and approximate location,
 * as seen by Vercel's edge. Rendered per request and never cached, so one
 * visitor's data can never be served to another. Nothing is logged or
 * stored, and no third-party lookup is made. The homepage itself stays
 * statically generated (ISR); only this endpoint is dynamic.
 */
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const body = readNetwork(request.headers, process.env.VERCEL === "1");
  return Response.json(body, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
