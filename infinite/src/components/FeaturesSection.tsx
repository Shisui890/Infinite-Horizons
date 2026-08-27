const features = [
  {
    icon: 'TOPOLOGIA',
    title: 'Topologia de Geodésicas & Cones de Luz',
    description: 'Mapeie o espaço-tempo em um grafo causal relativístico (DAG) que respeita rigorosamente a velocidade limite da luz c e as linhas de universo.',
    color: 'var(--color-stable)',
  },
  {
    icon: 'PROPAGAÇÃO',
    title: 'Propagação Relativística de Causalidade',
    description: 'Altere uma condição inicial e observe as perturbações de curvatura se propagarem pelo cone de luz futuro em tempo real.',
    color: 'var(--color-stable)',
  },
  {
    icon: 'PARADOXOS',
    title: 'Detecção de Paradoxos & Censura de Hawking',
    description: 'Identifique curvas tipo tempo fechadas (CTCs), paradoxos do avô e violações do princípio de autoconsistência de Igor Novikov.',
    color: 'var(--color-paradox)',
  },
  {
    icon: 'MULTIVERSO',
    title: 'Variedades de Calabi-Yau & Multiverso',
    description: 'Bifurque realidades em dimensões paralelas alternativas (Ω-01, Ω-02, Ω-03) sob a paisagem de vácuos da Teoria M e das Supercordas.',
    color: 'var(--color-dimensional)',
  },
  {
    icon: 'ORÁCULO',
    title: 'Efeito Borboleta & Oráculo de IA',
    description: 'Integre o OpenRouter (Claude, Gemini, DeepSeek, GPT-4o) para gerar consequências não lineares e anomalias quânticas derivadas.',
    color: 'var(--color-warning)',
  },
  {
    icon: 'INTEGRIDADE',
    title: 'Monitor de Estabilidade & Integridade',
    description: 'Acompanhe a integridade temporal métrica e a taxa de entropia termodinâmica para manter a estabilidade do continuum universal.',
    color: 'var(--color-stable)',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features-section" className="section features-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">CAPACIDADES EXPERIMENTAIS</span>
          <h2 className="section-title">Instrumentos de Precisão para Investigação do Espaço-Tempo</h2>
          <p className="section-subtitle">
            Do primeiro instante da singularidade à última consequência termodinâmica, cada ferramenta foi projetada para testes rigorosos de hipóteses.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feat) => (
            <div key={feat.title} className="feature-card" style={{ '--feature-color': feat.color } as React.CSSProperties}>
              <div className="feature-card-icon">{feat.icon}</div>
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.description}</p>
              <div className="feature-card-line" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
