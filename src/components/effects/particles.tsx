/**
 * Hero background: a floating "3D" particle field rendered as one inline
 * SVG animated purely by CSS keyframes (transform + opacity — compositor
 * only, zero JavaScript, zero network requests).
 *
 * Depth illusion: three size/blur bands drift at different speeds and
 * amplitudes. Particles are generated from a seeded PRNG so server and
 * client render identical markup.
 */

interface Particle {
  x: number;
  y: number;
  r: number;
  blur: number;
  dx: number;
  dy: number;
  scale: number;
  duration: number;
  delay: number;
  minOpacity: number;
  maxOpacity: number;
  color: string;
}

/** Deterministic PRNG (mulberry32) — stable markup across SSR/CSR. */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateParticles(): Particle[] {
  const random = createRandom(20260707);
  const bands = [
    // far: small, dim, slow
    { count: 16, r: [1, 2], blur: 0, drift: 30, scale: 1.2, duration: [18, 26], opacity: [0.12, 0.4] },
    // mid
    { count: 10, r: [2, 3.5], blur: 1, drift: 48, scale: 1.35, duration: [14, 20], opacity: [0.15, 0.55] },
    // near: large, bright, fast
    { count: 6, r: [3.5, 5.5], blur: 2.5, drift: 70, scale: 1.5, duration: [10, 15], opacity: [0.2, 0.7] },
  ] as const;

  const particles: Particle[] = [];
  for (const band of bands) {
    for (let i = 0; i < band.count; i++) {
      const [rMin, rMax] = band.r;
      const [dMin, dMax] = band.duration;
      const [oMin, oMax] = band.opacity;
      particles.push({
        x: 2 + random() * 96,
        y: 5 + random() * 90,
        r: rMin + random() * (rMax - rMin),
        blur: band.blur,
        dx: (random() - 0.5) * 2 * band.drift,
        dy: -(0.3 + random() * 0.7) * band.drift,
        scale: band.scale,
        duration: dMin + random() * (dMax - dMin),
        delay: -random() * dMax,
        minOpacity: oMin,
        maxOpacity: oMax,
        color: random() > 0.72 ? "#6ee7f9" : "#8b93ff",
      });
    }
  }
  return particles;
}

const particles = generateParticles();

export function Particles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-lines [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 10%, rgba(139,147,255,0.08), transparent 65%)",
        }}
      />
      <svg className="absolute inset-0 size-full" preserveAspectRatio="none" role="presentation">
        {particles.map((particle, index) => (
          <circle
            key={index}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.r}
            fill={particle.color}
            style={
              {
                "--p-x": `${particle.dx.toFixed(1)}px`,
                "--p-y": `${particle.dy.toFixed(1)}px`,
                "--p-s": particle.scale,
                "--p-min": particle.minOpacity,
                "--p-max": particle.maxOpacity,
                filter: particle.blur ? `blur(${particle.blur}px)` : undefined,
                animation: `particle-drift ${particle.duration.toFixed(1)}s ease-in-out ${particle.delay.toFixed(1)}s infinite`,
                transformOrigin: `${particle.x}% ${particle.y}%`,
                willChange: "transform, opacity",
              } as React.CSSProperties
            }
          />
        ))}
      </svg>
    </div>
  );
}
