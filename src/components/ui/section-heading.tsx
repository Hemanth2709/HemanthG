import { Reveal } from "@/components/effects/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h2>
      {description ? (
        <p className="text-pretty text-base leading-relaxed text-muted md:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}
