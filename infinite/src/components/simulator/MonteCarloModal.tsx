import { useState, useTransition, useId } from 'react';
import type { Universe, MonteCarloResult } from '../../types/temporal';
import { MonteCarloService } from '../../engine/MonteCarloService';
import { useLaymanMode } from '../../context/LaymanModeContext';
import MathFormula from '../MathFormula';

interface Props {
  universe: Universe;
  onClose: () => void;
}

export default function MonteCarloModal({ universe, onClose }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const [iterations, setIterations] = useState<number>(10000);
  const [result, setResult] = useState<MonteCarloResult>(() =>
    MonteCarloService.runSimulation(universe, 10000)
  );
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'overview' | 'convergence'>('overview');

  const gradientId = useId();
  const health = MonteCarloService.assessGraphHealth(universe);

  function handleReRun(n: number) {
    setIterations(n);
    startTransition(() => {
      const res = MonteCarloService.runSimulation(universe, n);
      setResult(res);
    });
  }

  function handleReroll() {
    startTransition(() => {
      const res = MonteCarloService.runSimulation(universe, iterations);
      setResult(res);
    });
  }

  // Max theoretical entropy for 3 discrete states is log2(3) ≈ 1.585 bits
  const maxEntropy = 1.585;
  const entropyPercent = Math.min(100, Math.max(0, (result.shannonEntropyBits / maxEntropy) * 100));

  // Convergence SVG path builder
  const series = result.convergenceSeries || [];
  const minVal = series.length > 0 ? Math.max(0, Math.min(...series) - 5) : 0;
  const maxVal = series.length > 0 ? Math.min(100, Math.max(...series) + 5) : 100;
  const valRange = Math.max(1, maxVal - minVal);

  const svgPoints = series.map((val, idx) => {
    const x = (idx / Math.max(1, series.length - 1)) * 500;
    const y = 140 - ((val - minVal) / valRange) * 110;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const linePath = svgPoints.length > 0 ? `M ${svgPoints.join(' L ')}` : '';
  const areaPath = svgPoints.length > 0 ? `M 0,140 L ${svgPoints.join(' L ')} L 500,140 Z` : '';

  return (
    <div className="sim-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="mc-title">
      <div className="sim-modal-card monte-carlo-card" onClick={e => e.stopPropagation()}>
        {/* Ambient Top Glow */}
        <div className="mc-ambient-glow" />

        {/* Modal Header */}
        <div className="sim-modal-header mc-header">
          <div className="mc-header-info">
            <div className="mc-kicker-badge">
              <span className="mc-pulse-dot" />
              <span className="mc-kicker-text">
                {isLaymanMode ? 'TESTE DE PROBABILIDADES E FUTUROS' : 'MECÂNICA ESTATÍSTICA & ESTOCÁSTICA'}
              </span>
              <span className="mc-method-badge">
                {isLaymanMode ? 'Simulação de Monte Carlo' : 'Metropolis-Ulam (1949)'}
              </span>
            </div>
            <div className="mc-title-row">
              <h2 id="mc-title" className="mc-title">
                {isLaymanMode ? 'Teste de Futuros Possíveis' : 'Simulação de Monte Carlo'}
              </h2>
              <div className="mc-sample-pill">
                <span className="mc-pill-label">
                  {isLaymanMode ? 'Testes Realizados' : 'Amostragem'}
                </span>
                <span className="mc-pill-val">
                  <strong>{iterations.toLocaleString('pt-BR')}</strong>
                </span>
              </div>
            </div>
          </div>
          <button type="button" className="sim-btn-close" onClick={onClose} aria-label="Fechar Modal">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="monte-carlo-body">
          {/* Context Banner */}
          <div className="mc-context-banner">
            <div className="mc-banner-content">
              <p>
                {isLaymanMode
                  ? `O computador rodou ${iterations.toLocaleString('pt-BR')} simulações da linha do tempo para ver quantas vezes o universo continuaria seguro e quantas vezes um conflito histórico aconteceria.`
                  : 'Análise probabilística de estabilidade causal submetida a perturbações quânticas estocásticas via ruído gaussiano de Box-Muller.'}
              </p>
            </div>
            <div className="mc-view-tabs">
              <button
                type="button"
                className={`mc-tab-toggle ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                {isLaymanMode ? 'Resultados' : 'Distribuição'}
              </button>
              <button
                type="button"
                className={`mc-tab-toggle ${activeTab === 'convergence' ? 'active' : ''}`}
                onClick={() => setActiveTab('convergence')}
              >
                {isLaymanMode ? 'Gráfico de Certeza' : 'Convergência (t)'}
              </button>
            </div>
          </div>

          {/* Unified Probability Distribution Strip */}
          <div className="mc-stacked-distribution">
            <div className="mc-stacked-bar">
              <div
                className="mc-seg-stable"
                style={{ width: `${result.stableProbability}%` }}
                title={`Estável: ${result.stableProbability}%`}
              />
              <div
                className="mc-seg-bifurcation"
                style={{ width: `${result.bifurcationProbability}%` }}
                title={`Ramificação: ${result.bifurcationProbability}%`}
              />
              <div
                className="mc-seg-inconsistent"
                style={{ width: `${result.inconsistencyProbability}%` }}
                title={`Inconsistência: ${result.inconsistencyProbability}%`}
              />
            </div>
            <div className="mc-stacked-legend">
              <span className="legend-item stable">
                <i /> {isLaymanMode ? 'História Estável' : 'Estabilidade'} ({result.stableProbability}%)
              </span>
              <span className="legend-item bifurcation">
                <i /> {isLaymanMode ? 'Universo Paralelo' : 'Ramificação'} ({result.bifurcationProbability}%)
              </span>
              <span className="legend-item inconsistent">
                <i /> {isLaymanMode ? 'Conflito / Paradoxo' : 'Inconsistência'} ({result.inconsistencyProbability}%)
              </span>
            </div>
          </div>

          {activeTab === 'overview' ? (
            /* Probability Cards Grid */
            <div className="mc-distribution-grid">
              {/* Stable Card */}
              <div className="mc-gauge-card mc-stable">
                <div className="mc-gauge-header">
                  <div className="mc-badge-indicator stable">
                    <span className="dot" />
                    <span className="label">{isLaymanMode ? 'SEGURO' : 'CLÁSSICO'}</span>
                  </div>
                </div>
                <div className="mc-gauge-main">
                  <div className="mc-gauge-percent-wrapper">
                    <strong className="mc-gauge-percent">{result.stableProbability}%</strong>
                    <span className="mc-gauge-state">
                      {isLaymanMode ? 'Chances de Estabilidade' : 'Prob. de Estabilidade'}
                    </span>
                  </div>
                </div>
                <div className="mc-gauge-track">
                  <div className="mc-gauge-fill fill-stable" style={{ width: `${result.stableProbability}%` }} />
                </div>
                <div className="mc-gauge-sub">
                  <span>
                    {isLaymanMode
                      ? 'A linha do tempo segue seu curso sem nenhuma contradição.'
                      : 'Topologia Causal Globalmente Preservada'}
                  </span>
                </div>
              </div>

              {/* Bifurcation Card */}
              <div className="mc-gauge-card mc-bifurcation">
                <div className="mc-gauge-header">
                  <div className="mc-badge-indicator bifurcation">
                    <span className="dot" />
                    <span className="label">{isLaymanMode ? 'DIVISÃO' : 'EVERETT'}</span>
                  </div>
                </div>
                <div className="mc-gauge-main">
                  <div className="mc-gauge-percent-wrapper">
                    <strong className="mc-gauge-percent">{result.bifurcationProbability}%</strong>
                    <span className="mc-gauge-state">
                      {isLaymanMode ? 'Chances de Criar Realidade Paralela' : 'Prob. de Ramificação'}
                    </span>
                  </div>
                </div>
                <div className="mc-gauge-track">
                  <div className="mc-gauge-fill fill-bifurcation" style={{ width: `${result.bifurcationProbability}%` }} />
                </div>
                <div className="mc-gauge-sub">
                  <span>
                    {isLaymanMode
                      ? 'A história se divide em dois caminhos sem colapsar a original.'
                      : 'Bifurcação no Espaço de Hilbert'}
                  </span>
                </div>
              </div>

              {/* Inconsistency Card */}
              <div className="mc-gauge-card mc-inconsistency">
                <div className="mc-gauge-header">
                  <div className="mc-badge-indicator inconsistency">
                    <span className="dot" />
                    <span className="label">{isLaymanMode ? 'RISCO' : 'PARADOXO'}</span>
                  </div>
                </div>
                <div className="mc-gauge-main">
                  <div className="mc-gauge-percent-wrapper">
                    <strong className="mc-gauge-percent">{result.inconsistencyProbability}%</strong>
                    <span className="mc-gauge-state">
                      {isLaymanMode ? 'Risco de Paradoxo' : 'Ruptura de Cauchy'}
                    </span>
                  </div>
                </div>
                <div className="mc-gauge-track">
                  <div className="mc-gauge-fill fill-inconsistent" style={{ width: `${result.inconsistencyProbability}%` }} />
                </div>
                <div className="mc-gauge-sub">
                  <span>
                    {isLaymanMode
                      ? 'Risco de um acontecimento impossível destruir as causas do passado.'
                      : 'Ciclos de Negação e Loops Temporais'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Live Convergence Sparkline Chart */
            <div className="mc-convergence-container">
              <div className="mc-convergence-header">
                <div>
                  <span className="mc-chart-title">
                    {isLaymanMode ? 'Estabilidade ao Longo dos Testes' : 'Curva de Convergência da Amostragem'}
                  </span>
                  <span className="mc-chart-subtitle">
                    {isLaymanMode
                      ? `Conforme rodamos ${iterations.toLocaleString('pt-BR')} testes, o resultado final se estabilizou em:`
                      : `Evolução da probabilidade estável ao longo de ${iterations.toLocaleString('pt-BR')} iterações`}
                  </span>
                </div>
                <div className="mc-convergence-stat">
                  <span>{isLaymanMode ? 'Resultado Final:' : 'Valor Assintótico:'}</span>
                  <strong>{result.stableProbability}%</strong>
                </div>
              </div>
              <div className="mc-chart-wrapper">
                <svg viewBox="0 0 500 150" className="mc-convergence-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`grad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  
                  {/* Fill Area */}
                  {areaPath && <path d={areaPath} fill={`url(#grad-${gradientId})`} />}
                  {/* Main Line */}
                  {linePath && <path d={linePath} fill="none" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" />}
                </svg>
              </div>
              <div className="mc-chart-axis">
                <span>0 testes</span>
                <span>{(iterations / 2).toLocaleString('pt-BR')} testes</span>
                <span>{iterations.toLocaleString('pt-BR')} testes</span>
              </div>
            </div>
          )}

          {/* Indicators */}
          <div className="mc-stats-panel">
            {/* Shannon Entropy */}
            <div className="mc-stat-box">
              <div className="mc-stat-head">
                <span className="mc-stat-label">
                  {isLaymanMode ? 'INCERTEZA DO FUTURO' : 'ENTROPIA DE SHANNON'}
                </span>
                <span className="mc-stat-symbol">
                  <MathFormula math="H(X)" />
                </span>
              </div>
              <div className="mc-stat-val-group">
                <strong className="mc-stat-number">{result.shannonEntropyBits}</strong>
                <span className="mc-stat-unit">bits</span>
              </div>
              <div className="mc-mini-entropy-bar">
                <div className="mc-mini-entropy-fill" style={{ width: `${entropyPercent}%` }} />
              </div>
              <div className="mc-stat-sub-text">
                {isLaymanMode
                  ? (entropyPercent < 30 ? 'Futuro altamente previsível e seguro' : 'Múltiplas ramificações em aberto')
                  : 'Nível de informação desordenada'}
              </div>
            </div>

            {/* Lyapunov Exponent */}
            <div className="mc-stat-box">
              <div className="mc-stat-head">
                <span className="mc-stat-label">
                  {isLaymanMode ? 'EFEITO BORBOLETA' : 'EXPOENTE DE LYAPUNOV'}
                </span>
                <span className="mc-stat-symbol">
                  <MathFormula math="\lambda" />
                </span>
              </div>
              <div className="mc-stat-val-group">
                <strong
                  className="mc-stat-number"
                  style={{ color: result.lyapunovMax > 0.3 ? 'var(--color-amber)' : 'var(--color-emerald)' }}
                >
                  {result.lyapunovMax}
                </strong>
                <span
                  className={`mc-status-pill ${result.lyapunovMax > 0.3 ? 'chaotic' : 'stable'}`}
                >
                  {result.lyapunovMax > 0.3 ? (isLaymanMode ? 'Sensível a Mudanças' : 'Caótico') : (isLaymanMode ? 'Estável' : 'Estável')}
                </span>
              </div>
              <div className="mc-stat-sub-text">
                {isLaymanMode
                  ? (result.lyapunovMax > 0.3 ? 'Pequenas mudanças no passado causam grandes diferenças no futuro' : 'Pequenas mudanças não afetam o rumo geral da história')
                  : (result.lyapunovMax > 0.3 ? 'Divergência exponencial de trajetórias' : 'Convergência e estabilidade dinâmica')}
              </div>
            </div>

            {/* Graph Health */}
            <div className="mc-stat-box">
              <div className="mc-stat-head">
                <span className="mc-stat-label">
                  {isLaymanMode ? 'ESTRUTURA DA HISTÓRIA' : 'TOPOLOGIA DO GRAFO'}
                </span>
                <span className="mc-stat-symbol">
                  <MathFormula math="G(V, E)" />
                </span>
              </div>
              <div className="mc-stat-val-group">
                <strong
                  className="mc-topology-status"
                  style={{ color: health.hasCycles ? 'var(--color-coral)' : 'var(--color-cyan)' }}
                >
                  {health.hasCycles
                    ? (isLaymanMode ? 'Loop no Tempo (Preso)' : 'Grafo Cíclico (CTC)')
                    : (isLaymanMode ? 'Linha Livre e Sem Loops' : 'DAG Acíclico Puro')}
                </strong>
              </div>
              <div className="mc-stat-sub-badges">
                <span className="mc-info-chip">
                  <strong>{health.stronglyConnectedComponents}</strong> {isLaymanMode ? 'cadeias de causa' : 'comp. conexos'}
                </span>
                <span className="mc-info-chip">
                  <strong>{health.isolatedNodes}</strong> {isLaymanMode ? 'eventos livres' : 'nós livres'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Iterations Footer */}
          <div className="mc-actions-footer">
            <div className="mc-iteration-controls">
              <span className="mc-iter-label">{isLaymanMode ? 'Quantidade de Testes:' : 'Iterações (N):'}</span>
              <div className="mc-iteration-buttons">
                {[1000, 10000, 50000, 100000].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`btn-mc-iter ${iterations === n ? 'active' : ''}`}
                    onClick={() => handleReRun(n)}
                    disabled={isPending}
                  >
                    {n >= 1000 ? `${(n / 1000).toLocaleString('pt-BR')}k` : n}
                  </button>
                ))}
              </div>
            </div>

            <div className="mc-footer-right">
              <button
                type="button"
                className="btn-mc-reroll"
                onClick={handleReroll}
                disabled={isPending}
                title={isLaymanMode ? 'Rodar novos testes com outra combinação aleatória' : 'Executar novamente com nova semente estocástica'}
              >
                <span>{isPending ? 'Simulando...' : (isLaymanMode ? 'Rodar Novos Testes' : 'Re-simular')}</span>
              </button>

              <button type="button" className="sim-btn-primary mc-btn-close-action" onClick={onClose}>
                {isLaymanMode ? 'Fechar Análise' : 'Concluir Análise'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
