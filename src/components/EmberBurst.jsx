import { useMemo } from 'react';

export default function EmberBurst({ active }) {
  const embers = useMemo(
    () =>
      Array.from({ length: 26 }, () => ({
        left: 6 + Math.random() * 88,
        delay: Math.random() * 0.7,
        duration: 1 + Math.random() * 1.1,
        size: 3 + Math.random() * 5
      })),
    [active]
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-72 overflow-hidden">
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${e.left}%`,
            bottom: '0px',
            width: `${e.size}px`,
            height: `${e.size}px`,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`
          }}
        />
      ))}
    </div>
  );
}