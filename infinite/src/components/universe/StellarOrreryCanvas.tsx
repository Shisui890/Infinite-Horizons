import { useRef, useEffect, useState, useCallback } from 'react';
import type { CelestialBody, CelestialSector } from '../../data/celestialBodies';

interface Props {
  bodies: CelestialBody[];
  selectedBody: CelestialBody;
  sector: CelestialSector;
  onSelectBody: (body: CelestialBody) => void;
}

function getBodyOrreryCoords(
  body: CelestialBody,
  cx: number,
  cy: number,
  scale: number,
  sector: CelestialSector
): { bx: number; by: number } {
  let bx = cx + body.chartPosition.x * scale;
  let by = cy + body.chartPosition.y * scale;

  if (sector === 'solar_system' && body.orbitalRadius !== undefined) {
    const orbitR = body.orbitalRadius * scale * 2.1;
    let angle = body.orbitalRadius * 5.4;
    // Displace clustered bodies (Terra, Lua, ISS, JWST, Ceres, Plutão) for clear visual separation
    if (body.id === 'lua') angle += 0.55;
    else if (body.id === 'iss') angle -= 0.45;
    else if (body.id === 'jwst') angle += 1.1;
    else if (body.id === 'plutao') angle += 1.4;
    else if (body.id === 'ceres') angle -= 0.68;

    bx = cx + Math.cos(angle) * orbitR;
    by = cy + Math.sin(angle) * orbitR * 0.65;
  }

  return { bx, by };
}

export default function StellarOrreryCanvas({
  bodies,
  selectedBody,
  sector,
  onSelectBody,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [hoveredBodyId, setHoveredBodyId] = useState<string | null>(null);

  // Pan & Zoom State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  // Reset view when sector changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [sector]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        setPan({
          x: panStartRef.current.x + dx,
          y: panStartRef.current.y + dy,
        });
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const cx = canvas.width / 2 + pan.x;
      const cy = canvas.height / 2 + pan.y;
      const scale = Math.min(canvas.width, canvas.height) * 0.42 * zoom;

      let foundId: string | null = null;

      for (const body of bodies) {
        const { bx, by } = getBodyOrreryCoords(body, cx, cy, scale, sector);
        const dist = Math.hypot(mouseX - bx, mouseY - by);
        const hitRadius = body.id === 'sol' ? 24 : 16;
        if (dist <= hitRadius) {
          foundId = body.id;
          break;
        }
      }

      setHoveredBodyId(foundId);
    },
    [bodies, pan, zoom, sector]
  );

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cx = canvas.width / 2 + pan.x;
    const cy = canvas.height / 2 + pan.y;
    const scale = Math.min(canvas.width, canvas.height) * 0.42 * zoom;

    for (const body of bodies) {
      const { bx, by } = getBodyOrreryCoords(body, cx, cy, scale, sector);
      const dist = Math.hypot(mouseX - bx, mouseY - by);
      const hitRadius = body.id === 'sol' ? 24 : 16;
      if (dist <= hitRadius) {
        onSelectBody(body);
        break;
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(3.5, Math.max(0.6, prev * delta)));
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    function draw() {
      if (!canvas || !ctx) return;
      time += 0.015;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2 + pan.x;
      const cy = h / 2 + pan.y;
      const scale = Math.min(w, h) * 0.42 * zoom;

      // 1. Deep Void Cockpit Background
      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, w, h);

      // 2. Holographic Sector Grid & Coordinate Rays
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 1;

      const gridSize = 60 * zoom;
      const offsetX = (w / 2 + pan.x) % gridSize;
      const offsetY = (h / 2 + pan.y) % gridSize;

      for (let x = offsetX; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = offsetY; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Compass Crosshairs through Origin
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.16)';
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
      ctx.restore();

      // 3. Orbits (for Solar System) or Range Rings (for deep space)
      if (sector === 'solar_system') {
        ctx.save();
        for (const body of bodies) {
          if (body.orbitalRadius && body.orbitalRadius > 0) {
            const orbitR = body.orbitalRadius * scale * 2.1;
            ctx.beginPath();
            ctx.ellipse(cx, cy, orbitR, orbitR * 0.65, 0, 0, Math.PI * 2);
            ctx.strokeStyle = body.id === selectedBody.id ? 'rgba(0, 229, 255, 0.55)' : 'rgba(255, 255, 255, 0.09)';
            ctx.lineWidth = body.id === selectedBody.id ? 1.6 : 0.8;
            if (body.id === selectedBody.id) {
              ctx.setLineDash([5, 4]);
            } else {
              ctx.setLineDash([2, 6]);
            }
            ctx.stroke();
          }
        }
        ctx.restore();
      } else {
        // Distance Concentric Rings in Light Years
        ctx.save();
        ctx.setLineDash([3, 8]);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
        ctx.lineWidth = 1;
        for (let r = 1; r <= 3; r++) {
          const ringRadius = (scale * r) / 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Render Celestial Bodies
      for (const body of bodies) {
        const { bx, by } = getBodyOrreryCoords(body, cx, cy, scale, sector);

        const isSelected = body.id === selectedBody.id;
        const isHovered = body.id === hoveredBodyId;

        // Draw Target Reticle if selected
        if (isSelected) {
          ctx.save();
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 1.5;
          const reticleSize = body.id === 'sol' ? 26 : 18;
          const bracketLen = 6;

          // Animated pulsing ring
          ctx.beginPath();
          ctx.arc(bx, by, reticleSize + Math.sin(time * 4) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
          ctx.stroke();

          // High-tech Bracket Corners
          ctx.strokeStyle = '#00e5ff';
          // Top Left
          ctx.beginPath();
          ctx.moveTo(bx - reticleSize, by - reticleSize + bracketLen);
          ctx.lineTo(bx - reticleSize, by - reticleSize);
          ctx.lineTo(bx - reticleSize + bracketLen, by - reticleSize);
          ctx.stroke();
          // Top Right
          ctx.beginPath();
          ctx.moveTo(bx + reticleSize - bracketLen, by - reticleSize);
          ctx.lineTo(bx + reticleSize, by - reticleSize);
          ctx.lineTo(bx + reticleSize, by - reticleSize + bracketLen);
          ctx.stroke();
          // Bottom Left
          ctx.beginPath();
          ctx.moveTo(bx - reticleSize, by + reticleSize - bracketLen);
          ctx.lineTo(bx - reticleSize, by + reticleSize);
          ctx.lineTo(bx - reticleSize + bracketLen, by + reticleSize);
          ctx.stroke();
          // Bottom Right
          ctx.beginPath();
          ctx.moveTo(bx + reticleSize - bracketLen, by + reticleSize);
          ctx.lineTo(bx + reticleSize, by + reticleSize);
          ctx.lineTo(bx + reticleSize, by + reticleSize - bracketLen);
          ctx.stroke();

          ctx.restore();
        }

        // Draw Celestial Body Sphere
        ctx.save();
        let bodyRadius = 5;
        if (body.id === 'sol') bodyRadius = 13;
        else if (body.id === 'jupiter' || body.id === 'saturno') bodyRadius = 8;
        else if (body.isBlackHole) bodyRadius = 8;

        // Outer Glow
        const glowGrad = ctx.createRadialGradient(bx, by, 0, bx, by, bodyRadius * 3.5);
        glowGrad.addColorStop(0, body.glowColor);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(bx, by, bodyRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core Body
        ctx.beginPath();
        ctx.arc(bx, by, bodyRadius, 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        ctx.shadowColor = body.color;
        ctx.shadowBlur = isSelected ? 16 : 8;
        ctx.fill();

        // Saturn Rings indicator
        if (body.id === 'saturno') {
          ctx.beginPath();
          ctx.ellipse(bx, by, bodyRadius * 2.2, bodyRadius * 0.8, -0.3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.restore();

        // Monospace Data Label with tactical background to prevent text collision
        ctx.save();
        ctx.font = isSelected ? '600 11px JetBrains Mono, monospace' : '500 10px JetBrains Mono, monospace';
        const labelText = body.name;
        const textMetrics = ctx.measureText(labelText);
        const textWidth = textMetrics.width;

        // Stagger labels above or below for clustered objects (Terra, Lua, ISS, Ceres, Urano)
        const isAbove = body.id === 'iss' || body.id === 'ceres' || body.id === 'urano' || body.id === 'mercurio';
        const labelY = isAbove ? by - bodyRadius - 8 : by + bodyRadius + 14;

        // High contrast semi-transparent tactical backdrop
        ctx.fillStyle = isSelected ? 'rgba(0, 229, 255, 0.16)' : 'rgba(4, 8, 20, 0.85)';
        ctx.strokeStyle = isSelected ? '#00e5ff' : 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = isSelected ? 1.2 : 0.8;
        ctx.beginPath();
        if ((ctx as any).roundRect) {
          (ctx as any).roundRect(bx - textWidth / 2 - 5, labelY - 10, textWidth + 10, 15, 4);
        } else {
          ctx.rect(bx - textWidth / 2 - 5, labelY - 10, textWidth + 10, 15);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSelected ? '#00e5ff' : isHovered ? '#ffffff' : '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.fillText(labelText, bx, labelY + 1);

        if (isSelected) {
          ctx.font = '700 8px JetBrains Mono, monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`[ ${body.distanceFromEarth.split(' ')[0]} ${body.distanceFromEarth.split(' ')[1] || ''} ]`, bx, labelY + 13);
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [bodies, selectedBody, hoveredBodyId, pan, zoom, sector]);

  return (
    <div className="ed-orrery-container">
      <div className="ed-orrery-hud-bar">
        <div className="ed-hud-tag-group">
          <span className="ed-hud-status-dot" />
          <span className="ed-hud-label">Carta Estelar Vetorial 2D</span>
          <span className="ed-hud-coord">Zoom: {(zoom * 100).toFixed(0)}%</span>
        </div>

        <div className="ed-orrery-controls">
          <button
            type="button"
            className="ed-btn-hud-tool"
            onClick={() => setZoom(prev => Math.min(3.5, prev * 1.2))}
            title="Aproximar Zoom"
          >
            +
          </button>
          <button
            type="button"
            className="ed-btn-hud-tool"
            onClick={() => setZoom(prev => Math.max(0.6, prev * 0.8))}
            title="Afastar Zoom"
          >
            -
          </button>
          <button
            type="button"
            className="ed-btn-hud-tool"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            title="Centralizar Visualização"
          >
            Centralizar
          </button>
        </div>
      </div>

      <div className="ed-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="ed-orrery-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          onWheel={handleWheel}
        />

        <div className="ed-canvas-tip">
          <span>Arraste para mover • Roda do mouse para zoom • Clique no corpo celeste para escanear</span>
        </div>
      </div>
    </div>
  );
}
