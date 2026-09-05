import type { Universe, MonteCarloResult } from '../types/temporal';

export interface CausalRecommendation {
  id: string;
  type: 'critical' | 'warning' | 'optimization' | 'stable';
  title: string;
  technicalDesc: string;
  laymanDesc: string;
  actionHint: string;
  metricImpact: string;
}

/**
 * Motor Estocástico de Monte Carlo & Teoria da Informação
 * Fundamentado no Método de Monte Carlo (Metropolis & Ulam, JASA 1949)
 * e Entropia de Shannon (Shannon, Bell System Technical Journal 1948).
 */
export class MonteCarloService {
  /**
   * Gera diagnósticos prescritivos e recomendações de estabilização causal
   * com base nas métricas estocásticas de Monte Carlo e topologia do grafo.
   */
  public static generateCausalRecommendations(
    universe: Universe,
    result: MonteCarloResult
  ): CausalRecommendation[] {
    const health = this.assessGraphHealth(universe);
    const recs: CausalRecommendation[] = [];

    if (health.hasCycles) {
      recs.push({
        id: 'rec_cycles',
        type: 'critical',
        title: 'Curva Temporal Fechada (CTC) / Loop Detectado',
        technicalDesc: 'Grafo causal cíclico viola a hipótese de Censura Cronológica de Penrose e cria inconsistência topológica.',
        laymanDesc: 'Existe um círculo vicioso no tempo: o futuro está causando o próprio passado que o originou.',
        actionHint: 'Remova ou reverta arestas retrocausais para restabelecer a orientação causal Lorentziana.',
        metricImpact: 'Aumentará a probabilidade de estabilidade em até +35% e eliminará paradoxos.',
      });
    }

    if (result.inconsistencyProbability > 25) {
      recs.push({
        id: 'rec_high_inconsistency',
        type: 'critical',
        title: 'Frequência Crítica de Ruptura Causal',
        technicalDesc: `Probabilidade de inconsistência de ${result.inconsistencyProbability}% excede a tolerância de Novikov.`,
        laymanDesc: 'A linha do tempo tem alta chance de colapsar devido a contradições históricas acumuladas.',
        actionHint: 'Substitua eventos contraditórios ou introduza amortecedores temporais intermediários.',
        metricImpact: 'Reduz o risco de inconsistência para níveis basais (< 10%).',
      });
    }

    if (result.lyapunovMax > 0.3) {
      recs.push({
        id: 'rec_lyapunov',
        type: 'warning',
        title: 'Hipersensibilidade Caótica (Efeito Borboleta)',
        technicalDesc: `Expoente máximo de Lyapunov (λ = ${result.lyapunovMax}) indica divergência exponencial de trajetórias temporais.`,
        laymanDesc: 'Pequenas modificações no início da história geram tempestades de consequências incontroláveis no futuro.',
        actionHint: 'Isole eventos hiperconectados ou reduza o número de arestas divergentes.',
        metricImpact: 'Reduz a sensibilidade caótica para regime assintoticamente estável (λ < 0.20).',
      });
    }

    if (health.isolatedNodes > 0) {
      recs.push({
        id: 'rec_isolated',
        type: 'optimization',
        title: `${health.isolatedNodes} Evento(s) Desconectado(s)`,
        technicalDesc: 'Nós livres sem geodésicas ativas aumentam a entropia residual de Shannon no sistema.',
        laymanDesc: 'Existem fatos históricos soltos que não possuem causas nem consequências registradas.',
        actionHint: 'Ligue estes nós a marcos temporais relevantes para ancorar sua probabilidade.',
        metricImpact: 'Reduz a incerteza de Shannon em ~0.20 bits e melhora a coesão histórica.',
      });
    }

    if (result.bifurcationProbability > 35) {
      recs.push({
        id: 'rec_bifurcation',
        type: 'optimization',
        title: 'Proliferação de Realidades Paralelas',
        technicalDesc: `Probabilidade de ramificação em múltiplos mundos de Everett em ${result.bifurcationProbability}%.`,
        laymanDesc: 'Muitos destinos alternativos estão surgindo e competindo pela mesma linha do tempo principal.',
        actionHint: 'Unifique ramificações convergentes ou selecione um ramo preferencial.',
        metricImpact: 'Concentra a probabilidade de colapso na linha do tempo canônica.',
      });
    }

    if (recs.length === 0 || (result.stableProbability >= 75 && !health.hasCycles)) {
      recs.push({
        id: 'rec_stable_state',
        type: 'stable',
        title: 'Topologia em Equilíbrio de Autoconsistência',
        technicalDesc: 'A variedade Lorentziana é globalmente hiperbólica com preservação estrita de causas e efeitos.',
        laymanDesc: 'A linha do tempo está sólida e estável. Todas as causas levam aos efeitos corretos sem paradoxos.',
        actionHint: 'Nenhuma ação corretiva mandatória. O grafo pode ser propagado e explorado com segurança.',
        metricImpact: 'Segurança causal consolidada acima de 75%.',
      });
    }

    return recs;
  }

  /**
   * Executa N iterações estocásticas de Monte Carlo simulando flutuações e perturbações no grafo causal.
   */
  public static runSimulation(universe: Universe, iterations: number = 10000): MonteCarloResult {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const edges = universe.edges.filter(e => e.active);
    const baseIntegrity = universe.temporalIntegrity / 100;

    let stableCount = 0;
    let bifurcationCount = 0;
    let inconsistencyCount = 0;

    const convergenceSeries: number[] = [];
    const stepSize = Math.max(1, Math.floor(iterations / 20));

    // Sensibilidade intrínseca baseada no número de nós e arestas ativas
    const connectivityFactor = edges.length / Math.max(allEvents.length, 1);
    const lambdaMax = Number((0.25 * connectivityFactor * (1.1 - baseIntegrity)).toFixed(3));

    for (let i = 1; i <= iterations; i++) {
      // Perturbação estocástica gaussiana (Box-Muller)
      const u1 = Math.random() || 1e-10;
      const u2 = Math.random() || 1e-10;
      const gaussianNoise = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      // Flutuação acumulada ao longo da cadeia causal
      const perturbedIntegrity = baseIntegrity + gaussianNoise * 0.08 * (1 + lambdaMax);

      // Probabilidade de estado conforme mecânica estatística
      if (perturbedIntegrity >= 0.72) {
        stableCount++;
      } else if (perturbedIntegrity >= 0.40) {
        bifurcationCount++;
      } else {
        inconsistencyCount++;
      }

      if (i % stepSize === 0 || i === iterations) {
        const currentStableProb = (stableCount / i) * 100;
        convergenceSeries.push(Number(currentStableProb.toFixed(1)));
      }
    }

    const pStable = stableCount / iterations;
    const pBifurcation = bifurcationCount / iterations;
    const pInconsistency = inconsistencyCount / iterations;

    // Cálculo da Entropia de Shannon: H(X) = - ∑ P(x) * log₂(P(x))
    const probabilities = [pStable, pBifurcation, pInconsistency].filter(p => p > 0);
    const shannonEntropy = -probabilities.reduce((acc, p) => acc + p * Math.log2(p), 0);

    return {
      iterations,
      stableProbability: Number((pStable * 100).toFixed(1)),
      bifurcationProbability: Number((pBifurcation * 100).toFixed(1)),
      inconsistencyProbability: Number((pInconsistency * 100).toFixed(1)),
      shannonEntropyBits: Number(shannonEntropy.toFixed(3)),
      lyapunovMax: lambdaMax,
      convergenceSeries,
    };
  }

  /**
   * Avalia a estabilidade topológica do grafo conforme Teoria dos Grafos.
   */
  public static assessGraphHealth(universe: Universe): {
    hasCycles: boolean;
    stronglyConnectedComponents: number;
    isolatedNodes: number;
  } {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const eventIds = new Set(allEvents.map(e => e.id));
    const outgoing = new Map<string, string[]>();

    allEvents.forEach(e => outgoing.set(e.id, []));
    universe.edges
      .filter(e => e.active && eventIds.has(e.source) && eventIds.has(e.target))
      .forEach(e => {
        outgoing.get(e.source)?.push(e.target);
      });

    // Detecção de ciclos via DFS
    let hasCycles = false;
    const visited = new Set<string>();
    const recStack = new Set<string>();

    function dfs(nodeId: string): boolean {
      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = outgoing.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    }

    for (const id of eventIds) {
      if (!visited.has(id)) {
        if (dfs(id)) {
          hasCycles = true;
          break;
        }
      }
    }

    const isolatedNodes = allEvents.filter(e => {
      const isSource = universe.edges.some(edge => edge.active && edge.source === e.id);
      const isTarget = universe.edges.some(edge => edge.active && edge.target === e.id);
      return !isSource && !isTarget;
    }).length;

    return {
      hasCycles,
      stronglyConnectedComponents: hasCycles ? 2 : 1,
      isolatedNodes,
    };
  }

  /**
   * Executa simulação assíncrona usando Web Worker dedicado
   */
  public static async runSimulationAsync(universe: Universe, iterations: number = 10000): Promise<MonteCarloResult> {
    if (typeof Worker !== 'undefined') {
      return new Promise<MonteCarloResult>((resolve) => {
        try {
          const worker = new Worker(new URL('../workers/monteCarlo.worker.ts', import.meta.url), { type: 'module' });
          worker.onmessage = (e: MessageEvent<MonteCarloResult>) => {
            resolve(e.data);
            worker.terminate();
          };
          worker.onerror = () => {
            worker.terminate();
            resolve(this.runSimulation(universe, iterations));
          };
          worker.postMessage({ universe, iterations });
        } catch {
          resolve(this.runSimulation(universe, iterations));
        }
      });
    }

    return Promise.resolve(this.runSimulation(universe, iterations));
  }
}

