import { useState } from 'react';
import { useLaymanMode } from '../../context/LaymanModeContext';
import MathFormula from '../MathFormula';
import { MinkowskiCalculus } from '../../engine/MinkowskiCalculus';

export default function PhysicsCalculatorWidget() {
  const { isLaymanMode } = useLaymanMode();
  const [activeCalc, setActiveCalc] = useState<
    'special_relativity' | 'general_relativity' | 'kerr' | 'hawking' | 'lyapunov' | 'maxwell' | 'ether'
  >('special_relativity');

  // --- Michelson-Morley / Ether Drift Parameters (1887) ---
  const [etherVelocityKmS, setEtherVelocityKmS] = useState<number>(29.8); // velocidade orbital da Terra ~29.8 km/s
  const [etherArmLengthM, setEtherArmLengthM] = useState<number>(11.0); // braço óptico efetivo original ~11m
  const [etherWavelengthNm, setEtherWavelengthNm] = useState<number>(590.0); // luz amarela de sódio
  const etherResult = MinkowskiCalculus.calculateMichelsonMorleyEtherDrift(
    etherVelocityKmS,
    etherArmLengthM,
    etherWavelengthNm
  );

  // --- Maxwell Parameters (1865) ---
  const [electricFieldE, setElectricFieldE] = useState<number>(1000); // V/m
  const [magneticFieldB, setMagneticFieldB] = useState<number>(1.0); // Tesla
  const epsilon0 = 8.8541878128e-12; // F/m
  const mu0 = 1.25663706212e-6; // N/A^2
  const speedOfLightMaxwell = 1 / Math.sqrt(epsilon0 * mu0); // m/s (~299792458)
  const energyDensityU = 0.5 * epsilon0 * electricFieldE * electricFieldE + (magneticFieldB * magneticFieldB) / (2 * mu0); // J/m^3
  const poyntingS = (electricFieldE * magneticFieldB) / mu0; // W/m^2

  // --- Special Relativity Parameters (1905) ---
  const [velocityFraction, setVelocityFraction] = useState<number>(0.866); // beta = v/c (0.866 => gamma approx 2.0)
  const clampedBeta = Math.min(Math.max(velocityFraction, 0), 0.99999);
  const lorentzGamma = 1 / Math.sqrt(Math.max(1 - clampedBeta * clampedBeta, 1e-10));
  const srDilationTimeHours = lorentzGamma * 1.0; // 1 hr on ship
  const lengthContractionPercent = (1 / lorentzGamma) * 100;
  const kineticEnergyRatio = lorentzGamma - 1;

  // --- General Relativity Parameters (1915) ---
  const [massPreset, setMassPreset] = useState<'earth' | 'sun' | 'cygnus' | 'sgra' | 'm87' | 'ton618'>('sgra');
  const [distanceFactor, setDistanceFactor] = useState<number>(1.5); // in units of r_s

  const PRESET_MASSES: Record<
    string,
    { name: string; massSun: number; desc: string; isPlanetary?: boolean; rsMm?: number }
  > = {
    earth: { name: 'Terra (5.97 × 10²⁴ kg)', massSun: 3.003e-6, desc: 'Planeta Rochoso', isPlanetary: true, rsMm: 8.87 },
    sun: { name: 'Sol (1 M☉)', massSun: 1, desc: 'Estrela de Sequência Principal' },
    cygnus: { name: 'Cygnus X-1 (21.2 M☉)', massSun: 21.2, desc: 'Buraco Negro Estelar' },
    sgra: { name: 'Sagitário A* (4.3 × 10⁶ M☉)', massSun: 4.3e6, desc: 'Buraco Negro Supermassivo (Via Láctea)' },
    m87: { name: 'M87* (6.5 × 10⁹ M☉)', massSun: 6.5e9, desc: 'Buraco Negro Supermassivo (M87 - EHT)' },
    ton618: { name: 'TON 618 (6.6 × 10¹⁰ M☉)', massSun: 6.6e10, desc: 'Quasar Hipermassivo (Maior Conhecido)' },
  };

  const currentMass = PRESET_MASSES[massPreset];
  const rsKm = currentMass.massSun * 2.95325;
  const rPhotonKm = rsKm * 1.5;
  const rIscoKm = rsKm * 3.0;

  const isInsideHorizon = distanceFactor <= 1.0;
  const clampedDist = Math.max(distanceFactor, 1.0001);
  const grDilationRatio = Math.sqrt(1 - 1 / clampedDist);
  const grTimeAmplification = isInsideHorizon ? Infinity : 1 / grDilationRatio;
  const orbitalVelocityFraction = Math.min(Math.sqrt(1 / (2 * clampedDist)), 1.0);
  const orbitalVelocityKmS = orbitalVelocityFraction * 299792;

  // --- Kerr Metric Parameters (1963) ---
  const [kerrSpin, setKerrSpin] = useState<number>(0.92);
  const [kerrTheta, setKerrTheta] = useState<number>(90); // 90 = equator
  const [kerrDistanceFactor, setKerrDistanceFactor] = useState<number>(1.8);
  const kerrResult = MinkowskiCalculus.calculateKerrMetric(currentMass.massSun, kerrSpin, kerrTheta, kerrDistanceFactor);

  // --- Hawking Thermodynamics Parameters (1974) ---
  const [hawkingMassPreset, setHawkingMassPreset] = useState<'primordial' | 'stellar' | 'sgra' | 'm87'>('stellar');
  const HAWKING_PRESETS: Record<string, { name: string; massSun: number; desc: string }> = {
    primordial: { name: 'Primordial (10¹² kg)', massSun: 5.0e-19, desc: 'Micro-Buraco Negro do Big Bang' },
    stellar: { name: 'Estelar (10 M☉)', massSun: 10, desc: 'Buraco Negro de Colapso Estelar' },
    sgra: { name: 'Sagitário A* (4.3 × 10⁶ M☉)', massSun: 4.3e6, desc: 'Supermassivo no Centro da Galáxia' },
    m87: { name: 'M87* (6.5 × 10⁹ M☉)', massSun: 6.5e9, desc: 'Buraco Negro Gigante de M87' },
  };
  const hawkingResult = MinkowskiCalculus.calculateHawkingThermodynamics(HAWKING_PRESETS[hawkingMassPreset].massSun);

  // --- Lyapunov Parameters ---
  const [lambda, setLambda] = useState<number>(0.45);
  const [timeSteps, setTimeSteps] = useState<number>(5);
  const divergence = Math.exp(lambda * timeSteps);

  return (
    <div className="physics-calc-widget">
      <div className="calc-tabs">
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'special_relativity' ? 'active' : ''}`}
          onClick={() => setActiveCalc('special_relativity')}
        >
          {isLaymanMode ? 'Nave (Velocidade)' : 'R. Especial'}
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'general_relativity' ? 'active' : ''}`}
          onClick={() => setActiveCalc('general_relativity')}
        >
          {isLaymanMode ? 'Gravidade & Tempo' : 'R. Geral'}
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'kerr' ? 'active' : ''}`}
          onClick={() => setActiveCalc('kerr')}
        >
          {isLaymanMode ? 'Buraco Giratório' : 'Métrica de Kerr'}
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'hawking' ? 'active' : ''}`}
          onClick={() => setActiveCalc('hawking')}
        >
          {isLaymanMode ? 'Radiação Hawking' : 'Termodinâmica'}
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'lyapunov' ? 'active' : ''}`}
          onClick={() => setActiveCalc('lyapunov')}
        >
          {isLaymanMode ? 'Efeito Borboleta' : 'Caos (λ)'}
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'maxwell' ? 'active' : ''}`}
          onClick={() => setActiveCalc('maxwell')}
        >
          {isLaymanMode ? 'Luz & Ondas' : 'Maxwell'}
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'ether' ? 'active' : ''}`}
          onClick={() => setActiveCalc('ether')}
        >
          {isLaymanMode ? 'Vento do Éter' : 'Éter & Michelson'}
        </button>
      </div>

      <div className="calc-content-panel">
        {/* ========================================================= */}
        {/* TAB 1: RELATIVIDADE ESPECIAL */}
        {/* ========================================================= */}
        {activeCalc === 'special_relativity' && (
          <div className="calc-pane">
            <MathFormula math="\Delta t' = \gamma \Delta t = \frac{\Delta t}{\sqrt{1 - v^2/c^2}}, \qquad L' = L \sqrt{1 - v^2/c^2}" block />

            <div className="calc-inputs-group">
              <label>
                <span>{isLaymanMode ? 'Velocidade da Nave (% da Luz):' : 'Velocidade Relativa (β = v/c):'} <strong>{(velocityFraction * 100).toFixed(1)}% c</strong></span>
                <input
                  type="range"
                  min="0"
                  max="0.999"
                  step="0.001"
                  value={velocityFraction}
                  onChange={e => setVelocityFraction(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">{isLaymanMode ? 'FATOR DE DESACELERAÇÃO DO TEMPO' : 'FATOR DE LORENTZ (γ)'}</span>
                <strong className="result-value">{lorentzGamma.toFixed(3)}×</strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>{isLaymanMode ? '1 Hora na Nave Equivale a:' : 'Dilatação Temporal (1h nave):'}</span>
                  <strong>{srDilationTimeHours.toFixed(2)}h na Terra</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Tamanho da Nave em Movimento:' : 'Contração de Comprimento:'}</span>
                  <strong>{lengthContractionPercent.toFixed(1)}% do original</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Energia Necessária:' : 'Energia Cinética (E_k/m c²):'}</span>
                  <strong>{kineticEnergyRatio.toFixed(2)}× E₀</strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'Quanto mais rápido você viaja pelo espaço, mais devagar você viaja pelo tempo. A 86.6% da velocidade da luz, cada 1 hora dentro da nave corresponde a 2 horas para quem ficou na Terra.'
                  : 'A invariância da velocidade da luz c no vácuo impõe que intervalos espaço-temporais tipo-tempo sofram rotações hiperbólicas de Lorentz, dilatando o tempo próprio do referencial móvel.'}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: RELATIVIDADE GERAL (SCHWARZSCHILD) */}
        {/* ========================================================= */}
        {activeCalc === 'general_relativity' && (
          <div className="calc-pane">
            <MathFormula math="r_s = \frac{2GM}{c^2}, \qquad \Delta t' = \frac{\Delta t}{\sqrt{1 - r_s / r}}" block />

            <div className="calc-inputs-group">
              <label>
                <span>Corpo Celeste / Buraco Negro:</span>
                <select
                  value={massPreset}
                  onChange={e => setMassPreset(e.target.value as any)}
                >
                  {Object.entries(PRESET_MASSES).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name} — {item.desc}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>{isLaymanMode ? 'Distância até o Buraco Negro:' : 'Distância Radial (r / rₛ):'} <strong>{distanceFactor.toFixed(2)} rₛ</strong></span>
                <input
                  type="range"
                  min="0.95"
                  max="10.0"
                  step="0.05"
                  value={distanceFactor}
                  onChange={e => setDistanceFactor(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">{isLaymanMode ? 'RAIO DO HORIZONTE DE EVENTOS' : 'RAIO DE SCHWARZSCHILD (rₛ)'}</span>
                <strong className="result-value">
                  {rsKm > 1e6
                    ? `${(rsKm / 1e6).toFixed(2)} milhões km`
                    : rsKm > 1000
                    ? `${(rsKm / 1000).toFixed(1)} mil km`
                    : `${rsKm.toFixed(2)} km`}
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Desaceleração do Tempo:' : 'Dilatação Gravitacional:'}</span>
                  <strong>{isInsideHorizon ? 'Infinito (Congelado)' : `${grTimeAmplification.toFixed(3)}×`}</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Esfera de Fótons (Luz em Órbita):' : 'Esfera de Fótons (1.5 rₛ):'}</span>
                  <strong>{rPhotonKm.toFixed(1)} km</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Órbita Estável Mais Próxima:' : 'ISCO (3.0 rₛ):'}</span>
                  <strong>{rIscoKm.toFixed(1)} km</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Velocidade Orbital Circular:' : 'Velocidade Orbital (v_orb):'}</span>
                  <strong>{(orbitalVelocityFraction * 100).toFixed(1)}% c ({orbitalVelocityKmS.toFixed(0)} km/s)</strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'A gravidade deforma o tecido do espaço. Perto da borda do buraco negro, a atração é tão violenta que o tempo praticamente congela para quem observa de longe.'
                  : 'A geometria exterior de Schwarzschild impõe uma singularidade coordenada em r = rs e uma esfera de fótons instável em 1.5 rs.'}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MÉTRICA DE KERR (BURACOS NEGROS GIRATÓRIOS) */}
        {/* ========================================================= */}
        {activeCalc === 'kerr' && (
          <div className="calc-pane">
            <MathFormula math="r_+ = M + \sqrt{M^2 - a^2}, \qquad r_E(\theta) = M + \sqrt{M^2 - a^2\cos^2\theta}, \qquad \eta_{\text{Penrose}} \le 29.3\%" block />

            <div className="calc-inputs-group">
              <label>
                <span>{isLaymanMode ? 'Velocidade de Giro do Buraco (Spin a*):' : 'Parâmetro de Spin Adimensional (a* = J/M):'} <strong>{kerrSpin.toFixed(2)}</strong></span>
                <input
                  type="range"
                  min="0"
                  max="0.99"
                  step="0.01"
                  value={kerrSpin}
                  onChange={e => setKerrSpin(parseFloat(e.target.value))}
                />
              </label>

              <label>
                <span>{isLaymanMode ? 'Ângulo de Entrada (0° Polo / 90° Equador):' : 'Co-latitude Polar (θ em graus):'} <strong>{kerrTheta}°</strong></span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={kerrTheta}
                  onChange={e => setKerrTheta(parseInt(e.target.value, 10))}
                />
              </label>

              <label>
                <span>{isLaymanMode ? 'Distância do Centro (r / M):' : 'Distância Radial (r / M):'} <strong>{kerrDistanceFactor.toFixed(2)} M</strong></span>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.05"
                  value={kerrDistanceFactor}
                  onChange={e => setKerrDistanceFactor(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">{isLaymanMode ? 'EXTRAÇÃO DE ENERGIA (PROCESSO DE PENROSE)' : 'EFICIÊNCIA MÁXIMA DE PENROSE'}</span>
                <strong className="result-value" style={{ color: 'var(--color-violet)' }}>
                  +{kerrResult.penroseEfficiencyMaxPercent.toFixed(1)}% de energia
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Limite da Ergosfera r_E(θ):' : 'Superfície Limite Estático (Ergosfera):'}</span>
                  <strong>{kerrResult.rErgosphereKm.toFixed(1)} km</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Horizonte de Eventos Exterior (r+):' : 'Horizonte de Eventos (r+):'}</span>
                  <strong>{kerrResult.rPlusKm.toFixed(1)} km</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Horizonte de Cauchy Interior (r-):' : 'Horizonte de Cauchy (r-):'}</span>
                  <strong>{kerrResult.rMinusKm.toFixed(1)} km</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Arrasto do Espaço (Lense-Thirring):' : 'Frequência de Frame-Dragging (ω):'}</span>
                  <strong>{kerrResult.frameDraggingOmegaRadPerSec.toFixed(2)} rad/s</strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'Quando um buraco negro gira, ele arrasta o próprio espaço ao seu redor como um redemoinho. Na ergosfera, é impossível ficar parado: você é forçado a girar junto com o cosmos, permitindo roubar energia rotacional!'
                  : 'A Métrica de Kerr (1963) descreve um buraco negro estacionário com momento angular J. O arrasto de referenciais inerciais (Lense-Thirring) cria uma ergosfera onde trajetórias tipo-tempo com energia negativa permitem o Processo de Penrose.'}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: TERMODINÂMICA DE HAWKING */}
        {/* ========================================================= */}
        {activeCalc === 'hawking' && (
          <div className="calc-pane">
            <MathFormula math="T_H = \frac{\hbar c^3}{8\pi G M k_B}, \qquad S_{\text{BH}} = \frac{k_B c^3 A}{4 G \hbar}, \qquad t_{\text{evap}} \approx \frac{5120\pi G^2 M^3}{\hbar c^4}" block />

            <div className="calc-inputs-group">
              <label>
                <span>Massa do Objeto Quântico:</span>
                <select
                  value={hawkingMassPreset}
                  onChange={e => setHawkingMassPreset(e.target.value as any)}
                >
                  {Object.entries(HAWKING_PRESETS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name} — {item.desc}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">{isLaymanMode ? 'TEMPO PARA EVAPORAR COMPLETAMENTE' : 'TEMPO DE EVAPORAÇÃO DE HAWKING'}</span>
                <strong className="result-value" style={{ color: 'var(--color-emerald)' }}>
                  {hawkingResult.evaporationTimeYears > 1e12
                    ? `${hawkingResult.evaporationTimeYears.toExponential(2)} anos`
                    : `${hawkingResult.evaporationTimeYears.toFixed(2)} anos`}
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Temperatura de Radiação:' : 'Temperatura de Hawking (T_H):'}</span>
                  <strong>
                    {hawkingResult.temperatureKelvin < 1e-4
                      ? `${hawkingResult.temperatureKelvin.toExponential(2)} K`
                      : `${hawkingResult.temperatureKelvin.toFixed(4)} K`}
                  </strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Informação Codificada no Horizonte:' : 'Entropia de Bekenstein (Bits):'}</span>
                  <strong>{hawkingResult.entropyBits.toExponential(2)} bits</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Área da Superfície Cósmica:' : 'Área do Horizonte (A):'}</span>
                  <strong>{hawkingResult.horizonAreaM2.toExponential(2)} m²</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Emissão Quântica:' : 'Luminosidade Hawking (Watts):'}</span>
                  <strong>{hawkingResult.luminosityWatts.toExponential(2)} W</strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'Pares de partículas quânticas surgem no vácuo: quando uma cai no buraco negro e a outra escapa, o buraco negro perde massa lentamente em forma de calor (Radiação Hawking), evaporando após trilhões de anos.'
                  : 'A 2ª Lei Generalizada da Termodinâmica impõe que a entropia de Bekenstein-Hawking (S_BH = k_B A / 4 l_P^2) codifica a informação quântica na superfície holográfica do horizonte de eventos.'}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CAOS DE LYAPUNOV */}
        {/* ========================================================= */}
        {activeCalc === 'lyapunov' && (
          <div className="calc-pane">
            <MathFormula math="|\delta \mathbf{x}(t)| \approx |\delta \mathbf{x}_0| \, e^{\lambda t}, \qquad t_{\text{Lyapunov}} = \frac{1}{\lambda}" block />

            <div className="calc-inputs-group">
              <label>
                <span>{isLaymanMode ? 'Taxa de Caos (λ):' : 'Expoente de Lyapunov (λ):'} <strong>{lambda.toFixed(2)}</strong></span>
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
                <span>{isLaymanMode ? 'Passos no Tempo:' : 'Passos Temporais (t):'} <strong>{timeSteps}</strong></span>
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
                <span className="result-label">{isLaymanMode ? 'AMPLIAÇÃO DA MUDANÇA NO FUTURO' : 'AMPLIFICAÇÃO CAÓTICA'}</span>
                <strong className="result-value">
                  {divergence < 1000 ? `${divergence.toFixed(1)}× maior` : `${divergence.toExponential(2)}× maior`}
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Tempo para Dobrar:' : 'Tempo de Lyapunov (1/λ):'}</span>
                  <strong>{(1 / lambda).toFixed(2)} passos</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Previsibilidade:' : 'Regime Dinâmico:'}</span>
                  <strong>{lambda > 0.8 ? 'Hipercaótico' : 'Quase-Integrável'}</strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'Pequenas causas geram grandes efeitos: uma alteração minúscula hoje se multiplica exponencialmente com o passar do tempo, demonstrando por que o futuro de sistemas complexos como o clima ou o espaço-tempo se torna difícil de prever a longo prazo.'
                  : (lambda > 0.8
                    ? 'Regime Hipercaótico: O erro inicial duplica rapidamente, tornando trajetórias no espaço-tempo imprevisíveis no longo prazo.'
                    : 'Regime Quase-Integrável: Perturbações causais permanecem confinadas no cone de luz sob autoconsistência de Novikov.')}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: EQUAÇÕES DE MAXWELL */}
        {/* ========================================================= */}
        {activeCalc === 'maxwell' && (
          <div className="calc-pane">
            <MathFormula math="c = \frac{1}{\sqrt{\mu_0 \epsilon_0}}, \qquad u = \frac{1}{2}\epsilon_0 E^2 + \frac{B^2}{2\mu_0}, \qquad \mathbf{S} = \frac{1}{\mu_0} (\mathbf{E} \times \mathbf{B})" block />

            <div className="calc-inputs-group">
              <label>
                <span>{isLaymanMode ? 'Intensidade do Campo Elétrico (E):' : 'Campo Elétrico (E em V/m):'} <strong>{electricFieldE} V/m</strong></span>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={electricFieldE}
                  onChange={e => setElectricFieldE(parseFloat(e.target.value))}
                />
              </label>

              <label>
                <span>{isLaymanMode ? 'Intensidade do Campo Magnético (B):' : 'Campo Magnético (B em Tesla):'} <strong>{magneticFieldB.toFixed(2)} T</strong></span>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={magneticFieldB}
                  onChange={e => setMagneticFieldB(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">{isLaymanMode ? 'VELOCIDADE EXATA DA LUZ CALCULADA' : 'VELOCIDADE DA LUZ DERIVADA (1/√(ε₀μ₀))'}</span>
                <strong className="result-value">{(speedOfLightMaxwell / 1000).toFixed(0)} km/s</strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>Densidade de Energia Eletromagnética (u):</span>
                  <strong>{energyDensityU > 1000 ? `${(energyDensityU / 1000).toFixed(2)} kJ/m³` : `${energyDensityU.toFixed(2)} J/m³`}</strong>
                </div>
                <div className="submetric-item">
                  <span>Fluxo de Potência (Vetor de Poynting |S|):</span>
                  <strong>{poyntingS > 1e6 ? `${(poyntingS / 1e6).toFixed(2)} MW/m²` : `${(poyntingS / 1e3).toFixed(2)} kW/m²`}</strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'Em 1865, James Clerk Maxwell uniu a eletricidade e o magnetismo e descobriu que a luz é uma onda eletromagnética que viaja com velocidade constante fixa de quase 300.000 km/s no vácuo.'
                  : 'A unificação de Maxwell (1865) demonstrou que a velocidade das ondas eletromagnéticas emerge diretamente das constantes fundamentais do vácuo ε₀ e μ₀.'}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: O PROBLEMA DO ÉTER & MICHELSON-MORLEY (1887) */}
        {/* ========================================================= */}
        {activeCalc === 'ether' && (
          <div className="calc-pane">
            <MathFormula
              math="\Delta t \approx \frac{L v^2}{c^3}, \qquad \Delta N_{\text{clássico}} = \frac{2 L v^2}{\lambda c^2}, \qquad \Delta N_{\text{medido}} = 0.00 \pm 0.01"
              block
            />

            <div className="calc-inputs-group">
              <label>
                <span>
                  {isLaymanMode ? 'Velocidade do Vento do Éter (Órbita da Terra):' : 'Velocidade Relativa ao Éter (v):'}{' '}
                  <strong>{etherVelocityKmS.toFixed(1)} km/s</strong>{' '}
                  {Math.abs(etherVelocityKmS - 29.8) < 0.1 ? '(Órbita Terrestre Padrão)' : `(${(etherResult.beta * 100).toFixed(3)}% c)`}
                </span>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="0.5"
                  value={etherVelocityKmS}
                  onChange={e => setEtherVelocityKmS(parseFloat(e.target.value))}
                />
              </label>

              <label>
                <span>
                  {isLaymanMode ? 'Comprimento dos Braços de Luz do Interferômetro:' : 'Braço Óptico Efetivo (L):'}{' '}
                  <strong>{etherArmLengthM.toFixed(1)} metros</strong>
                </span>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={etherArmLengthM}
                  onChange={e => setEtherArmLengthM(parseFloat(e.target.value))}
                />
              </label>

              <label>
                <span>
                  {isLaymanMode ? 'Cor da Luz Utilizada:' : 'Comprimento de Onda da Luz (λ):'}{' '}
                  <strong>{etherWavelengthNm.toFixed(0)} nm</strong>{' '}
                  {etherWavelengthNm === 590 ? '(Luz Amarela de Sódio - 1887)' : ''}
                </span>
                <input
                  type="range"
                  min="400"
                  max="700"
                  step="10"
                  value={etherWavelengthNm}
                  onChange={e => setEtherWavelengthNm(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">
                  {isLaymanMode ? 'DESLOCAMENTO DE FRANJAS REAL (RESULTADO NULO)' : 'DESLOCAMENTO MEDIDO EXPERIMENTALMENTE (1887)'}
                </span>
                <strong className="result-value" style={{ color: '#10b981' }}>
                  ΔN = {etherResult.observedFringeShift.toFixed(2)} franjas (RESULTADO NULO)
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>Deslocamento Clássico Previsto (Éter):</span>
                  <strong style={{ color: '#f59e0b' }}>ΔN = {etherResult.classicalFringeShift.toFixed(3)} franjas</strong>
                </div>
                <div className="submetric-item">
                  <span>Diferença Temporal Clássica (Δt):</span>
                  <strong>{(etherResult.classicalDeltaTSec * 1e15).toFixed(2)} fs (10⁻¹⁵ s)</strong>
                </div>
                <div className="submetric-item">
                  <span>Contração de FitzGerald-Lorentz (γ⁻¹):</span>
                  <strong>{etherResult.lorentzContractionFactor.toFixed(8)}</strong>
                </div>
                <div className="submetric-item">
                  <span>Veredito da Relatividade Especial:</span>
                  <strong style={{ color: '#00e5ff' }}>Éter Inexistente (c universal)</strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'A física do século XIX acreditava que a luz necessitava de um "éter" mecânico para viajar pelo vácuo. O experimento de Michelson-Morley provou que não existe vento do éter algum: a velocidade da luz é invariante para todos os observadores! Isso serviu de base direta para Albert Einstein formular a Relatividade Especial em 1905.'
                  : etherResult.einsteinResolution}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
