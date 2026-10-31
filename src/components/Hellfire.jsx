import { useMemo } from 'react';
import { FlameTongue } from '@/components/CartoonFlames';

const bandFlames = (count, seed) =>
  Array.from({ length: count }, (_, i) => {
    const scale = 0.78 + Math.abs(Math.sin(i * 1.7 + seed)) * 0.64;
    return {
      x: (i / (count - 1)) * 1180 - 20,
      y: 222 - 100 * scale,
      scale,
      delay: `-${((i * 0.42) % 3.4).toFixed(2)}s`
    };
  });

function FlameBand({ tone, count, seed, className }) {
  const flames = useMemo(() => bandFlames(count, seed), [count, seed]);
  const outer = tone === 'back' ? '#a82c09' : '#e2520e';
  const inner = tone === 'back' ? '#dd4f0d' : '#ffb43c';

  return (
    <svg viewBox="0 0 1200 220" preserveAspectRatio="none" className={className} aria-hidden="true">
      {flames.map((f, i) => (
        <FlameTongue
          key={i}
          x={f.x}
          y={f.y}
          scale={f.scale}
          delay={f.delay}
          outer={outer}
          inner={inner}
          strokeWidth={4}
          nonScaling
        />
      ))}
    </svg>
  );
}

export default function Hellfire() {
  const embers = useMemo(
    () =>
      Array.from({ length: 16 }, () => ({
        left: Math.round(Math.random() * 100),
        delay: Number((Math.random() * 11).toFixed(2)),
        duration: Number((8 + Math.random() * 8).toFixed(2)),
        size: Number((2.5 + Math.random() * 4).toFixed(1)),
        drift: Math.round((Math.random() - 0.5) * 70)
      })),
    []
  );

  return (
    <div className="hellfire" aria-hidden="true">
      <div className="hellfire-glow" />

      <div className="hellfire-band hellfire-band-back">
        <FlameBand tone="back" count={13} seed={1.4} />
      </div>

      <div className="hellfire-band hellfire-band-front">
        <FlameBand tone="front" count={11} seed={3.1} />
      </div>

      {embers.map((ember, i) => (
        <span
          key={i}
          className="hellfire-ember"
          style={{
            left: `${ember.left}%`,
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            animationDelay: `${ember.delay}s`,
            animationDuration: `${ember.duration}s`,
            '--drift': `${ember.drift}px`
          }}
        />
      ))}
    </div>
  );
}