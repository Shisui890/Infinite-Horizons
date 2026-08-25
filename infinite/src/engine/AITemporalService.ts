import type {
  Universe,
  TemporalEvent,
  Paradox,
  AIConfig,
  AIButterflyResult,
  AIUniverseInsight,
  HistoricalResearch,
  AIFutureScenario,
  AIParadoxResolution,
  SimulationLog,
  Dimension,
  ScientificExplanation,
} from '../types/temporal';
import { EventStatus, CausalRelation } from '../types/temporal';
import { SimulationService } from './SimulationService';

export class AITemporalService {
  private static config: AIConfig = {
    provider: import.meta.env.VITE_AI_PROVIDER === 'builtin' ? 'builtin' : 'custom_api',
    endpoint: import.meta.env.VITE_AI_ENDPOINT || '/api/temporal',
    autoButterflyEnabled: true,
  };

  public static getConfig(): AIConfig {
    return this.config;
  }

  public static updateConfig(newConfig: Partial<AIConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public static async researchHistoricalEvent(query: string): Promise<HistoricalResearch> {
    const endpoint = this.config.endpoint;
    if (this.config.provider === 'custom_api' && endpoint) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'historical_event_research', query, language: 'pt-BR' }),
      });
      if (response.ok) {
        const data = await response.json() as Partial<HistoricalResearch>;
        if (data.title && data.description && data.year) {
          return {
            title: data.title,
            description: data.description,
            year: Number(data.year),
            category: data.category || 'HISTÓRICO',
            importance: Number(data.importance) || 75,
            source: data.source || 'Provedor de IA configurado',
            evidenceKind: data.evidenceKind || 'documented_fact',
            confidence: Number(data.confidence) || 70,
            uncertainty: data.uncertainty,
          };
        }
      }
    }

    const response = await fetch(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.trim().replace(/\s+/g, '_'))}`
    );
    if (!response.ok) throw new Error('Evento histórico não encontrado.');
    const data = await response.json() as { title?: string; extract?: string; content_urls?: { desktop?: { page?: string } } };
    const yearMatch = `${data.title || query} ${data.extract || ''}`.match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
    return {
      title: data.title || query.trim(),
      description: data.extract || 'Resumo histórico indisponível para este evento.',
      year: yearMatch ? Number(yearMatch[1]) : new Date().getFullYear(),
      category: 'HISTÓRICO',
      importance: 75,
      source: data.content_urls?.desktop?.page || 'Wikimedia / Wikipédia',
      evidenceKind: 'documented_fact',
      confidence: 78,
      uncertainty: 'Resumo de fonte pública; verifique a referência original para uso acadêmico.',
    };
  }

  public static async createUniverseFromTopic(topic: string, mode: 'historical' | 'theoretical' = 'historical'): Promise<{ universe: Universe; logs: SimulationLog[] }> {
    const endpoint = this.config.endpoint;
    if (this.config.provider === 'custom_api' && endpoint) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'create_temporal_universe',
          topic,
          mode,
          language: 'pt-BR',
          schema: 'Return JSON with universeName, description and events: title, description, year, category, importance, sourceUrl, causes. Use only documented observations or established scientific theories. Mark uncertainty in descriptions. Never invent people, discoveries, measurements or sources.',
        }),
      });
      if (response.ok) {
        const data = await response.json() as {
          universeName?: string;
          description?: string;
          events?: Array<Partial<TemporalEvent> & { causes?: string[] }>;
        };
        if (data.events && data.events.length >= 2) {
          return this.buildGeneratedUniverse(topic, data.universeName, data.description, data.events, mode);
        }
      }
    }

    const response = await fetch(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.trim().replace(/\s+/g, '_'))}`
    );
    if (!response.ok) throw new Error('Não encontrei uma fonte para este tema. Tente ser mais específico.');
    const data = await response.json() as { title?: string; extract?: string; content_urls?: { desktop?: { page?: string } } };
    const sentences = (data.extract || '').split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 8);
    if (sentences.length < 2) throw new Error('A fonte retornou pouco contexto para criar uma linha temporal.');
    const years = Array.from(data.extract || '').join('').match(/\b(1[0-9]{3}|20[0-9]{2})\b/g)?.map(Number) || [];
    const events: Array<Partial<TemporalEvent> & { causes?: string[] }> = sentences.map((sentence, index) => ({
      title: sentence.length > 72 ? `${sentence.slice(0, 69)}...` : sentence,
      description: sentence,
      year: years[index] || (years[0] || 1900) + index * 5,
      category: 'HISTÓRICO',
      importance: Math.max(55, 95 - index * 6),
      sourceUrl: data.content_urls?.desktop?.page,
      evidenceKind: mode === 'theoretical' ? 'scientific_theory' as const : 'documented_fact' as const,
      evidenceConfidence: mode === 'theoretical' ? 65 : 78,
      uncertainty: mode === 'theoretical' ? 'Modelo dependente das premissas e sem valor de previsão factual.' : undefined,
      causes: index > 0 ? [`generated-${index - 1}`] : [],
    }));
    return this.buildGeneratedUniverse(data.title || topic, `${data.title || topic} — Linha de investigação`, data.extract, events, mode);
  }

  private static buildGeneratedUniverse(
    topic: string,
    name: string | undefined,
    description: string | undefined,
    sourceEvents: Array<Partial<TemporalEvent> & { causes?: string[] }>,
    mode: 'historical' | 'theoretical' = 'historical'
  ): { universe: Universe; logs: SimulationLog[] } {
    const dimensionId = `dim-generated-${Date.now()}`;
    const universeId = `univ-generated-${Date.now()}`;
    const orderedEvents = sourceEvents
      .filter(event => event.title && Number.isFinite(Number(event.year)))
      .sort((a, b) => Number(a.year) - Number(b.year));
    const events: TemporalEvent[] = orderedEvents.map((event, index) => {
      const id = `generated-${index}`;
      const causes = (event.causes || [])
        .map(cause => {
          const indexMatch = String(cause).match(/^\[?(\d+)\]?$/);
          return indexMatch ? `generated-${indexMatch[1]}` : String(cause);
        })
        .filter(cause => orderedEvents.some(candidate => candidate.id === cause) || cause.startsWith('generated-'));
      const normalizedCauses = causes.length || index === 0 ? causes : [`generated-${index - 1}`];
      return {
        id,
        dimensionId,
        title: String(event.title),
        description: event.description,
        sourceUrl: event.sourceUrl,
        evidenceKind: event.evidenceKind || 'inference',
        evidenceConfidence: event.evidenceConfidence || 60,
        uncertainty: event.uncertainty,
        year: Number(event.year),
        category: event.category || 'HISTÓRICO',
        importance: Math.max(1, Math.min(100, Number(event.importance) || 70)),
        position: { x: Math.min(800, Math.max(100, index * 140 + 100)), y: 150 + (index % 3) * 80 },
        status: EventStatus.STABLE,
        parents: normalizedCauses,
        children: [],
        causes: normalizedCauses,
        consequences: [],
        isAnchor: index === 0 || index === orderedEvents.length - 1,
      };
    });
    const edges = events.slice(1).map((event, index) => ({
      id: `edge-generated-${index}`,
      source: events[index].id,
      target: event.id,
      type: CausalRelation.CAUSES,
      active: true,
      confidence: 55,
      evidence: 'Relação inferida pela ordem e pelo contexto do material pesquisado.',
    }));
    events.forEach((event, index) => {
      if (events[index + 1]) {
        event.children = [events[index + 1].id];
        event.consequences = [events[index + 1].id];
      }
    });
    const dimension: Dimension = {
      id: dimensionId,
      universeId,
      name: 'Linha gerada por IA',
      designation: 'GEN-01',
      color: '#00d4ff',
      events,
      integrity: 100,
    };
    const universe: Universe = {
      id: universeId,
      name: name || `${topic} — Experimento temporal`,
      description: mode === 'theoretical'
        ? `Modelo teórico baseado em ${description || topic}. O modelo organiza observações e teorias publicadas; seus resultados são dependentes das premissas e não substituem evidência.`
        : description,
      temporalIntegrity: 100,
      dimensions: [dimension],
      travelers: [],
      edges,
      paradoxes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return {
      universe,
      logs: [{
        id: `log-generated-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        message: `${mode === 'theoretical' ? 'Modelo teórico' : 'Linha histórica'} criado para "${topic}" com ${events.length} eventos pesquisados.`,
        type: 'success',
      }],
    };
  }

  public static analyzeUniverse(universe: Universe): AIUniverseInsight {
    const events = universe.dimensions.flatMap(dimension => dimension.events);
    const connectedIds = new Set(universe.edges.flatMap(edge => [edge.source, edge.target]));
    const exposedEvents = events.filter(event =>
      [EventStatus.ALTERED, EventStatus.UNSTABLE, EventStatus.PARADOXICAL, EventStatus.DIVERGED].includes(event.status)
    ).length;
    const affectedTravelers = universe.travelers.filter(traveler => traveler.status !== 'normal').length;
    const paradoxPressure = universe.paradoxes.length * 12;
    const exposurePressure = events.length ? (exposedEvents / events.length) * 35 : 0;
    const connectivityBonus = events.length ? (connectedIds.size / events.length) * 10 : 0;
    const risk = Math.max(0, Math.min(100, 100 - universe.temporalIntegrity + paradoxPressure + exposurePressure - connectivityBonus));
    const health = risk >= 55 ? 'critical' : risk >= 25 ? 'watch' : 'stable';
    const healthLabel = health === 'critical' ? 'RISCO CRÍTICO' : health === 'watch' ? 'SOB OBSERVAÇÃO' : 'LINHA ESTÁVEL';
    const recommendation = health === 'critical'
      ? 'Isole a ramificação de maior risco antes de alterar novos eventos.'
      : health === 'watch'
      ? 'Investigue os eventos expostos e ancore uma causa antes da próxima viagem.'
      : 'A realidade tem margem. Simule uma intervenção e observe a propagação causal.';

    return {
      health,
      healthLabel,
      confidence: Math.min(99, Math.round(68 + Math.min(28, events.length * 3) + (universe.edges.length ? 4 : 0))),
      eventCount: events.length,
      exposedEvents,
      connectedEvents: connectedIds.size,
      affectedTravelers,
      recommendation,
    };
  }

  public static explainEventWithPhysics(event: TemporalEvent): ScientificExplanation[] {
    const causalLinks = event.causes.length + event.consequences.length;
    return [
      {
        title: 'Relatividade geral',
        status: 'established',
        statusLabel: 'TEORIA CONSOLIDADA',
        explanation: `A relatividade geral descreve gravidade como geometria do espaço-tempo. Neste modelo, ${causalLinks} relação(ões) conectam o evento; o eixo de anos representa ordem histórica, não uma viagem física no tempo.`,
      },
      {
        title: 'Teoria do caos',
        status: 'supported',
        statusLabel: 'EVIDÊNCIA EXPERIMENTAL',
        explanation: event.consequences.length
          ? `O evento tem ${event.consequences.length} consequência(s) registrada(s). Pequenas mudanças nas condições iniciais podem produzir trajetórias muito diferentes em sistemas sensíveis, o princípio conhecido como efeito borboleta.`
          : 'Sem consequências registradas ainda. O efeito borboleta só pode ser estimado depois que relações e condições iniciais forem definidas.',
      },
      {
        title: 'Teoria das cordas',
        status: 'speculative',
        statusLabel: 'NÃO CONFIRMADA',
        explanation: 'A teoria das cordas é uma proposta matemática para unificar gravidade e física quântica. Ela admite dimensões extras em alguns modelos, mas não há confirmação experimental; portanto, não é usada aqui como evidência da existência de universos paralelos.',
      },
    ];
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

    // Offline mode stays grounded in the actual causal graph. It does not invent facts.
    const allEvents = universe.dimensions.flatMap(dimension => dimension.events);
    const descendants = new Set<string>();
    const pending = [targetEvent.id];
    while (pending.length) {
      const currentId = pending.pop();
      if (!currentId || descendants.has(currentId)) continue;
      descendants.add(currentId);
      const current = allEvents.find(event => event.id === currentId);
      current?.children.forEach(childId => pending.push(childId));
    }
    const impactScore = Math.min(100, Math.round((descendants.size / Math.max(1, allEvents.length)) * 70 + targetEvent.importance * 0.3));

    const aiResult: AIButterflyResult = {
      impactScore,
      summary: `A intervenção em "${targetEvent.title}" alcança ${descendants.size} evento(s) na cadeia causal observada. O índice mede exposição do modelo, não uma previsão factual.`,
      unexpectedEffects: [
        `${descendants.size - 1} consequência(s) dependente(s) podem ser reavaliada(s) pelo motor.`,
        `${targetEvent.children.length} relação(ões) causal(is) saem diretamente deste evento.`,
        'A interpretação depende das fontes e das relações definidas no modelo.',
      ],
      generatedAnomalies: [],
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
        title: `[IA] ${anomaly.title}`,
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
        keyEvents: ['Continuidade das relações observadas', 'Preservação das evidências primárias'],
      },
      {
        id: 'fut-beta',
        title: 'Cenário Beta — Multiverso Divergente',
        probability: Math.round((100 - currentIntegrity) * 0.6),
        predictedIntegrity: Math.max(30, currentIntegrity - 15),
        summary: 'A linha temporal cindiu-se permanentemente em duas ramificações autônomas e incompatíveis.',
        keyEvents: ['Aumento de eventos em divergência', 'Redução da integridade do modelo'],
      },
      {
        id: 'fut-gamma',
        title: 'Cenário Gamma — Colapso por Vacuidade',
        probability: Math.max(5, 100 - currentIntegrity - 10),
        predictedIntegrity: 12,
        summary: 'Uma sequência irresolúvel de paradoxos causa a aniquilação completa da causalidade.',
        keyEvents: ['Perda de consistência causal', 'Necessidade de revisar as premissas'],
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
        description: `Criar uma relação causal alternativa para "${originEvent?.title || 'o evento de origem'}", preservando o restante do modelo para comparação.`,
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
