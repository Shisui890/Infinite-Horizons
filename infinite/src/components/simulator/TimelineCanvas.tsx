import { useRef, useEffect, useState, useCallback } from 'react';
import type { TemporalEvent, CausalEdge } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';
import { LigoAudio } from '../../engine/LigoAudioService';
import { useLaymanMode } from '../../context/LaymanModeContext';
import { getLaymanExplanation } from '../../utils/laymanContent';

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
  const { isLaymanMode } = useLaymanMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const frameRef = useRef(0);

  // Zoom and Pan interactive state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Heatmap & Node Dragging State
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [nodeCustomOffsets, setNodeCustomOffsets] = useState<Record<string, { dx: number; dy: number }>>({});
  const draggedNodeIdRef = useRef<string | null>(null);
  const nodeDragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const sortedEvents = [...events].sort((a, b) => a.year - b.year);
  const nodePositionsRef = useRef<Map<string, { x: number; y: number; labelY: number; labelAbove: boolean }>>(
    new Map()
  );

  const calculateLayout = useCallback((w: number, h: number) => {
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

      let x = paddingX + normX * availableW + pan.x;

      const trackIndex = i % 4;
      let yNorm = 0.5;
      let labelAbove = false;

      if (trackIndex === 0) {
        yNorm = 0.35;
        labelAbove = true;
      } else if (trackIndex === 1) {
        yNorm = 0.58;
        labelAbove = false;
      } else if (trackIndex === 2) {
        yNorm = 0.42;
        labelAbove = true;
      } else {
        yNorm = 0.64;
        labelAbove = false;
      }

      let y = h * yNorm + pan.y;

      // Apply custom manual drag offset if any
      const offset = nodeCustomOffsets[ev.id];
      if (offset) {
        x += offset.dx * zoom;
        y += offset.dy * zoom;
      }

      const labelY = labelAbove ? y - 56 : y + 26;
      positions.set(ev.id, { x, y, labelY, labelAbove });
    });

    return positions;
  }, [sortedEvents, zoom, pan, nodeCustomOffsets]);

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

    function draw() {
      const frame = frameRef.current++;
      const w = container!.clientWidth;
      const h = container!.clientHeight;

      ctx!.clearRect(0, 0, w, h);

      const positions = calculateLayout(w, h);
      nodePositionsRef.current = positions;

      // 0. Causal Heatmap Layer (Gravitational Influence Fields)
      if (showHeatmap) {
        sortedEvents.forEach(ev => {
          const pos = positions.get(ev.id);
          if (!pos) return;
          const influence = (1 + ev.children.length * 2.2) * (ev.importance / 100);
          const radius = Math.max(40, 48 * influence * zoom);

          const grad = ctx!.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
          grad.addColorStop(0, ev.isAnchor ? 'rgba(168, 85, 247, 0.45)' : 'rgba(0, 212, 255, 0.35)');
          grad.addColorStop(0.5, 'rgba(0, 212, 255, 0.12)');
          grad.addColorStop(1, 'transparent');

          ctx!.beginPath();
          ctx!.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
          ctx!.fillStyle = grad;
          ctx!.fill();

          // Contour gravitational ring
          ctx!.beginPath();
          ctx!.arc(pos.x, pos.y, radius * 0.75, 0, Math.PI * 2);
          ctx!.strokeStyle = 'rgba(0, 212, 255, 0.15)';
          ctx!.setLineDash([2, 4]);
          ctx!.stroke();
          ctx!.setLineDash([]);
        });
      }

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
        ctx!.bezierCurveTo(mx, fromPos.y, mx, toPos.y, toPos.x, toPos.y);

        ctx!.strokeStyle = col;
        ctx!.lineWidth = isHighlighted ? 2.5 : 1.2;
        ctx!.stroke();

        // Flowing energy particle along active geodesics
        const t = ((frame * 0.012 + (edge.source.charCodeAt(0) % 10) * 0.1) % 1);
        const px = Math.pow(1 - t, 3) * fromPos.x +
          3 * Math.pow(1 - t, 2) * t * mx +
          3 * (1 - t) * Math.pow(t, 2) * mx +
          Math.pow(t, 3) * toPos.x;
        const py = Math.pow(1 - t, 3) * fromPos.y +
          3 * Math.pow(1 - t, 2) * t * fromPos.y +
          3 * (1 - t) * Math.pow(t, 2) * toPos.y +
          Math.pow(t, 3) * toPos.y;

        ctx!.beginPath();
        ctx!.arc(px, py, isHighlighted ? 3 : 2, 0, Math.PI * 2);
        ctx!.fillStyle = isHighlighted ? '#ef4444' : '#00d4ff';
        ctx!.fill();
      }

      // 4. Draw Events / Nodes
      for (const event of sortedEvents) {
        const pos = positions.get(event.id);
        if (!pos) continue;

        const isSelected = selectedEventId === event.id;
        const isHighlighted = highlightChain.includes(event.id);
        const isVisible = event.year <= visibleUntilYear;
        const col = STATUS_COLORS[event.status] || '#00d4ff';

        ctx!.globalAlpha = isVisible ? 1 : 0.22;

        const r = isSelected ? 11 : isHighlighted ? 9.5 : 8;

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

        // High-Legibility Card
        const titleToDisplay = isLaymanMode
          ? getLaymanExplanation(event.year, event.title).simpleTitle
          : event.title;
        const [line1, line2] = splitTitle(titleToDisplay);

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

        // Scientific Status Indicator Dot
        const isProven = event.scientificStatus === 'proven' || event.evidenceKind === 'documented_fact';
        const isTheoretical = event.scientificStatus === 'theoretical_untested' || event.evidenceKind === 'scientific_theory';
        const statusDotColor = isProven ? '#10b981' : isTheoretical ? '#f59e0b' : '#38bdf8';

        ctx!.beginPath();
        ctx!.arc(cardX + 8, cardY + (line2 ? 38 : 24), 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = statusDotColor;
        ctx!.fill();

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
  }, [events, edges, selectedEventId, highlightChain, visibleUntilYear, sortedEvents, zoom, pan, showHeatmap, calculateLayout, isLaymanMode]);

  function findNodeAt(clientX: number, clientY: number): string | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const positions = nodePositionsRef.current;
    for (const [id, pos] of positions.entries()) {
      const dist = Math.hypot(x - pos.x, y - pos.y);
      if (dist <= 26) return id;
    }
    return null;
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const targetNodeId = findNodeAt(e.clientX, e.clientY);
    if (targetNodeId) {
      draggedNodeIdRef.current = targetNodeId;
      nodeDragStartPosRef.current = { x: e.clientX, y: e.clientY };
      setIsDragging(true);
      isDraggingRef.current = true;
      return;
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDraggingRef.current) return;

    // Node individual dragging
    if (draggedNodeIdRef.current) {
      const dx = (e.clientX - nodeDragStartPosRef.current.x) / zoom;
      const dy = (e.clientY - nodeDragStartPosRef.current.y) / zoom;
      const nodeId = draggedNodeIdRef.current;

      setNodeCustomOffsets(prev => {
        const current = prev[nodeId] || { dx: 0, dy: 0 };
        return {
          ...prev,
          [nodeId]: { dx: current.dx + dx, dy: current.dy + dy },
        };
      });

      nodeDragStartPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Canvas panning
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  }

  function handleMouseUp() {
    isDraggingRef.current = false;
    setIsDragging(false);
    draggedNodeIdRef.current = null;
  }

  function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.6), 2.5));
  }

  // --- Touch Support for Mobile & Tablet ---
  const touchStartRef = useRef<{ x: number; y: number; moved: boolean }>({ x: 0, y: 0, moved: false });
  const touchPinchDistRef = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent<HTMLCanvasElement>) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const targetNodeId = findNodeAt(touch.clientX, touch.clientY);
      if (targetNodeId) {
        draggedNodeIdRef.current = targetNodeId;
        nodeDragStartPosRef.current = { x: touch.clientX, y: touch.clientY };
        isDraggingRef.current = true;
        setIsDragging(true);
        return;
      }

      touchStartRef.current = { x: touch.clientX, y: touch.clientY, moved: false };
      dragStartRef.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
      isDraggingRef.current = true;
      setIsDragging(true);
      touchPinchDistRef.current = null;
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      setIsDragging(false);
      draggedNodeIdRef.current = null;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchPinchDistRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  }

  function handleTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const touch = e.touches[0];

      if (draggedNodeIdRef.current) {
        const dx = (touch.clientX - nodeDragStartPosRef.current.x) / zoom;
        const dy = (touch.clientY - nodeDragStartPosRef.current.y) / zoom;
        const nodeId = draggedNodeIdRef.current;

        setNodeCustomOffsets(prev => {
          const current = prev[nodeId] || { dx: 0, dy: 0 };
          return {
            ...prev,
            [nodeId]: { dx: current.dx + dx, dy: current.dy + dy },
          };
        });

        nodeDragStartPosRef.current = { x: touch.clientX, y: touch.clientY };
        return;
      }

      const dist = Math.hypot(touch.clientX - touchStartRef.current.x, touch.clientY - touchStartRef.current.y);
      if (dist > 6) {
        touchStartRef.current.moved = true;
      }
      setPan({
        x: touch.clientX - dragStartRef.current.x,
        y: touch.clientY - dragStartRef.current.y,
      });
    } else if (e.touches.length === 2 && touchPinchDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const factor = newDist / touchPinchDistRef.current;
      if (Math.abs(factor - 1) > 0.02) {
        setZoom(prev => Math.min(Math.max(prev * factor, 0.6), 2.5));
        touchPinchDistRef.current = newDist;
      }
    }
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLCanvasElement>) {
    if (e.touches.length === 0) {
      isDraggingRef.current = false;
      setIsDragging(false);
      draggedNodeIdRef.current = null;
      touchPinchDistRef.current = null;

      if (!touchStartRef.current.moved) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = touchStartRef.current.x - rect.left;
        const clickY = touchStartRef.current.y - rect.top;

        const positions = nodePositionsRef.current;
        for (const [id, pos] of positions.entries()) {
          const dist = Math.hypot(clickX - pos.x, clickY - pos.y);
          if (dist <= 26) {
            onSelectEvent(id);
            LigoAudio.playSubtleTick();
            break;
          }
        }
      }
    }
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const positions = nodePositionsRef.current;
    for (const [id, pos] of positions.entries()) {
      const dist = Math.hypot(clickX - pos.x, clickY - pos.y);
      if (dist <= 26) {
        onSelectEvent(id);
        LigoAudio.playSubtleTick();
        break;
      }
    }
  }

  return (
    <div ref={containerRef} className="sim-canvas-container">
      {/* Top Floating Interactive HUD */}
      <div className="canvas-floating-controls">
        <button
          type="button"
          className={`btn-canvas-hud ${showHeatmap ? 'active-heat' : ''}`}
          onClick={() => setShowHeatmap(!showHeatmap)}
          title={isLaymanMode ? 'Destacar acontecimentos com maior impacto' : 'Alternar Mapa de Gravidade & Calor Causal'}
        >
          {showHeatmap
            ? (isLaymanMode ? 'Destaque Ativo' : 'Calor Ativo')
            : (isLaymanMode ? 'Destacar Impacto' : 'Gravidade Causal')}
        </button>

        <button
          type="button"
          className="btn-canvas-hud"
          onClick={() => setZoom(prev => Math.min(prev * 1.2, 2.5))}
          title="Aproximar Zoom (+)"
        >
          +
        </button>
        <button
          type="button"
          className="btn-canvas-hud"
          onClick={() => setZoom(prev => Math.max(prev * 0.8, 0.6))}
          title="Afastar Zoom (-)"
        >
          -
        </button>
        <button
          type="button"
          className="btn-canvas-hud"
          onClick={() => {
            setZoom(1.0);
            setPan({ x: 0, y: 0 });
            setNodeCustomOffsets({});
          }}
          title={isLaymanMode ? 'Centralizar visualização da linha do tempo' : 'Redefinir Visão & Posições'}
        >
          {isLaymanMode ? 'Centralizar' : '⟲ Reset'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="sim-canvas"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      />
    </div>
  );
}
