/**
 * CelestialRenderer3D.tsx
 *
 * Motor visual procedural em HTML5 Canvas (60 FPS) de alta fidelidade astrofísica:
 * 1. Buracos Negros Relativísticos:
 *    - Sagittarius A*: Morfologia EHT com anel dourado e 3 pontos quentes (*hot spots*) em rotação.
 *    - M87* e TON 618: Jato polar colimado relativístico com radiação síncrotron, disco de acreção em curvatura de Einstein e efeito Doppler.
 *    - Cygnus X-1: Sistema binário com estrela companheira supergigante azul e fluxo de acreção pelo lóbulo de Roche.
 * 2. Sonda Espacial Interestelar Voyager 1:
 *    - Antena parabólica de alto ganho (3,7 m), braço de magnetômetro, geradores RTG e Disco de Ouro (Golden Record).
 * 3. Estrelas Reais (Sol, Betelgeuse, Sirius, Próxima):
 *    - Corona turbulenta, proeminências solares e picos de difração óptica.
 * 4. Planetas e Luas:
 *    - Saturno com anéis e Divisão de Cassini, Terra com oceanos e espalhamento Rayleigh, Júpiter com a Grande Mancha Vermelha.
 * 5. Galáxias e Espaço Profundo.
 */

import { useRef, useEffect, useState } from 'react';
import type { CelestialBody } from '../../data/celestialBodies';

interface Props {
  body: CelestialBody;
  isLaymanMode?: boolean;
}

export default function CelestialRenderer3D({ body, isLaymanMode = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Black Hole & Star physics interactive controls
  const [spinA, setSpinA] = useState<number>(body.id === 'm87' ? 0.94 : body.id === 'ton618' ? 0.99 : 0.9);
  const [inclinationDeg, setInclinationDeg] = useState<number>(75);
  const [diskBrightness, setDiskBrightness] = useState<number>(1.0);
  const [showAtmosphere, setShowAtmosphere] = useState<boolean>(true);

  // Reset or adjust params when body changes
  useEffect(() => {
    if (body.id === 'm87') setSpinA(0.94);
    else if (body.id === 'ton618') setSpinA(0.99);
    else if (body.id === 'cygnus_x1' || body.id === 'cygnus-x1') setSpinA(0.97);
    else if (body.id === 'sgra') setSpinA(0.90);
  }, [body.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animTime = 0;
    let animId: number;

    function renderFrame() {
      if (!canvas || !ctx) return;
      animTime += 0.015;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Dark cosmos background
      ctx.fillStyle = '#020307';
      ctx.fillRect(0, 0, w, h);

      // Distant micro-stars background
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 45; i++) {
        const sx = ((i * 137.5) % w);
        const sy = ((i * 293.1) % h);
        const sz = (i % 3 === 0) ? 1.5 : 0.8;
        ctx.fillRect(sx, sy, sz, sz);
      }
      ctx.restore();

      // =====================================================================
      // 0) CASO ESPECIAL: SONDA ESPACIAL VOYAGER 1
      // =====================================================================
      if (body.id === 'voyager1') {
        ctx.save();
        ctx.translate(cx, cy);
        const craftAngle = Math.sin(animTime * 0.3) * 0.05;
        ctx.rotate(craftAngle);

        // A. Braço Longo do Magnetômetro (13 metros de treliça)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-140, 50);
        ctx.stroke();

        // Sensor do magnetômetro na ponta
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(-140, 50, 4, 0, Math.PI * 2);
        ctx.fill();

        // B. Braço dos Geradores RTG (Plutônio-238)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(80, 80);
        ctx.stroke();

        // 3 Cilindros RTG
        ctx.fillStyle = '#475569';
        for (let r = 0; r < 3; r++) {
          ctx.fillRect(70 + r * 10, 70 + r * 8, 8, 14);
        }
        // Brilho térmico infravermelho do decaimento radioativo
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.beginPath();
        ctx.arc(85, 85, 15, 0, Math.PI * 2);
        ctx.fill();

        // C. Braço de Instrumentos Científicos (Câmeras e Espectrômetros)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(95, -45);
        ctx.stroke();

        // Plataforma de varredura
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(90, -55, 18, 18);

        // D. Corpo Decagonal Central da Sonda
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Disco de Ouro (The Golden Record) montado no chassi
        ctx.save();
        const recordGrad = ctx.createRadialGradient(-10, 8, 2, -10, 8, 14);
        recordGrad.addColorStop(0, '#fef08a');
        recordGrad.addColorStop(0.6, '#eab308');
        recordGrad.addColorStop(1, '#a16207');
        ctx.fillStyle = recordGrad;
        ctx.beginPath();
        ctx.arc(-10, 8, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // E. Antena Parabólica de Alto Ganho (HGA) de 3,7 metros
        ctx.save();
        ctx.rotate(-0.2);
        const dishGrad = ctx.createRadialGradient(0, -8, 10, 0, -8, 65);
        dishGrad.addColorStop(0, '#f8fafc');
        dishGrad.addColorStop(0.7, '#e2e8f0');
        dishGrad.addColorStop(1, '#94a3b8');

        ctx.fillStyle = dishGrad;
        ctx.beginPath();
        ctx.ellipse(0, -12, 65, 32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Sub-refletor Cassegrain central
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(0, -12, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tripé do alimentador de sinal
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-25, -12);
        ctx.lineTo(0, -32);
        ctx.lineTo(25, -12);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, -32, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // F. Feixe de Rádio Interestelar da Banda X em Direção à Terra
        ctx.save();
        const beamGrad = ctx.createLinearGradient(0, -40, 0, -150);
        beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
        beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-6, -40);
        ctx.lineTo(-40, -150);
        ctx.lineTo(40, -150);
        ctx.lineTo(6, -40);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.restore();
      }

      // =====================================================================
      // 0b) CASO ESPECIAL: ESTAÇÃO ESPACIAL INTERNACIONAL (ISS)
      // =====================================================================
      else if (body.id === 'iss') {
        ctx.save();
        ctx.translate(cx, cy);

        // A. Curvatura Azul de Fundo da Terra e Atmosfera
        ctx.save();
        const earthY = 280;
        const earthR = 340;
        const earthGrad = ctx.createRadialGradient(0, earthY, earthR * 0.7, 0, earthY, earthR);
        earthGrad.addColorStop(0, '#0284c7');
        earthGrad.addColorStop(0.5, '#0369a1');
        earthGrad.addColorStop(0.85, '#0f172a');
        earthGrad.addColorStop(1, '#020307');
        ctx.fillStyle = earthGrad;
        ctx.beginPath();
        ctx.arc(0, earthY, earthR, Math.PI, 0);
        ctx.fill();

        // Brilho azul de espalhamento da atmosfera
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, earthY, earthR, Math.PI, 0);
        ctx.stroke();

        // Nuvens espirais na Terra
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        const cOffset = (animTime * 8) % 200;
        ctx.beginPath();
        ctx.ellipse(-120 + cOffset, earthY - 40, 60, 16, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(80 - cOffset * 0.5, earthY - 25, 45, 12, -0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // B. Rotação orbital sutil da ISS
        const wobble = Math.sin(animTime * 0.4) * 0.04;
        ctx.rotate(wobble - 0.1);

        // C. Treliça Central Integrada (ITS - Integrated Truss Structure)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-170, -10);
        ctx.lineTo(170, -10);
        ctx.stroke();

        // Treliça reticulada detalhada
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        for (let t = -160; t <= 160; t += 20) {
          ctx.beginPath();
          ctx.moveTo(t, -18);
          ctx.lineTo(t, -2);
          ctx.stroke();
        }

        // D. 4 Pares de Painéis Solares Fotovoltaicos Gigantes (Solar Array Wings)
        const drawSolarWing = (x: number, y: number, sw: number, sh: number) => {
          ctx.save();
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          ctx.fillRect(x, y, sw, sh);
          ctx.strokeRect(x, y, sw, sh);

          const cellGrad = ctx.createLinearGradient(x, y, x + sw, y + sh);
          cellGrad.addColorStop(0, '#b45309');
          cellGrad.addColorStop(0.5, '#d97706');
          cellGrad.addColorStop(1, '#78350f');
          ctx.fillStyle = cellGrad;
          ctx.fillRect(x + 2, y + 2, sw - 4, sh - 4);

          ctx.strokeStyle = 'rgba(254, 243, 199, 0.4)';
          ctx.lineWidth = 0.8;
          for (let gy = y + 6; gy < y + sh; gy += 8) {
            ctx.beginPath();
            ctx.moveTo(x + 2, gy);
            ctx.lineTo(x + sw - 2, gy);
            ctx.stroke();
          }
          ctx.restore();
        };

        // Painéis bombordo (esquerda)
        drawSolarWing(-220, -75, 55, 45);
        drawSolarWing(-220, 10, 55, 45);
        drawSolarWing(-155, -75, 55, 45);
        drawSolarWing(-155, 10, 55, 45);

        // Painéis estibordo (direita)
        drawSolarWing(100, -75, 55, 45);
        drawSolarWing(100, 10, 55, 45);
        drawSolarWing(165, -75, 55, 45);
        drawSolarWing(165, 10, 55, 45);

        // Radiadores térmicos brancos
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.fillRect(-65, -45, 20, 32);
        ctx.strokeRect(-65, -45, 20, 32);
        ctx.fillRect(45, -45, 20, 32);
        ctx.strokeRect(45, -45, 20, 32);

        // E. Módulos Pressurizados Centrais (Destiny, Harmony, Kibo, Columbus, Zvezda)
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;

        // Módulo Laboratório Destiny & Node 2 Harmony
        ctx.beginPath();
        if ((ctx as any).roundRect) {
          (ctx as any).roundRect(-22, -40, 44, 28, 4);
        } else {
          ctx.rect(-22, -40, 44, 28);
        }
        ctx.fill();
        ctx.stroke();

        // Módulo Kibo (JAPÃO) à esquerda
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        if ((ctx as any).roundRect) {
          (ctx as any).roundRect(-48, -36, 24, 20, 3);
        } else {
          ctx.rect(-48, -36, 24, 20);
        }
        ctx.fill();
        ctx.stroke();

        // Módulo Columbus (ESA) à direita
        ctx.beginPath();
        if ((ctx as any).roundRect) {
          (ctx as any).roundRect(24, -36, 22, 20, 3);
        } else {
          ctx.rect(24, -36, 22, 20);
        }
        ctx.fill();
        ctx.stroke();

        // Módulo Zvezda & Zarya
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        if ((ctx as any).roundRect) {
          (ctx as any).roundRect(-16, -10, 32, 42, 4);
        } else {
          ctx.rect(-16, -10, 32, 42);
        }
        ctx.fill();
        ctx.stroke();

        // Cúpula de Observação (Cupola)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 34, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Canadarm2 (Braço Robótico Canadense)
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(18, -25);
        ctx.lineTo(36, -12);
        ctx.lineTo(48, -22);
        ctx.stroke();

        // Beacons luminosos
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(-220, -10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(220, -10, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // =====================================================================
      // 0c) CASO ESPECIAL: TELESCÓPIO ESPACIAL JAMES WEBB (JWST)
      // =====================================================================
      else if (body.id === 'jwst') {
        ctx.save();
        ctx.translate(cx, cy);
        const jwstWobble = Math.sin(animTime * 0.3) * 0.03;
        ctx.rotate(-0.15 + jwstWobble);

        // A. Escudo Solar de 5 Camadas de Kapton (Forma Diamante de Prata/Rosa)
        ctx.save();
        for (let s = 4; s >= 0; s--) {
          const sunOffset = s * 6;
          const sunGrad = ctx.createLinearGradient(-180, 70 + sunOffset, 180, 70 + sunOffset);
          if (s === 4) {
            sunGrad.addColorStop(0, '#fda4af');
            sunGrad.addColorStop(0.5, '#f43f5e');
            sunGrad.addColorStop(1, '#fb7185');
          } else {
            sunGrad.addColorStop(0, '#e2e8f0');
            sunGrad.addColorStop(0.5, '#cbd5e1');
            sunGrad.addColorStop(1, '#94a3b8');
          }
          ctx.fillStyle = sunGrad;
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -35 + sunOffset);
          ctx.lineTo(170 - s * 4, 40 + sunOffset);
          ctx.lineTo(0, 105 + sunOffset);
          ctx.lineTo(-170 + s * 4, 40 + sunOffset);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();

        // Ônibus Espacial (Spacecraft Bus)
        ctx.fillStyle = '#334155';
        ctx.fillRect(-25, 80, 50, 22);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-15, 102, 30, 16);

        // B. Suporte Traseiro dos Espelhos (Backplane)
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -25, 68, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // C. Espelho Primário de 18 Segmentos Hexagonais Banhados a Ouro
        const drawHexagon = (hx: number, hy: number, radius: number) => {
          ctx.save();
          const hexGrad = ctx.createRadialGradient(hx - radius * 0.3, hy - radius * 0.3, 1, hx, hy, radius);
          hexGrad.addColorStop(0, '#fef08a');
          hexGrad.addColorStop(0.5, '#eab308');
          hexGrad.addColorStop(1, '#ca8a04');
          ctx.fillStyle = hexGrad;
          ctx.strokeStyle = '#854d0e';
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + Math.PI / 6;
            const px = hx + radius * Math.cos(angle);
            const py = hy + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        };

        const hexR = 14.5;
        const dx = hexR * Math.sqrt(3);
        const dy = hexR * 1.5;

        const hexCenters: [number, number][] = [
          [dx, 0], [dx * 0.5, dy], [-dx * 0.5, dy],
          [-dx, 0], [-dx * 0.5, -dy], [dx * 0.5, -dy],
          [dx * 2, 0], [dx * 1.5, dy], [dx, dy * 2], [0, dy * 2],
          [-dx, dy * 2], [-dx * 1.5, dy], [-dx * 2, 0],
          [-dx * 1.5, -dy], [-dx, -dy * 2], [0, -dy * 2],
          [dx, -dy * 2], [dx * 1.5, -dy],
        ];

        for (const [hx, hy] of hexCenters) {
          drawHexagon(hx, hy - 25, hexR);
        }

        // Abertura Central
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.arc(0, -25, 9, 0, Math.PI * 2);
        ctx.fill();

        // D. Tripé do Espelho Secundário
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-45, 12);
        ctx.lineTo(0, -95);
        ctx.lineTo(45, 12);
        ctx.moveTo(0, -75);
        ctx.lineTo(0, -95);
        ctx.stroke();

        // Espelho Secundário
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -95, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Picos de difração hexagonais característicos do JWST
        ctx.save();
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
        ctx.lineWidth = 1.2;
        for (let a = 0; a < 6; a++) {
          const spikeAngle = (Math.PI / 3) * a;
          ctx.beginPath();
          ctx.moveTo(0, -25);
          ctx.lineTo(Math.cos(spikeAngle) * 95, -25 + Math.sin(spikeAngle) * 95);
          ctx.stroke();
        }
        ctx.restore();

        ctx.restore();
      }

      // =====================================================================
      // 0d) CASO ESPECIAL: PULSAR DO CARANGUEJO (PSR B0531+21)
      // =====================================================================
      else if (body.id === 'crab_pulsar') {
        ctx.save();
        ctx.translate(cx, cy);

        // A. Remanescente da Supernova Filamentar
        ctx.save();
        for (let f = 0; f < 16; f++) {
          const fAngle = (f * Math.PI) / 8 + Math.sin(animTime * 0.5 + f) * 0.1;
          const fDist = 110 + (f % 5) * 15;
          ctx.strokeStyle = f % 2 === 0 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(249, 115, 22, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(
            Math.cos(fAngle + 0.3) * (fDist * 0.7),
            Math.sin(fAngle + 0.3) * (fDist * 0.7),
            Math.cos(fAngle) * fDist,
            Math.sin(fAngle) * fDist
          );
          ctx.stroke();
        }
        ctx.restore();

        // B. Toros de Radiação Síncrotron Relativística
        ctx.save();
        const spinAngle = animTime * 4;
        ctx.rotate(-0.4);

        for (let ring = 1; ring <= 4; ring++) {
          const rRadius = ring * 24;
          const rAlpha = (1 - ring * 0.2) * diskBrightness;
          ctx.strokeStyle = `rgba(56, 189, 248, ${rAlpha})`;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, rRadius * 1.6, rRadius * 0.55, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // C. Jatos Relativísticos e Cones de Radiação (Farol Cósmico)
        const sweepFactor = Math.sin(spinAngle);
        const beamIntensity = Math.max(0.1, Math.abs(sweepFactor));

        const beamGradN = ctx.createLinearGradient(0, 0, 0, -170);
        beamGradN.addColorStop(0, `rgba(255, 255, 255, ${0.95 * beamIntensity})`);
        beamGradN.addColorStop(0.2, `rgba(168, 85, 247, ${0.8 * beamIntensity})`);
        beamGradN.addColorStop(0.7, `rgba(56, 189, 248, ${0.4 * beamIntensity})`);
        beamGradN.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = beamGradN;
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(-40 * sweepFactor, -170);
        ctx.lineTo(40 * sweepFactor, -170);
        ctx.lineTo(6, 0);
        ctx.closePath();
        ctx.fill();

        const beamGradS = ctx.createLinearGradient(0, 0, 0, 170);
        beamGradS.addColorStop(0, `rgba(255, 255, 255, ${0.95 * beamIntensity})`);
        beamGradS.addColorStop(0.2, `rgba(168, 85, 247, ${0.8 * beamIntensity})`);
        beamGradS.addColorStop(0.7, `rgba(56, 189, 248, ${0.4 * beamIntensity})`);
        beamGradS.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = beamGradS;
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(40 * sweepFactor, 170);
        ctx.lineTo(-40 * sweepFactor, 170);
        ctx.lineTo(6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // D. Estrela de Nêutrons Central
        ctx.save();
        const pulsarGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
        pulsarGrad.addColorStop(0, '#ffffff');
        pulsarGrad.addColorStop(0.4, '#c084fc');
        pulsarGrad.addColorStop(0.8, '#38bdf8');
        pulsarGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
        ctx.fillStyle = pulsarGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.restore();
      }

      // =====================================================================
      // 0e) CASO ESPECIAL: MAGNETAR SGR 1806-20 (CAMPO MAGNÉTICO DE 10^15 GAUSS)
      // =====================================================================
      else if (body.id === 'magnetar_1806') {
        ctx.save();
        ctx.translate(cx, cy);

        // A. Linhas de Campo Magnético Colossais Torcidas
        ctx.save();
        const magTime = animTime * 1.2;
        ctx.rotate(-0.2);

        for (let m = 1; m <= 6; m++) {
          const mRadius = m * 26;
          ctx.strokeStyle = `rgba(147, 197, 253, ${0.45 - m * 0.05})`;
          ctx.lineWidth = 1.8;

          ctx.beginPath();
          ctx.ellipse(-mRadius * 0.6, 0, mRadius * 0.7, mRadius * 1.1, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(mRadius * 0.6, 0, mRadius * 0.7, mRadius * 1.1, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // B. Megaflare de Raios Gama
        const flarePulse = Math.sin(magTime * 2.5);
        if (flarePulse > 0.3) {
          const flareIntensity = (flarePulse - 0.3) / 0.7;
          const flareGrad = ctx.createLinearGradient(0, 0, 120, -140);
          flareGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * flareIntensity})`);
          flareGrad.addColorStop(0.3, `rgba(251, 191, 36, ${0.85 * flareIntensity})`);
          flareGrad.addColorStop(0.7, `rgba(239, 68, 68, ${0.5 * flareIntensity})`);
          flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = flareGrad;
          ctx.beginPath();
          ctx.moveTo(-10, -5);
          ctx.lineTo(80, -150);
          ctx.lineTo(150, -90);
          ctx.lineTo(10, 5);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // C. Superfície da Estrela de Nêutrons com Fissuras de Starquake Incandescentes
        ctx.save();
        const magR = 36;
        const magGrad = ctx.createRadialGradient(-magR * 0.3, -magR * 0.3, 3, 0, 0, magR);
        magGrad.addColorStop(0, '#e2e8f0');
        magGrad.addColorStop(0.5, '#475569');
        magGrad.addColorStop(0.9, '#1e293b');
        magGrad.addColorStop(1, '#020617');
        ctx.fillStyle = magGrad;
        ctx.beginPath();
        ctx.arc(0, 0, magR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(-18, -12);
        ctx.lineTo(-4, 0);
        ctx.lineTo(12, -8);
        ctx.lineTo(24, 6);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-10, 14);
        ctx.lineTo(2, 8);
        ctx.lineTo(16, 20);
        ctx.stroke();
        ctx.restore();

        // D. Halo QED
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // =====================================================================
      // 1) RENDERIZADOR: SAGITTARIUS A* (MORFOLOGIA EHT 2022)
      // =====================================================================
      else if (body.id === 'sgra') {
        const rH = 44;

        // A. Resplendor Difuso Dourado (Milky Way Galactic Center Glow)
        ctx.save();
        const bgHalo = ctx.createRadialGradient(cx, cy, rH * 0.5, cx, cy, rH * 3.5);
        bgHalo.addColorStop(0, `rgba(251, 146, 60, ${0.45 * diskBrightness})`);
        bgHalo.addColorStop(0.5, `rgba(194, 65, 12, ${0.2 * diskBrightness})`);
        bgHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bgHalo;
        ctx.beginPath();
        ctx.arc(cx, cy, rH * 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // B. Anel de Plasma Quente com 3 Nódulos de Emissão (Assinatura EHT)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(animTime * 0.15); // Rotação lenta orbital dos hot spots

        // Anel base
        const ringGrad = ctx.createRadialGradient(0, 0, rH * 0.8, 0, 0, rH * 1.9);
        ringGrad.addColorStop(0, 'rgba(0,0,0,0)');
        ringGrad.addColorStop(0.35, `rgba(251, 146, 60, ${0.9 * diskBrightness})`);
        ringGrad.addColorStop(0.6, `rgba(254, 215, 170, ${0.95 * diskBrightness})`);
        ringGrad.addColorStop(0.85, `rgba(234, 88, 12, ${0.6 * diskBrightness})`);
        ringGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = ringGrad;
        ctx.beginPath();
        ctx.arc(0, 0, rH * 1.9, 0, Math.PI * 2);
        ctx.fill();

        // 3 Pontos Quentes (Hot Spots observados pelo EHT na ISCO)
        const hotSpots = [
          { angle: 0.2, intensity: 1.0 },
          { angle: 2.1, intensity: 0.85 },
          { angle: 4.2, intensity: 0.7 },
        ];

        for (const spot of hotSpots) {
          const sx = Math.cos(spot.angle) * rH * 1.35;
          const sy = Math.sin(spot.angle) * rH * 1.35;
          const spotGrad = ctx.createRadialGradient(sx, sy, 2, sx, sy, rH * 0.65);
          spotGrad.addColorStop(0, `rgba(255, 255, 240, ${spot.intensity * diskBrightness})`);
          spotGrad.addColorStop(0.4, `rgba(251, 191, 36, ${0.85 * spot.intensity * diskBrightness})`);
          spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = spotGrad;
          ctx.beginPath();
          ctx.arc(sx, sy, rH * 0.65, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // C. Sombra do Horizonte de Eventos Central (Pitch Black)
        ctx.save();
        ctx.fillStyle = '#010204';
        ctx.beginPath();
        ctx.arc(cx, cy, rH * 0.92, 0, Math.PI * 2);
        ctx.fill();

        // Anel de fótons ultrafino
        ctx.strokeStyle = `rgba(255, 240, 200, ${0.85 * diskBrightness})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, rH * 0.94, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // =====================================================================
      // 2) RENDERIZADOR: BURACO NEGRO RELATIVÍSTICO DE KERR (M87*, TON 618, CYGNUS X-1)
      // =====================================================================
      else if (body.isBlackHole || body.id === 'm87' || body.id === 'cygnus_x1' || body.id === 'cygnus-x1' || body.id === 'ton618') {
        const rH = 46;
        const incRad = (inclinationDeg * Math.PI) / 180;
        const sinInc = Math.sin(incRad);
        const cosInc = Math.cos(incRad);

        // A. Jato Polar Relativístico para M87* e TON 618
        if (body.id === 'm87' || body.id === 'ton618') {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-0.35);

          const jetLength = 175;
          const jetGradTop = ctx.createLinearGradient(0, 0, 0, -jetLength);
          jetGradTop.addColorStop(0, 'rgba(0, 229, 255, 0.95)');
          jetGradTop.addColorStop(0.3, 'rgba(56, 189, 248, 0.6)');
          jetGradTop.addColorStop(0.7, 'rgba(99, 102, 241, 0.25)');
          jetGradTop.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = jetGradTop;
          ctx.beginPath();
          ctx.moveTo(-rH * 0.2, 0);
          ctx.lineTo(-rH * 0.8, -jetLength);
          ctx.lineTo(rH * 0.8, -jetLength);
          ctx.lineTo(rH * 0.2, 0);
          ctx.closePath();
          ctx.fill();

          // Receding bottom jet
          const jetGradBottom = ctx.createLinearGradient(0, 0, 0, jetLength);
          jetGradBottom.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
          jetGradBottom.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
          jetGradBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = jetGradBottom;
          ctx.beginPath();
          ctx.moveTo(-rH * 0.2, 0);
          ctx.lineTo(-rH * 0.55, jetLength);
          ctx.lineTo(rH * 0.55, jetLength);
          ctx.lineTo(rH * 0.2, 0);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }

        // B. Estrela Companheira Supergigante Azul (Cygnus X-1)
        if (body.id === 'cygnus_x1' || body.id === 'cygnus-x1') {
          ctx.save();
          // Estrela Azul HDE 226868 à direita
          const starX = cx + 130;
          const starY = cy - 25;
          const blueStarGrad = ctx.createRadialGradient(starX, starY, 5, starX, starY, 40);
          blueStarGrad.addColorStop(0, '#ffffff');
          blueStarGrad.addColorStop(0.4, '#38bdf8');
          blueStarGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
          ctx.fillStyle = blueStarGrad;
          ctx.beginPath();
          ctx.arc(starX, starY, 40, 0, Math.PI * 2);
          ctx.fill();

          // Fluxo de Transferência de Massa de Roche Lobe (Arco de gás fluindo)
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(starX - 15, starY + 5);
          ctx.quadraticCurveTo(cx + 60, cy - 35, cx + 25, cy);
          ctx.stroke();
          ctx.restore();
        }

        // C. Lente Gravitacional: Arco Superior do Disco (Arco de Einstein)
        ctx.save();
        const topArcGrad = ctx.createRadialGradient(cx, cy - rH * 0.5, rH * 0.8, cx, cy - rH * 0.5, rH * 2.3);
        topArcGrad.addColorStop(0, `rgba(255, 240, 180, ${0.9 * diskBrightness})`);
        topArcGrad.addColorStop(0.35, `rgba(251, 146, 60, ${0.8 * diskBrightness})`);
        topArcGrad.addColorStop(0.75, `rgba(220, 38, 38, ${0.4 * diskBrightness})`);
        topArcGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = topArcGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy - rH * 0.55, rH * 2.1, rH * 1.35 * sinInc, 0, Math.PI, 0);
        ctx.fill();

        // Arco Inferior
        const botArcGrad = ctx.createRadialGradient(cx, cy + rH * 0.4, rH * 0.8, cx, cy + rH * 0.4, rH * 1.9);
        botArcGrad.addColorStop(0, `rgba(251, 146, 60, ${0.65 * diskBrightness})`);
        botArcGrad.addColorStop(0.6, `rgba(185, 28, 28, ${0.3 * diskBrightness})`);
        botArcGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = botArcGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy + rH * 0.45, rH * 1.85, rH * 0.9 * sinInc, 0, 0, Math.PI);
        ctx.fill();
        ctx.restore();

        // D. Disco de Acreção Frontal com Doppler Beaming Relativístico
        ctx.save();
        const diskRx = rH * 3.2;
        const diskRy = rH * 3.2 * Math.max(0.15, cosInc);

        const diskGrad = ctx.createLinearGradient(cx - diskRx, cy, cx + diskRx, cy);
        diskGrad.addColorStop(0, `rgba(254, 215, 170, ${0.2 * diskBrightness})`);
        diskGrad.addColorStop(0.18, `rgba(255, 255, 255, ${0.95 * diskBrightness})`); // Blueshift intenso
        diskGrad.addColorStop(0.28, `rgba(56, 189, 248, ${0.9 * diskBrightness})`);
        diskGrad.addColorStop(0.45, `rgba(251, 146, 60, ${0.85 * diskBrightness})`);
        diskGrad.addColorStop(0.65, `rgba(239, 68, 68, ${0.5 * diskBrightness})`);
        diskGrad.addColorStop(0.85, `rgba(153, 27, 27, ${0.25 * diskBrightness})`); // Redshift
        diskGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = diskGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, diskRx, diskRy, 0, 0, Math.PI * 2);
        ctx.fill();

        // Estrias de turbulência
        ctx.strokeStyle = `rgba(255, 240, 200, ${0.25 * diskBrightness})`;
        ctx.lineWidth = 1.5;
        for (let rOffset = 0.6; rOffset <= 1.0; rOffset += 0.12) {
          ctx.beginPath();
          ctx.ellipse(cx, cy, diskRx * rOffset, diskRy * rOffset, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // E. Sombra Negra do Horizonte de Eventos
        const oblateFactor = 1 - spinA * 0.12;
        ctx.save();
        ctx.fillStyle = '#010204';
        ctx.beginPath();
        ctx.ellipse(cx + spinA * 4, cy, rH * 1.05, rH * oblateFactor, 0, 0, Math.PI * 2);
        ctx.fill();

        // Esfera de Fótons (Photon Ring)
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * diskBrightness})`;
        ctx.lineWidth = 2.0;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.ellipse(cx + spinA * 4, cy, rH * 1.08, rH * (oblateFactor * 1.02), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Metade frontal do disco sobreposta
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, cy, w, h / 2);
        ctx.clip();

        const foreDiskGrad = ctx.createLinearGradient(cx - diskRx, cy, cx + diskRx, cy);
        foreDiskGrad.addColorStop(0.15, `rgba(255, 255, 255, ${0.95 * diskBrightness})`);
        foreDiskGrad.addColorStop(0.35, `rgba(251, 146, 60, ${0.85 * diskBrightness})`);
        foreDiskGrad.addColorStop(0.75, `rgba(220, 38, 38, ${0.4 * diskBrightness})`);
        foreDiskGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = foreDiskGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, diskRx, diskRy, 0, 0, Math.PI);
        ctx.fill();
        ctx.restore();
      }

      // =====================================================================
      // 3) RENDERIZADOR: ESTRELAS (Sol, Betelgeuse, Sirius, Próxima Centauri, Vega)
      // =====================================================================
      else if (body.type.includes('Estrela') || body.id === 'sol' || body.id === 'betelgeuse' || body.id === 'sirius' || body.id === 'proxima' || body.id === 'proxima-centauri' || body.id === 'vega') {
        const starRadius = body.id === 'betelgeuse' ? 95 : body.id === 'sol' ? 70 : body.id === 'vega' ? 74 : 65;

        // A. Corona Radiante & Erupções Solares
        ctx.save();
        const coronaGrad = ctx.createRadialGradient(cx, cy, starRadius * 0.8, cx, cy, starRadius * 2.2);
        coronaGrad.addColorStop(0, body.glowColor);
        coronaGrad.addColorStop(0.6, 'rgba(255, 140, 0, 0.15)');
        coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, starRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Erupções de plasma na borda
        ctx.strokeStyle = body.color;
        ctx.lineWidth = 3;
        for (let p = 0; p < 6; p++) {
          const pAngle = (p * Math.PI) / 3 + Math.sin(animTime * 0.5 + p) * 0.2;
          const px1 = cx + Math.cos(pAngle) * starRadius;
          const py1 = cy + Math.sin(pAngle) * starRadius;
          const px2 = cx + Math.cos(pAngle + 0.2) * (starRadius + 18 + Math.sin(animTime * 2 + p) * 6);
          const py2 = cy + Math.sin(pAngle + 0.2) * (starRadius + 18 + Math.sin(animTime * 2 + p) * 6);
          const px3 = cx + Math.cos(pAngle + 0.4) * starRadius;
          const py3 = cy + Math.sin(pAngle + 0.4) * starRadius;

          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.quadraticCurveTo(px2, py2, px3, py3);
          ctx.stroke();
        }
        ctx.restore();

        // Disco circunstelar de poeira e detritos de Vega (IRAS/Spitzer)
        if (body.id === 'vega') {
          ctx.save();
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.ellipse(cx, cy, starRadius * 2.6, starRadius * 0.85, 0.25, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.ellipse(cx, cy, starRadius * 2.2, starRadius * 0.72, 0.25, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // B. Fotosfera com Escurecimento de Borda (Limb Darkening)
        ctx.save();
        const photoGrad = ctx.createRadialGradient(cx, cy, starRadius * 0.15, cx, cy, starRadius);
        if (body.id === 'sirius') {
          photoGrad.addColorStop(0, '#ffffff');
          photoGrad.addColorStop(0.7, '#67e8f9');
          photoGrad.addColorStop(1, '#0284c7');
        } else if (body.id === 'vega') {
          photoGrad.addColorStop(0, '#ffffff');
          photoGrad.addColorStop(0.4, '#bae6fd');
          photoGrad.addColorStop(0.8, '#60a5fa');
          photoGrad.addColorStop(1, '#1d4ed8');
        } else if (body.id === 'betelgeuse') {
          photoGrad.addColorStop(0, '#fef08a');
          photoGrad.addColorStop(0.6, '#ea580c');
          photoGrad.addColorStop(1, '#7f1d1d');
        } else {
          photoGrad.addColorStop(0, '#ffffff');
          photoGrad.addColorStop(0.5, '#fde047');
          photoGrad.addColorStop(0.85, '#f97316');
          photoGrad.addColorStop(1, '#c2410c');
        }

        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        if (body.id === 'vega') {
          // Achatamento polar devido à rotação vertiginosa de 274 km/s
          ctx.ellipse(cx, cy, starRadius * 1.15, starRadius * 0.92, 0.15, 0, Math.PI * 2);
        } else {
          ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
        }
        ctx.fill();

        // Células de granulação convectiva
        ctx.save();
        ctx.clip();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        for (let g = 0; g < 35; g++) {
          const gx = cx + (Math.sin(g * 3.7 + animTime) * starRadius * 0.85);
          const gy = cy + (Math.cos(g * 2.1 + animTime * 0.8) * starRadius * 0.85);
          ctx.beginPath();
          ctx.arc(gx, gy, 6 + (g % 5), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Picos de difração ópticos
        if (body.id === 'sirius' || body.id === 'sol' || body.id === 'vega') {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx - starRadius * 2.4, cy);
          ctx.lineTo(cx + starRadius * 2.4, cy);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx, cy - starRadius * 2.4);
          ctx.lineTo(cx, cy + starRadius * 2.4);
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
      }

      // =====================================================================
      // 4) RENDERIZADOR: PLANETAS E LUAS (Saturno, Júpiter, Terra, Marte, Urano, Netuno, Plutão, Lua, Ceres)
      // =====================================================================
      else if (body.sector === 'solar_system' || body.type.includes('Planeta') || body.type.includes('Satélite')) {
        const planetR = body.id === 'jupiter' ? 82
          : body.id === 'saturno' ? 70
          : (body.id === 'urano' || body.id === 'netuno') ? 66
          : (body.id === 'terra' || body.id === 'venus') ? 56
          : body.id === 'marte' ? 48
          : (body.id === 'mercurio' || body.id === 'lua') ? 38
          : (body.id === 'ceres' || body.id === 'plutao') ? 34
          : 50;

        // A. Metade Posterior dos Anéis de Saturno
        if (body.id === 'saturno') {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, w, cy + 4);
          ctx.clip();

          // Anel A
          ctx.beginPath();
          ctx.ellipse(cx, cy, planetR * 2.4, planetR * 0.72, -0.22, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.65)';
          ctx.lineWidth = 14;
          ctx.stroke();

          // Divisão de Cassini
          ctx.beginPath();
          ctx.ellipse(cx, cy, planetR * 2.18, planetR * 0.65, -0.22, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(2, 3, 7, 0.95)';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Anel B
          ctx.beginPath();
          ctx.ellipse(cx, cy, planetR * 1.95, planetR * 0.58, -0.22, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
          ctx.lineWidth = 18;
          ctx.stroke();
          ctx.restore();
        }

        // Metade Posterior dos Anéis Verticais de Urano (~98° de inclinação)
        if (body.id === 'urano') {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, cx, h);
          ctx.clip();
          ctx.beginPath();
          ctx.ellipse(cx, cy, planetR * 0.42, planetR * 2.2, 0.15, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(207, 250, 254, 0.55)';
          ctx.lineWidth = 6;
          ctx.stroke();
          ctx.restore();
        }

        // B. Esfera Planetária com Iluminação 3D
        ctx.save();
        const lightX = cx - planetR * 0.45;
        const lightY = cy - planetR * 0.45;

        const sphereGrad = ctx.createRadialGradient(lightX, lightY, planetR * 0.1, cx, cy, planetR);
        sphereGrad.addColorStop(0, body.color);
        sphereGrad.addColorStop(0.7, '#0f172a');
        sphereGrad.addColorStop(1, '#02040a');

        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
        ctx.fill();

        // Texturas específicas por planeta
        ctx.save();
        ctx.clip();

        if (body.id === 'terra') {
          // Oceanos e Continentes
          ctx.fillStyle = '#15803d';
          const tRot = (animTime * 15) % (planetR * 2);
          ctx.beginPath();
          ctx.ellipse(cx - planetR * 0.3 + (tRot % (planetR * 1.2)), cy - 10, 24, 38, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx + planetR * 0.4 - (tRot % (planetR * 0.8)), cy + 18, 18, 22, -0.2, 0, Math.PI * 2);
          ctx.fill();

          // Camada de nuvens
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          ctx.ellipse(cx - 20, cy - 25, 45, 12, 0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx + 15, cy + 20, 50, 14, -0.15, 0, Math.PI * 2);
          ctx.fill();
        } else if (body.id === 'jupiter') {
          // Cinturões equatoriais de Júpiter
          ctx.fillStyle = 'rgba(180, 83, 9, 0.55)';
          ctx.fillRect(cx - planetR, cy - 26, planetR * 2, 14);
          ctx.fillRect(cx - planetR, cy + 12, planetR * 2, 16);

          // Grande Mancha Vermelha (anticiclone gigante)
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.ellipse(cx + planetR * 0.28, cy + 20, 16, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (body.id === 'marte') {
          // Calota Polar Norte
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(cx, cy - planetR + 8, 16, 7, 0, 0, Math.PI * 2);
          ctx.fill();
          // Valles Marineris (fenda escura)
          ctx.strokeStyle = 'rgba(69, 10, 10, 0.7)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx - 30, cy + 5);
          ctx.lineTo(cx + 35, cy + 2);
          ctx.stroke();
        } else if (body.id === 'urano') {
          // Faixas atmosféricas ciano límpidas
          ctx.fillStyle = 'rgba(165, 243, 252, 0.25)';
          ctx.fillRect(cx - planetR, cy - 18, planetR * 2, 8);
          ctx.fillRect(cx - planetR, cy + 10, planetR * 2, 10);
        } else if (body.id === 'netuno') {
          // Tempestades de alta velocidade e Grande Mancha Escura
          ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
          ctx.beginPath();
          ctx.ellipse(cx - planetR * 0.25, cy - 12, 18, 11, 0.1, 0, Math.PI * 2);
          ctx.fill();

          // Nuvens cirros de metano em branco brilhante
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.ellipse(cx + 10, cy - 8, 25, 4, -0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx - 15, cy + 18, 30, 5, 0.08, 0, Math.PI * 2);
          ctx.fill();
        } else if (body.id === 'plutao') {
          // Geleira em forma de coração Sputnik Planitia
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.ellipse(cx - 5, cy - 3, 14, 16, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx + 7, cy - 5, 11, 13, -0.2, 0, Math.PI * 2);
          ctx.fill();

          // Terrenos escuros de tolina (Cthulhu Macula)
          ctx.fillStyle = 'rgba(69, 26, 3, 0.85)';
          ctx.beginPath();
          ctx.ellipse(cx - 16, cy + 14, 16, 9, 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (body.id === 'lua') {
          // Mares basálticos escuros (Mare Tranquillitatis, Mare Imbrium)
          ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
          ctx.beginPath();
          ctx.ellipse(cx - 10, cy - 8, 14, 11, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx + 12, cy - 3, 11, 13, -0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx - 2, cy + 11, 12, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Raios de impacto brilhantes da cratera Tycho
          ctx.strokeStyle = 'rgba(241, 245, 249, 0.45)';
          ctx.lineWidth = 1;
          const tychoX = cx + 8;
          const tychoY = cy + 16;
          for (let r = 0; r < 8; r++) {
            const rAng = (r * Math.PI) / 4;
            ctx.beginPath();
            ctx.moveTo(tychoX, tychoY);
            ctx.lineTo(tychoX + Math.cos(rAng) * 28, tychoY + Math.sin(rAng) * 28);
            ctx.stroke();
          }
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(tychoX, tychoY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (body.id === 'ceres') {
          // Cratera Occator e manchas de carbonato de sódio reluzentes
          ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
          ctx.beginPath();
          ctx.ellipse(cx + 6, cy - 5, 11, 8, 0.1, 0, Math.PI * 2);
          ctx.fill();

          // Cerealia Facula
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#e2e8f0';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(cx + 6, cy - 5, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Lua Caronte orbitando Plutão
        if (body.id === 'plutao') {
          const charonAngle = animTime * 0.6;
          const charonX = cx + Math.cos(charonAngle) * (planetR * 1.8);
          const charonY = cy + Math.sin(charonAngle) * (planetR * 0.7);
          ctx.save();
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(charonX, charonY, 10, 0, Math.PI * 2);
          ctx.fill();
          // Calota norte avermelhada de Caronte (Mordor Macula)
          ctx.fillStyle = '#7f1d1d';
          ctx.beginPath();
          ctx.arc(charonX, charonY - 5, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // C. Sombra do Planeta projetada nos Anéis de Saturno (Metade frontal)
        if (body.id === 'saturno') {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, cy - 4, w, h);
          ctx.clip();

          // Anel A
          ctx.beginPath();
          ctx.ellipse(cx, cy, planetR * 2.4, planetR * 0.72, -0.22, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.65)';
          ctx.lineWidth = 14;
          ctx.stroke();

          // Divisão de Cassini
          ctx.beginPath();
          ctx.ellipse(cx, cy, planetR * 2.18, planetR * 0.65, -0.22, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(2, 3, 7, 0.95)';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Anel B
          ctx.beginPath();
          ctx.ellipse(cx, cy, planetR * 1.95, planetR * 0.58, -0.22, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
          ctx.lineWidth = 18;
          ctx.stroke();
          ctx.restore();
        }

        // Metade Frontal dos Anéis Verticais de Urano
        if (body.id === 'urano') {
          ctx.save();
          ctx.beginPath();
          ctx.rect(cx, 0, w, h);
          ctx.clip();
          ctx.beginPath();
          ctx.ellipse(cx, cy, planetR * 0.42, planetR * 2.2, 0.15, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(207, 250, 254, 0.55)';
          ctx.lineWidth = 6;
          ctx.stroke();
          ctx.restore();
        }

        // D. Borda Atmosférica (Espalhamento Rayleigh azul na Terra / Urano / Netuno)
        if (showAtmosphere && (body.id === 'terra' || body.id === 'venus' || body.id === 'urano' || body.id === 'netuno')) {
          ctx.save();
          ctx.strokeStyle = body.id === 'terra' ? 'rgba(56, 189, 248, 0.6)'
            : body.id === 'venus' ? 'rgba(253, 224, 71, 0.5)'
            : body.id === 'urano' ? 'rgba(165, 243, 252, 0.5)'
            : 'rgba(59, 130, 246, 0.7)';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(cx, cy, planetR + 1.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
      }

      // =====================================================================
      // 5) RENDERIZADOR: ESPAÇO PROFUNDO, NEBULOSAS E GALÁXIAS
      // =====================================================================
      else if (body.id === 'm42_orion') {
        // Nebulosa de Órion (M42): Berçário estelar com nuvens H-alfa e O-III
        ctx.save();
        ctx.translate(cx, cy);

        const nebTime = animTime * 0.2;
        for (let cloud = 0; cloud < 6; cloud++) {
          const cAng = (cloud * Math.PI) / 3 + Math.sin(nebTime + cloud) * 0.1;
          const cDist = 35 + cloud * 14;
          const cGrad = ctx.createRadialGradient(
            Math.cos(cAng) * cDist, Math.sin(cAng) * cDist, 5,
            Math.cos(cAng) * cDist, Math.sin(cAng) * cDist, 100
          );
          if (cloud % 2 === 0) {
            cGrad.addColorStop(0, 'rgba(236, 72, 153, 0.55)');
            cGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.25)');
            cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            cGrad.addColorStop(0, 'rgba(45, 212, 191, 0.5)');
            cGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
            cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          }
          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.arc(Math.cos(cAng) * cDist, Math.sin(cAng) * cDist, 100, 0, Math.PI * 2);
          ctx.fill();
        }

        // Aglomerado Central Trapezium (4 estrelas massivas)
        const trapStars = [
          [-8, -6], [6, -10], [10, 8], [-4, 10]
        ];
        for (const [tx, ty] of trapStars) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#67e8f9';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(tx, ty, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      else if (body.id === 'pleiades') {
        // Aglomerado das Plêiades (M45): Estrelas azuis B envolvidas em véu de reflexão Rayleigh
        ctx.save();
        ctx.translate(cx, cy);

        // Véu de poeira azul safira
        const veilGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 160);
        veilGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        veilGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
        veilGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = veilGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 160, 0, Math.PI * 2);
        ctx.fill();

        // As Sete Irmãs
        const sisters = [
          { x: -30, y: 15, r: 6.5 },
          { x: 35, y: -25, r: 5.5 },
          { x: -80, y: 30, r: 5.0 },
          { x: 10, y: 55, r: 5.2 },
          { x: 65, y: -45, r: 4.5 },
          { x: 95, y: 10, r: 4.8 },
          { x: -45, y: -35, r: 4.2 },
        ];

        for (const star of sisters) {
          const sGrad = ctx.createRadialGradient(star.x, star.y, 1, star.x, star.y, star.r * 5);
          sGrad.addColorStop(0, '#ffffff');
          sGrad.addColorStop(0.3, '#38bdf8');
          sGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = sGrad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x - star.r * 3, star.y);
          ctx.lineTo(star.x + star.r * 3, star.y);
          ctx.moveTo(star.x, star.y - star.r * 3);
          ctx.lineTo(star.x, star.y + star.r * 3);
          ctx.stroke();
        }
        ctx.restore();
      }

      else if (body.id === 'm51_whirlpool') {
        // Galáxia do Redemoinho (M51): Espiral com nódulos rosa HII e companheira NGC 5195
        ctx.save();
        ctx.translate(cx - 30, cy + 15);
        ctx.rotate(animTime * 0.08);

        // Núcleo brilhante
        const m51Core = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
        m51Core.addColorStop(0, '#ffffff');
        m51Core.addColorStop(0.4, '#fef08a');
        m51Core.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = m51Core;
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, Math.PI * 2);
        ctx.fill();

        // Braços Espirais
        for (let arm = 0; arm < 2; arm++) {
          const armOffset = arm * Math.PI;
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.45)';
          ctx.lineWidth = 14;
          ctx.beginPath();
          for (let theta = 0; theta < Math.PI * 2.5; theta += 0.12) {
            const r = 6 + Math.pow(theta, 1.7) * 9;
            const x = Math.cos(theta + armOffset) * r;
            const y = Math.sin(theta + armOffset) * r;
            if (theta === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            if (theta > 1.2 && Math.sin(theta * 5) > 0.6) {
              ctx.save();
              ctx.fillStyle = '#f43f5e';
              ctx.beginPath();
              ctx.arc(x, y, 3.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
          ctx.stroke();
        }

        // Companheira NGC 5195 e ponte de maré
        const compX = 130;
        const compY = -80;
        ctx.strokeStyle = 'rgba(253, 230, 138, 0.35)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(70, -25);
        ctx.quadraticCurveTo(100, -50, compX, compY);
        ctx.stroke();

        const compGrad = ctx.createRadialGradient(compX, compY, 2, compX, compY, 32);
        compGrad.addColorStop(0, '#fef3c7');
        compGrad.addColorStop(0.5, '#f59e0b');
        compGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = compGrad;
        ctx.beginPath();
        ctx.arc(compX, compY, 32, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Galáxias espirais genéricas (Andrômeda, Sombrero, Via Láctea)
      else {
        ctx.save();
        const galR = 115;
        const galRot = animTime * 0.1;

        // Bulbo Central Laranja/Branco
        const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, galR * 0.35);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.3, '#fef08a');
        coreGrad.addColorStop(0.7, '#f59e0b');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, galR * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Braços Espirais Logarítmicos
        ctx.translate(cx, cy);
        ctx.rotate(galRot);
        for (let arm = 0; arm < 2; arm++) {
          const armOffset = arm * Math.PI;
          ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
          ctx.lineWidth = 16;
          ctx.beginPath();
          for (let theta = 0; theta < Math.PI * 2.8; theta += 0.15) {
            const r = 8 + Math.pow(theta, 1.8) * 8;
            const x = Math.cos(theta + armOffset) * r;
            const y = Math.sin(theta + armOffset) * r * 0.55; // Inclinação da galáxia
            if (theta === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(renderFrame);
    }

    animId = requestAnimationFrame(renderFrame);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [body, spinA, inclinationDeg, diskBrightness, showAtmosphere]);

  const isBlackHole =
    body.isBlackHole || body.id === 'sgra' || body.id === 'm87' || body.id === 'cygnus_x1' || body.id === 'cygnus-x1' || body.id === 'ton618';

  const isExtremeCompact = body.id === 'crab_pulsar' || body.id === 'magnetar_1806';

  return (
    <div className="cr3d-container">
      <div className="cr3d-viewport">
        <canvas
          ref={canvasRef}
          width={640}
          height={380}
          className="cr3d-canvas"
        />

        {/* Tactical HUD Coordinates Overlaid */}
        <div className="cr3d-badge-top-left">
          <span className="cr3d-pulse-dot" />
          <span className="cr3d-status-tag">
            {isLaymanMode ? 'SIMULAÇÃO DIDÁTICA 60 FPS' : 'SIM // 60 FPS RELATIVÍSTICO'}
          </span>
        </div>

        <div className="cr3d-badge-bottom-right">
          {body.designation}
        </div>
      </div>

      {/* Atmospheric toggle for terrestrial and icy giant planets */}
      {(body.id === 'terra' || body.id === 'venus' || body.id === 'urano' || body.id === 'netuno') && (
        <div className="cr3d-atmo-box">
          <span className="cr3d-atmo-title">
            {isLaymanMode ? 'Camada Atmosférica & Nuvens' : 'CAMADA ATMOSFÉRICA & NUVENS'}
          </span>
          <button
            type="button"
            onClick={() => setShowAtmosphere(!showAtmosphere)}
            className={`cr3d-toggle-btn ${showAtmosphere ? 'active' : ''}`}
          >
            {showAtmosphere ? 'ATIVADO' : 'DESATIVADO'}
          </button>
        </div>
      )}

      {/* Physics Control Sliders for Extreme Compact Objects (Pulsar / Magnetar) */}
      {isExtremeCompact && (
        <div className="cr3d-sliders-box">
          <div className="cr3d-slider-item">
            <div className="cr3d-slider-header">
              <span>{isLaymanMode ? 'INTENSIDADE DA EMISSÃO / FLUXO:' : 'POTÊNCIA SÍNCROTRON / PULSAR:'}</span>
              <strong className="cr3d-slider-val">{(diskBrightness * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.8"
              step="0.05"
              value={diskBrightness}
              onChange={e => setDiskBrightness(parseFloat(e.target.value))}
              className="cr3d-range-input"
            />
          </div>
        </div>
      )}

      {/* Physics Control Sliders for Kerr Black Holes and Stars */}
      {isBlackHole && (
        <div className="cr3d-sliders-box">
          <div className="cr3d-slider-item">
            <div className="cr3d-slider-header">
              <span>{isLaymanMode ? 'ROTAÇÃO DO BURACO (Spin):' : 'SPIN DE KERR (a*):'}</span>
              <strong className="cr3d-slider-val">{spinA.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.99"
              step="0.01"
              value={spinA}
              onChange={e => setSpinA(parseFloat(e.target.value))}
              className="cr3d-range-input"
            />
          </div>

          <div className="cr3d-slider-item">
            <div className="cr3d-slider-header">
              <span>{isLaymanMode ? 'INCLINAÇÃO DE VISÃO:' : 'INCLINAÇÃO (θ):'}</span>
              <strong className="cr3d-slider-val">{inclinationDeg}°</strong>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="1"
              value={inclinationDeg}
              onChange={e => setInclinationDeg(parseInt(e.target.value))}
              className="cr3d-range-input"
            />
          </div>

          <div className="cr3d-slider-item">
            <div className="cr3d-slider-header">
              <span>{isLaymanMode ? 'BRILHO DO DISCO:' : 'LUMINOSIDADE DISCO:'}</span>
              <strong className="cr3d-slider-val">{(diskBrightness * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.05"
              value={diskBrightness}
              onChange={e => setDiskBrightness(parseFloat(e.target.value))}
              className="cr3d-range-input"
            />
          </div>
        </div>
      )}
    </div>
  );
}
