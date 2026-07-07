"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";

import { Aurora } from "@/components/effects/aurora";
import { Magnetic } from "@/components/effects/magnetic";
import { site } from "@/data/site";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.6 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden" aria-label="Introduction">
      <Aurora />

      <motion.div
        className="container-site relative z-10 py-32"
        variants={container}
        initial={reduceMotion ? "visible" : "hidden"}
        animate="visible"
      >
        <motion.p variants={item} className="eyebrow mb-6">
          {site.name} · {site.title}
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-7xl"
        >
          I turn ambitious ideas into{" "}
          <em className="font-serif font-normal not-italic [font-style:italic] text-gradient">
            intelligent
          </em>
          , production-grade products.
        </motion.h1>

        <motion.p variants={item} className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted">
          {site.intro}
        </motion.p>

        <motion.div variants={item} className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic>
            <a
              href="#work"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-base font-medium text-background transition-all duration-300 hover:bg-accent-bright hover:shadow-[0_0_40px_rgba(139,147,255,0.4)]"
            >
              Explore my work
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-line-strong px-7 text-base text-foreground transition-all duration-300 hover:border-accent/60 hover:bg-accent-dim"
            >
              Start a conversation
            </a>
          </Magnetic>
        </motion.div>

        <motion.div variants={item} className="mt-20 flex items-center gap-3 text-sm text-subtle">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          Open to interesting product collaborations · {site.location}
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-subtle transition-colors hover:text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <ArrowDown className="size-5 animate-float" />
      </motion.a>
    </section>
  );
}
