import { describe, it, expect } from 'vitest';
import { MinkowskiCalculus } from '../MinkowskiCalculus';
import type { TemporalEvent } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';

function mockEvent(id: string, year: number, x: number, y: number): TemporalEvent {
  return {
    id,
    dimensionId: 'dim-test',
    title: `Event ${id}`,
    year,
    category: 'FÍSICA',
    importance: 80,
    position: { x, y },
    status: EventStatus.STABLE,
    parents: [],
    children: [],
    causes: [],
    consequences: [],
  };
}

describe('MinkowskiCalculus (Relatividade Especial & Teoria do Caos)', () => {
  it('calculates Timelike interval correctly when dt > dx (causally connected)', () => {
    // 10 years difference, 200px distance (dx = 2.0, dy = 0)
    // s^2 = - (1.0 * 10)^2 + 2^2 = -100 + 4 = -96 < 0
    const evA = mockEvent('a', 1900, 0, 0);
    const evB = mockEvent('b', 1910, 200, 0);

    const res = MinkowskiCalculus.calculateInterval(evA, evB);
    expect(res.intervalType).toBe('timelike');
    expect(res.s2).toBeLessThan(0);
    expect(res.properTimeTau).toBeGreaterThan(0);
    expect(res.properTimeTau).toBeCloseTo(Math.sqrt(96), 1);
  });

  it('calculates Spacelike interval correctly when dx > dt (causally disconnected / superluminal)', () => {
    // 1 year difference, 500px distance (dx = 5.0)
    // s^2 = - (1.0 * 1)^2 + 25 = 24 > 0
    const evA = mockEvent('a', 2000, 0, 0);
    const evB = mockEvent('b', 2001, 500, 0);

    const res = MinkowskiCalculus.calculateInterval(evA, evB);
    expect(res.intervalType).toBe('spacelike');
    expect(res.s2).toBeGreaterThan(0);
    expect(res.properTimeTau).toBeNull();
  });

  it('calculates Lightlike (Null Cone) interval when dt ≈ dx', () => {
    // 2 years difference, 200px distance (dx = 2.0)
    // s^2 = - 4 + 4 = 0
    const evA = mockEvent('a', 2000, 0, 0);
    const evB = mockEvent('b', 2002, 200, 0);

    const res = MinkowskiCalculus.calculateInterval(evA, evB);
    expect(res.intervalType).toBe('lightlike');
    expect(res.s2).toBeCloseTo(0, 2);
  });

  it('calculates Lyapunov divergence exponentially', () => {
    const lambda = 0.5;
    const deltaT = 4;
    const initialPerturbation = 0.01;

    const divergence = MinkowskiCalculus.calculateLyapunovDivergence(lambda, deltaT, initialPerturbation);
    // 0.01 * e^(0.5 * 4) = 0.01 * e^2 ≈ 0.07389
    expect(divergence).toBeCloseTo(0.01 * Math.exp(2), 4);
  });

  it('calculates Gravitational Time Dilation in Schwarzschild metric', () => {
    const rsKm = 10;
    const rKm = 20;
    // sqrt(1 - 10/20) = sqrt(0.5) ≈ 0.7071
    const dilation = MinkowskiCalculus.calculateGravitationalDilation(rsKm, rKm);
    expect(dilation).toBeCloseTo(Math.sqrt(0.5), 3);

    // Horizon boundary check
    expect(MinkowskiCalculus.calculateGravitationalDilation(rsKm, 10)).toBe(0);
    expect(MinkowskiCalculus.calculateGravitationalDilation(rsKm, 5)).toBe(0);
  });

  it('calculates Michelson-Morley ether drift and demonstrates null result resolution', () => {
    // Earth orbital speed around Sun ~29.8 km/s, arm = 11 m, lambda = 590 nm
    const res = MinkowskiCalculus.calculateMichelsonMorleyEtherDrift(29.8, 11.0, 590.0);

    expect(res.beta).toBeCloseTo(29.8 / 299792.458, 6);
    expect(res.timeParallelSec).toBeGreaterThan(0);
    expect(res.timePerpendicularSec).toBeGreaterThan(0);
    expect(res.classicalDeltaTSec).toBeGreaterThan(0);
    // Classical expected fringe shift for 11m at 29.8 km/s is ~0.37 fringes (detectable by 1887 apparatus capable of 0.01)
    expect(res.classicalFringeShift).toBeGreaterThan(0.3);
    expect(res.classicalFringeShift).toBeLessThan(0.45);
    // Real experimental and relativistic observation is null
    expect(res.observedFringeShift).toBe(0.0);
    expect(res.etherStatus).toBe('refuted_by_null_result');
    expect(res.einsteinResolution).toContain('Albert Einstein');
  });

  it('handles zero velocity in Michelson-Morley correctly', () => {
    const resZero = MinkowskiCalculus.calculateMichelsonMorleyEtherDrift(0, 11.0, 590.0);
    expect(resZero.beta).toBe(0);
    expect(resZero.classicalDeltaTSec).toBe(0);
    expect(resZero.classicalFringeShift).toBe(0);
    expect(resZero.lorentzContractionFactor).toBe(1);
  });
});

