import dynamic from "next/dynamic";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";

/**
 * Below-the-fold sections are code-split: they still server-render (full
 * HTML for SEO) but their client JS loads in separate chunks. The
 * `cv-auto` wrappers skip layout and paint for off-screen sections.
 */
const About = dynamic(() => import("@/components/sections/about").then((m) => m.About));
const Experience = dynamic(() => import("@/components/sections/experience").then((m) => m.Experience));
const Projects = dynamic(() => import("@/components/sections/projects").then((m) => m.Projects));
const Skills = dynamic(() => import("@/components/sections/skills").then((m) => m.Skills));
const Security = dynamic(() => import("@/components/sections/security").then((m) => m.Security));
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
        <div className="cv-auto">
          <About />
        </div>
        <div className="cv-auto">
          <Experience />
        </div>
        <div className="cv-auto">
          <Projects />
        </div>
        <div className="cv-auto">
          <Skills />
        </div>
        <div className="cv-auto">
          <Security />
        </div>
        <div className="cv-auto">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
