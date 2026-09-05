import { useState } from 'react';
import {
  COSMOLOGICAL_EPOCHS,
  NASA_OBSERVATORIES,
  NASA_DEEP_FIELD_TARGETS,
  type CosmologicalEpoch,
  type NasaObservatory,
} from '../../data/nasaCosmologyData';
import MathFormula from '../MathFormula';

interface Props {
  isLaymanMode: boolean;
}

type NasaViewMode = 'epochs' | 'observatories' | 'deep_field';

export default function NasaCosmologyObservatory({ isLaymanMode }: Props) {
  const [activeView, setActiveView] = useState<NasaViewMode>('epochs');
  const [selectedEpochId, setSelectedEpochId] = useState<string>('recombination_cmb');
  const [selectedObsId, setSelectedObsId] = useState<string>('jwst');

  const activeEpoch: CosmologicalEpoch =
    COSMOLOGICAL_EPOCHS.find(e => e.id === selectedEpochId) || COSMOLOGICAL_EPOCHS[0];
  const activeObs: NasaObservatory =
    NASA_OBSERVATORIES.find(o => o.id === selectedObsId) || NASA_OBSERVATORIES[0];

  return (
    <div className="nasa-observatory-container">
      {/* 1. Observatory Top HUD Banner */}
      <div className="nasa-obs-header">
        <div className="nasa-header-left">
          <div className="nasa-meatball-logo">
            <span className="nasa-badge-txt">NASA</span>
          </div>
          <div className="nasa-title-meta">
            <div className="nasa-kicker-group">
              <span className="nasa-status-dot" />
              <span className="nasa-kicker">SCIENCE MISSION DIRECTORATE // ASTROPHYSICS ARCHIVE</span>
            </div>
            <h2 className="nasa-main-title">
              Observatório Cosmológico & Grandes Telescópios da NASA
            </h2>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="nasa-view-nav" role="tablist">
          <button
            type="button"
            className={`nasa-tab-btn ${activeView === 'epochs' ? 'active' : ''}`}
            onClick={() => setActiveView('epochs')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>01 // ÉPOCAS DO UNIVERSO</span>
          </button>
          <button
            type="button"
            className={`nasa-tab-btn ${activeView === 'observatories' ? 'active' : ''}`}
            onClick={() => setActiveView('observatories')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <span>02 // GRANDES OBSERVATÓRIOS</span>
          </button>
          <button
            type="button"
            className={`nasa-tab-btn ${activeView === 'deep_field' ? 'active' : ''}`}
            onClick={() => setActiveView('deep_field')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="22" y1="12" x2="18" y2="12" />
              <line x1="6" y1="12" x2="2" y2="12" />
              <line x1="12" y1="6" x2="12" y2="2" />
              <line x1="12" y1="22" x2="12" y2="18" />
            </svg>
            <span>03 // ESPAÇO PROFUNDO & EXOPLANETAS</span>
          </button>
        </div>
      </div>

      {/* 2. Content: Cosmological Epochs Timeline */}
      {activeView === 'epochs' && (
        <div className="nasa-epochs-layout">
          {/* Epochs Selector Strip */}
          <div className="nasa-epoch-selector-track">
            {COSMOLOGICAL_EPOCHS.map((epoch, idx) => (
              <button
                key={epoch.id}
                type="button"
                className={`nasa-epoch-pill ${epoch.id === selectedEpochId ? 'active' : ''}`}
                onClick={() => setSelectedEpochId(epoch.id)}
                style={{
                  borderLeftColor: epoch.color,
                }}
              >
                <div className="epoch-pill-top">
                  <span className="epoch-idx">ERA {idx + 1}</span>
                  <span className="epoch-time">{epoch.timeRange}</span>
                </div>
                <strong className="epoch-name">{epoch.name.replace(/^\d+\s*\/\/\s*/, '')}</strong>
              </button>
            ))}
          </div>

          {/* Active Epoch Detailed Dossier */}
          <div className="nasa-epoch-dossier-card" style={{ borderColor: activeEpoch.color }}>
            <div className="epoch-dossier-header">
              <div>
                <span className="epoch-kicker" style={{ color: activeEpoch.color }}>
                  {activeEpoch.keyPhenomenon.toUpperCase()}
                </span>
                <h3 className="epoch-title">{activeEpoch.name}</h3>
              </div>
              <div className="epoch-stats-group">
                <div className="epoch-stat-pill">
                  <span className="lbl">TEMPERATURA:</span>
                  <strong className="val">{activeEpoch.temperature}</strong>
                </div>
                <div className="epoch-stat-pill">
                  <span className="lbl">REDSHIFT:</span>
                  <strong className="val">{activeEpoch.redshiftRange}</strong>
                </div>
              </div>
            </div>

            <div className="epoch-text-grid">
              <div className="epoch-narrative-box">
                <span className="box-tag">
                  {isLaymanMode ? 'COMO ENTENDER ESTA ÉPOCA (DIDÁTICO)' : 'MECÂNICA FÍSICA DETALHADA'}
                </span>
                <p className="epoch-main-desc">
                  {isLaymanMode ? activeEpoch.descriptionDidactic : activeEpoch.descriptionTechnical}
                </p>
                <div className="epoch-physics-meta">
                  <span><strong>Física Primária:</strong> {activeEpoch.primaryPhysics}</span>
                  <span><strong>Referência de Missão NASA:</strong> {activeEpoch.nasaMissionRef}</span>
                </div>
              </div>

              {/* KaTeX Equation for this Epoch */}
              {activeEpoch.formula && (
                <div className="epoch-equation-box">
                  <span className="box-tag">EQUAÇÃO FUNDAMENTAL DA ÉPOCA</span>
                  <div className="epoch-formula-wrap">
                    <MathFormula math={activeEpoch.formula} block className="epoch-katex" />
                  </div>
                  <small className="epoch-formula-label">{activeEpoch.formulaLabel}</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Content: NASA Great Observatories */}
      {activeView === 'observatories' && (
        <div className="nasa-observatories-layout">
          {/* Telescope cards grid */}
          <div className="nasa-telescopes-nav-grid">
            {NASA_OBSERVATORIES.map(obs => (
              <button
                key={obs.id}
                type="button"
                className={`nasa-obs-card-btn ${obs.id === selectedObsId ? 'active' : ''}`}
                onClick={() => setSelectedObsId(obs.id)}
              >
                <div className="obs-btn-header">
                  <span className="obs-acronym" style={{ color: obs.color }}>{obs.acronym}</span>
                  <span className="obs-status-tag">{obs.missionStatus.split('//')[0]}</span>
                </div>
                <strong className="obs-fullname">{obs.name}</strong>
                <span className="obs-launch">Lançado: {obs.launchDate.split('de').slice(-1)[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Telescope Technical Readout */}
          <div className="nasa-obs-detail-card" style={{ borderColor: activeObs.color }}>
            <div className="obs-detail-top">
              <div>
                <span className="obs-kicker" style={{ color: activeObs.color }}>
                  GRANDES OBSERVATÓRIOS // TELEMETRIA OFICIAL NASA
                </span>
                <h3 className="obs-detail-title">{activeObs.name} ({activeObs.acronym})</h3>
                <span className="obs-orbit-info"><strong>Órbita:</strong> {activeObs.orbitType}</span>
              </div>
              <span className="obs-status-badge">{activeObs.missionStatus}</span>
            </div>

            {/* Telemetry Matrix Grid */}
            <div className="obs-telemetry-matrix">
              <div className="obs-metric-box">
                <span className="lbl">DISTÂNCIA DA TERRA</span>
                <strong className="val">{activeObs.technicalTelemetry.distanceFromEarth}</strong>
              </div>
              <div className="obs-metric-box">
                <span className="lbl">TEMPERATURA OPERACIONAL</span>
                <strong className="val">{activeObs.technicalTelemetry.operatingTemp}</strong>
              </div>
              <div className="obs-metric-box">
                <span className="lbl">ESPELHO / COLETOR</span>
                <strong className="val">{activeObs.primaryMirror}</strong>
              </div>
              <div className="obs-metric-box">
                <span className="lbl">COMPRIMENTO DE ONDA</span>
                <strong className="val">{activeObs.wavelength}</strong>
              </div>
            </div>

            <div className="obs-narrative-block">
              <div className="obs-discovery-highlight">
                <span className="badge-kicker">DESCOBERTA / REVOLUÇÃO CIENTÍFICA:</span>
                <p>{activeObs.highlightDiscovery}</p>
              </div>
              <div className="obs-target-highlight">
                <span className="badge-kicker">ALVO DE DESTAQUE:</span>
                <p>{activeObs.featuredTarget}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Content: Deep Field Targets & Exoplanets */}
      {activeView === 'deep_field' && (
        <div className="nasa-deepfield-layout">
          <div className="deepfield-intro-bar">
            <span className="df-kicker">OBSERVAÇÕES HISTÓRICAS DE ESPAÇO PROFUNDO (NASA / ESA)</span>
            <p>
              Fenômenos extremos que comprovam a curvatura da luz pela gravidade, o número impressionante de galáxias no cosmos e mundos rochosos habitáveis fora do Sistema Solar.
            </p>
          </div>

          <div className="deepfield-cards-grid">
            {NASA_DEEP_FIELD_TARGETS.map(target => (
              <div key={target.id} className="df-card">
                <div className="df-card-header">
                  <strong className="df-title">{target.name}</strong>
                  <span className="df-dist">{target.distance}</span>
                </div>
                <div className="df-card-meta">
                  <span><strong>Constelação:</strong> {target.constellation}</span>
                </div>
                <p className="df-desc">{target.description}</p>
                <div className="df-fact-badge">
                  <span className="df-fact-tag">FATO CIENTÍFICO</span>
                  <p>{target.scientificFact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
