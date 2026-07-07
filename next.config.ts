import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Inline the (small) global stylesheet into the HTML — removes the
    // only render-blocking request on the critical path.
    inlineCss: true,
  },
};

export default nextConfig;
