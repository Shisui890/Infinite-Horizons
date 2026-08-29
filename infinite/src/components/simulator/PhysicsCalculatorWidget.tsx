import { useState } from 'react';
import { useLaymanMode } from '../../context/LaymanModeContext';
import MathFormula from '../MathFormula';

export default function PhysicsCalculatorWidget() {
  const { isLaymanMode } = useLaymanMode();
  const [activeCalc, setActiveCalc] = useState<'maxwell' | 'special_relativity' | 'general_relativity' | 'lyapunov'>('special_relativity');

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
  const redshiftZ = isInsideHorizon ? Infinity : 1 / grDilationRatio - 1;
  const orbitalVelocityFraction = Math.min(Math.sqrt(1 / (2 * clampedDist)), 1.0);
  const orbitalVelocityKmS = orbitalVelocityFraction * 299792;

  // --- Lyapunov Parameters ---
  const [lambda, setLambda] = useState<number>(0.45);
  const [timeSteps, setTimeSteps] = useState<number>(5);
  const divergence = Math.exp(lambda * timeSteps);

  return (
    <div className="physics-calc-widget">
      <div className="calc-tabs">
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'maxwell' ? 'active' : ''}`}
          onClick={() => setActiveCalc('maxwell')}
        >
          {isLaymanMode ? 'Luz' : 'Maxwell'}
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'special_relativity' ? 'active' : ''}`}
          onClick={() => setActiveCalc('special_relativity')}
        >
          {isLaymanMode ? 'Nave' : 'R. Especial'}
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'general_relativity' ? 'active' : ''}`}
          onClick={() => setActiveCalc('general_relativity')}
        >
          {isLaymanMode ? 'Buraco Negro' : 'R. Geral'}
        </button>
        <button
          type="button"
          className={`calc-tab-btn ${activeCalc === 'lyapunov' ? 'active' : ''}`}
          onClick={() => setActiveCalc('lyapunov')}
        >
          {isLaymanMode ? 'Borboleta' : 'Caos (λ)'}
        </button>
      </div>

      <div className="calc-content-panel">
        {/* ========================================================= */}
        {/* TAB 1: EQUAÇÕES DE MAXWELL (1865) */}
        {/* ========================================================= */}
        {activeCalc === 'maxwell' && (
          <div className="calc-pane">
            <MathFormula
              math="c = \frac{1}{\sqrt{\mu_0 \epsilon_0}}, \qquad u = \frac{1}{2}\epsilon_0 E^2 + \frac{B^2}{2\mu_0}"
              block
            />

            {isLaymanMode && (
              <div className="layman-formula-card">
                <div className="layman-formula-header">O QUE ESTA FÓRMULA SIGNIFICA</div>
                <p>
                  A velocidade da luz (<MathFormula math="c = 300.000\text{ km/s}" />) é o resultado natural da união entre a força elétrica (<MathFormula math="\epsilon_0" />) e a força magnética (<MathFormula math="\mu_0" />) no vácuo do espaço.
                </p>
              </div>
            )}

            <div className="calc-inputs-group">
              <label>
                <span>Intensidade do Campo Elétrico (E): <strong>{electricFieldE.toLocaleString('pt-BR')} V/m</strong></span>
                <input
                  type="range"
                  min="100"
                  max="100000"
                  step="100"
                  value={electricFieldE}
                  onChange={e => setElectricFieldE(parseFloat(e.target.value))}
                />
              </label>

              <label>
                <span>Indução Magnética (B): <strong>{magneticFieldB.toFixed(2)} Tesla</strong></span>
                <input
                  type="range"
                  min="0.01"
                  max="20.0"
                  step="0.05"
                  value={magneticFieldB}
                  onChange={e => setMagneticFieldB(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">VELOCIDADE DE PROPAGAÇÃO NO VÁCUO</span>
                <strong className="result-value">{Math.round(speedOfLightMaxwell / 1000).toLocaleString('pt-BR')} km/s (c)</strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>Densidade de Energia (u):</span>
                  <strong>
                    {energyDensityU >= 1e6
                      ? `${(energyDensityU / 1e6).toFixed(2)} MJ/m³`
                      : energyDensityU >= 1e3
                      ? `${(energyDensityU / 1e3).toFixed(2)} kJ/m³`
                      : `${energyDensityU.toFixed(2)} J/m³`}
                  </strong>
                </div>
                <div className="submetric-item">
                  <span>Fluxo de Poynting (|S| = E·B/μ₀):</span>
                  <strong>
                    {poyntingS >= 1e9
                      ? `${(poyntingS / 1e9).toFixed(2)} GW/m²`
                      : poyntingS >= 1e6
                      ? `${(poyntingS / 1e6).toFixed(2)} MW/m²`
                      : `${Math.round(poyntingS).toLocaleString('pt-BR')} W/m²`}
                  </strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'A luz é uma dança contínua entre eletricidade e magnetismo: um campo elétrico variável cria magnetismo, e um campo magnético variável cria eletricidade. Isso permite que a luz se auto-propague no vácuo espacial a quase 300.000 km/s.'
                  : 'As equações diferenciais de Maxwell unificaram eletricidade e magnetismo, demonstrando que a luz é uma onda eletromagnética cuja velocidade universal c decorre das permissividades do vácuo.'}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: RELATIVIDADE ESPECIAL DE EINSTEIN (1905) */}
        {/* ========================================================= */}
        {activeCalc === 'special_relativity' && (
          <div className="calc-pane">
            <MathFormula
              math="\gamma = \frac{1}{\sqrt{1 - \beta^2}}, \qquad \Delta t = \gamma \Delta t_0, \qquad L = \frac{L_0}{\gamma}"
              block
            />

            {isLaymanMode && (
              <div className="layman-formula-card">
                <div className="layman-formula-header">O QUE ESTA FÓRMULA SIGNIFICA</div>
                <p>
                  O fator de esticamento do tempo (<MathFormula math="\gamma" />) cresce conforme sua velocidade (<MathFormula math="v" />) se aproxima da velocidade da luz (<MathFormula math="c" />). A fórmula <MathFormula math="\Delta t = \gamma \Delta t_0" /> calcula quantos dias se passam na Terra enquanto você passa apenas algumas horas viajando veloz na nave!
                </p>
              </div>
            )}

            <div className="calc-inputs-group">
              <label>
                <span>Velocidade Relativística (β = v/c): <strong>{(clampedBeta * 100).toFixed(2)}% c ({Math.round(clampedBeta * 299792).toLocaleString('pt-BR')} km/s)</strong></span>
                <input
                  type="range"
                  min="0.00"
                  max="0.999"
                  step="0.001"
                  value={velocityFraction}
                  onChange={e => setVelocityFraction(parseFloat(e.target.value))}
                />
              </label>

              <div className="calc-quick-pills">
                <button type="button" onClick={() => setVelocityFraction(0.000013)}>Satélite GPS</button>
                <button type="button" onClick={() => setVelocityFraction(0.866)}>γ = 2.0 (86.6% c)</button>
                <button type="button" onClick={() => setVelocityFraction(0.995)}>Múon Cósmico (γ = 10)</button>
                <button type="button" onClick={() => setVelocityFraction(0.999)}>Acelerador LHC (99.9% c)</button>
              </div>
            </div>

            <div className="calc-result-box">
              <div className="result-metric">
                <span className="result-label">
                  {isLaymanMode ? 'TEMPO NA TERRA ENQUANTO VOCÊ PASSA 1 HORA NA NAVE' : 'FATOR DE LORENTZ (γ)'}
                </span>
                <strong className="result-value">
                  {isLaymanMode
                    ? (srDilationTimeHours >= 24 ? `${(srDilationTimeHours / 24).toFixed(1)} dias na Terra` : `${srDilationTimeHours.toFixed(2)} horas na Terra`)
                    : (lorentzGamma >= 100 ? `${lorentzGamma.toFixed(1)}× (Ultra-Relativístico)` : `${lorentzGamma.toFixed(3)}×`)}
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Seu Tempo (Nave):' : 'Dilatação Temporal (1h própria):'}</span>
                  <strong>1 hora</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Comprimento da Nave:' : 'Contração de Lorentz (L/L₀):'}</span>
                  <strong>{lengthContractionPercent.toFixed(1)}% do original</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Energia de Movimento:' : 'Energia Cinética Relativística:'}</span>
                  <strong>{kineticEnergyRatio.toFixed(3)} m₀c²</strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'Como a velocidade da luz é o limite universal inquebrável, o tempo desacelera para quem está em alta velocidade. Enquanto você passa 1 hora na nave, as pessoas paradas na Terra envelhecem mais rápido no ritmo calculado acima!'
                  : 'A Relatividade Especial de 1905 demonstra que tempo e espaço são relativos ao observador inercial: conforme a velocidade se aproxima de c, o tempo externo dilata e o comprimento contrai na direção do movimento.'}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: RELATIVIDADE GERAL DE EINSTEIN (1915) */}
        {/* ========================================================= */}
        {activeCalc === 'general_relativity' && (
          <div className="calc-pane">
            <MathFormula
              math="\Delta t' = \frac{\Delta t_0}{\sqrt{1 - \frac{r_s}{r}}}, \qquad r_s = \frac{2GM}{c^2}"
              block
            />

            {isLaymanMode && (
              <div className="layman-formula-card">
                <div className="layman-formula-header">O QUE ESTA FÓRMULA SIGNIFICA</div>
                <p>
                  A fórmula <MathFormula math="r_s = \frac{2GM}{c^2}" /> calcula o diâmetro da sombra do buraco negro a partir da sua massa (<MathFormula math="M" />). Quanto mais perto da borda (<MathFormula math="r" />) você estiver, mais a gravidade afunda o espaço e desacelera o seu tempo!
                </p>
              </div>
            )}

            <div className="calc-inputs-group">
              <label>
                <span>Referencial de Massa Gravitacional:</span>
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
                <span className="result-label">
                  {isLaymanMode ? 'TAMANHO DO BURACO NEGRO (RAIO DE SCHWARZSCHILD)' : 'RAIO DE SCHWARZSCHILD (rₛ)'}
                </span>
                <strong className="result-value">
                  {currentMass.isPlanetary
                    ? `${currentMass.rsMm} mm`
                    : rsKm >= 1.496e8
                    ? `${(rsKm / 1.496e8).toFixed(2)} UA`
                    : `${Math.round(rsKm).toLocaleString('pt-BR')} km`}
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Desaceleração do Tempo:' : 'Dilatação Gravitacional (Δt\'):'}</span>
                  <strong>{grTimeAmplification < 100 ? `${grTimeAmplification.toFixed(2)}× mais lento` : 'Congelado'}</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Perda de Energia da Luz:' : 'Desvio para o Vermelho (z):'}</span>
                  <strong>+{redshiftZ < 100 ? redshiftZ.toFixed(2) : 'Infinito'}</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Órbita da Luz (1.5 rₛ):' : 'Esfera de Fótons (1.5 rₛ):'}</span>
                  <strong>
                    {currentMass.isPlanetary
                      ? `${(currentMass.rsMm! * 1.5).toFixed(2)} mm`
                      : rPhotonKm >= 1.496e8
                      ? `${(rPhotonKm / 1.496e8).toFixed(2)} UA`
                      : `${Math.round(rPhotonKm).toLocaleString('pt-BR')} km`}
                  </strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Órbita Segura (3.0 rₛ):' : 'Órbita Estável ISCO (3.0 rₛ):'}</span>
                  <strong>
                    {currentMass.isPlanetary
                      ? `${(currentMass.rsMm! * 3.0).toFixed(2)} mm`
                      : rIscoKm >= 1.496e8
                      ? `${(rIscoKm / 1.496e8).toFixed(2)} UA`
                      : `${Math.round(rIscoKm).toLocaleString('pt-BR')} km`}
                  </strong>
                </div>
                <div className="submetric-item">
                  <span>Velocidade Orbital (v):</span>
                  <strong>{Math.round(orbitalVelocityKmS).toLocaleString('pt-BR')} km/s ({(orbitalVelocityFraction * 100).toFixed(1)}% c)</strong>
                </div>
              </div>

              <p className="result-explanation">
                {isLaymanMode
                  ? 'A gravidade extrema deforma o tecido do espaço e estica a passagem do tempo. Quanto mais perto da borda do buraco negro você fica, mais devagar o seu relógio anda em comparação com o resto do universo.'
                  : 'A Relatividade Geral de 1915 estende a relatividade especial para referenciais acelerados e curvatura do espaço-tempo: campos gravitacionais intensos curvam geodésicas e dilatam a passagem do tempo.'}
              </p>

              {distanceFactor < 1.5 && (
                <div className="calc-alert-pill">
                  Abaixo da Esfera de Fótons (1.5 rₛ): A luz não possui órbitas fechadas estáveis.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CAOS DE LYAPUNOV & CONES DE LUZ */}
        {/* ========================================================= */}
        {activeCalc === 'lyapunov' && (
          <div className="calc-pane">
            <MathFormula math="|\delta \mathbf{x}(t)| \approx |\delta \mathbf{x}_0| \, e^{\lambda t}, \qquad t_{\text{Lyapunov}} = \frac{1}{\lambda}" block />

            {isLaymanMode && (
              <div className="layman-formula-card">
                <div className="layman-formula-header">O QUE ESTA FÓRMULA SIGNIFICA</div>
                <p>
                  Uma pequena perturbação no passado (<MathFormula math="|\delta \mathbf{x}_0|" />) é multiplicada exponencialmente a cada segundo pela taxa de caos (<MathFormula math="\lambda" />). É a prova matemática de que pequenas ações geram transformações gigantescas no futuro!
                </p>
              </div>
            )}

            <div className="calc-inputs-group">
              <label>
                <span>{isLaymanMode ? 'Intensidade do Efeito Borboleta (λ):' : 'Expoente Máximo de Lyapunov (λ):'} <strong>{lambda.toFixed(2)}</strong></span>
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
                <span>{isLaymanMode ? 'Tempo de Evolução da Mudança:' : 'Passos Temporais de Evolução (t):'} <strong>{timeSteps}</strong></span>
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
                <span className="result-label">
                  {isLaymanMode ? 'AMPLIAÇÃO DA MUDANÇA NO FUTURO' : 'AMPLIFICAÇÃO DA PERTURBAÇÃO'}
                </span>
                <strong className="result-value">
                  {divergence < 1000
                    ? `${divergence.toFixed(1)}× maior`
                    : `${divergence.toExponential(2)}× maior`}
                </strong>
              </div>

              <div className="result-submetrics-grid">
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Tempo para Dobrar a Mudança:' : 'Tempo de Lyapunov (1/λ):'}</span>
                  <strong>{(1 / lambda).toFixed(2)} passos</strong>
                </div>
                <div className="submetric-item">
                  <span>{isLaymanMode ? 'Previsibilidade do Futuro:' : 'Horizonte Preditivo:'}</span>
                  <strong>{lambda > 0.8 ? 'Caótico (Imprevisível)' : 'Estável (Previsível)'}</strong>
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
      </div>
    </div>
  );
}
