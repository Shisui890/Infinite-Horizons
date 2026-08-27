import { useState } from 'react';
import type { TemporalEvent } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';
import { AITemporalService } from '../../engine/AITemporalService';
import { LigoAudio } from '../../engine/LigoAudioService';
import MathFormula from '../MathFormula';
import PhysicsCalculatorWidget from './PhysicsCalculatorWidget';

interface Props {
  event: TemporalEvent | null;
  events: TemporalEvent[];
  onAlterEvent: (eventId: string, status: EventStatus) => void;
  onSimulateAI: (event: TemporalEvent) => void;
  onClose: () => void;
}

const STATUS_LABELS: Record<EventStatus, { label: string; color: string }> = {
  [EventStatus.STABLE]: { label: 'ESTÁVEL (MINKOWSKI)', color: 'var(--color-stable)' },
  [EventStatus.ALTERED]: { label: 'PERTURBAÇÃO MÉTRICA', color: 'var(--color-warning)' },
  [EventStatus.UNSTABLE]: { label: 'FLUTUAÇÃO QUÂNTICA', color: 'var(--color-warning)' },
  [EventStatus.COLLAPSED]: { label: 'COLAPSO DE SINGULARIDADE', color: 'var(--text-muted)' },
  [EventStatus.PARADOXICAL]: { label: 'PARADOXO (CTC / NOVIKOV)', color: 'var(--color-paradox)' },
  [EventStatus.ERASED]: { label: 'ANIQUILAÇÃO CAUSAL', color: 'var(--text-muted)' },
  [EventStatus.DIVERGED]: { label: 'RAMIFICAÇÃO EVERETTIANA (11D)', color: 'var(--color-dimensional)' },
};

export default function EventInspector({ event, events, onAlterEvent, onSimulateAI, onClose }: Props) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!event) {
    return (
      <aside className="sim-inspector sim-inspector-empty">
        <div className="inspector-placeholder">
          <span className="placeholder-icon">SCAN</span>
          <p>Selecione um nó no mapa de geodésicas para inspecionar seus dados de física, métricas e causalidade.</p>
        </div>
      </aside>
    );
  }

  const statusInfo = STATUS_LABELS[event.status] || { label: event.status, color: '#fff' };
  const eventsMap = new Map(events.map(e => [e.id, e]));

  const causesList = event.causes.map(id => eventsMap.get(id)).filter(Boolean);
  const consequencesList = event.consequences.map(id => eventsMap.get(id)).filter(Boolean);
  const physics = AITemporalService.explainEventWithPhysics(event);

  function handlePlayLigoSound() {
    setIsPlayingAudio(true);
    LigoAudio.playLigoChirp();
    setTimeout(() => setIsPlayingAudio(false), 700);
  }

  return (
    <aside className="sim-inspector">
      <div className="sim-inspector-header">
        <span className="inspector-tag">DOSSIÊ DO NÓ CAUSAL</span>
        <button type="button" className="sim-btn-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="inspector-body">
        <h2 className="inspector-title">{event.title}</h2>

        <div className="inspector-meta-grid">
          <div className="meta-item">
            <span className="meta-label">COORDENADA TEMPORAL</span>
            <span className="meta-value meta-year">Ano {event.year}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">ESTADO MÉTRICO</span>
            <span className="meta-value" style={{ color: statusInfo.color }}>
              {statusInfo.label}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">DOMÍNIO TEÓRICO</span>
            <span className="meta-value">{event.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">PESO CAUSAL</span>
            <span className="meta-value">{event.importance}/100</span>
          </div>
        </div>

        {event.description && <p className="inspector-desc">{event.description}</p>}

        {/* Audio Sonification for Gravitational Waves & Black Holes */}
        {(event.year === 2015 || event.title.toLowerCase().includes('ondas gravitacionais') || event.title.toLowerCase().includes('m87')) && (
          <div className="ligo-audio-card">
            <div className="ligo-audio-info">
              <strong>Sinal Acústico Real do Espaço-Tempo</strong>
              <span>Chirp de fusão GW150914 captado pelos interferômetros do LIGO</span>
            </div>
            <button
              type="button"
              className={`btn-play-ligo ${isPlayingAudio ? 'playing' : ''}`}
              onClick={handlePlayLigoSound}
            >
              {isPlayingAudio ? 'Reproduzindo Chirp...' : 'Ouvir Onda Gravitacional 🔊'}
            </button>
          </div>
        )}

        {event.sourceUrl && (
          <a className="event-source-link" href={event.sourceUrl} target="_blank" rel="noreferrer">
            VER BASE DOCUMENTAL / TEORIA ↗
          </a>
        )}

        {/* Toggle Physics Sandbox Calculator */}
        <div className="calc-toggle-container">
          <button
            type="button"
            className="btn-toggle-calculator"
            onClick={() => setShowCalculator(!showCalculator)}
          >
            {showCalculator ? '▲ Ocultar Calculadora de Tensores' : '🔬 Abrir Calculadora de Física Computacional ▼'}
          </button>
        </div>

        {showCalculator && <PhysicsCalculatorWidget />}

        {event.isAnchor && (
          <div className="anchor-badge">
            <span>ÂNCORA GEODÉSICA DO CONTINUUM</span>
            <p>Evento primordial que estabiliza o tensor métrico e preserva a autoconsistência de Novikov.</p>
          </div>
        )}

        {event.isAIAnomaly && (
          <div className="ai-anomaly-badge">
            <span>ANOMALIA QUÂNTICA GERADA POR IA</span>
            <p>Bifurcação emergente gerada por perturbações no cone de luz.</p>
          </div>
        )}

        <section className="physics-explanation">
          <div className="physics-heading">
            <span className="section-label">INTERPRETAÇÃO EM FÍSICA TEÓRICA</span>
            <span className="physics-note">5 PILARES DO ESPAÇO-TEMPO</span>
          </div>
          {physics.map(item => (
            <details key={item.title} className={`physics-item physics-${item.status}`} open={item.status === 'established'}>
              <summary>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 600 }}>{item.title}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-dimensional)' }}>[{item.theoryBadge}]</span>
                </div>
                <span>{item.statusLabel}</span>
              </summary>
              <div className="physics-content">
                {item.formula && (
                  <div className="physics-formula">
                    <MathFormula math={item.formula} block />
                  </div>
                )}
                <p>{item.explanation}</p>
              </div>
            </details>
          ))}
        </section>

        <div className="inspector-section">
          <span className="section-label">CONES DE LUZ PASSADO (CAUSAS: {causesList.length})</span>
          {causesList.length === 0 ? (
            <span className="empty-text">Origem assintótica / Evento primordial independente</span>
          ) : (
            <ul className="causal-list">
              {causesList.map(c => (
                <li key={c!.id}>
                  <span>{c!.title}</span>
                  <span className="causal-year">(Ano {c!.year})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="inspector-section">
          <span className="section-label">CONES DE LUZ FUTURO (CONSEQUÊNCIAS: {consequencesList.length})</span>
          {consequencesList.length === 0 ? (
            <span className="empty-text">Fronteira aberta da linha temporal</span>
          ) : (
            <ul className="causal-list">
              {consequencesList.map(c => (
                <li key={c!.id}>
                  <span>{c!.title}</span>
                  <span className="causal-year">(Ano {c!.year})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Controls */}
        <div className="inspector-actions">
          <span className="actions-label">INTERVENÇÃO MÉTRICA & ORÁCULO DE IA</span>
          <div className="action-buttons-grid">
            <button
              type="button"
              className="btn-action-alt btn-ai-action"
              onClick={() => onSimulateAI(event)}
            >
              Simular Efeito Borboleta com IA
            </button>
            <button
              type="button"
              className="btn-action-alt btn-alter"
              onClick={() => onAlterEvent(event.id, EventStatus.ALTERED)}
            >
              Modificar Geodésica
            </button>
            <button
              type="button"
              className="btn-action-alt btn-erase"
              onClick={() => onAlterEvent(event.id, EventStatus.ERASED)}
            >
              Aniquilar Nó Temporal
            </button>
            <button
              type="button"
              className="btn-action-alt btn-restore"
              onClick={() => onAlterEvent(event.id, EventStatus.STABLE)}
            >
              Restaurar Estado Fundamental
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
