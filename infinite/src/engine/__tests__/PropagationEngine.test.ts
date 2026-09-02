import { describe, it, expect } from 'vitest';
import { PropagationEngine } from '../PropagationEngine';
import type { TemporalEvent, CausalEdge } from '../../types/temporal';
import { EventStatus, CausalRelation } from '../../types/temporal';

function createMockEvent(id: string, year: number, x: number = 0, isAnchor: boolean = false): TemporalEvent {
  return {
    id,
    dimensionId: 'dim-1',
    title: id,
    year,
    category: 'TEST',
    importance: 80,
    position: { x, y: 0 },
    status: EventStatus.STABLE,
    parents: [],
    children: [],
    causes: [],
    consequences: [],
    isAnchor,
  };
}

describe('PropagationEngine (Propagação Causal & Autoconsistência)', () => {
  it('propagates ERASED status to child when only parent is erased', () => {
    const evA = createMockEvent('ev-a', 1900, 0);
    evA.status = EventStatus.ERASED;
    const evB = createMockEvent('ev-b', 1950, 10);

    const eventsMap = new Map<string, TemporalEvent>([
      ['ev-a', evA],
      ['ev-b', evB],
    ]);

    const edges: CausalEdge[] = [
      { id: 'e1', source: 'ev-a', target: 'ev-b', type: CausalRelation.CAUSES, active: true },
    ];

    const affected = PropagationEngine.propagate('ev-a', eventsMap, edges);
    expect(affected).toContain('ev-a');
    expect(affected).toContain('ev-b');
    expect(eventsMap.get('ev-b')?.status).toBe(EventStatus.ERASED);
  });

  it('preserves isAnchor event as ALTERED instead of full ERASED (Novikov Resistance)', () => {
    const evA = createMockEvent('ev-a', 1900, 0);
    evA.status = EventStatus.ERASED;
    const evAnchor = createMockEvent('ev-anchor', 1950, 10, true); // Anchor!

    const eventsMap = new Map<string, TemporalEvent>([
      ['ev-a', evA],
      ['ev-anchor', evAnchor],
    ]);

    const edges: CausalEdge[] = [
      { id: 'e1', source: 'ev-a', target: 'ev-anchor', type: CausalRelation.CAUSES, active: true },
    ];

    PropagationEngine.propagate('ev-a', eventsMap, edges);
    expect(eventsMap.get('ev-anchor')?.status).toBe(EventStatus.ALTERED);
  });

  it('marks child as UNSTABLE if it still has at least one active parent', () => {
    const evA = createMockEvent('ev-a', 1900, 0);
    evA.status = EventStatus.ERASED;
    const evB = createMockEvent('ev-b', 1905, 0); // Active parent
    const evC = createMockEvent('ev-c', 1950, 10);

    const eventsMap = new Map<string, TemporalEvent>([
      ['ev-a', evA],
      ['ev-b', evB],
      ['ev-c', evC],
    ]);

    const edges: CausalEdge[] = [
      { id: 'e1', source: 'ev-a', target: 'ev-c', type: CausalRelation.CAUSES, active: true },
      { id: 'e2', source: 'ev-b', target: 'ev-c', type: CausalRelation.CAUSES, active: true },
    ];

    PropagationEngine.propagate('ev-a', eventsMap, edges);
    expect(eventsMap.get('ev-c')?.status).toBe(EventStatus.UNSTABLE);
  });
});
