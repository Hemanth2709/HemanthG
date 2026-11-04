"use client";

import { useEffect, useRef, useState } from "react";

import type { Workflow } from "./workflow-engine";

type AnimationModule = typeof import("./security-animation");

/**
 * Loads the live animation only when it is worth it: after the page has
 * loaded and the main thread is idle, while the stage is on screen, and
 * never under reduced motion. Until then (and in those cases, for good) the
 * static first frame rendered next to this stays visible.
 */
export function SessionActivator({ workflows }: { workflows: Workflow[] }) {
  const anchor = useRef<HTMLDivElement>(null);
  const [mod, setMod] = useState<AnimationModule | null>(null);

  useEffect(() => {
    const el = anchor.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let idle: number | ReturnType<typeof setTimeout> = 0;
    let loaded = document.readyState === "complete";
    let visible = false;

    const load = () => {
      if (!loaded || !visible || cancelled) return;
      cancelled = true;
      io.disconnect();
      const go = () => void import("./security-animation").then(setMod);
      idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 1200);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      load();
    });
    io.observe(el.parentElement ?? el);
    const onLoad = () => {
      loaded = true;
      load();
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    return () => {
      cancelled = true;
      io.disconnect();
      window.removeEventListener("load", onLoad);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle as number);
      clearTimeout(idle);
    };
  }, []);

  // Hide the static frame once the live one (identical first frame) is mounted.
  useEffect(() => {
    const placeholder = anchor.current?.previousElementSibling as HTMLElement | null;
    if (mod && placeholder) placeholder.style.visibility = "hidden";
  }, [mod]);

  return <div ref={anchor} className="absolute inset-0">{mod ? <mod.SecurityAnimation workflows={workflows} /> : null}</div>;
}
