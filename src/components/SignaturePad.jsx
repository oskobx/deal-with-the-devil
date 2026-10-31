import { useEffect, useRef } from 'react';

const W = 300;
const H = 200;

function toPath(strokes) {
  return strokes
    .filter((s) => s.length > 0)
    .map((stroke) => stroke.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' '))
    .join(' ');
}

// Turn a screen coordinate into the SVG's own coordinate space, so the ink lands
// exactly under the finger no matter how the pad is scaled on screen.
function screenToSvg(svg, clientX, clientY) {
  const ctm = svg && svg.getScreenCTM();
  if (!ctm) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const local = pt.matrixTransform(ctm.inverse());
  return { x: Math.round(local.x * 10) / 10, y: Math.round(local.y * 10) / 10 };
}

export default function SignaturePad({ value, onChange }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const hintRef = useRef(null);
  const drawing = useRef(false);
  const strokes = useRef([]);

  const paint = () => {
    if (pathRef.current) pathRef.current.setAttribute('d', toPath(strokes.current));
  };

  const addPoint = (clientX, clientY) => {
    const point = screenToSvg(svgRef.current, clientX, clientY);
    if (!point) return;
    const last = strokes.current[strokes.current.length - 1];
    if (!last) return;
    const prev = last[last.length - 1];
    if (prev && Math.abs(prev.x - point.x) < 1.2 && Math.abs(prev.y - point.y) < 1.2) return;
    last.push(point);
    paint();
  };

  const beginStroke = (clientX, clientY) => {
    if (drawing.current) return;
    const point = screenToSvg(svgRef.current, clientX, clientY);
    if (!point) return;
    drawing.current = true;
    strokes.current.push([point]);
    if (hintRef.current) hintRef.current.style.display = 'none';
    paint();
  };

  const endStroke = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(toPath(strokes.current));
  };

  const coalesced = (native) => {
    if (native && typeof native.getCoalescedEvents === 'function') {
      const events = native.getCoalescedEvents();
      if (events && events.length) return events;
    }
    return null;
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'touch') return;
    e.preventDefault();
    if (svgRef.current && svgRef.current.setPointerCapture) {
      svgRef.current.setPointerCapture(e.pointerId);
    }
    beginStroke(e.clientX, e.clientY);
  };

  const onPointerMove = (e) => {
    if (e.pointerType === 'touch' || !drawing.current) return;
    e.preventDefault();
    const events = coalesced(e.nativeEvent) || [e];
    for (const ev of events) addPoint(ev.clientX, ev.clientY);
  };

  const onPointerUp = () => endStroke();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.changedTouches && e.changedTouches[0];
      if (touch) beginStroke(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!drawing.current) return;
      const events = coalesced(e);
      const touches = events
        ? events.flatMap((ev) => Array.from(ev.changedTouches || []))
        : Array.from(e.changedTouches || []);
      for (const touch of touches) addPoint(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = (e) => {
      if (e.touches && e.touches.length > 0) return;
      endStroke();
    };

    svg.addEventListener('touchstart', handleTouchStart, { passive: false });
    svg.addEventListener('touchmove', handleTouchMove, { passive: false });
    svg.addEventListener('touchend', handleTouchEnd);
    svg.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      svg.removeEventListener('touchstart', handleTouchStart);
      svg.removeEventListener('touchmove', handleTouchMove);
      svg.removeEventListener('touchend', handleTouchEnd);
      svg.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [onChange]);

  const clear = () => {
    strokes.current = [];
    drawing.current = false;
    paint();
    if (hintRef.current) hintRef.current.style.display = '';
    onChange('');
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-sm border border-border bg-[#f4e9d2]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-[200px] w-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
        >
          <line x1="14" y1={H - 34} x2={W - 14} y2={H - 34} stroke="#c2a679" strokeWidth="1" />
          <path
            ref={pathRef}
            d={value}
            fill="none"
            stroke="#5a2410"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {!value && (
            <text
              ref={hintRef}
              x={W / 2}
              y={H / 2 - 6}
              textAnchor="middle"
              fontSize="12"
              fill="#b39a74"
            >
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