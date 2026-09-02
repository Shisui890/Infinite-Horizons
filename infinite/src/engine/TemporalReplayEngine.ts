import type { Universe, ReplayFrame, TemporalEvent } from '../types/temporal';
import { EventStatus } from '../types/temporal';
import { GraphEngine } from './GraphEngine';
import { ParadoxEngine } from './ParadoxEngine';
import { IntegrityEngine } from './IntegrityEngine';

export class TemporalReplayEngine {
  /**
   * Constrói a cadeia de quadros animados de replay causal após uma intervenção temporal.
   */
  public static generateReplayFrames(
    universe: Universe,
    targetEventId: string,
    action: 'erase' | 'alter'
  ): ReplayFrame[] {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const eventsMap = new Map<string, TemporalEvent>(allEvents.map(e => [e.id, { ...e }]));
    const frames: ReplayFrame[] = [];

    const targetEvent = eventsMap.get(targetEventId);
    if (!targetEvent) return frames;

    // Frame 0: O evento perturbador inicial
    targetEvent.status = action === 'erase' ? EventStatus.ERASED : EventStatus.ALTERED;
    const initialIntegrity = IntegrityEngine.calculate(Array.from(eventsMap.values()), universe.paradoxes);

    frames.push({
      step: 0,
      eventId: targetEventId,
      type: 'alteration',
      description: `Intervenção temporal aplicada em "${targetEvent.title}" (${targetEvent.year}). Estado modificado para ${targetEvent.status.toUpperCase()}.`,
      affectedEventIds: [targetEventId],
      integritySnapshot: initialIntegrity,
    });

    // Propagação em ondas causais (BFS por níveis)
    const queue = [targetEventId];
    const visited = new Set<string>([targetEventId]);
    let stepCount = 1;

    while (queue.length > 0) {
      const currentLevelSize = queue.length;
      const currentLevelEvents: string[] = [];

      for (let i = 0; i < currentLevelSize; i++) {
        const currentId = queue.shift()!;
        const children = GraphEngine.getChildren(currentId, universe.edges);

        for (const childId of children) {
          if (!visited.has(childId)) {
            visited.add(childId);
            queue.push(childId);
            currentLevelEvents.push(childId);

            const childEvent = eventsMap.get(childId);
            if (childEvent) {
              childEvent.status = childEvent.isAnchor ? EventStatus.ALTERED : EventStatus.UNSTABLE;
            }
          }
        }
      }

      if (currentLevelEvents.length > 0) {
        const currentEventsList = Array.from(eventsMap.values());
        const paradoxes = ParadoxEngine.detectParadoxes(currentEventsList, universe.travelers, universe.edges);
        const currentIntegrity = IntegrityEngine.calculate(currentEventsList, paradoxes);

        frames.push({
          step: stepCount++,
          eventId: currentLevelEvents[0],
          type: 'propagation',
          description: `Onda causal atingiu ${currentLevelEvents.length} eventos derivados na linha de universo.`,
          affectedEventIds: currentLevelEvents,
          integritySnapshot: currentIntegrity,
        });
      }
    }

    // Quadro final: paradoxos engatilhados e novo equilíbrio
    const finalEventsList = Array.from(eventsMap.values());
    const finalParadoxes = ParadoxEngine.detectParadoxes(finalEventsList, universe.travelers, universe.edges);
    const finalIntegrity = IntegrityEngine.calculate(finalEventsList, finalParadoxes);

    frames.push({
      step: stepCount,
      eventId: targetEventId,
      type: finalParadoxes.length > 0 ? 'paradox_trigger' : 'integrity_shift',
      description: finalParadoxes.length > 0
        ? `Propagação concluída. Detectados ${finalParadoxes.length} paradoxos com integridade final em ${finalIntegrity}%.`
        : `Propagação concluída com estabilização quântica em ${finalIntegrity}% de integridade.`,
      affectedEventIds: Array.from(visited),
      integritySnapshot: finalIntegrity,
    });

    return frames;
  }
}
