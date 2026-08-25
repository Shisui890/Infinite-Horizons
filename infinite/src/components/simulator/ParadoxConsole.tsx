import { Paradox, SimulationLog } from '../../types/temporal';

interface Props {
  paradoxes: Paradox[];
  logs: SimulationLog[];
  onInvestigateParadox: (paradox: Paradox) => void;
}

export default function ParadoxConsole({ paradoxes, logs, onInvestigateParadox }: Props) {
  return (
    <footer className="sim-bottom-console">
      {/* Paradox Panel */}
      <div className="sim-console-left">
        <div className="console-header">
          <span className="console-title">PARADOXOS ATIVOS ({paradoxes.length})</span>
        </div>

        <div className="console-paradox-list">
          {paradoxes.length === 0 ? (
            <div className="no-paradoxes">
              <span>✓ Nenhum paradoxo detectado. A linha temporal está estável.</span>
            </div>
          ) : (
            paradoxes.map(pdx => (
              <div key={pdx.id} className="paradox-card">
                <div className="pdx-card-header">
                  <span className="pdx-badge">{pdx.title}</span>
                  <span className="pdx-severity">{pdx.severity}</span>
                </div>
                <p className="pdx-desc">{pdx.description}</p>
                <button
                  type="button"
                  className="btn-investigate"
                  onClick={() => onInvestigateParadox(pdx)}
                >
                  INVESTIGAR CADEIA CAUSAL
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log Terminal */}
      <div className="sim-console-right">
        <div className="console-header">
          <span className="console-title">TERMINAL DE SIMULAÇÃO</span>
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
    </footer>
  );
}
