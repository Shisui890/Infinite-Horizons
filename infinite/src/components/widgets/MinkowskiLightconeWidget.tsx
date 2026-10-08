import { useState, useId } from 'react';
import MathFormula from '../MathFormula';

export default function MinkowskiLightconeWidget() {
  const [velocityFraction, setVelocityFraction] = useState<number>(0.65);
  const sliderId = useId();

  // Relativistic computations
  const v = Math.max(0, Math.min(1.5, velocityFraction));
  const isSubluminal = v < 1.0;
  const isLightSpeed = Math.abs(v - 1.0) < 0.01;
  const isSuperluminal = v > 1.01;

  // Lorentz Factor gamma
  const gamma = isSubluminal ? (1 / Math.sqrt(Math.max(0.0001, 1 - v * v))).toFixed(3) : 'Indefinido (v > c)';

  // Interval type classification
  const intervalType = isSuperluminal
    ? 'TIPO-ESPAÇO (ds² > 0)'
    : isLightSpeed
    ? 'TIPO-LUZ (ds² = 0)'
    : 'TIPO-TEMPO (ds² < 0)';

  const statusColor = isSuperluminal
    ? 'var(--color-danger, #ef4444)'
    : isLightSpeed
    ? 'var(--color-warning, #f59e0b)'
    : 'var(--color-cyan, #00d4ff)';

  // SVG coordinate calculations (center origin at x=200, y=140)
  const cx = 200;
  const cy = 140;
  const scale = 100;

  // Worldline endpoint
  const dt = 1.0;
  const dx = v * dt;
  const endX = cx + dx * scale;
  const endY = cy - dt * scale; // Time flows upward

  return (
    <div className="lightcone-interactive-widget">
      <div className="lightcone-widget-header">
        <div className="lightcone-header-title">
          <span className="lightcone-pill-badge">
            <span className="pill-dot" />
            DIAGRAMA ESPAÇO-TEMPO DE MINKOWSKI
          </span>
          <h4>Estrutura Causal Lorentziana & Cones de Luz</h4>
          <p>
            Ajuste a velocidade da partícula relativa a <MathFormula math="c" /> para visualizar em tempo real se a trajetória respeita o cone de causalidade relativística:
          </p>
        </div>

        {/* Quick Presets */}
        <div className="lightcone-presets">
          <button
            type="button"
            className={`preset-btn ${Math.abs(v - 0.2) < 0.05 ? 'active' : ''}`}
            onClick={() => setVelocityFraction(0.2)}
          >
            Subluminar (0.2c)
          </button>
          <button
            type="button"
            className={`preset-btn ${Math.abs(v - 0.85) < 0.05 ? 'active' : ''}`}
            onClick={() => setVelocityFraction(0.85)}
          >
            Relativístico (0.85c)
          </button>
          <button
            type="button"
            className={`preset-btn ${Math.abs(v - 1.0) < 0.02 ? 'active' : ''}`}
            onClick={() => setVelocityFraction(1.0)}
          >
            Fóton (1.0c)
          </button>
          <button
            type="button"
            className={`preset-btn ${Math.abs(v - 1.35) < 0.05 ? 'active' : ''}`}
            onClick={() => setVelocityFraction(1.35)}
          >
            Taquiônico (1.35c)
          </button>
        </div>
      </div>

      <div className="lightcone-body-grid">
        {/* SVG Spacetime Diagram */}
        <div className="lightcone-svg-container">
          <svg
            viewBox="0 0 400 280"
            className="lightcone-svg"
            aria-label="Diagrama do Cone de Luz de Minkowski"
          >
            <defs>
              {/* Future Cone Gradient */}
              <linearGradient id="futureConeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.28" />
              </linearGradient>

              {/* Past Cone Gradient */}
              <linearGradient id="pastConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.18" />
              </linearGradient>

              {/* Glowing filters */}
              <filter id="lightGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Past Cone (t < 0) */}
            <polygon
              points={`${cx},${cy} ${cx - 110},${cy + 110} ${cx + 110},${cy + 110}`}
              fill="url(#pastConeGrad)"
              stroke="rgba(245, 158, 11, 0.4)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Future Cone (t > 0) */}
            <polygon
              points={`${cx},${cy} ${cx - 110},${cy - 110} ${cx + 110},${cy - 110}`}
              fill="url(#futureConeGrad)"
              stroke="rgba(0, 212, 255, 0.6)"
              strokeWidth="1.5"
            />

            {/* Spatial Axis (x) */}
            <line
              x1="20"
              y1={cy}
              x2="380"
              y2={cy}
              stroke="rgba(148, 163, 184, 0.4)"
              strokeWidth="1"
            />
            <text x="375" y={cy - 8} fill="#94a3b8" fontSize="10" fontFamily="monospace">
              +x (Espaço)
            </text>

            {/* Temporal Axis (ct) */}
            <line
              x1={cx}
              y1="260"
              x2={cx}
              y2="20"
              stroke="rgba(148, 163, 184, 0.5)"
              strokeWidth="1.2"
            />
            <text x={cx + 8} y="28" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              +ct (Tempo)
            </text>

            {/* 45-Degree Photon Worldline (v = c, right boundary) */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + 110}
              y2={cy - 110}
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text x={cx + 70} y={cy - 90} fill="#fbbf24" fontSize="9" fontFamily="monospace">
              Fóton (v = c)
            </text>

            {/* Animated Photon Beam Pulse */}
            <circle r="3" fill="#ffffff" filter="url(#lightGlow)">
              <animateMotion
                path={`M${cx},${cy} L${cx + 110},${cy - 110}`}
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* 45-Degree Photon Worldline (left boundary) */}
            <line
              x1={cx}
              y1={cy}
              x2={cx - 110}
              y2={cy - 110}
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Worldline of the Tested Particle */}
            <line
              x1={cx}
              y1={cy}
              x2={endX}
              y2={endY}
              stroke={statusColor}
              strokeWidth="2.8"
              filter="url(#lightGlow)"
            />

            {/* Particle Endpoint Dot */}
            <circle
              cx={endX}
              cy={endY}
              r="4.5"
              fill={statusColor}
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            {/* Origin Event (Here & Now) */}
            <circle cx={cx} cy={cy} r="4" fill="#ffffff" stroke="#00d4ff" strokeWidth="2" />
            <text x={cx - 45} y={cy + 16} fill="#e2e8f0" fontSize="10" fontWeight="bold">
              Origem (0,0)
            </text>

            {/* Cone Regions Labels */}
            <text x={cx} y={cy - 65} textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">
              CONE DO FUTURO
            </text>
            <text x={cx} y={cy + 75} textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="600">
              CONE DO PASSADO
            </text>
            <text x={cx + 120} y={cy + 25} fill="#64748b" fontSize="9">
              Alhures (Inacessível)
            </text>
          </svg>
        </div>

        {/* Interactive Controls & Telemetry Column */}
        <div className="lightcone-controls-col">
          <div className="lightcone-slider-box">
            <div className="slider-label-header">
              <label htmlFor={sliderId}>Velocidade da Partícula (<MathFormula math="v/c" />)</label>
              <strong style={{ color: statusColor }}>{v.toFixed(2)} c</strong>
            </div>
            <input
              id={sliderId}
              type="range"
              min="0.0"
              max="1.5"
              step="0.01"
              value={velocityFraction}
              onChange={e => setVelocityFraction(parseFloat(e.target.value))}
              className="lightcone-slider"
            />
            <div className="slider-marks">
              <span>0.0c (Repouso)</span>
              <span>1.0c (Luz)</span>
              <span>1.5c (Taquiônico)</span>
            </div>
          </div>

          <div className="lightcone-classification-box" style={{ borderColor: statusColor }}>
            <span className="class-label">CLASSIFICAÇÃO DO INTERVALO:</span>
            <strong className="class-title" style={{ color: statusColor }}>
              {intervalType}
            </strong>
            <p className="class-desc">
              {isSubluminal &&
                'A partícula move-se estritamente dentro do cone de luz. O intervalo invariante é tipo-tempo (ds² < 0), assegurando causalidade estrita e transmissão de informação consistente.'}
              {isLightSpeed &&
                'A partícula viaja na velocidade exata da luz ao longo de uma geodésica nula (ds² = 0). O tempo próprio decorrido na trajetória é nulo (dτ = 0).'}
              {isSuperluminal &&
                'ALERTA: Velocidade superior a c viola a invariância de Lorentz. A partícula escapa para a região tipo-espaço (ds² > 0), abrindo curvas temporais fechadas e paradoxos de retrocausalidade.'}
            </p>
          </div>

          <div className="lightcone-metrics-table">
            <div className="metric-row">
              <span className="metric-name">Fator de Lorentz (<MathFormula math="\gamma" />):</span>
              <span className="metric-value">{gamma}</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Intervalo Invariante (<MathFormula math="ds^2" />):</span>
              <span className="metric-value" style={{ color: statusColor }}>
                {isSubluminal ? '< 0 (Tipo-Tempo)' : isLightSpeed ? '= 0 (Nulo)' : '> 0 (Tipo-Espaço)'}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Causalidade:</span>
              <span className="metric-value" style={{ color: statusColor }}>
                {isSubluminal ? '100% Preservada' : isLightSpeed ? 'Fronteira Crítica' : 'Violação Causal'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
