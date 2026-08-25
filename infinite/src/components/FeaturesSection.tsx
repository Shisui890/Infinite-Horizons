const features = [
  {
    icon: 'GRAFO',
    title: 'Grafo Temporal',
    description: 'Mapeie eventos, relações e dependências em uma linha temporal que você pode explorar.',
    color: 'var(--color-stable)',
  },
  {
    icon: 'FLUXO',
    title: 'Propagação Causal',
    description: 'Mude uma causa e acompanhe o impacto se propagar pela cadeia, sem perder o contexto.',
    color: 'var(--color-stable)',
  },
  {
    icon: 'RISCO',
    title: 'Detecção de Paradoxos',
    description: 'Encontre loops, contradições e pontos frágeis antes que a linha temporal entre em colapso.',
    color: 'var(--color-paradox)',
  },
  {
    icon: 'EIXOS',
    title: 'Modelos Alternativos',
    description: 'Crie versões do modelo com premissas diferentes e compare como cada decisão altera os resultados.',
    color: 'var(--color-dimensional)',
  },
  {
    icon: 'TEMPO',
    title: 'Intervenções Causais',
    description: 'Altere uma premissa em um ponto da história e registre como o efeito borboleta percorre o modelo.',
    color: 'var(--color-warning)',
  },
  {
    icon: 'DADOS',
    title: 'Integridade Temporal',
    description: 'Leia a integridade temporal em tempo real e saiba quando uma intervenção exige cautela.',
    color: 'var(--color-stable)',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features-section" className="section features-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">RECURSOS</span>
          <h2 className="section-title">Tudo o que você precisa para testar uma realidade</h2>
          <p className="section-subtitle">
            Do primeiro evento à última consequência, cada ferramenta foi pensada para investigação.
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
