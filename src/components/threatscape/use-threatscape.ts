"use client";

import { useCallback, useMemo, useState } from "react";

import { defaultGraph, evaluate } from "@/lib/threatscape/engine";
import { SCENARIOS } from "@/lib/threatscape/scenarios";
import type { ControlId, Graph, ScenarioId } from "@/lib/threatscape/types";

export type View = "infrastructure" | "threat" | "defence" | "devsecops";

export const AVAILABLE_SCENARIOS = Object.values(SCENARIOS).filter((s): s is NonNullable<typeof s> => Boolean(s));

/** State shared by the desktop workbench and the mobile stepper. Nothing persists. */
export function useThreatscape() {
  const [graph, setGraph] = useState<Graph>(defaultGraph);
  const [view, setView] = useState<View>("infrastructure");
  const [scenarioId, setScenarioId] = useState<ScenarioId>(AVAILABLE_SCENARIOS[0]!.id);
  const [applied, setApplied] = useState<Set<ControlId>>(() => new Set());
  const [activeStep, setActiveStep] = useState(0);

  const scenario = SCENARIOS[scenarioId]!;
  const evaluation = useMemo(() => evaluate(graph, scenario, applied), [graph, scenario, applied]);

  const toggleControl = useCallback((id: ControlId) => {
    setApplied((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const chooseScenario = useCallback((id: ScenarioId) => {
    setScenarioId(id);
    setApplied(new Set());
    setActiveStep(0);
  }, []);

  const reset = useCallback(() => {
    setGraph(defaultGraph());
    setApplied(new Set());
    setActiveStep(0);
    setView("infrastructure");
  }, []);

  return {
    graph,
    setGraph,
    view,
    setView,
    scenario,
    chooseScenario,
    applied,
    toggleControl,
    evaluation,
    activeStep: Math.min(activeStep, Math.max(evaluation.steps.length - 1, 0)),
    setActiveStep,
    reset,
  };
}
