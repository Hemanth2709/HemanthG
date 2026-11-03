import { Reveal } from "@/components/effects/reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Two-digit section index, e.g. "02". */
  index: string;
  label: string;
  /** One entry per line; lines after the first render muted. */
  title: string[];
  description?: string;
  className?: string;
}

export function SectionHeading({ index, label, title, description, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("mb-14 md:mb-20", className)}>
      <p className="label flex items-center gap-3">
        <span className="text-accent">{index}</span>
        <span aria-hidden className="h-px w-8 bg-line-strong" />
        {label}
      </p>
      <h2 className="mt-6 max-w-4xl text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-foreground md:text-5xl">
        {title.map((line, i) => (
          <span key={line} className={i === 0 ? "block" : "block text-muted"}>
            {line}
          </span>
        ))}
      </h2>
      {description ? (
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}
