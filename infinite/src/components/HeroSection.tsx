import { useEffect, useRef } from 'react';
import { useLaymanMode } from '../context/LaymanModeContext';

interface Props {
  onStartSimulator: () => void;
  onOpenGuide: () => void;
}

export default function HeroSection({ onStartSimulator, onOpenGuide }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.classList.add('hero-visible');
  }, []);

  return (
    <section id="hero-section" className="hero-section">
      {/* Background Subtle Horizon Aura */}
      <div className="hero-glow-aura" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-pulse" />
          <span className="hero-badge-text">
            {isLaymanMode
              ? 'FÍSICA DESCOMPLICADA • ESPAÇO, TEMPO & COSMOS'
              : 'LABORATÓRIO DE FÍSICA TEÓRICA & CAUSALIDADE'}
          </span>
        </div>

        <h1 ref={titleRef} className="hero-title">
          {isLaymanMode ? (
            <>
              Como o Tempo e o Espaço <br />
              <span className="hero-title-gradient">Realmente Funcionam</span>
            </>
          ) : (
            <>
              Modele o Espaço-Tempo. <br />
              <span className="hero-title-gradient">Simule a Causalidade Universal.</span>
            </>
          )}
        </h1>

        <p className="hero-description">
          {isLaymanMode
            ? 'Descubra por que o tempo é elástico, como a gravidade deforma a estrutura do cosmos e o que a ciência moderna revela sobre buracos negros e realidades paralelas.'
            : 'Investigue a curvatura métrica de Einstein, trace geodésicas nos cones de luz de Minkowski e observe perturbações causais sob as leis da relatividade e supercordas.'}
        </p>

        <div className="hero-actions">
          <button type="button" id="cta-start" className="btn-cta" onClick={onStartSimulator}>
            <span>{isLaymanMode ? 'Explorar o Espaço-Tempo' : 'Iniciar Laboratório'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button type="button" className="btn-secondary" onClick={onOpenGuide}>
            <span>Como Funciona o Site</span>
          </button>
        </div>

        {/* Minimalist Telemetry Dashboard */}
        <div className="hero-telemetry-bar">
          <div className="telemetry-item">
            <span className="telemetry-val">{isLaymanMode ? '300.000 km/s' : 'c = 2.997×10⁸ m/s'}</span>
            <span className="telemetry-lbl">{isLaymanMode ? 'Velocidade Limite da Luz' : 'Constante Universal Relativística'}</span>
          </div>
          <div className="telemetry-separator" />
          <div className="telemetry-item">
            <span className="telemetry-val">{isLaymanMode ? 'Tempo Elástico' : 'Cones de Minkowski'}</span>
            <span className="telemetry-lbl">{isLaymanMode ? 'Dilatação por Velocidade e Gravidade' : 'Invariância do Intervalo Δs²'}</span>
          </div>
          <div className="telemetry-separator" />
          <div className="telemetry-item">
            <span className="telemetry-val">{isLaymanMode ? 'Espaço Curvo' : '11 Dimensões'}</span>
            <span className="telemetry-lbl">{isLaymanMode ? 'Matéria Deforma o Tecido Cósmico' : 'Variedades de Calabi-Yau & Teoria M'}</span>
          </div>
          <div className="telemetry-separator" />
          <div className="telemetry-item">
            <span className="telemetry-val">{isLaymanMode ? 'Sem Paradoxos' : 'Autoconsistência'}</span>
            <span className="telemetry-lbl">{isLaymanMode ? 'A Física Impede Contradições' : 'Princípio de Novikov & Feynman δS=0'}</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <a href="#concept-section" className="scroll-indicator-link" aria-label="Rolar para a próxima seção">
          <span className="scroll-indicator-mouse">
            <span className="scroll-indicator-wheel" />
          </span>
          <span className="scroll-indicator-text">{isLaymanMode ? 'Explorar' : 'Fundamentação'}</span>
        </a>
      </div>
    </section>
  );
}
