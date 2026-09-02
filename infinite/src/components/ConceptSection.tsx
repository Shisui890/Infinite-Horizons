import { useLaymanMode } from '../context/LaymanModeContext';

export default function ConceptSection() {
  const { isLaymanMode } = useLaymanMode();

  return (
    <section id="concept-section" className="section concept-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">
            {isLaymanMode ? 'FUNDAMENTOS BÁSICOS' : 'FUNDAMENTAÇÃO TEÓRICA'}
          </span>
          <h2 className="section-title">
            {isLaymanMode
              ? 'Como o Espaço, o Tempo e a Matéria Funcionam'
              : 'Estrutura Geométrica do Espaço-Tempo & Multiverso'}
          </h2>
          <p className="section-subtitle">
            {isLaymanMode
              ? 'Quatro princípios fundamentais que regem a realidade, desde a menor partícula até os limites do universo observável.'
              : 'Pilares matemáticos e físicos que sustentam a conservação de causalidade, entropia e topologia dimensional no simulador.'}
          </p>
        </div>

        <div className="concept-grid">
          {/* Card 1: Relatividade */}
          <div className="concept-card">
            <div className="concept-card-top">
              <span className="concept-card-pill pill-cyan">
                {isLaymanMode ? 'ESPAÇO CURVO' : 'RELATIVIDADE GERAL'}
              </span>
              <span className="concept-card-year">1915</span>
            </div>
            <h3 className="concept-card-heading">
              {isLaymanMode ? 'A Gravidade Deforma o Espaço' : 'Métrica de Einstein & Geodésicas'}
            </h3>
            <p className="concept-card-text">
              {isLaymanMode ? (
                <>
                  A matéria pesada <strong>afunda o tecido do espaço</strong>. Perto de estrelas ou buracos negros, caminhos de luz se curvam e <strong>o tempo passa mais devagar</strong>.
                </>
              ) : (
                <>
                  O tensor de energia-momento <em>T<sub>μν</sub></em> dita a curvatura do tensor de Ricci <em>R<sub>μν</sub></em>. A velocidade da luz <em>c</em> estabelece os <strong>cones causais de Minkowski</strong>.
                </>
              )}
            </p>
          </div>

          {/* Card 2: Supercordas */}
          <div className="concept-card">
            <div className="concept-card-top">
              <span className="concept-card-pill pill-violet">
                {isLaymanMode ? 'CORDA FUNDAMENTAL' : 'TEORIA DAS SUPERCORDAS'}
              </span>
              <span className="concept-card-year">11D / Teoria M</span>
            </div>
            <h3 className="concept-card-heading">
              {isLaymanMode ? 'Filamentos de Energia Vibrantes' : 'Variedades de Calabi-Yau'}
            </h3>
            <p className="concept-card-text">
              {isLaymanMode ? (
                <>
                  No nível microscópico, as partículas são <strong>cordas de energia que vibram</strong> como notas musicais, originando elétrons, fótons e a gravidade em dimensões ocultas.
                </>
              ) : (
                <>
                  Filamentos unidimensionais na escala de Planck (~10⁻³⁵ m) compactificados em 6 dimensões extras geram o <em>String Landscape</em> de múltiplos vácuos.
                </>
              )}
            </p>
          </div>

          {/* Card 3: Multiverso Quântico */}
          <div className="concept-card">
            <div className="concept-card-top">
              <span className="concept-card-pill pill-emerald">
                {isLaymanMode ? 'RAMIFICAÇÕES' : 'MECÂNICA QUÂNTICA'}
              </span>
              <span className="concept-card-year">Many-Worlds</span>
            </div>
            <h3 className="concept-card-heading">
              {isLaymanMode ? 'O Multiverso de Probabilidades' : 'Decoerência & Bifurcações de Everett'}
            </h3>
            <p className="concept-card-text">
              {isLaymanMode ? (
                <>
                  Cada decisão ou interação no nível subatômico cria <strong>ramos paralelos da realidade</strong>, permitindo que diferentes futuros coexistam simultaneamente.
                </>
              ) : (
                <>
                  A perda de coerência de fase da função de onda |Ψ⟩ gera ramificações universais ortogonais sem colapso descontínuo, preservando a unitariedade quântica.
                </>
              )}
            </p>
          </div>

          {/* Card 4: Novikov & Autoconsistência */}
          <div className="concept-card">
            <div className="concept-card-top">
              <span className="concept-card-pill pill-amber">
                {isLaymanMode ? 'SEM CONTRADIÇÕES' : 'PRINCÍPIO DE NOVIKOV'}
              </span>
              <span className="concept-card-year">δS = 0</span>
            </div>
            <h3 className="concept-card-heading">
              {isLaymanMode ? 'A Lei Anti-Paradoxo Temporal' : 'Autoconsistência & Censura Cósmica'}
            </h3>
            <p className="concept-card-text">
              {isLaymanMode ? (
                <>
                  As leis da física são estritamente lógicas: intervenções no passado só admitem trajetórias onde <strong>nenhuma contradição anula a própria causa de origem</strong>.
                </>
              ) : (
                <>
                  Curvas tipo tempo fechadas (CTCs) são restringidas pelo princípio variacional de Feynman δS = 0. Soluções com paradoxos têm probabilidade estritamente nula (P = 0).
                </>
              )}
            </p>
          </div>
        </div>

        {/* Visual Causal Flow Banner */}
        <div className="concept-causal-flow-card">
          <div className="causal-flow-header">
            <span className="flow-badge">PROCESSO CAUSAL</span>
            <span className="flow-title">
              {isLaymanMode ? 'Da Causa ao Efeito Consistente' : 'Propagação de Geodésicas e Equilíbrio de Novikov'}
            </span>
          </div>

          <div className="causal-flow-track">
            <div className="flow-step step-origin">
              <span className="step-num">01</span>
              <span className="step-label">{isLaymanMode ? 'Origem Histórica' : 'Evento Âncora'}</span>
              <span className="step-sub">{isLaymanMode ? 'Presente Estável' : 'Referencial t₀'}</span>
            </div>
            <div className="flow-line">
              <span className="flow-line-pulse pulse-cyan" />
            </div>

            <div className="flow-step step-shift">
              <span className="step-num">02</span>
              <span className="step-label">{isLaymanMode ? 'Intervenção' : 'Perturbação Métrica'}</span>
              <span className="step-sub">{isLaymanMode ? 'Salto Temporal' : 'Linha de Mundo'}</span>
            </div>
            <div className="flow-line">
              <span className="flow-line-pulse pulse-violet" />
            </div>

            <div className="flow-step step-resolution">
              <span className="step-num">03</span>
              <span className="step-label">{isLaymanMode ? 'Reestabilização' : 'Resolução Novikov'}</span>
              <span className="step-sub">{isLaymanMode ? 'Realidade Coerente' : 'Bifurcação Global'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
