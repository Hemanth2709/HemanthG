import dynamic from "next/dynamic";

import { CursorGlow } from "@/components/effects/cursor-glow";
import { LoadingScreen } from "@/components/effects/loading-screen";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";

/**
 * Everything below the fold is code-split: sections still server-render
 * (SEO keeps full HTML) but their client JS loads in separate chunks
 * after the shell is interactive, keeping the critical bundle minimal.
 * The `cv-auto` wrappers skip layout/paint work for off-screen sections.
 */
const About = dynamic(() => import("@/components/sections/about").then((m) => m.About));
const Projects = dynamic(() => import("@/components/sections/projects").then((m) => m.Projects));
const Process = dynamic(() => import("@/components/sections/process").then((m) => m.Process));
const AISection = dynamic(() => import("@/components/sections/ai").then((m) => m.AISection));
const Experience = dynamic(() => import("@/components/sections/experience").then((m) => m.Experience));
const Toolkit = dynamic(() => import("@/components/sections/toolkit").then((m) => m.Toolkit));
const Stats = dynamic(() => import("@/components/sections/stats").then((m) => m.Stats));
const Testimonials = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => m.Testimonials),
);
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <div className="cv-auto">
          <About />
        </div>
        <div className="cv-auto">
          <Projects />
        </div>
        <div className="cv-auto">
          <Process />
        </div>
        <div className="cv-auto">
          <AISection />
        </div>
        <div className="cv-auto">
          <Experience />
        </div>
        <div className="cv-auto">
          <Toolkit />
        </div>
        <div className="cv-auto">
          <Stats />
        </div>
        <div className="cv-auto">
          <Testimonials />
        </div>
        <div className="cv-auto">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
