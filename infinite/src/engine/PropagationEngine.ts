import type { TemporalEvent, CausalEdge } from '../types/temporal';
import { EventStatus } from '../types/temporal';
import { GraphEngine } from './GraphEngine';
import { MinkowskiCalculus } from './MinkowskiCalculus';

export class PropagationEngine {
  public static propagate(
    alteredEventId: string,
    eventsMap: Map<string, TemporalEvent>,
    edges: CausalEdge[]
  ): string[] {
    const affected: string[] = [];
    const queue = [alteredEventId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const event = eventsMap.get(currentId);
      if (!event) continue;

      affected.push(currentId);

      const childrenIds = GraphEngine.getChildren(currentId, edges);
      for (const childId of childrenIds) {
        const childEvent = eventsMap.get(childId);
        if (!childEvent) continue;

        // Relativistic Minkowski Invariant Check
        const interval = MinkowskiCalculus.calculateInterval(event, childEvent);
        const isSuperluminalViolation = interval.intervalType === 'spacelike';

        if (event.status === EventStatus.ERASED) {
          const parents = GraphEngine.getParents(childId, edges);
          const activeParents = parents.filter(pId => eventsMap.get(pId)?.status !== EventStatus.ERASED);

          // Princípio de Autoconsistência de Novikov para Eventos Âncora
          if (childEvent.isAnchor) {
            // Âncoras temporais resistem ao colapso total
            childEvent.status = EventStatus.ALTERED;
          } else if (activeParents.length === 0) {
            childEvent.status = isSuperluminalViolation ? EventStatus.PARADOXICAL : EventStatus.ERASED;
          } else {
            childEvent.status = EventStatus.UNSTABLE;
          }
        } else if (event.status === EventStatus.ALTERED) {
          if (childEvent.status === EventStatus.STABLE) {
            childEvent.status = childEvent.isAnchor ? EventStatus.ALTERED : EventStatus.UNSTABLE;
          }
        } else if (event.status === EventStatus.UNSTABLE) {
          if (childEvent.status === EventStatus.STABLE) {
            childEvent.status = EventStatus.UNSTABLE;
          }
        }

        queue.push(childId);
      }
    }

    return affected;
  }
}

