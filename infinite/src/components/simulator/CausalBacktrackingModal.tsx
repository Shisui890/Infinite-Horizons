import { useState, useMemo, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import {
  CausalBacktrackingEngine,
  type PresetBacktrackingGoal,
  type CausalBacktrackingPlan,
} from '../../engine/CausalBacktrackingEngine';
import { AITemporalService, type AIEpistemicAudit } from '../../engine/AITemporalService';
import { formatHistoricalYear } from '../../utils/formatters';
import MathFormula, { InlineMathText } from '../MathFormula';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CausalBacktrackingModal({ isOpen, onClose }: Props) {
  const { universeState, setUniverseState, setActiveDimensionId } = useSimulationStore();
  const universe = universeState.universe;

  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    CausalBacktrackingEngine.PRESET_GOALS[0].id
  );
  const [customTitle, setCustomTitle] = useState('');
  const [customYear, setCustomYear] = useState<number>(1940);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Estados da Auditoria Epistêmica & Rigor Científico por IA
  const [showAiAudit, setShowAiAudit] = useState(false);
  const [aiAudit, setAiAudit] = useState<AIEpistemicAudit | null>(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [inquiryQuestion, setInquiryQuestion] = useState('');
  const [inquiryAnswer, setInquiryAnswer] = useState<string | null>(null);
  const [isLoadingInquiry, setIsLoadingInquiry] = useState(false);

  const selectedPreset: PresetBacktrackingGoal | undefined = useMemo(
    () => CausalBacktrackingEngine.PRESET_GOALS.find(g => g.id === selectedPresetId),
    [selectedPresetId]
  );

  const currentPlan: CausalBacktrackingPlan = useMemo(() => {
    if (isCustomMode && customTitle.trim()) {
      return CausalBacktrackingEngine.solveBacktrackingPlan(
        universe,
        customTitle.trim(),
        customYear,
        2000
      );
    }
    const preset = selectedPreset || CausalBacktrackingEngine.PRESET_GOALS[0];
    return CausalBacktrackingEngine.solveBacktrackingPlan(
      universe,
      preset.title,
      preset.desiredYear,
      preset.originalYear
    );
  }, [universe, isCustomMode, customTitle, customYear, selectedPreset]);

  // Sincroniza e reseta auditoria quando o plano mudar
  useEffect(() => {
    setAiAudit(null);
    setInquiryAnswer(null);
  }, [currentPlan]);

  async function handleToggleAiAudit() {
    if (showAiAudit) {
      setShowAiAudit(false);
      return;
    }
    setShowAiAudit(true);
    if (!aiAudit) {
      setIsLoadingAudit(true);
      try {
        const audit = await AITemporalService.auditBacktrackingWithAI(currentPlan);
        setAiAudit(audit);
      } finally {
        setIsLoadingAudit(false);
      }
    }
  }

  async function handleAskBypass(questionToAsk?: string) {
    const q = (questionToAsk || inquiryQuestion).trim();
    if (!q) return;
    setIsLoadingInquiry(true);
    try {
      const answer = await AITemporalService.consultAIBacktrackingBypass(q, currentPlan);
      setInquiryAnswer(answer);
      setInquiryQuestion('');
    } finally {
      setIsLoadingInquiry(false);
    }
  }

  if (!isOpen) return null;

  function handleApplyAcceleration() {
    const { newDimension, newEdges } = CausalBacktrackingEngine.generateAcceleratedDimension(
      universe,
      currentPlan
    );

    const logEntry = {
      id: `log-backtracking-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      message: `[ENGENHARIA REVERSA] Gerada linha retrocausal "${newDimension.designation}" viabilizando "${currentPlan.targetTitle}" em ${formatHistoricalYear(currentPlan.targetDesiredYear)}.`,
      type: 'success' as const,
    };

    setUniverseState(prev => ({
      ...prev,
      universe: {
        ...prev.universe,
        dimensions: [...prev.universe.dimensions, newDimension],
        edges: [...prev.universe.edges, ...newEdges],
        updatedAt: Date.now(),
      },
      logs: [logEntry, ...prev.logs],
    }));

    setActiveDimensionId(newDimension.id);
    onClose();
  }

  return (
    <div className="modal-overlay sim-modal-overlay">
      <div className="modal-card backtracking-modal" role="dialog" aria-modal="true">
        {/* Header Fixo */}
        <div className="modal-header backtracking-header">
          <div className="modal-title-group">
            <div className="backtracking-icon-glow-wrap">
              <span className="backtracking-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 8 14" />
                  <path d="M4 12a8 8 0 0 1 8-8" strokeDasharray="3 3" />
                </svg>
              </span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700, letterSpacing: '-0.01em' }}>
                  Engenharia Reversa Histórica
                </h3>
                <span className="bt-tech-badge">SOLVER RETROCAUSAL v2.5</span>
              </div>
              <p className="modal-subtitle" style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Cálculo determinístico das cadeias causais necessárias para antecipar marcos tecnológicos no passado
              </p>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Fechar modal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corpo com Scrollbar Independente */}
        <div className="backtracking-body">
          {/* Seletor de Metas Pré-definidas */}
          <div className="backtracking-target-picker">
            <div className="picker-header-row">
              <div className="picker-title-wrap">
                <span className="picker-dot" />
                <span className="picker-label">SELECIONE O OBJETIVO CONTRAFACTUAL A ANTECIPAR:</span>
              </div>
              <button
                type="button"
                className="btn-toggle-custom"
                onClick={() => setIsCustomMode(!isCustomMode)}
              >
                {isCustomMode ? 'Usar Metas Acadêmicas Padrão' : '+ Definir Meta Personalizada'}
              </button>
            </div>

            {!isCustomMode ? (
              <div className="preset-goals-grid">
                {CausalBacktrackingEngine.PRESET_GOALS.map(goal => {
                  const isSelected = selectedPresetId === goal.id;
                  const shift = goal.originalYear - goal.desiredYear;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      className={`preset-goal-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedPresetId(goal.id)}
                    >
                      <div className="goal-card-top">
                        <span className="goal-domain-badge">{goal.domain}</span>
                        <div className="goal-year-badge">
                          <span className="goal-status-dot" />
                          <span>META: <strong>{formatHistoricalYear(goal.desiredYear)}</strong></span>
                        </div>
                      </div>
                      <h5 className="goal-card-title">{goal.title}</h5>
                      <p className="goal-card-desc">{goal.description}</p>
                      <div className="goal-card-footer">
                        <span className="goal-shift-tag">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="1 4 1 10 7 10" />
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                          </svg>
                          Salto de {shift} anos ({formatHistoricalYear(goal.originalYear)} → {formatHistoricalYear(goal.desiredYear)})
                        </span>
                        <span className={`goal-indicator-pill ${isSelected ? 'selected' : ''}`}>
                          {isSelected ? 'Ativo' : 'Selecionar'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="custom-goal-form">
                <div className="custom-input-group">
                  <label htmlFor="custom-target-title">Nome do Marco ou Descoberta Científica:</label>
                  <input
                    id="custom-target-title"
                    type="text"
                    value={customTitle}
                    placeholder="Ex: Teoria Unificada de Campos / Fusão Nuclear Controlada"
                    onChange={e => setCustomTitle(e.target.value)}
                  />
                </div>
                <div className="custom-input-group year-group">
                  <label htmlFor="custom-target-year">Ano Desejado:</label>
                  <input
                    id="custom-target-year"
                    type="number"
                    value={customYear}
                    onChange={e => setCustomYear(parseInt(e.target.value) || 1900)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Resumo Métrico do Plano */}
          <div className="backtracking-metrics-grid">
            <div className="bt-metric-card">
              <div className="bt-metric-card-header">
                <span className="bt-metric-label">Antecipação Causal Total</span>
                <span className="bt-metric-icon-wrap text-emerald">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
              </div>
              <strong className="bt-metric-val text-emerald">
                {currentPlan.totalShiftYears} <span className="bt-metric-unit">anos</span>
              </strong>
              <span className="bt-metric-sub">salto em relação à cronologia factual</span>
            </div>

            <div className="bt-metric-card">
              <div className="bt-metric-card-header">
                <span className="bt-metric-label">Índice de Viabilidade Factual</span>
                <span className="bt-metric-icon-wrap text-cyan">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </span>
              </div>
              <strong className="bt-metric-val text-cyan">
                {currentPlan.overallFeasibilityScore}<span className="bt-metric-unit">%</span>
              </strong>
              <div className="bt-feasibility-bar-track">
                <div
                  className="bt-feasibility-bar-fill"
                  style={{ width: `${currentPlan.overallFeasibilityScore}%` }}
                />
              </div>
              <span className="bt-metric-sub">baseado em disponibilidade de materiais</span>
            </div>

            <div className="bt-metric-card">
              <div className="bt-metric-card-header">
                <span className="bt-metric-label">Pré-requisitos Críticos</span>
                <span className="bt-metric-icon-wrap text-purple">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </span>
              </div>
              <strong className="bt-metric-val text-purple">
                {currentPlan.prerequisiteSteps.length} <span className="bt-metric-unit">nós</span>
              </strong>
              <span className="bt-metric-sub">marcos a acelerar no passado</span>
            </div>
          </div>

          {/* Gargalo Matemático e Teórico */}
          <div className="backtracking-bottleneck-card">
            <div className="bottleneck-header">
              <div className="bottleneck-title-row">
                <span className="bottleneck-indicator-dot" />
                <span className="bottleneck-tag">EQUAÇÃO RESTRITIVA DE GARGALO FÍSICO</span>
              </div>
              <span className="bottleneck-sub-tag">MODELO ANALÍTICO FORMAL</span>
            </div>
            <div className="bottleneck-formula-box">
              <MathFormula math={currentPlan.primaryBottleneckFormula} block className="eq-formula-katex" />
            </div>
            <div className="bottleneck-explanation-text">
              <InlineMathText text={currentPlan.bottleneckExplanation} />
            </div>
            <div className="pioneers-list">
              <span className="pioneers-label">Pioneiros Históricos Capacitados a Liderar a Transição:</span>
              <div className="pioneers-chips">
                {currentPlan.pioneerCandidates.map((pioneer, idx) => (
                  <span key={idx} className="pioneer-chip">
                    <span className="pioneer-avatar-dot" />
                    <span>{pioneer}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Seção de Auditoria Epistêmica & Rigor Científico por IA */}
          <div className="backtracking-ai-audit-wrapper">
            <button
              type="button"
              className={`btn-toggle-ai-audit ${showAiAudit ? 'active' : ''}`}
              onClick={handleToggleAiAudit}
              title="Executar verificação com comitê de física de partículas e história da ciência"
            >
              <span className="ai-audit-btn-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <span>Auditoria Epistêmica por IA (Rigor Científico & Fontes Primárias)</span>
              </span>
              <span className="ai-audit-status-badge">
                {showAiAudit ? 'Ocultar Auditoria' : 'Consultar Comitê IA'}
              </span>
            </button>

            {showAiAudit && (
              <div className="ai-audit-content-card">
                {isLoadingAudit ? (
                  <div className="ai-audit-loading">
                    <span className="loading-pulse-dot" />
                    <span>Convocando comitê de pares e cruzando arquivos históricos...</span>
                  </div>
                ) : aiAudit ? (
                  <div className="ai-audit-inner">
                    <div className="audit-verdict-row">
                      <div className="verdict-badge-wrap">
                        <span className={`audit-verdict-pill verdict-${aiAudit.verdict}`}>
                          {aiAudit.verdictLabel}
                        </span>
                        <span className="audit-score-pill">
                          Rigor: <strong>{aiAudit.verdictScore}%</strong>
                        </span>
                      </div>
                      <span className="audit-lorentz-tag">
                        {aiAudit.lorentzInvarianceCheck}
                      </span>
                    </div>

                    <div className="audit-thermo-box">
                      <div className="thermo-header">
                        <span className="thermo-title">RESTRIÇÃO TERMODINÂMICA & ENTROPIA:</span>
                        <span className="thermo-sub">2ª Lei da Termodinâmica</span>
                      </div>
                      <div className="thermo-formula">
                        <MathFormula math={aiAudit.entropyDeltaFormula} block className="eq-formula-katex" />
                      </div>
                      <div className="thermo-explanation">
                        <InlineMathText text={aiAudit.thermodynamicAssessment} />
                      </div>
                    </div>

                    <div className="audit-hurdles-box">
                      <span className="hurdles-title">Gargalos de Materiais & Tolerâncias Industriais:</span>
                      <div className="hurdles-grid">
                        {aiAudit.materialHurdles.map((h, hIdx) => (
                          <div key={hIdx} className="hurdle-card">
                            <div className="hurdle-top">
                              <strong className="hurdle-name">{h.material}</strong>
                              <span className="hurdle-year">Disponível em: {formatHistoricalYear(h.historicalAvailabilityYear)}</span>
                            </div>
                            <span className="hurdle-spec"><strong>Exigência:</strong> {h.requiredPurityOrTolerance}</span>
                            <span className="hurdle-feasibility"><strong>Viabilidade Acelerada:</strong> {h.acceleratedFeasibility}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="audit-sources-box">
                      <span className="sources-title">Tratados e Artigos Científicos Primários (Revisão por Pares):</span>
                      <div className="sources-list">
                        {aiAudit.primaryAcademicSources.map((s, sIdx) => (
                          <div key={sIdx} className="source-item">
                            <span className="source-dot" />
                            <div className="source-meta">
                              <strong>{s.author} ({formatHistoricalYear(s.year)})</strong>. <em>"{s.title}"</em>. {s.journalOrInstitution}.
                              <span className="source-doi">{s.doiOrCitation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="audit-inquiry-box">
                      <span className="inquiry-box-title">Consultar Especialista de IA sobre Métodos de Época:</span>
                      <div className="inquiry-chips-row">
                        <button
                          type="button"
                          className="chip-inquiry-quick"
                          onClick={() => handleAskBypass('Como contornar a falta de semicondutores e silício de alta pureza?')}
                        >
                          Contornar falta de semicondutores
                        </button>
                        <button
                          type="button"
                          className="chip-inquiry-quick"
                          onClick={() => handleAskBypass('Como atingir vácuo ultra-alto e criogenia sem equipamentos modernos?')}
                        >
                          Vácuo e criogenia com tecnologia de época
                        </button>
                        <button
                          type="button"
                          className="chip-inquiry-quick"
                          onClick={() => handleAskBypass('Existe risco de violação de causalidade ou curva fechada tipo-tempo?')}
                        >
                          Causalidade e curvas fechadas (CTCs)
                        </button>
                      </div>

                      <div className="inquiry-input-row">
                        <input
                          type="text"
                          className="ai-inquiry-input"
                          placeholder="Ex: Como os cientistas poderiam purificar o material usando métodos do período?"
                          value={inquiryQuestion}
                          onChange={e => setInquiryQuestion(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAskBypass();
                          }}
                        />
                        <button
                          type="button"
                          className="btn-ask-ai-bypass"
                          onClick={() => handleAskBypass()}
                          disabled={isLoadingInquiry || !inquiryQuestion.trim()}
                        >
                          {isLoadingInquiry ? 'Consultando...' : 'Perguntar'}
                        </button>
                      </div>

                      {inquiryAnswer && (
                        <div className="ai-inquiry-answer-box">
                          <div className="answer-header">
                            <span className="answer-pill">PARECER TÉCNICO DO ESPECIALISTA</span>
                          </div>
                          <div className="answer-text">
                            <InlineMathText text={inquiryAnswer} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Cronograma de Aceleração dos Pré-Requisitos */}
          <div className="backtracking-steps-container">
            <div className="steps-header">
              <div className="steps-header-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <strong>Cadeia Reversa de Aceleração de Pré-Requisitos</strong>
              </div>
              <span className="steps-header-count">
                {currentPlan.prerequisiteSteps.length} etapas sequenciais calculadas
              </span>
            </div>

            <div className="steps-cards-list">
              {currentPlan.prerequisiteSteps.map((step, idx) => (
                <div key={idx} className="step-card">
                  <div className="step-card-top">
                    <div className="step-badge-wrap">
                      <span className="step-number-pill">ETAPA 0{idx + 1}</span>
                      <h5 className="step-title">{step.originalTitle}</h5>
                    </div>
                    <div className="step-years-range">
                      <span className="year-orig">Original: <strong>{formatHistoricalYear(step.originalYear)}</strong></span>
                      <span className="year-arrow">→</span>
                      <span className="year-acc">Acelerado: <strong>{formatHistoricalYear(step.requiredAcceleratedYear)}</strong></span>
                    </div>
                  </div>
                  <div className="step-catalyst">
                    <strong>Catalisador Histórico Exigido:</strong> <InlineMathText text={step.historicalCatalyst} />
                  </div>
                  <div className="step-prereqs-box">
                    <span className="prereqs-title">Demandas Técnicas e Materiais:</span>
                    <div className="prereqs-badges">
                      {step.technologicalPrerequisites.map((req, rIdx) => (
                        <span key={rIdx} className="prereq-badge">{req}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="modal-footer backtracking-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-primary-glow btn-apply-backtracking" onClick={handleApplyAcceleration}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 8 14" />
            </svg>
            <span>Gerar Linha Temporal Acelerada ({formatHistoricalYear(currentPlan.targetDesiredYear)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
