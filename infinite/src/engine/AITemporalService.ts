import type {
  Universe,
  TemporalEvent,
  Paradox,
  AIConfig,
  AIButterflyResult,
  AIFutureScenario,
  AIParadoxResolution,
} from '../types/temporal';
import { EventStatus, CausalRelation } from '../types/temporal';
import { SimulationService } from './SimulationService';

export class AITemporalService {
  private static config: AIConfig = {
    provider: 'builtin',
    autoButterflyEnabled: true,
  };

  public static getConfig(): AIConfig {
    return this.config;
  }

  public static updateConfig(newConfig: Partial<AIConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Generates unexpected AI consequences (Butterfly Effect) when an event is altered or erased.
   * Spawns new unexpected anomaly nodes in the timeline!
   */
  public static async simulateUnexpectedButterflyEffect(
    universe: Universe,
    targetEvent: TemporalEvent
  ): Promise<{ result: AIButterflyResult; updatedUniverse: Universe }> {
    // 1. If custom API endpoint is provided, try calling it
    if (this.config.provider === 'custom_api' && this.config.endpoint) {
      try {
        const response = await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
          },
          body: JSON.stringify({
            universeId: universe.id,
            targetEvent,
            currentIntegrity: universe.temporalIntegrity,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return this.applyAIResultToUniverse(universe, targetEvent, data);
        }
      } catch (err) {
        console.warn('Custom AI Endpoint unreachable, falling back to builtin Generative AI Engine:', err);
      }
    }

    // 2. Builtin Generative AI Simulation Engine
    const anomalyPool = [
      {
        title: 'Surgimento da Matéria Escura Sintética',
        year: Math.min(2070, targetEvent.year + 15),
        description: 'A alteração quântica desestabilizou o campo gravitacional terrestre, gerando matéria negra no submundo urbano.',
        category: 'TECNOLÓGICO',
        severity: 'high' as const,
      },
      {
        title: 'Efeito Falso Vácuo & Fratura Cronal',
        year: Math.min(2075, targetEvent.year + 25),
        description: 'Uma micro-fenda temporal abriu-se no oceano Pacifico, enviando ressonâncias para o passado.',
        category: 'CATÁSTROFE',
        severity: 'critical' as const,
      },
      {
        title: 'Colapso da Memória Coletiva',
        year: Math.min(2065, targetEvent.year + 10),
        description: 'A humanidade perdeu simultaneamente a lembrança dos fatos ocorridos entre os anos 2010 e 2020.',
        category: 'HISTÓRICO',
        severity: 'medium' as const,
      },
      {
        title: 'Criação da União Cósmica Ω',
        year: Math.min(2080, targetEvent.year + 30),
        description: 'Uma raça extradimensional interceptou o sinal desestabilizado e iniciou contato pacifico.',
        category: 'DESCOBERTA',
        severity: 'low' as const,
      },
    ];

    const selectedAnomaly = anomalyPool[Math.floor(Math.random() * anomalyPool.length)];
    const impactScore = Math.floor(Math.random() * 35) + 60; // 60 - 95

    const aiResult: AIButterflyResult = {
      impactScore,
      summary: `A alteração no evento "${targetEvent.title}" (${targetEvent.year}) provocou uma reação em cadeia não-linear de nível ${impactScore}%.`,
      unexpectedEffects: [
        `Divergência causal indireta afetando ${Math.floor(Math.random() * 4) + 2} realidades paralelas.`,
        `Deslocamento do eixo quântico em ${Math.floor(Math.random() * 12) + 3} picosegundos.`,
        `Surgimento inesperado da Anomalia "${selectedAnomaly.title}" no ano ${selectedAnomaly.year}.`,
      ],
      generatedAnomalies: [selectedAnomaly],
    };

    return this.applyAIResultToUniverse(universe, targetEvent, aiResult);
  }

  private static applyAIResultToUniverse(
    universe: Universe,
    targetEvent: TemporalEvent,
    aiResult: AIButterflyResult
  ): { result: AIButterflyResult; updatedUniverse: Universe } {
    const dim = universe.dimensions.find(d => d.id === targetEvent.dimensionId) || universe.dimensions[0];
    if (!dim) return { result: aiResult, updatedUniverse: universe };

    // Inject generated anomalies into timeline as real events!
    for (const anomaly of aiResult.generatedAnomalies) {
      const anomalyId = `evt-ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const anomalyEvent: TemporalEvent = {
        id: anomalyId,
        dimensionId: dim.id,
        title: `🤖 [IA] ${anomaly.title}`,
        description: anomaly.description,
        year: anomaly.year,
        category: anomaly.category,
        importance: 88,
        position: { x: Math.min(800, Math.max(100, (anomaly.year - 1950) * 5)), y: 240 + Math.random() * 50 },
        status: EventStatus.DIVERGED,
        parents: [targetEvent.id],
        children: [],
        causes: [targetEvent.id],
        consequences: [],
        isAIAnomaly: true,
      };

      dim.events.push(anomalyEvent);
      universe.edges.push({
        id: `edg-ai-${Date.now()}`,
        source: targetEvent.id,
        target: anomalyId,
        type: CausalRelation.DERIVES,
        active: true,
      });

      targetEvent.children.push(anomalyId);
      targetEvent.consequences.push(anomalyId);
    }

    SimulationService.updateSimulation(universe);
    return { result: aiResult, updatedUniverse: { ...universe } };
  }

  /**
   * Generates 3 unexpected future scenarios with probability metrics.
   */
  public static predictFutures(universe: Universe): AIFutureScenario[] {
    const currentIntegrity = universe.temporalIntegrity;

    return [
      {
        id: 'fut-alpha',
        title: 'Cenário Alpha — Linha Congruente',
        probability: Math.min(85, Math.max(15, Math.round(currentIntegrity * 0.75))),
        predictedIntegrity: Math.min(100, currentIntegrity + 10),
        summary: 'A realidade autocorrigiu as pequenas flutuações e reestabeleceu o fluxo histórico contínuo.',
        keyEvents: ['Estabilização da Dobra Cronal', 'Manutenção dos Registros Primários'],
      },
      {
        id: 'fut-beta',
        title: 'Cenário Beta — Multiverso Divergente',
        probability: Math.round((100 - currentIntegrity) * 0.6),
        predictedIntegrity: Math.max(30, currentIntegrity - 15),
        summary: 'A linha temporal cindiu-se permanentemente em duas ramificações autônomas e incompatíveis.',
        keyEvents: ['Nascimento da Dimensão Ω-03', 'Ruptura das Âncoras Temporais'],
      },
      {
        id: 'fut-gamma',
        title: 'Cenário Gamma — Colapso por Vacuidade',
        probability: Math.max(5, 100 - currentIntegrity - 10),
        predictedIntegrity: 12,
        summary: 'Uma sequência irresolúvel de paradoxos causa a aniquilação completa da causalidade.',
        keyEvents: ['Implosão do Eixo Cronal', 'Desintegração dos Viajantes'],
      },
    ];
  }

  /**
   * Generates 3 AI surgical resolution proposals for active paradoxes.
   */
  public static suggestParadoxResolutions(
    paradox: Paradox,
    events: TemporalEvent[]
  ): AIParadoxResolution[] {
    const originEvent = events.find(e => e.id === paradox.eventId);

    return [
      {
        id: 'res-1',
        title: 'Autocorreção por Causalidade Alternativa',
        description: `Criar uma causa alternativa substituta para "${originEvent?.title || 'o evento de origem'}", mantendo a existência do viajante sem restaurar a linha inteira.`,
        successRate: 85,
        actionType: 'anchor_event',
        targetEventId: originEvent?.id,
      },
      {
        id: 'res-2',
        title: 'Isolamento da Ramificação em Nova Dimensão (Multiverso)',
        description: 'Transferir o evento alterado para uma nova dimensão Ω-03, preservando a linha original intacta.',
        successRate: 92,
        actionType: 'create_branch',
      },
      {
        id: 'res-3',
        title: 'Restauração Estrita do Evento Âncora',
        description: 'Reverter o evento alterado diretamente ao seu estado original estável.',
        successRate: 100,
        actionType: 'restore_origin',
        targetEventId: originEvent?.id,
      },
    ];
  }
}
