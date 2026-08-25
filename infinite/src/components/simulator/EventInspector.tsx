import type { TemporalEvent } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';

interface Props {
  event: TemporalEvent | null;
  events: TemporalEvent[];
  onAlterEvent: (eventId: string, status: EventStatus) => void;
  onSimulateAI: (event: TemporalEvent) => void;
  onClose: () => void;
}

const STATUS_LABELS: Record<EventStatus, { label: string; color: string }> = {
  [EventStatus.STABLE]: { label: 'ESTÁVEL', color: 'var(--color-stable)' },
  [EventStatus.ALTERED]: { label: 'ALTERADO', color: 'var(--color-warning)' },
  [EventStatus.UNSTABLE]: { label: 'INSTÁVEL', color: 'var(--color-warning)' },
  [EventStatus.COLLAPSED]: { label: 'COLAPSADO', color: 'var(--text-muted)' },
  [EventStatus.PARADOXICAL]: { label: 'PARADOXAL', color: 'var(--color-paradox)' },
  [EventStatus.ERASED]: { label: 'APAGADO DA LINHA', color: 'var(--text-muted)' },
  [EventStatus.DIVERGED]: { label: 'ANOMALIA DE IA', color: 'var(--color-dimensional)' },
};

export default function EventInspector({ event, events, onAlterEvent, onSimulateAI, onClose }: Props) {
  if (!event) {
    return (
      <aside className="sim-inspector sim-inspector-empty">
        <div className="inspector-placeholder">
          <span className="placeholder-icon">🔍</span>
          <p>Selecione um evento no mapa temporal para inspecionar seus dados e simular alterações.</p>
        </div>
      </aside>
    );
  }

  const statusInfo = STATUS_LABELS[event.status] || { label: event.status, color: '#fff' };
  const eventsMap = new Map(events.map(e => [e.id, e]));

  const causesList = event.causes.map(id => eventsMap.get(id)).filter(Boolean);
  const consequencesList = event.consequences.map(id => eventsMap.get(id)).filter(Boolean);

  return (
    <aside className="sim-inspector">
      <div className="sim-inspector-header">
        <span className="inspector-tag">DETALHES DO EVENTO</span>
        <button type="button" className="sim-btn-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="inspector-body">
        <h2 className="inspector-title">{event.title}</h2>

        <div className="inspector-meta-grid">
          <div className="meta-item">
            <span className="meta-label">ANO / TIMESTAMP</span>
            <span className="meta-value meta-year">{event.year}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">ESTADO</span>
            <span className="meta-value" style={{ color: statusInfo.color }}>
              ● {statusInfo.label}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">CATEGORIA</span>
            <span className="meta-value">{event.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">IMPORTÂNCIA</span>
            <span className="meta-value">{event.importance}/100</span>
          </div>
        </div>

        {event.description && <p className="inspector-desc">{event.description}</p>}

        {event.isAnchor && (
          <div className="anchor-badge">
            <span>⚓ ÂNCORA TEMPORAL</span>
            <p>Evento fundamental para a sustentabilidade da realidade.</p>
          </div>
        )}

        {event.isAIAnomaly && (
          <div className="ai-anomaly-badge">
            <span>🤖 ANOMALIA GERADA POR IA</span>
            <p>Consequência não-linear produzida pelo Efeito Borboleta.</p>
          </div>
        )}

        <div className="inspector-section">
          <span className="section-label">CAUSAS ({causesList.length})</span>
          {causesList.length === 0 ? (
            <span className="empty-text">Nenhuma causa prévia</span>
          ) : (
            <ul className="causal-list">
              {causesList.map(c => (
                <li key={c!.id}>
                  <span>● {c!.title}</span>
                  <span className="causal-year">({c!.year})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="inspector-section">
          <span className="section-label">CONSEQUÊNCIAS ({consequencesList.length})</span>
          {consequencesList.length === 0 ? (
            <span className="empty-text">Nenhuma consequência dependente</span>
          ) : (
            <ul className="causal-list">
              {consequencesList.map(c => (
                <li key={c!.id}>
                  <span>● {c!.title}</span>
                  <span className="causal-year">({c!.year})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Controls */}
        <div className="inspector-actions">
          <span className="actions-label">SIMULAR ALTERAÇÃO CAUSAL & IA</span>
          <div className="action-buttons-grid">
            <button
              type="button"
              className="btn-action-alt btn-ai-action"
              onClick={() => onSimulateAI(event)}
            >
              🤖 Simular com IA (Efeito Borboleta)
            </button>
            <button
              type="button"
              className="btn-action-alt btn-alter"
              onClick={() => onAlterEvent(event.id, EventStatus.ALTERED)}
            >
              ⚠️ Modificar Resultado
            </button>
            <button
              type="button"
              className="btn-action-alt btn-erase"
              onClick={() => onAlterEvent(event.id, EventStatus.ERASED)}
            >
              ❌ Apagar Evento
            </button>
            <button
              type="button"
              className="btn-action-alt btn-restore"
              onClick={() => onAlterEvent(event.id, EventStatus.STABLE)}
            >
              ✓ Restaurar Estado
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
