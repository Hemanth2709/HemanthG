import { ImageResponse } from "next/og";

import { site } from "@/data/site";

export const alt = `${site.name}, ${site.heroLabel}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Open Graph card, generated at build time. Same palette as the site. */
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
          background: "#090b10",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#65a9ff", letterSpacing: 3 }}>
          {site.heroLabel.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: 80, fontWeight: 700, letterSpacing: -2 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 34, color: "#94a3b8", maxWidth: 940, lineHeight: 1.35 }}>
            {site.headline.join(" ")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 28,
            fontSize: 22,
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex" }}>{site.url.replace("https://", "")}</div>
          <div style={{ display: "flex" }}>{site.location}</div>
        </div>
      </div>
    ),
    size,
  );
}
