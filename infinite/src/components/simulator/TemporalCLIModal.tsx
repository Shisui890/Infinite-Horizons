import { useState, useRef, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { ParadoxEngine } from '../../engine/ParadoxEngine';
import { MonteCarloService } from '../../engine/MonteCarloService';
import type { CLICommandLog } from '../../types/temporal';

export default function TemporalCLIModal() {
  const { showCLIModal, setShowCLIModal, universeState, resetUniverse } = useSimulationStore();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CLICommandLog[]>([
    {
      id: 'init-1',
      command: 'system.init()',
      output: 'Terminal Temporal v2.4 conectado ao Continuum de Minkowski. Digite "help" para lista de comandos.',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      type: 'info',
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const commandHistoryRef = useRef<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showCLIModal) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showCLIModal]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!showCLIModal) return null;

  function executeCommand(cmdText: string) {
    const raw = cmdText.trim();
    if (!raw) return;

    commandHistoryRef.current.push(raw);
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const lower = raw.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      setInput('');
      return;
    }

    let output = '';
    let type: 'success' | 'error' | 'info' = 'success';

    const universe = universeState.universe;
    const allEvents = universe.dimensions.flatMap(d => d.events);

    if (lower === 'help') {
      output = `Comandos Disponíveis no Terminal Temporal:
- help                    : Exibe esta lista de instruções
- clear / cls             : Limpa o console
- universe.integrity()    : Exibe a integridade quântica da métrica global
- paradox.scan()          : Varre o grafo em busca de loops, bootstraps e inconsistências de Novikov
- traveler.list()         : Lista todos os viajantes e suas geodésicas ativas
- dimension.list()        : Lista as variedades e dimensões acopladas
- timeline.inspect <id>   : Exibe os parâmetros relativísticos de um nó (ex: timeline.inspect evt-100)
- montecarlo.run <n>      : Executa N iterações estocásticas (ex: montecarlo.run 5000)
- reset                   : Restaura o universo ao estado padrão inicial`;
      type = 'info';
    } else if (lower.startsWith('universe.integrity')) {
      output = `INTEGRIDADE GLOBAL: ${universe.temporalIntegrity}%\nDimensões: ${universe.dimensions.length} | Eventos: ${allEvents.length} | Paradoxos: ${universe.paradoxes.length}`;
    } else if (lower.startsWith('paradox.scan')) {
      const paradoxes = ParadoxEngine.detectParadoxes(allEvents, universe.travelers, universe.edges);
      if (paradoxes.length === 0) {
        output = 'Nenhuma anomalia ou paradoxo detectado no continuum. O grafo satisfaz o teorema de Novikov.';
      } else {
        output = `Detectados ${paradoxes.length} paradoxo(s):\n` +
          paradoxes.map((p, idx) => `[#${idx + 1}] [${p.type}] [${p.severity}] ${p.title} (Nós: ${p.causalChain.join(' → ')})`).join('\n');
      }
    } else if (lower.startsWith('traveler.list')) {
      output = universe.travelers.length === 0
        ? 'Nenhum viajante registrado no momento.'
        : universe.travelers
            .map(t => `• ${t.name} (Origem: ${t.originYear} em ${t.originDimensionId} → Atual: ${t.currentYear} em ${t.currentDimensionId}) [${t.status}]`)
            .join('\n');
    } else if (lower.startsWith('dimension.list')) {
      output = universe.dimensions
        .map(d => `• [${d.designation}] ${d.name} (${d.events.length} eventos, Integridade: ${d.integrity}%)`)
        .join('\n');
    } else if (lower.startsWith('timeline.inspect')) {
      const parts = raw.split(' ');
      const id = parts[1]?.trim();
      const found = allEvents.find(e => e.id.toLowerCase() === id?.toLowerCase());
      if (!found) {
        output = `Erro: Evento "${id}" não encontrado no grafo.`;
        type = 'error';
      } else {
        output = `EVENTO: ${found.title} (${found.year})\nCategoria: ${found.category} | Status: ${found.status} | Importância: ${found.importance}/100\nÂncora Temporal: ${found.isAnchor ? 'SIM' : 'NÃO'}\nCausas: ${found.parents.join(', ') || 'Nenhum pai'}\nConsequências: ${found.children.join(', ') || 'Nenhum filho'}`;
      }
    } else if (lower.startsWith('montecarlo.run')) {
      const parts = raw.split(' ');
      const n = parseInt(parts[1], 10) || 5000;
      const res = MonteCarloService.runSimulation(universe, n);
      output = `Simulação Estocástica de Monte Carlo (${res.iterations} iterações):\n• Estabilidade: ${res.stableProbability}%\n• Bifurcação: ${res.bifurcationProbability}%\n• Inconsistência: ${res.inconsistencyProbability}%\n• Entropia de Shannon: ${res.shannonEntropyBits} bits\n• Expoente Max Lyapunov: ${res.lyapunovMax}`;
    } else if (lower === 'reset') {
      resetUniverse();
      output = 'Universo restaurado com sucesso para as condições iniciais de contorno.';
    } else {
      output = `Comando desconhecido: "${raw}". Digite "help" para ver os comandos disponíveis.`;
      type = 'error';
    }

    setHistory(prev => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: raw,
        output,
        timestamp,
        type,
      },
    ]);
    setInput('');
    setHistoryIndex(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      const cmds = commandHistoryRef.current;
      if (cmds.length === 0) return;
      const nextIndex = historyIndex === null ? cmds.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(cmds[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      const cmds = commandHistoryRef.current;
      if (cmds.length === 0 || historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= cmds.length) {
        setHistoryIndex(null);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(cmds[nextIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowCLIModal(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card cli-terminal-modal">
        <div className="cli-terminal-header">
          <div className="cli-title-wrap">
            <span className="cli-dot red" />
            <span className="cli-dot yellow" />
            <span className="cli-dot green" />
            <span className="cli-title-text">TERMINAL TEMPORAL CLI — [INFINITE HORIZONS]</span>
          </div>
          <button type="button" className="btn-modal-close" onClick={() => setShowCLIModal(false)}>
            ✕
          </button>
        </div>

        <div className="cli-terminal-logs">
          {history.map(item => (
            <div key={item.id} className={`cli-log-entry ${item.type}`}>
              <div className="cli-log-prompt">
                <span className="cli-prompt-symbol">▶</span>
                <span className="cli-log-cmd">{item.command}</span>
                <span className="cli-log-time">{item.timestamp}</span>
              </div>
              <pre className="cli-log-output">{item.output}</pre>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="cli-input-bar">
          <span className="cli-input-symbol">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="cli-input-field"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite um comando (ex: help, paradox.scan(), montecarlo.run 10000)..."
          />
        </div>
      </div>
    </div>
  );
}
