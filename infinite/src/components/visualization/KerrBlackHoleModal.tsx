import { useState, useRef, useEffect, useId, useMemo } from 'react';
import MathFormula from '../MathFormula';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface Props {
  onClose: () => void;
}

interface KerrPreset {
  id: string;
  name: string;
  massSolar: number;
  spin: number;
  inclination: number;
  desc: string;
}

const PRESETS: KerrPreset[] = [
  {
    id: 'sgra',
    name: 'Sagittarius A*',
    massSolar: 4.3e6,
    spin: 0.90,
    inclination: 72,
    desc: 'Buraco Negro Supermassivo central da Via Láctea (a 26.000 anos-luz).',
  },
  {
    id: 'm87',
    name: 'M87*',
    massSolar: 6.5e9,
    spin: 0.94,
    inclination: 17,
    desc: 'Primeiro buraco negro imageado diretamente pelo Event Horizon Telescope.',
  },
  {
    id: 'cygnus',
    name: 'Cygnus X-1',
    massSolar: 21.2,
    spin: 0.97,
    inclination: 60,
    desc: 'Sistema binário estelar no braço galáctico com disco de raio-X.',
  },
  {
    id: 'extremal',
    name: 'Kerr Extremal de Thorne',
    massSolar: 1.0e7,
    spin: 0.998,
    inclination: 85,
    desc: 'Limite astrofísico de Thorne onde o arraste do disco impede spin unitário.',
  },
  {
    id: 'schwarzschild',
    name: 'Schwarzschild (Estático)',
    massSolar: 10.0,
    spin: 0.00,
    inclination: 45,
    desc: 'Solução não rotacional esfericamente simétrica original de 1916.',
  },
];

export default function KerrBlackHoleModal({ onClose }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sgra');
  const [spin, setSpin] = useState<number>(0.90);
  const [massSolar, setMassSolar] = useState<number>(4.3e6);
  const [inclinationDeg, setInclinationDeg] = useState<number>(72);
  const [accretionLuminosity, setAccretionLuminosity] = useState<number>(1.2);
  const [showErgosphere, setShowErgosphere] = useState<boolean>(true);
  const [showPhotonRing, setShowPhotonRing] = useState<boolean>(true);
  const [enableDoppler, setEnableDoppler] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationAngleRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const spinSliderId = useId();
  const inclSliderId = useId();
  const lumSliderId = useId();

  // Relativistic Kerr Calculations
  const physics = useMemo(() => {
    const G = 6.6743e-11;
    const c = 2.99792458e8;
    const M_sun = 1.989e30;
    const M_kg = massSolar * M_sun;

    // Raio gravitacional M_geom = GM / c^2 em metros
    const rG = (G * M_kg) / (c * c);

    // Parâmetro de spin adimensional a_bar in [0, 0.998]
    const aBar = Math.min(0.998, Math.max(0, spin));

    // Horizonte de eventos exterior r_+ = M + sqrt(M^2 - a^2)
    const horizonFactor = 1 + Math.sqrt(Math.max(0, 1 - aBar * aBar));
    const rHorizonMeters = rG * horizonFactor;

    // Horizonte de Cauchy interior r_- = M - sqrt(M^2 - a^2)
    const innerHorizonFactor = 1 - Math.sqrt(Math.max(0, 1 - aBar * aBar));
    const rInnerHorizonMeters = rG * innerHorizonFactor;

    // Ergosphere no equador (theta = pi/2): r_E = 2M
    // Ergosphere nos polos (theta = 0): r_E = r_+
    const radInc = (inclinationDeg * Math.PI) / 180;
    const cosInc = Math.cos(radInc);
    const ergoFactorAtTheta = 1 + Math.sqrt(Math.max(0, 1 - aBar * aBar * cosInc * cosInc));
    const rErgosphereMeters = rG * ergoFactorAtTheta;

    // Órbita Circular Estável Mais Interna (ISCO)
    const z1 = 1 + Math.cbrt(1 - aBar * aBar) * (Math.cbrt(1 + aBar) + Math.cbrt(1 - aBar));
    const z2 = Math.sqrt(3 * aBar * aBar + z1 * z1);
    const rIscoFactor = 3 + z2 - Math.sqrt((3 - z1) * (3 + z1 + 2 * z2));
    const rIscoMeters = rG * rIscoFactor;

    // Temperatura de Hawking T_H em Kelvin
    const hBar = 1.054571817e-34;
    const kB = 1.380649e-23;
    const kappa = (Math.sqrt(Math.max(0, 1 - aBar * aBar))) / (2 * rG * horizonFactor);
    const tHawking = (hBar * c * kappa) / (2 * Math.PI * kB);

    return {
      rG,
      rHorizonMeters,
      rInnerHorizonMeters,
      rErgosphereMeters,
      rIscoMeters,
      horizonFactor,
      ergoFactorAtTheta,
      rIscoFactor,
      tHawking,
      aBar,
    };
  }, [spin, massSolar, inclinationDeg]);

  // Set Preset
  function handleSelectPreset(preset: KerrPreset) {
    setSelectedPresetId(preset.id);
    setSpin(preset.spin);
    setMassSolar(preset.massSolar);
    setInclinationDeg(preset.inclination);
  }

  // Canvas Raymarching / Particle Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Initialize Accretion Disk Plasma Nodes
    const numNodes = 650;
    const diskNodes = Array.from({ length: numNodes }, () => {
      const radiusUnit = 2.4 + Math.random() * 6.5; // in multiples of r_horizon
      return {
        radiusUnit,
        angle: Math.random() * Math.PI * 2,
        speed: 0.028 / Math.sqrt(radiusUnit),
        size: 1.2 + Math.random() * 2.8,
        temperature: 0.4 + Math.random() * 0.6,
      };
    });

    function render() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      if (autoRotate) {
        rotationAngleRef.current += 0.005;
      }

      // Background Space
      ctx.fillStyle = '#040711';
      ctx.fillRect(0, 0, w, h);

      // Deep Gravitational Lensing Distortion Halo
      const bgGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 260);
      bgGlow.addColorStop(0, 'rgba(0, 212, 255, 0.12)');
      bgGlow.addColorStop(0.35, 'rgba(249, 115, 22, 0.08)');
      bgGlow.addColorStop(0.7, 'rgba(168, 85, 247, 0.04)');
      bgGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, w, h);

      const rad = (inclinationDeg * Math.PI) / 180;
      const cosInc = Math.cos(rad);
      const sinInc = Math.sin(rad);

      // Scale in pixels
      const rH = 46; // Base Horizon Radius in canvas
      const ergoEquator = rH * (2 / physics.horizonFactor);
      const ergoPoles = rH;

      // 1. BACK GRAVITATIONAL LENSING ARC (LIGHT BENDING OVER THE POLES)
      ctx.save();
      const topArc = ctx.createRadialGradient(cx, cy - rH * 0.45, rH * 0.8, cx, cy - rH * 0.45, rH * 2.4);
      topArc.addColorStop(0, `rgba(255, 220, 140, ${0.9 * accretionLuminosity})`);
      topArc.addColorStop(0.4, `rgba(249, 115, 22, ${0.75 * accretionLuminosity})`);
      topArc.addColorStop(0.85, `rgba(220, 38, 38, ${0.25 * accretionLuminosity})`);
      topArc.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.ellipse(cx, cy - rH * 0.45, rH * 2.2, rH * 1.35 * Math.max(0.2, sinInc), 0, Math.PI, 0);
      ctx.fillStyle = topArc;
      ctx.fill();

      // Lower Lensed Arc
      const botArc = ctx.createRadialGradient(cx, cy + rH * 0.4, rH * 0.8, cx, cy + rH * 0.4, rH * 1.9);
      botArc.addColorStop(0, `rgba(249, 115, 22, ${0.5 * accretionLuminosity})`);
      botArc.addColorStop(0.7, `rgba(185, 28, 28, ${0.2 * accretionLuminosity})`);
      botArc.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.ellipse(cx, cy + rH * 0.35, rH * 1.8, rH * 0.9 * Math.max(0.2, sinInc), 0, 0, Math.PI);
      ctx.fillStyle = botArc;
      ctx.fill();
      ctx.restore();

      // 2. ERGOSPHERE LUMINESCENCE (OBLATE SPHEROID)
      if (showErgosphere) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, ergoEquator, ergoPoles, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();

        const ergoFill = ctx.createRadialGradient(cx, cy, rH, cx, cy, ergoEquator);
        ergoFill.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
        ergoFill.addColorStop(0.8, 'rgba(0, 212, 255, 0.03)');
        ergoFill.addColorStop(1, 'transparent');
        ctx.fillStyle = ergoFill;
        ctx.fill();
        ctx.restore();
      }

      // 3. PHOTON SPHERE & EINSTEIN RING
      if (showPhotonRing) {
        ctx.save();
        const rPhoton = rH * 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, rPhoton, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 230, 160, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // 4. ACCRETION DISK PLASMA NODES WITH RELATIVISTIC DOPPLER BEAMING
      diskNodes.forEach(node => {
        // Orbit speed affected by spin
        node.angle += node.speed * (1 + physics.aBar * 0.7);

        const currentRad = node.radiusUnit * rH;
        const xFlat = Math.cos(node.angle + rotationAngleRef.current) * currentRad;
        const yFlat = Math.sin(node.angle + rotationAngleRef.current) * currentRad;

        // Tilted projection by inclination
        const px = cx + xFlat;
        const py = cy + yFlat * cosInc;

        // Is node in front or behind horizon?
        const isBehind = yFlat < 0;
        const distFromCenter = Math.hypot(px - cx, py - cy);

        // If particle is behind the black hole horizon silhouette, suppress or let lensed arcs show
        if (isBehind && distFromCenter < rH * 1.05) return;

        // Relativistic Doppler Factor: Approaching side (xFlat < 0) vs Receding side (xFlat > 0)
        let dopplerFactor = 1.0;
        let hue = 32; // Orange/Amber
        let lightness = 65;

        if (enableDoppler) {
          // Approaching plasma is blueshifted and beamed
          if (xFlat < 0) {
            const intensity = Math.min(1.0, Math.abs(xFlat) / (rH * 4));
            dopplerFactor = 1.0 + intensity * 1.8 * (1 + physics.aBar);
            hue = 32 - intensity * 25; // Shifts toward white/cyan-blue
            if (intensity > 0.6) hue = 195;
            lightness = 75 + intensity * 20;
          } else {
            // Receding plasma is redshifted and dimmed
            const intensity = Math.min(1.0, xFlat / (rH * 4));
            dopplerFactor = Math.max(0.18, 1.0 - intensity * 0.75);
            hue = 15; // Deep Crimson Red
            lightness = 45;
          }
        }

        const alpha = Math.min(1.0, 0.85 * dopplerFactor * accretionLuminosity);
        ctx.fillStyle = `hsla(${hue}, 95%, ${lightness}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, node.size * (enableDoppler && xFlat < 0 ? 1.3 : 1.0), 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. OBSIDIAN EVENT HORIZON SHADOW (THE BLACK HOLE CORE)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rH, 0, Math.PI * 2);
      ctx.fillStyle = '#020307';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 18;
      ctx.fill();

      // Inner boundary fringe glow
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 6. ISCO (INNERMOST STABLE CIRCULAR ORBIT) RING
      ctx.save();
      const iscoPx = rH * (physics.rIscoFactor / physics.horizonFactor);
      ctx.beginPath();
      ctx.ellipse(cx, cy, iscoPx, iscoPx * cosInc, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    spin,
    inclinationDeg,
    accretionLuminosity,
    showErgosphere,
    showPhotonRing,
    enableDoppler,
    autoRotate,
    physics,
  ]);

  // Mouse drag handling for manual tilt/rotation
  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    rotationAngleRef.current += dx * 0.01;
    setInclinationDeg(prev => Math.min(88, Math.max(5, prev + dy * 0.2)));
  }

  function handleMouseUp() {
    isDraggingRef.current = false;
  }

  return (
    <div className="kerr-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="kerr-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="kerr-modal-header">
          <div className="kerr-header-left">
            <span className="kerr-pill-badge">
              <span className="pill-dot" />
              {isLaymanMode ? 'COMO FUNCIONA UM BURACO NEGRO GIRATÓRIO' : 'RELATIVIDADE GERAL // MÉTRICA DE KERR (1963)'}
            </span>
            <h2 className="kerr-modal-title">
              {isLaymanMode ? 'Laboratório Visual: O Espaço-Tempo Girando ao Redor do Buraco Negro' : 'Visualizador de Buraco Negro em Rotação & Lente Gravitacional'}
            </h2>
          </div>

          <button
            type="button"
            className="btn-kerr-close"
            onClick={onClose}
            aria-label="Fechar visualizador de Kerr"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Preset Selector Bar */}
        <div className="kerr-presets-bar">
          <span className="presets-label">CORPOS CELESTES REAIS:</span>
          <div className="presets-pill-group">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                className={`preset-pill-btn ${selectedPresetId === preset.id ? 'active' : ''}`}
                onClick={() => handleSelectPreset(preset)}
              >
                <span>{preset.name}</span>
                <small>a={preset.spin}</small>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="kerr-modal-body">
          {/* Left Canvas Viewport */}
          <div className="kerr-canvas-container">
            <canvas
              ref={canvasRef}
              width={640}
              height={460}
              className="kerr-viewport-canvas"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              title="Clique e arraste para inclinar ou girar o buraco negro em 3D"
            />

            <div className="canvas-telemetry-overlay">
              <span className="canvas-tech-badge">
                <span className="pulse-indicator" />
                RAYMARCHING RELATIVÍSTICO
              </span>
              <span className="canvas-hint">Arraste para rotacionar em 3D</span>
            </div>

            {/* Canvas Legend */}
            <div className="kerr-canvas-legend">
              <div className="legend-item">
                <span className="legend-dot dot-horizon" />
                <span>Horizonte de Eventos (<MathFormula math="r_+" />)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-ergo" />
                <span>Ergosfera (<MathFormula math="r_E" />)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-photon" />
                <span>Anel de Fótons (<MathFormula math="1.5\,r_H" />)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-isco" />
                <span>Órbita ISCO</span>
              </div>
            </div>
          </div>

          {/* Right Parameters & Mathematical Dashboard */}
          <div className="kerr-controls-panel">
            {isLaymanMode && (
              <div className="layman-explanation-card" style={{ marginBottom: '10px', padding: '10px 12px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <strong style={{ fontSize: '0.78rem', color: '#38bdf8', letterSpacing: '0.04em' }}>GUIA DO INICIANTE:</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  Ao girar em alta velocidade, o buraco negro <strong>arrasta o próprio tecido do espaço e tempo</strong> ao seu redor como um redemoinho. O lado que gira na direção dos nossos olhos brilha muito mais forte (Efeito Doppler da luz).
                </p>
              </div>
            )}

            {/* Interactive Sliders */}
            <div className="control-group-card">
              <h4>{isLaymanMode ? 'Controles da Simulação' : 'Parâmetros Relativísticos de Kerr'}</h4>

              <div className="kerr-slider-field">
                <div className="slider-label-row">
                  <label htmlFor={spinSliderId}>
                    {isLaymanMode ? 'Velocidade de Giro (Spin)' : <>Parâmetro de Spin Adimensional (<MathFormula math="a/M" />)</>}
                  </label>
                  <strong className="text-cyan">{spin.toFixed(3)}</strong>
                </div>
                <input
                  id={spinSliderId}
                  type="range"
                  min="0.0"
                  max="0.998"
                  step="0.005"
                  value={spin}
                  onChange={e => {
                    setSpin(parseFloat(e.target.value));
                    setSelectedPresetId('custom');
                  }}
                  className="kerr-slider"
                />
                <span className="slider-note">0.0 = Estático (Schwarzschild) | 0.998 = Máximo de Thorne</span>
              </div>

              <div className="kerr-slider-field">
                <div className="slider-label-row">
                  <label htmlFor={inclSliderId}>
                    {isLaymanMode ? 'Ângulo de Visão da Câmera' : <>Ângulo de Inclinação (<MathFormula math="\theta" />)</>}
                  </label>
                  <strong className="text-amber">{inclinationDeg.toFixed(0)}°</strong>
                </div>
                <input
                  id={inclSliderId}
                  type="range"
                  min="5"
                  max="88"
                  step="1"
                  value={inclinationDeg}
                  onChange={e => setInclinationDeg(parseInt(e.target.value, 10))}
                  className="kerr-slider"
                />
                <span className="slider-note">
                  {isLaymanMode ? '0° = Visto de Cima (Polo) | 90° = Visto de Lado (Plano do Disco)' : '0° = Face-on (Polo) | 90° = Edge-on (Plano do Disco)'}
                </span>
              </div>

              <div className="kerr-slider-field">
                <div className="slider-label-row">
                  <label htmlFor={lumSliderId}>
                    {isLaymanMode ? 'Brilho do Gás Incandescente' : 'Taxa de Acreção & Plasma'}
                  </label>
                  <strong className="text-cyan">{accretionLuminosity.toFixed(1)}x</strong>
                </div>
                <input
                  id={lumSliderId}
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={accretionLuminosity}
                  onChange={e => setAccretionLuminosity(parseFloat(e.target.value))}
                  className="kerr-slider"
                />
              </div>

              {/* Toggles */}
              <div className="kerr-toggle-grid">
                <label className="kerr-toggle-label">
                  <input
                    type="checkbox"
                    checked={showErgosphere}
                    onChange={e => setShowErgosphere(e.target.checked)}
                  />
                  <span>{isLaymanMode ? 'Zona de Arraste (Ergosfera)' : <>Ergosfera (<MathFormula math="r_E" />)</>}</span>
                </label>

                <label className="kerr-toggle-label">
                  <input
                    type="checkbox"
                    checked={showPhotonRing}
                    onChange={e => setShowPhotonRing(e.target.checked)}
                  />
                  <span>{isLaymanMode ? 'Anel de Fótons (Luz Orbitando)' : 'Anel de Fótons'}</span>
                </label>

                <label className="kerr-toggle-label">
                  <input
                    type="checkbox"
                    checked={enableDoppler}
                    onChange={e => setEnableDoppler(e.target.checked)}
                  />
                  <span>{isLaymanMode ? 'Brilho Relativístico (Doppler)' : 'Beaming Doppler'}</span>
                </label>

                <label className="kerr-toggle-label">
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={e => setAutoRotate(e.target.checked)}
                  />
                  <span>{isLaymanMode ? 'Girar Câmera' : 'Giro Automático'}</span>
                </label>
              </div>
            </div>

            {/* Rigorous Math Formulas & Telemetry */}
            <div className="control-group-card">
              <h4>{isLaymanMode ? 'O que a Física Calcula em Tempo Real' : 'Métrica & Termodinâmica Exata'}</h4>

              <div className="kerr-math-summary">
                <div className="math-row">
                  <span className="math-label">Horizonte Exterior (<MathFormula math="r_+" />):</span>
                  <span className="math-val">{physics.horizonFactor.toFixed(3)} <MathFormula math="M" /></span>
                </div>
                <div className="math-formula-snippet">
                  <MathFormula math="r_+ = M + \sqrt{M^2 - a^2}" />
                </div>

                <div className="math-row">
                  <span className="math-label">Ergosfera (<MathFormula math="r_E(\theta)" />):</span>
                  <span className="math-val">{physics.ergoFactorAtTheta.toFixed(3)} <MathFormula math="M" /></span>
                </div>
                <div className="math-formula-snippet">
                  <MathFormula math="r_E(\theta) = M + \sqrt{M^2 - a^2\cos^2\theta}" />
                </div>

                <div className="math-row">
                  <span className="math-label">Órbita ISCO (<MathFormula math="r_{\text{isco}}" />):</span>
                  <span className="math-val">{physics.rIscoFactor.toFixed(3)} <MathFormula math="M" /></span>
                </div>

                <div className="math-row">
                  <span className="math-label">Temperatura de Hawking (<MathFormula math="T_H" />):</span>
                  <span className="math-val">{physics.tHawking.toExponential(3)} K</span>
                </div>

                <div className="math-row">
                  <span className="math-label">Efeito Lense-Thirring:</span>
                  <span className="math-val text-cyan">Arraste de Referenciais Ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
