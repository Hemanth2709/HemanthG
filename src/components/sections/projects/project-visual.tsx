"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ProjectVisualProps {
  name: string;
  category: string;
  hue: number;
}

/**
 * Generative hero visual: each project gets an abstract system diagram
 * tinted with its own hue — no image assets, crisp at any size.
 */
export function ProjectVisual({ name, category, hue }: ProjectVisualProps) {
  const reduceMotion = useReducedMotion();
  const accent = `hsl(${hue} 85% 72%)`;
  const accentSoft = `hsla(${hue}, 85%, 65%, 0.14)`;

  const nodes = [
    { cx: 60, cy: 150, r: 7 },
    { cx: 170, cy: 70, r: 9 },
    { cx: 200, cy: 210, r: 6 },
    { cx: 320, cy: 130, r: 11 },
    { cx: 430, cy: 60, r: 7 },
    { cx: 450, cy: 220, r: 8 },
  ];
  const edges: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
  ];

  return (
    <div
      className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface"
      style={{
        backgroundImage: `radial-gradient(ellipse 80% 70% at 30% 20%, ${accentSoft}, transparent 60%)`,
      }}
    >
      <div className="absolute inset-0 grid-lines opacity-60" />

      <svg
        viewBox="0 0 520 280"
        className="absolute inset-0 size-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        aria-hidden
      >
        {edges.map(([from, to], index) => {
          const a = nodes[from];
          const b = nodes[to];
          if (!a || !b) return null;
          return (
            <motion.line
              key={index}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              stroke={accent}
              strokeOpacity={0.35}
              strokeWidth={1.2}
              initial={reduceMotion ? undefined : { pathLength: 0 }}
              whileInView={reduceMotion ? undefined : { pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 + index * 0.12, ease: "easeOut" }}
            />
          );
        })}
        {nodes.map((node, index) => (
          <motion.circle
            key={index}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="#0d0e12"
            stroke={accent}
            strokeOpacity={0.8}
            strokeWidth={1.4}
            initial={reduceMotion ? undefined : { scale: 0, opacity: 0 }}
            whileInView={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em]" style={{ color: accent }}>
            {category}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{name}</p>
        </div>
        <div
          className="size-2.5 rounded-full animate-pulse-line"
          style={{ backgroundColor: accent, boxShadow: `0 0 16px ${accent}` }}
        />
      </div>
    </div>
  );
}
