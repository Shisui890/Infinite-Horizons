import type { TemporalEvent, Traveler, CausalEdge, Paradox } from '../types/temporal';
import { ParadoxType, ParadoxSeverity, EventStatus, TravelerStatus } from '../types/temporal';
import { GraphEngine } from './GraphEngine';

export class ParadoxEngine {
  public static detectParadoxes(
    events: TemporalEvent[],
    travelers: Traveler[],
    edges: CausalEdge[]
  ): Paradox[] {
    const paradoxes: Paradox[] = [];
    const eventsMap = new Map<string, TemporalEvent>(events.map(e => [e.id, e]));

    for (const traveler of travelers) {
      if (!traveler.originEventId) continue;

      const originEvent = eventsMap.get(traveler.originEventId);
      if (!originEvent) continue;

      if (
        originEvent.status === EventStatus.ERASED ||
        originEvent.status === EventStatus.COLLAPSED ||
        originEvent.status === EventStatus.PARADOXICAL
      ) {
        traveler.status = TravelerStatus.PARADOXICAL;

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

        originEvent.status = EventStatus.PARADOXICAL;
      }
    }

    const cycles = GraphEngine.findCycles(events, edges);
    for (let i = 0; i < cycles.length; i++) {
      const cycle = cycles[i];
      const firstEvent = eventsMap.get(cycle[0]);

      if (firstEvent) {
        paradoxes.push({
          id: `pdx-loop-${i}`,
          type: ParadoxType.CAUSAL_LOOP,
          severity: ParadoxSeverity.HIGH,
          title: `Loop Causal Fechado (Dependência Circular)`,
          description: `Detectada dependência causal circular fechada no grafo de geodésicas, violando a estrutura acíclica e a conservação de probabilidade global (${cycle.length} nós acoplados).`,
          dimensionId: firstEvent.dimensionId,
          eventId: firstEvent.id,
          causalChain: cycle,
        });

        for (const eventId of cycle) {
          const ev = eventsMap.get(eventId);
          if (ev && ev.status === EventStatus.STABLE) {
            ev.status = EventStatus.PARADOXICAL;
          }
        }
      }
    }

    return paradoxes;
  }
}
