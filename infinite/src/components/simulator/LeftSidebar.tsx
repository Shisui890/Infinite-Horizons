import { Dimension, Traveler, TravelerStatus } from '../../types/temporal';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface Props {
  dimensions: Dimension[];
  activeDimensionId: string;
  travelers: Traveler[];
  onSelectDimension: (dimId: string) => void;
  onOpenAddDimension: () => void;
}

const SCIENTIFIC_STATUS_LABELS: Record<TravelerStatus, { label: string; color: string }> = {
  [TravelerStatus.NORMAL]: { label: 'CONGRUENTE', color: 'var(--color-stable)' },
  [TravelerStatus.TRAVELING]: { label: 'EM CURVATURA', color: 'var(--color-warning)' },
  [TravelerStatus.DISPLACED]: { label: 'DESLOCADO', color: 'var(--color-warning)' },
  [TravelerStatus.ORIGIN_THREATENED]: { label: 'AMEAÇA DE NOVIKOV', color: 'var(--color-warning)' },
  [TravelerStatus.PARADOXICAL]: { label: 'CURVA FECHADA (CTC)', color: 'var(--color-paradox)' },
  [TravelerStatus.ERASED]: { label: 'ANIQUILADO', color: 'var(--text-muted)' },
  [TravelerStatus.DUPLICATED]: { label: 'BIFURCAÇÃO QUÂNTICA', color: 'var(--color-dimensional)' },
};

const LAYMAN_STATUS_LABELS: Record<TravelerStatus, { label: string; color: string }> = {
  [TravelerStatus.NORMAL]: { label: 'ESTÁVEL', color: 'var(--color-stable)' },
  [TravelerStatus.TRAVELING]: { label: 'VIAJANDO NO TEMPO', color: 'var(--color-warning)' },
  [TravelerStatus.DISPLACED]: { label: 'FORA DA ÉPOCA', color: 'var(--color-warning)' },
  [TravelerStatus.ORIGIN_THREATENED]: { label: 'RISCO DE PARADOXO', color: 'var(--color-warning)' },
  [TravelerStatus.PARADOXICAL]: { label: 'PRESO EM LOOP', color: 'var(--color-paradox)' },
  [TravelerStatus.ERASED]: { label: 'APAGADO DA HISTÓRIA', color: 'var(--text-muted)' },
  [TravelerStatus.DUPLICATED]: { label: 'DUPLICADO NO TEMPO', color: 'var(--color-dimensional)' },
};

export default function LeftSidebar({
  dimensions,
  activeDimensionId,
  travelers,
  onSelectDimension,
  onOpenAddDimension,
}: Props) {
  const { isLaymanMode } = useLaymanMode();
  const statusLabels = isLaymanMode ? LAYMAN_STATUS_LABELS : SCIENTIFIC_STATUS_LABELS;

  return (
    <aside className="sim-left-sidebar">
      {/* Dimensions Section */}
      <div className="sim-sidebar-section">
        <div className="sim-sidebar-header">
          <span className="sim-sidebar-title">
            {isLaymanMode ? `LINHAS DO TEMPO (${dimensions.length})` : `VARIEDADES DIMENSIONAIS (${dimensions.length})`}
          </span>
          <button
            type="button"
            className="sim-btn-xs"
            onClick={onOpenAddDimension}
            title={isLaymanMode ? 'Criar Nova Linha do Tempo Paralela' : 'Adicionar Variedade Dimensional'}
          >
            {isLaymanMode ? '+ Nova Linha' : '+ Nova (11D)'}
          </button>
        </div>

        <div className="sim-dimension-list">
          {dimensions.map(dim => {
            const isActive = dim.id === activeDimensionId;
            return (
              <button
                key={dim.id}
                type="button"
                className={`sim-dimension-card ${isActive ? 'sim-dim-active' : ''}`}
                onClick={() => onSelectDimension(dim.id)}
                style={{ '--dim-color': dim.color } as React.CSSProperties}
              >
                <div className="sim-dim-header">
                  <span className="sim-dim-badge">{dim.designation}</span>
                  <span className="sim-dim-name">{dim.name}</span>
                </div>
                <div className="sim-dim-footer">
                  <span className="sim-dim-events">
                    {dim.events.length} {isLaymanMode ? 'acontecimentos' : 'nós de geodésica'}
                  </span>
                  <span className="sim-dim-integrity">
                    {dim.integrity}% {isLaymanMode ? 'estabilidade' : 'coerência'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sim-sidebar-divider" />

      {/* Travelers Section */}
      <div className="sim-sidebar-section">
        <div className="sim-sidebar-header">
          <span className="sim-sidebar-title">
            {isLaymanMode ? `VIAJANTES NO TEMPO (${travelers.length})` : `SONDAS & OBSERVADORES (${travelers.length})`}
          </span>
        </div>

        <div className="sim-traveler-list">
          {travelers.map(trv => {
            const st = statusLabels[trv.status] || { label: trv.status, color: '#fff' };
            return (
              <div key={trv.id} className="sim-traveler-card">
                <div className="sim-trv-icon">{isLaymanMode ? 'VIA' : 'OBS'}</div>
                <div className="sim-trv-info">
                  <span className="sim-trv-name">{trv.name}</span>
                  <span className="sim-trv-loc">
                    {isLaymanMode
                      ? `Local: Ano ${trv.currentYear}`
                      : `Coordenada: Ano ${trv.currentYear} (${trv.currentDimensionId.replace('dim-', '').toUpperCase()})`}
                  </span>
                  <span className="sim-trv-origin">
                    {isLaymanMode ? `Ano de Origem: ${trv.originYear}` : `Origem Métrico-Temporal: Ano ${trv.originYear}`}
                  </span>
                </div>
                <span className="sim-trv-status" style={{ color: st.color }}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
