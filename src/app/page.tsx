import dynamic from "next/dynamic";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";

/**
 * Homepage flow (docs/portfolio-build/01-information-architecture.md):
 * Hero → Threatscape → Selected Work → Engineering Journey → Research & Writing → Contact.
 * Below-the-fold sections are code-split; they still server-render, and the
 * `cv-auto` wrappers skip layout and paint while off-screen.
 */
const Threatscape = dynamic(() => import("@/components/sections/threatscape").then((m) => m.Threatscape));
const Projects = dynamic(() => import("@/components/sections/projects").then((m) => m.Projects));
const Journey = dynamic(() => import("@/components/sections/journey").then((m) => m.Journey));
const Writing = dynamic(() => import("@/components/sections/writing").then((m) => m.Writing));
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Threatscape />
        <div className="cv-auto">
          <Projects />
        </div>
        <div className="cv-auto">
          <Journey />
        </div>
        <div className="cv-auto">
          <Writing />
        </div>
        <div className="cv-auto">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
