"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import { RotateCcw, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CATALOGUE, PALETTE_ORDER } from "@/lib/threatscape/catalogue";
import { addNode, connect, connectionError, disconnect, isFlowEdge, removeNode } from "@/lib/threatscape/engine";
import type { ComponentKind, Effect, ScenarioId } from "@/lib/threatscape/types";
import { cn } from "@/lib/utils";

import { ComponentNode, type ComponentNodeData } from "./component-node";
import { ControlsPanel, ExplainerPanel, OutcomeBadge, ScenarioPanel } from "./panels";
import { PipelineView } from "./pipeline-view";
import { AVAILABLE_SCENARIOS, useThreatscape, type View } from "./use-threatscape";

const Scene3D = dynamic(() => import("./scene3d"), {
  ssr: false,
  loading: () => <p className="p-4 font-mono text-xs text-subtle">Loading 3D view…</p>,
});

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const nodeTypes = { component: ComponentNode };
const DRAG_TYPE = "application/x-threatscape-kind";
const STRENGTH: Record<Effect, number> = { detects: 1, reduces: 2, blocks: 3 };

const VIEWS: { id: View; label: string; hint: string }[] = [
  { id: "infrastructure", label: "Infrastructure", hint: "Build and inspect the architecture" },
  { id: "threat", label: "Threat", hint: "Walk the attack path step by step" },
  { id: "defence", label: "Defence", hint: "Apply controls and see what changes" },
  { id: "devsecops", label: "DevSecOps", hint: "A secure delivery pipeline, stage by stage" },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function Canvas() {
  const state = useThreatscape();
  const { graph, setGraph, view, setView, scenario, chooseScenario, applied, toggleControl, evaluation, activeStep, setActiveStep, reset } = state;
  const flow = useReactFlow();
  const wrapper = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dimension, setDimension] = useState<"2d" | "3d">("2d");
  const [webgl, setWebgl] = useState(false);
  useEffect(() => setWebgl(hasWebGL()), []);

  const showThreat = view !== "infrastructure";
  const path = useMemo(() => evaluation.path ?? [], [evaluation.path]);
  const pathEdges = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < path.length - 1; i += 1) set.add(`${path[i]}->${path[i + 1]}`);
    return set;
  }, [path]);

  const nodes: Node[] = useMemo(
    () =>
      graph.nodes.map((node) => {
        const index = path.indexOf(node.id);
        const step = index >= 0 ? evaluation.steps[index] : undefined;
        const strongest = step?.effects.reduce<Effect | undefined>(
          (best, effect) => (!best || STRENGTH[effect.effect] > STRENGTH[best] ? effect.effect : best),
          undefined,
        );
        const data: ComponentNodeData = {
          kind: node.kind,
          step: index >= 0 ? index + 1 : undefined,
          effect: strongest,
          unreached: step?.unreached,
          showThreat,
        };
        const highlighted = view === "threat" && index === activeStep;
        return {
          id: node.id,
          type: "component",
          position: { x: node.x, y: node.y },
          data,
          selected: node.id === selected || highlighted,
          ariaLabel: `${CATALOGUE[node.kind].label}${index >= 0 && showThreat ? `, attack step ${index + 1}` : ""}`,
        };
      }),
    [graph.nodes, path, evaluation.steps, showThreat, selected, view, activeStep],
  );

  const edges: Edge[] = useMemo(
    () =>
      graph.edges.map((edge) => {
        const onPath = showThreat && pathEdges.has(`${edge.source}->${edge.target}`);
        const flowEdge = isFlowEdge(graph, edge);
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: onPath && !reducedMotion,
          style: {
            stroke: onPath ? "var(--color-threat)" : flowEdge ? "#3a475b" : "#2b3647",
            strokeWidth: onPath ? 2 : 1.25,
            strokeDasharray: flowEdge ? undefined : "4 5",
          },
          ariaLabel: `${CATALOGUE[graph.nodes.find((n) => n.id === edge.source)!.kind].label} to ${CATALOGUE[graph.nodes.find((n) => n.id === edge.target)!.kind].label}`,
        };
      }),
    [graph, pathEdges, showThreat, reducedMotion],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const change of changes) {
        if (change.type === "position" && change.position) {
          const { id, position } = change;
          setGraph((g) => ({ ...g, nodes: g.nodes.map((n) => (n.id === id ? { ...n, x: position.x, y: position.y } : n)) }));
        } else if (change.type === "select") {
          setSelected((current) => (change.selected ? change.id : current === change.id ? null : current));
        } else if (change.type === "remove") {
          setGraph((g) => removeNode(g, change.id));
          setSelected((current) => (current === change.id ? null : current));
        }
      }
    },
    [setGraph],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      for (const change of changes) if (change.type === "remove") setGraph((g) => disconnect(g, change.id));
    },
    [setGraph],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const error = connectionError(graph, connection.source, connection.target);
      setNotice(error);
      if (!error) setGraph((g) => connect(g, connection.source, connection.target));
    },
    [graph, setGraph],
  );

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => connectionError(graph, connection.source, connection.target) === null,
    [graph],
  );

  const placeAt = useCallback(
    (kind: ComponentKind, clientX: number, clientY: number) => {
      const position = flow.screenToFlowPosition({ x: clientX, y: clientY });
      const { graph: next, node } = addNode(graph, kind, position.x - 80, position.y - 28);
      setGraph(next);
      setSelected(node.id);
      setNotice(null);
    },
    [flow, graph, setGraph],
  );

  const addToCentre = (kind: ComponentKind) => {
    const box = wrapper.current?.getBoundingClientRect();
    if (box) placeAt(kind, box.left + box.width / 2, box.top + box.height / 2);
  };

  const selectedNode = graph.nodes.find((node) => node.id === selected);
  const connectOptions = selectedNode
    ? graph.nodes.filter((other) => other.id !== selectedNode.id && connectionError(graph, selectedNode.id, other.id) === null)
    : [];

  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
        <div role="tablist" aria-label="Threatscape view" className="flex rounded-md border border-line-strong p-0.5">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={view === item.id}
              title={item.hint}
              onClick={() => setView(item.id)}
              className={cn(
                "rounded px-3 py-1.5 text-[13px] transition-colors",
                view === item.id ? "bg-raised text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className={cn("flex items-center gap-2 text-[13px] text-muted", view === "devsecops" && "invisible")}>
          Scenario
          <select
            value={scenario.id}
            onChange={(event) => chooseScenario(event.target.value as ScenarioId)}
            className="max-w-[15rem] rounded-md border border-line-strong bg-surface px-2 py-1.5 text-[13px] text-foreground"
          >
            {AVAILABLE_SCENARIOS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        {view === "threat" && evaluation.steps.length > 0 ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="rounded-md border border-line-strong px-2.5 py-1.5 text-[13px] text-foreground disabled:opacity-40"
            >
              Previous step
            </button>
            <span className="font-mono text-xs text-subtle">
              {activeStep + 1} / {evaluation.steps.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveStep(Math.min(evaluation.steps.length - 1, activeStep + 1))}
              disabled={activeStep >= evaluation.steps.length - 1}
              className="rounded-md border border-line-strong px-2.5 py-1.5 text-[13px] text-foreground disabled:opacity-40"
            >
              Next step
            </button>
          </div>
        ) : null}
        {view !== "devsecops" ? (
          <div className="ml-auto flex rounded-md border border-line-strong p-0.5" role="group" aria-label="Canvas dimension">
            {(["2d", "3d"] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={dimension === d}
                disabled={d === "3d" && !webgl}
                title={d === "3d" && !webgl ? "3D needs WebGL, which this browser does not provide" : d === "3d" ? "Layered 3D view of the same architecture" : "Editable 2D canvas"}
                onClick={() => setDimension(d)}
                className={cn(
                  "rounded px-2.5 py-1.5 font-mono text-[12px] uppercase transition-colors disabled:opacity-40",
                  dimension === d ? "bg-raised text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => {
            reset();
            setSelected(null);
            setNotice(null);
            if (dimension === "2d") void flow.fitView({ padding: 0.12, maxZoom: 1 });
          }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-line-strong px-2.5 py-1.5 text-[13px] text-muted hover:text-foreground",
            view === "devsecops" && "ml-auto",
          )}
        >
          <RotateCcw className="size-3.5" />
          Reset
        </button>

      </div>

      {view === "devsecops" ? (
        <div className="min-h-[420px]">
          <PipelineView />
        </div>
      ) : (
      <div className="grid h-[640px] grid-cols-[9rem_1fr_20rem]">
        {/* Palette */}
        <div className="overflow-y-auto border-r border-line p-3">
          {dimension === "3d" ? (
            <p className="text-[12.5px] leading-relaxed text-muted">
              The 3D view stacks components by zone, from the internet up to data. Drag to orbit, scroll to zoom, click a component to inspect it.
              <button type="button" onClick={() => setDimension("2d")} className="mt-2 block text-accent hover:text-accent-bright">
                Switch to 2D to edit
              </button>
            </p>
          ) : (
          <>
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">Components</p>
          <ul className="flex flex-col gap-1">
            {PALETTE_ORDER.map((kind) => (
              <li key={kind}>
                <button
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData(DRAG_TYPE, kind);
                    event.dataTransfer.effectAllowed = "copy";
                  }}
                  onClick={() => addToCentre(kind)}
                  title={`Drag onto the canvas, or click to add ${CATALOGUE[kind].label}`}
                  className="w-full cursor-grab rounded-md border border-line px-2.5 py-1.5 text-left text-[12.5px] text-foreground hover:border-line-strong active:cursor-grabbing"
                >
                  {CATALOGUE[kind].label}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11.5px] leading-relaxed text-subtle">
            Drag or click to add. Connect by dragging from a component&apos;s right edge to another&apos;s left edge. Delete removes the selection.
          </p>
          </>
          )}
        </div>

        {/* Canvas */}
        <div
          ref={wrapper}
          className="relative"
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes(DRAG_TYPE)) {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
            }
          }}
          onDrop={(event) => {
            const kind = event.dataTransfer.getData(DRAG_TYPE) as ComponentKind;
            if (kind && kind in CATALOGUE) {
              event.preventDefault();
              placeAt(kind, event.clientX, event.clientY);
            }
          }}
        >
          {dimension === "3d" ? (
            <Scene3D
              graph={graph}
              evaluation={evaluation}
              showThreat={showThreat}
              selected={selected}
              onSelect={setSelected}
              reducedMotion={reducedMotion}
            />
          ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            isValidConnection={isValidConnection}
            onPaneClick={() => setSelected(null)}
            fitView
            fitViewOptions={{ padding: 0.12, maxZoom: 1 }}
            minZoom={0.4}
            maxZoom={1.6}
            colorMode="dark"
            proOptions={{ hideAttribution: false }}
            deleteKeyCode={["Backspace", "Delete"]}
            aria-label="Threatscape architecture canvas"
          >
            <Background variant={BackgroundVariant.Lines} gap={28} color="#141a24" />
            <Controls showInteractive={false} />
          </ReactFlow>
          )}
          {notice ? (
            <p role="status" className="absolute bottom-3 left-3 rounded-md border border-warn/40 bg-surface px-3 py-1.5 text-xs text-warn">
              {notice}
            </p>
          ) : null}
          <div className="pointer-events-none absolute top-3 left-3 flex gap-3 font-mono text-[10.5px] text-subtle">
            <span className="flex items-center gap-1.5">
              <span className="h-px w-5 bg-[#3a475b]" /> request flow
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-px w-5 border-t border-dashed border-[#3a4a60]" /> observes / hosts
            </span>
            {showThreat ? (
              <span className="flex items-center gap-1.5 text-threat">
                <span className="h-px w-5 bg-threat" /> attack path
              </span>
            ) : null}
          </div>
        </div>

        {/* Inspector */}
        <div role="region" className="overflow-y-auto border-l border-line p-4" aria-label="Inspector">
          {selectedNode ? (
            <div className="flex flex-col gap-5">
              <ExplainerPanel kind={selectedNode.kind} />
              <div className="flex flex-col gap-2 border-t border-line pt-4">
                <label className="text-[12.5px] text-muted">
                  Connect to
                  <select
                    className="mt-1 w-full rounded-md border border-line-strong bg-surface px-2 py-1.5 text-[13px] text-foreground"
                    value=""
                    onChange={(event) => {
                      if (event.target.value) setGraph((g) => connect(g, selectedNode.id, event.target.value));
                    }}
                    disabled={connectOptions.length === 0}
                  >
                    <option value="">{connectOptions.length ? "Choose a component…" : "No compatible components"}</option>
                    {connectOptions.map((other) => (
                      <option key={other.id} value={other.id}>
                        {CATALOGUE[other.kind].label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setGraph((g) => removeNode(g, selectedNode.id));
                    setSelected(null);
                  }}
                  className="inline-flex items-center gap-1.5 self-start rounded-md border border-line-strong px-2.5 py-1.5 text-[12.5px] text-muted hover:text-foreground"
                >
                  <Trash2 className="size-3.5" />
                  Remove component
                </button>
                {showThreat ? (
                  <button type="button" onClick={() => setSelected(null)} className="self-start text-[12.5px] text-accent hover:text-accent-bright">
                    Back to the scenario
                  </button>
                ) : null}
              </div>
            </div>
          ) : view === "infrastructure" ? (
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted">
              <h3 className="font-display text-xl font-medium text-foreground">Start here</h3>
              <p>Select any component to read what it is, why it matters and how it fails.</p>
              <p>Change the architecture: add a CDN, remove the WAF, or connect the browser straight to the web app. The attack path follows whatever you build.</p>
              <p>
                Then open <button type="button" className="text-accent hover:text-accent-bright" onClick={() => setView("threat")}>Threat</button> to
                walk an attack, and{" "}
                <button type="button" className="text-accent hover:text-accent-bright" onClick={() => setView("defence")}>Defence</button> to apply
                controls.
              </p>
            </div>
          ) : view === "threat" ? (
            <ScenarioPanel scenario={scenario} evaluation={evaluation} activeStep={activeStep} onStep={setActiveStep} />
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-display text-xl font-medium text-foreground">Defend: {scenario.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Turn controls on and watch the path. A control only works if its component is on the path.
                </p>
              </div>
              <OutcomeBadge outcome={evaluation.outcome} />
              <ControlsPanel scenario={scenario} applied={applied} inactive={evaluation.inactive} onToggle={toggleControl} />
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

/** Desktop Threatscape: palette, canvas and inspector. Loaded lazily. */
export default function Workbench() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}

