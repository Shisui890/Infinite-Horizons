import { useState, useRef, useEffect, useId } from 'react';
import { MinkowskiCalculus } from '../../engine/MinkowskiCalculus';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface BlackHolePreset {
  name: string;
  massSolar: number;
  spin: number;
  desc: string;
  type: string;
}

const PRESETS: Record<string, BlackHolePreset> = {
  sgra: {
    name: 'Sagittarius A*',
    massSolar: 4.3e6,
    spin: 0.9,
    desc: 'Buraco Negro Supermassivo no coração da nossa Via Láctea (a ~26.000 anos-luz da Terra).',
    type: 'Supermassivo',
  },
  m87: {
    name: 'M87*',
    massSolar: 6.5e9,
    spin: 0.94,
    desc: 'O primeiro buraco negro imageado diretamente pela humanidade via EHT na galáxia Messier 87.',
    type: 'Supermassivo Gigante',
  },
  cygnus: {
    name: 'Cygnus X-1',
    massSolar: 21.2,
    spin: 0.97,
    desc: 'Primeiro candidato a buraco negro aceito na história (sistema binário na constelação do Cisne).',
    type: 'Estelar',
  },
  ton618: {
    name: 'TON 618',
    massSolar: 6.6e10,
    spin: 0.99,
    desc: 'Um dos maiores buracos negros conhecidos no cosmos; quasar hiperluminoso a 10,8 bilhões de anos-luz.',
    type: 'Quasar Hipermassivo',
  },
};

export default function BlackHoleGraphic() {
  const { isLaymanMode } = useLaymanMode();
  const [selectedPreset, setSelectedPreset] = useState<string>('sgra');
  const [spinA, setSpinA] = useState<number>(0.92);
  const [inclinationDeg, setInclinationDeg] = useState<number>(75);
  const [accretionRate, setAccretionRate] = useState<number>(1.0);
  const [isDopplerEnabled, setIsDopplerEnabled] = useState<boolean>(true);

  const preset = PRESETS[selectedPreset];
  const massSolar = preset.massSolar;

  const kerrData = MinkowskiCalculus.calculateKerrMetric(massSolar, spinA, inclinationDeg);
  const hawkingData = MinkowskiCalculus.calculateHawkingThermodynamics(massSolar);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const spinId = useId();
  const inclinationId = useId();
  const accretionId = useId();

  // Particle simulation for accretion disk
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numParticles = 400;
    const particles = Array.from({ length: numParticles }, () => ({
      radius: 55 + Math.random() * 110,
      angle: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.035,
      size: 1 + Math.random() * 2.2,
      brightness: 0.4 + Math.random() * 0.6,
      hueOffset: Math.random() * 30 - 15,
    }));

    function render() {
      if (!canvas || !ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Dark space background with deep nebula gradient
      ctx.fillStyle = '#03050c';
      ctx.fillRect(0, 0, w, h);

      // Distant gravitational lensing distortion background glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 220);
      bgGrad.addColorStop(0, 'rgba(0, 180, 255, 0.08)');
      bgGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.04)');
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const rad = (inclinationDeg * Math.PI) / 180;
      const cosInc = Math.cos(rad);
      const sinInc = Math.sin(rad);

      // Base horizon radius in canvas pixels
      const rH = 42;
      const rPhoton = rH * 1.5;

      // ==========================================
      // 1. GRAVITATIONALLY LENSED BACK DISK (TOP & BOTTOM ARCS)
      // Light from the far side of the disk bends around the black hole!
      // ==========================================
      ctx.save();
      // Upper lensed arc
      const topArcGrad = ctx.createRadialGradient(cx, cy - rH * 0.4, rH * 0.9, cx, cy - rH * 0.4, rH * 2.2);
      topArcGrad.addColorStop(0, `rgba(255, 200, 100, ${0.85 * accretionRate})`);
      topArcGrad.addColorStop(0.4, `rgba(251, 146, 60, ${0.7 * accretionRate})`);
      topArcGrad.addColorStop(0.8, `rgba(239, 68, 68, ${0.3 * accretionRate})`);
      topArcGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.ellipse(cx, cy - rH * 0.4, rH * 2.0, rH * 1.2 * sinInc, 0, Math.PI, 0);
      ctx.fillStyle = topArcGrad;
      ctx.fill();

      // Lower lensed arc (fainter underside)
      const bottomArcGrad = ctx.createRadialGradient(cx, cy + rH * 0.3, rH * 0.9, cx, cy + rH * 0.3, rH * 1.8);
      bottomArcGrad.addColorStop(0, `rgba(251, 146, 60, ${0.45 * accretionRate})`);
      bottomArcGrad.addColorStop(0.7, `rgba(185, 28, 28, ${0.2 * accretionRate})`);
      bottomArcGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.ellipse(cx, cy + rH * 0.3, rH * 1.7, rH * 0.8 * sinInc, 0, 0, Math.PI);
      ctx.fillStyle = bottomArcGrad;
      ctx.fill();
      ctx.restore();

      // ==========================================
      // 2. MAIN ACCRETION DISK (SWIRLING PLASMA PARTICLES)
      // ==========================================
      particles.forEach(p => {
        p.angle += p.speed * (1 + spinA * 0.5) * (70 / p.radius);

        const xFlat = Math.cos(p.angle) * p.radius;
        const yFlat = Math.sin(p.angle) * p.radius;

        // Projection tilted by inclination
        const px = cx + xFlat;
        const py = cy + yFlat * cosInc;

        // Is this particle behind the black hole shadow?
        const isBehind = yFlat < 0;
        const distFromCenter = Math.hypot(px - cx, py - cy);

        // Doppler beaming: if rotating toward left (xFlat < 0), boost brightness & blue shift
        let dopplerFactor = 1.0;
        if (isDopplerEnabled) {
          const vTangential = Math.sin(p.angle); // projected velocity toward line of sight
          dopplerFactor = Math.max(0.2, 1.0 - vTangential * 0.7);
        }

        // Draw particle if not eclipsed by the front of the event horizon
        if (!isBehind || distFromCenter > rH * 0.95) {
          const alpha = p.brightness * dopplerFactor * accretionRate;
          const hue = 35 + (dopplerFactor > 1.1 ? 160 : 0) + p.hueOffset; // bluer if approaching

          ctx.fillStyle = `hsla(${hue}, 95%, 65%, ${Math.min(alpha, 1)})`;
          ctx.beginPath();
          ctx.arc(px, py, p.size * (dopplerFactor > 1.1 ? 1.3 : 0.9), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ==========================================
      // 3. PHOTON SPHERE (THIN RELATIVISTIC GLOW RING)
      // ==========================================
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rPhoton, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 240, 180, ${0.9 * accretionRate})`;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();

      // ==========================================
      // 4. THE EVENT HORIZON (SHADOW OF COMPLETE DARKNESS)
      // ==========================================
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rH, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.restore();

      // Ergosphere boundary indicator for rotating Kerr black hole
      if (spinA > 0.05) {
        ctx.save();
        ctx.beginPath();
        // Ergosphere bulges at equator: rE = M + sqrt(M^2 - a^2 cos^2 theta)
        const ergoRadiusX = rH * (1 + spinA * 0.28);
        const ergoRadiusY = rH * (1 + spinA * 0.1);
        ctx.ellipse(cx, cy, ergoRadiusX, ergoRadiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [spinA, inclinationDeg, accretionRate, isDopplerEnabled]);

  return (
    <div className="black-hole-graphic-container">
      {/* Header & Target Selector */}
      <div className="bh-controls-header">
        <div className="bh-title-block">
          <span className="bh-badge">RELATIVIDADE GERAL & MÉTRICA DE KERR</span>
          <h3 className="bh-heading">Simulação do Horizonte de Eventos & Lente Gravitacional</h3>
        </div>

        <div className="bh-preset-tabs" role="tablist" aria-label="Objetos Astrofísicos Reais">
          {Object.entries(PRESETS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              className={`bh-preset-btn ${selectedPreset === key ? 'active' : ''}`}
              onClick={() => {
                setSelectedPreset(key);
                setSpinA(item.spin);
              }}
            >
              <strong>{item.name}</strong> <small>({item.type})</small>
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport & Interactive Canvas */}
      <div className="bh-canvas-stage">
        <canvas
          ref={canvasRef}
          width={560}
          height={380}
          className="bh-render-canvas"
          title="Buraco negro com lente gravitacional e disco de acreção em tempo real"
        />

        {/* Floating Telemetry HUD */}
        <div className="bh-hud-overlay">
          <div className="bh-hud-item">
            <span className="bh-hud-label">Massa Solar: </span>
            <strong className="bh-hud-val">
              {massSolar >= 1e6 ? `${(massSolar / 1e6).toFixed(1)}M M☉` : `${massSolar.toFixed(1)} M☉`}
            </strong>
          </div>
          <div className="bh-hud-item">
            <span className="bh-hud-label">Raio de Schwarzschild: </span>
            <strong className="bh-hud-val">
              {kerrData.rsKm > 1e6 ? `${(kerrData.rsKm / 1e6).toFixed(2)}M km` : `${kerrData.rsKm.toFixed(0)} km`}
            </strong>
          </div>
          <div className="bh-hud-item">
            <span className="bh-hud-label">Horizonte de Eventos (Kerr): </span>
            <strong className="bh-hud-val">{kerrData.rPlusKm.toFixed(0)} km</strong>
          </div>
          <div className="bh-hud-item">
            <span className="bh-hud-label">Temp. de Hawking: </span>
            <strong className="bh-hud-val">
              {hawkingData.temperatureKelvin < 1e-10
                ? `${hawkingData.temperatureKelvin.toExponential(2)} K`
                : `${hawkingData.temperatureKelvin.toFixed(4)} K`}
            </strong>
          </div>
        </div>
      </div>

      {/* Interactive Controls Row */}
      <div className="bh-sliders-grid">
        <label htmlFor={spinId} className="bh-slider-card">
          <div className="bh-slider-label">
            <span>{isLaymanMode ? 'Velocidade de Rotação (Spin):' : 'Parâmetro de Spin Adimensional (a*):'}</span>
            <strong>{(spinA * 100).toFixed(0)}% ({spinA >= 0.9 ? 'Extremo' : 'Moderado'})</strong>
          </div>
          <input
            id={spinId}
            type="range"
            min="0"
            max="0.998"
            step="0.01"
            value={spinA}
            onChange={e => setSpinA(parseFloat(e.target.value))}
          />
        </label>

        <label htmlFor={inclinationId} className="bh-slider-card">
          <div className="bh-slider-label">
            <span>{isLaymanMode ? 'Ângulo de Visão:' : 'Inclinação do Observador (θ):'}</span>
            <strong>{inclinationDeg}°</strong>
          </div>
          <input
            id={inclinationId}
            type="range"
            min="10"
            max="88"
            step="1"
            value={inclinationDeg}
            onChange={e => setInclinationDeg(parseInt(e.target.value, 10))}
          />
        </label>

        <label htmlFor={accretionId} className="bh-slider-card">
          <div className="bh-slider-label">
            <span>{isLaymanMode ? 'Brilho da Matéria (Gás em Queda):' : 'Taxa de Acreção de Plasma (Ṁ):'}</span>
            <strong>{(accretionRate * 100).toFixed(0)}%</strong>
          </div>
          <input
            id={accretionId}
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={accretionRate}
            onChange={e => setAccretionRate(parseFloat(e.target.value))}
          />
        </label>

        <div className="bh-toggle-card">
          <button
            type="button"
            className={`bh-toggle-btn ${isDopplerEnabled ? 'active' : ''}`}
            onClick={() => setIsDopplerEnabled(!isDopplerEnabled)}
          >
            <span>Doppler Relativístico: </span>
            <strong>{isDopplerEnabled ? 'ATIVADO (Assimetria)' : 'DESATIVADO'}</strong>
          </button>
        </div>
      </div>

      {/* Explanatory Caption */}
      <p className="bh-footer-caption">
        {isLaymanMode ? (
          <>
            <strong>Como Enxergar um Buraco Negro:</strong> O centro escuro não reflete nem deixa escapar luz nenhuma. O anel dourado é gás e poeira girando quase à velocidade da luz. A gravidade deforma o espaço tão intensamente que podemos enxergar o topo e o fundo da parte de trás do disco ao mesmo tempo!
          </>
        ) : (
          <>
            <strong>Física do Efeito Óptico:</strong> A curvatura geodésica extrema projeta imagens duplas de ordem superior do disco de acreção acima e abaixo da sombra central de Schwarzschild/Kerr. O feixe Doppler faz com que o plasma que se aproxima do observador pareça ordens de magnitude mais luminoso que o lado que recua.
          </>
        )}
      </p>
    </div>
  );
}
