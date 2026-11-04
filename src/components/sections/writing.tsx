import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { writing } from "@/data/writing";

export function Writing() {
  return (
    <section id="writing" className="scroll-mt-20 border-t border-line py-24 md:py-36" aria-label="Research and writing">
      <div className="container-site">
        <SectionHeading
          index="04"
          label="Research & writing"
          title={["Written down,", "including what didn't work."]}
          description="Method, results and notes from building Sentinel-Security, published with the code. Articles will appear here when they exist."
        />

        <Reveal>
          <ul className="grid border-t border-line md:grid-cols-2">
            {writing.map((entry, index) => (
              <li key={entry.href} className="border-b border-line md:odd:border-r md:odd:pr-8 md:even:pl-8">
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-6"
                >
                  <span className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{entry.kind}</span>
                    <span className="mt-1.5 block text-lg font-medium text-foreground transition-colors duration-200 group-hover:text-accent-bright">
                      {entry.title}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted">{entry.summary}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-subtle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
