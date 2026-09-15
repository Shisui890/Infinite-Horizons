import { Dimension, Traveler, TravelerStatus } from '../../types/temporal';
import { useLaymanMode } from '../../context/useLaymanMode';
import { useSimulationStore } from '../../store/useSimulationStore';
import { DICTIONARY, getLocalizedDimensionName, getLocalizedTravelerName } from '../../utils/i18n';

interface Props {
  dimensions: Dimension[];
  activeDimensionId: string;
  travelers: Traveler[];
  onSelectDimension: (dimId: string) => void;
  onOpenAddDimension: () => void;
}

export default function LeftSidebar({
  dimensions,
  activeDimensionId,
  travelers,
  onSelectDimension,
  onOpenAddDimension,
}: Props) {
  const { isLaymanMode } = useLaymanMode();
  const { language } = useSimulationStore();
  const t = DICTIONARY[language];

  const getStatusLabel = (status: TravelerStatus): { label: string; color: string } => {
    if (isLaymanMode) {
      switch (status) {
        case TravelerStatus.NORMAL:
          return { label: t.laymanObserverNormal, color: 'var(--color-stable)' };
        case TravelerStatus.TRAVELING:
          return { label: t.laymanObserverTraveling, color: 'var(--color-warning)' };
        case TravelerStatus.DISPLACED:
          return { label: t.laymanObserverDisplaced, color: 'var(--color-warning)' };
        case TravelerStatus.ORIGIN_THREATENED:
          return { label: t.laymanObserverThreat, color: 'var(--color-warning)' };
        case TravelerStatus.PARADOXICAL:
          return { label: t.laymanObserverParadox, color: 'var(--color-paradox)' };
        case TravelerStatus.ERASED:
          return { label: t.laymanObserverErased, color: 'var(--text-muted)' };
        case TravelerStatus.DUPLICATED:
          return { label: t.laymanObserverDuplicated, color: 'var(--color-dimensional)' };
        default:
          return { label: status, color: '#fff' };
      }
    }

    switch (status) {
      case TravelerStatus.NORMAL:
        return { label: t.observerCongruent, color: 'var(--color-stable)' };
      case TravelerStatus.TRAVELING:
        return { label: t.observerWarp, color: 'var(--color-warning)' };
      case TravelerStatus.DISPLACED:
        return { label: t.observerDisplaced, color: 'var(--color-warning)' };
      case TravelerStatus.ORIGIN_THREATENED:
        return { label: t.observerThreat, color: 'var(--color-warning)' };
      case TravelerStatus.PARADOXICAL:
        return { label: t.observerParadox, color: 'var(--color-paradox)' };
      case TravelerStatus.ERASED:
        return { label: t.observerErased, color: 'var(--text-muted)' };
      case TravelerStatus.DUPLICATED:
        return { label: t.observerDuplicated, color: 'var(--color-dimensional)' };
      default:
        return { label: status, color: '#fff' };
    }
  };

  return (
    <aside className="sim-left-sidebar">
      {/* Dimensions Section */}
      <div className="sim-sidebar-section">
        <div className="sim-sidebar-header">
          <span className="sim-sidebar-title">
            {isLaymanMode ? `${t.laymanDimensionsTitle} (${dimensions.length})` : `${t.dimensionsTitle} (${dimensions.length})`}
          </span>
          <button
            type="button"
            className="sim-btn-xs"
            onClick={onOpenAddDimension}
            title={isLaymanMode ? t.laymanAddNewDimension : t.addNewDimension}
          >
            {isLaymanMode ? t.laymanAddNewDimension : t.addNewDimension}
          </button>
        </div>

        <div className="sim-dimension-list">
          {dimensions.map(dim => {
            const isActive = dim.id === activeDimensionId;
            const localizedName = getLocalizedDimensionName(dim, language);
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
                  <span className="sim-dim-name">{localizedName}</span>
                </div>
                <div className="sim-dim-footer">
                  <span className="sim-dim-events">
                    {dim.events.length} {isLaymanMode ? t.laymanEvents : t.geodesicNodes}
                  </span>
                  <span className="sim-dim-integrity">
                    {dim.integrity}% {isLaymanMode ? t.laymanStability : t.coherence}
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
            {isLaymanMode ? `${t.laymanObserversTitle} (${travelers.length})` : `${t.observersTitle} (${travelers.length})`}
          </span>
        </div>

        <div className="sim-traveler-list">
          {travelers.map(trv => {
            const st = getStatusLabel(trv.status);
            const localizedTrvName = getLocalizedTravelerName(trv, language);
            return (
              <div key={trv.id} className="sim-traveler-card">
                <div className="sim-trv-icon">{isLaymanMode ? (language === 'en' ? 'TRV' : 'VIA') : 'OBS'}</div>
                <div className="sim-trv-info">
                  <span className="sim-trv-name">{localizedTrvName}</span>
                  <span className="sim-trv-loc">
                    {isLaymanMode
                      ? `${t.laymanCoordinate} ${trv.currentYear}`
                      : `${t.coordinate} ${trv.currentYear} (${trv.currentDimensionId.replace('dim-', '').toUpperCase()})`}
                  </span>
                  <span className="sim-trv-origin">
                    {isLaymanMode ? `${t.laymanMetricOrigin} ${trv.originYear}` : `${t.metricOrigin} ${trv.originYear}`}
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

