import { useLaymanMode } from '../context/LaymanModeContext';
import { MathText } from './MathFormula';

export default function FeaturesSection() {
  const { isLaymanMode } = useLaymanMode();

  const features = [
    {
      category: isLaymanMode ? 'CAUSALIDADE' : 'TOPOLOGIA',
      title: isLaymanMode ? 'Como a Causa Gera o Efeito' : 'Grafo Causal & Cones de Luz',
      description: isLaymanMode
        ? 'Nenhuma influência viaja mais rápido que a luz no vácuo, garantindo que o passado molde o futuro de forma contínua.'
        : 'Mapeie o espaço-tempo em um grafo causal acíclico (DAG) que preserva os limites de velocidade relativística $c$.',
      accent: 'var(--color-cyan)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
    },
    {
      category: isLaymanMode ? 'ESPAÇO CURVO' : 'RELATIVIDADE',
      title: isLaymanMode ? 'A Gravidade Dobra o Espaço' : 'Propagação Relativística de Ondas',
      description: isLaymanMode
        ? 'A massa de estrelas e buracos negros curva os caminhos no cosmos, alterando o fluxo temporal ao redor.'
        : 'Perturbações gravitacionais propagam-se na velocidade $c$, deformando a métrica espacial em tempo real.',
      accent: 'var(--color-cyan)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        </svg>
      ),
    },
    {
      category: isLaymanMode ? 'ANTI-PARADOXO' : 'AUTOCONSISTÊNCIA',
      title: isLaymanMode ? 'Por Que o Tempo Veda Contradições' : 'Censura Cósmica & Paradoxos',
      description: isLaymanMode
        ? 'Mesmo com viagens no tempo teóricas, a física não permite eventos que apaguem a sua própria causa de origem.'
        : 'Detecção em tempo real de Curvas Tipo Tempo Fechadas (CTCs) e imposição estrita do Princípio de Novikov.',
      accent: 'var(--color-coral)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      category: isLaymanMode ? 'MULTIVERSO' : 'TEORIA M',
      title: isLaymanMode ? 'Universos Paralelos Coexistindo' : 'Variedades 11D de Calabi-Yau',
      description: isLaymanMode
        ? 'A teoria das supercordas prevê outras dimensões microscópicas onde novas leis da física podem florescer.'
        : 'Ramificação de realidades em dimensões paralelas sob o panorama de vácuos quânticos das supercordas.',
      accent: 'var(--color-violet)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      category: isLaymanMode ? 'CAOS & BORBOLETA' : 'NÃO LINEARIDADE',
      title: isLaymanMode ? 'Pequenas Mudanças, Grandes Efeitos' : 'Expoente de Lyapunov & Dinâmica',
      description: isLaymanMode
        ? 'Uma alteração minúscula no passado pode amplificar-se em transformações colossais no futuro distante.'
        : 'Cálculo analítico do horizonte de previsibilidade $\\Delta t \\sim \\frac{1}{\\lambda}\\ln(\\frac{\\Delta_{\\max}}{\\delta_0})$ em sistemas dinâmicos.',
      accent: 'var(--color-amber)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      category: isLaymanMode ? 'ENTROPIA' : 'TERMODINÂMICA',
      title: isLaymanMode ? 'A Flecha Irreversível do Tempo' : 'Entropia de Bekenstein & Shannon',
      description: isLaymanMode
        ? 'A física exige que a desordem total aumente com o tempo, definindo por que lembramos do passado e não do futuro.'
        : 'Monitoramento contínuo da Segunda Lei da Termodinâmica ($\\Delta S \\ge 0$) e estabilidade do vácuo quântico.',
      accent: 'var(--color-emerald)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features-section" className="section features-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">
            {isLaymanMode ? 'RECURSOS PRINCIPAIS' : 'CAPACIDADES EXPERIMENTAIS'}
          </span>
          <h2 className="section-title">
            {isLaymanMode
              ? 'Os Grandes Pilares da Física em Simulação'
              : 'Instrumentos de Investigação do Espaço-Tempo'}
          </h2>
          <p className="section-subtitle">
            {isLaymanMode
              ? 'Entenda visualmente cada fenômeno cósmico através de módulos interativos limpos e intuitivos.'
              : 'Arquitetura computacional orientada a tensores e grafos para experimentação de cenários cosmológicos.'}
          </p>
        </div>

        <div className="features-grid">
          {features.map(feat => (
            <div key={feat.title} className="feature-card" style={{ '--accent-color': feat.accent } as React.CSSProperties}>
              <div className="feature-card-icon-wrapper">
                <span className="feature-icon">{feat.icon}</span>
                <span className="feature-category">{feat.category}</span>
              </div>
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">
                <MathText text={feat.description} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
