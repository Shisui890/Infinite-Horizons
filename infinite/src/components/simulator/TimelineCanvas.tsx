import { useRef, useEffect } from 'react';
import type { TemporalEvent, CausalEdge } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';

interface Props {
  events: TemporalEvent[];
  edges: CausalEdge[];
  selectedEventId: string | null;
  highlightChain: string[];
  onSelectEvent: (eventId: string) => void;
}

const STATUS_COLORS: Record<EventStatus, string> = {
  [EventStatus.STABLE]: '#00d4ff',
  [EventStatus.ALTERED]: '#fbbf24',
  [EventStatus.UNSTABLE]: '#fbbf24',
  [EventStatus.COLLAPSED]: '#6b7280',
  [EventStatus.PARADOXICAL]: '#ef4444',
  [EventStatus.ERASED]: '#374151',
  [EventStatus.DIVERGED]: '#a855f7',
};

export default function TimelineCanvas({
  events,
  edges,
  selectedEventId,
  highlightChain,
  onSelectEvent,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    const eventsMap = new Map<string, TemporalEvent>(events.map(e => [e.id, e]));

    function draw() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      const frame = frameRef.current++;

      ctx!.clearRect(0, 0, w, h);

      const minYear = 1950;
      const maxYear = 2080;
      const paddingX = 80;
      const timelineW = w - paddingX * 2;

      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx!.lineWidth = 1;

      for (let year = minYear; year <= maxYear; year += 10) {
        const x = paddingX + ((year - minYear) / (maxYear - minYear)) * timelineW;
        ctx!.beginPath();
        ctx!.moveTo(x, 40);
        ctx!.lineTo(x, h - 20);
        ctx!.stroke();

        ctx!.font = '9px Orbitron, sans-serif';
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx!.textAlign = 'center';
        ctx!.fillText(String(year), x, 25);
      }

      ctx!.beginPath();
      ctx!.moveTo(paddingX, 40);
      ctx!.lineTo(w - paddingX, 40);
      ctx!.strokeStyle = 'rgba(0, 212, 255, 0.15)';
      ctx!.stroke();

      for (const edge of edges) {
        const source = eventsMap.get(edge.source);
        const target = eventsMap.get(edge.target);
        if (!source || !target) continue;

        const sx = paddingX + ((source.year - minYear) / (maxYear - minYear)) * timelineW;
        const sy = source.position.y;
        const tx = paddingX + ((target.year - minYear) / (maxYear - minYear)) * timelineW;
        const ty = target.position.y;

        const isHighlighted = highlightChain.includes(edge.source) && highlightChain.includes(edge.target);
        const isParadox = edge.type === 'contradicts' || source.status === EventStatus.PARADOXICAL;
        const col = isHighlighted
          ? '#ef4444'
          : isParadox
          ? 'rgba(239, 68, 68, 0.6)'
          : 'rgba(0, 212, 255, 0.4)';

        ctx!.beginPath();
        ctx!.moveTo(sx, sy);
        const mx = (sx + tx) / 2;
        const my = (sy + ty) / 2 - 25;
        ctx!.quadraticCurveTo(mx, my, tx, ty);
        ctx!.strokeStyle = col;
        ctx!.lineWidth = isHighlighted ? 2.5 : isParadox ? 2 : 1.5;

        if (isParadox) {
          ctx!.setLineDash([6, 4]);
        } else {
          ctx!.setLineDash([]);
        }
        ctx!.stroke();
        ctx!.setLineDash([]);

        const t = (frame * 0.01) % 1;
        const px = sx + (tx - sx) * t;
        const rawPy = sy + (ty - sy) * t;
        const curvePy = rawPy - Math.sin(t * Math.PI) * 25;

        ctx!.beginPath();
        ctx!.arc(px, curvePy, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = col;
        ctx!.fill();
      }

      for (const event of events) {
        const ex = paddingX + ((event.year - minYear) / (maxYear - minYear)) * timelineW;
        const ey = event.position.y;
        const isSelected = event.id === selectedEventId;
        const isHighlighted = highlightChain.includes(event.id);
        const col = STATUS_COLORS[event.status] || '#00d4ff';

        const pulse = Math.sin(frame * 0.05 + event.year) * 0.15 + 1;
        const r = isSelected ? 16 * pulse : 12;

        const glowGrad = ctx!.createRadialGradient(ex, ey, 0, ex, ey, r * 2.5);
        glowGrad.addColorStop(0, col.replace(')', ', 0.25)').replace('rgb', 'rgba'));
        glowGrad.addColorStop(1, 'transparent');
        ctx!.fillStyle = glowGrad;
        ctx!.fillRect(ex - r * 2.5, ey - r * 2.5, r * 5, r * 5);

        if (isSelected || isHighlighted) {
          ctx!.beginPath();
          ctx!.arc(ex, ey, r + 6, 0, Math.PI * 2);
          ctx!.strokeStyle = isHighlighted ? '#ef4444' : '#00d4ff';
          ctx!.lineWidth = 2;
          ctx!.stroke();
        }

        ctx!.beginPath();
        ctx!.arc(ex, ey, r, 0, Math.PI * 2);
        ctx!.fillStyle = col;
        ctx!.fill();

        ctx!.font = isSelected ? '600 11px Inter, sans-serif' : '500 10px Inter, sans-serif';
        ctx!.fillStyle = 'rgba(232, 234, 246, 0.9)';
        ctx!.textAlign = 'center';
        ctx!.fillText(event.title, ex, ey + r + 16);

        ctx!.font = '9px Orbitron, sans-serif';
        ctx!.fillStyle = col;
        ctx!.fillText(String(event.year), ex, ey + r + 28);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [events, edges, selectedEventId, highlightChain]);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const minYear = 1950;
    const maxYear = 2080;
    const paddingX = 80;
    const timelineW = canvas.clientWidth - paddingX * 2;

    for (const event of events) {
      const ex = paddingX + ((event.year - minYear) / (maxYear - minYear)) * timelineW;
      const ey = event.position.y;
      const dx = clickX - ex;
      const dy = clickY - ey;
      if (Math.sqrt(dx * dx + dy * dy) < 22) {
        onSelectEvent(event.id);
        return;
      }
    }
  }

  return (
    <div ref={containerRef} className="sim-canvas-container">
      <canvas ref={canvasRef} className="sim-canvas" onClick={handleClick} />
    </div>
  );
}
