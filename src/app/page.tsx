import dynamic from "next/dynamic";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";

/**
 * Below-the-fold sections are code-split: they still server-render (full
 * HTML for SEO) but their client JS loads in separate chunks. The
 * `cv-auto` wrappers skip layout and paint for off-screen sections.
 *
 * Experience renders nothing until src/data/experience.ts has entries.
 */
const About = dynamic(() => import("@/components/sections/about").then((m) => m.About));
const Projects = dynamic(() => import("@/components/sections/projects").then((m) => m.Projects));
const Process = dynamic(() => import("@/components/sections/process").then((m) => m.Process));
const Experience = dynamic(() =>
  import("@/components/sections/experience").then((m) => m.Experience),
);
const Toolkit = dynamic(() => import("@/components/sections/toolkit").then((m) => m.Toolkit));
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <div className="cv-auto">
          <About />
        </div>
        <div className="cv-auto">
          <Projects />
        </div>
        <div className="cv-auto">
          <Process />
        </div>
        <Experience />
        <div className="cv-auto">
          <Toolkit />
        </div>
        <div className="cv-auto">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
