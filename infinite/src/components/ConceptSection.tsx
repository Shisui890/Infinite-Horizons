export default function ConceptSection() {
  return (
    <section id="concept-section" className="section concept-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">FUNDAMENTAÇÃO CIENTÍFICA</span>
          <h2 className="section-title">A Física do Espaço-Tempo e a Causalidade Multidimensional</h2>
          <p className="section-subtitle">
            O Infinite Horizons une relatividade geral, teoria das supercordas, mecânica quântica e termodinâmica
            em um motor de simulação rigoroso para investigar o que acontece quando alteramos as variáveis do cosmos.
          </p>
        </div>

        <div className="concept-grid">
          <div className="concept-card concept-card-main">
            <div className="concept-card-icon">SUPERCORDAS</div>
            <h3>Teoria das Supercordas & Teoria M</h3>
            <p>
              Partículas fundamentais são <strong>filamentos vibracionais unidimensionais</strong> na escala de Planck (~10⁻³⁵ m).
              As dimensões espaciais extras compactificadas em <strong>variedades de Calabi-Yau</strong> geram as leis e constantes de diferentes universos paralelos no String Landscape.
            </p>
            <div className="concept-card-glow" />
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">RELATIVIDADE</div>
            <h3>Relatividade Geral & Cones de Luz</h3>
            <p>
              A gravidade é a <strong>curvatura dinâmica do espaço-tempo</strong> quadridimensional. Nenhum efeito causal pode ultrapassar a velocidade da luz <em>c</em>, delimitando os cones de luz passado e futuro de cada evento.
            </p>
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">QUÂNTICA</div>
            <h3>Multiverso Quântico de Everett</h3>
            <p>
              A <strong>decoerência quântica</strong> bifurca a função de onda universal a cada evento de bifurcação, gerando ramificações dimensionais físicas reais onde todas as probabilidades alternativas coexistem.
            </p>
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">AUTOCONSISTÊNCIA</div>
            <h3>Autoconsistência de Novikov</h3>
            <p>
              A <strong>2ª Lei da Termodinâmica</strong> e o princípio de Novikov garantem que o continuum proíbe paradoxos que gerem probabilidade zero, forçando a reestabilização ou a cisão em novas dimensões.
            </p>
          </div>
        </div>

        {/* Visual causal chain demo */}
        <div className="concept-chain">
          <div className="concept-chain-title">Dinâmica Causal no Espaço-Tempo: Da Geodésica ao Paradoxo</div>
          <div className="concept-chain-flow">
            <div className="chain-node chain-node-stable">
              <span className="chain-node-label">Equações de Einstein (1915)</span>
              <span className="chain-node-status">ÂNCORA METROLÓGICA</span>
            </div>
            <div className="chain-arrow">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <line x1="0" y1="10" x2="32" y2="10" stroke="rgba(0,212,255,0.4)" strokeWidth="2" />
                <polygon points="32,5 40,10 32,15" fill="rgba(0,212,255,0.6)" />
              </svg>
              <span className="chain-arrow-label">GEODÉSICA CAUSAL</span>
            </div>
            <div className="chain-node chain-node-altered">
              <span className="chain-node-label">Pontes ER = EPR (1935)</span>
              <span className="chain-node-status">EMARANHAMENTO</span>
            </div>
            <div className="chain-arrow">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <line x1="0" y1="10" x2="32" y2="10" stroke="rgba(251,191,36,0.4)" strokeWidth="2" />
                <polygon points="32,5 40,10 32,15" fill="rgba(251,191,36,0.6)" />
              </svg>
              <span className="chain-arrow-label">TEORIA M (11D)</span>
            </div>
            <div className="chain-node chain-node-unstable">
              <span className="chain-node-label">Perturbação Causal</span>
              <span className="chain-node-status">FLUTUAÇÃO QUÂNTICA</span>
            </div>
            <div className="chain-arrow">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <line x1="0" y1="10" x2="32" y2="10" stroke="rgba(239,68,68,0.4)" strokeWidth="2" />
                <polygon points="32,5 40,10 32,15" fill="rgba(239,68,68,0.6)" />
              </svg>
              <span className="chain-arrow-label">CENSURA HAWKING</span>
            </div>
            <div className="chain-node chain-node-paradox">
              <span className="chain-node-label">Colapso de Novikov</span>
              <span className="chain-node-status">CURVA TEMPO FECHADA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
