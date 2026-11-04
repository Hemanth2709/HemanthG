import { AboutBody } from "@/components/sections/about";
import { ExperienceBody } from "@/components/sections/experience";
import { SkillsBody } from "@/components/sections/skills";
import { SecurityPractice } from "@/components/sections/security-practice";
import { SectionHeading } from "@/components/ui/section-heading";
import { Subsection } from "@/components/ui/subsection";
import { about } from "@/data/about";

/** Engineering Journey: background, roles, security practice and skills, in that order. */
export function Journey() {
  return (
    <section id="journey" className="scroll-mt-20 border-t border-line py-24 md:py-36" aria-label="Engineering journey">
      <div className="container-site">
        <SectionHeading index="03" label="Engineering journey" title={about.headline} />
        <AboutBody />

        <Subsection id="experience" title="Experience" note="Three roles, 2021 to now">
          <ExperienceBody />
        </Subsection>

        <Subsection id="security-practice" title="Security in practice" note="What I've done so far, not a job title">
          <SecurityPractice />
        </Subsection>

        <Subsection id="skills" title="Skills" note="No ratings; each group says where it was used">
          <SkillsBody />
        </Subsection>
      </div>
    </section>
  );
}
