import { useRef, useState } from 'react';

const W = 300;
const H = 120;

function toPath(strokes) {
  return strokes
    .filter((s) => s.length > 0)
    .map((stroke) => stroke.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' '))
    .join(' ');
}

export default function SignaturePad({ value, onChange }) {
  const svgRef = useRef(null);
  const drawing = useRef(false);
  const strokes = useRef([]);
  const [version, setVersion] = useState(0);

  const pointFromEvent = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    if (svgRef.current.setPointerCapture) {
      svgRef.current.setPointerCapture(e.pointerId);
    }
    strokes.current = [...strokes.current, [pointFromEvent(e)]];
    setVersion((v) => v + 1);
    onChange(toPath(strokes.current));
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const last = strokes.current[strokes.current.length - 1];
    const point = pointFromEvent(e);
    if (last && last.length) {
      const prev = last[last.length - 1];
      if (Math.abs(prev.x - point.x) < 1.2 && Math.abs(prev.y - point.y) < 1.2) return;
    }
    strokes.current[strokes.current.length - 1] = [...(last || []), point];
    setVersion((v) => v + 1);
    onChange(toPath(strokes.current));
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    strokes.current = [];
    setVersion((v) => v + 1);
    onChange('');
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-sm border border-border bg-[#f4e9d2]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-28 w-full touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
          style={{ touchAction: 'none' }}
          data-version={version}
        >
          <line x1="14" y1={H - 26} x2={W - 14} y2={H - 26} stroke="#c2a679" strokeWidth="1" />
          <path
            d={value}
            fill="none"
            stroke="#5a2410"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {!value && (
            <text x={W / 2} y={H / 2 - 4} textAnchor="middle" fontSize="11" fill="#b39a74">
              draw with your finger
            </text>
          )}
        </svg>
      </div>
      <button
        type="button"
        onClick={clear}
        className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
      >
        Clear
      </button>
    </div>
  );
}