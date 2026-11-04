import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";

import { site, socials } from "@/data/site";

import "./globals.css";

/**
 * display: "optional" — text renders immediately with the size-adjusted
 * fallback and never reflows on a late font arrival, so LCP is recorded
 * at first paint instead of at font swap. Fonts are self-hosted by
 * next/font and preloaded, so they win the race on real connections.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "optional",
});

/** Display face for headings (docs/portfolio-build/02-visual-system.md). */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "optional",
  weight: ["500", "600"],
});

/** Monospace for small technical labels and code only. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "optional",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.title}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} · ${site.title}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.title}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#090b10",
  colorScheme: "dark",
};

/** Schema.org structured data for rich search results. */
function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.title,
    description: site.description,
    email: `mailto:${site.email}`,
    url: site.url,
    sameAs: socials.filter((social) => social.href.startsWith("http")).map((social) => social.href),
    knowsAbout: site.keywords,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}>
      <body>
        {/* Without JavaScript, scroll reveals never fire: show everything. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <PersonJsonLd />
        {children}
      </body>
    </html>
  );
}
