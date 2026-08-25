import { Universe } from '../../types/temporal';

interface Props {
  universe: Universe;
  onExit: () => void;
  onOpenAddEvent: () => void;
  onOpenAddTraveler: () => void;
  onOpenTimeTravel: () => void;
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
      <div className="sim-header-left">
        <button type="button" className="sim-btn-icon" onClick={onExit} title="Voltar à Landing Page">
          ← Sair
        </button>
        <div className="sim-title-group">
          <h1 className="sim-universe-title">{universe.name}</h1>
          <span className="sim-universe-tag">CENTRO DE CONTROLE TEMPORAL</span>
        </div>
      </div>

      <div className="sim-header-center">
        {/* Integrity Bar */}
        <div className="sim-integrity-widget">
          <div className="sim-integrity-label">
            <span>INTEGRIDADE TEMPORAL</span>
            <span style={{ color: integrityColor }}>{integrity}%</span>
          </div>
          <div className="sim-integrity-bar-track">
            <div
              className="sim-integrity-bar-fill"
              style={{ width: `${integrity}%`, backgroundColor: integrityColor }}
            />
          </div>
        </div>

        {/* Paradox Badge */}
        {paradoxCount > 0 ? (
          <div className="sim-paradox-badge sim-paradox-badge-active">
            <span className="badge-pulse-dot" />
            <span>{paradoxCount} PARADOXO{paradoxCount > 1 ? 'S' : ''} ATIVO{paradoxCount > 1 ? 'S' : ''}</span>
          </div>
        ) : (
          <div className="sim-paradox-badge sim-paradox-badge-clean">
            <span>LINHA CONGRUENTE</span>
          </div>
        )}
      </div>

      <div className="sim-header-right">
        <button type="button" className="sim-btn-ai" onClick={onToggleAIDrawer}>
          IA Oráculo
        </button>
        <button type="button" className="sim-btn-action" onClick={onOpenAddEvent}>
          + Evento
        </button>
        <button type="button" className="sim-btn-action" onClick={onOpenAddTraveler}>
          + Agente
        </button>
        <button type="button" className="sim-btn-action sim-btn-travel" onClick={onOpenTimeTravel}>
          Intervenção Causal
        </button>
        <button type="button" className="sim-btn-secondary" onClick={onReset} title="Resetar Simulador">
          Resetar
        </button>
        <button type="button" className="sim-btn-secondary" onClick={onUndo} disabled={!canUndo} title="Desfazer última alteração">
          Desfazer
        </button>
        <button type="button" className="sim-btn-secondary" onClick={onRedo} disabled={!canRedo} title="Refazer alteração">
          Refazer
        </button>
        <select className="sim-export-select" defaultValue="" onChange={event => {
          if (event.target.value) onExport(event.target.value as 'json' | 'csv');
          event.target.value = '';
        }} aria-label="Exportar experimento">
          <option value="">Exportar</option>
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
      </div>
    </header>
  );
}
