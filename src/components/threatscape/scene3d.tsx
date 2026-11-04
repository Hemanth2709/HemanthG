"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

import { CATALOGUE } from "@/lib/threatscape/catalogue";
import { isFlowEdge } from "@/lib/threatscape/engine";
import type { Effect, Evaluation, Graph, Zone } from "@/lib/threatscape/types";

/** Elevation per zone: requests climb from the internet up to data. */
const LEVEL: Record<Zone, number> = { internet: 0, edge: 1, app: 2, data: 3, platform: 1.5 };
const LEVEL_GAP = 0.9;
const SCALE = 1 / 70;

const COLOUR = {
  node: 0x1a2230,
  nodeEdge: 0x3a475b,
  threat: 0xe8875f,
  defence: 0x65a9ff,
  flow: 0x3a475b,
  observe: 0x2b3647,
  plane: 0x65a9ff,
};

interface Props {
  graph: Graph;
  evaluation: Evaluation;
  showThreat: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
  reducedMotion: boolean;
}

function strongest(effects: { effect: Effect }[]): Effect | undefined {
  const order: Effect[] = ["blocks", "reduces", "detects"];
  return order.find((effect) => effects.some((item) => item.effect === effect));
}

/**
 * Layered 3D view of the same graph the 2D editor edits. Read-only for
 * structure (editing stays in 2D, where it is precise and accessible);
 * selection is shared with the inspector.
 */
export default function Scene3D({ graph, evaluation, showThreat, selected, onSelect, reducedMotion }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const state = useRef<{
    renderer: THREE.WebGLRenderer;
    labels: CSS2DRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    content: THREE.Group;
    pickables: THREE.Mesh[];
    pulses: { mesh: THREE.Mesh; curve: THREE.LineCurve3; offset: number }[];
    frame: number;
    visible: boolean;
  } | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // One-time setup: renderer, camera, lights, controls, loop.
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const width = host.clientWidth;
    const height = host.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    host.appendChild(renderer.domElement);

    const labels = new CSS2DRenderer();
    labels.setSize(width, height);
    labels.domElement.style.position = "absolute";
    labels.domElement.style.inset = "0";
    labels.domElement.style.pointerEvents = "none";
    host.appendChild(labels.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 200);
    camera.position.set(-6, 9, 15);

    scene.add(new THREE.HemisphereLight(0xc3ccd8, 0x090b10, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(5, 12, 8);
    scene.add(key);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !reducedMotion;
    controls.minDistance = 8;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI * 0.47;

    const content = new THREE.Group();
    scene.add(content);

    const s = {
      renderer,
      labels,
      scene,
      camera,
      controls,
      content,
      pickables: [] as THREE.Mesh[],
      pulses: [] as { mesh: THREE.Mesh; curve: THREE.LineCurve3; offset: number }[],
      frame: 0,
      visible: true,
    };
    state.current = s;

    const clock = new THREE.Clock();
    const tick = () => {
      s.frame = requestAnimationFrame(tick);
      if (!s.visible || document.hidden) return;
      if (!reducedMotion) {
        const t = clock.getElapsedTime();
        for (const pulse of s.pulses) pulse.mesh.position.copy(pulse.curve.getPoint((t * 0.45 + pulse.offset) % 1));
      }
      controls.update();
      renderer.render(scene, camera);
      labels.render(scene, camera);
    };
    tick();

    const resize = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labels.setSize(w, h);
    });
    resize.observe(host);

    const io = new IntersectionObserver(([entry]) => {
      s.visible = Boolean(entry?.isIntersecting);
    });
    io.observe(host);

    // Click to select (ignore drags used to orbit).
    const raycaster = new THREE.Raycaster();
    let down = { x: 0, y: 0 };
    const onDown = (event: PointerEvent) => (down = { x: event.clientX, y: event.clientY });
    const onUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 4) return;
      const box = renderer.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(s.pickables, false)[0];
      onSelectRef.current((hit?.object.userData.id as string | undefined) ?? null);
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(s.frame);
      resize.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      controls.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      renderer.dispose();
      host.replaceChildren();
      state.current = null;
    };
  }, [reducedMotion]);

  // Rebuild the (small) scene content whenever the graph or evaluation changes.
  useEffect(() => {
    const s = state.current;
    if (!s) return;
    for (const child of [...s.content.children]) {
      child.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | undefined;
        material?.dispose?.();
        if (object instanceof CSS2DObject) object.element.remove();
      });
      s.content.remove(child);
    }
    s.pickables = [];
    s.pulses = [];

    const xs = graph.nodes.map((n) => n.x);
    const ys = graph.nodes.map((n) => n.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2 + 72;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2 + 28;
    const position = new Map(
      graph.nodes.map((n) => [n.id, new THREE.Vector3((n.x + 72 - cx) * SCALE, LEVEL[CATALOGUE[n.kind].zone] * LEVEL_GAP, (n.y + 28 - cy) * SCALE)]),
    );

    // Faint zone planes, one per elevation in use.
    const used = [...new Set(graph.nodes.map((n) => CATALOGUE[n.kind].zone))];
    for (const zone of used) {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 8),
        new THREE.MeshBasicMaterial({ color: COLOUR.plane, transparent: true, opacity: 0.025, side: THREE.DoubleSide, depthWrite: false }),
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = LEVEL[zone] * LEVEL_GAP - 0.18;
      s.content.add(plane);
      const grid = new THREE.GridHelper(16, 16, 0x1c2330, 0x141a24);
      grid.position.y = plane.position.y - 0.001;
      (grid.material as THREE.Material).transparent = true;
      (grid.material as THREE.Material).opacity = 0.35;
      s.content.add(grid);
    }

    const pathIndex = new Map((evaluation.path ?? []).map((id, i) => [id, i]));
    for (const node of graph.nodes) {
      const at = position.get(node.id)!;
      const index = pathIndex.get(node.id);
      const step = index !== undefined ? evaluation.steps[index] : undefined;
      const effect = step ? strongest(step.effects) : undefined;
      const onPath = showThreat && index !== undefined && !step?.unreached;
      const colour = onPath ? (effect === "blocks" ? COLOUR.defence : COLOUR.threat) : COLOUR.nodeEdge;

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.28, 0.8),
        new THREE.MeshStandardMaterial({
          color: COLOUR.node,
          roughness: 0.55,
          metalness: 0.35,
          emissive: onPath ? colour : 0x000000,
          emissiveIntensity: onPath ? 0.22 : 0,
          transparent: showThreat && step?.unreached,
          opacity: showThreat && step?.unreached ? 0.4 : 1,
        }),
      );
      body.position.copy(at);
      body.userData.id = node.id;
      s.pickables.push(body);
      s.content.add(body);

      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(body.geometry),
        new THREE.LineBasicMaterial({ color: node.id === selected ? 0xf1f5f9 : colour }),
      );
      outline.position.copy(at);
      s.content.add(outline);

      const tag = document.createElement("div");
      tag.className = "ts3d-label";
      tag.textContent = CATALOGUE[node.kind].label + (onPath ? ` · ${String(index! + 1).padStart(2, "0")}` : "");
      tag.style.cssText = `font: 500 11px var(--font-inter), system-ui; color: ${onPath ? "#f1f5f9" : "#94a3b8"}; padding: 2px 6px; border-radius: 4px; background: rgba(9,11,16,0.72); white-space: nowrap;`;
      const label = new CSS2DObject(tag);
      label.position.set(at.x, at.y + 0.42, at.z);
      s.content.add(label);
    }

    const pathPairs = new Set<string>();
    const path = evaluation.path ?? [];
    for (let i = 0; i < path.length - 1; i += 1) pathPairs.add(`${path[i]}>${path[i + 1]}`);

    for (const edge of graph.edges) {
      const a = position.get(edge.source);
      const b = position.get(edge.target);
      if (!a || !b) continue;
      const onPath = showThreat && pathPairs.has(`${edge.source}>${edge.target}`);
      const flow = isFlowEdge(graph, edge);
      const points = [a.clone().add(new THREE.Vector3(0.75, 0, 0)), b.clone().add(new THREE.Vector3(-0.75, 0, 0))];
      const material = flow
        ? new THREE.LineBasicMaterial({ color: onPath ? COLOUR.threat : COLOUR.flow })
        : new THREE.LineDashedMaterial({ color: COLOUR.observe, dashSize: 0.12, gapSize: 0.12 });
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
      if (!flow) line.computeLineDistances();
      s.content.add(line);

      if (onPath && !reducedMotion) {
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: COLOUR.threat }));
        pulse.position.copy(points[0]!);
        s.content.add(pulse);
        s.pulses.push({ mesh: pulse, curve: new THREE.LineCurve3(points[0]!, points[1]!), offset: s.pulses.length * 0.2 });
      }
    }
  }, [graph, evaluation, showThreat, selected, reducedMotion]);

  return (
    <div
      ref={mount}
      className="relative h-full w-full"
      role="img"
      aria-label="3D view of the architecture. Components are stacked by zone, from the internet up to data; the attack path is highlighted. Use the 2D view to edit."
    />
  );
}
