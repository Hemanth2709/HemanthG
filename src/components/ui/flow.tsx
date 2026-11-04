import type { FlowNode } from "@/data/types";
import { cn } from "@/lib/utils";

interface FlowProps {
  nodes: FlowNode[];
  caption?: string;
  /** Stack vertically again from lg up (for a narrow column on desktop). */
  stackOnDesktop?: boolean;
}

/**
 * Simplified architecture diagram: a left-to-right chain of components
 * (top-to-bottom on phones). The emphasised node is the security control
 * or the part the owner built.
 */
export function Flow({ nodes, caption = "Simplified architecture", stackOnDesktop = false }: FlowProps) {
  return (
    <figure>
      <ol
        className={cn(
          "flex flex-col items-stretch md:flex-row md:items-center",
          stackOnDesktop && "lg:flex-col lg:items-stretch",
        )}
      >
        {nodes.map((node, index) => (
          <li
            key={node.label}
            className={cn(
              "flex flex-col items-stretch md:min-w-0 md:flex-1 md:flex-row md:items-center",
              stackOnDesktop && "lg:flex-none lg:flex-col lg:items-stretch",
            )}
          >
            {index > 0 ? (
              <span
                aria-hidden
                className={cn(
                  "relative mx-auto block h-5 w-px bg-line-strong md:mx-0 md:h-px md:w-5 md:shrink-0",
                  stackOnDesktop && "lg:mx-auto lg:h-5 lg:w-px",
                )}
              />
            ) : null}
            <div
              className={cn(
                "rounded-md border px-3 py-2.5 transition-colors duration-200 md:min-w-0 md:flex-1",
                stackOnDesktop && "lg:flex-none",
                node.emphasis ? "border-accent/50 bg-accent-dim" : "border-line-strong bg-surface",
              )}
            >
              <p className={cn("text-[13px] font-medium", node.emphasis ? "text-accent-bright" : "text-foreground")}>
                {node.label}
              </p>
              {node.detail ? <p className="mt-0.5 font-mono text-[11px] text-subtle">{node.detail}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 font-mono text-[11px] text-subtle">{caption}</figcaption>
    </figure>
  );
}
