import { useState } from 'react';
import MathFormula from '../MathFormula';

export default function PhysicsCalculatorWidget() {
  const [activeCalc, setActiveCalc] = useState<'dilation' | 'schwarzschild' | 'lyapunov'>('dilation');

  // Parameters for Dilation & Schwarzschild
  const [massPreset, setMassPreset] = useState<'earth' | 'sun' | 'cygnus' | 'sgra' | 'm87' | 'ton618'>('sgra');
  const [distanceFactor, setDistanceFactor] = useState<number>(1.5); // in units of r_s

  // Parameters for Lyapunov
  const [lambda, setLambda] = useState<number>(0.45);
  const [timeSteps, setTimeSteps] = useState<number>(5);

  // Constants
  const PRESET_MASSES: Record<
    string,
    { name: string; massSun: number; desc: string; isPlanetary?: boolean; rsMm?: number }
  > = {
    earth: {
      name: 'Terra (5.97 × 10²⁴ kg)',
      massSun: 3.003e-6,
      desc: 'Planeta Rochoso (Massa Terrestre)',
      isPlanetary: true,
      rsMm: 8.87, // 8.87 milímetros
    },
    sun: {
      name: 'Sol (1 M☉)',
      massSun: 1,
      desc: 'Estrela de Sequência Principal',
    },
    cygnus: {
      name: 'Cygnus X-1 (21.2 M☉)',
      massSun: 21.2,
      desc: 'Buraco Negro de Massa Estelar',
    },
    sgra: {
      name: 'Sagitário A* (4.3 × 10⁶ M☉)',
      massSun: 4.3e6,
      desc: 'Buraco Negro Supermassivo (Centro da Via Láctea)',
    },
    m87: {
      name: 'M87* (6.5 × 10⁹ M☉)',
      massSun: 6.5e9,
      desc: 'Buraco Negro Supermassivo (Galáxia M87 - Horizonte EHT)',
    },
    ton618: {
      name: 'TON 618 (6.6 × 10¹⁰ M☉)',
      massSun: 6.6e10,
      desc: 'Quasar Hipermassivo (Maior Buraco Negro Conhecido)',
    },
  };

  const currentMass = PRESET_MASSES[massPreset];
  // r_s for 1 solar mass = 2.95325 km
  const rsKm = currentMass.massSun * 2.95325;
  const rPhotonKm = rsKm * 1.5;
  const rIscoKm = rsKm * 3.0;

  // Dilation factor: 1 / sqrt(1 - 1/distanceFactor)
  const isInsideHorizon = distanceFactor <= 1.0;
  const clampedDist = Math.max(distanceFactor, 1.0001);
  const dilationRatio = Math.sqrt(1 - 1 / clampedDist);
  const timeAmplification = isInsideHorizon ? Infinity : 1 / dilationRatio;

  // Gravitational Redshift: z = (1 / sqrt(1 - r_s/r)) - 1
  const redshiftZ = isInsideHorizon ? Infinity : 1 / dilationRatio - 1;

  // Orbital velocity: v/c = sqrt(r_s / (2*r))
  const orbitalVelocityFraction = Math.min(Math.sqrt(1 / (2 * clampedDist)), 1.0);
  const orbitalVelocityKmS = orbitalVelocityFraction * 299792;

  // Lyapunov divergence: e^(lambda * t)
  const divergence = Math.exp(lambda * timeSteps);

  return (
    <div className="physics-calc-widget">
      <div className="calc-tabs">
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'dilation' ? 'active' : ''}`}
          onClick={() => setActiveCalc('dilation')}
        >
          Dilatação (Δt)
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'schwarzschild' ? 'active' : ''}`}
          onClick={() => setActiveCalc('schwarzschild')}
        >
          Raio (rₛ)
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'lyapunov' ? 'active' : ''}`}
          onClick={() => setActiveCalc('lyapunov')}
        >
          Caos (λ)
        </button>
      </div>

      <div className="calc-content-panel">
        {/* TAB 1: DILATAÇÃO GRAVITACIONAL */}
        {activeCalc === 'dilation' && (
          <div className="calc-pane">
            <MathFormula
              math="\Delta t' = \frac{\Delta t_0}{\sqrt{1 - \frac{r_s}{r}}}, \qquad z = \frac{1}{\sqrt{1 - \frac{r_s}{r}}} - 1"
              block
            />

            <div className="calc-inputs-group">
              <label>
                <span>Referencial de Massa Cósmica:</span>
                <select
                  value={massPreset}
                  onChange={e => setMassPreset(e.target.value as 'earth' | 'sun' | 'cygnus' | 'sgra' | 'm87' | 'ton618')}
                >
                  <option value="earth">Terra (5.97 × 10²⁴ kg)</option>
                  <option value="sun">Sol (1 M☉)</option>
                  <option value="cygnus">Cygnus X-1 (21.2 M☉)</option>
                  <option value="sgra">Sagitário A* (4.3M M☉)</option>
                  <option value="m87">M87* (6.5B M☉)</option>
                  <option value="ton618">TON 618 (66B M☉)</option>
                </select>
              </label>

              <label>
                <span>Distância Radial ao Centro: <strong>{distanceFactor.toFixed(2)} rₛ</strong></span>
                <input
                  type="range"
                  min="1.05"
                  max="10.0"
                  step="0.05"
                  value={distanceFactor}
                  onChange={e => setDistanceFactor(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">FATOR DE DILATAÇÃO DO TEMPO</span>
                <strong className="result-value">
                  {timeAmplification < 100
                    ? `${timeAmplification.toFixed(2)}× mais lento`
                    : 'Regime Quase-Congelado'}
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>Desvio Gravitacional (z):</span>
                  <strong>+{redshiftZ < 100 ? redshiftZ.toFixed(2) : '∞ (Horizonte)'}</strong>
                </div>
                <div className="submetric-item">
                  <span>Velocidade Orbital (v):</span>
                  <strong>{Math.round(orbitalVelocityKmS).toLocaleString('pt-BR')} km/s ({(orbitalVelocityFraction * 100).toFixed(1)}% c)</strong>
                </div>
              </div>

              <p className="result-explanation">
                Para cada <strong>1 hora</strong> decorrida na coordenada de {distanceFactor.toFixed(2)} rₛ, transcorrem{' '}
                <strong>{timeAmplification.toFixed(1)} horas</strong> no referencial remoto assintótico de Minkowski.
              </p>

              {distanceFactor < 1.5 && (
                <div className="calc-alert-pill">
                  ⚠️ Abaixo da Esfera de Fótons (1.5 rₛ): Nem a luz consegue orbitar estavelmente sem cair no horizonte.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: RAIO DE SCHWARZSCHILD */}
        {activeCalc === 'schwarzschild' && (
          <div className="calc-pane">
            <MathFormula math="r_s = \frac{2GM}{c^2}, \quad r_{ph} = 1.5\,r_s, \quad r_{\text{ISCO}} = 3.0\,r_s" block />

            <div className="calc-inputs-group">
              <label>
                <span>Objeto Astronômico:</span>
                <select
                  value={massPreset}
                  onChange={e => setMassPreset(e.target.value as 'earth' | 'sun' | 'cygnus' | 'sgra' | 'm87' | 'ton618')}
                >
                  <option value="earth">Terra (Massa Planetária)</option>
                  <option value="sun">Sol (Estrela M☉)</option>
                  <option value="cygnus">Cygnus X-1 (Estelar 21 M☉)</option>
                  <option value="sgra">Sagitário A* (Via Láctea 4.3M M☉)</option>
                  <option value="m87">M87* (Galáxia M87 6.5B M☉)</option>
                  <option value="ton618">TON 618 (Hipermassivo 66B M☉)</option>
                </select>
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">RAIO DO HORIZONTE DE SCHWARZSCHILD (rₛ)</span>
                <strong className="result-value">
                  {currentMass.isPlanetary
                    ? `${currentMass.rsMm} milímetros`
                    : rsKm >= 1.496e8
                    ? `${(rsKm / 1.496e8).toFixed(2)} UA (${(rsKm / 1e9).toFixed(2)} bilhões km)`
                    : `${Math.round(rsKm).toLocaleString('pt-BR')} km`}
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>Esfera de Fótons (1.5 rₛ):</span>
                  <strong>
                    {currentMass.isPlanetary
                      ? `${(currentMass.rsMm! * 1.5).toFixed(2)} mm`
                      : rPhotonKm >= 1.496e8
                      ? `${(rPhotonKm / 1.496e8).toFixed(2)} UA`
                      : `${Math.round(rPhotonKm).toLocaleString('pt-BR')} km`}
                  </strong>
                </div>
                <div className="submetric-item">
                  <span>Órbita Estável ISCO (3.0 rₛ):</span>
                  <strong>
                    {currentMass.isPlanetary
                      ? `${(currentMass.rsMm! * 3.0).toFixed(2)} mm`
                      : rIscoKm >= 1.496e8
                      ? `${(rIscoKm / 1.496e8).toFixed(2)} UA`
                      : `${Math.round(rIscoKm).toLocaleString('pt-BR')} km`}
                  </strong>
                </div>
              </div>

              <p className="result-explanation">
                {currentMass.isPlanetary
                  ? 'Se a massa total da Terra fosse compactada até se tornar um buraco negro, seu horizonte teria o tamanho de uma pequena esfera de 8.87 mm.'
                  : `Região de não-retorno no espaço-tempo. A esfera de fótons a ${Math.round(rPhotonKm).toLocaleString('pt-BR')} km demarca o anel de emissão observado pelo EHT.`}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: CAOS DE LYAPUNOV */}
        {activeCalc === 'lyapunov' && (
          <div className="calc-pane">
            <MathFormula math="|\delta \mathbf{x}(t)| \approx |\delta \mathbf{x}_0| \, e^{\lambda t}, \qquad t_{\text{Lyapunov}} = \frac{1}{\lambda}" block />

            <div className="calc-inputs-group">
              <label>
                <span>Expoente Máximo de Lyapunov (λ): <strong>{lambda.toFixed(2)}</strong></span>
                <input
                  type="range"
                  min="0.05"
                  max="1.5"
                  step="0.05"
                  value={lambda}
                  onChange={e => setLambda(parseFloat(e.target.value))}
                />
              </label>

              <label>
                <span>Passos Temporais de Evolução (t): <strong>{timeSteps}</strong></span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={timeSteps}
                  onChange={e => setTimeSteps(parseInt(e.target.value, 10))}
                />
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">AMPLIFICAÇÃO DA PERTURBAÇÃO</span>
                <strong className="result-value">
                  {divergence < 1000
                    ? `${divergence.toFixed(1)}×`
                    : `${divergence.toExponential(2)}×`}
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>Tempo de Lyapunov (1/λ):</span>
                  <strong>{(1 / lambda).toFixed(2)} passos</strong>
                </div>
                <div className="submetric-item">
                  <span>Horizonte Preditivo:</span>
                  <strong>{lambda > 0.8 ? 'Ultra-Curto' : 'Estável'}</strong>
                </div>
              </div>

              <p className="result-explanation">
                {lambda > 0.8
                  ? '⚠️ Regime Hipercaótico: O erro inicial duplica rapidamente, tornando trajetórias no espaço-tempo imprevisíveis no longo prazo.'
                  : '✅ Regime Quase-Integrável: Perturbações causais permanecem confinadas no cone de luz sob autoconsistência de Novikov.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
