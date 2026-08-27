import { Universe } from '../../types/temporal';

interface Props {
  universe: Universe;
  onExit: () => void;
  onOpenAddEvent: () => void;
  onOpenAddTraveler: () => void;
  onOpenTimeTravel: () => void;
  onOpenConferenceMode: () => void;
  onOpenMinkowski3D: () => void;
  onToggleAIDrawer: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExport: (format: 'json' | 'csv') => void;
}

export default function SimulatorHeader({
  universe,
  onExit,
  onOpenAddEvent,
  onOpenAddTraveler,
  onOpenTimeTravel,
  onOpenConferenceMode,
  onOpenMinkowski3D,
  onToggleAIDrawer,
  onReset,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport,
}: Props) {
  const integrity = universe.temporalIntegrity;
  const paradoxCount = universe.paradoxes.length;

  const integrityColor =
    integrity >= 80 ? 'var(--color-stable)' : integrity >= 50 ? 'var(--color-warning)' : 'var(--color-paradox)';

  return (
    <header className="sim-header">
      {/* 1. Left Brand & Navigation */}
      <div className="sim-header-left">
        <button type="button" className="sim-btn-exit" onClick={onExit} title="Voltar à Página Principal">
          ← Início
        </button>
        <div className="sim-title-group">
          <h1 className="sim-universe-title" title={universe.name}>{universe.name}</h1>
          <span className="sim-universe-tag">LABORATÓRIO DE FÍSICA TEÓRICA & CAUSALIDADE</span>
        </div>
      </div>

      {/* 2. Center Metrics & Stability Widget */}
      <div className="sim-header-center">
        <div className="sim-integrity-widget">
          <div className="sim-integrity-label">
            <span>INTEGRIDADE (NOVIKOV)</span>
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
            <span>{paradoxCount} CTC</span>
          </div>
        ) : (
          <div className="sim-paradox-badge sim-paradox-badge-clean">
            <span>ESTÁVEL</span>
          </div>
        )}
      </div>

      {/* 3. Right Action Groups */}
      <div className="sim-header-right">
        {/* Presentation & Visual Modes Group */}
        <div className="header-btn-group">
          <button
            type="button"
            className="sim-btn-conference"
            onClick={onOpenConferenceMode}
            title="Abrir Modo Apresentação de Slides Acadêmico"
          >
            Apresentação 🎓
          </button>

          <button
            type="button"
            className="sim-btn-3d"
            onClick={onOpenMinkowski3D}
            title="Visualizar Cones de Luz 3D de Minkowski & Calabi-Yau"
          >
            3D 🪐
          </button>

          <button
            type="button"
            className="sim-btn-ai"
            onClick={onToggleAIDrawer}
            title="Abrir Oráculo de IA com OpenRouter / Claude 3.5"
          >
            Oráculo IA ⚡
          </button>
        </div>

        {/* Physics Entity Actions */}
        <div className="header-btn-group">
          <button type="button" className="sim-btn-action" onClick={onOpenAddEvent}>
            + Nó
          </button>
          <button type="button" className="sim-btn-action" onClick={onOpenAddTraveler}>
            + Obs
          </button>
          <button type="button" className="sim-btn-action sim-btn-travel" onClick={onOpenTimeTravel}>
            Intervenção
          </button>
        </div>

        {/* Utilities Group */}
        <div className="header-btn-group">
          <button
            type="button"
            className="sim-btn-icon-util"
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer alteração (Ctrl+Z)"
          >
            ↺
          </button>
          <button
            type="button"
            className="sim-btn-icon-util"
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer alteração (Ctrl+Y)"
          >
            ↻
          </button>
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
              if (event.target.value) onExport(event.target.value as 'json' | 'csv');
              event.target.value = '';
            }}
            aria-label="Exportar modelo"
          >
            <option value="">Exportar</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>
    </header>
  );
}
