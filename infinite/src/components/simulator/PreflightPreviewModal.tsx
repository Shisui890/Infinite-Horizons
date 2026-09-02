import { useSimulationStore } from '../../store/useSimulationStore';
import { TemporalReplayEngine } from '../../engine/TemporalReplayEngine';

export default function PreflightPreviewModal() {
  const {
    preflightImpact,
    setPreflightImpact,
    universeState,
    removeEvent,
    startReplay,
  } = useSimulationStore();

  if (!preflightImpact) return null;

  function handleApplyWithReplay() {
    if (!preflightImpact) return;
    const frames = TemporalReplayEngine.generateReplayFrames(
      universeState.universe,
      preflightImpact.targetEventId,
      preflightImpact.action === 'erase' ? 'erase' : 'alter'
    );
    if (preflightImpact.action === 'erase') {
      removeEvent(preflightImpact.targetEventId);
    }
    setPreflightImpact(null);
    startReplay(frames);
  }

  function handleApplyDirectly() {
    if (!preflightImpact) return;
    if (preflightImpact.action === 'erase') {
      removeEvent(preflightImpact.targetEventId);
    }
    setPreflightImpact(null);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card preflight-modal">
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="preflight-warning-icon">⚠</span>
            <div>
              <h3>Simulação Prévia de Impacto Causal</h3>
              <p className="modal-subtitle">
                Análise determinística das consequências da intervenção temporal
              </p>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={() => setPreflightImpact(null)}>
            ✕
          </button>
        </div>

        <div className="preflight-body">
          <div className="preflight-target-box">
            <span className="preflight-label">ALVO DA INTERVENÇÃO:</span>
            <h4 className="preflight-target-title">{preflightImpact.targetEventTitle}</h4>
            <span className="preflight-action-tag">
              AÇÃO: {preflightImpact.action === 'erase' ? 'ANULAÇÃO DE EXISTÊNCIA (DELETE)' : 'ALTERAÇÃO'}
            </span>
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
        </div>

        <div className="modal-footer preflight-footer">
          <button type="button" className="btn-secondary" onClick={() => setPreflightImpact(null)}>
            Cancelar
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
