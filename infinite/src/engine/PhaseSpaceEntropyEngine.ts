// ====================================================================
// MOTOR DE DIAGRAMA DE FASE & ENTROPIA DE SHANNON (MÉTRICAS DE LYAPUNOV)
// Calcula entropia informacional, expoente de estabilidade e espaço de fase causal
// ====================================================================

import type { TemporalEvent, Universe } from '../types/temporal';

export interface PhaseSpacePoint {
  year: number;
  entropyS: number;       // S = -∑ p_i ln(p_i)
  entropyRateDotS: number; // dS/dt
  divergenceDistance: number; // Distância informacional relativa à linha alfa
  stabilityRegime: 'ATRATOR CONVERGENTE' | 'FLUTUAÇÃO QUASE-ESTÁVEL' | 'DIVERGÊNCIA CAÓTICA';
}

export interface PhaseSpaceMetricsResult {
  shannonEntropyCurrent: number;
  shannonEntropyBaseline: number;
  entropyDelta: number;
  lyapunovExponentLambda: number;
  isChaoticDivergence: boolean;
  kullbackLeiblerDivergence: number;
  trajectoryPoints: PhaseSpacePoint[];
  interpretiveSummary: string;
}

export class PhaseSpaceEntropyEngine {
  /**
   * Calcula a distribuição de probabilidades empírica dos eventos por categoria e importância
   */
  private static calculateProbabilityDistribution(events: TemporalEvent[]): number[] {
    if (events.length === 0) return [1];

    const categoryWeights: Record<string, number> = {};
    let totalWeight = 0;

    events.forEach(e => {
      const w = Math.max(1, e.importance || 50);
      categoryWeights[e.category] = (categoryWeights[e.category] || 0) + w;
      totalWeight += w;
    });

    return Object.values(categoryWeights).map(w => w / (totalWeight || 1));
  }

  /**
   * Calcula a Entropia de Shannon em nats: S = -∑ p_i * ln(p_i)
   */
  public static calculateShannonEntropy(events: TemporalEvent[]): number {
    const probs = this.calculateProbabilityDistribution(events);
    let entropy = 0;

    probs.forEach(p => {
      if (p > 0) {
        entropy -= p * Math.log(p);
      }
    });

    return parseFloat(entropy.toFixed(4));
  }

  /**
   * Calcula o Expoente Máximo de Lyapunov (λ)
   * λ < 0: O grafo temporal absorve perturbações e se autocura (atrator histórico).
   * λ > 0: As perturbações se amplificam exponencialmente (caos / efeito borboleta).
   */
  public static calculateLyapunovExponent(
    originalEvents: TemporalEvent[],
    modifiedEvents: TemporalEvent[],
    epistemicDelayYears: number
  ): number {
    const delta0 = 1.0; // Perturbação inicial normalizada
    const sOriginal = this.calculateShannonEntropy(originalEvents);
    const sModified = this.calculateShannonEntropy(modifiedEvents);

    const deltaEntropy = Math.abs(sModified - sOriginal);
    const deltaT = Math.max(1, epistemicDelayYears);

    // λ = (1 / Δt) * ln(δx_t / δx_0)
    const ratio = Math.max(0.01, 1.0 + deltaEntropy * 2.5);
    const lambda = (1 / deltaT) * Math.log(ratio / delta0);

    return parseFloat(lambda.toFixed(4));
  }

  /**
   * Gera a análise completa do espaço de fase e a trajetória temporal (S, dS/dt)
   */
  public static computePhaseSpaceAnalysis(
    universe: Universe,
    targetEvent: TemporalEvent,
    epistemicDelayYears: number
  ): PhaseSpaceMetricsResult {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const remainingEvents = allEvents.filter(e => e.id !== targetEvent.id);

    const sBaseline = this.calculateShannonEntropy(allEvents);
    const sCurrent = this.calculateShannonEntropy(remainingEvents);
    const entropyDelta = parseFloat((sCurrent - sBaseline).toFixed(4));

    const lambda = this.calculateLyapunovExponent(allEvents, remainingEvents, epistemicDelayYears);
    const isChaotic = lambda > 0.04;

    // Divergência de Kullback-Leibler aproximada entre distribuições
    const klDivergence = parseFloat((Math.abs(entropyDelta) * 1.414).toFixed(4));

    // Trajetória do espaço de fase por séculos
    const trajectoryPoints: PhaseSpacePoint[] = [];
    const minYear = Math.min(...allEvents.map(e => e.year), 1800);
    const maxYear = Math.max(...allEvents.map(e => e.year), 2030);

    const step = Math.max(20, Math.floor((maxYear - minYear) / 6));

    let prevEntropy = sBaseline;
    for (let yr = minYear; yr <= maxYear; yr += step) {
      const sliceEvents = allEvents.filter(e => e.year <= yr);
      const sYr = this.calculateShannonEntropy(sliceEvents);
      const dSdt = parseFloat(((sYr - prevEntropy) / (step || 1)).toFixed(4));
      prevEntropy = sYr;

      const isPostPerturbation = yr >= targetEvent.year;
      const pointEntropy = isPostPerturbation ? sYr + entropyDelta * 0.7 : sYr;
      const dist = isPostPerturbation ? Math.abs(entropyDelta) : 0;

      const regime =
        dist > 0.35
          ? 'DIVERGÊNCIA CAÓTICA'
          : dist > 0.1
          ? 'FLUTUAÇÃO QUASE-ESTÁVEL'
          : 'ATRATOR CONVERGENTE';

      trajectoryPoints.push({
        year: yr,
        entropyS: parseFloat(pointEntropy.toFixed(3)),
        entropyRateDotS: dSdt,
        divergenceDistance: parseFloat(dist.toFixed(3)),
        stabilityRegime: regime,
      });
    }

    const summary = isChaotic
      ? `Expoente de Lyapunov positivo (λ = ${lambda} ano⁻¹). A anulação de "${targetEvent.title}" desencadeia divergência caótica no espaço de fase histórico, exigindo reorganização de múltiplos ramos causais.`
      : `Expoente de Lyapunov moderado/convergente (λ = ${lambda} ano⁻¹). O tecido histórico comporta-se como um atrator de resiliência, com taxa de recomposição equilibrada após ~${epistemicDelayYears} anos.`;

    return {
      shannonEntropyCurrent: sCurrent,
      shannonEntropyBaseline: sBaseline,
      entropyDelta,
      lyapunovExponentLambda: lambda,
      isChaoticDivergence: isChaotic,
      kullbackLeiblerDivergence: klDivergence,
      trajectoryPoints,
      interpretiveSummary: summary,
    };
  }
}
