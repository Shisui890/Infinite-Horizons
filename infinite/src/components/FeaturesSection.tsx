const features = [
  {
    icon: '🌀',
    title: 'Grafo Temporal',
    description: 'Visualize universos como grafos direcionados com eventos conectados por relações causais complexas.',
    color: 'var(--color-stable)',
  },
  {
    icon: '⚡',
    title: 'Propagação Causal',
    description: 'Altere um evento e observe a propagação automática de consequências através de toda a cadeia temporal.',
    color: 'var(--color-stable)',
  },
  {
    icon: '🔴',
    title: 'Detecção de Paradoxos',
    description: 'Identifica automaticamente Paradoxo do Avô, Bootstrap, Predestinação, loops causais e contradições.',
    color: 'var(--color-paradox)',
  },
  {
    icon: '🌌',
    title: 'Múltiplas Dimensões',
    description: 'Crie dimensões paralelas com suas próprias linhas temporais. Viajantes podem cruzar entre realidades.',
    color: 'var(--color-dimensional)',
  },
  {
    icon: '🕐',
    title: 'Viagens Temporais',
    description: 'Envie viajantes ao passado ou futuro. Cada viagem pode alterar a cadeia causal e gerar consequências.',
    color: 'var(--color-warning)',
  },
  {
    icon: '📊',
    title: 'Integridade Temporal',
    description: 'Monitore a estabilidade do universo em tempo real. Alterações reduzem a integridade podendo causar colapso.',
    color: 'var(--color-stable)',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features-section" className="section features-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">RECURSOS</span>
          <h2 className="section-title">Ferramentas do Simulador</h2>
          <p className="section-subtitle">
            Um conjunto poderoso de mecanismos para criar, simular e analisar realidades temporais.
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
