import type { TemporalEvent, Traveler, CausalEdge, Paradox } from '../types/temporal';
import { ParadoxType, ParadoxSeverity, EventStatus } from '../types/temporal';
import { GraphEngine } from './GraphEngine';

export class ParadoxEngine {
  public static detectParadoxes(
    events: TemporalEvent[],
    travelers: Traveler[],
    edges: CausalEdge[]
  ): Paradox[] {
    const paradoxes: Paradox[] = [];
    const eventsMap = new Map<string, TemporalEvent>(events.map(e => [e.id, { ...e }]));

    // 1. Paradoxo do Avô (Inconsistência de Contorno de Novikov)
    for (const traveler of travelers) {
      if (!traveler.originEventId) continue;

      const originEvent = eventsMap.get(traveler.originEventId);
      if (!originEvent) continue;

      if (
        originEvent.status === EventStatus.ERASED ||
        originEvent.status === EventStatus.COLLAPSED ||
        originEvent.status === EventStatus.PARADOXICAL
      ) {
        paradoxes.push({
          id: `pdx-gf-${traveler.id}`,
          type: ParadoxType.GRANDFATHER_PARADOX,
          severity: ParadoxSeverity.CRITICAL,
          title: `Inconsistência de Novikov — ${traveler.name}`,
          description: `O referencial de observação "${traveler.name}" teve sua premissa de contorno fundamental (${originEvent.title}) desestabilizada. O Princípio de Autoconsistência de Novikov impõe a anulação de soluções incompatíveis com a métrica global.`,
          dimensionId: traveler.currentDimensionId,
          eventId: originEvent.id,
          travelerId: traveler.id,
          causalChain: Array.from(GraphEngine.getAncestors(originEvent.id, edges)).concat(originEvent.id),
        });
      }
    }

    // 2. Loops Causais & Paradoxo de Bootstrap (Informação Sem Origem Causal)
    const cycles = GraphEngine.findCycles(events, edges);
    for (let i = 0; i < cycles.length; i++) {
      const cycle = cycles[i];
      const firstEvent = eventsMap.get(cycle[0]);

      if (firstEvent) {
        // Verificar se algum nó do ciclo tem premissa causal externa
        const hasExternalAncestor = cycle.some(nodeId => {
          const parents = GraphEngine.getParents(nodeId, edges);
          return parents.some(p => !cycle.includes(p));
        });

        const isBootstrap = !hasExternalAncestor && cycle.length >= 2;

        paradoxes.push({
          id: isBootstrap ? `pdx-boot-${i}` : `pdx-loop-${i}`,
          type: isBootstrap ? ParadoxType.BOOTSTRAP_PARADOX : ParadoxType.CAUSAL_LOOP,
          severity: isBootstrap ? ParadoxSeverity.CATASTROPHIC : ParadoxSeverity.HIGH,
          title: isBootstrap
            ? `Paradoxo Ontológico de Bootstrap (${cycle.length} nós sem origem primordial)`
            : `Loop Causal Fechado (Dependência Circular)`,
          description: isBootstrap
            ? `A informação circula eternamente em geodésica fechada sem evento criador primordial documentado (entropia nula de origem). Nós envolvidos: ${cycle.join(' → ')}.`
            : `Detectada dependência causal circular fechada no grafo de geodésicas, violando a estrutura acíclica (${cycle.length} nós acoplados).`,
          dimensionId: firstEvent.dimensionId,
          eventId: firstEvent.id,
          causalChain: cycle,
        });
      }
    }

    // 3. Conflito de Duplicação Temporal (Mesmo Viajante Co-existente com Estados Incompatíveis)
    const travelerYearMap = new Map<string, Traveler[]>();
    for (const traveler of travelers) {
      const key = `${traveler.name}-${traveler.currentDimensionId}-${traveler.currentYear}`;
      const existing = travelerYearMap.get(key) || [];
      existing.push(traveler);
      travelerYearMap.set(key, existing);
    }

    for (const [, duplicates] of travelerYearMap.entries()) {
      if (duplicates.length > 1) {
        const lead = duplicates[0];
        paradoxes.push({
          id: `pdx-dup-${lead.id}`,
          type: ParadoxType.TEMPORAL_CONTRADICTION,
          severity: ParadoxSeverity.HIGH,
          title: `Interferência de Co-existência: ${lead.name}`,
          description: `Detectadas ${duplicates.length} instâncias simultâneas do mesmo observador no ano ${lead.currentYear} da dimensão ${lead.currentDimensionId}, gerando indeterminação na linha de universo.`,
          dimensionId: lead.currentDimensionId,
          travelerId: lead.id,
          causalChain: duplicates.map(d => d.id),
        });
      }
    }

    return paradoxes;
  }

  /**
   * Fornece soluções físicas e prescrições topológicas para mitigar ou resolver o paradoxo.
   */
  public static getParadoxResolutions(paradox: Paradox): {
    strategy: 'novikov_self_consistency' | 'everett_multiverse_branching' | 'quantum_decoherence_prune';
    name: string;
    scientificBasis: string;
    description: string;
    actionLabel: string;
  }[] {
    const isGrandfather = paradox.type === ParadoxType.GRANDFATHER_PARADOX;
    const isBootstrap = paradox.type === ParadoxType.BOOTSTRAP_PARADOX;

    return [
      {
        strategy: 'novikov_self_consistency',
        name: 'Princípio de Autoconsistência de Novikov',
        scientificBasis: 'Física Clássica em Variedades com Curvas Tipo-Tempo Fechadas (Igor Novikov, 1990)',
        description: isGrandfather
          ? `Impõe probabilidade global nula para a inconsistência de ${paradox.title}. Ajusta a geodésica para que a intervenção passada garanta a causa original.`
          : 'A probabilidade global de qualquer trajetória contraditória em curvas tipo-tempo fechadas é zero, forçando topologia causal consistente.',
        actionLabel: 'Impor Geodésica Autoconsistente',
      },
      {
        strategy: 'everett_multiverse_branching',
        name: 'Bifurcação de Muitos Mundos de Everett',
        scientificBasis: 'Interpretação de Muitos Mundos da Mecânica Quântica (Hugh Everett III, 1957)',
        description: isBootstrap
          ? 'Desacopla o loop ontológico ramificando o manuscrito/informação para uma dimensão paralela ortogonal sem ancestral cíclico.'
          : 'A perturbação temporal ramifica a função de onda universal em um novo ramo ortogonal, eliminando a contradição local.',
        actionLabel: 'Ramificar em Nova Linha Temporal Paralela',
      },
      {
        strategy: 'quantum_decoherence_prune',
        name: 'Colapso por Decoerência Quântica (Zurek)',
        scientificBasis: 'Teoria da Decoerência e Seleção de Estados Estáveis (Wojciech Zurek, 1981)',
        description:
          'A interferência entre ramos incompatíveis decai exponencialmente para o ambiente. O nó paradoxal instável sofre decoerência e é podado do grafo ativo para restaurar a integridade.',
        actionLabel: 'Executar Poda por Decoerência',
      },
    ];
  }
}

