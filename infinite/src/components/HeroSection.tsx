import { useEffect, useRef } from 'react';

interface Props {
  onStartSimulator: () => void;
}

export default function HeroSection({ onStartSimulator }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.classList.add('hero-visible');
  }, []);

  return (
    <section id="hero-section" className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          <span>INFINITE-HORIZONS / LABORATÓRIO DE FÍSICA TEÓRICA & CAUSALIDADE</span>
        </div>

        <h1 ref={titleRef} className="hero-title">
          <span className="hero-title-line">Modele o Espaço-Tempo.</span>
          <span className="hero-title-line hero-title-gradient">Simule as Ramificações do Multiverso.</span>
        </h1>

        <p className="hero-subtitle">
          Da Relatividade Geral de Einstein às Supercordas em 11 Dimensões.
        </p>

        <p className="hero-description">
          Investigue a curvatura geométrica do espaço-tempo, trace cones de luz de Minkowski,
          altere geodésicas históricas e observe o efeito borboleta colapsar ou bifurcar realidades sob
          as leis fundamentais da física quântica, termodinâmica e inferência de IA.
        </p>

        <div className="hero-actions">
          <button type="button" id="cta-start" className="btn-cta" onClick={onStartSimulator}>
            <span className="btn-cta-text">INICIAR LABORATÓRIO TEMPORAL</span>
            <span className="btn-cta-glow" />
          </button>
          <a href="#concept-section" id="cta-demo" className="btn-secondary">
            EXPLORAR AS TEORIAS FÍSICAS
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">11 DIMENSÕES</span>
            <span className="hero-stat-label">Teoria M & Calabi-Yau</span>
          </div>
          <div className="hero-stat-separator" />
          <div className="hero-stat">
            <span className="hero-stat-value">CONES DE LUZ</span>
            <span className="hero-stat-label">Relatividade & Causalidade</span>
          </div>
          <div className="hero-stat-separator" />
          <div className="hero-stat">
            <span className="hero-stat-value">NOVIKOV</span>
            <span className="hero-stat-label">Autoconsistência & Anti-Paradoxo</span>
          </div>
          <div className="hero-stat-separator" />
          <div className="hero-stat">
            <span className="hero-stat-value">MULTIVERSO</span>
            <span className="hero-stat-label">Paisagem de Supercordas</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-label">EXPLORAR GEOMETRIA CAUSAL</span>
      </div>
    </section>
  );
}
