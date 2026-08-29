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
import MathFormula from '../../MathFormula';

interface Props {
  universe: Universe;
  lastAIResult: AIButterflyResult | null;
  onClose: () => void;
  onApplyResolution: (resolution: AIParadoxResolution) => void;
}

const OPENROUTER_MODELS = [
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Anthropic) — Raciocínio & Física de Ponta' },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash (Google) — Rápido & Preciso' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3 (DeepSeek) — Altíssima Eficiência' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (OpenAI) — Estruturado & Econômico' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B (Meta) — Open Source de Elite' },
];

export default function AIDrawer({ universe, lastAIResult, onClose, onApplyResolution }: Props) {
  const [activeTab, setActiveTab] = useState<'symposium' | 'butterfly' | 'futures' | 'resolutions' | 'settings'>('symposium');
  const [selectedParadoxId, setSelectedParadoxId] = useState<string>(universe.paradoxes[0]?.id || '');

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

  const allEvents = universe.dimensions.flatMap(d => d.events);
  const insight = AITemporalService.analyzeUniverse(universe);

  const futures: AIFutureScenario[] = AITemporalService.predictFutures(universe);
  const targetParadox = universe.paradoxes.find(p => p.id === selectedParadoxId) || universe.paradoxes[0];
  const resolutions: AIParadoxResolution[] = targetParadox
    ? AITemporalService.suggestParadoxResolutions(targetParadox, allEvents)
    : [];

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
    setTimeout(() => setSavedSuccess(false), 2500);
  }

  async function handleTestConnection() {
    setTestStatus('Testando conexão...');
    try {
      if (provider === 'openrouter') {
        if (!apiKey) {
          setTestStatus('Erro: Insira uma chave de API do OpenRouter para testar.');
          return;
        }
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://infinite-horizons.app',
            'X-Title': 'Infinite Horizons Temporal Simulator',
          },
          body: JSON.stringify({
            model: customModel.trim() || openRouterModel,
            messages: [{ role: 'user', content: 'Ping: responda apenas "OK".' }],
            max_tokens: 5,
          }),
        });
        if (res.ok) {
          setTestStatus('✓ Conexão com OpenRouter bem-sucedida!');
        } else {
          const err = await res.text();
          setTestStatus(`Erro ${res.status}: ${err.slice(0, 100)}`);
        }
      } else {
        setTestStatus('✓ Provedor configurado.');
      }
    } catch (e) {
      setTestStatus(`Erro de rede: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return (
    <aside className="ai-drawer">
      <div className="ai-drawer-header">
        <div className="ai-header-title">
          <span className="ai-logo-icon">OR</span>
          <div>
            <h2>CRONO-ORÁCULO DE IA & FÍSICA TEÓRICA</h2>
            <span className="ai-badge-sub">MOTOR DE INFERÊNCIA CAUSAL (OPENROUTER / CLAUDE 3.5)</span>
          </div>
        </div>
        <button type="button" className="sim-btn-close" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="ai-tabs">
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'symposium' ? 'active' : ''}`}
          onClick={() => setActiveTab('symposium')}
        >
          Simpósio Multi-Agente
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'butterfly' ? 'active' : ''}`}
          onClick={() => setActiveTab('butterfly')}
        >
          Efeito Borboleta
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'futures' ? 'active' : ''}`}
          onClick={() => setActiveTab('futures')}
        >
          Futuros (Everett)
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'resolutions' ? 'active' : ''}`}
          onClick={() => setActiveTab('resolutions')}
        >
          Novikov ({universe.paradoxes.length})
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Config IA
        </button>
      </div>

      <div className="ai-drawer-body">
        <section className={`ai-universe-insight ai-insight-${insight.health}`}>
          <div className="ai-insight-heading">
            <div>
              <span className="ai-insight-kicker">ANÁLISE DO TECIDO DO ESPAÇO-TEMPO</span>
              <strong>{insight.healthLabel}</strong>
            </div>
            <span className="ai-confidence">{insight.confidence}% coerência métrica</span>
          </div>
          <div className="ai-insight-metrics">
            <span><strong>{insight.eventCount}</strong> nós de geodésica</span>
            <span><strong>{insight.exposedEvents}</strong> perturbados</span>
            <span><strong>{insight.connectedEvents}</strong> entrelaçados</span>
            <span><strong>{insight.affectedTravelers}</strong> sondas em risco</span>
          </div>
          <p>{insight.recommendation}</p>
        </section>

        {/* Tab 1: Multi-Agent Symposium */}
        {activeTab === 'symposium' && (
          <div className="ai-tab-content">
            <div className="symposium-header-card">
              <span className="symposium-kicker">PAINEL DE FÍSICA TEÓRICA AO VIVO</span>
              <h3 className="ai-content-title">Debate com 3 Especialistas Renomados</h3>
              <p className="ai-content-desc">
                Submeta qualquer tese ou anomalia. O comitê internacional de cientistas de IA avalia a coerência com a
                Relatividade, Teoria das Cordas em 11D e dados do James Webb/LIGO.
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
                {isDebating ? 'Simulando Painel com Claude 3.5 Sonnet...' : 'Iniciar Debate Científico ao Vivo'}
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

                        <p className="turn-statement">{turn.statement}</p>

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
                          ? '#ef4444'
                          : lastAIResult.impactScore > 50
                          ? '#fbbf24'
                          : '#00d4ff',
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
                <span className="ai-empty-icon">ORÁCULO</span>
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
                <span className="ai-empty-icon">✓</span>
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
                ✓ Configuração salva com sucesso!
              </p>
            )}

            {testStatus && (
              <p
                style={{
                  color: testStatus.startsWith('✓') ? 'var(--color-stable)' : 'var(--color-warning)',
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
