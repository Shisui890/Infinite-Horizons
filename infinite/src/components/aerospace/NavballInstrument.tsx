/**
 * NavballInstrument.tsx
 *
 * Instrumento de atitude aeroespacial esférico (Navball) inspirado em Kerbal Space Program (KSP),
 * exibindo linha do horizonte artificial (céu azul / solo marrom), graduações de arfagem (pitch 0° a 90°),
 * vetor Prógrado (direção do vetor velocidade) e vetor Retrógrado (frenagem).
 */

import { useRef, useEffect } from 'react';

interface Props {
  pitchDeg: number; // 90° = apontando para cima, 0° = horizonte horizontal
  headingDeg?: number; // 90° = azimute de lançamento padrão Leste
  vxMS: number;
  vyMS: number;
  size?: number;
}

export default function NavballInstrument({
  pitchDeg,
  headingDeg = 90,
  vxMS,
  vyMS,
  size = 180,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const r = (size / 2) - 6;

    ctx.clearRect(0, 0, size, size);

    // Bezel outer ring
    ctx.save();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.stroke();

    // Clip to spherical navball window
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // 1. Calculate horizon offset based on pitch:
    // pitch 90° = all blue (pointing straight up at zenith)
    // pitch 0° = horizon centered
    // pitch -90° = all brown (pointing straight down at nadir)
    const pitchOffset = (pitchDeg / 90) * r;
    const horizonY = cy + pitchOffset;

    // Sky (Blue hemisphere #0284c7)
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, size, size);

    // Ground (Brown hemisphere #78350f)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, horizonY, size, size);

    // Artificial Horizon Line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - r, horizonY);
    ctx.lineTo(cx + r, horizonY);
    ctx.stroke();

    // Pitch Ladder Lines (+30°, +60°, -30°, -60°)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';

    for (const p of [30, 60, -30, -60]) {
      const pY = horizonY - (p / 90) * r;
      if (pY > cy - r && pY < cy + r) {
        const lineHalfW = p > 0 ? 18 : 12;
        ctx.beginPath();
        ctx.moveTo(cx - lineHalfW, pY);
        ctx.lineTo(cx + lineHalfW, pY);
        ctx.stroke();
        ctx.fillText(`${p}°`, cx + lineHalfW + 10, pY + 3);
      }
    }

    // 2. Prograde Marker (Vector velocity direction)
    // Angle of velocity vector in flight plane
    const totalSpeed = Math.sqrt(vxMS * vxMS + vyMS * vyMS);
    if (totalSpeed > 2) {
      const flightPathAngleDeg = (Math.atan2(vyMS, vxMS) * 180) / Math.PI;
      // Offset relative to craft heading
      const progPitchDiff = flightPathAngleDeg - pitchDeg;
      const progY = cy - (progPitchDiff / 90) * (r * 0.7);

      ctx.save();
      ctx.strokeStyle = '#22c55e'; // Green prograde marker
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, progY, 8, 0, Math.PI * 2);
      ctx.stroke();
      // Prograde fins
      ctx.beginPath();
      ctx.moveTo(cx, progY - 8);
      ctx.lineTo(cx, progY - 13);
      ctx.moveTo(cx - 8, progY);
      ctx.lineTo(cx - 13, progY);
      ctx.moveTo(cx + 8, progY);
      ctx.lineTo(cx + 13, progY);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Fixed Aircraft Center Crosshair (-^ -)
    ctx.save();
    ctx.strokeStyle = '#f59e0b'; // Amber spacecraft reticle
    ctx.lineWidth = 2.5;

    // Left wing
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy);
    ctx.lineTo(cx - 8, cy);
    ctx.lineTo(cx - 8, cy + 4);
    ctx.stroke();

    // Center nose dot
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Right wing
    ctx.beginPath();
    ctx.moveTo(cx + 8, cy + 4);
    ctx.lineTo(cx + 8, cy);
    ctx.lineTo(cx + 24, cy);
    ctx.stroke();
    ctx.restore();

    // 4. Subtle Glass Reflection Overlay
    const glassGrad = ctx.createLinearGradient(0, 0, size, size);
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    glassGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    glassGrad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [pitchDeg, headingDeg, vxMS, vyMS, size]);

  return (
    <div className="navball-instrument-container">
      <div className="navball-header">
        <span className="navball-title">NAVBALL // ATITUDE DE VOO</span>
        <span className="navball-sub">PITCH: {pitchDeg.toFixed(1)}°</span>
      </div>
      <div className="navball-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="navball-canvas"
        />
      </div>
    </div>
  );
}
