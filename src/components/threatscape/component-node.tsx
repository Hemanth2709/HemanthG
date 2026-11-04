"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";

import { CATALOGUE } from "@/lib/threatscape/catalogue";
import type { ComponentKind, Effect } from "@/lib/threatscape/types";
import { cn } from "@/lib/utils";

export interface ComponentNodeData extends Record<string, unknown> {
  kind: ComponentKind;
  /** 1-based position on the attack path, if on it. */
  step?: number;
  /** Strongest control effect acting at this node. */
  effect?: Effect;
  unreached?: boolean;
  /** Whether threat colouring is shown (threat and defence views). */
  showThreat: boolean;
}

const zoneDot: Record<string, string> = {
  internet: "bg-subtle",
  edge: "bg-metal",
  app: "bg-accent",
  data: "bg-violet",
  platform: "bg-faint",
};

/** A component on the canvas: label, technology, and its state in the active scenario. */
export const ComponentNode = memo(function ComponentNode({ data, selected }: NodeProps) {
  const { kind, step, effect, unreached, showThreat } = data as ComponentNodeData;
  const def = CATALOGUE[kind];
  const onPath = showThreat && step !== undefined && !unreached;
  return (
    <div
      className={cn(
        "relative w-36 rounded-lg border bg-surface px-3 py-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)] transition-colors duration-200",
        selected ? "border-foreground/70" : "border-line-strong",
        onPath && !effect && "border-threat/70 bg-threat-dim",
        onPath && effect === "blocks" && "border-defence bg-defence-dim",
        onPath && (effect === "reduces" || effect === "detects") && "border-defence/60",
        showThreat && unreached && "opacity-45",
      )}
    >
      <Handle type="target" position={Position.Left} className="size-2! border-line-strong! bg-raised!" />
      <div className="flex items-center gap-2">
        <span aria-hidden className={cn("size-1.5 rounded-full", zoneDot[def.zone])} />
        <span className="text-[13px] font-medium text-foreground">{def.label}</span>
        {onPath ? (
          <span className="ml-auto font-mono text-[10px] text-threat" aria-label={`Attack step ${step}`}>
            {String(step).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      <p className={cn("mt-0.5 font-mono text-[10.5px]", onPath ? "text-muted" : "text-subtle")}>{def.tech}</p>
      {showThreat && effect ? (
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-defence">
          {effect === "blocks" ? "blocked here" : effect === "reduces" ? "reduced here" : "detected here"}
        </p>
      ) : null}
      <Handle type="source" position={Position.Right} className="size-2! border-line-strong! bg-raised!" />
    </div>
  );
});
