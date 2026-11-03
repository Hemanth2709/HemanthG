/**
 * The site's visual signature: an abstract system map. Clients reach an
 * edge node at a trust boundary; inside it, identity, an API, services
 * and data. Short pulses travel along a few connections.
 *
 * Pure SVG + CSS (server-rendered, no JS). Pulses are hidden when the
 * user prefers reduced motion (see .net-pulse in globals.css).
 */

type Kind = "client" | "edge" | "auth" | "node" | "data";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  kind: Kind;
}

const nodes: Node[] = [
  { id: "web", x: 62, y: 150, label: "web", kind: "client" },
  { id: "mobile", x: 62, y: 262, label: "mobile", kind: "client" },
  { id: "partner", x: 62, y: 374, label: "partner", kind: "client" },
  { id: "edge", x: 214, y: 262, label: "edge", kind: "edge" },
  { id: "auth", x: 340, y: 150, label: "identity", kind: "auth" },
  { id: "api", x: 340, y: 300, label: "api", kind: "node" },
  { id: "svc1", x: 478, y: 222, label: "service", kind: "node" },
  { id: "svc2", x: 478, y: 342, label: "worker", kind: "node" },
  { id: "db", x: 410, y: 440, label: "data", kind: "data" },
];

const byId = Object.fromEntries(nodes.map((node) => [node.id, node])) as Record<string, Node>;

const links: [string, string][] = [
  ["web", "edge"],
  ["mobile", "edge"],
  ["partner", "edge"],
  ["edge", "auth"],
  ["edge", "api"],
  ["auth", "api"],
  ["api", "svc1"],
  ["api", "svc2"],
  ["auth", "svc1"],
  ["svc2", "db"],
  ["api", "db"],
];

/** Index into `links`, with timing, for the travelling pulses. */
const pulses = [
  { link: 0, dur: 5.5, delay: 0, tone: "accent" },
  { link: 1, dur: 6.5, delay: 1.8, tone: "accent" },
  { link: 3, dur: 5, delay: 0.8, tone: "violet" },
  { link: 4, dur: 6, delay: 2.6, tone: "accent" },
  { link: 6, dur: 7, delay: 1.2, tone: "accent" },
  { link: 9, dur: 6.5, delay: 3.4, tone: "accent" },
] as const;

function curve(a: Node, b: Node) {
  const dx = (b.x - a.x) / 2;
  if (Math.abs(b.x - a.x) < 40) {
    const dy = (b.y - a.y) / 2;
    return `M${a.x} ${a.y} C${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  return `M${a.x} ${a.y} C${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

const tone = {
  accent: "var(--color-accent)",
  violet: "var(--color-violet)",
};

export function HeroNetwork() {
  return (
    <svg
      viewBox="0 0 560 520"
      className="h-auto w-full"
      role="img"
      aria-label="Abstract diagram: clients connect through an edge node at a trust boundary to identity, API, service and data nodes."
    >
      <defs>
        <pattern id="net-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="#1a2130" strokeWidth="1" />
        </pattern>
        <radialGradient id="net-fade" cx="55%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="net-mask">
          <rect width="560" height="520" fill="url(#net-fade)" />
        </mask>
        <radialGradient id="net-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#65a9ff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#65a9ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Fine grid, faded towards the edges */}
      <rect width="560" height="520" fill="url(#net-grid)" mask="url(#net-mask)" />

      {/* Trust boundary */}
      <rect
        x="168"
        y="92"
        width="372"
        height="400"
        rx="20"
        fill="rgba(101,169,255,0.025)"
        stroke="#2b3647"
        strokeDasharray="4 6"
      />
      <text x="186" y="116" className="fill-subtle font-mono" fontSize="10" letterSpacing="1.5">
        TRUST BOUNDARY
      </text>

      {/* Connections */}
      <g fill="none" strokeWidth="1">
        {links.map(([from, to]) => (
          <path key={`${from}-${to}`} d={curve(byId[from]!, byId[to]!)} stroke="#2a3446" />
        ))}
      </g>

      {/* Travelling pulses */}
      <g fill="none" strokeWidth="1.6" strokeLinecap="round">
        {pulses.map((pulse) => {
          const [from, to] = links[pulse.link]!;
          return (
            <path
              key={`pulse-${pulse.link}`}
              d={curve(byId[from]!, byId[to]!)}
              stroke={tone[pulse.tone]}
              className="net-pulse"
              style={{ "--dur": `${pulse.dur}s`, "--delay": `${pulse.delay}s` } as React.CSSProperties}
            />
          );
        })}
      </g>

      {/* Nodes */}
      {nodes.map((node) => {
        const isEdge = node.kind === "edge";
        const isAuth = node.kind === "auth";
        const colour = isEdge ? tone.accent : isAuth ? tone.violet : "#4b5a70";
        const labelBelow = node.kind === "data";
        return (
          <g key={node.id}>
            {isEdge && <circle cx={node.x} cy={node.y} r="34" fill="url(#net-glow)" />}
            {(isEdge || isAuth) && (
              <circle
                cx={node.x}
                cy={node.y}
                r="11"
                fill="none"
                stroke={colour}
                strokeOpacity="0.5"
                className="net-breathe"
                style={{ "--delay": isAuth ? "1.5s" : "0s" } as React.CSSProperties}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={isEdge ? 5 : node.kind === "client" ? 3 : 4}
              fill={isEdge || isAuth ? colour : "#090b10"}
              stroke={colour}
              strokeWidth="1.5"
            />
            <text
              x={node.kind === "client" ? node.x - 12 : node.x}
              y={labelBelow ? node.y + 24 : node.kind === "client" ? node.y + 4 : node.y - 18}
              textAnchor={node.kind === "client" ? "end" : "middle"}
              className="font-mono"
              fontSize="10.5"
              fill={isEdge ? "#94c4ff" : isAuth ? "#c4b5fd" : "#7c8ba1"}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
