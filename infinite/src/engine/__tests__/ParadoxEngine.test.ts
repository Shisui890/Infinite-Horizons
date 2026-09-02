import { describe, it, expect } from 'vitest';
import { ParadoxEngine } from '../ParadoxEngine';
import type { TemporalEvent, Traveler, CausalEdge } from '../../types/temporal';
import { EventStatus, TravelerStatus, ParadoxType, CausalRelation } from '../../types/temporal';

describe('ParadoxEngine (Inconsistências Temporais & Novikov)', () => {
  it('detects Grandfather paradox when origin event is erased or collapsed', () => {
    const events: TemporalEvent[] = [
      {
        id: 'evt-origin',
        dimensionId: 'dim-1',
        title: 'Nascimento do Viajante',
        year: 1980,
        category: 'BIOLÓGICO',
        importance: 90,
        position: { x: 0, y: 0 },
        status: EventStatus.ERASED,
        parents: [],
        children: [],
        causes: [],
        consequences: [],
      },
    ];

    const travelers: Traveler[] = [
      {
        id: 'trv-1',
        name: 'Chronos',
        originDimensionId: 'dim-1',
        originYear: 1980,
        currentDimensionId: 'dim-1',
        currentYear: 1940,
        originEventId: 'evt-origin',
        status: TravelerStatus.NORMAL,
        travelHistory: [],
      },
    ];

    const paradoxes = ParadoxEngine.detectParadoxes(events, travelers, []);
    expect(paradoxes.length).toBe(1);
    expect(paradoxes[0].type).toBe(ParadoxType.GRANDFATHER_PARADOX);
    expect(paradoxes[0].travelerId).toBe('trv-1');
  });

  it('detects Causal Loop and classifies closed information loop as Bootstrap paradox', () => {
    const events: TemporalEvent[] = [
      {
        id: 'evt-a',
        dimensionId: 'dim-1',
        title: 'Manuscrito Recebido',
        year: 1950,
        category: 'INFO',
        importance: 80,
        position: { x: 0, y: 0 },
        status: EventStatus.STABLE,
        parents: ['evt-b'],
        children: ['evt-b'],
        causes: ['evt-b'],
        consequences: ['evt-b'],
      },
      {
        id: 'evt-b',
        dimensionId: 'dim-1',
        title: 'Manuscrito Enviado ao Passado',
        year: 2000,
        category: 'INFO',
        importance: 80,
        position: { x: 100, y: 0 },
        status: EventStatus.STABLE,
        parents: ['evt-a'],
        children: ['evt-a'],
        causes: ['evt-a'],
        consequences: ['evt-a'],
      },
    ];

    const edges: CausalEdge[] = [
      { id: 'e1', source: 'evt-a', target: 'evt-b', type: CausalRelation.CAUSES, active: true },
      { id: 'e2', source: 'evt-b', target: 'evt-a', type: CausalRelation.CAUSES, active: true },
    ];

    const paradoxes = ParadoxEngine.detectParadoxes(events, [], edges);
    expect(paradoxes.length).toBeGreaterThan(0);
    // As there are no external parents, it detects Bootstrap Paradox
    expect(paradoxes[0].type).toBe(ParadoxType.BOOTSTRAP_PARADOX);
  });

  it('detects duplicate traveler conflict when instances overlap in same year/dim', () => {
    const travelers: Traveler[] = [
      {
        id: 'trv-1a',
        name: 'Alice',
        originDimensionId: 'dim-1',
        originYear: 2025,
        currentDimensionId: 'dim-1',
        currentYear: 1999,
        status: TravelerStatus.NORMAL,
        travelHistory: [],
      },
      {
        id: 'trv-1b',
        name: 'Alice',
        originDimensionId: 'dim-1',
        originYear: 2050,
        currentDimensionId: 'dim-1',
        currentYear: 1999, // Same year & dimension!
        status: TravelerStatus.NORMAL,
        travelHistory: [],
      },
    ];

    const paradoxes = ParadoxEngine.detectParadoxes([], travelers, []);
    expect(paradoxes.length).toBe(1);
    expect(paradoxes[0].type).toBe(ParadoxType.TEMPORAL_CONTRADICTION);
  });
});
