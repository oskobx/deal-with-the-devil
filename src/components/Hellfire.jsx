import { useMemo } from 'react';

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
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hfBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b5300c" stopOpacity="0" />
              <stop offset="45%" stopColor="#a52c0c" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#4e0f05" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            d="M0 300 L0 168 C64 116 96 196 158 142 C214 94 246 178 308 128 C368 80 404 172 468 120 C528 72 566 166 628 112 C688 62 726 176 790 124 C848 78 884 172 946 120 C1006 70 1042 168 1104 118 C1152 80 1178 146 1200 126 L1200 300 Z"
            fill="url(#hfBack)"
          />
        </svg>
      </div>

      <div className="hellfire-band hellfire-band-front">
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hfFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffb45c" stopOpacity="0" />
              <stop offset="42%" stopColor="#ff7a22" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#d63c0c" stopOpacity="0.62" />
            </linearGradient>
          </defs>
          <path
            d="M0 300 L0 216 C48 178 84 236 132 200 C186 160 218 226 268 190 C320 152 356 222 410 186 C462 152 500 224 552 188 C604 152 640 228 694 192 C748 156 786 226 840 190 C892 156 928 224 982 188 C1034 154 1072 226 1124 194 C1164 170 1184 200 1200 188 L1200 300 Z"
            fill="url(#hfFront)"
          />
        </svg>
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