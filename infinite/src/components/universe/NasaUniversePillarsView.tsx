import { useState } from 'react';
import {
  NASA_UNIVERSE_PILLARS,
  type NasaUniversePillar,
} from '../../data/nasaUniversePillarsData';
import MathFormula, { MathText } from '../MathFormula';

interface Props {
  isLaymanMode: boolean;
}

export default function NasaUniversePillarsView({ isLaymanMode }: Props) {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('exoplanets');

  const activePillar: NasaUniversePillar =
    NASA_UNIVERSE_PILLARS.find(p => p.id === selectedPillarId) || NASA_UNIVERSE_PILLARS[0];

  return (
    <div className="nasa-universe-pillars-container">
      {/* 1. Official NASA Banner Kicker */}
      <div className="nasa-official-ribbon">
        <div className="ribbon-brand">
          <span className="ribbon-meatball">NASA</span>
          <span className="ribbon-text">SCIENCE // ASTROPHYSICS DIVISION // OFFICIAL UNIVERSE PORTAL</span>
        </div>
        <a
          href="https://www.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="ribbon-external-link"
          title="Abrir o portal oficial da NASA (nasa.gov)"
        >
          <span>NASA.GOV</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      <div className="nasa-universe-split-layout">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: AUTHENTIC NASA "THE UNIVERSE" MENU (AS IN USER SCREENSHOT) */}
        {/* ========================================================================= */}
        <aside className="nasa-universe-sidebar" aria-label="Menu Oficial The Universe da NASA">
          {/* Header matching user's screenshot */}
          <div className="nasa-universe-menu-header">
            <div className="menu-header-left">
              <h3 className="nasa-universe-title">The Universe</h3>
              <span className="nasa-universe-subtitle">O Universo Segundo a NASA</span>
            </div>
            <a
              href="https://science.nasa.gov/universe/"
              target="_blank"
              rel="noopener noreferrer"
              className="nasa-universe-red-arrow-btn"
              title="Abrir a seção The Universe em science.nasa.gov"
              aria-label="Abrir The Universe na NASA"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* 8 Pillars List Navigation */}
          <nav className="nasa-universe-nav-list" role="tablist">
            {NASA_UNIVERSE_PILLARS.map(pillar => {
              const isSelected = pillar.id === selectedPillarId;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`nasa-universe-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  style={{
                    '--pillar-accent': pillar.color,
                  } as React.CSSProperties}
                >
                  <div className="item-text-wrap">
                    <span className="item-title-en">{pillar.titleEn}</span>
                    <span className="item-title-pt">{pillar.titlePt}</span>
                  </div>
                  <div className="item-arrow-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="nasa-universe-source-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Fonte Primária: <strong>science.nasa.gov/universe</strong></span>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: ACTIVE PILLAR MASTER DOSSIER */}
        {/* ========================================================================= */}
        <main
          className="nasa-pillar-dossier"
          style={{
            '--pillar-accent': activePillar.color,
          } as React.CSSProperties}
        >
          {/* Top Dossier Header */}
          <header className="pillar-dossier-hero">
            <div className="hero-kicker-row">
              <span className="pillar-badge" style={{ color: activePillar.color, borderColor: activePillar.color }}>
                {activePillar.badge}
              </span>
              <span className="pillar-official-tag">NASA ASTROPHYSICS SCIENCE DIRECTORY</span>
            </div>

            <div className="hero-title-group">
              <h2 className="pillar-main-title">{activePillar.titlePt}</h2>
              <div className="pillar-en-tag">
                <span>Título Oficial NASA:</span>
                <strong>{activePillar.titleEn}</strong>
              </div>
            </div>

            <p className="pillar-tagline">{activePillar.tagline}</p>

            <div className="pillar-action-strip">
              <a
                href={activePillar.nasaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nasa-source"
              >
                <span>Acessar Arquivo Oficial na NASA.gov</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <div className="pillar-mode-chip">
                <span>Exibindo:</span>
                <strong>{isLaymanMode ? 'Modo Didático // Intuitivo' : 'Modo Rigoroso // Acadêmico'}</strong>
              </div>
            </div>
          </header>

          {/* 4 Key Statistics Cards */}
          <section className="pillar-stats-grid" aria-label="Métricas e Censo da NASA">
            {activePillar.keyStats.map((stat, idx) => (
              <div key={idx} className="pillar-stat-card">
                <span className="stat-label">{stat.label}</span>
                <strong className="stat-value" style={{ color: activePillar.color }}>
                  {stat.value}
                </strong>
                <span className="stat-subtext">{stat.subtext}</span>
              </div>
            ))}
          </section>

          {/* Scientific Dossier Body */}
          <section className="pillar-body-section">
            <div className="pillar-narrative-card">
              <div className="narrative-badge">
                <span className="live-dot" style={{ backgroundColor: activePillar.color }} />
                <span>{isLaymanMode ? 'VISÃO INTUITIVA DA MISSÃO' : 'FUNDAMENTAÇÃO TÉCNICA E OBSERVACIONAL'}</span>
              </div>
              <p className="narrative-text">
                <MathText
                  text={isLaymanMode ? activePillar.summaryDidactic : activePillar.summaryTechnical}
                />
              </p>
            </div>

            {/* Formula KaTeX Card */}
            {activePillar.formula && (
              <div className="pillar-formula-card">
                <div className="formula-header">
                  <div className="formula-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="formula-title">{activePillar.formula.label}</h4>
                    <span className="formula-kicker">MODELAGEM FÍSICA // FORMULAÇÃO OFICIAL</span>
                  </div>
                </div>

                <div className="formula-display-box">
                  <MathFormula
                    math={activePillar.formula.latex}
                    block={true}
                    className="pillar-math-equation"
                  />
                </div>

                <p className="formula-explanation">
                  <MathText text={activePillar.formula.explanation} />
                </p>
              </div>
            )}
          </section>

          {/* Missions & Discoveries Split */}
          <section className="pillar-missions-discoveries-grid">
            {/* Key NASA Missions */}
            <div className="pillar-missions-panel">
              <h4 className="panel-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <span>MISSÕES DA NASA VINCULADAS</span>
              </h4>

              <div className="missions-list">
                {activePillar.keyMissions.map((mission, idx) => (
                  <div key={idx} className="mission-item">
                    <div className="mission-top">
                      <strong className="mission-name">{mission.name}</strong>
                      <span className={`mission-status-pill ${mission.status.toLowerCase()}`}>
                        {mission.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="mission-role">{mission.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Discoveries */}
            <div className="pillar-discoveries-panel">
              <h4 className="panel-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>DESCOBERTAS CIENTÍFICAS HISTÓRICAS</span>
              </h4>

              <ul className="discoveries-list">
                {activePillar.coreDiscoveries.map((disc, idx) => (
                  <li key={idx} className="discovery-item">
                    <span className="disc-check" style={{ color: activePillar.color }}>✓</span>
                    <span className="disc-text"><MathText text={disc} /></span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Directorate Quote */}
          <footer className="pillar-quote-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.2">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="quote-text">{activePillar.nasaDirectorateQuote}</blockquote>
          </footer>
        </main>
      </div>
    </div>
  );
}
