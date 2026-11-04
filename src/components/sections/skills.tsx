import { Reveal } from "@/components/effects/reveal";
import { TagList } from "@/components/ui/tag";
import { learning, skills } from "@/data/skills";

export function SkillsBody() {
  return (
    <>

        <Reveal>
          <dl>
            {skills.map((domain) => (
              <div
                key={domain.title}
                className="grid gap-3 border-b border-line py-6 transition-colors duration-300 hover:bg-surface/50 md:grid-cols-12 md:gap-6 md:px-3"
              >
                <dt className="md:col-span-4">
                  <p className="font-medium text-foreground">{domain.title}</p>
                  {domain.evidence ? (
                    <p className="mt-1 font-mono text-[11px] text-subtle">Used at · {domain.evidence}</p>
                  ) : null}
                </dt>
                <dd className="md:col-span-8">
                  <TagList items={domain.items} />
                </dd>
              </div>
            ))}
            <div className="grid gap-3 py-6 md:grid-cols-12 md:gap-6 md:px-3">
              <dt className="md:col-span-4">
                <p className="font-medium text-foreground">Currently learning</p>
                <p className="mt-1 font-mono text-[11px] text-subtle">Not yet used in production</p>
              </dt>
              <dd className="md:col-span-8">
                <TagList items={learning} dashed />
              </dd>
            </div>
          </dl>
        </Reveal>
    </>
  );
}
