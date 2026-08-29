import { useLaymanMode } from '../context/LaymanModeContext';

export default function FeaturesSection() {
  const { isLaymanMode } = useLaymanMode();

  const features = [
    {
      icon: isLaymanMode ? 'CAUSALIDADE' : 'TOPOLOGIA',
      title: isLaymanMode ? 'Como uma Causa Gera um Efeito' : 'Topologia de Geodésicas & Cones de Luz',
      description: isLaymanMode
        ? 'No universo, nada acontece instantaneamente: qualquer influência precisa viajar pelo espaço sem nunca ultrapassar a velocidade máxima da luz.'
        : 'Mapeie o espaço-tempo em um grafo causal relativístico (DAG) que respeita rigorosamente a velocidade limite da luz c e as linhas de universo.',
      color: 'var(--color-stable)',
    },
    {
      icon: isLaymanMode ? 'ESPAÇO CURVO' : 'PROPAGAÇÃO',
      title: isLaymanMode ? 'A Gravidade Dobra o Espaço' : 'Propagação Relativística de Causalidade',
      description: isLaymanMode
        ? 'Estrelas e planetas afundam a estrutura do espaço ao seu redor, fazendo com que a luz e os corpos celestes sigam caminhos curvados.'
        : 'Altere uma condição inicial e observe as perturbações de curvatura se propagarem pelo cone de luz futuro em tempo real.',
      color: 'var(--color-stable)',
    },
    {
      icon: isLaymanMode ? 'LEI ANTI-PARADOXO' : 'PARADOXOS',
      title: isLaymanMode ? 'Por Que o Tempo Impede Contradições' : 'Detecção de Paradoxos & Censura de Hawking',
      description: isLaymanMode
        ? 'Se você pudesse voltar ao passado e mudar algo, a física não permite que você apague a sua própria existência: a história sempre se reestabiliza.'
        : 'Identifique curvas tipo tempo fechadas (CTCs), paradoxos do avô e violações do princípio de autoconsistência de Igor Novikov.',
      color: 'var(--color-paradox)',
    },
    {
      icon: isLaymanMode ? 'MULTIVERSO' : 'MULTIVERSO',
      title: isLaymanMode ? 'Infinitas Possibilidades Coexistindo' : 'Variedades de Calabi-Yau & Multiverso',
      description: isLaymanMode
        ? 'A teoria das supercordas prevê que podem existir outras dimensões ocultas onde as leis da física e as constantes da natureza são diferentes.'
        : 'Bifurque realidades em dimensões paralelas alternativas sob a paisagem de vácuos da Teoria M e das Supercordas.',
      color: 'var(--color-dimensional)',
    },
    {
      icon: isLaymanMode ? 'BURACOS NEGROS' : 'SINGULARIDADE',
      title: isLaymanMode ? 'Onde o Próprio Tempo Congela' : 'Efeito Borboleta & Dinâmica Não Linear',
      description: isLaymanMode
        ? 'A gravidade de um buraco negro é tão esmagadora que nada consegue escapar, e para quem olha de fora, o tempo na borda parece parar por completo.'
        : 'Investigue o horizonte de eventos e a divergência caótica de trajetórias no espaço de fase.',
      color: 'var(--color-warning)',
    },
    {
      icon: isLaymanMode ? 'FLECHA DO TEMPO' : 'INTEGRIDADE',
      title: isLaymanMode ? 'Por Que o Tempo Só Corre Para Frente' : 'Monitor de Estabilidade & Integridade',
      description: isLaymanMode
        ? 'A lei da entropia mostra que o universo sempre caminha da organização para a desordem, o que cria a direção irreversível do passado para o futuro.'
        : 'Acompanhe a integridade temporal métrica e a taxa de entropia termodinâmica para manter a estabilidade do continuum universal.',
      color: 'var(--color-stable)',
    },
  ];

  return (
    <section id="features-section" className="section features-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">
            {isLaymanMode ? 'CONCEITOS FUNDAMENTAIS' : 'CAPACIDADES EXPERIMENTAIS'}
          </span>
          <h2 className="section-title">
            {isLaymanMode
              ? 'Os Grandes Pilares da Física Moderna Explicados'
              : 'Instrumentos de Precisão para Investigação do Espaço-Tempo'}
          </h2>
          <p className="section-subtitle">
            {isLaymanMode
              ? 'Uma visão clara sobre os princípios que regem desde a queda de uma maçã até a expansão das galáxias mais distantes.'
              : 'Do primeiro instante da singularidade à última consequência termodinâmica, cada ferramenta foi projetada para testes rigorosos de hipóteses.'}
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
