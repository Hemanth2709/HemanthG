"use client";

import * as React from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Distance travelled during the reveal, in px. */
  y?: number;
  as?: "div" | "li";
}

/**
 * Scroll-triggered reveal with no animation library: one shared
 * IntersectionObserver flips `data-inview`, and a CSS transition on
 * transform/opacity does the work. Content is visible immediately when
 * the user prefers reduced motion.
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
      { rootMargin: "0px 0px -8% 0px" },
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

export function Reveal({ children, className, delay = 0, y = 16, as = "div" }: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
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

  const Tag = as;
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      data-reveal
      data-inview={inView || undefined}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s var(--ease-out-expo) ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}
