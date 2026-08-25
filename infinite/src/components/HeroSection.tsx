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
          <span>INFINITE-HORIZONS / LABORATÓRIO ONLINE</span>
        </div>

        <h1 ref={titleRef} className="hero-title">
          <span className="hero-title-line">Modele o impossível.</span>
          <span className="hero-title-line hero-title-gradient">Observe o que muda.</span>
        </h1>

        <p className="hero-subtitle">
          Toda decisão deixa uma marca no tempo.
        </p>

        <p className="hero-description">
          Modele um acontecimento, altere uma causa e acompanhe o impacto atravessar
          décadas, pessoas e dimensões. Com dados históricos ou hipóteses próprias.
        </p>

        <div className="hero-actions">
          <button type="button" id="cta-start" className="btn-cta" onClick={onStartSimulator}>
            <span className="btn-cta-text">ABRIR LABORATÓRIO</span>
            <span className="btn-cta-glow" />
          </button>
          <a href="#demo-section" id="cta-demo" className="btn-secondary">
            VER COMO FUNCIONA
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">∞</span>
            <span className="hero-stat-label">Dimensões</span>
          </div>
          <div className="hero-stat-separator" />
          <div className="hero-stat">
            <span className="hero-stat-value">FLUXO</span>
            <span className="hero-stat-label">Propagação Causal</span>
          </div>
          <div className="hero-stat-separator" />
          <div className="hero-stat">
            <span className="hero-stat-value">RISCO</span>
            <span className="hero-stat-label">Detecção de Paradoxos</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-label">EXPLORAR</span>
      </div>
    </section>
  );
}
