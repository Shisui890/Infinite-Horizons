/**
 * AerospaceFlightSimulator.tsx
 *
 * Simulador de Engenharia Aeroespacial e Mecânica Orbital de alta fidelidade,
 * combinando a dinâmica de foguetes de Kerbal Space Program (KSP) e o realismo histórico
 * de procedimentos da NASA do simulador Re-entry (Mercury, Gemini, Apollo).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AEROSPACE_ROCKETS,
  type AerospaceRocket,
} from '../../data/aerospaceRockets';
import {
  AerospacePhysicsEngine,
  type FlightState,
  type OrbitalTelemetry,
  EARTH_RADIUS_M,
  KARMAN_LINE_M,
} from '../../engine/AerospacePhysicsEngine';
import NavballInstrument from './NavballInstrument';
import ApolloDSKYDisplay from './ApolloDSKYDisplay';
import MathFormula from '../MathFormula';

interface Props {
  isLaymanMode?: boolean;
}

export default function AerospaceFlightSimulator({ isLaymanMode = false }: Props) {
  // 1. Vehicle Selection
  const [selectedRocketId, setSelectedRocketId] = useState<string>('saturn_v');
  const selectedRocket = AEROSPACE_ROCKETS.find(r => r.id === selectedRocketId) || AEROSPACE_ROCKETS[0];

  // 2. Flight Simulation State
  const [flightState, setFlightState] = useState<FlightState>(() =>
    AerospacePhysicsEngine.createInitialFlightState(selectedRocket)
  );

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeWarp, setTimeWarp] = useState<number>(1);
  const [autoGravityTurn, setAutoGravityTurn] = useState<boolean>(true);
  const [manualPitch, setManualPitch] = useState<number>(90);
  const [throttleInput, setThrottleInput] = useState<number>(1.0);

  // Trajectory history for path rendering
  const [trajectoryHistory, setTrajectoryHistory] = useState<{ altKm: number; downrangeKm: number }[]>([]);

  // Telemetry computation
  const orbitalTelemetry: OrbitalTelemetry = AerospacePhysicsEngine.calculateOrbitalTelemetry(
    flightState.altitudeMeters,
    flightState.vxMS,
    flightState.vyMS
  );

  // Trajectory canvas ref
  const trajectoryCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset flight simulation
  const handleResetFlight = useCallback((rocket: AerospaceRocket = selectedRocket) => {
    setIsRunning(false);
    setTimeWarp(1);
    setAutoGravityTurn(true);
    setManualPitch(90);
    setThrottleInput(1.0);
    setTrajectoryHistory([]);
    setFlightState(AerospacePhysicsEngine.createInitialFlightState(rocket));
  }, [selectedRocket]);

  // When rocket changes, reset state
  const handleSelectRocket = (rId: string) => {
    setSelectedRocketId(rId);
    const newRocket = AEROSPACE_ROCKETS.find(r => r.id === rId) || AEROSPACE_ROCKETS[0];
    handleResetFlight(newRocket);
  };

  // Trigger stage jettison (SPACEBAR / Staging button)
  const handleStageTrigger = () => {
    setFlightState(prev => AerospacePhysicsEngine.triggerStageJettison(prev, selectedRocket));
  };

  // Keyboard controls listener (Space = stage, Z = full throttle, X = cut-off)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleStageTrigger();
      } else if (e.code === 'KeyZ') {
        setThrottleInput(1.0);
        setFlightState(prev => ({ ...prev, throttle: 1.0 }));
      } else if (e.code === 'KeyX') {
        setThrottleInput(0);
        setFlightState(prev => ({ ...prev, throttle: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRocket]);

  // Main Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setFlightState(prev => {
        const dt = (0.05 * timeWarp);
        const updated = AerospacePhysicsEngine.stepFlightSimulation(
          { ...prev, throttle: throttleInput, pitchAngleDeg: autoGravityTurn ? prev.pitchAngleDeg : manualPitch },
          selectedRocket,
          dt,
          autoGravityTurn
        );

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, timeWarp, throttleInput, autoGravityTurn, manualPitch, selectedRocket]);

  // Sample trajectory points for canvas
  useEffect(() => {
    if (!isRunning) return;
    setTrajectoryHistory(prev => {
      const last = prev[prev.length - 1];
      const curAltKm = flightState.altitudeMeters / 1000;
      const curDownrangeKm = flightState.downrangeMeters / 1000;
      if (!last || Math.abs(curDownrangeKm - last.downrangeKm) > 5 || Math.abs(curAltKm - last.altKm) > 5) {
        return [...prev.slice(-300), { altKm: curAltKm, downrangeKm: curDownrangeKm }];
      }
      return prev;
    });
  }, [isRunning, flightState.altitudeMeters, flightState.downrangeMeters]);

  // Render Orbital Trajectory Map
  useEffect(() => {
    const canvas = trajectoryCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Dark space background
    ctx.fillStyle = '#020409';
    ctx.fillRect(0, 0, w, h);

    // Planet center & radius on canvas
    const planetCanvasR = w * 0.42;
    const planetCenterX = w * 0.25;
    const planetCenterY = h * 1.05;

    // Earth curvature arc
    ctx.save();
    const earthGrad = ctx.createRadialGradient(planetCenterX, planetCenterY, planetCanvasR * 0.5, planetCenterX, planetCenterY, planetCanvasR);
    earthGrad.addColorStop(0, '#0369a1');
    earthGrad.addColorStop(0.9, '#0284c7');
    earthGrad.addColorStop(1, '#1e3a8a');

    ctx.fillStyle = earthGrad;
    ctx.beginPath();
    ctx.arc(planetCenterX, planetCenterY, planetCanvasR, 0, Math.PI * 2);
    ctx.fill();

    // Atmosphere Ring (100 km Karman Line)
    const atmoCanvasR = planetCanvasR + (planetCanvasR * (KARMAN_LINE_M / EARTH_RADIUS_M) * 3.5);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(planetCenterX, planetCenterY, atmoCanvasR, 0, Math.PI * 2);
    ctx.stroke();

    // Target Orbit Ring (e.g. 185 km)
    const targetOrbitCanvasR = planetCanvasR + (planetCanvasR * ((selectedRocket.targetOrbitAltitudeKm * 1000) / EARTH_RADIUS_M) * 3.5);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.arc(planetCenterX, planetCenterY, targetOrbitCanvasR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Flight Trajectory Line
    if (trajectoryHistory.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let i = 0; i < trajectoryHistory.length; i++) {
        const pt = trajectoryHistory[i];
        const radDist = planetCanvasR + (planetCanvasR * ((pt.altKm * 1000) / EARTH_RADIUS_M) * 3.5);
        const angle = (pt.downrangeKm / (EARTH_RADIUS_M / 1000)) * 0.8 - Math.PI / 2;
        const px = planetCenterX + Math.cos(angle) * radDist;
        const py = planetCenterY + Math.sin(angle) * radDist;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Current Rocket Position Marker
    const curAltM = flightState.altitudeMeters;
    const curDownM = flightState.downrangeMeters;
    const curRadDist = planetCanvasR + (planetCanvasR * (curAltM / EARTH_RADIUS_M) * 3.5);
    const curAngle = (curDownM / EARTH_RADIUS_M) * 0.8 - Math.PI / 2;
    const curX = planetCenterX + Math.cos(curAngle) * curRadDist;
    const curY = planetCenterY + Math.sin(curAngle) * curRadDist;

    ctx.save();
    // Glowing rocket icon
    ctx.fillStyle = '#ff9900';
    ctx.shadowColor = '#ff9900';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(curX, curY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Rocket Velocity Vector
    const speed = flightState.totalSpeedMS;
    if (speed > 5) {
      const vVectorLength = Math.min(40, (speed / 8000) * 45);
      const vAngle = curAngle + Math.PI / 2 - ((flightState.pitchAngleDeg) * Math.PI) / 180;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(curX + Math.cos(vAngle) * vVectorLength, curY + Math.sin(vAngle) * vVectorLength);
      ctx.stroke();
    }
    ctx.restore();

    // Map Legend Tags
    ctx.save();
    ctx.font = '10px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('LINHA DE KÁRMÁN (100 KM)', w * 0.65, 30);
    ctx.fillStyle = '#22c55e';
    ctx.fillText(`ÓRBITA ALVO (${selectedRocket.targetOrbitAltitudeKm} KM)`, w * 0.65, 48);
    ctx.fillStyle = '#ff9900';
    ctx.fillText(`TRAJETÓRIA REAL-TIME [${selectedRocket.name}]`, w * 0.65, 66);
    ctx.restore();
  }, [trajectoryHistory, flightState, selectedRocket]);

  const currentStage = selectedRocket.stages[flightState.currentStageIndex];
  const stagePropellantPct = currentStage
    ? (flightState.stagePropellantMassKg / currentStage.propellantMassKg) * 100
    : 0;

  return (
    <div className="aerospace-sim-container">
      {/* 1. Header Toolbar with Rocket Presets & Flight Status */}
      <div className="aerospace-top-bar">
        <div className="rocket-preset-selector">
          <span className="selector-kicker">VEÍCULO AEROESPACIAL:</span>
          <div className="rocket-btns-group">
            {AEROSPACE_ROCKETS.map(r => (
              <button
                key={r.id}
                type="button"
                className={`btn-rocket-tab ${r.id === selectedRocketId ? 'active' : ''}`}
                onClick={() => handleSelectRocket(r.id)}
              >
                <strong>{r.name}</strong>
                <small>{r.agency}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="flight-status-box">
          <div className="status-indicator-group">
            <span className={`beacon-status ${isRunning ? 'status-green' : 'status-amber'}`} />
            <span className="status-label">
              {flightState.hasCrashed
                ? 'CRASH // IMPACTO NA SUPERFÍCIE'
                : flightState.isOrbitAchieved
                ? 'ÓRBITA ESTÁVEL ALCANÇADA!'
                : isRunning
                ? 'VOO ATIVO // MOTOR LIGADO'
                : 'PRONTO NA PLATAFORMA // T-0'}
            </span>
          </div>
          <span className="mission-timer">
            MET: +{Math.floor(flightState.missionElapsedSeconds / 60).toString().padStart(2, '0')}:
            {Math.floor(flightState.missionElapsedSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* 2. Main Flight Cockpit Grid */}
      <div className="aerospace-cockpit-grid">
        {/* Left Column: Orbital Trajectory Map & Flight Computer DSKY */}
        <div className="aerospace-left-column">
          <div className="trajectory-map-card">
            <div className="map-hud-bar">
              <span className="hud-title">VISOR ORBITAL DINÂMICO // PLANETA TERRA</span>
              <span className="hud-alt-tag">ALT: {(flightState.altitudeMeters / 1000).toFixed(1)} km</span>
            </div>

            <div className="trajectory-canvas-wrap">
              <canvas
                ref={trajectoryCanvasRef}
                width={620}
                height={340}
                className="trajectory-canvas"
              />
            </div>
          </div>

          {/* Apollo Guidance Computer (DSKY) */}
          <ApolloDSKYDisplay
            program={flightState.altitudeMeters < 1000 ? 11 : flightState.isOrbitAchieved ? 30 : 12}
            verb={16}
            noun={44}
            r1Value={orbitalTelemetry.apoapsisAltitudeKm > 99999 ? '------' : orbitalTelemetry.apoapsisAltitudeKm}
            r2Value={orbitalTelemetry.periapsisAltitudeKm < -6000 ? '------' : orbitalTelemetry.periapsisAltitudeKm}
            r3Value={flightState.totalSpeedMS.toFixed(0)}
            r1Label="APOAPSIS (KM)"
            r2Label="PERIAPSIS (KM)"
            r3Label="VELOCIDADE TOTAL (M/S)"
          />
        </div>

        {/* Right Column: Navball, Telemetry Matrix & Stage Controls */}
        <div className="aerospace-right-column">
          {/* Navball & Critical Telemetry */}
          <div className="navball-card">
            <NavballInstrument
              pitchDeg={flightState.pitchAngleDeg}
              vxMS={flightState.vxMS}
              vyMS={flightState.vyMS}
              size={170}
            />

            <div className="critical-telemetry-cluster">
              <div className="crit-item">
                <span className="crit-label">VELOCIDADE ORBITAL</span>
                <strong className="crit-val">{(flightState.vxMS / 1000).toFixed(2)} km/s</strong>
              </div>
              <div className="crit-item">
                <span className="crit-label">VELOCIDADE VERTICAL</span>
                <strong className="crit-val">{flightState.vyMS.toFixed(1)} m/s</strong>
              </div>
              <div className="crit-item">
                <span className="crit-label">PRESSÃO DINÂMICA (Q)</span>
                <strong className={`crit-val ${flightState.isMaxQ ? 'text-amber' : ''}`}>
                  {flightState.dynamicPressureKPa.toFixed(1)} kPa {flightState.isMaxQ ? '[MAX-Q]' : ''}
                </strong>
              </div>
              <div className="crit-item">
                <span className="crit-label">CARGA DE FORÇA-G</span>
                <strong className="crit-val">{flightState.gForce.toFixed(2)} G</strong>
              </div>
              <div className="crit-item">
                <span className="crit-label">EMPUXO TOTAL (T)</span>
                <strong className="crit-val">{flightState.thrustKN.toFixed(0)} kN</strong>
              </div>
              <div className="crit-item">
                <span className="crit-label">DELTA-V DO ESTÁGIO</span>
                <strong className="crit-val">{flightState.stageDeltaVRemainingMS.toFixed(0)} m/s</strong>
              </div>
            </div>
          </div>

          {/* Staging & Throttle Flight Controls */}
          <div className="flight-control-deck">
            <div className="stage-propellant-meter">
              <div className="stage-info-header">
                <span className="stage-name-tag">
                  ESTÁGIO {flightState.currentStageIndex + 1}/{selectedRocket.stages.length}: {currentStage?.name}
                </span>
                <span className="propellant-pct">{stagePropellantPct.toFixed(1)}%</span>
              </div>
              <div className="propellant-bar-track">
                <div
                  className="propellant-bar-fill"
                  style={{
                    width: `${Math.max(0, stagePropellantPct)}%`,
                    backgroundColor: stagePropellantPct > 20 ? '#22c55e' : '#ef4444',
                  }}
                />
              </div>
              <span className="engine-label">{currentStage?.engineName} • {currentStage?.fuelType}</span>
            </div>

            {/* Throttle & Primary Action Buttons */}
            <div className="primary-actions-row">
              <button
                type="button"
                className={`btn-ignition ${isRunning ? 'active-engine' : ''}`}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? 'PAUSAR VOO' : 'IGNIÇÃO / DECOLAR'}
              </button>

              <button
                type="button"
                className="btn-staging-trigger"
                onClick={handleStageTrigger}
                disabled={flightState.currentStageIndex >= selectedRocket.stages.length - 1}
                title="Desacopla o estágio atual esgotado e acende o próximo motor (Tecla ESPAÇO)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 2 22 22 22" />
                </svg>
                <span>ESTAGIAR [ESPAÇO]</span>
              </button>

              <button
                type="button"
                className="btn-flight-reset"
                onClick={() => handleResetFlight()}
                title="Reiniciar voo na plataforma de lançamento"
              >
                RESET
              </button>
            </div>

            {/* Throttle Slider & SAS Autopilot Modes */}
            <div className="secondary-controls-grid">
              <div className="throttle-card">
                <div className="throttle-label">
                  <span>POTÊNCIA (MANETE):</span>
                  <strong>{(throttleInput * 100).toFixed(0)}% [X / Z]</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={throttleInput}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setThrottleInput(val);
                    setFlightState(prev => ({ ...prev, throttle: val }));
                  }}
                />
              </div>

              <div className="autopilot-card">
                <span className="autopilot-title">PILOTO AUTOMÁTICO SAS:</span>
                <div className="sas-btn-group">
                  <button
                    type="button"
                    className={`btn-sas ${autoGravityTurn ? 'active' : ''}`}
                    onClick={() => setAutoGravityTurn(true)}
                  >
                    GRAVITY TURN
                  </button>
                  <button
                    type="button"
                    className={`btn-sas ${!autoGravityTurn ? 'active' : ''}`}
                    onClick={() => setAutoGravityTurn(false)}
                  >
                    MANUAL PITCH
                  </button>
                </div>
              </div>
            </div>

            {/* Manual Pitch Slider when Manual is chosen */}
            {!autoGravityTurn && (
              <div className="manual-pitch-box">
                <div className="pitch-label">
                  <span>INCLINAÇÃO ARFAGEM (PITCH):</span>
                  <strong>{manualPitch}° ({manualPitch === 90 ? 'Vertical' : manualPitch === 0 ? 'Horizontal' : `${manualPitch}°`})</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={manualPitch}
                  onChange={e => setManualPitch(parseInt(e.target.value, 10))}
                />
              </div>
            )}

            {/* Time Warp Selector */}
            <div className="time-warp-bar">
              <span className="warp-label">DOBRA TEMPORAL:</span>
              <div className="warp-btns">
                {[1, 5, 25, 50].map(warp => (
                  <button
                    key={warp}
                    type="button"
                    className={`btn-warp ${timeWarp === warp ? 'active' : ''}`}
                    onClick={() => setTimeWarp(warp)}
                  >
                    {warp}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Educational / Technical Astrodynamics Flight Dossier */}
      <div className="aerospace-dossier-card">
        <div className="dossier-header">
          <span className="dossier-tag">
            {isLaymanMode ? 'GUIA DIDÁTICO: COMO ENTRAR EM ÓRBITA' : 'FORMALISMO ASTRODINÂMICO & EQUAÇÕES DE VOO'}
          </span>
        </div>

        {isLaymanMode ? (
          <div className="didactic-flight-guide">
            <p>
              <strong>O Grande Segredo do Voo Espacial:</strong> Muitas pessoas acham que para ficar no espaço basta subir muito alto. Mas se você apenas subir em linha reta, quando o motor desligar você cairá de volta no chão como uma pedra!
            </p>
            <div className="didactic-steps-row">
              <div className="didactic-step">
                <span className="step-num">Passo 1</span>
                <strong>Subida Vertical (0 a 2 km)</strong>
                <p>O foguete sobe em linha reta para escapar o mais rápido possível da atmosfera densa da Terra, onde o ar é pesado e freia a nave.</p>
              </div>
              <div className="didactic-step">
                <span className="step-num">Passo 2</span>
                <strong>Curva de Gravidade (2 a 75 km)</strong>
                <p>O foguete se inclina gradualmente para o lado (em direção ao Leste). O objetivo é acumular velocidade horizontal!</p>
              </div>
              <div className="didactic-step">
                <span className="step-num">Passo 3</span>
                <strong>Circularização Orbital (&gt; 160 km)</strong>
                <p>Ao atingir 28.000 km/h (quase 8 km por segundo), a curvatura da queda da nave é exatamente igual à curvatura do planeta: você está em órbita perpétua!</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="technical-flight-guide">
            <div className="tech-eq-grid">
              <div className="tech-eq-card">
                <span className="eq-label">Equação do Foguete de Tsiolkovsky</span>
                <MathFormula math="\Delta v = I_{\text{sp}} \cdot g_0 \cdot \ln\left(\frac{m_0}{m_f}\right)" block />
                <span className="eq-desc">Determina a variação de velocidade máxima alcançável em função do impulso específico dos motores e fração mássica.</span>
              </div>
              <div className="tech-eq-card">
                <span className="eq-label">Equação Vis-Viva (Mecânica Orbital)</span>
                <MathFormula math="v^2 = \mu \left( \frac{2}{r} - \frac{1}{a} \right)" block />
                <span className="eq-desc">Relaciona a velocidade orbital escalar v com a distância geocêntrica r e o semieixo maior da elipse orbital a.</span>
              </div>
              <div className="tech-eq-card">
                <span className="eq-label">Arrasto Aerodinâmico e Pressão Max-Q</span>
                <MathFormula math="F_D = \frac{1}{2} \rho(h) v^2 C_d A" block />
                <span className="eq-desc">Pico de estresse estrutural que ocorre quando o produto da densidade pelo quadrado da velocidade atinge seu máximo absoluto.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
