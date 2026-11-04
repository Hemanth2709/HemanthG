/**
 * Ambient layer behind the hero: lighting, a faint grid, a network
 * topology with data-flow trails, and slow particles. Pure SVG and CSS,
 * server-rendered, decorative (aria-hidden). Every moving part carries
 * `hero-anim`, which pauses when the hero is off-screen (`data-paused`)
 * and is off under reduced motion.
 */

const NODES = [
  { x: 90, y: 120 },
  { x: 250, y: 70 },
  { x: 420, y: 150 },
  { x: 560, y: 90 },
  { x: 180, y: 300 },
  { x: 360, y: 340 },
  { x: 540, y: 300 },
  { x: 120, y: 500 },
  { x: 300, y: 540 },
  { x: 480, y: 500 },
];

const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [1, 4],
  [2, 5],
  [4, 5],
  [5, 6],
  [3, 6],
  [4, 7],
  [5, 8],
  [7, 8],
  [8, 9],
  [6, 9],
];

/** Links that carry a travelling trail, with their timing. */
const TRAILS: { link: number; dur: number; delay: number }[] = [
  { link: 1, dur: 5.5, delay: 0 },
  { link: 5, dur: 6.5, delay: 1.2 },
  { link: 7, dur: 6, delay: 2.4 },
  { link: 10, dur: 7, delay: 0.6 },
  { link: 13, dur: 5, delay: 3.1 },
];

const PARTICLES = [
  [8, 22, 0],
  [18, 64, 2.1],
  [27, 38, 4.3],
  [36, 80, 1.2],
  [44, 14, 3.4],
  [52, 52, 5.6],
  [61, 30, 0.8],
  [69, 72, 2.9],
  [77, 44, 4.9],
  [85, 18, 1.7],
  [92, 60, 3.8],
  [58, 88, 5.1],
] as const;

export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Lighting: blue key from the upper right, violet fill lower right. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 55% at 78% 18%, rgba(56,189,248,0.09), transparent 70%), radial-gradient(ellipse 40% 50% at 88% 82%, rgba(139,92,246,0.08), transparent 70%), radial-gradient(ellipse 60% 70% at 70% 50%, rgba(37,99,235,0.05), transparent 75%)",
        }}
      />

      {/* Faint grid, visible only on the right. */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 50% 65% at 75% 45%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 50% 65% at 75% 45%, black, transparent 75%)",
        }}
      />

      {/* Network topology behind the stream (large screens). */}
      <svg
        viewBox="0 0 640 620"
        preserveAspectRatio="xMidYMid slice"
        className="absolute top-0 right-0 hidden h-[min(100svh,58rem)] min-h-[44rem] w-[52%] opacity-60 lg:block"
        style={{
          maskImage: "radial-gradient(ellipse 60% 55% at 60% 50%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 60% 50%, black 30%, transparent 75%)",
        }}
      >
        <defs>
          <radialGradient id="hero-node-glow">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-trail" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {LINKS.map(([a, b], i) => (
          <line
            key={`l${i}`}
            x1={NODES[a]!.x}
            y1={NODES[a]!.y}
            x2={NODES[b]!.x}
            y2={NODES[b]!.y}
            stroke="rgba(148,163,184,0.12)"
            strokeWidth="1"
          />
        ))}
        {TRAILS.map(({ link, dur, delay }) => {
          const [a, b] = LINKS[link]!;
          return (
            <line
              key={`t${link}`}
              className="hero-anim hero-trail"
              x1={NODES[a]!.x}
              y1={NODES[a]!.y}
              x2={NODES[b]!.x}
              y2={NODES[b]!.y}
              stroke="#38bdf8"
              strokeOpacity="0.7"
              strokeWidth="1.25"
              strokeLinecap="round"
              pathLength={100}
              style={{ "--dur": `${dur}s`, "--delay": `${delay}s` } as React.CSSProperties}
            />
          );
        })}
        {NODES.map((node, i) => (
          <g key={`n${i}`}>
            <circle
              className="hero-anim hero-breathe"
              cx={node.x}
              cy={node.y}
              r="14"
              fill="url(#hero-node-glow)"
              style={{ "--delay": `${(i % 5) * 0.8}s` } as React.CSSProperties}
            />
            <circle cx={node.x} cy={node.y} r="2.2" fill={i % 4 === 2 ? "#8b5cf6" : "#38bdf8"} />
          </g>
        ))}
      </svg>

      {/* Slow particles. */}
      {PARTICLES.map(([left, top, delay]) => (
        <span
          key={`${left}-${top}`}
          className="hero-anim hero-drift absolute hidden size-[3px] rounded-full bg-cyan/50 md:block"
          style={{ left: `${48 + left / 2}%`, top: `${top * 0.7}%`, "--delay": `${delay}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
