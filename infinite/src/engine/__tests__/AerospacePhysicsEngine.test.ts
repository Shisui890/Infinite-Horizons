import { describe, it, expect } from 'vitest';
import {
  AerospacePhysicsEngine,
  EARTH_RADIUS_M,
  EARTH_MU,
} from '../AerospacePhysicsEngine';
import { AEROSPACE_ROCKETS } from '../../data/aerospaceRockets';

describe('AerospacePhysicsEngine', () => {
  it('correctly computes Tsiolkovsky delta-V equation', () => {
    // 300s Isp, 1000kg wet mass, 100kg dry mass
    // Δv = 300 * 9.80665 * ln(1000 / 100) = 2941.995 * 2.302585 ≈ 6774.2 m/s
    const dv = AerospacePhysicsEngine.calculateTsiolkovskyDeltaV(300, 1000, 100);
    expect(dv).toBeGreaterThan(6770);
    expect(dv).toBeLessThan(6780);
  });

  it('calculates vehicle multi-stage Delta-V budget for Saturn V', () => {
    const saturnV = AEROSPACE_ROCKETS.find(r => r.id === 'saturn_v')!;
    const budget = AerospacePhysicsEngine.calculateVehicleDeltaVBudget(
      saturnV.stages,
      saturnV.payloadMassKg
    );

    expect(budget.stageDVs.length).toBe(3);
    // Saturn V total Delta-V to orbit & translunar injection exceeds 11,000 m/s
    expect(budget.totalDeltaV).toBeGreaterThan(11000);
    expect(budget.stageDVs[0]).toBeGreaterThan(2500); // S-IC booster stage
  });

  it('computes realistic atmospheric density decay and dynamic pressure Q', () => {
    const seaLevelDensity = AerospacePhysicsEngine.getAtmosphericDensity(0);
    expect(seaLevelDensity).toBeCloseTo(1.225, 2);

    const spaceDensity = AerospacePhysicsEngine.getAtmosphericDensity(150000);
    expect(spaceDensity).toBe(0);

    // Q at 10 km altitude, 600 m/s
    const qKPa = AerospacePhysicsEngine.calculateDynamicPressureKPa(10000, 600);
    expect(qKPa).toBeGreaterThan(10);
    expect(qKPa).toBeLessThan(70);
  });

  it('correctly evaluates Keplerian orbital parameters via Vis-Viva', () => {
    // Low Earth Orbit at 200 km altitude, circular speed ≈ 7.78 km/s
    const altM = 200000;
    const r = EARTH_RADIUS_M + altM;
    const vCirc = Math.sqrt(EARTH_MU / r);

    const telemetry = AerospacePhysicsEngine.calculateOrbitalTelemetry(altM, vCirc, 0);

    expect(telemetry.isOrbitStable).toBe(true);
    expect(telemetry.isEscapeTrajectory).toBe(false);
    expect(telemetry.eccentricity).toBeCloseTo(0, 2);
    expect(telemetry.periapsisAltitudeKm).toBeGreaterThan(190);
    expect(telemetry.apoapsisAltitudeKm).toBeLessThan(210);
    expect(telemetry.orbitalPeriodMinutes).toBeGreaterThan(85);
    expect(telemetry.orbitalPeriodMinutes).toBeLessThan(95);
  });

  it('calculates Hohmann transfer delta-v between LEO (200km) and GEO (35786km)', () => {
    const hohmann = AerospacePhysicsEngine.calculateHohmannTransfer(200, 35786);
    // Standard Hohmann LEO to GEO requires ~2.45 km/s at perigee burn, ~1.47 km/s at apogee circularization ≈ 3.9 km/s total
    expect(hohmann.deltaV1KmS).toBeGreaterThan(2.3);
    expect(hohmann.deltaV1KmS).toBeLessThan(2.6);
    expect(hohmann.totalDeltaVKmS).toBeGreaterThan(3.7);
    expect(hohmann.totalDeltaVKmS).toBeLessThan(4.1);
    expect(hohmann.transferTimeMinutes).toBeGreaterThan(300); // ~5.3 hours
  });
});
