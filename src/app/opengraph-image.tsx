import { ImageResponse } from "next/og";

import { site } from "@/data/site";

export const alt = `${site.name}, ${site.title}`;
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
          background: "#0a0a0b",
          color: "#f2f2ef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#e8a53e", letterSpacing: 3 }}>
          {site.title.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: 80, fontWeight: 700, letterSpacing: -2 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 34, color: "#a3a3a8", maxWidth: 940, lineHeight: 1.35 }}>
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 28,
            fontSize: 22,
            color: "#87878e",
          }}
        >
          <div style={{ display: "flex" }}>{site.url.replace("https://", "")}</div>
          <div style={{ display: "flex" }}>Sentinel-Security v0.1.1</div>
        </div>
      </div>
    ),
    size,
  );
}
