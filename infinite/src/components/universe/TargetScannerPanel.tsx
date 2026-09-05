/**
 * TargetScannerPanel.tsx
 *
 * Painel Tático de Telemetria e Scanner Astrofísico com Sistema de Abas:
 * [01 // VISOR 3D]: Renderizador fotorrealista de alta qualidade com controles físicos.
 * [02 // TELEMETRIA & ÓRBITA]: Elementos keplerianos, vetores de estado e gravitação.
 * [03 // GEOLOGIA & INTERIOR]: Estrutura de camadas internas (núcleo, manto, crosta / ergosfera).
 * [04 // ATMOSFERA & ESPECTRO]: Composição gasosa em barras, pressão barométrica e perfil térmico.
 * [05 // MISSÕES HISTÓRICAS]: Histórico de exploração espacial da humanidade (NASA/ESA/JAXA).
 * [06 // VOO AEROESPACIAL]: Requisitos de Delta-V e parâmetros de voo estilo KSP.
 *
 * Inclui diferenciação profunda e dinâmica entre Modo Técnico e Modo Didático.
 */

import { useState, useEffect } from 'react';
import type { CelestialBody } from '../../data/celestialBodies';
import { getBodyDetails } from '../../data/celestialBodyDetails';
import CelestialRenderer3D from './CelestialRenderer3D';
import RealPhotographicViewer from './RealPhotographicViewer';
import MathFormula, { MathText } from '../MathFormula';
import { useLaymanMode } from '../../context/LaymanModeContext';
import { CosmicAudio } from '../../engine/CosmicAudioEngine';

interface Props {
  body: CelestialBody;
  onOpenAerospaceSim?: () => void;
}

type ScannerTab = 'visualizer' | 'telemetry' | 'geology' | 'atmosphere' | 'missions' | 'aerospace';
type VisorMode = 'real_photo' | 'simulation_3d';

export default function TargetScannerPanel({ body, onOpenAerospaceSim }: Props) {
  const { isLaymanMode, toggleLaymanMode } = useLaymanMode();
  const [activeTab, setActiveTab] = useState<ScannerTab>('visualizer');
  const [visorMode, setVisorMode] = useState<VisorMode>('simulation_3d');

  const details = getBodyDetails(body.id);

  // Play audio blip whenever target changes
  useEffect(() => {
    try {
      CosmicAudio.playNodeSelect(90);
    } catch {
      // Audio fallback
    }
  }, [body.id]);

  return (
    <div className="ed-scanner-panel">
      {/* 1. HUD Header with Target Lock & Distance */}
      <div className="ed-scanner-header">
        <div className="ed-target-badge-group">
          <span className="ed-target-status-tag">TARGET LOCK // ACTIVE</span>
          <span className="ed-target-designation">{body.designation}</span>
        </div>
        <div className="ed-scanner-coords">
          <span>DISTÂNCIA:</span>
          <strong>{body.distanceFromEarth}</strong>
        </div>
      </div>

      <div className="ed-target-main-title">
        <div>
          <h2 className="ed-target-name">{body.name}</h2>
          <span className="ed-target-type">{body.type}</span>
        </div>

        {/* Mode indicator pill */}
        <button
          type="button"
          className={`ed-mode-pill ${isLaymanMode ? 'pill-didactic' : 'pill-technical'}`}
          onClick={toggleLaymanMode}
          title="Clique para alternar entre Modo Didático e Modo Técnico"
        >
          {isLaymanMode ? 'MODO DIDÁTICO ATIVO' : 'MODO TÉCNICO FORMAL'}
        </button>
      </div>

      {/* 2. Scanner Tab Navigation Bar */}
      <div className="ed-scanner-tabs-bar" role="tablist">
        <button
          type="button"
          className={`scanner-tab-btn ${activeTab === 'visualizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualizer')}
        >
          01 // VISOR
        </button>
        <button
          type="button"
          className={`scanner-tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          02 // TELEMETRIA
        </button>
        <button
          type="button"
          className={`scanner-tab-btn ${activeTab === 'geology' ? 'active' : ''}`}
          onClick={() => setActiveTab('geology')}
        >
          03 // GEOLOGIA
        </button>
        {body.atmosphere && body.atmosphere.length > 0 && (
          <button
            type="button"
            className={`scanner-tab-btn ${activeTab === 'atmosphere' ? 'active' : ''}`}
            onClick={() => setActiveTab('atmosphere')}
          >
            04 // ATMOSFERA
          </button>
        )}
        <button
          type="button"
          className={`scanner-tab-btn ${activeTab === 'missions' ? 'active' : ''}`}
          onClick={() => setActiveTab('missions')}
        >
          05 // MISSÕES
        </button>
        <button
          type="button"
          className={`scanner-tab-btn ${activeTab === 'aerospace' ? 'active' : ''}`}
          onClick={() => setActiveTab('aerospace')}
        >
          06 // AEROESPACIAL
        </button>
      </div>

      {/* 3. Tab Content Viewport */}
      <div className="ed-tab-content-area">
        {/* TAB 1: VISOR FOTOGRÁFICO REAL & SIMULAÇÃO 3D */}
        {activeTab === 'visualizer' && (
          <div className="tab-pane visualizer-pane">
            {/* Seletor de Modo do Visor: FOTOGRAFIA REAL vs MODELO 3D */}
            <div className="ed-visor-mode-bar">
              <button
                type="button"
                className={`ed-visor-mode-btn ${visorMode === 'real_photo' ? 'active' : ''}`}
                onClick={() => setVisorMode('real_photo')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>FOTOGRAFIA & DADOS REAIS (NASA / EHT)</span>
                <span className="ed-visor-badge">HD</span>
              </button>

              <button
                type="button"
                className={`ed-visor-mode-btn ${visorMode === 'simulation_3d' ? 'active' : ''}`}
                onClick={() => setVisorMode('simulation_3d')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>SIMULAÇÃO 3D INTERATIVA</span>
                <span className="ed-visor-badge">60 FPS</span>
              </button>
            </div>

            {/* Conteúdo Ativo do Visor */}
            {visorMode === 'real_photo' ? (
              <RealPhotographicViewer body={body} isLaymanMode={isLaymanMode} />
            ) : (
              <div className="ed-scanner-viewport-box">
                <div className="ed-viewport-corner ed-corner-tl" />
                <div className="ed-viewport-corner ed-corner-tr" />
                <div className="ed-viewport-corner ed-corner-bl" />
                <div className="ed-viewport-corner ed-corner-br" />

                <CelestialRenderer3D body={body} isLaymanMode={isLaymanMode} />
              </div>
            )}

            {/* Quick Dossier Snippet below visualizer */}
            <div className="ed-fact-dossier">
              <div className="ed-fact-header">
                <span className="ed-fact-tag">
                  {isLaymanMode ? 'RESUMO DIDÁTICO' : 'DOSSIÊ CIENTÍFICO'}
                </span>
              </div>
              <p className="ed-fact-text">
                {isLaymanMode ? details.didactic.whatIsIt : body.scientificFact}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: TELEMETRIA ASTROFÍSICA & ELEMENTOS KEPLERIANOS */}
        {activeTab === 'telemetry' && (
          <div className="tab-pane telemetry-pane">
            <div className="ed-sec-heading">
              <span className="ed-sec-kicker">MATRIZ DE TELEMETRIA ASTROFÍSICA</span>
            </div>

            <div className="ed-telemetry-grid">
              <div className="ed-telemetry-cell">
                <span className="ed-cell-label">RAIO FÍSICO</span>
                <strong className="ed-cell-val">{body.radiusDisplay}</strong>
              </div>

              <div className="ed-telemetry-cell">
                <span className="ed-cell-label">MASSA ESTIMADA</span>
                <strong className="ed-cell-val">{body.massDisplay}</strong>
              </div>

              <div className="ed-telemetry-cell">
                <span className="ed-cell-label">GRAVIDADE SUPERFICIAL</span>
                <strong className="ed-cell-val">{body.surfaceGravity}</strong>
              </div>

              <div className="ed-telemetry-cell">
                <span className="ed-cell-label">TEMPERATURA</span>
                <strong className="ed-cell-val">{body.temperatureDisplay}</strong>
              </div>

              <div className="ed-telemetry-cell">
                <span className="ed-cell-label">VELOCIDADE DE ESCAPE</span>
                <strong className="ed-cell-val">{body.escapeVelocityKmS}</strong>
              </div>

              {body.orbitalPeriod && (
                <div className="ed-telemetry-cell">
                  <span className="ed-cell-label">PERÍODO ORBITAL</span>
                  <strong className="ed-cell-val">{body.orbitalPeriod}</strong>
                </div>
              )}

              {body.rotationPeriod && (
                <div className="ed-telemetry-cell">
                  <span className="ed-cell-label">PERÍODO DE ROTAÇÃO</span>
                  <strong className="ed-cell-val">{body.rotationPeriod}</strong>
                </div>
              )}

              {body.spectralClass && (
                <div className="ed-telemetry-cell">
                  <span className="ed-cell-label">CLASSE ESPECTRAL</span>
                  <strong className="ed-cell-val">{body.spectralClass}</strong>
                </div>
              )}
            </div>

            {/* Keplerian Orbital Elements Box */}
            <div className="keplerian-dossier-box">
              <span className="dossier-sub-kicker">ELEMENTOS ORBITAIS KEPLERIANOS</span>
              <div className="keplerian-grid">
                <div className="kepler-item">
                  <span>SEMIEIXO MAIOR (a):</span>
                  <strong>{details.keplerian.semiMajorAxisAU > 0 ? `${details.keplerian.semiMajorAxisAU} AU` : 'N/A (Centro)'}</strong>
                </div>
                <div className="kepler-item">
                  <span>EXCENTRICIDADE (e):</span>
                  <strong>{details.keplerian.eccentricity}</strong>
                </div>
                <div className="kepler-item">
                  <span>INCLINAÇÃO (i):</span>
                  <strong>{details.keplerian.inclinationDeg}°</strong>
                </div>
                <div className="kepler-item">
                  <span>VELOCIDADE MÉDIA:</span>
                  <strong>{details.keplerian.orbitalVelocityKmS} km/s</strong>
                </div>
              </div>
            </div>

            {/* Deep Technical Equations or Didactic Analogy */}
            {isLaymanMode ? (
              <div className="mode-explainer-box didactic-box">
                <span className="box-title">ANALOGIA DO DIA A DIA</span>
                <p>{details.didactic.everydayAnalogy}</p>
                <span className="box-title" style={{ marginTop: 8 }}>E SE VOCÊ ESTIVESSE LÁ?</span>
                <p>{details.didactic.ifYouWereThere}</p>
              </div>
            ) : (
              <div className="mode-explainer-box technical-box">
                <span className="box-title">FORMULAÇÃO MATEMÁTICA & EQUAÇÕES FUNDAMENTAIS</span>
                <p className="formal-def">{details.technical.formalDefinition}</p>
                <div className="equations-stack">
                  {details.technical.primaryEquations.map((eq, idx) => (
                    <div key={idx} className="eq-item">
                      <span className="eq-name">{eq.label}:</span>
                      <div className="eq-formula-container">
                        <MathFormula math={eq.formula} block className="eq-formula-katex" />
                      </div>
                      <p className="eq-desc">
                        <MathText text={eq.desc} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GEOLOGIA & ESTRUTURA INTERNA */}
        {activeTab === 'geology' && (
          <div className="tab-pane geology-pane">
            <div className="ed-sec-heading">
              <span className="ed-sec-kicker">ESTRUTURA DE CAMADAS & GEOLOGIA INTERNA</span>
            </div>

            <div className="geology-layers-stack">
              {details.geology.map((layer, idx) => (
                <div key={idx} className="geology-layer-card">
                  <div className="layer-color-stripe" style={{ backgroundColor: layer.color }} />
                  <div className="layer-content">
                    <div className="layer-header-row">
                      <strong className="layer-name">{layer.name}</strong>
                      <span className="layer-depth">{layer.depthKm}</span>
                    </div>
                    <div className="layer-sub-row">
                      <span><strong>Temp:</strong> {layer.temperature}</span>
                      <span><strong>Composição:</strong> {layer.composition}</span>
                    </div>
                    <p className="layer-desc">{layer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ATMOSFERA & ESPECTROGRAFIA */}
        {activeTab === 'atmosphere' && body.atmosphere && (
          <div className="tab-pane atmosphere-pane">
            <div className="ed-sec-heading">
              <span className="ed-sec-kicker">ESPECTROGRAFIA DE COMPOSIÇÃO ATMOSFÉRICA</span>
            </div>

            <div className="ed-composition-bar-track">
              {body.atmosphere.map((elem, idx) => (
                <div
                  key={idx}
                  className="ed-comp-segment"
                  style={{
                    width: `${elem.percentage}%`,
                    backgroundColor: elem.color,
                  }}
                  title={`${elem.name}: ${elem.percentage}%`}
                />
              ))}
            </div>

            <div className="ed-composition-legend">
              {body.atmosphere.map((elem, idx) => (
                <div key={idx} className="ed-legend-chip">
                  <span className="ed-chip-dot" style={{ backgroundColor: elem.color }} />
                  <span className="ed-chip-name">{elem.name}</span>
                  <strong className="ed-chip-pct">{elem.percentage}%</strong>
                </div>
              ))}
            </div>

            <div className="atmo-properties-grid">
              <div className="atmo-prop-item">
                <span>PRESSÃO SUPERFICIAL:</span>
                <strong>{details.aerospace.surfacePressureBar} bar</strong>
              </div>
              <div className="atmo-prop-item">
                <span>ESCALA DE ALTURA (H):</span>
                <strong>{details.aerospace.scaleHeightKm} km</strong>
              </div>
              <div className="atmo-prop-item">
                <span>AEROFRENAGEM:</span>
                <strong style={{ color: details.aerospace.aerobrakingFeasible ? '#22c55e' : '#ef4444' }}>
                  {details.aerospace.aerobrakingFeasible ? 'VIÁVEL / POSSÍVEL' : 'INVIÁVEL'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HISTÓRICO DE MISSÕES & EXPLORAÇÃO HUMANA */}
        {activeTab === 'missions' && (
          <div className="tab-pane missions-pane">
            <div className="ed-sec-heading">
              <span className="ed-sec-kicker">HISTÓRICO DE MISSÕES DE EXPLORAÇÃO ESPACIAL</span>
            </div>

            <div className="ed-missions-badges-row">
              {body.explorationMissions.map((m, idx) => (
                <span key={idx} className="ed-mission-tag">
                  {m}
                </span>
              ))}
            </div>

            <div className="missions-narrative-card">
              <span className="card-kicker">COMO A HUMANIDADE EXPLOROU ESTE CORPO:</span>
              <p>{details.didactic.howToReachIt}</p>
            </div>

            {/* Quick Fun Facts */}
            <div className="trivia-list-box">
              <span className="card-kicker">FATOS CIENTÍFICOS VERIFICADOS:</span>
              <ul>
                {details.didactic.funFacts.map((fact, idx) => (
                  <li key={idx}>{fact}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 6: ENGENHARIA AEROESPACIAL & VOO (KSP / RE-ENTRY) */}
        {activeTab === 'aerospace' && (
          <div className="tab-pane aerospace-pane">
            <div className="ed-sec-heading">
              <span className="ed-sec-kicker">ORÇAMENTO DE DELTA-V & ENGENHARIA DE MISSÃO</span>
            </div>

            <div className="aerospace-budget-grid">
              <div className="aero-cell">
                <span className="aero-label">GRAVIDADE SUPERFICIAL</span>
                <strong className="aero-val">{details.aerospace.surfaceGravityMS2} m/s²</strong>
              </div>
              <div className="aero-cell">
                <span className="aero-label">Δv PARA ÓRBITA BAIXA</span>
                <strong className="aero-val">{details.aerospace.lowOrbitInsertionDeltaVKmS} km/s</strong>
              </div>
              <div className="aero-cell">
                <span className="aero-label">Δv PARA POUSO SUAVE</span>
                <strong className="aero-val">{details.aerospace.surfaceLandingDeltaVKmS} km/s</strong>
              </div>
              <div className="aero-cell">
                <span className="aero-label">VELOCIDADE DE ENTRADA</span>
                <strong className="aero-val">{details.aerospace.entryVelocityKmS} km/s</strong>
              </div>
            </div>

            <div className="flight-notes-card">
              <span className="notes-kicker">NOTAS DO DIRETOR DE VOO (FLIGHT DYNAMICS OFFICER):</span>
              <p>{details.aerospace.flightNotes}</p>
            </div>

            {onOpenAerospaceSim && (
              <button
                type="button"
                className="btn-launch-ksp-module"
                onClick={onOpenAerospaceSim}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 2 22 22 22" />
                </svg>
                <span>ABRIR SIMULADOR DE VOO ORBITAL COMPLETO (KSP & RE-ENTRY)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
