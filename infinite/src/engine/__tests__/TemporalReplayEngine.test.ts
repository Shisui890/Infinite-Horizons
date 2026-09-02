import { describe, it, expect } from 'vitest';
import { TemporalReplayEngine } from '../TemporalReplayEngine';
import { SimulationService } from '../SimulationService';

describe('TemporalReplayEngine (Replay Causal Passo a Passo)', () => {
  it('generates multi-step replay sequence for an intervention', () => {
    const { universe } = SimulationService.createDefaultUniverse();
    const targetEventId = universe.dimensions[0].events[0].id;

    const frames = TemporalReplayEngine.generateReplayFrames(universe, targetEventId, 'erase');

    expect(frames.length).toBeGreaterThan(1);
    expect(frames[0].step).toBe(0);
    expect(frames[0].type).toBe('alteration');
    expect(frames[frames.length - 1].integritySnapshot).toBeDefined();
  });
});
