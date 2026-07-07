import { site } from "@/data/site";

/**
 * Branded intro overlay, 100% CSS: the monogram scales in, then the
 * whole layer fades and removes itself (visibility: hidden) via the
 * `intro-out` keyframe — no JavaScript, no hydration dependency, and
 * `prefers-reduced-motion` collapses it instantly via the global rule.
 */
export function LoadingScreen() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-background"
      style={{ animation: "intro-out 0.5s ease-in-out 0.9s forwards" }}
    >
      <span
        className="font-mono text-sm tracking-[0.4em] text-muted"
        style={{ animation: "intro-mark 0.6s var(--ease-out-expo) both" }}
      >
        {site.initials}
      </span>
    </div>
  );
}
