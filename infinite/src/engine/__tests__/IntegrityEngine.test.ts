import { describe, it, expect } from 'vitest';
import { IntegrityEngine } from '../IntegrityEngine';
import type { TemporalEvent, Paradox } from '../../types/temporal';
import { EventStatus, ParadoxType, ParadoxSeverity } from '../../types/temporal';

describe('IntegrityEngine (Novikov Temporal Integrity)', () => {
  it('returns 100% when no paradoxes and all events stable', () => {
    const events: TemporalEvent[] = [
      {
        id: 'ev-1',
        dimensionId: 'dim-1',
        title: 'Event 1',
        year: 2000,
        category: 'TEST',
        importance: 80,
        position: { x: 0, y: 0 },
        status: EventStatus.STABLE,
        parents: [],
        children: [],
        causes: [],
        consequences: [],
      },
    ];

    const integrity = IntegrityEngine.calculate(events, []);
    expect(integrity).toBe(100);
  });

  it('deducts proportional integrity for active paradoxes', () => {
    const events: TemporalEvent[] = [];
    const criticalParadox: Paradox = {
      id: 'pdx-1',
      type: ParadoxType.GRANDFATHER_PARADOX,
      severity: ParadoxSeverity.CRITICAL,
      title: 'Grandfather',
      description: 'Test',
      dimensionId: 'dim-1',
      causalChain: ['ev-1'],
    };

    const integrity = IntegrityEngine.calculate(events, [criticalParadox]);
    // 100 - 30 = 70
    expect(integrity).toBe(70);
  });

  it('deducts for unstable, altered and erased events', () => {
    const events: TemporalEvent[] = [
      {
        id: 'ev-1',
        dimensionId: 'dim-1',
        title: 'Event 1',
        year: 2000,
        category: 'TEST',
        importance: 80,
        position: { x: 0, y: 0 },
        status: EventStatus.ERASED, // -5
        parents: [],
        children: [],
        causes: [],
        consequences: [],
      },
      {
        id: 'ev-2',
        dimensionId: 'dim-1',
        title: 'Event 2',
        year: 2005,
        category: 'TEST',
        importance: 80,
        position: { x: 0, y: 0 },
        status: EventStatus.PARADOXICAL, // -8
        parents: [],
        children: [],
        causes: [],
        consequences: [],
      },
    ];

    const integrity = IntegrityEngine.calculate(events, []);
    expect(integrity).toBe(87);
  });

  it('clamps strictly between 0 and 100', () => {
    const catastrophicParadoxes: Paradox[] = Array(5).fill({
      id: 'pdx-cat',
      type: ParadoxType.GRANDFATHER_PARADOX,
      severity: ParadoxSeverity.CATASTROPHIC, // -50 each
      title: 'Catastrophe',
      description: 'Test',
      dimensionId: 'dim-1',
      causalChain: [],
    });

    const integrity = IntegrityEngine.calculate([], catastrophicParadoxes);
    expect(integrity).toBe(0);
  });
});
