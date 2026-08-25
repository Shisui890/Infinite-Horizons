import type { TemporalEvent, CausalEdge } from '../types/temporal';
import { EventStatus } from '../types/temporal';
import { GraphEngine } from './GraphEngine';

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

        if (event.status === EventStatus.ERASED) {
          const parents = GraphEngine.getParents(childId, edges);
          const activeParents = parents.filter(pId => eventsMap.get(pId)?.status !== EventStatus.ERASED);

          if (activeParents.length === 0) {
            childEvent.status = EventStatus.ERASED;
          } else {
            childEvent.status = EventStatus.UNSTABLE;
          }
        } else if (event.status === EventStatus.ALTERED) {
          if (childEvent.status === EventStatus.STABLE) {
            childEvent.status = EventStatus.UNSTABLE;
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
