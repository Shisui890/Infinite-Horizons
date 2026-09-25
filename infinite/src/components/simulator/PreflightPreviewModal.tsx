import { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { TemporalReplayEngine } from '../../engine/TemporalReplayEngine';
import { AITemporalService } from '../../engine/AITemporalService';
import MathFormula, { MathText, MarkdownText } from '../MathFormula';
import { EventStatus } from '../../types/temporal';

export default function PreflightPreviewModal() {
  const {
    preflightImpact,
    setPreflightImpact,
    universeState,
    removeEvent,
    updateEvent,
    startReplay,
    setUniverseState,
  } = useSimulationStore();

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [showAIReport, setShowAIReport] = useState(true);

  if (!preflightImpact) return null;

  const cf = preflightImpact.counterfactualAnalysis;

  async function handleFetchAIReport() {
    if (!preflightImpact) return;
    const allEvents = universeState.universe.dimensions.flatMap(d => d.events);
    const targetEvent = allEvents.find(e => e.id === preflightImpact.targetEventId);
    if (!targetEvent) return;

    setIsGeneratingAI(true);
    try {
      const report = await AITemporalService.fetchAICounterfactualReport(
        targetEvent,
        universeState.universe
      );
      setAiReport(report);
      setShowAIReport(true);
    } catch {
      // Falha tratada internamente
    } finally {
      setIsGeneratingAI(false);
    }
  }

  function applyIntervention(withReplay: boolean) {
    if (!preflightImpact) return;

    const frames = withReplay
      ? TemporalReplayEngine.generateReplayFrames(
          universeState.universe,
          preflightImpact.targetEventId,
          preflightImpact.action === 'erase' ? 'erase' : 'alter'
        )
      : null;

    if (preflightImpact.action === 'erase') {
      removeEvent(preflightImpact.targetEventId);
    } else {
      updateEvent(preflightImpact.targetEventId, { status: EventStatus.ALTERED });
    }

    if (cf) {
      const summaryMsg = `[Intervenção Causal] "${preflightImpact.targetEventTitle}": ${cf.causalSummary} Hipótese Contrafactual: ${cf.alternateHistoryHypothesis.substring(0, 120)}...`;
      setUniverseState(prev => ({
        ...prev,
        logs: [
          {
            id: `log-cf-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            message: summaryMsg,
            type: 'warning',
          },
          ...prev.logs,
        ],
      }));
    }

    setPreflightImpact(null);
    if (withReplay && frames) {
      startReplay(frames);
    }
  }

  return (
    <div
      className="modal-backdrop sim-modal-overlay"
      onClick={() => setPreflightImpact(null)}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-card preflight-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="preflight-warning-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <div>
              <h3>Simulação Prévia de Impacto Causal</h3>
              <p className="modal-subtitle">
                Análise determinística e contrafactual das consequências da intervenção temporal
              </p>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={() => setPreflightImpact(null)}>
            ✕
          </button>
        </div>

        <div className="preflight-body">
          <div className="preflight-target-box">
            <div className="preflight-target-meta">
              <span className="preflight-label">ALVO DA INTERVENÇÃO:</span>
              <span className={`preflight-action-tag ${preflightImpact.action === 'erase' ? 'tag-erase' : 'tag-alter'}`}>
                {preflightImpact.action === 'erase' ? 'ANULAÇÃO DE EXISTÊNCIA (DELETE)' : 'ALTERAÇÃO DE ESTADO CAUSAL'}
              </span>
            </div>
            <h4 className="preflight-target-title">{preflightImpact.targetEventTitle}</h4>
          </div>

          <div className="preflight-grid">
            <div className="preflight-stat-card">
              <span className="preflight-stat-label">Impactos Diretos:</span>
              <strong className="preflight-stat-val text-amber">{preflightImpact.directEffectsCount}</strong>
              <span className="preflight-stat-sub">nós filhos imediatos</span>
            </div>

            <div className="preflight-stat-card">
              <span className="preflight-stat-label">Impactos Indiretos:</span>
              <strong className="preflight-stat-val text-cyan">{preflightImpact.indirectEffectsCount}</strong>
              <span className="preflight-stat-sub">em cascata no futuro</span>
            </div>

            <div className="preflight-stat-card">
              <span className="preflight-stat-label">Viajantes Ameaçados:</span>
              <strong className="preflight-stat-val text-red">
                {preflightImpact.threatenedTravelers.length}
              </strong>
              <span className="preflight-stat-sub">
                {preflightImpact.threatenedTravelers.length > 0
                  ? preflightImpact.threatenedTravelers.join(', ')
                  : 'Nenhum em risco'}
              </span>
            </div>

            <div className="preflight-stat-card">
              <span className="preflight-stat-label">Âncoras em Risco:</span>
              <strong className="preflight-stat-val text-purple">
                {preflightImpact.criticalAnchorsAtRisk.length}
              </strong>
              <span className="preflight-stat-sub">
                {preflightImpact.criticalAnchorsAtRisk.length > 0
                  ? preflightImpact.criticalAnchorsAtRisk.slice(0, 2).join(', ')
                  : 'Nenhuma âncora afetada'}
              </span>
            </div>
          </div>

          <div className="preflight-integrity-comparison">
            <div className="comparison-header">
              <span>Projeção de Integridade Temporal:</span>
              <div className="comparison-vals">
                <span className="val-before">{preflightImpact.currentIntegrity}%</span>
                <span className="val-arrow">→</span>
                <span
                  className="val-after"
                  style={{
                    color:
                      preflightImpact.predictedIntegrity > 70
                        ? '#10b981'
                        : preflightImpact.predictedIntegrity > 40
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                >
                  {preflightImpact.predictedIntegrity}%
                </span>
              </div>
            </div>

            <div className="comparison-bar-track">
              <div
                className="comparison-bar-predicted"
                style={{ width: `${preflightImpact.predictedIntegrity}%` }}
              />
            </div>
          </div>

          {/* DEDICATED COUNTERFACTUAL ANALYSIS CARD */}
          {cf && (
            <div className="preflight-counterfactual-card">
              <div className="cf-card-header">
                <div className="cf-title-badge">
                  <span className="cf-icon">🏛️</span>
                  <div>
                    <h4>O Que Aconteceria se este Evento Não Existisse?</h4>
                    <span className="cf-sub">Análise causal fundamentada em historiografia e teorias físicas formais</span>
                  </div>
                </div>
              </div>

              <div className="cf-content-body">
                <div className="cf-what-if-box">
                  <span className="cf-section-tag">CENÁRIO CONTRAFACTUAL FUNDAMENTADO:</span>
                  <p className="cf-text">
                    <MathText text={cf.whatIfNonExistent} />
                  </p>
                </div>

                <div className="cf-hypothesis-box">
                  <span className="cf-section-tag">HIPÓTESE HISTÓRICA ALTERNATIVA (RAMO EVERETT):</span>
                  <p className="cf-hypothesis-text">
                    <MathText text={cf.alternateHistoryHypothesis} />
                  </p>
                </div>

                {cf.brokenDescendants.length > 0 && (
                  <div className="cf-descendants-section">
                    <span className="cf-section-tag">
                      MARCOS SUBSEQUENTES COMPROMETIDOS NO CONE DE LUZ ({cf.brokenDescendants.length}):
                    </span>
                    <div className="cf-desc-list">
                      {cf.brokenDescendants.map(desc => (
                        <div key={desc.id} className="cf-desc-item">
                          <div className="cf-desc-header">
                            <span className="cf-desc-title">{desc.title}</span>
                            <span className="cf-desc-year">({desc.year})</span>
                          </div>
                          <p className="cf-desc-consequence">{desc.consequenceIfMissing}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="cf-physics-section">
                  <span className="cf-section-tag">LEIS FÍSICAS E FORMULAÇÕES MATEMÁTICAS APLICADAS:</span>
                  <div className="cf-physics-grid">
                    {cf.physicalPrinciples.map(item => (
                      <div key={item.principle} className="cf-physics-item">
                        <strong className="cf-phys-name">{item.principle}</strong>
                        <div className="cf-phys-formula">
                          <MathFormula math={item.formula} />
                        </div>
                        <p className="cf-phys-imp">{item.implication}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Deep-Dive Exploration */}
                <div className="cf-ai-section">
                  {!aiReport ? (
                    <button
                      type="button"
                      className="btn-cf-ai-deepdive"
                      onClick={handleFetchAIReport}
                      disabled={isGeneratingAI}
                    >
                      {isGeneratingAI ? (
                        <>
                          <span className="cf-spinner" />
                          Consultando Historiografia e Modelos Relativísticos com IA...
                        </>
                      ) : (
                        <>✨ Aprofundar Análise Contrafactual com IA (GPT-4o)</>
                      )}
                    </button>
                  ) : (
                    <div className="cf-ai-report-container">
                      <div className="cf-ai-report-header">
                        <span>📑 Relatório Acadêmico Aprofundado (IA Temporal)</span>
                        <button
                          type="button"
                          className="btn-cf-toggle"
                          onClick={() => setShowAIReport(!showAIReport)}
                        >
                          {showAIReport ? 'Recolher Relatório' : 'Expandir Relatório'}
                        </button>
                      </div>
                      {showAIReport && (
                        <div className="cf-ai-report-body">
                          <MarkdownText text={aiReport} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer preflight-footer">
          <button type="button" className="btn-secondary" onClick={() => setPreflightImpact(null)}>
            Cancelar
          </button>
          <button type="button" className="btn-secondary" onClick={() => applyIntervention(false)}>
            Aplicar Imediatamente
          </button>
          <button type="button" className="btn-primary-glow" onClick={() => applyIntervention(true)}>
            Aplicar com Replay Causal
          </button>
        </div>
      </div>
    </div>
  );
}

