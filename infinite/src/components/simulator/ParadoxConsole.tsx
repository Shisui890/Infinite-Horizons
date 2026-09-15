import { useState } from 'react';
import { Paradox, ParadoxSeverity, SimulationLog } from '../../types/temporal';
import { useLaymanMode } from '../../context/useLaymanMode';
import { useSimulationStore } from '../../store/useSimulationStore';
import { DICTIONARY } from '../../utils/i18n';

interface Props {
  paradoxes: Paradox[];
  logs: SimulationLog[];
  onInvestigateParadox: (paradox: Paradox) => void;
}

function localizeLogMessage(msg: string, lang: 'pt' | 'en'): string {
  if (lang !== 'en') return msg;
  if (msg.includes('inicializado com sucesso')) {
    return 'Model "Relativistic Cosmology & Superstring Multiverse" successfully initialized (Temporal Integrity: 100%).';
  }
  if (msg.includes('Cones de luz de Minkowski calibrados')) {
    return 'Minkowski light cones calibrated: speed of light c invariant across all geodesics.';
  }
  return msg;
}

export default function ParadoxConsole({ paradoxes, logs, onInvestigateParadox }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const { language } = useSimulationStore();
  const t = DICTIONARY[language];
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getSeverityLabel = (severity: ParadoxSeverity) => {
    if (isLaymanMode) {
      if (
        severity === ParadoxSeverity.HIGH ||
        severity === ParadoxSeverity.CRITICAL ||
        severity === ParadoxSeverity.CATASTROPHIC
      ) {
        return language === 'en' ? 'HIGH RISK' : 'RISCO ALTO';
      }
      if (severity === ParadoxSeverity.MEDIUM) {
        return language === 'en' ? 'MEDIUM RISK' : 'RISCO MÉDIO';
      }
      return language === 'en' ? 'LOW RISK' : 'RISCO BAIXO';
    }
    return String(severity).toUpperCase();
  };

  return (
    <footer className={`sim-bottom-console ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="console-toggle-bar" onClick={() => setIsCollapsed(!isCollapsed)}>
        <span className="console-toggle-title">
          {isCollapsed
            ? (isLaymanMode ? t.openAlertsConsole : t.openTelemetryConsole)
            : t.minimizeConsole}{' '}
          ({paradoxes.length} {isLaymanMode ? t.conflicts : t.ctcs}, {logs.length} {isLaymanMode ? t.records : t.logs})
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
                  ? `${t.laymanConsoleParadoxTitle} (${paradoxes.length})`
                  : `${t.consoleParadoxTitle} (${paradoxes.length})`}
              </span>
            </div>

            <div className="console-paradox-list">
              {paradoxes.length === 0 ? (
                <div className="no-paradoxes">
                  <span>
                    {isLaymanMode ? t.laymanNoParadoxDetected : t.noParadoxDetected}
                  </span>
                </div>
              ) : (
                paradoxes.map(pdx => (
                  <div key={pdx.id} className="paradox-card">
                    <div className="pdx-card-header">
                      <span className="pdx-badge">{pdx.title}</span>
                      <span className="pdx-severity">
                        {getSeverityLabel(pdx.severity)}
                      </span>
                    </div>
                    <p className="pdx-desc">{pdx.description}</p>
                    <button
                      type="button"
                      className="btn-investigate"
                      onClick={() => onInvestigateParadox(pdx)}
                    >
                      {isLaymanMode ? t.laymanInvestigateParadox : t.investigateParadox}
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
                {isLaymanMode ? t.laymanConsoleTerminalTitle : t.consoleTerminalTitle}
              </span>
            </div>
            <div className="terminal-logs">
              {logs.map(log => (
                <div key={log.id} className={`log-line log-${log.type}`}>
                  <span className="log-time">[{log.timestamp}]</span>
                  <span className="log-msg">{localizeLogMessage(log.message, language)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

