"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { CodeStream } from "./code-stream";
import { STAGE_CLASS } from "./stream-lines";
import { SessionFooter, SessionHeader } from "./security-indicators";
import { compile, frameAt, restingTime, signature, type Workflow } from "./workflow-engine";

/**
 * The hero's simulated security session. One clock drives everything:
 * each animation frame computes `frameAt(timeline, clock)` and React
 * re-renders only when the visible state changed (a typed character, a new
 * line, a check resolving, a few percent of progress).
 *
 * - Loaded by SessionActivator after the page is idle; it starts from the
 *   same finished first frame that StaticSession server-rendered, so the
 *   swap is invisible and causes no layout shift.
 * - Reduced motion: snaps back to that frame and stops.
 * - The clock stops whenever the stage is off-screen or the tab is hidden;
 *   the section then gets `data-paused` so the CSS decorations pause too.
 */
export function SecurityAnimation({ workflows }: { workflows: Workflow[] }) {
  const timeline = useMemo(() => compile(workflows), [workflows]);
  const rest = restingTime(timeline);
  const [frame, setFrame] = useState(() => frameAt(timeline, rest));
  const titles = useMemo(() => workflows.map((w) => w.title), [workflows]);

  const stage = useRef<HTMLDivElement>(null);
  // Lines of the first frame are already visible (server-rendered); don't fade them in again
  // until the loop has moved on to another workflow.
  const initialKeys = useMemo(() => new Set(frameAt(timeline, rest).lines.map((l) => l.key)), [timeline, rest]);
  const [cycled, setCycled] = useState(false);
  if (!cycled && frame.index !== 0) setCycled(true);

  useEffect(() => {
    const hero = document.getElementById("home");
    const target = stage.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    let clock = rest;
    let visible = true;
    let current = signature(frameAt(timeline, rest));

    const loop = (now: number) => {
      // Clamp the step so a long frame (tab switch, GC) never skips content.
      if (last) clock += Math.min(now - last, 100);
      last = now;
      const next = frameAt(timeline, clock);
      const sig = signature(next);
      if (sig !== current) {
        current = sig;
        setFrame(next);
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(loop);
      hero?.removeAttribute("data-paused");
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      hero?.setAttribute("data-paused", "");
    };
    const sync = () => (reduce.matches || !visible || document.hidden ? stop() : start());
    const onReduce = () => {
      if (reduce.matches) {
        clock = rest;
        current = signature(frameAt(timeline, rest));
        setFrame(frameAt(timeline, rest));
      }
      sync();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    });
    // Observe the stage itself: on small screens it sits below the panel,
    // so nothing animates until it is scrolled into view.
    if (target) io.observe(target);
    document.addEventListener("visibilitychange", sync);
    reduce.addEventListener("change", onReduce);

    sync();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduce.removeEventListener("change", onReduce);
    };
  }, [timeline, rest]);

  return (
    <div ref={stage} className={STAGE_CLASS}>
      <SessionHeader frame={frame} titles={titles} />
      <div className="relative min-h-0 flex-1">
        <CodeStream frame={frame} still={cycled ? undefined : initialKeys} />
      </div>
      <SessionFooter frame={frame} />
    </div>
  );
}
