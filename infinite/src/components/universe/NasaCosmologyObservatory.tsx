import { useState } from 'react';
import {
  COSMOLOGICAL_EPOCHS,
  NASA_OBSERVATORIES,
  NASA_DEEP_FIELD_TARGETS,
  type CosmologicalEpoch,
  type NasaObservatory,
} from '../../data/nasaCosmologyData';
import MathFormula, { MathText } from '../MathFormula';

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
    <div className="nasa-obs-root">
      {/* 1. Observatory Top HUD Banner */}
      <header className="nasa-hud-banner">
        <div className="nasa-banner-brand">
          <div className="nasa-meatball">
            <span className="nasa-meatball-text">NASA</span>
            <div className="nasa-orbit-ring" />
          </div>
          <div className="nasa-brand-titles">
            <div className="nasa-kicker-line">
              <span className="nasa-live-beacon" />
              <span className="nasa-dept-kicker">SCIENCE MISSION DIRECTORATE // ASTROPHYSICS ARCHIVE</span>
            </div>
            <h2 className="nasa-heading">
              Observatório Cosmológico & Arquivo Astrofísico da NASA
            </h2>
          </div>
        </div>

        {/* View Mode Segmented Switcher */}
        <nav className="nasa-mode-nav" aria-label="Abas do Observatório NASA">
          <button
            type="button"
            className={`nasa-nav-btn ${activeView === 'epochs' ? 'active' : ''}`}
            onClick={() => setActiveView('epochs')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>01 // LINHA DO TEMPO CÓSMICA</span>
          </button>

          <button
            type="button"
            className={`nasa-nav-btn ${activeView === 'observatories' ? 'active' : ''}`}
            onClick={() => setActiveView('observatories')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <span>02 // GRANDES OBSERVATÓRIOS</span>
          </button>

          <button
            type="button"
            className={`nasa-nav-btn ${activeView === 'deep_field' ? 'active' : ''}`}
            onClick={() => setActiveView('deep_field')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="3" />
              <path d="M3 12h3m12 0h3M12 3v3m0 12v3" />
              <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
            </svg>
            <span>03 // CAMPO PROFUNDO & EXOPLANETAS</span>
          </button>
        </nav>
      </header>

      {/* ========================================================================= */}
      {/* VIEW 1: COSMOLOGICAL EPOCHS TIMELINE */}
      {/* ========================================================================= */}
      {activeView === 'epochs' && (
        <main className="nasa-epochs-grid">
          {/* Left Column: Interactive Epoch Timeline Rail */}
          <aside className="nasa-timeline-rail">
            <div className="nasa-rail-header">
              <span className="rail-title">ÉPOCAS COSMOLÓGICAS ({COSMOLOGICAL_EPOCHS.length})</span>
              <span className="rail-subtitle">DO BIG BANG AO BIG FREEZE</span>
            </div>

            <div className="nasa-rail-list">
              {COSMOLOGICAL_EPOCHS.map((epoch, idx) => {
                const isSelected = epoch.id === selectedEpochId;
                return (
                  <button
                    key={epoch.id}
                    type="button"
                    className={`nasa-rail-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedEpochId(epoch.id)}
                    style={{
                      '--epoch-accent': epoch.color,
                    } as React.CSSProperties}
                  >
                    <div className="rail-card-indicator" style={{ backgroundColor: epoch.color }} />
                    <div className="rail-card-body">
                      <div className="rail-card-top-row">
                        <span className="rail-card-era-badge">ERA {String(idx + 1).padStart(2, '0')}</span>
                        <span className="rail-card-redshift-pill">{epoch.redshiftRange}</span>
                      </div>
                      <strong className="rail-card-name">
                        {epoch.name.replace(/^\d+\s*\/\/\s*/, '')}
                      </strong>
                      <div className="rail-card-time-row">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{epoch.timeRange}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Master Epoch Dossier Card */}
          <section
            className="nasa-master-dossier"
            style={{
              '--epoch-accent': activeEpoch.color,
            } as React.CSSProperties}
          >
            {/* Dossier Header */}
            <div className="dossier-hero">
              <div className="dossier-titles">
                <span className="dossier-kicker" style={{ color: activeEpoch.color }}>
                  {activeEpoch.keyPhenomenon}
                </span>
                <h3 className="dossier-title">{activeEpoch.name}</h3>
              </div>

              {/* Telemetry Chips */}
              <div className="dossier-telemetry-chips">
                <div className="dossier-chip">
                  <span className="chip-label">TEMPERATURA BASAL</span>
                  <strong className="chip-value" style={{ color: activeEpoch.color }}>
                    {activeEpoch.temperature}
                  </strong>
                </div>

                <div className="dossier-chip">
                  <span className="chip-label">DESVIO PARA O VERMELHO (Z)</span>
                  <strong className="chip-value">
                    {activeEpoch.redshiftRange}
                  </strong>
                </div>

                <div className="dossier-chip">
                  <span className="chip-label">INTERVALO TEMPORAL</span>
                  <strong className="chip-value">
                    {activeEpoch.timeRange}
                  </strong>
                </div>
              </div>
            </div>

            {/* Narrative Explanation Block with MathText for KaTeX rendering */}
            <div className="dossier-narrative-card">
              <div className="narrative-tag-row">
                <span className="narrative-tag">
                  {isLaymanMode ? 'EXPLICAÇÃO DIDÁTICA' : 'MECÂNICA FÍSICA DETALHADA'}
                </span>
                <span className="narrative-mode-pill">
                  {isLaymanMode ? 'Linguagem Acessível' : 'Formalismo Astrofísico'}
                </span>
              </div>

              <div className="narrative-text">
                <MathText
                  text={isLaymanMode ? activeEpoch.descriptionDidactic : activeEpoch.descriptionTechnical}
                />
              </div>
            </div>

            {/* Physics & NASA Reference Grid */}
            <div className="dossier-details-grid">
              <div className="dossier-meta-card">
                <div className="meta-card-head">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>FÍSICA PRIMÁRIA</span>
                </div>
                <strong className="meta-card-content">{activeEpoch.primaryPhysics}</strong>
              </div>

              <div className="dossier-meta-card highlight">
                <div className="meta-card-head">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>REFERÊNCIA DE MISSÃO NASA</span>
                </div>
                <strong className="meta-card-content">{activeEpoch.nasaMissionRef}</strong>
              </div>
            </div>

            {/* Formula KaTeX Card */}
            {activeEpoch.formula && (
              <div className="dossier-formula-card">
                <div className="formula-card-top">
                  <span className="formula-kicker">EQUAÇÃO FUNDAMENTAL DA ÉPOCA</span>
                  <span className="formula-desc-tag">{activeEpoch.formulaLabel}</span>
                </div>

                <div className="formula-render-box">
                  <MathFormula math={activeEpoch.formula} block />
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: NASA GREAT OBSERVATORIES */}
      {/* ========================================================================= */}
      {activeView === 'observatories' && (
        <main className="nasa-observatories-layout">
          {/* Telescope selector cards */}
          <div className="nasa-observatories-selector">
            <div className="nasa-selector-header">
              <span className="selector-title">FROTA DE OBSERVATÓRIOS DA NASA</span>
              <span className="selector-subtitle">ESPELHOS ESPACIAIS & SENSORES ORBITAIS</span>
            </div>

            <div className="nasa-obs-cards-list">
              {NASA_OBSERVATORIES.map(obs => {
                const isSelected = obs.id === selectedObsId;
                const isFinished = obs.missionStatus.includes('CONCLUÍDA');
                const isExtended = obs.missionStatus.includes('EXTENSÃO');
                const statusClass = isFinished
                  ? 'status-concluida'
                  : isExtended
                  ? 'status-extensao'
                  : 'status-operacional';
                const statusLabel = isFinished ? 'CONCLUÍDA' : isExtended ? 'EXTENSÃO' : 'OPERACIONAL';
                const badgeAcronym = obs.acronym.includes('/')
                  ? 'PLANCK'
                  : obs.acronym.includes('VOYAGER')
                  ? 'VOYAGER'
                  : obs.acronym;

                return (
                  <button
                    key={obs.id}
                    type="button"
                    className={`nasa-obs-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedObsId(obs.id)}
                    style={{
                      '--obs-accent': obs.color,
                    } as React.CSSProperties}
                  >
                    <div className="obs-pill-indicator" style={{ backgroundColor: obs.color }} />
                    <div className="obs-pill-body">
                      <div className="obs-pill-header-row">
                        <div className="obs-pill-badge" style={{ color: obs.color, borderColor: obs.color }}>
                          {badgeAcronym}
                        </div>
                        <strong className="obs-pill-name">{obs.name}</strong>
                        <span className={`obs-pill-status ${statusClass}`}>{statusLabel}</span>
                      </div>
                      <div className="obs-pill-orbit-row">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
                        </svg>
                        <span className="obs-pill-orbit">{obs.orbitType}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Telescope Master Console */}
          <section
            className="nasa-obs-console"
            style={{
              '--obs-accent': activeObs.color,
            } as React.CSSProperties}
          >
            <div className="obs-console-header">
              <div className="obs-console-title-group">
                <span className="obs-console-kicker" style={{ color: activeObs.color }}>
                  GRANDES OBSERVATÓRIOS // TELEMETRIA OFICIAL DA NASA
                </span>
                <h3 className="obs-console-title">
                  {activeObs.name} ({activeObs.acronym})
                </h3>
                <div className="obs-console-meta-chips">
                  <div className="meta-chip">
                    <span className="meta-chip-label">LANÇAMENTO</span>
                    <strong className="meta-chip-val">{activeObs.launchDate}</strong>
                  </div>
                  <div className="meta-chip">
                    <span className="meta-chip-label">ÓRBITA</span>
                    <strong className="meta-chip-val">{activeObs.orbitType}</strong>
                  </div>
                </div>
              </div>
              <div className="obs-status-tag-active">
                <span className="status-beacon" />
                <span>{activeObs.missionStatus}</span>
              </div>
            </div>

            {/* 4-Metric Grid Matrix */}
            <div className="obs-matrix-grid">
              <div className="obs-matrix-box">
                <span className="matrix-lbl">DISTÂNCIA DA TERRA</span>
                <strong className="matrix-val" style={{ color: activeObs.color }}>
                  {activeObs.technicalTelemetry.distanceFromEarth}
                </strong>
              </div>

              <div className="obs-matrix-box">
                <span className="matrix-lbl">TEMPERATURA OPERACIONAL</span>
                <strong className="matrix-val">
                  {activeObs.technicalTelemetry.operatingTemp}
                </strong>
              </div>

              <div className="obs-matrix-box">
                <span className="matrix-lbl">ESPELHO / COLETOR</span>
                <strong className="matrix-val">
                  {activeObs.primaryMirror}
                </strong>
              </div>

              <div className="obs-matrix-box">
                <span className="matrix-lbl">COMPRIMENTO DE ONDA</span>
                <strong className="matrix-val">
                  {activeObs.wavelength}
                </strong>
              </div>
            </div>

            {/* Discoveries and Target Details with KaTeX rendering */}
            <div className="obs-cards-split">
              <div className="obs-highlight-card">
                <div className="highlight-head">
                  <span className="highlight-icon">★</span>
                  <span>DESCOBERTA / REVOLUÇÃO CIENTÍFICA</span>
                </div>
                <div className="highlight-text">
                  <MathText text={activeObs.highlightDiscovery} />
                </div>
              </div>

              <div className="obs-highlight-card target">
                <div className="highlight-head">
                  <span className="highlight-icon">◎</span>
                  <span>ALVO PRINCIPAL DE DESTAQUE</span>
                </div>
                <div className="highlight-text">
                  <MathText text={activeObs.featuredTarget} />
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: DEEP FIELD TARGETS & EXOPLANETS */}
      {/* ========================================================================= */}
      {activeView === 'deep_field' && (
        <main className="nasa-deepfield-layout">
          <div className="deepfield-banner">
            <div className="df-badge">OBSERVAÇÕES HISTÓRICAS DA NASA & ESA</div>
            <h3 className="df-banner-title">Marcos do Céu Profundo & Exoplanetas Habitáveis</h3>
            <p className="df-banner-sub">
              Janelas ópticas e infravermelhas que comprovam a curvatura da luz por lentes gravitacionais, revelam galáxias primordiais formadas pouco após o Big Bang e mapeiam mundos rochosos na zona habitável.
            </p>
          </div>

          <div className="deepfield-cards-grid">
            {NASA_DEEP_FIELD_TARGETS.map(target => (
              <div key={target.id} className="deepfield-showcase-card">
                <div className="df-card-top">
                  <div className="df-card-title-col">
                    <span className="df-constellation">{target.constellation}</span>
                    <h4 className="df-card-name">{target.name}</h4>
                  </div>
                  <span className="df-distance-pill">{target.distance}</span>
                </div>

                <div className="df-card-desc">
                  <MathText text={target.description} />
                </div>

                <div className="df-scientific-fact">
                  <span className="fact-label">DESCOBERTA / FATO OBSERVACIONAL:</span>
                  <div className="fact-body">
                    <MathText text={target.scientificFact} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
