"use client";

import * as React from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Distance travelled during the reveal, in px. */
  y?: number;
}

/**
 * Scroll-triggered reveal with no animation library: one shared
 * IntersectionObserver flips `data-inview`, and a CSS transition on
 * transform/opacity (compositor-only) does the animation. Descendants
 * can also key off `[data-inview]` for their own effects (see the
 * SVG draw styles in globals.css).
 */

type ObserverEntry = { observer: IntersectionObserver; callbacks: Map<Element, () => void> };
let shared: ObserverEntry | null = null;

function observe(element: Element, onVisible: () => void): () => void {
  if (!shared) {
    const callbacks = new Map<Element, () => void>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            callbacks.get(entry.target)?.();
            observer.unobserve(entry.target);
            callbacks.delete(entry.target);
          }
        }
      },
      { rootMargin: "-60px 0px" },
    );
    shared = { observer, callbacks };
  }
  shared.callbacks.set(element, onVisible);
  shared.observer.observe(element);
  return () => {
    shared?.callbacks.delete(element);
    shared?.observer.unobserve(element);
  };
}

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    return observe(node, () => setInView(true));
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-inview={inView || undefined}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s var(--ease-out-expo) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
