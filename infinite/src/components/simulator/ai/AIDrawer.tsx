import { useState } from 'react';
import type {
  Universe,
  AIButterflyResult,
  AIFutureScenario,
  AIParadoxResolution,
} from '../../../types/temporal';
import { AITemporalService } from '../../../engine/AITemporalService';

interface Props {
  universe: Universe;
  lastAIResult: AIButterflyResult | null;
  onClose: () => void;
  onApplyResolution: (resolution: AIParadoxResolution) => void;
}

export default function AIDrawer({ universe, lastAIResult, onClose, onApplyResolution }: Props) {
  const [activeTab, setActiveTab] = useState<'butterfly' | 'futures' | 'resolutions' | 'settings'>('butterfly');
  const [selectedParadoxId, setSelectedParadoxId] = useState<string>(universe.paradoxes[0]?.id || '');

  // Settings form state
  const [provider, setProvider] = useState<'builtin' | 'custom_api'>(AITemporalService.getConfig().provider);
  const [endpoint, setEndpoint] = useState(AITemporalService.getConfig().endpoint || '');
  const [apiKey, setApiKey] = useState(AITemporalService.getConfig().apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const allEvents = universe.dimensions.flatMap(d => d.events);
  const insight = AITemporalService.analyzeUniverse(universe);

  const futures: AIFutureScenario[] = AITemporalService.predictFutures(universe);
  const targetParadox = universe.paradoxes.find(p => p.id === selectedParadoxId) || universe.paradoxes[0];
  const resolutions: AIParadoxResolution[] = targetParadox
    ? AITemporalService.suggestParadoxResolutions(targetParadox, allEvents)
    : [];

  function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    AITemporalService.updateConfig({
      provider,
      endpoint,
      apiKey,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  }

  return (
    <aside className="ai-drawer">
      <div className="ai-drawer-header">
        <div className="ai-header-title">
          <span className="ai-logo-icon">AI</span>
          <div>
            <h2>CRONO-ORÁCULO DE IA</h2>
            <span className="ai-badge-sub">MOTOR DE RESULTADOS INESPERADOS</span>
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
          Futuros Possíveis
        </button>
        <button
          type="button"
          className={`ai-tab-btn ${activeTab === 'resolutions' ? 'active' : ''}`}
          onClick={() => setActiveTab('resolutions')}
        >
          Resoluções ({universe.paradoxes.length})
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
              <span className="ai-insight-kicker">LEITURA DA REALIDADE</span>
              <strong>{insight.healthLabel}</strong>
            </div>
            <span className="ai-confidence">{insight.confidence}% confiança</span>
          </div>
          <div className="ai-insight-metrics">
            <span><strong>{insight.eventCount}</strong> eventos</span>
            <span><strong>{insight.exposedEvents}</strong> expostos</span>
            <span><strong>{insight.connectedEvents}</strong> conectados</span>
            <span><strong>{insight.affectedTravelers}</strong> viajantes em risco</span>
          </div>
          <p>{insight.recommendation}</p>
        </section>

        {/* Tab 1: Butterfly Effect & Anomalies */}
        {activeTab === 'butterfly' && (
          <div className="ai-tab-content">
            <h3 className="ai-content-title">Impacto causal e evidências do modelo</h3>

            {lastAIResult ? (
              <div className="ai-butterfly-card">
                <div className="impact-header">
                  <span>IMPACTO DO EFEITO BORBOLETA</span>
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
                  <span className="list-title">CONSEQUÊNCIAS INESPERADAS GERADAS:</span>
                  <ul>
                    {lastAIResult.unexpectedEffects.map((eff, i) => (
                      <li key={i}>{eff}</li>
                    ))}
                  </ul>
                </div>

                {lastAIResult.generatedAnomalies.length > 0 && (
                  <div className="anomalies-list">
                    <span className="list-title">NOVOS EVENTOS DERIVADOS:</span>
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
                <span className="ai-empty-icon">IA</span>
                <p>
                  Modifique ou apague qualquer evento no Inspetor e clique em{' '}
                  <strong>"Simular com IA (Efeito Borboleta)"</strong> para medir consequências
                  derivadas das relações que você definiu.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Probabilistic Futures */}
        {activeTab === 'futures' && (
          <div className="ai-tab-content">
            <h3 className="ai-content-title">Futuros Probabilísticos Calculados pela IA</h3>
            <p className="ai-content-desc">
              Com base na integridade temporal atual ({universe.temporalIntegrity}%), a IA projeta 3 hipóteses de futuro:
            </p>

            <div className="futures-list">
              {futures.map(fut => (
                <div key={fut.id} className="future-card">
                  <div className="fut-header">
                    <span className="fut-title">{fut.title}</span>
                    <span className="fut-prob">{fut.probability}% Probabilidade</span>
                  </div>

                  <div className="fut-prob-bar">
                    <div className="fut-prob-fill" style={{ width: `${fut.probability}%` }} />
                  </div>

                  <p className="fut-summary">{fut.summary}</p>

                  <div className="fut-events">
                    <span className="events-label">Acontecimentos Previstos:</span>
                    <ul>
                      {fut.keyEvents.map((ev, i) => (
                        <li key={i}>• {ev}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Paradox Resolutions */}
        {activeTab === 'resolutions' && (
          <div className="ai-tab-content">
            <h3 className="ai-content-title">Propostas de Resolução Guiadas por IA</h3>

            {universe.paradoxes.length === 0 ? (
              <div className="ai-empty-box">
                <span className="ai-empty-icon">✓</span>
                <p>Nenhum paradoxo ativo no momento. A realidade não necessita de intervenções de IA.</p>
              </div>
            ) : (
              <>
                <label className="paradox-selector-label">
                  <span>Selecione o Paradoxo para Analisar:</span>
                  <select
                    value={selectedParadoxId}
                    onChange={e => setSelectedParadoxId(e.target.value)}
                  >
                    {universe.paradoxes.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.severity})
                      </option>
                    ))}
                  </select>
                </label>

                <div className="resolutions-list">
                  {resolutions.map(res => (
                    <div key={res.id} className="resolution-card">
                      <div className="res-header">
                        <span className="res-title">{res.title}</span>
                        <span className="res-rate">{res.successRate}% Sucesso</span>
                      </div>
                      <p className="res-desc">{res.description}</p>
                      <button
                        type="button"
                        className="btn-apply-res"
                        onClick={() => onApplyResolution(res)}
                      >
                        APLICAR INTERVENÇÃO DA IA
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 4: AI Settings & API Connection */}
        {activeTab === 'settings' && (
          <div className="ai-tab-content">
            <h3 className="ai-content-title">Conectar Provedor de IA Externo</h3>
            <p className="ai-content-desc">
              Você pode usar o motor gerativo interno ou integrar sua própria API / Webhook de IA (OpenAI, Gemini, Ollama ou Endpoint Customizado).
            </p>

            <form onSubmit={handleSaveConfig} className="ai-settings-form">
              <label>
                <span>Provedor de IA</span>
                <select value={provider} onChange={e => setProvider(e.target.value as 'builtin' | 'custom_api')}>
                  <option value="builtin">Motor Gerativo Interno (Offline / Instantâneo)</option>
                  <option value="custom_api">API Customizada / Webhook Externa</option>
                </select>
              </label>

              {provider === 'custom_api' && (
                <>
                  <label>
                    <span>Endpoint da API (URL)</span>
                    <input
                      type="url"
                      value={endpoint}
                      onChange={e => setEndpoint(e.target.value)}
                      placeholder="https://sua-api.com/v1/simulate-temporal"
                      required
                    />
                  </label>

                  <label>
                    <span>Chave de API / Bearer Token (Opcional)</span>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="sk-..."
                    />
                  </label>
                </>
              )}

              <div className="ai-form-footer">
                {savedSuccess && <span className="saved-text">✓ Configurações salvas!</span>}
                <button type="submit" className="btn-cta">
                  SALVAR CONFIGURAÇÕES
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}
