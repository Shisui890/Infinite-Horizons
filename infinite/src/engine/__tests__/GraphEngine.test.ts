import { describe, it, expect } from 'vitest';
import { GraphEngine } from '../GraphEngine';
import type { TemporalEvent, CausalEdge } from '../../types/temporal';
import { EventStatus, CausalRelation } from '../../types/temporal';

function createMockNode(id: string): TemporalEvent {
  return {
    id,
    dimensionId: 'dim-1',
    title: id,
    year: 2000,
    category: 'TEST',
    importance: 50,
    position: { x: 0, y: 0 },
    status: EventStatus.STABLE,
    parents: [],
    children: [],
    causes: [],
    consequences: [],
  };
}

function createMockEdge(source: string, target: string): CausalEdge {
  return {
    id: `edge-${source}-${target}`,
    source,
    target,
    type: CausalRelation.CAUSES,
    active: true,
  };
}

describe('GraphEngine (DAG & Causal Topology)', () => {
  it('returns direct children and parents accurately', () => {
    const edges = [
      createMockEdge('A', 'B'),
      createMockEdge('A', 'C'),
      createMockEdge('B', 'D'),
    ];

    expect(GraphEngine.getChildren('A', edges)).toEqual(['B', 'C']);
    expect(GraphEngine.getChildren('B', edges)).toEqual(['D']);
    expect(GraphEngine.getParents('D', edges)).toEqual(['B']);
    expect(GraphEngine.getParents('B', edges)).toEqual(['A']);
  });

  it('computes ancestors and descendants sets across multiple generations', () => {
    const edges = [
      createMockEdge('A', 'B'),
      createMockEdge('B', 'C'),
      createMockEdge('C', 'D'),
    ];

    const ancestorsOfD = Array.from(GraphEngine.getAncestors('D', edges));
    expect(ancestorsOfD).toContain('A');
    expect(ancestorsOfD).toContain('B');
    expect(ancestorsOfD).toContain('C');

    const descendantsOfA = Array.from(GraphEngine.getDescendants('A', edges));
    expect(descendantsOfA).toContain('B');
    expect(descendantsOfA).toContain('C');
    expect(descendantsOfA).toContain('D');
  });

  it('detects directed circular cycles (loops causais)', () => {
    const nodes = [createMockNode('A'), createMockNode('B'), createMockNode('C')];
    const edges = [
      createMockEdge('A', 'B'),
      createMockEdge('B', 'C'),
      createMockEdge('C', 'A'), // Closes the loop
    ];

    const cycles = GraphEngine.findCycles(nodes, edges);
    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles[0]).toContain('A');
    expect(cycles[0]).toContain('B');
    expect(cycles[0]).toContain('C');
  });

  it('returns empty array when graph is strictly acyclic (DAG)', () => {
    const nodes = [createMockNode('A'), createMockNode('B'), createMockNode('C'), createMockNode('D')];
    const edges = [
      createMockEdge('A', 'B'),
      createMockEdge('A', 'C'),
      createMockEdge('B', 'D'),
      createMockEdge('C', 'D'),
    ];

    const cycles = GraphEngine.findCycles(nodes, edges);
    expect(cycles).toEqual([]);
  });
});
