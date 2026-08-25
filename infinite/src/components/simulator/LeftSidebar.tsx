import { Dimension, Traveler, TravelerStatus } from '../../types/temporal';

interface Props {
  dimensions: Dimension[];
  activeDimensionId: string;
  travelers: Traveler[];
  onSelectDimension: (dimId: string) => void;
  onOpenAddDimension: () => void;
}

const TRAVELER_STATUS_LABELS: Record<TravelerStatus, { label: string; color: string }> = {
  [TravelerStatus.NORMAL]: { label: 'ESTÁVEL', color: 'var(--color-stable)' },
  [TravelerStatus.TRAVELING]: { label: 'EM TRÂNSITO', color: 'var(--color-warning)' },
  [TravelerStatus.DISPLACED]: { label: 'DESLOCADO', color: 'var(--color-warning)' },
  [TravelerStatus.ORIGIN_THREATENED]: { label: 'ORIGEM AMEAÇADA', color: 'var(--color-warning)' },
  [TravelerStatus.PARADOXICAL]: { label: 'PARADOXAL', color: 'var(--color-paradox)' },
  [TravelerStatus.ERASED]: { label: 'APAGADO', color: 'var(--text-muted)' },
  [TravelerStatus.DUPLICATED]: { label: 'DUPLICADO', color: 'var(--color-dimensional)' },
};

export default function LeftSidebar({
  dimensions,
  activeDimensionId,
  travelers,
  onSelectDimension,
  onOpenAddDimension,
}: Props) {
  return (
    <aside className="sim-left-sidebar">
      {/* Dimensions Section */}
      <div className="sim-sidebar-section">
        <div className="sim-sidebar-header">
          <span className="sim-sidebar-title">DIMENSÕES ({dimensions.length})</span>
          <button type="button" className="sim-btn-xs" onClick={onOpenAddDimension} title="Adicionar Dimensão">
            + Nova
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
                  <span className="sim-dim-events">{dim.events.length} eventos</span>
                  <span className="sim-dim-integrity">{dim.integrity}% inst.</span>
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
          <span className="sim-sidebar-title">VIAJANTES DO TEMPO ({travelers.length})</span>
        </div>

        <div className="sim-traveler-list">
          {travelers.map(trv => {
            const st = TRAVELER_STATUS_LABELS[trv.status] || { label: trv.status, color: '#fff' };
            return (
              <div key={trv.id} className="sim-traveler-card">
                <div className="sim-trv-icon">🧑‍🚀</div>
                <div className="sim-trv-info">
                  <span className="sim-trv-name">{trv.name}</span>
                  <span className="sim-trv-loc">
                    Local: Ano {trv.currentYear} ({trv.currentDimensionId === 'dim-omega-01' ? 'Ω-01' : 'Ω-02'})
                  </span>
                  <span className="sim-trv-origin">Origem: Ano {trv.originYear}</span>
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
