import { ImageResponse } from "next/og";

import { site } from "@/data/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded Open Graph card, generated at build time — no image assets needed. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #08090b 0%, #0d0e16 60%, #12142a 100%)",
          color: "#f4f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "1px solid rgba(139,147,255,0.4)",
              color: "#8b93ff",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            {site.initials}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#9ba1ad", letterSpacing: 4 }}>
            {site.title.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>
            {site.name}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#9ba1ad", maxWidth: 900, lineHeight: 1.4 }}>
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#8b93ff" }}>{site.url.replace("https://", "")}</div>
      </div>
    ),
    size,
  );
}
