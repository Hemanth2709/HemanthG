"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { Reveal } from "@/components/effects/reveal";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { agentPipeline, aiCapabilities, aiIntro } from "@/data/ai";

export function AISection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="ai" className="relative scroll-mt-24 overflow-hidden py-28 md:py-40" aria-label="AI and automation">
      {/* Ambient tint distinguishing the AI section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,147,255,0.06), transparent 70%)",
        }}
      />

      <div className="container-site relative">
        <SectionHeading eyebrow="AI & Automation" title={aiIntro.headline} description={aiIntro.description} />

        {/* Animated agent pipeline */}
        <Reveal className="mb-16">
          <div className="overflow-x-auto rounded-3xl border border-line bg-surface p-8 md:p-10">
            <p className="eyebrow mb-8 text-center">How my agent systems run</p>
            <div className="flex min-w-max items-center justify-center gap-2 md:gap-4">
              {agentPipeline.map((node, index) => (
                <div key={node.id} className="flex items-center gap-2 md:gap-4">
                  <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="flex min-w-24 flex-col items-center gap-1 rounded-2xl border border-line bg-background px-4 py-3.5 transition-colors duration-300 hover:border-accent/50 md:min-w-32 md:px-6 md:py-5"
                  >
                    <span className="text-sm font-semibold text-foreground md:text-base">{node.label}</span>
                    <span className="font-mono text-[0.6rem] text-subtle md:text-xs">{node.sublabel}</span>
                  </motion.div>
                  {index < agentPipeline.length - 1 && (
                    <motion.span
                      initial={reduceMotion ? undefined : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.3 }}
                    >
                      <ChevronRight className="size-4 animate-pulse-line text-accent" aria-hidden />
                    </motion.span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Capability cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiCapabilities.map((capability, index) => (
            <Reveal key={capability.title} delay={(index % 3) * 0.08}>
              <div className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-accent-dim text-accent">
                  <Icon name={capability.icon} className="size-5" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{capability.title}</h3>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-muted">{capability.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {capability.signals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[0.65rem] text-subtle transition-colors group-hover:text-muted"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
