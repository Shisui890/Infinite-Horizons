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
          title: `Paradoxo do Avô — ${traveler.name}`,
          description: `O viajante ${traveler.name} interferiu no passado (${traveler.currentYear}), invalidando o evento de sua origem (${originEvent.title}). Como sua origem foi destruída, o viajante não deveria existir para viajar.`,
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
          title: `Loop Causal Detectado`,
          description: `Formou-se um ciclo de causa e efeito sem ponto de origem independente (${cycle.length} eventos envolvidos).`,
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
