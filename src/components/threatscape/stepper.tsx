"use client";

import { CATALOGUE } from "@/lib/threatscape/catalogue";
import type { ScenarioId } from "@/lib/threatscape/types";
import { cn } from "@/lib/utils";

import { ControlsPanel, ScenarioPanel } from "./panels";
import { PipelineView } from "./pipeline-view";
import { AVAILABLE_SCENARIOS, useThreatscape } from "./use-threatscape";

/**
 * Small-screen Threatscape: the same engine and scenarios on the default
 * architecture, as a step-by-step walk-through. React Flow is not loaded.
 */
export default function Stepper() {
  const { graph, scenario, chooseScenario, applied, toggleControl, evaluation, activeStep, setActiveStep, reset } = useThreatscape();
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-line-strong bg-background p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-[13px] text-muted">
          Scenario
          <select
            value={scenario.id}
            onChange={(event) => chooseScenario(event.target.value as ScenarioId)}
            className="rounded-md border border-line-strong bg-surface px-2 py-1.5 text-[13px] text-foreground"
          >
            {AVAILABLE_SCENARIOS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={reset} className="ml-auto rounded-md border border-line-strong px-2.5 py-1.5 text-[13px] text-muted">
          Reset
        </button>
      </div>

      <div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">Architecture</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {graph.nodes.map((node) => {
            const onPath = evaluation.path?.includes(node.id);
            return (
              <li
                key={node.id}
                className={cn(
                  "rounded-md border px-2 py-1 text-[12px]",
                  onPath ? "border-threat/60 text-foreground" : "border-line text-muted",
                )}
              >
                {CATALOGUE[node.kind].label}
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-xs text-subtle">On a larger screen you can drag, connect and remove components.</p>
      </div>

      <ScenarioPanel scenario={scenario} evaluation={evaluation} activeStep={activeStep} onStep={setActiveStep} />
      <ControlsPanel scenario={scenario} applied={applied} inactive={evaluation.inactive} onToggle={toggleControl} />

      <div className="border-t border-line pt-5">
        <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">DevSecOps pipeline</p>
        <PipelineView compact />
      </div>
    </div>
  );
}
