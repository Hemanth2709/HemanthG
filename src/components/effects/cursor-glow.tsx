"use client";

import * as React from "react";

/**
 * A soft radial glow that trails the pointer. Renders only on devices
 * with a fine pointer (desktop) and respects reduced-motion.
 */
export function CursorGlow() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;
    setEnabled(true);

    let raf = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ref.current?.style.setProperty(
          "transform",
          `translate3d(${event.clientX - 260}px, ${event.clientY - 260}px, 0)`,
        );
      });
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 size-[520px] rounded-full opacity-60 will-change-transform"
      style={{
        background:
          "radial-gradient(circle, rgba(139,147,255,0.07) 0%, rgba(110,231,249,0.03) 40%, transparent 70%)",
      }}
    />
  );
}
