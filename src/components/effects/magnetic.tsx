"use client";

import * as React from "react";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** How strongly the element follows the cursor (0–1). */
  strength?: number;
}

/**
 * Wraps interactive elements so they gently gravitate toward the cursor.
 * Zero animation-library cost: pointer events are passively bound and
 * rAF-throttled; a CSS transition on transform does the easing.
 */
export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    // Rect is measured once on enter — pointermove frames only write
    // transforms, so the hot path never forces layout.
    let rect: DOMRect | null = null;
    const enter = () => {
      rect = node.getBoundingClientRect();
    };
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!rect) rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * strength;
        const y = (event.clientY - rect.top - rect.height / 2) * strength;
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      rect = null;
      node.style.transform = "translate3d(0, 0, 0)";
    };

    node.addEventListener("pointerenter", enter, { passive: true });
    node.addEventListener("pointermove", move, { passive: true });
    node.addEventListener("pointerleave", reset, { passive: true });
    return () => {
      node.removeEventListener("pointerenter", enter);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
