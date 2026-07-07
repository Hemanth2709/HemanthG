import { Reveal } from "@/components/effects/reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-14 flex max-w-2xl flex-col gap-4 md:mb-20",
        align === "center" && "mx-auto items-center text-center",
      )}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-pretty text-base leading-relaxed text-muted md:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}
