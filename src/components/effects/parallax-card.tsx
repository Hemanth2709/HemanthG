"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Hover parallax for cards, built for a clean performance profile:
 *
 * - JS only writes two CSS custom properties (--mx/--my, normalized
 *   pointer position); all visual work (3D tilt + glare) is CSS in
 *   `.parallax-card`, running on the compositor.
 * - The pointermove listener is passively bound and rAF-throttled, so
 *   it can never block scrolling or stack layout work per event.
 * - An IntersectionObserver attaches listeners only while the card is
 *   on screen and removes them when it leaves the viewport.
 * - Coarse pointers and prefers-reduced-motion opt out entirely (the
 *   listeners are never bound, and the CSS transform is disabled).
 */
export function ParallaxCard({ children, className }: ParallaxCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    let latest: PointerEvent | null = null;
    // Measured once per hover on pointerenter — the per-frame path only
    // writes CSS variables and never forces layout.
    let rect: DOMRect | null = null;

    const render = () => {
      raf = 0;
      if (!latest || !rect) return;
      const mx = (latest.clientX - rect.left) / rect.width - 0.5;
      const my = (latest.clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty("--mx", mx.toFixed(3));
      node.style.setProperty("--my", my.toFixed(3));
      node.style.setProperty("--m-active", "1");
    };

    const enter = () => {
      rect = node.getBoundingClientRect();
    };

    const move = (event: PointerEvent) => {
      latest = event;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const leave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      latest = null;
      rect = null;
      node.style.setProperty("--mx", "0");
      node.style.setProperty("--my", "0");
      node.style.setProperty("--m-active", "0");
    };

    const bind = () => {
      node.addEventListener("pointerenter", enter, { passive: true });
      node.addEventListener("pointermove", move, { passive: true });
      node.addEventListener("pointerleave", leave, { passive: true });
    };
    const unbind = () => {
      node.removeEventListener("pointerenter", enter);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
      leave();
    };

    // Only pay for listeners while the card is actually visible.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) bind();
      else unbind();
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      unbind();
    };
  }, []);

  return (
    <div ref={ref} className={cn("parallax-card relative", className)}>
      {children}
      <span className="parallax-glare" aria-hidden />
    </div>
  );
}
