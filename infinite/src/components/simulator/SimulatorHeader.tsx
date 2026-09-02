import { useState } from 'react';
import { useLaymanMode } from '../../context/LaymanModeContext';
import { Universe } from '../../types/temporal';
import { getStoredLanguage, setStoredLanguage, DICTIONARY } from '../../utils/i18n';
import type { Language } from '../../utils/i18n';
import { URLCompression } from '../../utils/urlCompression';

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
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExport: (format: 'json' | 'csv' | 'latex' | 'bibtex' | 'png') => void;
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
            className="sim-btn-icon-util"
            onClick={toggleLanguage}
            title="Alternar Idioma (Português / English)"
            style={{ fontWeight: 700, fontSize: '0.72rem' }}
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
            {isLaymanMode ? 'Comparar Histórias' : t.splitView}
          </button>

          <button
            type="button"
            className="sim-btn-monte-carlo"
            onClick={onOpenMonteCarlo}
            title={isLaymanMode ? 'Testar milhares de futuros possíveis com o computador' : 'Executar Simulação Estocástica de Monte Carlo'}
          >
            {isLaymanMode ? 'Testar Futuros' : t.monteCarlo}
          </button>

          <button
            type="button"
            className="sim-btn-conference"
            onClick={onOpenConferenceMode}
            title={isLaymanMode ? 'Abrir Apresentação Fácil de Slides' : 'Abrir Modo Apresentação de Slides Acadêmico'}
          >
            {isLaymanMode ? 'Slides' : t.presentation}
          </button>

          <button
            type="button"
            className="sim-btn-3d"
            onClick={onOpenMinkowski3D}
            title={isLaymanMode ? 'Ver em 3D como o tempo e o espaço se conectam' : 'Visualizar Cones de Luz 3D de Minkowski'}
          >
            {isLaymanMode ? 'Visualizador 3D' : t.cones3D}
          </button>

          <button
            type="button"
            className="sim-btn-ai"
            onClick={onToggleAIDrawer}
            title={isLaymanMode ? 'Conversar com a Inteligência Artificial sobre a história' : 'Abrir Oráculo de IA com Pesquisa Científica Primária'}
          >
            {isLaymanMode ? 'Assistente IA' : t.aiOracle}
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
            {isLaymanMode ? 'Mudar Passado' : t.intervention}
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
          {onOpenGuide && (
            <button
              type="button"
              className="sim-btn-icon-util"
              onClick={onOpenGuide}
              title="Abrir Manual de Como Funciona o Simulador"
            >
              Guia
            </button>
          )}
          <button
            type="button"
            className="sim-btn-icon-util"
            onClick={onReset}
            title="Resetar Modelo Padrão"
          >
            Reset
          </button>
          <select
            className="sim-export-select"
            defaultValue=""
            onChange={event => {
              if (event.target.value) onExport(event.target.value as 'json' | 'csv' | 'latex' | 'bibtex' | 'png');
              event.target.value = '';
            }}
            aria-label="Exportar modelo"
          >
            <option value="">{t.export}</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="latex">LaTeX (.tex)</option>
            <option value="bibtex">BibTeX (.bib)</option>
            <option value="png">Imagem Poster 4K</option>
          </select>
        </div>
      </div>
    </header>
  );
}

