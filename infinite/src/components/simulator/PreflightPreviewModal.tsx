import { useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { useLaymanMode } from '../../context/useLaymanMode';
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

  const { isLaymanMode: globalLayman } = useLaymanMode();
  const [isLaymanMode, setIsLaymanMode] = useState<boolean>(globalLayman);

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiReportAcademic, setAiReportAcademic] = useState<string | null>(null);
  const [aiReportLayman, setAiReportLayman] = useState<string | null>(null);
  const [showAIReport, setShowAIReport] = useState(true);

  if (!preflightImpact) return null;

  const cf = preflightImpact.counterfactualAnalysis;

  async function handleFetchAIReport(targetLayman?: boolean) {
    if (!preflightImpact) return;
    const isLayman = targetLayman !== undefined ? targetLayman : isLaymanMode;
    const allEvents = universeState.universe.dimensions.flatMap(d => d.events);
    const targetEvent = allEvents.find(e => e.id === preflightImpact.targetEventId);
    if (!targetEvent) return;

    if (isLayman && aiReportLayman) {
      setIsLaymanMode(true);
      setShowAIReport(true);
      return;
    }
    if (!isLayman && aiReportAcademic) {
      setIsLaymanMode(false);
      setShowAIReport(true);
      return;
    }

    setIsGeneratingAI(true);
    try {
      const report = await AITemporalService.fetchAICounterfactualReport(
        targetEvent,
        universeState.universe,
        isLayman
      );
      if (isLayman) {
        setAiReportLayman(report);
      } else {
        setAiReportAcademic(report);
      }
      setShowAIReport(true);
    } catch {
      // Falha tratada internamente
    } finally {
      setIsGeneratingAI(false);
    }
  }

  const currentReport = isLaymanMode
    ? (aiReportLayman || aiReportAcademic)
    : (aiReportAcademic || aiReportLayman);

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

  // Layman friendly analogies for physical laws
  const physicalAnalogies: Record<string, { label: string; explanation: string }> = {
    'Estrutura Causal de Minkowski': {
      label: 'Velocidade Limite da Luz',
      explanation: 'Nada na história se propaga mais rápido do que a luz no vácuo. Qualquer mudança no passado precisa de tempo para viajar pelo espaço até alcançar e transformar o futuro.',
    },
    'Divergência de Lyapunov': {
      label: 'O Efeito Borboleta',
      explanation: 'Uma pequena mudança no passado funciona como uma bola de neve: começa minúscula, mas vai se multiplicando até criar avalanches de diferenças no futuro.',
    },
    'Decoerência e Ramo de Everett': {
      label: 'Universos Paralelos',
      explanation: 'O universo não se destrói: cria-se um novo caminho na história (uma realidade paralela) que passa a coexistir de forma independente.',
    },
    'Princípio de Autoconsistência de Novikov': {
      label: 'Proteção contra Paradoxos',
      explanation: 'A física do universo impede absurdos lógicos: você nunca consegue criar uma contradição impossível (como viajar no tempo e impedir o seu próprio nascimento).',
    },
  };

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
              <h3>{isLaymanMode ? 'Simulação de Impacto na História' : 'Simulação Prévia de Impacto Causal'}</h3>
              <p className="modal-subtitle">
                {isLaymanMode
                  ? 'Entenda em palavras simples o que aconteceria com o mundo e com o futuro se este evento deixasse de existir'
                  : 'Análise determinística e contrafactual das consequências da intervenção temporal'}
              </p>
            </div>
          </div>

          <div className="preflight-header-actions">
            <div className="cf-mode-toggle-group">
              <button
                type="button"
                className={`btn-mode-pill ${!isLaymanMode ? 'active' : ''}`}
                onClick={() => {
                  setIsLaymanMode(false);
                  if (aiReportAcademic) setShowAIReport(true);
                }}
                title="Visualização com termos científicos formais e equações"
              >
                🎓 Acadêmico
              </button>
              <button
                type="button"
                className={`btn-mode-pill ${isLaymanMode ? 'active' : ''}`}
                onClick={() => {
                  setIsLaymanMode(true);
                  if (aiReportAcademic && !aiReportLayman) {
                    handleFetchAIReport(true);
                  }
                }}
                title="Visualização em linguagem simples e fácil para qualquer pessoa entender"
              >
                💡 Para Leigos
              </button>
            </div>

            <button type="button" className="btn-modal-close" onClick={() => setPreflightImpact(null)}>
              ✕
            </button>
          </div>
        </div>

        <div className="preflight-body">
          <div className="preflight-target-box">
            <div className="preflight-target-meta">
              <span className="preflight-label">
                {isLaymanMode ? 'ACONTECIMENTO SELECIONADO:' : 'ALVO DA INTERVENÇÃO:'}
              </span>
              <span className={`preflight-action-tag ${preflightImpact.action === 'erase' ? 'tag-erase' : 'tag-alter'}`}>
                {preflightImpact.action === 'erase'
                  ? (isLaymanMode ? 'APAGAR DA HISTÓRIA (DELETAR)' : 'ANULAÇÃO DE EXISTÊNCIA (DELETE)')
                  : (isLaymanMode ? 'ALTERAR O QUE ACONTECEU' : 'ALTERAÇÃO DE ESTADO CAUSAL')}
              </span>
            </div>
            <h4 className="preflight-target-title">{preflightImpact.targetEventTitle}</h4>
          </div>

          <div className="preflight-grid">
            <div className="preflight-stat-card">
              <span className="preflight-stat-label">
                {isLaymanMode ? 'Efeitos Imediatos:' : 'Impactos Diretos:'}
              </span>
              <strong className="preflight-stat-val text-amber">{preflightImpact.directEffectsCount}</strong>
              <span className="preflight-stat-sub">
                {isLaymanMode ? 'acontecimentos logo a seguir' : 'nós filhos imediatos'}
              </span>
            </div>

            <div className="preflight-stat-card">
              <span className="preflight-stat-label">
                {isLaymanMode ? 'Efeitos em Cascata:' : 'Impactos Indiretos:'}
              </span>
              <strong className="preflight-stat-val text-cyan">{preflightImpact.indirectEffectsCount}</strong>
              <span className="preflight-stat-sub">
                {isLaymanMode ? 'mudanças a longo prazo' : 'em cascata no futuro'}
              </span>
            </div>

            <div className="preflight-stat-card">
              <span className="preflight-stat-label">
                {isLaymanMode ? 'Pessoas Afetadas:' : 'Viajantes Ameaçados:'}
              </span>
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
              <span className="preflight-stat-label">
                {isLaymanMode ? 'Pilares Históricos:' : 'Âncoras em Risco:'}
              </span>
              <strong className="preflight-stat-val text-purple">
                {preflightImpact.criticalAnchorsAtRisk.length}
              </strong>
              <span className="preflight-stat-sub">
                {preflightImpact.criticalAnchorsAtRisk.length > 0
                  ? preflightImpact.criticalAnchorsAtRisk.slice(0, 2).join(', ')
                  : (isLaymanMode ? 'Nenhum pilar afetado' : 'Nenhuma âncora afetada')}
              </span>
            </div>
          </div>

          <div className="preflight-integrity-comparison">
            <div className="comparison-header">
              <span>{isLaymanMode ? 'Saúde da Linha do Tempo Prevista:' : 'Projeção de Integridade Temporal:'}</span>
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
                  <div>
                    <h4>
                      {isLaymanMode
                        ? 'E Se Esse Acontecimento Nunca Tivesse Existido?'
                        : 'O Que Aconteceria se este Evento Não Existisse?'}
                    </h4>
                    <span className="cf-sub">
                      {isLaymanMode
                        ? 'Explicação acessível e direta do que mudaria na história e na vida das pessoas'
                        : 'Análise causal fundamentada em historiografia e teorias físicas formais'}
                    </span>
                  </div>
                </div>

                <div className="cf-inline-toggle">
                  <button
                    type="button"
                    className={`btn-cf-submode ${!isLaymanMode ? 'active' : ''}`}
                    onClick={() => {
                      setIsLaymanMode(false);
                      if (aiReportAcademic) setShowAIReport(true);
                    }}
                  >
                    🎓 Acadêmico
                  </button>
                  <button
                    type="button"
                    className={`btn-cf-submode ${isLaymanMode ? 'active' : ''}`}
                    onClick={() => {
                      setIsLaymanMode(true);
                      if (aiReportAcademic && !aiReportLayman) {
                        handleFetchAIReport(true);
                      }
                    }}
                  >
                    💡 Para Leigos
                  </button>
                </div>
              </div>

              <div className="cf-content-body">
                <div className="cf-what-if-box">
                  <span className="cf-section-tag">
                    {isLaymanMode ? 'O QUE ACONTECERIA DE DIFERENTE:' : 'CENÁRIO CONTRAFACTUAL FUNDAMENTADO:'}
                  </span>
                  <p className="cf-text">
                    <MathText text={cf.whatIfNonExistent} />
                  </p>
                </div>

                <div className="cf-hypothesis-box">
                  <span className="cf-section-tag">
                    {isLaymanMode ? 'COMO SERIA O MUNDO HOJE:' : 'HIPÓTESE HISTÓRICA ALTERNATIVA (RAMO EVERETT):'}
                  </span>
                  <p className="cf-hypothesis-text">
                    <MathText text={cf.alternateHistoryHypothesis} />
                  </p>
                </div>

                {cf.brokenDescendants.length > 0 && (
                  <div className="cf-descendants-section">
                    <span className="cf-section-tag">
                      {isLaymanMode
                        ? `GRANDES CONQUISTAS E MARCOS QUE NÃO EXISTIRIAM (${cf.brokenDescendants.length}):`
                        : `MARCOS SUBSEQUENTES COMPROMETIDOS NO CONE DE LUZ (${cf.brokenDescendants.length}):`}
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
                  <span className="cf-section-tag">
                    {isLaymanMode ? 'COMO A CIÊNCIA EXPLICA ISSO (SEM COMPLICAÇÃO):' : 'LEIS FÍSICAS E FORMULAÇÕES MATEMÁTICAS APLICADAS:'}
                  </span>
                  <div className="cf-physics-grid">
                    {cf.physicalPrinciples.map(item => {
                      const analogy = physicalAnalogies[item.principle];
                      return (
                        <div key={item.principle} className="cf-physics-item">
                          <strong className="cf-phys-name">
                            {isLaymanMode && analogy ? analogy.label : item.principle}
                          </strong>
                          {!isLaymanMode ? (
                            <div className="cf-phys-formula">
                              <MathFormula math={item.formula} />
                            </div>
                          ) : (
                            <div className="cf-layman-analogy-chip">
                              <span>💡 Analogia Prática</span>
                            </div>
                          )}
                          <p className="cf-phys-imp">
                            {isLaymanMode && analogy ? analogy.explanation : item.implication}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Deep-Dive Exploration with Layman Support */}
                <div className="cf-ai-section">
                  {!currentReport ? (
                    <button
                      type="button"
                      className={`btn-cf-ai-deepdive ${isLaymanMode ? 'btn-cf-layman' : ''}`}
                      onClick={() => handleFetchAIReport(isLaymanMode)}
                      disabled={isGeneratingAI}
                    >
                      {isGeneratingAI ? (
                        <>
                          <span className="cf-spinner" />
                          {isLaymanMode
                            ? 'Criando explicação simples e didática com IA...'
                            : 'Consultando Historiografia e Modelos Relativísticos com IA...'}
                        </>
                      ) : (
                        <>
                          {isLaymanMode
                            ? '💡 Explicar com IA de Forma Fácil (Para Leigos)'
                            : 'Aprofundar Análise Contrafactual com IA (GPT-4o)'}
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="cf-ai-report-container">
                      <div className="cf-ai-report-header">
                        <div className="cf-report-title-badge">
                          <span>
                            {isLaymanMode
                              ? '💡 Explicação Didática para Leigos (IA Temporal)'
                              : 'Relatório Acadêmico Aprofundado (IA Temporal)'}
                          </span>
                        </div>

                        <div className="cf-report-actions">
                          {/* Toggle between academic and layman within the report */}
                          <div className="cf-inline-toggle">
                            <button
                              type="button"
                              className={`btn-cf-submode ${!isLaymanMode ? 'active' : ''}`}
                              onClick={() => {
                                setIsLaymanMode(false);
                                if (!aiReportAcademic) handleFetchAIReport(false);
                              }}
                              title="Ver versão acadêmica aprofundada"
                            >
                              🎓 Acadêmico
                            </button>
                            <button
                              type="button"
                              className={`btn-cf-submode ${isLaymanMode ? 'active' : ''}`}
                              onClick={() => {
                                setIsLaymanMode(true);
                                if (!aiReportLayman) handleFetchAIReport(true);
                              }}
                              title="Ver explicação fácil e acessível para leigos"
                            >
                              💡 Para Leigos
                            </button>
                          </div>

                          <button
                            type="button"
                            className="btn-cf-toggle"
                            onClick={() => setShowAIReport(!showAIReport)}
                          >
                            {showAIReport ? 'Recolher Relatório' : 'Expandir Relatório'}
                          </button>
                        </div>
                      </div>
                      {showAIReport && (
                        <div className="cf-ai-report-body">
                          {isGeneratingAI ? (
                            <div className="cf-ai-loading-box">
                              <span className="cf-spinner" />
                              <p>Gerando versão {isLaymanMode ? 'simplificada para leigos' : 'acadêmica formal'} com IA...</p>
                            </div>
                          ) : (
                            <MarkdownText text={currentReport} />
                          )}
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

