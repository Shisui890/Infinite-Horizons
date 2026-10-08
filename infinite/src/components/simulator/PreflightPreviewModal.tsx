import { useState, useMemo, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { TemporalReplayEngine } from '../../engine/TemporalReplayEngine';
import { GraphEngine } from '../../engine/GraphEngine';
import {
  ExpertCounterfactualEngine,
  type RealisticCounterfactualAnalysis,
} from '../../engine/ExpertCounterfactualEngine';
import { PhaseSpaceEntropyEngine, type PhaseSpaceMetricsResult } from '../../engine/PhaseSpaceEntropyEngine';
import { AcademicGenealogyEngine, type AcademicLineageNode } from '../../engine/AcademicGenealogyEngine';
import { CosmicAudio } from '../../engine/CosmicAudioEngine';
import { formatHistoricalYear } from '../../utils/formatters';
import type { TemporalEvent, Dimension, CausalEdge } from '../../types/temporal';
import { EventStatus, CausalRelation } from '../../types/temporal';
import MathFormula, { MathText } from '../MathFormula';

export default function PreflightPreviewModal() {
  const {
    preflightImpact,
    setPreflightImpact,
    universeState,
    removeEvent,
    updateEvent,
    startReplay,
    setUniverseState,
    setActiveDimensionId,
    setSelectedEventId,
  } = useSimulationStore();

  const [liveAnalysis, setLiveAnalysis] = useState<RealisticCounterfactualAnalysis | null>(null);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [showDetailedSources, setShowDetailedSources] = useState(true);

  // Modos de visualização analítica (Dossiê, Comparador, Espaço de Fase e Debate)
  const [viewMode, setViewMode] = useState<'dossier' | 'comparator' | 'phasespace' | 'debate'>('dossier');
  const [debateWeight, setDebateWeight] = useState<number>(0.5);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [inquirySpecialistId, setInquirySpecialistId] = useState<'stern' | 'pendelton' | 'mendoza'>('stern');
  const [inquiryQuestion, setInquiryQuestion] = useState('');
  const [inquiryHistory, setInquiryHistory] = useState<
    Array<{ specialistName: string; role: string; badgeLabel: string; question: string; answer: string }>
  >([]);

  // Disparo de áudio procedural (Chirp gravitacional na abertura da análise de impacto)
  useEffect(() => {
    if (preflightImpact) {
      const drop = Math.max(10, 100 - preflightImpact.predictedIntegrity);
      CosmicAudio.playGravitationalChirp(drop);
    }
  }, [preflightImpact]);

  const allEvents = useMemo(
    () => universeState.universe.dimensions.flatMap(d => d.events),
    [universeState.universe.dimensions]
  );

  const targetEvent = useMemo(
    () => (preflightImpact ? allEvents.find(e => e.id === preflightImpact.targetEventId) : null),
    [allEvents, preflightImpact]
  );

  const descendants = useMemo(() => {
    if (!preflightImpact) return [];
    const descIds = Array.from(GraphEngine.getDescendants(preflightImpact.targetEventId, universeState.universe.edges));
    return descIds.map(id => allEvents.find(e => e.id === id)).filter((e): e is TemporalEvent => Boolean(e));
  }, [allEvents, preflightImpact, universeState.universe.edges]);

  const deterministicAnalysis = useMemo(() => {
    if (!targetEvent) return null;
    return ExpertCounterfactualEngine.generateRealisticAnalysis(targetEvent, descendants, universeState.universe);
  }, [targetEvent, descendants, universeState.universe]);

  const analysis = liveAnalysis || deterministicAnalysis;

  const phaseSpaceAnalysis = useMemo<PhaseSpaceMetricsResult | null>(() => {
    if (!targetEvent || !analysis) return null;
    return PhaseSpaceEntropyEngine.computePhaseSpaceAnalysis(
      universeState.universe,
      targetEvent,
      analysis.epistemicDelayYears
    );
  }, [targetEvent, analysis, universeState.universe]);

  const lineageNode = useMemo<AcademicLineageNode | null>(() => {
    if (!targetEvent) return null;
    return AcademicGenealogyEngine.resolveLineage(targetEvent);
  }, [targetEvent]);

  if (!preflightImpact) return null;

  async function handleEnhanceWithAI() {
    if (!targetEvent) return;
    setIsLiveLoading(true);
    setShowDetailedSources(true);
    try {
      const res = await ExpertCounterfactualEngine.queryLiveAIRealisticAnalysis(
        targetEvent,
        descendants,
        universeState.universe
      );
      if (res) {
        setLiveAnalysis(res);
      }
    } finally {
      setIsLiveLoading(false);
    }
  }

  function triggerFileDownload(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleExportBibTeX() {
    if (!analysis || !targetEvent) return;
    const content = ExpertCounterfactualEngine.generateBibTeX(analysis, targetEvent);
    triggerFileDownload(content, `dossie-${targetEvent.id}-fontes.bib`, 'application/x-bibtex');
    setShowExportMenu(false);
  }

  function handleExportLaTeX() {
    if (!analysis || !targetEvent) return;
    const content = ExpertCounterfactualEngine.generateLaTeX(analysis, targetEvent);
    triggerFileDownload(content, `dossie-${targetEvent.id}-causalidade.tex`, 'application/x-latex');
    setShowExportMenu(false);
  }

  function handleExportMarkdown() {
    if (!analysis || !targetEvent) return;
    const content = ExpertCounterfactualEngine.generateMarkdown(analysis, targetEvent);
    triggerFileDownload(content, `dossie-${targetEvent.id}-relatorio.md`, 'text/markdown');
    setShowExportMenu(false);
  }

  function handleBranchAlternateTimeline() {
    if (!preflightImpact || !targetEvent || !analysis) return;
    const delay = analysis.epistemicDelayYears;
    const rediscoveryYear = targetEvent.year + delay;
    const newDimId = `dim-beta-${Date.now()}`;
    const rediscoveryEventId = `evt-rediscovery-${Date.now()}`;

    const currentDim =
      universeState.universe.dimensions.find(d => d.id === targetEvent.dimensionId) ||
      universeState.universe.dimensions[0];

    const rediscoveryEvent: TemporalEvent = {
      id: rediscoveryEventId,
      dimensionId: newDimId,
      title: `Redescoberta Tardia: ${targetEvent.title}`,
      year: rediscoveryYear,
      category: targetEvent.category,
      importance: targetEvent.importance,
      position: {
        x: targetEvent.position.x + 100,
        y: targetEvent.position.y + 40,
      },
      status: EventStatus.ALTERED,
      description: `[RAMIFICAÇÃO CONTRAFACTUAL] Reconstituição científica independente formulada aproximadamente ${delay} anos após a anulação de "${targetEvent.title}" (${formatHistoricalYear(targetEvent.year)}). O marco histórico é restabelecido por vias empíricas colegiadas tardias.`,
      parents: [],
      children: descendants.map(d => d.id),
      causes: [],
      consequences: descendants.map(d => d.id),
      scientificStatus: 'proven',
      evidenceKind: 'model_result',
      doi: '10.1000/infinite-horizons.beta-branch',
      academicCitation: `Comitê Contrafactual Infinite Horizons (${formatHistoricalYear(rediscoveryYear)}). Rededução epistêmica de ${targetEvent.title}.`,
    };

    const clonedEvents: TemporalEvent[] = (currentDim?.events || [])
      .filter(e => e.id !== targetEvent.id)
      .map(e => ({
        ...e,
        dimensionId: newDimId,
      }));
    clonedEvents.push(rediscoveryEvent);

    const newDimension: Dimension = {
      id: newDimId,
      universeId: universeState.universe.id,
      name: `Linha Contrafactual Beta (${targetEvent.title})`,
      designation: `BETA-${targetEvent.year}`,
      color: '#f59e0b',
      events: clonedEvents,
      integrity: preflightImpact.predictedIntegrity,
    };

    const newEdges: CausalEdge[] = [
      ...universeState.universe.edges.filter(
        edge => edge.source !== targetEvent.id && edge.target !== targetEvent.id
      ),
      ...descendants.map((d, idx) => ({
        id: `edge-rediscovery-${idx}-${Date.now()}`,
        source: rediscoveryEventId,
        target: d.id,
        type: CausalRelation.DERIVES,
        active: true,
        evidence: `Conexão causal tardia derivada da redescoberta em ${formatHistoricalYear(rediscoveryYear)}`,
      })),
    ];

    const summaryLog = {
      id: `log-branch-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      message: `[BIFURCAÇÃO TEMPORAL] Criada Linha Beta (${newDimension.designation}) com nó de redescoberta tardia em ${formatHistoricalYear(rediscoveryYear)}.`,
      type: 'warning' as const,
    };

    setUniverseState({
      ...universeState,
      universe: {
        ...universeState.universe,
        dimensions: [...universeState.universe.dimensions, newDimension],
        edges: newEdges,
        updatedAt: Date.now(),
      },
      logs: [summaryLog, ...universeState.logs],
    });

    setActiveDimensionId(newDimId);
    setSelectedEventId(rediscoveryEventId);
    setPreflightImpact(null);
  }

  function handleAskSpecialist(questionToAsk?: string) {
    const q = (questionToAsk || inquiryQuestion).trim();
    if (!q || !analysis || !targetEvent) return;

    const currentSpecialist =
      analysis.expertOpinions.find(o => o.specialistId === inquirySpecialistId) ||
      analysis.expertOpinions[0];

    const answer = ExpertCounterfactualEngine.answerSpecialistInquiry(
      inquirySpecialistId,
      q,
      analysis,
      targetEvent
    );

    setInquiryHistory(prev => [
      ...prev,
      {
        specialistName: currentSpecialist.name,
        role: currentSpecialist.role,
        badgeLabel: currentSpecialist.badgeLabel,
        question: q,
        answer,
      },
    ]);
    setInquiryQuestion('');
  }

  function logRealisticImpact() {
    if (analysis && targetEvent) {
      const summaryLog = {
        id: `log-expert-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        message: `[PARECER DE ESPECIALISTAS] Anulação de "${targetEvent.title}" (${formatHistoricalYear(targetEvent.year)}): Retardo histórico estimado de ~${analysis.epistemicDelayYears} anos.`,
        type: 'warning' as const,
      };
      setUniverseState({
        ...universeState,
        logs: [summaryLog, ...universeState.logs],
      });
    }
  }

  function handleApplyWithReplay() {
    if (!preflightImpact) return;
    logRealisticImpact();
    const frames = TemporalReplayEngine.generateReplayFrames(
      universeState.universe,
      preflightImpact.targetEventId,
      preflightImpact.action === 'erase' ? 'erase' : 'alter'
    );
    if (preflightImpact.action === 'erase') {
      removeEvent(preflightImpact.targetEventId);
    } else {
      updateEvent(preflightImpact.targetEventId, { status: EventStatus.ALTERED });
    }
    setPreflightImpact(null);
    startReplay(frames);
  }

  function handleApplyDirectly() {
    if (!preflightImpact) return;
    logRealisticImpact();
    if (preflightImpact.action === 'erase') {
      removeEvent(preflightImpact.targetEventId);
    } else {
      updateEvent(preflightImpact.targetEventId, { status: EventStatus.ALTERED });
    }
    setPreflightImpact(null);
  }

  const detailedAI = analysis?.detailedAIDeduction;

  return (
    <div className="modal-overlay sim-modal-overlay">
      <div className="modal-card preflight-modal" role="dialog" aria-modal="true">
        {/* Header Fixo com Toolbar Integrada */}
        <div className="modal-header preflight-header">
          <div className="modal-title-group">
            <span className="preflight-warning-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc' }}>
                Simulação Prévia de Impacto Causal
              </h3>
              <p className="modal-subtitle" style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                Análise determinística das consequências da intervenção temporal
              </p>
            </div>
          </div>

          {/* Ações da Barra Superior (Modo & Exportação) */}
          <div className="preflight-header-tools">
            <div className="preflight-mode-toggle">
              <button
                type="button"
                className={`btn-mode-pill ${viewMode === 'dossier' ? 'active' : ''}`}
                onClick={() => setViewMode('dossier')}
                title="Visualizar dossiê científico completo com deduções e fontes"
              >
                Dossiê Completo
              </button>
              <button
                type="button"
                className={`btn-mode-pill ${viewMode === 'comparator' ? 'active' : ''}`}
                onClick={() => setViewMode('comparator')}
                title="Visualizar comparação direta lado a lado"
              >
                Antes vs. Depois
              </button>
              <button
                type="button"
                className={`btn-mode-pill ${viewMode === 'phasespace' ? 'active' : ''}`}
                onClick={() => setViewMode('phasespace')}
                title="Visualizar métricas de entropia de Shannon e estabilidade de Lyapunov"
              >
                Espaço de Fase
              </button>
              <button
                type="button"
                className={`btn-mode-pill ${viewMode === 'debate' ? 'active' : ''}`}
                onClick={() => setViewMode('debate')}
                title="Confronto dialético entre determinismo tecnológico e contingência histórica"
              >
                Debate Epistêmico
              </button>
            </div>

            <div className="preflight-export-wrapper">
              <button
                type="button"
                className="btn-export-dossier"
                onClick={() => setShowExportMenu(!showExportMenu)}
                title="Exportar dossiê acadêmico com fontes verificadas"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Exportar Dossiê</span>
              </button>

              {showExportMenu && (
                <div className="export-dropdown-menu">
                  <button type="button" onClick={handleExportBibTeX} className="export-menu-item">
                    <span>BibTeX (.bib)</span>
                    <span className="export-badge">Citações</span>
                  </button>
                  <button type="button" onClick={handleExportLaTeX} className="export-menu-item">
                    <span>LaTeX (.tex)</span>
                    <span className="export-badge">Paper</span>
                  </button>
                  <button type="button" onClick={handleExportMarkdown} className="export-menu-item">
                    <span>Markdown (.md)</span>
                    <span className="export-badge">Dossiê</span>
                  </button>
                </div>
              )}
            </div>

            <button type="button" className="btn-modal-close" onClick={() => setPreflightImpact(null)} aria-label="Fechar modal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Corpo com Scrollbar Independente */}
        <div className="preflight-body">
          {/* Caixa do Alvo */}
          <div className="preflight-target-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="preflight-label">ALVO DA INTERVENÇÃO:</span>
              {analysis && (
                <span className="preflight-domain-badge">
                  {analysis.scientificDomain}
                </span>
              )}
            </div>
            <h4 className="preflight-target-title">
              {preflightImpact.targetEventTitle}{' '}
              {targetEvent?.year !== undefined && (
                <span style={{ color: '#00d4ff', fontWeight: 600 }}>
                  ({formatHistoricalYear(targetEvent.year)})
                </span>
              )}
            </h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="preflight-action-tag">
                AÇÃO: {preflightImpact.action === 'erase' ? 'ANULAÇÃO DE EXISTÊNCIA (DELETE)' : 'ALTERAÇÃO'}
              </span>
              {analysis && (
                <span className="preflight-delay-tag">
                  RETARDO ESTIMADO: ~{analysis.epistemicDelayYears} ANOS
                </span>
              )}
            </div>
          </div>

          {/* ====================================================================
              MODO 1: COMPARADOR ANTES VS. DEPOIS (SPLIT SCREEN)
              ==================================================================== */}
          {viewMode === 'comparator' && (
            <div className="preflight-comparator-view">
              <div className="comparator-split-grid">
                {/* Coluna 1: Linha Factual Alfa (Original) */}
                <div className="comparator-col comparator-col-alpha">
                  <div className="comparator-col-header">
                    <div className="comparator-col-badge badge-alpha">LINHA FACTUAL ALFA (ORIGINAL)</div>
                    <span className="comparator-col-sub">Com o marco histórico consolidado</span>
                  </div>
                  <div className="comparator-metric-row">
                    <span>Integridade Causal:</span>
                    <strong className="text-emerald">100%</strong>
                  </div>
                  <div className="comparator-timeline-tree">
                    <div className="comparator-node-card status-active">
                      <div className="node-card-top">
                        <span className="node-tag tag-factual">MARCO FACTUAL CONSOLIDADO</span>
                        <span className="node-year">{targetEvent?.year !== undefined ? formatHistoricalYear(targetEvent.year) : ''}</span>
                      </div>
                      <h5 className="node-title">{targetEvent?.title}</h5>
                      <p className="node-desc">
                        Marco preservado. Todas as cadeias causais e derivações operam na cadência cronológica estabelecida pela história documentada.
                      </p>
                    </div>

                    <div className="comparator-descendants-summary">
                      <span className="descendants-label">Nós Derivados Operantes ({descendants.length}):</span>
                      <div className="descendants-chips">
                        {descendants.slice(0, 4).map(d => (
                          <span key={d.id} className="descendant-chip chip-normal">
                            {d.title} ({formatHistoricalYear(d.year)})
                          </span>
                        ))}
                        {descendants.length > 4 && (
                          <span className="descendant-chip chip-more">+{descendants.length - 4} outros marcos</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Linha Contrafactual Beta (Sem o Evento) */}
                <div className="comparator-col comparator-col-beta">
                  <div className="comparator-col-header">
                    <div className="comparator-col-badge badge-beta">LINHA CONTRAFACTUAL BETA (PROJEÇÃO)</div>
                    <span className="comparator-col-sub">Sem o marco histórico • Retardo ~{analysis?.epistemicDelayYears || 0} anos</span>
                  </div>
                  <div className="comparator-metric-row">
                    <span>Integridade Projetada:</span>
                    <strong className="text-amber">{preflightImpact.predictedIntegrity}%</strong>
                  </div>
                  <div className="comparator-timeline-tree">
                    <div className="comparator-node-card status-erased">
                      <div className="node-card-top">
                        <span className="node-tag tag-erased">ANULADO / SUPRIMIDO</span>
                        <span className="node-year">{targetEvent?.year !== undefined ? formatHistoricalYear(targetEvent.year) : ''}</span>
                      </div>
                      <h5 className="node-title">{targetEvent?.title}</h5>
                      <p className="node-desc">
                        Ausência do evento. Descontinuidade empírica imediata na árvore de conhecimento científico.
                      </p>
                    </div>

                    {analysis && targetEvent && (
                      <div className="comparator-node-card status-delayed">
                        <div className="node-card-top">
                          <span className="node-tag tag-delayed">REDESCOBERTA TARDIA PROJETADA</span>
                          <span className="node-year">
                            {formatHistoricalYear(targetEvent.year + analysis.epistemicDelayYears)}
                          </span>
                        </div>
                        <h5 className="node-title">Redescoberta Tardia: {targetEvent.title}</h5>
                        <p className="node-desc">
                          Rederivação empírica estimada com atraso cumulativo de aproximadamente ~{analysis.epistemicDelayYears} anos por pesquisadores independentes.
                        </p>
                      </div>
                    )}

                    <div className="comparator-descendants-summary">
                      <span className="descendants-label">Nós Afetados ou Inviabilizados ({descendants.length}):</span>
                      <div className="descendants-chips">
                        {descendants.slice(0, 4).map(d => (
                          <span key={d.id} className="descendant-chip chip-delayed">
                            {d.title} ({formatHistoricalYear(d.year)}) • ADIADO
                          </span>
                        ))}
                        {descendants.length > 4 && (
                          <span className="descendant-chip chip-more">+{descendants.length - 4} outros afetados</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================
              MODO 2: DOSSIÊ ANALÍTICO COMPLETO
              ==================================================================== */}
          {viewMode === 'dossier' && (
            <>
              {/* Grid de Métricas Principais */}
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

              {/* Barra de Integridade Temporal */}
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

              {/* Seção Realista com KaTeX */}
              {analysis && (
                <div className="preflight-realistic-section">
                  <div className="realistic-header-banner">
                    <div className="realistic-badge-wrap">
                      <span className="realistic-pulse-dot" />
                      <span className="realistic-badge-title">ANÁLISE HISTÓRICA & CIENTÍFICA REALISTA</span>
                    </div>
                    <div className="realistic-banner-actions">
                      <button
                        type="button"
                        className="btn-ai-explain-deep"
                        onClick={handleEnhanceWithAI}
                        disabled={isLiveLoading}
                        title="Consultar documentação histórica e dedução aprofundada com fontes primárias"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <span>
                          {isLiveLoading ? 'Consultando Arquivos & Probabilidade...' : 'Auditar Fontes Primárias & Historiografia'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Resumo Executivo Contrafactual com Renderização KaTeX */}
                  <div className="realistic-summary-box">
                    <div className="realistic-summary-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                      <span>O Que Aconteceria Factualmente Sem Este Evento:</span>
                    </div>
                    <div className="realistic-summary-text-wrap">
                      <MathText text={analysis.realisticHistoricalSummary} className="realistic-summary-text" />
                    </div>
                    <div className="realistic-consensus-pill">
                      <strong>{analysis.consensusVerdict}</strong>
                    </div>
                  </div>

                  {/* Dedução Detalhada da IA com Fontes e Origem */}
                  {detailedAI && showDetailedSources && (
                    <div className="ai-deduction-panel">
                      <div className="ai-deduction-header">
                        <div className="ai-deduction-title-group">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                          </svg>
                          <strong>Dedução da IA: Cenário Mais Provável & Evidências Históricas</strong>
                        </div>
                        <div className="ai-confidence-badge">
                          <span>Probabilidade: <strong>{detailedAI.probabilityScore}%</strong></span>
                          <span className="confidence-tag">{detailedAI.confidenceLabel}</span>
                        </div>
                      </div>

                      {/* Cenário Mais Provável com KaTeX */}
                      <div className="ai-scenario-box">
                        <span className="scenario-label">Cenário Histórico e Tecnológico Mais Provável (Sem Ficção):</span>
                        <div className="scenario-text-wrap">
                          <MathText text={detailedAI.mostProbableScenario} className="scenario-text" />
                        </div>
                      </div>

                      {/* Declaração Expressa de Origem */}
                      <div className="ai-origin-statement">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <div>
                          <strong className="origin-title">De Onde Foi Extraída Esta Análise:</strong>
                          <span className="origin-desc">{detailedAI.extractionOrigin}</span>
                        </div>
                      </div>

                      {/* Lista de Fontes Primárias Verificadas */}
                      <div className="ai-sources-list-wrap">
                        <span className="sources-list-title">
                          Fontes Históricas & Científicas Primárias Verificadas ({detailedAI.primarySources.length}):
                        </span>
                        <div className="sources-cards-grid">
                          {detailedAI.primarySources.map(source => (
                            <div key={source.id} className="source-card">
                              <div className="source-card-top">
                                <span className="source-badge">{source.repository}</span>
                                <span className="source-year">{source.yearOrPeriod}</span>
                              </div>
                              <h5 className="source-title">{source.title}</h5>
                              <span className="source-author">{source.authorOrInstitution}</span>
                              <p className="source-relevance">{source.relevance}</p>
                              {source.url && (
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="source-link"
                                >
                                  <span>Acessar Documento Primário</span>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Precedentes Históricos Documentados */}
                      {detailedAI.historicalPrecedents.length > 0 && (
                        <div className="ai-precedents-box">
                          <span className="precedents-label">Precedentes Históricos Factuais Documentados:</span>
                          <ul className="precedents-list">
                            {detailedAI.historicalPrecedents.map((prec, i) => (
                              <li key={i}>{prec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Parecer dos Especialistas com KaTeX */}
                  <div className="realistic-experts-container">
                    <div className="experts-section-title">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span>Parecer Individual de Especialistas e Historiadores:</span>
                      </div>
                    </div>

                    <div className="experts-cards-list">
                      {analysis.expertOpinions.map((expert, idx) => {
                        const verdictColor =
                          expert.verdict === 'IMPACTO CRÍTICO'
                            ? '#ef4444'
                            : expert.verdict === 'RUPTURA EPISTÊMICA'
                            ? '#a855f7'
                            : expert.verdict === 'RETARDO HISTÓRICO'
                            ? '#f59e0b'
                            : '#10b981';

                        return (
                          <div key={expert.specialistId || idx} className="expert-opinion-card">
                            <div className="expert-card-top">
                              <div className="expert-info-group">
                                <span className="expert-monogram-badge">
                                  {expert.badgeLabel || 'PARECER'}
                                </span>
                                <div>
                                  <strong className="expert-name">{expert.name}</strong>
                                  <span className="expert-role">{expert.role} • {expert.institution}</span>
                                </div>
                              </div>
                              <span className="expert-verdict-badge" style={{ borderColor: verdictColor, color: verdictColor }}>
                                {expert.verdict}
                              </span>
                            </div>
                            <div className="expert-analysis-text-wrap">
                              <MathText text={expert.analysis} className="expert-analysis-text" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ====================================================================
                        NOVO: SEÇÃO DE PERGUNTA DIRETA AO COLEGIADO DE ESPECIALISTAS
                        ==================================================================== */}
                    <div className="inquiry-section">
                      <div className="inquiry-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                          </svg>
                          <strong style={{ fontSize: '0.8rem', color: '#f1f5f9' }}>
                            Consulta Direta ao Colegiado de Especialistas
                          </strong>
                        </div>
                        <span className="inquiry-sub">Tire dúvidas pontuais sem especulação ficcional</span>
                      </div>

                      <div className="inquiry-specialist-selector">
                        <span className="selector-label">Especialista a Consultar:</span>
                        <div className="selector-buttons">
                          {analysis.expertOpinions.map(expert => (
                            <button
                              key={expert.specialistId}
                              type="button"
                              className={`specialist-select-btn ${inquirySpecialistId === expert.specialistId ? 'active' : ''}`}
                              onClick={() => setInquirySpecialistId(expert.specialistId as 'stern' | 'pendelton' | 'mendoza')}
                            >
                              <span className="select-badge">{expert.badgeLabel}</span>
                              <span>{expert.name.split(' ').slice(-1)[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="inquiry-quick-chips">
                        <span className="chips-label">Tópicos Frequentes:</span>
                        <button
                          type="button"
                          className="inquiry-chip"
                          onClick={() => handleAskSpecialist('Qual seria o impacto na aviação, navegação e voos noturnos?')}
                        >
                          Aviação & Navegação
                        </button>
                        <button
                          type="button"
                          className="inquiry-chip"
                          onClick={() => handleAskSpecialist('Como a medicina, hospitais e diagnósticos seriam atrasados?')}
                        >
                          Medicina & Diagnósticos
                        </button>
                        <button
                          type="button"
                          className="inquiry-chip"
                          onClick={() => handleAskSpecialist('Qual o impacto na computação, circuitos e chips eletrônicos?')}
                        >
                          Computação & Chips
                        </button>
                        <button
                          type="button"
                          className="inquiry-chip"
                          onClick={() => handleAskSpecialist('Qual a repercussão econômica e nas fábricas de alta precisão?')}
                        >
                          Economia & Manufatura
                        </button>
                      </div>

                      <form
                        className="inquiry-form"
                        onSubmit={e => {
                          e.preventDefault();
                          handleAskSpecialist();
                        }}
                      >
                        <input
                          type="text"
                          className="inquiry-input"
                          placeholder="Pergunte ao especialista (ex: 'E as viagens espaciais?')"
                          value={inquiryQuestion}
                          onChange={e => setInquiryQuestion(e.target.value)}
                        />
                        <button type="submit" className="inquiry-submit-btn" disabled={!inquiryQuestion.trim()}>
                          Consultar
                        </button>
                      </form>

                      {inquiryHistory.length > 0 && (
                        <div className="inquiry-history-list">
                          {inquiryHistory.map((item, idx) => (
                            <div key={idx} className="inquiry-history-item">
                              <div className="inquiry-item-top">
                                <span className="inquiry-history-badge">{item.badgeLabel}</span>
                                <strong className="inquiry-history-author">{item.specialistName} ({item.role})</strong>
                              </div>
                              <p className="inquiry-user-q">Pergunta: <em>"{item.question}"</em></p>
                              <div className="inquiry-answer-text">
                                <MathText text={item.answer} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Consequências em Cascata nos Eventos Filhos */}
                  {analysis.cascadingConsequences.length > 0 && (
                    <div className="cascading-timeline-section">
                      <div className="cascading-section-title-wrap">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <span className="cascading-section-title">
                          Desdobramentos Factualmente Inviabilizados ou Retardados:
                        </span>
                      </div>
                      <div className="cascading-items-grid">
                        {analysis.cascadingConsequences.map(item => (
                          <div key={item.eventId} className="cascading-item-card">
                            <div className="cascading-item-header">
                              <span className="cascading-item-name">{item.eventTitle}</span>
                              <span className="cascading-item-year">({formatHistoricalYear(item.eventYear)})</span>
                              <span
                                className="cascading-status-tag"
                                style={{
                                  background:
                                    item.historicalStatus === 'CANCELADO NA ÉPOCA'
                                      ? 'rgba(239, 68, 68, 0.15)'
                                      : 'rgba(245, 158, 11, 0.15)',
                                  color: item.historicalStatus === 'CANCELADO NA ÉPOCA' ? '#ef4444' : '#f59e0b',
                                }}
                              >
                                {item.historicalStatus}
                              </span>
                            </div>
                            <div className="cascading-item-desc-wrap">
                              <MathText text={item.consequenceSummary} className="cascading-item-desc" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nota de Metodologia */}
                  <div className="realistic-methodology-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>{analysis.methodologyNote}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ====================================================================
              MODO 3: ESPAÇO DE FASE & ENTROPIA DE SHANNON (MÉTRICAS DE LYAPUNOV)
              ==================================================================== */}
          {viewMode === 'phasespace' && phaseSpaceAnalysis && (
            <div className="preflight-phasespace-view">
              {/* Banner Superior de Estabilidade Dinâmica */}
              <div
                className={`phasespace-stability-banner ${
                  phaseSpaceAnalysis.isChaoticDivergence ? 'banner-chaotic' : 'banner-attractor'
                }`}
              >
                <div className="banner-left-info">
                  <span className="banner-kicker">REGIME DINÂMICO DE ESPAÇO DE FASE:</span>
                  <h4 className="banner-title">
                    {phaseSpaceAnalysis.isChaoticDivergence
                      ? 'DIVERGÊNCIA CAÓTICA (EXPANSÃO EXPONENCIAL)'
                      : 'ATRATOR HISTÓRICO CONVERGENTE (AUTOCURA TEMPORAL)'}
                  </h4>
                  <p className="banner-desc">{phaseSpaceAnalysis.interpretiveSummary}</p>
                </div>

                <div className="banner-right-actions">
                  <div className="banner-lyapunov-badge">
                    <span className="lyapunov-label">Expoente de Lyapunov (λ):</span>
                    <strong
                      className={`lyapunov-val ${
                        phaseSpaceAnalysis.lyapunovExponentLambda > 0 ? 'text-amber' : 'text-emerald'
                      }`}
                    >
                      {phaseSpaceAnalysis.lyapunovExponentLambda > 0 ? '+' : ''}
                      {phaseSpaceAnalysis.lyapunovExponentLambda.toFixed(4)}
                    </strong>
                    <span className="lyapunov-sub">
                      {phaseSpaceAnalysis.lyapunovExponentLambda > 0
                        ? 'Divergência de trajetórias'
                        : 'Convergência a macro-atrator'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-audio-phase-hum"
                    onClick={() =>
                      CosmicAudio.playPhaseSpaceHum(
                        phaseSpaceAnalysis.shannonEntropyCurrent,
                        phaseSpaceAnalysis.lyapunovExponentLambda
                      )
                    }
                    title="Sintetizar drone harmônico binaural calibrado na entropia e estabilidade do sistema"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    <span>Ouvir Ressonância do Espaço de Fase</span>
                  </button>
                </div>
              </div>

              {/* Grid de Métricas de Shannon & Entropia */}
              <div className="phasespace-metrics-grid">
                <div className="ps-metric-card">
                  <span className="ps-metric-label">Entropia de Shannon (Baseline Alfa):</span>
                  <strong className="ps-metric-val text-cyan">
                    {phaseSpaceAnalysis.shannonEntropyBaseline.toFixed(4)} <span className="ps-unit">nats</span>
                  </strong>
                  <span className="ps-metric-sub">Distribuição informacional factual</span>
                </div>

                <div className="ps-metric-card">
                  <span className="ps-metric-label">Entropia Pós-Intervenção:</span>
                  <strong className="ps-metric-val text-amber">
                    {phaseSpaceAnalysis.shannonEntropyCurrent.toFixed(4)} <span className="ps-unit">nats</span>
                  </strong>
                  <span className="ps-metric-sub">Novo estado térmico do grafo temporal</span>
                </div>

                <div className="ps-metric-card">
                  <span className="ps-metric-label">Variação Entrópica (ΔS):</span>
                  <strong
                    className={`ps-metric-val ${
                      phaseSpaceAnalysis.entropyDelta >= 0 ? 'text-red' : 'text-emerald'
                    }`}
                  >
                    {phaseSpaceAnalysis.entropyDelta >= 0 ? '+' : ''}
                    {phaseSpaceAnalysis.entropyDelta.toFixed(4)} <span className="ps-unit">nats</span>
                  </strong>
                  <span className="ps-metric-sub">Perturbação líquida de complexidade</span>
                </div>

                <div className="ps-metric-card">
                  <span className="ps-metric-label">Divergência de Kullback-Leibler:</span>
                  <strong className="ps-metric-val text-purple">
                    {phaseSpaceAnalysis.kullbackLeiblerDivergence.toFixed(4)} <span className="ps-unit">nats</span>
                  </strong>
                  <span className="ps-metric-sub">Distância relativa D_KL(P_mod || P_alfa)</span>
                </div>
              </div>

              {/* Formulação Teórica com KaTeX */}
              <div className="phasespace-formulas-card">
                <div className="ps-formulas-header">
                  <span className="ps-formulas-badge">FUNDAMENTAÇÃO MATEMÁTICA FORMAL:</span>
                </div>
                <div className="ps-formulas-split">
                  <div className="ps-formula-box">
                    <span className="ps-formula-caption">Entropia Informacional de Shannon:</span>
                    <MathFormula math="S = - \sum_{i=1}^{n} p_i \ln(p_i)" block className="ps-katex" />
                  </div>
                  <div className="ps-formula-box">
                    <span className="ps-formula-caption">Expoente Máximo de Lyapunov:</span>
                    <MathFormula math="\lambda = \lim_{t \to \infty} \frac{1}{\Delta t} \ln\left(\frac{\delta x_t}{\delta x_0}\right)" block className="ps-katex" />
                  </div>
                  <div className="ps-formula-box">
                    <span className="ps-formula-caption">Divergência Relativa de Kullback-Leibler:</span>
                    <MathFormula math="D_{\mathrm{KL}}(P \parallel Q) = \sum_{x} P(x) \ln\left(\frac{P(x)}{Q(x)}\right)" block className="ps-katex" />
                  </div>
                </div>
              </div>

              {/* Trajetória Temporal de Espaço de Fase (S, dS/dt) */}
              <div className="phasespace-trajectory-card">
                <div className="ps-traj-header">
                  <span className="ps-traj-title">Trajetória no Espaço de Fase: Pontos (S, dS/dt)</span>
                  <span className="ps-traj-sub">Mapeamento sequencial da taxa de relaxação causal</span>
                </div>
                <div className="ps-traj-table-wrap">
                  <table className="ps-traj-table">
                    <thead>
                      <tr>
                        <th>Marco / Ano</th>
                        <th>Entropia S(t)</th>
                        <th>Taxa dS/dt</th>
                        <th>Divergência Relativa</th>
                        <th>Regime Local</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phaseSpaceAnalysis.trajectoryPoints.map((pt, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{formatHistoricalYear(pt.year)}</strong>
                          </td>
                          <td className="font-mono">{pt.entropyS.toFixed(4)} nats</td>
                          <td className="font-mono">
                            {pt.entropyRateDotS >= 0 ? '+' : ''}
                            {pt.entropyRateDotS.toFixed(4)}
                          </td>
                          <td className="font-mono">{(pt.divergenceDistance * 100).toFixed(1)}%</td>
                          <td>
                            <span
                              className={`ps-regime-tag ${
                                pt.stabilityRegime === 'ATRATOR CONVERGENTE'
                                  ? 'tag-convergent'
                                  : pt.stabilityRegime === 'DIVERGÊNCIA CAÓTICA'
                                  ? 'tag-chaotic'
                                  : 'tag-fluctuation'
                              }`}
                            >
                              {pt.stabilityRegime}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Genealogia Acadêmica & Linhagem de Mentoria */}
              {lineageNode && (
                <div className="academic-lineage-card">
                  <div className="lineage-header">
                    <div className="lineage-title-wrap">
                      <span className="lineage-kicker">GENEALOGIA ACADÊMICA & REDE DE TRANSMISSÃO EPISTÊMICA:</span>
                      <h4 className="lineage-pioneer">{lineageNode.primaryPioneer}</h4>
                      <span className="lineage-institution">{lineageNode.institution}</span>
                      <span className="lineage-school">Escola de Pensamento: <strong>{lineageNode.schoolOfThought}</strong></span>
                    </div>

                    <button
                      type="button"
                      className="btn-audio-lineage-pulse"
                      onClick={() => CosmicAudio.playLineagePulse()}
                      title="Sintetizar harmônicos trifásicos representando a linhagem e transmissão de conhecimento"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 14 14" />
                      </svg>
                      <span>Sintetizar Harmônicos de Mentoria</span>
                    </button>
                  </div>

                  {/* Cadeia Sequencial de Transmissão */}
                  <div className="lineage-chain-box">
                    <span className="chain-label">Vetor de Continuidade Conceitual:</span>
                    <div className="chain-flow-steps">
                      {lineageNode.epistemicLineageChain.map((node, cIdx) => (
                        <div key={cIdx} className="chain-step-item">
                          <span className="chain-badge">{node}</span>
                          {cIdx < lineageNode.epistemicLineageChain.length - 1 && (
                            <span className="chain-connector">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mentores e Discípulos em Colunas */}
                  <div className="lineage-mentors-split">
                    <div className="lineage-subcol">
                      <h5 className="subcol-title">Mentores e Antecessores Científicos:</h5>
                      <div className="mentors-list">
                        {lineageNode.mentors.map(m => (
                          <div key={m.id} className="mentor-item-card">
                            <div className="mentor-name-row">
                              <strong>{m.name}</strong>
                              <span className="mentor-year">{m.centuryOrYear}</span>
                            </div>
                            <span className="mentor-inst">{m.institution}</span>
                            <span className="mentor-spec">{m.specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lineage-subcol">
                      <h5 className="subcol-title">Discípulos e Sucessores Formados:</h5>
                      <div className="mentors-list">
                        {lineageNode.disciples.map(d => (
                          <div key={d.id} className="mentor-item-card disciple-card">
                            <div className="mentor-name-row">
                              <strong>{d.name}</strong>
                              <span className="mentor-year">{d.centuryOrYear}</span>
                            </div>
                            <span className="mentor-inst">{d.institution}</span>
                            <span className="mentor-spec">{d.specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====================================================================
              MODO 4: DEBATE EPISTÊMICO (DETERMINISMO VS. CONTINGÊNCIA)
              ==================================================================== */}
          {viewMode === 'debate' && analysis && targetEvent && (
            <div className="preflight-debate-view">
              {/* Banner do Debate */}
              <div className="debate-intro-banner">
                <div className="debate-banner-badge">CONFRONTO EPISTÊMICO DIALÉTICO</div>
                <h4 className="debate-banner-title">
                  Determinismo Tecnológico vs. Historiografia Contingente
                </h4>
                <p className="debate-banner-desc">
                  A evolução da ciência é uma inevitabilidade impulsionada por condições materiais e forças produtivas (Merton, Bernal), ou o produto de intuições idiossincráticas e contingências históricas singulares (Kuhn, Gould)?
                </p>
              </div>

              {/* Slider Interativo de Ponderação Historiográfica */}
              <div className="debate-slider-container">
                <div className="debate-slider-header">
                  <span className="slider-kicker">SÍNTESE HISTORIOGRÁFICA INTERATIVA:</span>
                  <div className="slider-weights-display">
                    <span className="weight-pill pill-det">
                      Determinismo: {Math.round((1 - debateWeight) * 100)}%
                    </span>
                    <span className="weight-divider">vs</span>
                    <span className="weight-pill pill-cont">
                      Contingência: {Math.round(debateWeight * 100)}%
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={debateWeight}
                  onChange={e => setDebateWeight(parseFloat(e.target.value))}
                  className="debate-interactive-range"
                  aria-label="Ponderação entre Determinismo e Contingência"
                />

                <div className="debate-range-labels">
                  <span>← Mais Determinista (Forças Materiais Inevitáveis)</span>
                  <span>Equilíbrio Dialético (50/50)</span>
                  <span>Mais Contingente (Gênio Singular & Acidente) →</span>
                </div>

                {/* Síntese Computada em Tempo Real */}
                <div className="debate-live-synthesis-card">
                  <div className="synthesis-metric">
                    <span className="synthesis-label">Retardo Histórico Ponderado (Δt):</span>
                    <strong className="synthesis-val">
                      ~{Math.max(1, Math.round(analysis.epistemicDelayYears * (0.4 + 1.2 * debateWeight)))} anos
                    </strong>
                    <span className="synthesis-sub">
                      (Padrão determinístico: ~{Math.round(analysis.epistemicDelayYears * 0.4)} anos | Padrão contingente: ~{Math.round(analysis.epistemicDelayYears * 1.6)} anos)
                    </span>
                  </div>

                  <div className="synthesis-metric">
                    <span className="synthesis-label">Regime Causal Ponderado:</span>
                    <strong
                      className={`synthesis-status ${
                        debateWeight < 0.4 ? 'text-emerald' : debateWeight > 0.6 ? 'text-red' : 'text-amber'
                      }`}
                    >
                      {debateWeight < 0.4
                        ? 'Rápida Reemergência Colegiada (Macro-Atrator Estável)'
                        : debateWeight > 0.6
                        ? 'Bifurcação Aberta Irreversível (Sensibilidade Extrema)'
                        : 'Equilíbrio Metaestável (Transição Concorrente)'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Colunas Opostas dos Especialistas */}
              <div className="debate-columns-split">
                {/* Coluna 1: Determinismo Tecnológico (Prof. Alistair Pendelton) */}
                <div className="debate-column col-determinism">
                  <div className="col-author-header">
                    <div className="author-avatar-badge badge-det">DET</div>
                    <div>
                      <h5 className="author-name">Prof. Alistair Pendelton</h5>
                      <span className="author-role">Cátedra de História & Filosofia da Ciência, Cambridge</span>
                      <span className="author-school">Escola: Materialismo Dialético & Determinismo Tecnológico</span>
                    </div>
                  </div>

                  <div className="thesis-card">
                    <h6 className="thesis-title">Tese da Inevitabilidade Material:</h6>
                    <p className="thesis-body">
                      "A anulação de '{targetEvent.title}' ({formatHistoricalYear(targetEvent.year)}) perturba a cronologia momentaneamente, mas <strong>não anula o vetor de progresso</strong>. Descobertas científicas são propriedades emergentes de condições materiais: instrumentos de precisão, redes de correspondência e necessidades industriais. O fenômeno de <em>descobertas múltiplas simultâneas</em> (como Darwin e Wallace na seleção natural, ou Newton e Leibniz no cálculo) comprova que o conhecimento estava prestes a brotar."
                    </p>
                  </div>

                  <div className="thesis-evidence-box">
                    <span className="evidence-title">Evidências Primárias Invocadas:</span>
                    <ul className="evidence-list">
                      <li>Robert K. Merton (1961) — <em>'Singletons and Multiples in Scientific Discovery'</em>.</li>
                      <li>John Desmond Bernal (1939) — <em>'The Social Function of Science'</em>.</li>
                      <li>Convergência simultânea de Poincaré e Lorentz antes da publicação de 1905.</li>
                    </ul>
                  </div>

                  <div className="thesis-action-row">
                    <button
                      type="button"
                      className="btn-debate-ask"
                      onClick={() => {
                        setInquirySpecialistId('pendelton');
                        handleAskSpecialist(
                          `Prof. Pendelton, qual cientista contemporâneo teria descoberto '${targetEvent.title}' caso ele não existisse?`
                        );
                        setViewMode('dossier');
                      }}
                    >
                      Interrogar Prof. Pendelton sobre Substitutos Contemporâneos
                    </button>
                  </div>
                </div>

                {/* Coluna 2: Contingência Histórica (Dr. Elena Mendoza) */}
                <div className="debate-column col-contingency">
                  <div className="col-author-header">
                    <div className="author-avatar-badge badge-cont">CONT</div>
                    <div>
                      <h5 className="author-name">Dr. Elena Mendoza</h5>
                      <span className="author-role">Centro de Estudos Avançados de Causalidade Histórica, Heidelberg</span>
                      <span className="author-school">Escola: Historiografia Contingente & Saltos Paradigmáticos</span>
                    </div>
                  </div>

                  <div className="thesis-card">
                    <h6 className="thesis-title">Tese da Fragilidade Contingente:</h6>
                    <p className="thesis-body">
                      "Reduzir '{targetEvent.title}' a um subproduto mecânico da época é uma ilusão teleológica de <em>inevitabilidade retrospectiva</em>. Saltos conceituais genuínos dependem de sínteses cognitivas raras, idiossincrasias metafísicas e acidentes biográficos irrepetíveis. Se este marco for suprimido, a comunidade científica poderia ter permanecido satisfeita com o modelo prévio por décadas a fio."
                    </p>
                  </div>

                  <div className="thesis-evidence-box">
                    <span className="evidence-title">Evidências Primárias Invocadas:</span>
                    <ul className="evidence-list">
                      <li>Thomas S. Kuhn (1962) — <em>'The Structure of Scientific Revolutions'</em>.</li>
                      <li>Stephen Jay Gould (1989) — <em>'Wonderful Life & Historical Contingency'</em>.</li>
                      <li>Inércia paradigmática da teoria do calórico e do éter luminífero no século XIX.</li>
                    </ul>
                  </div>

                  <div className="thesis-action-row">
                    <button
                      type="button"
                      className="btn-debate-ask"
                      onClick={() => {
                        setInquirySpecialistId('mendoza');
                        handleAskSpecialist(
                          `Dr. Mendoza, por que a comunidade científica não preencheria a lacuna de '${targetEvent.title}' imediatamente?`
                        );
                        setViewMode('dossier');
                      }}
                    >
                      Interrogar Dra. Mendoza sobre a Fragilidade do Paradigma
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Fixo com Todas as Ações */}
        <div className="modal-footer preflight-footer">
          <button type="button" className="btn-secondary" onClick={() => setPreflightImpact(null)}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-branch-beta"
            onClick={handleBranchAlternateTimeline}
            title="Criar uma dimensão alternativa com o nó de redescoberta tardia projetada pelos historiadores"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
            <span>Bifurcar Linha Temporal (Beta)</span>
          </button>
          <button type="button" className="btn-secondary" onClick={handleApplyDirectly}>
            Aplicar Imediatamente
          </button>
          <button type="button" className="btn-primary-glow" onClick={handleApplyWithReplay}>
            Aplicar com Replay Causal
          </button>
        </div>
      </div>
    </div>
  );
}
