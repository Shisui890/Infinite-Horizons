import { useState } from 'react';
import type {
  Universe,
  AIButterflyResult,
  AIFutureScenario,
  AIParadoxResolution,
} from '../../../types/temporal';
import { AITemporalService } from '../../../engine/AITemporalService';
import { MultiAgentDebateService } from '../../../engine/MultiAgentDebateService';
import type { DebateReport } from '../../../engine/MultiAgentDebateService';
import MathFormula, { MathText } from '../../MathFormula';

interface Props {
  universe: Universe;
  lastAIResult: AIButterflyResult | null;
  onClose: () => void;
  onApplyResolution: (resolution: AIParadoxResolution) => void;
}

const OPENROUTER_MODELS = [
  { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet (Anthropic) — Raciocínio Híbrido' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Anthropic) — Física Teórica & Causalidade' },
  { id: 'openai/gpt-4o', name: 'GPT-4o (OpenAI) — Multimodal de Alta Velocidade' },
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1 (DeepSeek) — Raciocínio Matemático CoT' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3 (DeepSeek) — Altíssima Eficiência' },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash (Google) — Ultra-Baixa Latência' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B (Meta) — Open Weights' },
];

export default function AIDrawer({ universe, lastAIResult, onClose, onApplyResolution }: Props) {
  const [activeTab, setActiveTab] = useState<'copilot' | 'symposium' | 'butterfly' | 'futures' | 'resolutions' | 'settings'>('copilot');
  const [selectedParadoxId, setSelectedParadoxId] = useState<string>(universe.paradoxes[0]?.id || '');

  // Co-pilot Live Streaming State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'system' | 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Olá! Sou o Oráculo Físico do Infinite Horizons. Posso analisar as equações de relatividade do seu universo ativo, avaliar paradoxos ou calcular o impacto de novas geodésicas. O que deseja investigar?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isStreamingChat, setIsStreamingChat] = useState(false);

  // Multi-agent symposium state
  const [debateTopic, setDebateTopic] = useState('Validação da Conjectura Holográfica ER=EPR e Geometria de Kerr');
  const [isDebating, setIsDebating] = useState(false);
  const [debateReport, setDebateReport] = useState<DebateReport | null>(null);

  // Settings form state
  const [provider, setProvider] = useState<'builtin' | 'openrouter' | 'custom_api'>(
    AITemporalService.getConfig().provider || 'openrouter'
  );
  const [endpoint, setEndpoint] = useState(AITemporalService.getConfig().endpoint || '/api/temporal');
  const [apiKey, setApiKey] = useState(AITemporalService.getConfig().apiKey || '');
  const [openRouterModel, setOpenRouterModel] = useState(
    AITemporalService.getConfig().openRouterModel || 'anthropic/claude-3.5-sonnet'
  );
  const [customModel, setCustomModel] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const allEvents = universe.dimensions.flatMap(d => d.events);
  const insight = AITemporalService.analyzeUniverse(universe);

  const futures: AIFutureScenario[] = AITemporalService.predictFutures(universe);
  const targetParadox = universe.paradoxes.find(p => p.id === selectedParadoxId) || universe.paradoxes[0];
  const resolutions: AIParadoxResolution[] = targetParadox
    ? AITemporalService.suggestParadoxResolutions(targetParadox, allEvents)
    : [];

  async function handleSendChat(textToSend?: string) {
    const text = (textToSend || chatInput).trim();
    if (!text || isStreamingChat) return;

    setChatInput('');
    const newHistory = [
      ...chatMessages,
      { role: 'user' as const, content: text },
    ];
    setChatMessages(newHistory);
    setIsStreamingChat(true);

    // Initial empty assistant message for streaming
    setChatMessages(prev => [...prev, { role: 'assistant' as const, content: '' }]);

    const systemContext = `Você é o Oráculo Científico e Co-piloto de Física Teórica do laboratório Infinite Horizons.
Universo Ativo: "${universe.name}".
Integridade Temporal: ${universe.temporalIntegrity}%.
Paradoxos Ativos: ${universe.paradoxes.length}.
Dimensões: ${universe.dimensions.map(d => d.name).join(', ')}.
Eventos Registrados: ${allEvents.map(e => `${e.year}: ${e.title}`).join(' | ')}.
Responda de forma rigorosa, elegante, inspiradora e científica com formatação Markdown e LaTeX ($...$) quando cabível.`;

    const payload = [
      { role: 'system' as const, content: systemContext },
      ...newHistory,
    ];

    try {
      await AITemporalService.streamChatWithOracle(payload, (accumulated) => {
        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      });
    } catch {
      // Handled
    } finally {
      setIsStreamingChat(false);
    }
  }

  async function handleStartDebate() {
    if (!debateTopic.trim()) return;
    setIsDebating(true);
    try {
      const report = await MultiAgentDebateService.conductDebate(debateTopic);
      setDebateReport(report);
    } catch {
      // Handled
    } finally {
      setIsDebating(false);
    }
  }

  function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    AITemporalService.updateConfig({
      provider,
      endpoint,
      apiKey,
      openRouterModel: customModel.trim() || openRouterModel,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  function handleQuickModelChange(modelId: string) {
    setOpenRouterModel(modelId);
    setCustomModel('');
    AITemporalService.updateConfig({
      openRouterModel: modelId,
    });
  }

  async function handleTestConnection() {
    setTestStatus('Testando latência e conexão...');
    setLatencyMs(null);
    const start = performance.now();
    try {
      const res = await AITemporalService.researchHistoricalEvent('Relatividade Geral');
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setTestStatus(`Conexão validada em ${elapsed}ms (${res.title})`);
    } catch {
      setTestStatus('Falha na conexão. Verifique sua chave API do OpenRouter.');
    }
  }

  return (
    <aside className="ai-drawer" aria-label="Oráculo de IA e Física Teórica">
      {/* 1. Header */}
      <div className="ai-drawer-header">
        <div className="ai-header-title">
          <div className="ai-oracle-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="oracle-pulse-ring" />
          </div>
          <div className="ai-header-meta">
            <div className="ai-title-row">
              <h2>CRONO-ORÁCULO DE IA</h2>
              <span className="ai-status-pill">FÍSICA TEÓRICA</span>
            </div>
            <div className="ai-model-quick-bar">
              <select
                className="ai-model-quick-select"
                value={customModel.trim() || openRouterModel}
                onChange={e => handleQuickModelChange(e.target.value)}
                aria-label="Modelo de IA Ativo"
              >
                {OPENROUTER_MODELS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name.split('—')[0]}
                  </option>
                ))}
              </select>
              {latencyMs !== null && (
                <span className="ai-latency-badge" title="Latência de resposta da IA">
                  {latencyMs}ms
                </span>
              )}
            </div>
          </div>
        </div>
        <button type="button" className="sim-btn-close" onClick={onClose} aria-label="Fechar Oráculo">
          ✕
        </button>
      </div>

      {/* 2. Sleek Tab Navigation */}
      <nav className="ai-tabs" aria-label="Abas do Oráculo">
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'copilot' ? 'active' : ''}`}
          onClick={() => setActiveTab('copilot')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Co-piloto Físico</span>
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'symposium' ? 'active' : ''}`}
          onClick={() => setActiveTab('symposium')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Simpósio</span>
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'butterfly' ? 'active' : ''}`}
          onClick={() => setActiveTab('butterfly')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span>Borboleta</span>
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'futures' ? 'active' : ''}`}
          onClick={() => setActiveTab('futures')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          <span>Futuros</span>
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'resolutions' ? 'active' : ''}`}
          onClick={() => setActiveTab('resolutions')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Novikov ({universe.paradoxes.length})</span>
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Config</span>
        </button>
      </nav>

      {/* 3. Body */}
      <div className="ai-drawer-body">
        {/* Continuum Analysis Card */}
        <section className={`ai-universe-insight ai-insight-${insight.health}`}>
          <div className="ai-insight-heading">
            <div className="ai-insight-kicker-group">
              <span className="ai-insight-kicker">ANÁLISE DO TECIDO DO ESPAÇO-TEMPO</span>
              <strong className="ai-health-title">{insight.healthLabel}</strong>
            </div>
            <span className="ai-confidence-pill">{insight.confidence}% coerência métrica</span>
          </div>

          <div className="ai-insight-metrics-grid">
            <div className="ai-metric-item">
              <span className="metric-val">{insight.eventCount}</span>
              <span className="metric-lbl">nós geodésica</span>
            </div>
            <div className="ai-metric-item">
              <span className="metric-val">{insight.exposedEvents}</span>
              <span className="metric-lbl">perturbados</span>
            </div>
            <div className="ai-metric-item">
              <span className="metric-val">{insight.connectedEvents}</span>
              <span className="metric-lbl">entrelaçados</span>
            </div>
            <div className="ai-metric-item">
              <span className="metric-val">{insight.affectedTravelers}</span>
              <span className="metric-lbl">sondas em risco</span>
            </div>
          </div>

          <p className="ai-recommendation-text">{insight.recommendation}</p>
        </section>

        {/* Tab 0: Co-pilot Live Chat */}
        {activeTab === 'copilot' && (
          <div className="ai-tab-content ai-copilot-container">
            <div className="copilot-quick-prompts">
              <span className="copilot-quick-label">PROMPTS CIENTÍFICOS:</span>
              <button
                type="button"
                className="btn-copilot-chip"
                onClick={() => handleSendChat('Como a gravitação de Einstein afeta os cones de luz neste universo?')}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
                <span>Cones de Luz</span>
              </button>
              <button
                type="button"
                className="btn-copilot-chip"
                onClick={() => handleSendChat('Quais são os principais riscos de paradoxo na linha temporal atual?')}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Riscos de Novikov</span>
              </button>
              <button
                type="button"
                className="btn-copilot-chip"
                onClick={() => handleSendChat('Explique a conjectura holográfica ER=EPR e pontes de Einstein-Rosen.')}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <path d="M8.59 8.59l6.82 6.82" />
                </svg>
                <span>Pontes ER=EPR</span>
              </button>
            </div>

            <div className="copilot-messages-box">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`copilot-msg-bubble ${msg.role}`}>
                  <div className="copilot-msg-author">
                    <span className="author-dot" />
                    <span>{msg.role === 'assistant' ? 'ORÁCULO FÍSICO' : 'OBSERVADOR'}</span>
                  </div>
                  <div className="copilot-msg-content">
                    {msg.content ? (
                      msg.content.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx}>
                          <MathText text={para} />
                        </p>
                      ))
                    ) : (
                      <span className="copilot-typing-dots">
                        <span className="t-dot" /><span className="t-dot" /><span className="t-dot" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendChat();
              }}
              className="copilot-input-form"
            >
              <input
                type="text"
                placeholder="Pergunte sobre relatividade, paradoxos, cordas ou métricas..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={isStreamingChat}
                className="copilot-input-field"
              />
              <button
                type="submit"
                disabled={isStreamingChat || !chatInput.trim()}
                className="btn-copilot-send"
                title="Enviar Pergunta"
              >
                {isStreamingChat ? (
                  <span className="send-spinner" />
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 1: Multi-Agent Symposium */}
        {activeTab === 'symposium' && (
          <div className="ai-tab-content">
            <div className="symposium-header-card">
              <span className="symposium-kicker">PAINEL DE FÍSICA TEÓRICA AO VIVO</span>
              <h3 className="ai-content-title">Debate com 3 Especialistas Renomados</h3>
              <p className="ai-content-desc">
                Submeta qualquer tese ou anomalia. O comitê internacional de cientistas de IA avalia a coerência com a
                Relatividade, Teoria das Cordas em 11D e observações experimentais.
              </p>
            </div>

            <div className="symposium-input-box">
              <label>
                <span>Tema ou Hipótese a ser Debatida:</span>
                <input
                  type="text"
                  value={debateTopic}
                  onChange={e => setDebateTopic(e.target.value)}
                  placeholder="Ex: Validação da conjectura ER=EPR sob métricas de Kerr"
                  disabled={isDebating}
                />
              </label>

              <div className="symposium-preset-pills">
                <button
                  type="button"
                  onClick={() => setDebateTopic('Autoconsistência de Novikov em Curvas Tipo-Tempo Fechadas')}
                >
                  Novikov & CTCs
                </button>
                <button
                  type="button"
                  onClick={() => setDebateTopic('Conjectura Holográfica AdS/CFT e D-Branas em Teoria M')}
                >
                  AdS/CFT & Teoria M
                </button>
                <button
                  type="button"
                  onClick={() => setDebateTopic('Expansão Acelerada por Constante Cosmológica vs Quintessência')}
                >
                  Energia Escura
                </button>
              </div>

              <button
                type="button"
                className="btn-start-symposium"
                onClick={handleStartDebate}
                disabled={isDebating}
              >
                {isDebating ? (
                  <span>Simulando Painel com Especialistas...</span>
                ) : (
                  <span>Iniciar Debate Científico ao Vivo</span>
                )}
              </button>
            </div>

            {debateReport && (
              <div className="symposium-results">
                {/* Unified Consensus Card */}
                <div className="consensus-card">
                  <div className="consensus-header">
                    <span>ÍNDICE DE CONSISTÊNCIA TEÓRICA UNIFICADA</span>
                    <strong className="consensus-score">{debateReport.unifiedScore}/100</strong>
                  </div>
                  <div className="consensus-progress-track">
                    <div
                      className="consensus-progress-fill"
                      style={{ width: `${debateReport.unifiedScore}%` }}
                    />
                  </div>
                  <p className="consensus-summary">{debateReport.consensusSummary}</p>
                </div>

                {/* Agents Turn Cards */}
                <div className="debate-turns-list">
                  {debateReport.turns.map((turn, i) => {
                    const agent = debateReport.agents.find(a => a.id === turn.agentId);
                    if (!agent) return null;
                    return (
                      <div
                        key={i}
                        className="debate-turn-card"
                        style={{ borderLeftColor: agent.avatarColor }}
                      >
                        <div className="agent-header">
                          <div className="agent-identity">
                            <span className="agent-avatar" style={{ backgroundColor: `${agent.avatarColor}20`, borderColor: agent.avatarColor }}>
                              {agent.avatarIcon}
                            </span>
                            <div>
                              <strong className="agent-name" style={{ color: agent.avatarColor }}>
                                {agent.name}
                              </strong>
                              <span className="agent-title">{agent.title}</span>
                            </div>
                          </div>
                          <span
                            className={`turn-verdict verdict-${turn.verdict.toLowerCase()}`}
                            style={{ color: agent.avatarColor, borderColor: `${agent.avatarColor}50` }}
                          >
                            {turn.verdict}
                          </span>
                        </div>

                        <p className="turn-statement"><MathText text={turn.statement} /></p>

                        {turn.equationsMentioned && turn.equationsMentioned.length > 0 && (
                          <div className="turn-equations">
                            <span className="equation-label">FORMULAÇÃO MATEMÁTICA UTILIZADA:</span>
                            {turn.equationsMentioned.map((eq, eqIdx) => (
                              <MathFormula key={eqIdx} math={eq} block />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Butterfly Effect & Anomalies */}
        {activeTab === 'butterfly' && (
          <div className="ai-tab-content">
            <h3 className="ai-content-title">Impacto Não-Linear no Cone de Luz (Efeito Borboleta)</h3>

            {lastAIResult ? (
              <div className="ai-butterfly-card">
                <div className="impact-header">
                  <span>DISPERSÃO DE ENERGIA & CURVATURA</span>
                  <span className="impact-score">{lastAIResult.impactScore}%</span>
                </div>

                <div className="impact-progress-track">
                  <div
                    className="impact-progress-fill"
                    style={{
                      width: `${lastAIResult.impactScore}%`,
                      backgroundColor:
                        lastAIResult.impactScore > 75
                          ? 'var(--color-paradox)'
                          : lastAIResult.impactScore > 50
                          ? 'var(--color-warning)'
                          : 'var(--color-cyan)',
                    }}
                  />
                </div>

                <p className="impact-summary">{lastAIResult.summary}</p>

                <div className="impact-effects-list">
                  <span className="list-title">CONSEQUÊNCIAS EMERGENTES NO ESPAÇO-TEMPO:</span>
                  <ul>
                    {lastAIResult.unexpectedEffects.map((eff, i) => (
                      <li key={i}>{eff}</li>
                    ))}
                  </ul>
                </div>

                {lastAIResult.generatedAnomalies && lastAIResult.generatedAnomalies.length > 0 && (
                  <div className="anomalies-list">
                    <span className="list-title">NOVOS NÓS DE REALIDADE DERIVADOS:</span>
                    {lastAIResult.generatedAnomalies.map((anom, i) => (
                      <div key={i} className="anomaly-item">
                        <span className="anom-title">[IA] {anom.title}</span>
                        <span className="anom-year">Ano {anom.year}</span>
                        <p className="anom-desc">{anom.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="ai-empty-box">
                <div className="ai-empty-icon-wrap">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <p>
                  Modifique ou apague qualquer nó temporal no Inspetor à direita e clique em{' '}
                  <strong>"Simular Efeito Borboleta com IA"</strong> para calcular a reorganização das
                  geodésicas no cone de luz.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Future Scenarios */}
        {activeTab === 'futures' && (
          <div className="ai-tab-content">
            <h3 className="ai-content-title">Ramificações Futuras Everettianas (Multiverso)</h3>
            <p className="ai-content-desc">
              Projeções probabilísticas fundamentadas no estado atual do tensor métrico de curvatura.
            </p>

            <div className="ai-futures-list">
              {futures.map(fut => (
                <div key={fut.id} className="ai-future-card">
                  <div className="future-header">
                    <span className="future-prob">{fut.probability}% probabilidade</span>
                    <span className="future-dim-tag">{fut.predictedIntegrity}% integridade</span>
                  </div>
                  <strong className="future-title">{fut.title}</strong>
                  <p className="future-desc">{fut.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Paradox Resolutions */}
        {activeTab === 'resolutions' && (
          <div className="ai-tab-content">
            <h3 className="ai-content-title">Algoritmo de Autoconsistência de Novikov</h3>

            {universe.paradoxes.length > 0 ? (
              <>
                <label className="paradox-select-label">
                  <span>SELECIONE A LINHA DE PARADOXO / CTC:</span>
                  <select
                    value={selectedParadoxId}
                    onChange={e => setSelectedParadoxId(e.target.value)}
                  >
                    {universe.paradoxes.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} (Severidade {p.severity}%)
                      </option>
                    ))}
                  </select>
                </label>

                <div className="resolutions-list">
                  {resolutions.map(res => (
                    <div key={res.id} className="resolution-card">
                      <div className="res-header">
                        <span className="res-type">{res.actionType.toUpperCase()}</span>
                        <span className="res-cost">{res.successRate}% taxa de sucesso</span>
                      </div>
                      <strong className="res-title">{res.title}</strong>
                      <p className="res-desc">{res.description}</p>
                      <button
                        type="button"
                        className="btn-apply-res"
                        onClick={() => onApplyResolution(res)}
                      >
                        Aplicar Resolução no Continuum
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="ai-empty-box">
                <div className="ai-empty-icon-wrap status-ok">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <p>Nenhuma Curva Tipo-Tempo Fechada (CTC) ativa detectada. O continuum causal é 100% autoconsistente.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Settings */}
        {activeTab === 'settings' && (
          <form className="ai-tab-content ai-settings-form" onSubmit={handleSaveConfig}>
            <h3 className="ai-content-title">Provedor & Modelo de Inteligência Artificial</h3>
            <p className="ai-content-desc">
              Conecte o Claude 3.5 Sonnet ou outro LLM de ponta via OpenRouter para inferência física em tempo real.
            </p>

            <label>
              <span>Provedor de IA</span>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value as 'builtin' | 'openrouter' | 'custom_api')}
              >
                <option value="openrouter">OpenRouter (Claude 3.5 Sonnet / Multi-Model)</option>
                <option value="builtin">Motor Heurístico Local (Offline)</option>
                <option value="custom_api">Endpoint de API Customizado</option>
              </select>
            </label>

            {provider === 'openrouter' && (
              <>
                <label>
                  <span>Chave de API do OpenRouter</span>
                  <input
                    type="password"
                    placeholder="sk-or-v1-..."
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                    Chave obtida gratuitamente em{' '}
                    <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" style={{ color: 'var(--color-stable)' }}>
                      openrouter.ai/keys
                    </a>
                  </small>
                </label>

                <label>
                  <span>Modelo Recomendado</span>
                  <select
                    value={openRouterModel}
                    onChange={e => {
                      setOpenRouterModel(e.target.value);
                      setCustomModel('');
                    }}
                  >
                    {OPENROUTER_MODELS.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Ou digite o ID de outro modelo:</span>
                  <input
                    type="text"
                    placeholder="ex: anthropic/claude-3.5-sonnet:beta"
                    value={customModel}
                    onChange={e => setCustomModel(e.target.value)}
                  />
                </label>
              </>
            )}

            {provider === 'custom_api' && (
              <label>
                <span>Endpoint da API (Proxy Seguro)</span>
                <input
                  type="text"
                  value={endpoint}
                  onChange={e => setEndpoint(e.target.value)}
                />
              </label>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button type="submit" className="btn-travel-submit" style={{ flex: 1 }}>
                Salvar Configurações
              </button>
              {provider === 'openrouter' && (
                <button
                  type="button"
                  className="btn-action-alt"
                  onClick={handleTestConnection}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Testar Conexão
                </button>
              )}
            </div>

            {savedSuccess && (
              <p style={{ color: 'var(--color-stable)', fontSize: '0.8rem', marginTop: '6px' }}>
                Configuração salva com sucesso!
              </p>
            )}

            {testStatus && (
              <p
                style={{
                  color: testStatus.includes('validada') ? 'var(--color-stable)' : 'var(--color-warning)',
                  fontSize: '0.78rem',
                  marginTop: '6px',
                }}
              >
                {testStatus}
              </p>
            )}
          </form>
        )}
      </div>
    </aside>
  );
}
