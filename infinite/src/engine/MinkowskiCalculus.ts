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
}
