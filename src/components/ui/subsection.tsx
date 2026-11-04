import { Reveal } from "@/components/effects/reveal";

/** Heading for a part inside a section, e.g. "Experience" inside Engineering Journey. */
export function Subsection({ id, title, note, children }: { id?: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 pt-20 md:pt-28">
      <Reveal className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
        <h3 className="font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">{title}</h3>
        {note ? <p className="font-mono text-xs text-subtle">{note}</p> : null}
      </Reveal>
      {children}
    </div>
  );
}
