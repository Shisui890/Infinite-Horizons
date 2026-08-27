import { useRef, useEffect, useState } from 'react';
import type { TemporalEvent, CausalEdge } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';
import { LigoAudio } from '../../engine/LigoAudioService';

interface Props {
  events: TemporalEvent[];
  edges: CausalEdge[];
  selectedEventId: string | null;
  highlightChain: string[];
  visibleUntilYear: number;
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

function splitTitle(title: string): [string, string] {
  const clean = title.replace(/\s*\([^)]*\)/g, '').trim();
  if (clean.length <= 22) return [clean, ''];

  const words = clean.split(' ');
  let line1 = '';
  let line2 = '';

  for (const word of words) {
    if ((line1 + ' ' + word).trim().length <= 20) {
      line1 = (line1 + ' ' + word).trim();
    } else {
      line2 = (line2 + ' ' + word).trim();
    }
  }

  if (!line2) return [clean.slice(0, 22), clean.slice(22)];
  return [line1, line2.length > 24 ? line2.slice(0, 22) + '…' : line2];
}

export default function TimelineCanvas({
  events,
  edges,
  selectedEventId,
  highlightChain,
  visibleUntilYear,
  onSelectEvent,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const frameRef = useRef(0);

  // Zoom and Pan interactive state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const sortedEvents = [...events].sort((a, b) => a.year - b.year);
  const nodePositionsRef = useRef<Map<string, { x: number; y: number; labelY: number; labelAbove: boolean }>>(
    new Map()
  );

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

    function calculateLayout(w: number, h: number) {
      const positions = new Map<string, { x: number; y: number; labelY: number; labelAbove: boolean }>();
      const n = sortedEvents.length;
      if (n === 0) return positions;

      const paddingX = 110;
      const availableW = (w - paddingX * 2) * zoom;

      const minYear = sortedEvents[0].year;
      const maxYear = sortedEvents[n - 1].year;
      const yearRange = Math.max(maxYear - minYear, 1);

      sortedEvents.forEach((ev, i) => {
        const rankNorm = n > 1 ? i / (n - 1) : 0.5;
        const yearNorm = (ev.year - minYear) / yearRange;
        const normX = 0.6 * rankNorm + 0.4 * yearNorm;

        // Apply pan offset
        const x = paddingX + normX * availableW + pan.x;

        const trackIndex = i % 4;
        let yNorm = 0.5;
        let labelAbove = false;

        if (trackIndex === 0) {
          yNorm = 0.28;
          labelAbove = true;
        } else if (trackIndex === 1) {
          yNorm = 0.65;
          labelAbove = false;
        } else if (trackIndex === 2) {
          yNorm = 0.38;
          labelAbove = true;
        } else {
          yNorm = 0.76;
          labelAbove = false;
        }

        const y = h * yNorm + pan.y;
        const labelY = labelAbove ? y - 56 : y + 26;

        positions.set(ev.id, { x, y, labelY, labelAbove });
      });

      return positions;
    }

    function draw() {
      const frame = frameRef.current++;
      const w = container!.clientWidth;
      const h = container!.clientHeight;

      ctx!.clearRect(0, 0, w, h);

      const positions = calculateLayout(w, h);
      nodePositionsRef.current = positions;

      // 1. Spacetime Grid lines (Year ticks)
      sortedEvents.forEach(ev => {
        const pos = positions.get(ev.id);
        if (!pos) return;

        ctx!.beginPath();
        ctx!.moveTo(pos.x, 30);
        ctx!.lineTo(pos.x, h - 35);
        ctx!.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx!.lineWidth = 1;
        ctx!.stroke();

        ctx!.font = '600 9px Orbitron, sans-serif';
        ctx!.fillStyle = 'rgba(232, 234, 246, 0.35)';
        ctx!.textAlign = 'center';
        ctx!.fillText(String(ev.year), pos.x, h - 14);
      });

      // 2. Present Time Boundary Indicator
      const lastPos = positions.get(sortedEvents[sortedEvents.length - 1]?.id || '');
      if (lastPos) {
        ctx!.beginPath();
        ctx!.moveTo(lastPos.x + 45, 20);
        ctx!.lineTo(lastPos.x + 45, h - 30);
        ctx!.strokeStyle = 'rgba(0, 212, 255, 0.35)';
        ctx!.setLineDash([4, 6]);
        ctx!.stroke();
        ctx!.setLineDash([]);

        ctx!.font = '600 8px Orbitron, sans-serif';
        ctx!.fillStyle = 'rgba(0, 212, 255, 0.75)';
        ctx!.fillText('CONE DE LUZ', lastPos.x + 45, 18);
      }

      // 3. Draw Causal Edges
      for (const edge of edges) {
        const fromPos = positions.get(edge.source);
        const toPos = positions.get(edge.target);
        if (!fromPos || !toPos) continue;

        const isHighlighted = highlightChain.includes(edge.source) && highlightChain.includes(edge.target);
        const isParadox = edge.type === 'contradicts';
        const col = isHighlighted
          ? '#ef4444'
          : isParadox
          ? 'rgba(239, 68, 68, 0.75)'
          : 'rgba(0, 212, 255, 0.5)';

        ctx!.beginPath();
        ctx!.moveTo(fromPos.x, fromPos.y);

        const mx = (fromPos.x + toPos.x) / 2;
        const my = (fromPos.y + toPos.y) / 2 + (fromPos.y > toPos.y ? -35 : 35);
        ctx!.quadraticCurveTo(mx, my, toPos.x, toPos.y);

        ctx!.strokeStyle = col;
        ctx!.lineWidth = isHighlighted ? 2.5 : isParadox ? 2 : 1.5;

        if (isParadox) {
          ctx!.setLineDash([6, 4]);
        } else {
          ctx!.setLineDash([]);
        }
        ctx!.stroke();
        ctx!.setLineDash([]);

        // Animated photon packet along geodesic
        const t = (frame * 0.007) % 1;
        const px = fromPos.x + (toPos.x - fromPos.x) * t;
        const rawPy = fromPos.y + (toPos.y - fromPos.y) * t;
        const curvePy = rawPy + Math.sin(t * Math.PI) * (fromPos.y > toPos.y ? -35 : 35);

        ctx!.beginPath();
        ctx!.arc(px, curvePy, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = col;
        ctx!.fill();
      }

      // 4. Draw Event Nodes and High-Legibility Cards
      for (const event of sortedEvents) {
        const pos = positions.get(event.id);
        if (!pos) return;

        const isSelected = event.id === selectedEventId;
        const isHighlighted = highlightChain.includes(event.id);
        const col = STATUS_COLORS[event.status] || '#00d4ff';
        const isFuture = event.year > visibleUntilYear;
        ctx!.globalAlpha = isFuture ? 0.3 : 1;

        const pulse = Math.sin(frame * 0.04 + event.year) * 0.12 + 1;
        const r = isSelected ? 13 * pulse : 9;

        // Outer Glow
        const glowGrad = ctx!.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2.8);
        glowGrad.addColorStop(0, col.replace(')', ', 0.35)').replace('rgb', 'rgba'));
        glowGrad.addColorStop(1, 'transparent');
        ctx!.fillStyle = glowGrad;
        ctx!.fillRect(pos.x - r * 2.8, pos.y - r * 2.8, r * 5.6, r * 5.6);

        // Active Selection Ring
        if (isSelected || isHighlighted) {
          ctx!.beginPath();
          ctx!.arc(pos.x, pos.y, r + 5, 0, Math.PI * 2);
          ctx!.strokeStyle = isHighlighted ? '#ef4444' : '#00d4ff';
          ctx!.lineWidth = 2;
          ctx!.stroke();
        }

        // Center Node Sphere
        ctx!.beginPath();
        ctx!.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = col;
        ctx!.fill();

        // High-Legibility 2-Line Card
        const [line1, line2] = splitTitle(event.title);

        ctx!.font = '600 11px Inter, sans-serif';
        const w1 = ctx!.measureText(line1).width;
        const w2 = line2 ? ctx!.measureText(line2).width : 0;
        const cardW = Math.max(w1, w2, 110) + 20;
        const cardH = line2 ? 44 : 32;

        const cardX = pos.x - cardW / 2;
        const cardY = pos.labelAbove ? pos.y - r - cardH - 10 : pos.y + r + 10;

        // Connecting line
        ctx!.beginPath();
        ctx!.moveTo(pos.x, pos.y);
        ctx!.lineTo(pos.x, pos.labelAbove ? cardY + cardH : cardY);
        ctx!.strokeStyle = isSelected ? 'rgba(0, 212, 255, 0.6)' : 'rgba(255, 255, 255, 0.15)';
        ctx!.lineWidth = 1;
        ctx!.stroke();

        // Card background
        ctx!.fillStyle = 'rgba(6, 8, 20, 0.94)';
        ctx!.strokeStyle = isSelected
          ? '#00d4ff'
          : isHighlighted
          ? '#ef4444'
          : 'rgba(0, 212, 255, 0.3)';
        ctx!.lineWidth = isSelected ? 1.5 : 1;

        ctx!.beginPath();
        ctx!.roundRect(cardX, cardY, cardW, cardH, 6);
        ctx!.fill();
        ctx!.stroke();

        // Text
        ctx!.fillStyle = isSelected ? '#ffffff' : 'rgba(241, 245, 249, 0.95)';
        ctx!.textAlign = 'center';
        ctx!.fillText(line1, pos.x, cardY + (line2 ? 16 : 14));

        if (line2) {
          ctx!.font = '500 10px Inter, sans-serif';
          ctx!.fillStyle = 'rgba(203, 213, 225, 0.85)';
          ctx!.fillText(line2, pos.x, cardY + 28);
        }

        ctx!.font = '700 9px Orbitron, sans-serif';
        ctx!.fillStyle = col;
        ctx!.fillText(String(event.year), pos.x, cardY + (line2 ? 39 : 25));

        ctx!.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [events, edges, selectedEventId, highlightChain, visibleUntilYear, sortedEvents, zoom, pan]);

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDraggingRef.current) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  }

  function handleMouseUp() {
    isDraggingRef.current = false;
  }

  function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.6), 2.5));
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const positions = nodePositionsRef.current;

    for (const event of sortedEvents) {
      if (event.year > visibleUntilYear) continue;
      const pos = positions.get(event.id);
      if (!pos) continue;

      const dx = clickX - pos.x;
      const dy = clickY - pos.y;

      const [, line2] = splitTitle(event.title);
      const cardH = line2 ? 44 : 32;
      const cardY = pos.labelAbove ? pos.y - 12 - cardH - 10 : pos.y + 12 + 10;

      const isNodeClicked = Math.sqrt(dx * dx + dy * dy) < 26;
      const isCardClicked =
        Math.abs(clickX - pos.x) < 75 && clickY >= cardY && clickY <= cardY + cardH;

      if (isNodeClicked || isCardClicked) {
        LigoAudio.playSubtleTick();
        onSelectEvent(event.id);
        return;
      }
    }
  }

  function handleZoomIn() {
    LigoAudio.playSubtleTick();
    setZoom(prev => Math.min(prev + 0.2, 2.5));
  }

  function handleZoomOut() {
    LigoAudio.playSubtleTick();
    setZoom(prev => Math.max(prev - 0.2, 0.6));
  }

  function handleResetView() {
    LigoAudio.playSubtleTick();
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  }

  return (
    <div className="sim-canvas-container" ref={containerRef}>
      {/* Interactive Navigation HUD Controls */}
      <div className="canvas-hud-controls">
        <button type="button" className="hud-btn" onClick={handleZoomIn} title="Aumentar Zoom (+)">
          +
        </button>
        <span className="hud-zoom-indicator">{Math.round(zoom * 100)}%</span>
        <button type="button" className="hud-btn" onClick={handleZoomOut} title="Diminuir Zoom (-)">
          −
        </button>
        <button type="button" className="hud-btn hud-btn-reset" onClick={handleResetView} title="Centralizar Visualização">
          ⤢ Centralizar
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="sim-canvas"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
      />
    </div>
  );
}
