import { useLayoutEffect, useRef } from "react";

import { BOX_CLASS, LIST_CLASS, StreamLines } from "./stream-lines";
import type { Frame } from "./workflow-engine";

/**
 * The visible stream. Lines are top-anchored; when they overflow (small
 * screens), the list scrolls up with a transform, so new lines glide in and
 * nothing counts as a layout shift.
 */
export function CodeStream({ frame, still }: { frame: Frame; still?: Set<string> }) {
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const shownIndex = useRef(frame.index);

  useLayoutEffect(() => {
    const outer = box.current;
    const inner = list.current;
    if (!outer || !inner) return;
    const reset = shownIndex.current !== frame.index;
    shownIndex.current = frame.index;
    const overflow = Math.max(0, inner.scrollHeight - outer.clientHeight);
    inner.style.transition = reset ? "none" : "transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)";
    inner.style.transform = `translateY(${-overflow}px)`;
  });

  return (
    <div ref={box} className={BOX_CLASS} style={{ opacity: 1 - frame.leave, transform: `translateY(${-14 * frame.leave}px)` }}>
      <div ref={list} className={LIST_CLASS}>
        <StreamLines frame={frame} still={still} />
      </div>
    </div>
  );
}
