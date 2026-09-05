import type { TemporalEvent, SpacetimeIntervalResult } from '../types/temporal';

/**
 * Motor de Cálculo Tensorial e Geometria do Espaço-Tempo de Minkowski
 * Baseado estritamente na Relatividade Especial (Einstein 1905, Minkowski 1908) e Teoria do Caos (Lyapunov 1892).
 */
export class MinkowskiCalculus {
  /**
   * Velocidade da luz no vácuo normalizada (c = 1 ano-luz/ano)
   */
  public static readonly C_NORMALIZED = 1.0;

  /**
   * Calcula o intervalo invariante de espaço-tempo entre dois eventos:
   * ds² = -(c Δt)² + Δx² + Δy² + Δz²
   */
  public static calculateInterval(evA: TemporalEvent, evB: TemporalEvent): SpacetimeIntervalResult {
    const dt = evB.year - evA.year;
    // Escala espacial normalizada baseada na posição do canvas (100px ≈ 1 ano-luz)
    const dx = (evB.position.x - evA.position.x) / 100;
    const dy = (evB.position.y - evA.position.y) / 100;
    const spatialDistance = Math.sqrt(dx * dx + dy * dy);

    // s^2 = - (c * dt)^2 + (spatialDistance)^2
    const cDt = this.C_NORMALIZED * dt;
    const s2 = -(cDt * cDt) + (spatialDistance * spatialDistance);

    let intervalType: 'timelike' | 'spacelike' | 'lightlike';
    let properTimeTau: number | null = null;
    let lorentzGamma = 1.0;
    let causalStatusLabel = '';
    let scientificExplanation = '';

    if (Math.abs(s2) < 0.001) {
      intervalType = 'lightlike';
      properTimeTau = 0;
      lorentzGamma = Infinity;
      causalStatusLabel = 'TIPO-LUZ (CONE NULO: ds² = 0)';
      scientificExplanation =
        'A separação ocorre exatamente na superfície do cone de luz. Fótons e radiação eletromagnética viajam por esta geodésica na velocidade exata c.';
    } else if (s2 < 0) {
      intervalType = 'timelike';
      // Tempo próprio: dτ = sqrt(-ds² / c²)
      properTimeTau = Math.sqrt(-s2) / this.C_NORMALIZED;
      const v = Math.abs(spatialDistance / (dt || 0.0001));
      const clampedV = Math.min(v, 0.9999);
      lorentzGamma = 1 / Math.sqrt(1 - clampedV * clampedV);
      causalStatusLabel = 'TIPO-TEMPO (CAUSALMENTE CONECTADO: ds² < 0)';
      scientificExplanation =
        'O evento posterior está contido no cone de luz do evento anterior. A causalidade física é rigorosamente preservada por sinais com velocidade subluminal v < c.';
    } else {
      intervalType = 'spacelike';
      properTimeTau = null;
      lorentzGamma = 1.0;
      causalStatusLabel = 'TIPO-ESPAÇO (DESCONECTADO CAUSALMENTE: ds² > 0)';
      scientificExplanation =
        'Os eventos estão fora dos respectivos cones de luz. Nenhuma informação ou partícula física pode conectar ambos sem violar a invariância de Lorentz (exigiria v > c).';
    }

    return {
      s2: Number(s2.toFixed(4)),
      intervalType,
      dtYears: Math.abs(dt),
      dxSpace: Number(spatialDistance.toFixed(3)),
      properTimeTau: properTimeTau !== null ? Number(properTimeTau.toFixed(3)) : null,
      lorentzGamma: Number(lorentzGamma.toFixed(3)),
      causalStatusLabel,
      scientificExplanation,
    };
  }

  /**
   * Calcula a divergência caótica local via Expoente Máximo de Lyapunov:
   * δx(t) ≈ δx₀ * e^(λ * t)
   */
  public static calculateLyapunovDivergence(lambda: number, deltaT: number, initialPerturbation: number = 0.01): number {
    return initialPerturbation * Math.exp(lambda * Math.max(0, deltaT));
  }

  /**
   * Calcula o fator de dilatação temporal gravitacional na métrica de Schwarzschild:
   * dτ/dt = sqrt(1 - rs / r)
   */
  public static calculateGravitationalDilation(rsKm: number, rKm: number): number {
    if (rKm <= rsKm) return 0; // Horizonte de eventos
    return Math.sqrt(1 - rsKm / rKm);
  }

  /**
   * Calcula a Métrica de Kerr para buracos negros em rotação e arraste de referenciais (Lense-Thirring).
   */
  public static calculateKerrMetric(
    massSolar: number,
    spinParamA: number = 0.9, // 0 <= a* < 1
    thetaDeg: number = 90, // Ângulo equatorial por padrão (theta = 90°)
    distanceFactor: number = 2.0 // em unidades de M (onde M = rs/2)
  ): import('../types/temporal').KerrMetricResult {
    const rsKm = massSolar * 2.95325;
    const M_km = rsKm / 2; // Raio geométrico de massa em km (G*M / c^2)
    const clampedSpin = Math.min(Math.max(spinParamA, 0), 0.9999);
    const a_km = clampedSpin * M_km;

    const thetaRad = (thetaDeg * Math.PI) / 180;
    const cosTheta = Math.cos(thetaRad);
    const sinTheta = Math.sin(thetaRad);

    const deltaDiscriminant = Math.max(M_km * M_km - a_km * a_km, 0);
    const rPlusKm = M_km + Math.sqrt(deltaDiscriminant);
    const rMinusKm = M_km - Math.sqrt(deltaDiscriminant);

    const ergoDiscriminant = Math.max(M_km * M_km - a_km * a_km * cosTheta * cosTheta, 0);
    const rErgosphereKm = M_km + Math.sqrt(ergoDiscriminant);

    const currentR_km = distanceFactor * M_km;
    const isInsideEventHorizon = currentR_km <= rPlusKm;
    const isInsideErgosphere = currentR_km <= rErgosphereKm;

    // Eficiência máxima do Processo de Penrose: 1 - sqrt((1 + sqrt(1 - a*^2)) / 2)
    const penroseEfficiencyMaxPercent = (1 - Math.sqrt((1 + Math.sqrt(1 - clampedSpin * clampedSpin)) / 2)) * 100;

    // Velocidade angular de arraste de referenciais (Lense-Thirring) em rad/s
    const r2 = currentR_km * currentR_km;
    const a2 = a_km * a_km;
    const delta = r2 - 2 * M_km * currentR_km + a2;
    const sigma = r2 + a2 * cosTheta * cosTheta;
    const denominator = Math.pow(r2 + a2, 2) - a2 * delta * sinTheta * sinTheta;

    // Conversão de km para metros para o fator c (3e5 km/s)
    const cKmS = 299792.458;
    const frameDraggingOmegaRadPerSec = denominator > 0
      ? (2 * M_km * a_km * currentR_km * cKmS) / (denominator * Math.max(sigma / (r2 + a2), 0.1))
      : 0;

    return {
      massSolar,
      spinParamA: clampedSpin,
      thetaRad,
      rsKm,
      rPlusKm: Number(rPlusKm.toFixed(2)),
      rMinusKm: Number(rMinusKm.toFixed(2)),
      rErgosphereKm: Number(rErgosphereKm.toFixed(2)),
      frameDraggingOmegaRadPerSec: Number(frameDraggingOmegaRadPerSec.toFixed(2)),
      penroseEfficiencyMaxPercent: Number(penroseEfficiencyMaxPercent.toFixed(2)),
      isInsideErgosphere,
      isInsideEventHorizon,
    };
  }

  /**
   * Calcula a Termodinâmica de Horizontes de Bekenstein-Hawking e Radiação Quântica.
   */
  public static calculateHawkingThermodynamics(
    massSolar: number
  ): import('../types/temporal').HawkingThermodynamicsResult {
    const solarMassKg = 1.98847e30;
    const massKg = massSolar * solarMassKg;

    // Constantes físicas fundamentais (SI)
    const hbar = 1.054571817e-34; // J*s
    const c = 299792458; // m/s
    const G = 6.6743e-11; // m^3 / (kg * s^2)
    const kB = 1.380649e-23; // J / K

    // Temperatura de Hawking: T_H = (hbar * c^3) / (8 * pi * G * M * kB)
    const temperatureKelvin = (hbar * Math.pow(c, 3)) / (8 * Math.PI * G * massKg * kB);

    // Raio de Schwarzschild e Área do Horizonte: A = 4 * pi * rs^2
    const rsMeters = (2 * G * massKg) / Math.pow(c, 2);
    const horizonAreaM2 = 4 * Math.PI * Math.pow(rsMeters, 2);

    // Entropia de Bekenstein-Hawking: S_BH = (kB * c^3 * A) / (4 * G * hbar)
    const entropyBekensteinJoulesPerKelvin = (kB * Math.pow(c, 3) * horizonAreaM2) / (4 * G * hbar);
    const entropyBits = entropyBekensteinJoulesPerKelvin / (kB * Math.LN2);

    // Luminosidade Hawking: P = (hbar * c^6) / (15360 * pi * G^2 * M^2)
    const luminosityWatts = (hbar * Math.pow(c, 6)) / (15360 * Math.PI * Math.pow(G, 2) * Math.pow(massKg, 2));

    // Tempo de evaporação: t_evap = (5120 * pi * G^2 * M^3) / (hbar * c^4) (em segundos -> convertido para anos)
    const secondsInYear = 365.25 * 24 * 3600;
    const evaporationTimeSeconds = (5120 * Math.PI * Math.pow(G, 2) * Math.pow(massKg, 3)) / (hbar * Math.pow(c, 4));
    const evaporationTimeYears = evaporationTimeSeconds / secondsInYear;

    return {
      massKg,
      massSolar,
      temperatureKelvin,
      entropyBekensteinJoulesPerKelvin,
      entropyBits,
      horizonAreaM2,
      luminosityWatts,
      evaporationTimeYears,
      informationStatus: massSolar > 1e-4 ? 'unitary_preserved' : 'page_curve_turnover',
    };
  }

  /**
   * Calcula o modelo clássico do Vento do Éter vs. Experimento de Michelson-Morley (1887)
   * e a Resolução da Relatividade Especial de Einstein (1905).
   *
   * @param vKmS Velocidade relativa da Terra/aparato através do suposto éter (km/s)
   * @param armLengthM Comprimento efetivo do braço óptico (m) - original ~11m
   * @param wavelengthNm Comprimento de onda da fonte de luz (nm) - original ~590nm
   */
  public static calculateMichelsonMorleyEtherDrift(
    vKmS: number = 29.8,
    armLengthM: number = 11.0,
    wavelengthNm: number = 590.0
  ): import('../types/temporal').MichelsonMorleyResult {
    const cKmS = 299792.458; // km/s
    const cM = 299792458; // m/s
    const vMS = vKmS * 1000;
    const beta = Math.min(Math.max(vKmS / cKmS, 0), 0.99999);
    const wavelengthM = wavelengthNm * 1e-9;

    // Tempo clássico no braço longitudinal (paralelo ao vento do éter):
    // t_parallel = L / (c - v) + L / (c + v) = 2 * L * c / (c^2 - v^2) = (2L / c) * 1 / (1 - beta^2)
    const timeParallelSec = (2 * armLengthM * cM) / (cM * cM - vMS * vMS);

    // Tempo clássico no braço transversal (perpendicular ao vento do éter):
    // t_perpendicular = 2 * L / sqrt(c^2 - v^2) = (2L / c) * 1 / sqrt(1 - beta^2)
    const timePerpendicularSec = (2 * armLengthM) / Math.sqrt(Math.max(cM * cM - vMS * vMS, 1e-10));

    // Diferença temporal clássica:
    // Delta t = t_parallel - t_perpendicular ≈ (L / c) * beta^2
    const classicalDeltaTSec = timeParallelSec - timePerpendicularSec;

    // Deslocamento de franjas ao girar o interferômetro em 90 graus:
    // Delta N ≈ 2 * L * (v^2 / c^2) / lambda
    const classicalFringeShift = (2 * armLengthM * Math.pow(beta, 2)) / wavelengthM;

    // Fator de contração de FitzGerald-Lorentz: sqrt(1 - beta^2)
    const lorentzContractionFactor = Math.sqrt(Math.max(1 - beta * beta, 0));

    // O resultado experimental medido em 1887 por Michelson e Morley foi NULO (Delta N < 0.01)
    const observedFringeShift = 0.0;

    const einsteinResolution =
      'O resultado nulo de Michelson-Morley provou a inexistência do éter luminífero. Em 1905, Albert Einstein postulou que a velocidade da luz c é idêntica e constante em todas as direções para todos os referenciais inerciais, unificando espaço e tempo na métrica de Minkowski ds² = -c²dt² + dx² + dy² + dz².';

    return {
      vKmS,
      beta: Number(beta.toFixed(7)),
      armLengthM,
      wavelengthNm,
      timeParallelSec,
      timePerpendicularSec,
      classicalDeltaTSec,
      classicalFringeShift: Number(classicalFringeShift.toFixed(4)),
      observedFringeShift,
      lorentzContractionFactor: Number(lorentzContractionFactor.toFixed(8)),
      etherStatus: 'refuted_by_null_result',
      einsteinResolution,
    };
  }
}

