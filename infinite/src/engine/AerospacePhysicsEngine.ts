/**
 * AerospacePhysicsEngine.ts
 *
 * Motor de física aeroespacial e mecânica orbital rigorosa,
 * modelando a Equação de Tsiolkovsky, arrasto atmosférico exponencial,
 * pressão dinâmica Max-Q, mecânica orbital kepleriana (Vis-Viva, Ap/Pe, Hohmann)
 * e integração numérica de voo para simulações estilo Kerbal Space Program e Re-entry.
 */

import type { AerospaceRocket, RocketStage } from '../data/aerospaceRockets';

export interface OrbitalTelemetry {
  semiMajorAxisKm: number;
  eccentricity: number;
  apoapsisAltitudeKm: number;
  periapsisAltitudeKm: number;
  circularSpeedKmS: number;
  escapeSpeedKmS: number;
  orbitalPeriodMinutes: number;
  isOrbitStable: boolean;
  isEscapeTrajectory: boolean;
  specificOrbitalEnergyMJ_Kg: number;
}

export interface FlightState {
  altitudeMeters: number;
  downrangeMeters: number;
  vxMS: number; // Horizontal velocity
  vyMS: number; // Vertical velocity
  totalSpeedMS: number;
  pitchAngleDeg: number; // 90° = vertical up, 0° = horizontal
  throttle: number; // 0 to 1
  currentStageIndex: number;
  stagePropellantMassKg: number;
  totalVehicleMassKg: number;
  gForce: number;
  dynamicPressureKPa: number;
  isMaxQ: boolean;
  maxQValueKPa: number;
  thrustKN: number;
  dragForceKN: number;
  stageDeltaVRemainingMS: number;
  totalDeltaVRemainingMS: number;
  missionElapsedSeconds: number;
  hasCrashed: boolean;
  isOrbitAchieved: boolean;
}

export const G0 = 9.80665; // Standard gravity acceleration (m/s²)
export const EARTH_RADIUS_M = 6371000; // Earth mean radius in meters
export const EARTH_MU = 3.986004418e14; // Standard gravitational parameter (m³/s²)
export const KARMAN_LINE_M = 100000; // 100 km boundary of space
export const SEA_LEVEL_DENSITY = 1.225; // kg/m³
export const SCALE_HEIGHT_M = 7500; // Earth atmospheric scale height in meters

export class AerospacePhysicsEngine {
  /**
   * Tsiolkovsky Rocket Equation
   * Δv = Isp * g0 * ln(m0 / mf)
   */
  public static calculateTsiolkovskyDeltaV(
    ispSeconds: number,
    wetMassKg: number,
    dryMassKg: number
  ): number {
    if (dryMassKg <= 0 || wetMassKg <= dryMassKg || ispSeconds <= 0) return 0;
    return ispSeconds * G0 * Math.log(wetMassKg / dryMassKg);
  }

  /**
   * Calculates total vehicle delta-V through all stages taking payload into account.
   */
  public static calculateVehicleDeltaVBudget(
    stages: RocketStage[],
    payloadMassKg: number
  ): { stageDVs: number[]; totalDeltaV: number } {
    const stageDVs: number[] = [];
    let totalDV = 0;

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      let subsequentMass = payloadMassKg;
      for (let j = i + 1; j < stages.length; j++) {
        subsequentMass += stages[j].dryMassKg + stages[j].propellantMassKg;
      }

      const m0 = stage.dryMassKg + stage.propellantMassKg + subsequentMass;
      const mf = stage.dryMassKg + subsequentMass;

      // Use vacuum Isp as primary reference for upper stages, average for 1st stage
      const effectiveIsp = i === 0
        ? (stage.ispSeaLevelS * 0.35 + stage.ispVacuumS * 0.65)
        : stage.ispVacuumS;

      const dv = this.calculateTsiolkovskyDeltaV(effectiveIsp, m0, mf);
      stageDVs.push(dv);
      totalDV += dv;
    }

    return { stageDVs, totalDeltaV: totalDV };
  }

  /**
   * Barometric atmospheric density formula:
   * ρ(h) = ρ0 * exp(-h / H)
   */
  public static getAtmosphericDensity(altitudeMeters: number): number {
    if (altitudeMeters >= 120000) return 0;
    if (altitudeMeters <= 0) return SEA_LEVEL_DENSITY;
    return SEA_LEVEL_DENSITY * Math.exp(-altitudeMeters / SCALE_HEIGHT_M);
  }

  /**
   * Gravitational acceleration at altitude h:
   * g(h) = g0 * (R / (R + h))²
   */
  public static getGravityAtAltitude(
    altitudeMeters: number,
    planetRadiusM = EARTH_RADIUS_M,
    mu = EARTH_MU
  ): number {
    const r = planetRadiusM + Math.max(0, altitudeMeters);
    return mu / (r * r);
  }

  /**
   * Dynamic pressure:
   * Q = 1/2 * ρ * v² (in Pascals, converted to kPa)
   */
  public static calculateDynamicPressureKPa(altitudeMeters: number, speedMS: number): number {
    const density = this.getAtmosphericDensity(altitudeMeters);
    const qPa = 0.5 * density * speedMS * speedMS;
    return qPa / 1000;
  }

  /**
   * Aerodynamic drag force:
   * F_D = 1/2 * ρ * v² * Cd * A
   */
  public static calculateDragForceN(
    altitudeMeters: number,
    speedMS: number,
    dragCoefficient = 0.35,
    referenceAreaM2 = 12
  ): number {
    const density = this.getAtmosphericDensity(altitudeMeters);
    return 0.5 * density * speedMS * speedMS * dragCoefficient * referenceAreaM2;
  }

  /**
   * Thrust-to-Weight Ratio (TWR):
   * TWR = Thrust / (m * g)
   */
  public static calculateTWR(
    thrustN: number,
    totalMassKg: number,
    gravityMS2: number
  ): number {
    if (totalMassKg <= 0 || gravityMS2 <= 0) return 0;
    return thrustN / (totalMassKg * gravityMS2);
  }

  /**
   * Keplerian Orbital Parameters via Vis-Viva Equation:
   * v² = μ * (2/r - 1/a)
   */
  public static calculateOrbitalTelemetry(
    altitudeMeters: number,
    vxMS: number,
    vyMS: number,
    planetRadiusM = EARTH_RADIUS_M,
    mu = EARTH_MU
  ): OrbitalTelemetry {
    const r = planetRadiusM + Math.max(0, altitudeMeters);
    const speed = Math.sqrt(vxMS * vxMS + vyMS * vyMS);

    // Specific orbital energy: ε = v²/2 - μ/r
    const specificEnergy = (speed * speed) / 2 - mu / r;

    // Specific angular momentum: h = r * vx (tangential component)
    const h = r * Math.abs(vxMS);

    // Semi-major axis: a = -μ / (2ε)
    const isEscapeTrajectory = specificEnergy >= 0;
    const a = isEscapeTrajectory ? Infinity : -mu / (2 * specificEnergy);

    // Eccentricity: e = sqrt(max(0, 1 + 2*ε*h² / μ²))
    const eTerm = 1 + (2 * specificEnergy * h * h) / (mu * mu);
    const e = Math.sqrt(Math.max(0, eTerm));

    let apoapsisAltM = 0;
    let periapsisAltM = 0;

    if (!isEscapeTrajectory && a > 0) {
      apoapsisAltM = a * (1 + e) - planetRadiusM;
      periapsisAltM = a * (1 - e) - planetRadiusM;
    } else {
      apoapsisAltM = Infinity;
      periapsisAltM = (h * h) / (mu * (1 + e)) - planetRadiusM;
    }

    // Circular velocity at this altitude: v_circ = sqrt(μ / r)
    const circularSpeed = Math.sqrt(mu / r);
    // Escape velocity: v_esc = sqrt(2 * μ / r)
    const escapeSpeed = Math.sqrt((2 * mu) / r);

    // Orbital Period (Kepler's 3rd Law): T = 2π * sqrt(a³ / μ)
    let periodSec = 0;
    if (!isEscapeTrajectory && a > planetRadiusM) {
      periodSec = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / mu);
    }

    const isOrbitStable = periapsisAltM >= KARMAN_LINE_M && !isEscapeTrajectory;

    return {
      semiMajorAxisKm: isFinite(a) ? a / 1000 : 999999,
      eccentricity: parseFloat(e.toFixed(4)),
      apoapsisAltitudeKm: isFinite(apoapsisAltM) ? parseFloat((apoapsisAltM / 1000).toFixed(1)) : 999999,
      periapsisAltitudeKm: isFinite(periapsisAltM) ? parseFloat((periapsisAltM / 1000).toFixed(1)) : -planetRadiusM / 1000,
      circularSpeedKmS: parseFloat((circularSpeed / 1000).toFixed(2)),
      escapeSpeedKmS: parseFloat((escapeSpeed / 1000).toFixed(2)),
      orbitalPeriodMinutes: parseFloat((periodSec / 60).toFixed(1)),
      isOrbitStable,
      isEscapeTrajectory,
      specificOrbitalEnergyMJ_Kg: parseFloat((specificEnergy / 1e6).toFixed(2)),
    };
  }

  /**
   * Computes Hohmann transfer Delta-V budget between two circular orbits r1 and r2:
   */
  public static calculateHohmannTransfer(
    r1Km: number,
    r2Km: number,
    planetRadiusKm = EARTH_RADIUS_M / 1000,
    mu = EARTH_MU / 1e9 // km³/s²
  ): { deltaV1KmS: number; deltaV2KmS: number; totalDeltaVKmS: number; transferTimeMinutes: number } {
    const r1 = planetRadiusKm + r1Km;
    const r2 = planetRadiusKm + r2Km;

    const dv1 = Math.sqrt(mu / r1) * (Math.sqrt((2 * r2) / (r1 + r2)) - 1);
    const dv2 = Math.sqrt(mu / r2) * (1 - Math.sqrt((2 * r1) / (r1 + r2)));
    const totalDV = Math.abs(dv1) + Math.abs(dv2);

    // Semi-major axis of transfer ellipse: a_trans = (r1 + r2) / 2
    const aTrans = (r1 + r2) / 2;
    const transferPeriodSec = 2 * Math.PI * Math.sqrt(Math.pow(aTrans, 3) / mu);
    const transferTimeMinutes = (transferPeriodSec / 2) / 60;

    return {
      deltaV1KmS: parseFloat(Math.abs(dv1).toFixed(3)),
      deltaV2KmS: parseFloat(Math.abs(dv2).toFixed(3)),
      totalDeltaVKmS: parseFloat(totalDV.toFixed(3)),
      transferTimeMinutes: parseFloat(transferTimeMinutes.toFixed(1)),
    };
  }

  /**
   * Initializes a flight simulation state from a chosen rocket model.
   */
  public static createInitialFlightState(rocket: AerospaceRocket): FlightState {
    const firstStage = rocket.stages[0];
    const totalMass = rocket.totalMassKg;
    const initialIsp = firstStage.ispSeaLevelS;
    const initialWet = totalMass;
    const initialDry = totalMass - firstStage.propellantMassKg;
    const stageDV = this.calculateTsiolkovskyDeltaV(initialIsp, initialWet, initialDry);
    const { totalDeltaV } = this.calculateVehicleDeltaVBudget(rocket.stages, rocket.payloadMassKg);

    return {
      altitudeMeters: 0,
      downrangeMeters: 0,
      vxMS: 0,
      vyMS: 0,
      totalSpeedMS: 0,
      pitchAngleDeg: 90, // Vertical launch
      throttle: 1.0,
      currentStageIndex: 0,
      stagePropellantMassKg: firstStage.propellantMassKg,
      totalVehicleMassKg: totalMass,
      gForce: 1.0,
      dynamicPressureKPa: 0,
      isMaxQ: false,
      maxQValueKPa: 0,
      thrustKN: firstStage.thrustSeaLevelKN,
      dragForceKN: 0,
      stageDeltaVRemainingMS: stageDV,
      totalDeltaVRemainingMS: totalDeltaV,
      missionElapsedSeconds: 0,
      hasCrashed: false,
      isOrbitAchieved: false,
    };
  }

  /**
   * Real-time flight step integrator (Runge-Kutta / Verlet 2D equations of motion).
   */
  public static stepFlightSimulation(
    state: FlightState,
    rocket: AerospaceRocket,
    dt: number,
    autoGravityTurn = true
  ): FlightState {
    if (state.hasCrashed) return state;

    const stage = rocket.stages[state.currentStageIndex];
    let propellantRemaining = state.stagePropellantMassKg;
    let totalMass = state.totalVehicleMassKg;

    // Atmospheric & Altitude values
    const alt = Math.max(0, state.altitudeMeters);
    const speed = Math.sqrt(state.vxMS * state.vxMS + state.vyMS * state.vyMS);
    const localG = this.getGravityAtAltitude(alt);

    // Compute effective thrust based on atmospheric pressure
    const isUpper = alt > 35000;
    const currentIsp = isUpper ? stage.ispVacuumS : stage.ispSeaLevelS;
    const maxThrustKN = isUpper ? stage.thrustVacuumKN : stage.thrustSeaLevelKN;

    let activeThrustKN = 0;
    if (propellantRemaining > 0 && state.throttle > 0) {
      activeThrustKN = maxThrustKN * state.throttle;
      // Mass burn rate: dm/dt = F / (Isp * g0)
      const massFlowRateKgS = (activeThrustKN * 1000) / (currentIsp * G0);
      const fuelBurned = Math.min(propellantRemaining, massFlowRateKgS * dt);
      propellantRemaining -= fuelBurned;
      totalMass -= fuelBurned;
    }

    // Gravity turn pitch program
    let pitchDeg = state.pitchAngleDeg;
    if (autoGravityTurn) {
      if (alt < 1500) {
        pitchDeg = 90;
      } else if (alt < 75000) {
        // Smooth logarithmic pitch tilt from 90° down to 5° near 75 km
        const progress = Math.min(1, Math.max(0, (alt - 1500) / 73500));
        pitchDeg = 90 - 85 * Math.pow(progress, 0.65);
      } else {
        pitchDeg = 0; // Horizontal burn
      }
    }

    const pitchRad = (pitchDeg * Math.PI) / 180;
    const thrustN = activeThrustKN * 1000;
    const thrustX = thrustN * Math.cos(pitchRad);
    const thrustY = thrustN * Math.sin(pitchRad);

    // Drag forces opposite to velocity vector
    const dragN = this.calculateDragForceN(alt, speed, 0.35, Math.PI * Math.pow(rocket.fairingDiameterMeters / 2, 2));
    const dragX = speed > 0 ? (dragN * (state.vxMS / speed)) : 0;
    const dragY = speed > 0 ? (dragN * (state.vyMS / speed)) : 0;

    // Net accelerations: a_x = (T_x - D_x)/m
    // a_y = (T_y - D_y)/m - g + (centrifugal lift v_x² / r)
    const r = EARTH_RADIUS_M + alt;
    const centrifugalAcc = (state.vxMS * state.vxMS) / r;

    const ax = (thrustX - dragX) / totalMass;
    const ay = (thrustY - dragY) / totalMass - localG + centrifugalAcc;

    // Update velocities
    const nextVx = Math.max(0, state.vxMS + ax * dt);
    const nextVy = state.vyMS + ay * dt;
    const nextSpeed = Math.sqrt(nextVx * nextVx + nextVy * nextVy);

    // Update positions
    const nextAlt = state.altitudeMeters + nextVy * dt;
    const nextDownrange = state.downrangeMeters + nextVx * dt;

    // Dynamic pressure Q
    const qKPa = this.calculateDynamicPressureKPa(nextAlt, nextSpeed);
    const isNewMaxQ = qKPa > state.maxQValueKPa;
    const maxQVal = isNewMaxQ ? qKPa : state.maxQValueKPa;

    // G-force calculation: net non-gravitational acceleration / g0
    const nonGravAccel = Math.sqrt(Math.pow((thrustX - dragX) / totalMass, 2) + Math.pow((thrustY - dragY) / totalMass, 2));
    const gForce = parseFloat((nonGravAccel / G0).toFixed(2));

    // Remaining Delta-V for current stage
    let remainingSubsequent = rocket.payloadMassKg;
    for (let j = state.currentStageIndex + 1; j < rocket.stages.length; j++) {
      remainingSubsequent += rocket.stages[j].dryMassKg + rocket.stages[j].propellantMassKg;
    }
    const stageDry = stage.dryMassKg + remainingSubsequent;
    const stageWet = stageDry + propellantRemaining;
    const stageDeltaV = this.calculateTsiolkovskyDeltaV(currentIsp, stageWet, stageDry);

    // Crash detection
    const hasCrashed = nextAlt <= 0 && state.missionElapsedSeconds > 5 && nextVy < -2;

    // Orbit stability check
    const orbitalData = this.calculateOrbitalTelemetry(nextAlt, nextVx, nextVy);

    return {
      altitudeMeters: Math.max(0, nextAlt),
      downrangeMeters: nextDownrange,
      vxMS: nextVx,
      vyMS: nextVy,
      totalSpeedMS: nextSpeed,
      pitchAngleDeg: parseFloat(pitchDeg.toFixed(1)),
      throttle: state.throttle,
      currentStageIndex: state.currentStageIndex,
      stagePropellantMassKg: Math.max(0, propellantRemaining),
      totalVehicleMassKg: totalMass,
      gForce,
      dynamicPressureKPa: parseFloat(qKPa.toFixed(2)),
      isMaxQ: isNewMaxQ && qKPa > 15,
      maxQValueKPa: parseFloat(maxQVal.toFixed(2)),
      thrustKN: parseFloat(activeThrustKN.toFixed(1)),
      dragForceKN: parseFloat((dragN / 1000).toFixed(1)),
      stageDeltaVRemainingMS: parseFloat(stageDeltaV.toFixed(1)),
      totalDeltaVRemainingMS: parseFloat((stageDeltaV).toFixed(1)),
      missionElapsedSeconds: state.missionElapsedSeconds + dt,
      hasCrashed,
      isOrbitAchieved: orbitalData.isOrbitStable,
    };
  }

  /**
   * Jettison current stage and advance to next stage (Kerbal SPACEBAR staging).
   */
  public static triggerStageJettison(state: FlightState, rocket: AerospaceRocket): FlightState {
    const nextStageIdx = state.currentStageIndex + 1;
    if (nextStageIdx >= rocket.stages.length) {
      return state; // No more stages left
    }

    const currentStage = rocket.stages[state.currentStageIndex];
    const newStage = rocket.stages[nextStageIdx];

    // Jettison dry mass of exhausted stage
    const updatedMass = state.totalVehicleMassKg - currentStage.dryMassKg - state.stagePropellantMassKg;

    return {
      ...state,
      currentStageIndex: nextStageIdx,
      stagePropellantMassKg: newStage.propellantMassKg,
      totalVehicleMassKg: updatedMass,
      thrustKN: newStage.thrustVacuumKN * state.throttle,
    };
  }
}
