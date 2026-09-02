import { useState } from 'react';
import { Paradox, ParadoxSeverity, SimulationLog } from '../../types/temporal';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface Props {
  paradoxes: Paradox[];
  logs: SimulationLog[];
  onInvestigateParadox: (paradox: Paradox) => void;
}

export default function ParadoxConsole({ paradoxes, logs, onInvestigateParadox }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <footer className={`sim-bottom-console ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="console-toggle-bar" onClick={() => setIsCollapsed(!isCollapsed)}>
        <span className="console-toggle-title">
          {isCollapsed
            ? (isLaymanMode ? '▲ ABRIR CONSOLE DE ALERTAS & PARADOXOS' : '▲ ABRIR CONSOLE DE TELEMETRIA & PARADOXOS')
            : '▼ MINIMIZAR CONSOLE'}{' '}
          ({paradoxes.length} {isLaymanMode ? 'conflitos' : 'CTCs'}, {logs.length} {isLaymanMode ? 'registros' : 'logs'})
        </span>
        <button type="button" className="btn-toggle-console" aria-label="Toggle Console">
          {isCollapsed ? '▲' : '▼'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="console-body-grid">
          {/* Paradox Panel */}
          <div className="sim-console-left">
            <div className="console-header">
              <span className="console-title">
                {isLaymanMode
                  ? `CONFLITOS E PARADOXOS NO TEMPO (${paradoxes.length})`
                  : `CURVAS TIPO TEMPO FECHADAS & PARADOXOS (${paradoxes.length})`}
              </span>
            </div>

            <div className="console-paradox-list">
              {paradoxes.length === 0 ? (
                <div className="no-paradoxes">
                  <span>
                    {isLaymanMode
                      ? 'Nenhum conflito na história detectado! Todas as causas e efeitos estão consistentes e o tempo flui com segurança.'
                      : 'Nenhuma violação do princípio de Novikov detectada. O continuum espaço-temporal permanece estável.'}
                  </span>
                </div>
              ) : (
                paradoxes.map(pdx => (
                  <div key={pdx.id} className="paradox-card">
                    <div className="pdx-card-header">
                      <span className="pdx-badge">{pdx.title}</span>
                      <span className="pdx-severity">
                        {isLaymanMode
                          ? (pdx.severity === ParadoxSeverity.HIGH || pdx.severity === ParadoxSeverity.CRITICAL || pdx.severity === ParadoxSeverity.CATASTROPHIC
                              ? 'RISCO ALTO'
                              : pdx.severity === ParadoxSeverity.MEDIUM
                              ? 'RISCO MÉDIO'
                              : 'RISCO BAIXO')
                          : String(pdx.severity).toUpperCase()}
                      </span>
                    </div>
                    <p className="pdx-desc">{pdx.description}</p>
                    <button
                      type="button"
                      className="btn-investigate"
                      onClick={() => onInvestigateParadox(pdx)}
                    >
                      {isLaymanMode ? 'VER ONDE A HISTÓRIA FOI AFETADA' : 'INVESTIGAR CONES DE LUZ & GEODÉSICAS'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Log Terminal */}
          <div className="sim-console-right">
            <div className="console-header">
              <span className="console-title">
                {isLaymanMode ? 'REGISTRO DE AÇÕES NO ESPAÇO-TEMPO' : 'TERMINAL DE MÉTRICA & TERMODINÂMICA'}
              </span>
            </div>
            <div className="terminal-logs">
              {logs.map(log => (
                <div key={log.id} className={`log-line log-${log.type}`}>
                  <span className="log-time">[{log.timestamp}]</span>
                  <span className="log-msg">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
