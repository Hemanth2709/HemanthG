"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Workbench = dynamic(() => import("./workbench"), { ssr: false, loading: () => <Placeholder /> });
const Stepper = dynamic(() => import("./stepper"), { ssr: false, loading: () => <Placeholder /> });

function Placeholder() {
  return (
    <div className="flex h-[704px] items-center justify-center rounded-xl border border-line-strong bg-background max-lg:h-[520px]">
      <p className="font-mono text-xs text-subtle">Loading Threatscape…</p>
    </div>
  );
}

/**
 * Loads the interactive part only when the section approaches the
 * viewport: the canvas on wide screens with a fine pointer, the stepper
 * everywhere else. Nothing is fetched before that.
 */
export function ThreatscapeLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "workbench" | "stepper">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const wide = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
        setMode(wide ? "workbench" : "stepper");
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {mode === "workbench" ? <Workbench /> : mode === "stepper" ? <Stepper /> : <Placeholder />}
    </div>
  );
}
