import { useState } from 'react';
import { useLaymanMode } from '../../context/LaymanModeContext';
import { Universe } from '../../types/temporal';
import { getStoredLanguage, setStoredLanguage, DICTIONARY } from '../../utils/i18n';
import type { Language } from '../../utils/i18n';
import { URLCompression } from '../../utils/urlCompression';
import { CosmicAudio } from '../../engine/CosmicAudioEngine';

interface Props {
  universe: Universe;
  onExit: () => void;
  onOpenAddEvent: () => void;
  onOpenAddTraveler: () => void;
  onOpenTimeTravel: () => void;
  onOpenConferenceMode: () => void;
  onOpenMinkowski3D: () => void;
  onOpenMonteCarlo: () => void;
  onToggleAIDrawer: () => void;
  onOpenComparator: () => void;
  onOpenGuide?: () => void;
  onOpenShortcuts?: () => void;
  onStartTour?: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExport: (format: 'json' | 'csv' | 'latex' | 'bibtex' | 'png' | 'pdf') => void;
}

export default function SimulatorHeader({
  universe,
  onExit,
  onOpenAddEvent,
  onOpenAddTraveler,
  onOpenTimeTravel,
  onOpenConferenceMode,
  onOpenMinkowski3D,
  onOpenMonteCarlo,
  onToggleAIDrawer,
  onOpenComparator,
  onOpenGuide,
  onOpenShortcuts,
  onStartTour,
  onReset,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport,
}: Props) {
  const { isLaymanMode, toggleLaymanMode } = useLaymanMode();
  const [lang, setLang] = useState<Language>(getStoredLanguage());
  const [copiedToast, setCopiedToast] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(CosmicAudio.isMuted());
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  function toggleAudio() {
    const nextMuted = CosmicAudio.toggleMute();
    setIsAudioMuted(nextMuted);
    if (!nextMuted) CosmicAudio.playNodeSelect(80);
  }

  const t = DICTIONARY[lang];
  const integrity = universe.temporalIntegrity;
  const paradoxCount = universe.paradoxes.length;

  const integrityColor =
    integrity >= 80 ? 'var(--color-stable)' : integrity >= 50 ? 'var(--color-warning)' : 'var(--color-paradox)';

  function toggleLanguage() {
    const nextLang: Language = lang === 'pt' ? 'en' : 'pt';
    setLang(nextLang);
    setStoredLanguage(nextLang);
  }

  function handleShare() {
    const hash = URLCompression.encodeUniverseToHash(universe);
    const fullUrl = `${window.location.origin}${window.location.pathname}#u=${hash}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  }

  return (
    <header className="sim-header">
      {/* 1. Left Brand & Navigation */}
      <div className="sim-header-left">
        <button type="button" className="sim-btn-exit" onClick={onExit} title="Voltar à Página Principal">
          ← {t.home}
        </button>
        <div className="sim-brand-logo-wrap" title="Infinite Horizons">
          <img src="/logo-emblem.png" alt="Infinite Horizons Logo" className="sim-header-emblem-logo" />
        </div>
        <div className="sim-title-group">
          <h1 className="sim-universe-title" title={universe.name}>{universe.name}</h1>
          <span className="sim-universe-tag">
            {isLaymanMode ? t.laymanTagline : t.tagline}
          </span>
        </div>
      </div>

      {/* 2. Center Metrics & Stability Widget */}
      <div className="sim-header-center">
        <div className="sim-integrity-widget">
          <div className="sim-integrity-label">
            <span>{isLaymanMode ? t.laymanIntegrity : t.integrity}</span>
            <strong style={{ color: integrityColor }}>{integrity}%</strong>
          </div>
          <div className="sim-integrity-bar-track">
            <div
              className="sim-integrity-bar-fill"
              style={{ width: `${integrity}%`, backgroundColor: integrityColor }}
            />
          </div>
        </div>

        {paradoxCount > 0 ? (
          <div className="sim-paradox-badge sim-paradox-badge-active">
            <span className="badge-pulse-dot" />
            <span>{paradoxCount} {isLaymanMode ? 'PARADOXO' : 'CTC'}</span>
          </div>
        ) : (
          <div className="sim-paradox-badge sim-paradox-badge-clean">
            <span>{isLaymanMode ? t.withoutParadox : t.stable}</span>
          </div>
        )}
      </div>

      {/* 3. Right Action Groups */}
      <div className="sim-header-right">
        {/* Language & Layman Mode Switchers */}
        <div className="header-btn-group">
          <button
            type="button"
            className="sim-btn-lang-toggle"
            onClick={toggleLanguage}
            title="Alternar Idioma (Português / English)"
          >
            {lang.toUpperCase()}
          </button>
          <button
            type="button"
            className={`sim-btn-layman ${isLaymanMode ? 'active-layman' : ''}`}
            onClick={toggleLaymanMode}
            title={isLaymanMode ? 'Voltar para o Modo Acadêmico Rigoroso' : 'Ativar Modo Simplificado para Leigos'}
          >
            {isLaymanMode ? t.layman : t.academic}
          </button>
        </div>

        {/* Presentation & Visual Modes Group */}
        <div className="header-btn-group">
          <button
            type="button"
            className="sim-btn-splitview"
            onClick={onOpenComparator}
            title={isLaymanMode ? 'Comparar duas versões da história lado a lado' : 'Abrir Comparador de Dimensões em Split-View'}
          >
            <span className="btn-text-full">{isLaymanMode ? 'Comparar' : t.splitView}</span>
            <span className="btn-text-compact">Split</span>
          </button>

          <button
            type="button"
            className="sim-btn-monte-carlo"
            onClick={onOpenMonteCarlo}
            title={isLaymanMode ? 'Testar milhares de futuros possíveis com o computador' : 'Executar Simulação Estocástica de Monte Carlo'}
          >
            {isLaymanMode ? 'Monte Carlo' : t.monteCarlo}
          </button>

          <button
            type="button"
            className="sim-btn-conference"
            onClick={onOpenConferenceMode}
            title={isLaymanMode ? 'Abrir Apresentação Fácil de Slides' : 'Abrir Modo Apresentação de Slides Acadêmico'}
          >
            <span className="btn-text-full">{isLaymanMode ? 'Slides' : t.presentation}</span>
            <span className="btn-text-compact">Slides</span>
          </button>

          <button
            type="button"
            className="sim-btn-3d"
            onClick={onOpenMinkowski3D}
            title={isLaymanMode ? 'Ver em 3D como o tempo e o espaço se conectam' : 'Visualizar Cones de Luz 3D de Minkowski'}
          >
            <span className="btn-text-full">{isLaymanMode ? '3D' : t.cones3D}</span>
            <span className="btn-text-compact">3D</span>
          </button>

          <button
            type="button"
            className="sim-btn-ai"
            onClick={onToggleAIDrawer}
            title={isLaymanMode ? 'Conversar com a Inteligência Artificial sobre a história' : 'Abrir Oráculo de IA com Pesquisa Científica Primária'}
          >
            {isLaymanMode ? 'Oráculo IA' : t.aiOracle}
          </button>
        </div>

        {/* Physics Entity Actions */}
        <div className="header-btn-group">
          <button
            type="button"
            className="sim-btn-action"
            onClick={onOpenAddEvent}
            title={isLaymanMode ? 'Adicionar um novo acontecimento na linha do tempo' : 'Adicionar Nó de Geodésica'}
          >
            {isLaymanMode ? '+ Evento' : t.addNode}
          </button>
          <button
            type="button"
            className="sim-btn-action"
            onClick={onOpenAddTraveler}
            title={isLaymanMode ? 'Criar um novo viajante no tempo' : 'Registrar Sonda / Observador'}
          >
            {isLaymanMode ? '+ Viajante' : t.addObserver}
          </button>
          <button
            type="button"
            className="sim-btn-action sim-btn-travel"
            onClick={onOpenTimeTravel}
            title={isLaymanMode ? 'Fazer uma viagem no tempo para o passado ou futuro' : 'Realizar Salto Temporal Relativístico'}
          >
            {isLaymanMode ? 'Salto' : t.intervention}
          </button>
        </div>

        {/* Utilities Group & Share Link */}
        <div className="header-btn-group">
          <button
            type="button"
            className="sim-btn-share"
            onClick={handleShare}
            title="Copiar Link Compartilhável do Universo"
          >
            {copiedToast ? 'Copiado!' : 'Link'}
          </button>
          <button
            type="button"
            className="sim-btn-icon-util"
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer alteração (Ctrl+Z)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
          </button>
          <button
            type="button"
            className="sim-btn-icon-util"
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer alteração (Ctrl+Y)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
            </svg>
          </button>
          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            className={`sim-btn-icon-util ${!isAudioMuted ? 'active-audio' : ''}`}
            onClick={toggleAudio}
            title={isAudioMuted ? 'Ativar Efeitos Sonoros Cósmicos' : 'Silenciar Áudio Cósmico'}
            aria-label="Controle de Áudio Cósmico"
          >
            {isAudioMuted ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>

          {/* Keyboard Shortcuts Cheatsheet */}
          {onOpenShortcuts && (
            <button
              type="button"
              className="sim-btn-icon-util btn-util-secondary"
              onClick={onOpenShortcuts}
              title="Guia de Atalhos de Teclado (Pressione ?)"
              aria-label="Atalhos de Teclado"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
          )}

          {/* Interactive Guided Tour */}
          {onStartTour && (
            <button
              type="button"
              className="sim-btn-icon-util btn-util-secondary btn-tour-trigger"
              onClick={onStartTour}
              title="Iniciar Tour Guiado Interativo na Tela"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )}

          {onOpenGuide && (
            <button
              type="button"
              className="sim-btn-icon-util btn-util-secondary"
              onClick={onOpenGuide}
              title="Abrir Manual de Como Funciona o Simulador"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </button>
          )}

          <button
            type="button"
            className="sim-btn-icon-util btn-util-secondary"
            onClick={onReset}
            title="Resetar Modelo Padrão"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>

          <select
            className="sim-export-select"
            defaultValue=""
            onChange={event => {
              if (event.target.value) onExport(event.target.value as 'json' | 'csv' | 'latex' | 'bibtex' | 'png' | 'pdf');
              event.target.value = '';
            }}
            aria-label="Exportar modelo"
          >
            <option value="">{t.export}</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="latex">Artigo LaTeX (.tex)</option>
            <option value="pdf">Relatório PDF / Imprimir</option>
            <option value="bibtex">BibTeX (.bib)</option>
            <option value="png">Poster 4K</option>
          </select>
        </div>

        {/* Mobile Header Actions Trigger */}
        <button
          type="button"
          className="sim-btn-mobile-menu-trigger"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Abrir menu de ferramentas móvel"
        >
          {showMobileMenu ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Fechar</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span>Menu</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Actions Drawer (Overlay for Small Devices) */}
      {showMobileMenu && (
        <div className="sim-mobile-drawer-backdrop" onClick={() => setShowMobileMenu(false)}>
          <div className="sim-mobile-drawer-card" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="drawer-kicker">FERRAMENTAS & MODOS</span>
              <button
                type="button"
                className="btn-close-drawer"
                onClick={() => setShowMobileMenu(false)}
                aria-label="Fechar gaveta"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mobile-drawer-grid">
              <button
                type="button"
                className="mobile-drawer-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenConferenceMode();
                }}
              >
                <span className="drawer-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <div className="drawer-item-text">
                  <strong>Apresentação</strong>
                  <small>Fórmulas e modo palestra</small>
                </div>
              </button>

              <button
                type="button"
                className="mobile-drawer-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenMinkowski3D();
                }}
              >
                <span className="drawer-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </span>
                <div className="drawer-item-text">
                  <strong>Visualizador 3D</strong>
                  <small>Cones de luz & Calabi-Yau</small>
                </div>
              </button>

              <button
                type="button"
                className="mobile-drawer-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenMonteCarlo();
                }}
              >
                <span className="drawer-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 8h.01" />
                    <path d="M8 8h.01" />
                    <path d="M8 16h.01" />
                    <path d="M16 16h.01" />
                    <path d="M12 12h.01" />
                  </svg>
                </span>
                <div className="drawer-item-text">
                  <strong>Monte Carlo</strong>
                  <small>1.000 iterações estocásticas</small>
                </div>
              </button>

              <button
                type="button"
                className="mobile-drawer-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenComparator();
                }}
              >
                <span className="drawer-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                  </svg>
                </span>
                <div className="drawer-item-text">
                  <strong>Comparador</strong>
                  <small>Comparar linhas temporais</small>
                </div>
              </button>

              <button
                type="button"
                className="mobile-drawer-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onToggleAIDrawer();
                }}
              >
                <span className="drawer-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" />
                    <line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" />
                    <line x1="15" y1="20" x2="15" y2="23" />
                  </svg>
                </span>
                <div className="drawer-item-text">
                  <strong>Oráculo IA</strong>
                  <small>Pesquisa & física relativística</small>
                </div>
              </button>

              <button
                type="button"
                className="mobile-drawer-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenAddEvent();
                }}
              >
                <span className="drawer-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
                <div className="drawer-item-text">
                  <strong>Adicionar Nó</strong>
                  <small>Novo marco na geodésica</small>
                </div>
              </button>

              <button
                type="button"
                className="mobile-drawer-item"
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenTimeTravel();
                }}
              >
                <span className="drawer-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <div className="drawer-item-text">
                  <strong>Salto Temporal</strong>
                  <small>Intervenção relativística</small>
                </div>
              </button>
            </div>

            <div className="mobile-drawer-footer">
              <button type="button" className="btn-drawer-action" onClick={toggleLaymanMode}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>{isLaymanMode ? 'Modo Técnico' : 'Modo Didático'}</span>
              </button>
              <button type="button" className="btn-drawer-action" onClick={handleShare}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>{copiedToast ? 'Copiado' : 'Compartilhar'}</span>
              </button>
              <button type="button" className="btn-drawer-action" onClick={onExit}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

