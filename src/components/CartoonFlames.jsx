const FLAME_PATH =
  'M30 2 C41 26 56 35 56 60 C56 83 44 100 30 100 C16 100 4 83 4 60 C4 35 19 26 30 2 Z';
const CORE_PATH =
  'M30 34 C37 49 45 55 45 70 C45 84 38 92 30 92 C22 92 15 84 15 70 C15 55 23 49 30 34 Z';

const INK = '#1c0e05';

export function FlameTongue({
  x = 0,
  y = 100,
  scale = 1,
  delay = '0s',
  outer = '#e2520e',
  inner = '#ffb43c',
  strokeWidth = 5,
  nonScaling = false
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="flame-tongue" style={{ animationDelay: delay }}>
        <path
          d={FLAME_PATH}
          fill={outer}
          stroke={INK}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect={nonScaling ? 'non-scaling-stroke' : undefined}
        />
        <path d={CORE_PATH} fill={inner} stroke="none" />
      </g>
    </g>
  );
}

const CLUSTER = [
  { x: 0, y: 96, scale: 0.98, delay: '0s' },
  { x: 62, y: 78, scale: 1.2, delay: '-1.1s' },
  { x: 132, y: 100, scale: 0.92, delay: '-2.2s' },
  { x: 188, y: 82, scale: 1.14, delay: '-0.6s' },
  { x: 248, y: 98, scale: 1, delay: '-1.7s' }
];

export default function CartoonFlames({ className = '', tone = 'front' }) {
  const outer = tone === 'back' ? '#a82c09' : '#e2520e';
  const inner = tone === 'back' ? '#dd4f0d' : '#ffb43c';

  return (
    <svg
      viewBox="0 0 310 200"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      aria-hidden="true"
    >
      {CLUSTER.map((f, i) => (
        <FlameTongue key={i} {...f} outer={outer} inner={inner} />
      ))}
    </svg>
  );
}