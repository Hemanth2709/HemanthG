import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Kept for call-site compatibility; scroll-driven animations have no delay. */
  delay?: number;
  as?: "div" | "li";
}

/**
 * Scroll reveal with no JavaScript: a CSS scroll-driven animation
 * (`animation-timeline: view()`) in browsers that support it, under
 * `prefers-reduced-motion: no-preference` only. Everywhere else, and without
 * JavaScript, content is simply visible. Server component: nothing to
 * hydrate (see .reveal in globals.css).
 */
export function Reveal({ children, className, as = "div" }: RevealProps) {
  const Tag = as;
  return <Tag className={cn("reveal", className)}>{children}</Tag>;
}
