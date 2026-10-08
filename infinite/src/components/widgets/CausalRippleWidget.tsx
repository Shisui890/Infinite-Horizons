import { useState, useEffect } from 'react';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface CausalNode {
  id: string;
  name: string;
  year: number;
  x: number;
  y: number;
  category: string;
  desc: string;
}

const NODES: CausalNode[] = [
  { id: 'newton', name: 'Newton (Gravitação)', year: 1687, x: 70, y: 130, category: 'CLÁSSICA', desc: 'Leis do movimento e gravitação universal' },
  { id: 'maxwell', name: 'Maxwell (Eletromagnetismo)', year: 1865, x: 200, y: 60, category: 'ELETROMAGNETISMO', desc: 'Unificação dos campos elétrico e magnético' },
  { id: 'einstein', name: 'Einstein (Relatividade)', year: 1905, x: 330, y: 130, category: 'RELATIVIDADE', desc: 'Espaço-tempo quadri-dimensional e invariância de c' },
  { id: 'bohr', name: 'Bohr (Quântica)', year: 1913, x: 460, y: 60, category: 'QUÂNTICA', desc: 'Quantização de órbitas atômicas' },
  { id: 'feynman', name: 'Feynman (QED)', year: 1948, x: 570, y: 130, category: 'ELETRODINÂMICA', desc: 'Integrais de caminho e antimatéria no cone de luz' },
];

const EDGES: { from: string; to: string }[] = [
  { from: 'newton', to: 'maxwell' },
  { from: 'newton', to: 'einstein' },
  { from: 'maxwell', to: 'einstein' },
  { from: 'einstein', to: 'bohr' },
  { from: 'einstein', to: 'feynman' },
  { from: 'bohr', to: 'feynman' },
];

export default function CausalRippleWidget() {
  const { isLaymanMode } = useLaymanMode();
  const [perturbedId, setPerturbedId] = useState<string | null>(null);
  const [affectedIds, setAffectedIds] = useState<string[]>([]);
  const [isStabilizing, setIsStabilizing] = useState<boolean>(false);
  const [entropy, setEntropy] = useState<number>(1.24);
  const [lyapunov, setLyapunov] = useState<number>(0.042);
  const [integrity, setIntegrity] = useState<number>(100);

  // Compute downstream nodes
  function getDownstream(nodeId: string): string[] {
    const visited = new Set<string>();
    const queue = [nodeId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      EDGES.filter(e => e.from === current).forEach(e => {
        if (!visited.has(e.to)) {
          visited.add(e.to);
          queue.push(e.to);
        }
      });
    }
    return Array.from(visited);
  }

  function handlePerturb(nodeId: string) {
    setIsStabilizing(false);
    setPerturbedId(nodeId);
    const downstream = getDownstream(nodeId);
    setAffectedIds(downstream);
    setEntropy(3.87);
    setLyapunov(0.485);
    setIntegrity(72);
  }

  function handleRestoreNovikov() {
    setIsStabilizing(true);
    setEntropy(1.24);
    setLyapunov(0.042);
    setIntegrity(100);
    setTimeout(() => {
      setPerturbedId(null);
      setAffectedIds([]);
      setIsStabilizing(false);
    }, 1200);
  }

  // Auto-pulse wave simulation
  useEffect(() => {
    if (!perturbedId) return;
    const interval = setInterval(() => {
      setEntropy(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
    }, 1500);
    return () => clearInterval(interval);
  }, [perturbedId]);

  return (
    <div className="causal-ripple-simulator-card">
      <div className="ripple-card-header">
        <div className="ripple-title-group">
          <span className="ripple-pill-badge">
            <span className="pill-dot" />
            {isLaymanMode ? 'TESTE PRÁTICO // EFEITO DOMINÓ NA HISTÓRIA' : 'SIMULADOR INTERATIVO // PROPAGAÇÃO CAUSAL'}
          </span>
          <h4>{isLaymanMode ? 'Simulador do Efeito Borboleta: Veja o Que Acontece ao Mudar o Passado' : 'Simulador do Efeito Borboleta & Conexões Geodésicas'}</h4>
          <p>
            {isLaymanMode
              ? 'Clique em qualquer cientista abaixo para ver o que aconteceria se sua descoberta nunca tivesse existido. As setas amarelas e vermelhas mostram como as invenções seguintes seriam destruídas!'
              : 'Clique em qualquer nó histórico abaixo ou no botão para simular uma perturbação e observar as ondas de choque causais se propagarem no grafo:'}
          </p>
        </div>

        <div className="ripple-header-controls">
          <button
            type="button"
            className={`btn-ripple-trigger ${perturbedId ? 'active-perturbed' : ''}`}
            onClick={() => handlePerturb('einstein')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>{isLaymanMode ? 'Apagar Descoberta de Einstein (1905)' : 'Perturbar Einstein (1905)'}</span>
          </button>

          <button
            type="button"
            className="btn-ripple-restore"
            onClick={handleRestoreNovikov}
            disabled={!perturbedId && !isStabilizing}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>{isLaymanMode ? 'Restaurar Linha do Tempo Normal' : 'Restaurar Novikov'}</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Diagram */}
      <div className="ripple-svg-viewport">
        <svg
          viewBox="0 0 640 190"
          className="ripple-network-svg"
          aria-label="Grafo de Causa e Efeito Interativo"
        >
          <defs>
            <linearGradient id="edgeGradDefault" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="edgeGradPerturbed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.95" />
            </linearGradient>

            <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Edges */}
          {EDGES.map(edge => {
            const src = NODES.find(n => n.id === edge.from)!;
            const tgt = NODES.find(n => n.id === edge.to)!;
            const isEdgeAffected =
              (perturbedId === edge.from && affectedIds.includes(edge.to)) ||
              (affectedIds.includes(edge.from) && affectedIds.includes(edge.to));

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isEdgeAffected ? 'url(#edgeGradPerturbed)' : 'url(#edgeGradDefault)'}
                  strokeWidth={isEdgeAffected ? 2.8 : 1.5}
                  strokeDasharray={isEdgeAffected ? '6 4' : 'none'}
                  className={isEdgeAffected ? 'animated-edge-dash' : ''}
                />
                {/* Arrowhead / pulse */}
                {isEdgeAffected && (
                  <circle
                    r={3.5}
                    fill="#f59e0b"
                    className="pulse-particle-flow"
                  >
                    <animateMotion
                      path={`M${src.x},${src.y} L${tgt.x},${tgt.y}`}
                      dur="1.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map(node => {
            const isPerturbed = perturbedId === node.id;
            const isAffected = affectedIds.includes(node.id);
            const statusClass = isPerturbed
              ? 'node-state-perturbed'
              : isAffected
              ? 'node-state-affected'
              : isStabilizing
              ? 'node-state-stabilizing'
              : 'node-state-stable';

            return (
              <g
                key={node.id}
                className={`causal-svg-node-group ${statusClass}`}
                onClick={() => handlePerturb(node.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Wave Pulse if perturbed */}
                {isPerturbed && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={28}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    className="ripple-shockwave-circle"
                  />
                )}

                {/* Node Base Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={16}
                  fill={isPerturbed ? '#dc2626' : isAffected ? '#d97706' : '#0a192f'}
                  stroke={isPerturbed ? '#f87171' : isAffected ? '#fbbf24' : '#00d4ff'}
                  strokeWidth={isPerturbed || isAffected ? 2.5 : 1.5}
                  filter="url(#nodeGlow)"
                />

                {/* Inner Center Dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={5}
                  fill={isPerturbed ? '#ffffff' : isAffected ? '#fef08a' : '#00d4ff'}
                />

                {/* Label Year */}
                <text
                  x={node.x}
                  y={node.y + 28}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {node.year} d.C.
                </text>

                {/* Label Title */}
                <text
                  x={node.x}
                  y={node.y + (node.y > 100 ? 40 : -22)}
                  textAnchor="middle"
                  fill={isPerturbed ? '#f87171' : isAffected ? '#fbbf24' : '#e2e8f0'}
                  fontSize="11"
                  fontWeight="600"
                >
                  {node.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Telemetry Dashboard Footer */}
      <div className="ripple-telemetry-bar">
        <div className="ripple-stat-item">
          <span className="stat-label">{isLaymanMode ? 'SAÚDE DO TEMPO' : 'INTEGRIDADE TEMPORAL'}</span>
          <strong className={integrity < 80 ? 'text-danger' : 'text-cyan'}>
            {integrity}%
          </strong>
        </div>

        <div className="ripple-stat-item">
          <span className="stat-label">{isLaymanMode ? 'NÍVEL DE CAOS' : 'ENTROPIA CAUSAL (H)'}</span>
          <strong className={entropy > 2 ? 'text-amber' : 'text-cyan'}>
            {entropy} {isLaymanMode ? 'pts' : 'nats'}
          </strong>
        </div>

        <div className="ripple-stat-item">
          <span className="stat-label">{isLaymanMode ? 'FORÇA DO IMPACTO' : 'EXPOENTE DE LYAPUNOV (λ)'}</span>
          <strong className={lyapunov > 0.1 ? 'text-amber' : 'text-cyan'}>
            {lyapunov} {isLaymanMode ? '/ano' : 'ano⁻¹'}
          </strong>
        </div>

        <div className="ripple-stat-item">
          <span className="stat-label">{isLaymanMode ? 'ESTADO DA HISTÓRIA' : 'STATUS DE NOVIKOV'}</span>
          <strong className={perturbedId ? 'text-amber' : 'text-green'}>
            {isStabilizing
              ? (isLaymanMode ? 'REPARANDO A HISTÓRIA...' : 'COLAPSANDO ONDAS...')
              : perturbedId
              ? (isLaymanMode ? 'EFEITO DOMINÓ DISPARADO' : 'ONDA CAUSAL DISPARADA')
              : (isLaymanMode ? 'HISTÓRIA SEGURA E ESTÁVEL' : 'CONTINUUM ESTÁVEL')}
          </strong>
        </div>
      </div>
    </div>
  );
}
