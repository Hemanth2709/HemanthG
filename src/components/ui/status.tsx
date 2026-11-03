import type { ProjectStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const dot: Record<ProjectStatus, string> = {
  Released: "bg-success",
  Live: "bg-success",
  "Professional work": "bg-accent",
  "In progress": "bg-warn",
  Planned: "border border-faint bg-transparent",
};

export function Status({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-mono text-xs text-muted", className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", dot[status])} />
      {status}
    </span>
  );
}
