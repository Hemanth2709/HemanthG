import { cn } from "@/lib/utils";

/** Technology label. Hover only brightens it; it is not a link. */
export function Tag({ children, dashed = false }: { children: React.ReactNode; dashed?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none text-muted transition-colors duration-200 hover:border-accent/50 hover:text-foreground",
        dashed ? "border-dashed border-line-strong" : "border-line-strong",
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, dashed }: { items: string[]; dashed?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item}>
          <Tag dashed={dashed}>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
