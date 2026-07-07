"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { site } from "@/data/site";

/**
 * A brief branded intro that fades out once the page is interactive.
 * Kept intentionally short (~900ms) so it feels premium, not slow.
 */
export function LoadingScreen() {
  const [done, setDone] = React.useState(false);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (reduceMotion) {
      setDone(true);
      return;
    }
    const timer = window.setTimeout(() => setDone(true), 900);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          aria-hidden
        >
          <motion.span
            className="font-mono text-sm tracking-[0.4em] text-muted"
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {site.initials}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
