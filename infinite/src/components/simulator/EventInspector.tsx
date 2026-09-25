import { useState } from 'react';
import { useLaymanMode } from '../../context/useLaymanMode';
import { useSimulationStore } from '../../store/useSimulationStore';
import { getLaymanExplanation } from '../../utils/laymanContent';
import { DICTIONARY, getLocalizedEventTitle, getLocalizedEventDescription, getLocalizedCategory } from '../../utils/i18n';
import type { TemporalEvent } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';
import { AITemporalService } from '../../engine/AITemporalService';
import { LigoAudio } from '../../engine/LigoAudioService';
import MathFormula, { MathText } from '../MathFormula';
import PhysicsCalculatorWidget from './PhysicsCalculatorWidget';
import ScientificStatusBadge from './ScientificStatusBadge';
import SpacetimeIntervalCard from './SpacetimeIntervalCard';

interface Props {
  event: TemporalEvent | null;
  events: TemporalEvent[];
  onAlterEvent: (eventId: string, status: EventStatus) => void;
  onSimulateAI: (event: TemporalEvent) => void;
  onClose: () => void;
}

export default function EventInspector({ event, events, onAlterEvent, onSimulateAI, onClose }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const { language, universeState } = useSimulationStore();
  const t = DICTIONARY[language];

  const [showCalculator, setShowCalculator] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const getStatusInfo = (status: EventStatus): { label: string; color: string } => {
    switch (status) {
      case EventStatus.STABLE:
        return { label: t.statusStableMinkowski, color: 'var(--color-stable)' };
      case EventStatus.ALTERED:
        return { label: t.statusAlteredMetric, color: 'var(--color-warning)' };
      case EventStatus.UNSTABLE:
        return { label: t.statusUnstableQuantum, color: 'var(--color-warning)' };
      case EventStatus.COLLAPSED:
        return { label: t.statusSingularityCollapse, color: 'var(--text-muted)' };
      case EventStatus.PARADOXICAL:
        return { label: t.statusNovikovParadox, color: 'var(--color-paradox)' };
      case EventStatus.ERASED:
        return { label: t.statusCausalAnnihilation, color: 'var(--text-muted)' };
      case EventStatus.DIVERGED:
        return { label: t.statusEverettBranch, color: 'var(--color-dimensional)' };
      default:
        return { label: status, color: '#fff' };
    }
  };

  if (!event) {
    return (
      <aside className="sim-inspector sim-inspector-empty">
        <div className="inspector-placeholder">
          <span className="placeholder-icon">INFO</span>
          <h3>{isLaymanMode ? t.laymanNoEventTitle : t.noEventTitle}</h3>
          <p>
            {isLaymanMode ? t.laymanNoEventPrompt : t.noEventPrompt}
          </p>
        </div>
      </aside>
    );
  }

  const localizedTitle = getLocalizedEventTitle(event, language);
  const localizedDesc = getLocalizedEventDescription(event, language);
  const statusInfo = getStatusInfo(event.status);
  const layman = getLaymanExplanation(event.year, localizedTitle);
  
  const eventsMap = new Map(events.map(e => [e.id, e]));

  const causesList = (event.causes || [])
    .map(id => eventsMap.get(id))
    .filter((e): e is TemporalEvent => Boolean(e));
  const consequencesList = (event.consequences || [])
    .map(id => eventsMap.get(id))
    .filter((e): e is TemporalEvent => Boolean(e));
  const physics = AITemporalService.explainEventWithPhysics(event);
  const counterfactual = AITemporalService.generateCounterfactualAnalysis(event, universeState.universe);

  function handlePlayLigoSound() {
    setIsPlayingAudio(true);
    LigoAudio.playLigoChirp();
    setTimeout(() => setIsPlayingAudio(false), 700);
  }

  return (
    <aside className="sim-inspector">
      <div className="sim-inspector-header">
        <span className="inspector-tag">
          {isLaymanMode ? t.laymanCausalDossier : t.causalDossier}
        </span>
        <button type="button" className="sim-btn-close" onClick={onClose} title={language === 'en' ? 'Close Inspector' : 'Fechar Inspetor'}>
          ✕
        </button>
      </div>

      <div className="inspector-body">
        <h2 className="inspector-title">
          {isLaymanMode ? layman.simpleTitle : localizedTitle}
        </h2>

        {/* Rigorous Scientific Status Badge */}
        <div style={{ marginBottom: '12px' }}>
          <ScientificStatusBadge
            status={event.scientificStatus}
            evidenceKind={event.evidenceKind}
            sourceUrl={event.sourceUrl}
            doi={event.doi}
            academicCitation={event.academicCitation}
          />
        </div>

        <div className="inspector-meta-grid">
          <div className="meta-item">
            <span className="meta-label">{isLaymanMode ? t.laymanYearLabel : t.temporalCoord}</span>
            <span className="meta-value meta-year">{t.yearLabel} {event.year}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isLaymanMode ? t.laymanTimeStatus : t.metricState}</span>
            <span className="meta-value" style={{ color: statusInfo.color }}>
              {isLaymanMode ? (event.status === EventStatus.STABLE ? t.laymanSavedAndStable : t.laymanLineAltered) : statusInfo.label}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isLaymanMode ? t.laymanDomain : t.theoreticalDomain}</span>
            <span className="meta-value">{getLocalizedCategory(isLaymanMode ? layman.laymanCategory : event.category, language)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isLaymanMode ? t.laymanImpact : t.causalWeight}</span>
            <span className="meta-value">{event.importance}/100</span>
          </div>
        </div>

        {/* 4D Minkowski Spacetime Interval Calculator */}
        <SpacetimeIntervalCard currentEvent={event} allEvents={events} />

        {isLaymanMode ? (
          <div className="layman-explanation-card">
            <div className="layman-card-header">
              <span className="layman-badge">{t.howItWorks}</span>
            </div>
            <p className="layman-desc">{layman.simpleDescription}</p>
            <div className="layman-analogy-box">
              <strong>{t.dailyAnalogy}</strong>
              <p>{layman.analogy}</p>
            </div>
            {layman.popCultureRef && (
              <div className="layman-pop-culture">
                <span>{layman.popCultureRef}</span>
              </div>
            )}
            {layman.funFact && (
              <div className="layman-fun-fact">
                <strong>{t.curiosity}</strong>
                <p>{layman.funFact}</p>
              </div>
            )}
          </div>
        ) : (
          localizedDesc && (
            <p className="inspector-desc">
              <MathText text={localizedDesc} />
            </p>
          )
        )}

        {(event.year === 2015 || event.title.toLowerCase().includes('ondas gravitacionais') || event.title.toLowerCase().includes('m87') || event.title.toLowerCase().includes('gravitational')) && (
          <div className="ligo-audio-card">
            <div className="ligo-audio-info">
              <strong>{isLaymanMode ? t.laymanLigoHear : t.ligoHearSpacetime}</strong>
              <span>{isLaymanMode ? t.laymanLigoHearSub : t.ligoHearSub}</span>
            </div>
            <button
              type="button"
              className={`btn-play-ligo ${isPlayingAudio ? 'playing' : ''}`}
              onClick={handlePlayLigoSound}
            >
              {isPlayingAudio ? t.playingAudio : t.hearCollision}
            </button>
          </div>
        )}

        {event.sourceUrl && (
          <a className="event-source-link" href={event.sourceUrl} target="_blank" rel="noreferrer">
            {isLaymanMode ? t.laymanViewDocumentation : t.viewDocumentation}
          </a>
        )}

        <div className="calc-toggle-container">
          <button
            type="button"
            className="btn-toggle-calculator"
            onClick={() => setShowCalculator(!showCalculator)}
          >
            {showCalculator
              ? (isLaymanMode ? t.laymanCloseCalc : t.closeCalc)
              : (isLaymanMode ? t.laymanOpenCalc : t.openCalc)}
          </button>
        </div>

        {showCalculator && <PhysicsCalculatorWidget />}

        {event.isAnchor && (
          <div className="anchor-badge">
            <span>{isLaymanMode ? t.laymanAnchorBadgeTitle : t.anchorBadgeTitle}</span>
            <p>
              {isLaymanMode ? t.laymanAnchorBadgeDesc : t.anchorBadgeDesc}
            </p>
          </div>
        )}

        {event.isAIAnomaly && (
          <div className="ai-anomaly-badge">
            <span>{isLaymanMode ? t.laymanAiAnomalyTitle : t.aiAnomalyTitle}</span>
            <p>
              {isLaymanMode ? t.laymanAiAnomalyDesc : t.aiAnomalyDesc}
            </p>
          </div>
        )}

        <section className="physics-explanation">
          <div className="physics-heading">
            <span className="section-label">
              {isLaymanMode ? t.laymanPhysicsSectionTitle : t.physicsSectionTitle}
            </span>
            <span className="physics-note">
              {isLaymanMode ? t.laymanFivePillars : t.fivePillars}
            </span>
          </div>
          {physics.map(item => (
            <details key={item.title} className={`physics-item physics-${item.status}`} open={item.status === 'established'}>
              <summary>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 600 }}>{isLaymanMode ? (item.laymanTitle || item.title) : item.title}</span>
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
                {isLaymanMode && item.laymanFormulaMeaning && (
                  <div className="layman-formula-card">
                    <div className="layman-formula-header">{t.formulaMeaning}</div>
                    <p>{item.laymanFormulaMeaning}</p>
                  </div>
                )}
                <p className="physics-desc-text">
                  <MathText text={isLaymanMode ? (item.laymanExplanation || item.explanation) : item.explanation} />
                </p>
              </div>
            </details>
          ))}
        </section>

        <div className="inspector-section">
          <span className="section-label">
            {isLaymanMode
              ? t.laymanDirectCauses.replace('{count}', String(causesList.length))
              : t.directCauses.replace('{count}', String(causesList.length))}
          </span>
          {causesList.length === 0 ? (
            <span className="empty-text">
              {isLaymanMode ? t.laymanNoAncestors : t.noAncestors}
            </span>
          ) : (
            <ul className="causal-list">
              {causesList.map(c => {
                const locCausalTitle = getLocalizedEventTitle(c!, language);
                return (
                  <li key={c!.id}>
                    <span>{isLaymanMode ? getLaymanExplanation(c!.year, locCausalTitle).simpleTitle : locCausalTitle}</span>
                    <span className="causal-year">({t.yearLabel} {c!.year})</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="inspector-section">
          <span className="section-label">
            {isLaymanMode
              ? t.laymanDirectConsequences.replace('{count}', String(consequencesList.length))
              : t.directConsequences.replace('{count}', String(consequencesList.length))}
          </span>
          {consequencesList.length === 0 ? (
            <span className="empty-text">
              {isLaymanMode ? t.laymanNoDescendants : t.noDescendants}
            </span>
          ) : (
            <ul className="causal-list">
              {consequencesList.map(c => {
                const locConseqTitle = getLocalizedEventTitle(c!, language);
                return (
                  <li key={c!.id}>
                    <span>{isLaymanMode ? getLaymanExplanation(c!.year, locConseqTitle).simpleTitle : locConseqTitle}</span>
                    <span className="causal-year">({t.yearLabel} {c!.year})</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Counterfactual Hypothesis & Analysis Card */}
        {counterfactual && (
          <div className="counterfactual-dossier-card">
            <div className="cf-dossier-header">
              <span className="cf-dossier-badge">E SE NÃO EXISTISSE?</span>
              <span className="cf-dossier-title">Cenário Contrafactual</span>
            </div>
            <div className="cf-dossier-content">
              <p className="cf-dossier-text">
                <MathText text={counterfactual.whatIfNonExistent} />
              </p>
              <div className="cf-dossier-hypothesis">
                <span className="cf-dossier-hypo-tag">RAMIFICAÇÃO ALTERNATIVA:</span>
                <p>
                  <MathText text={counterfactual.alternateHistoryHypothesis} />
                </p>
              </div>
              {counterfactual.brokenDescendants.length > 0 && (
                <div className="cf-dossier-descendants">
                  <span className="cf-dossier-hypo-tag">
                    CONSEQUÊNCIAS NO CONE DE LUZ ({counterfactual.brokenDescendants.length}):
                  </span>
                  <ul className="cf-dossier-list">
                    {counterfactual.brokenDescendants.slice(0, 3).map(desc => (
                      <li key={desc.id}>
                        <strong>{desc.title} ({desc.year})</strong>: {desc.consequenceIfMissing}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="inspector-actions">
          <span className="actions-label">
            {isLaymanMode ? t.laymanActionsTitle : t.actionsTitle}
          </span>
          <div className="action-buttons-grid">
            <button
              type="button"
              className="btn-action-alt btn-ai-action"
              onClick={() => onSimulateAI(event)}
            >
              {t.simulateButterfly}
            </button>
            <button
              type="button"
              className="btn-action-alt btn-alter"
              onClick={() => onAlterEvent(event.id, EventStatus.ALTERED)}
            >
              {isLaymanMode ? t.laymanAlterEvent : t.alterEvent}
            </button>
            <button
              type="button"
              className="btn-action-alt btn-erase"
              onClick={() => onAlterEvent(event.id, EventStatus.ERASED)}
            >
              {isLaymanMode ? t.laymanEraseEvent : t.eraseEvent}
            </button>
            <button
              type="button"
              className="btn-action-alt btn-restore"
              onClick={() => onAlterEvent(event.id, EventStatus.STABLE)}
            >
              {isLaymanMode ? t.laymanRestoreEvent : t.restoreEvent}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

