import { useEffect, useRef } from 'react';
import { useLaymanMode } from '../context/LaymanModeContext';

interface Props {
  onStartSimulator: () => void;
}

export default function HeroSection({ onStartSimulator }: Props) {
  const { isLaymanMode } = useLaymanMode();
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
          <span>
            {isLaymanMode
              ? 'GUIA DESCOMPLICADO: ENTENDA COMO FUNCIONA O UNIVERSO'
              : 'INFINITE-HORIZONS / LABORATÓRIO DE FÍSICA TEÓRICA & CAUSALIDADE'}
          </span>
        </div>

        <h1 ref={titleRef} className="hero-title">
          {isLaymanMode ? (
            <>
              <span className="hero-title-line">Como o Tempo e o Espaço Funcionam.</span>
              <span className="hero-title-line hero-title-gradient">Entenda a Física do Cosmos de Forma Simples.</span>
            </>
          ) : (
            <>
              <span className="hero-title-line">Modele o Espaço-Tempo.</span>
              <span className="hero-title-line hero-title-gradient">Simule as Ramificações do Multiverso.</span>
            </>
          )}
        </h1>

        <p className="hero-subtitle">
          {isLaymanMode
            ? 'Descubra por que o tempo desacelera perto de um buraco negro, como a gravidade deforma o espaço e o que a ciência diz sobre o multiverso.'
            : 'Da Relatividade Geral de Einstein às Supercordas em 11 Dimensões.'}
        </p>

        <p className="hero-description">
          {isLaymanMode
            ? 'A física moderna provou que o nosso universo é elástico: o tempo não corre igual para todos, o espaço se dobra na presença de matéria pesada e a luz viaja com velocidade máxima fixa. Aqui você explora essas teorias através de analogias fáceis e visualizações diretas de causa e efeito.'
            : 'Investigue a curvatura geométrica do espaço-tempo, trace cones de luz de Minkowski, altere geodésicas históricas e observe o efeito borboleta colapsar ou bifurcar realidades sob as leis fundamentais da física quântica e termodinâmica.'}
        </p>

        <div className="hero-actions">
          <button type="button" id="cta-start" className="btn-cta" onClick={onStartSimulator}>
            <span className="btn-cta-text">{isLaymanMode ? 'EXPLORAR O ESPAÇO-TEMPO' : 'INICIAR LABORATÓRIO TEMPORAL'}</span>
            <span className="btn-cta-glow" />
          </button>
          <a href="#concept-section" id="cta-demo" className="btn-secondary">
            {isLaymanMode ? 'VER COMO FUNCIONA A FÍSICA' : 'EXPLORAR AS TEORIAS FÍSICAS'}
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{isLaymanMode ? 'VELOCIDADE DA LUZ' : '11 DIMENSÕES'}</span>
            <span className="hero-stat-label">{isLaymanMode ? 'O limite máximo de velocidade no vácuo' : 'Teoria M & Calabi-Yau'}</span>
          </div>
          <div className="hero-stat-separator" />
          <div className="hero-stat">
            <span className="hero-stat-value">{isLaymanMode ? 'TEMPO ELÁSTICO' : 'CONES DE LUZ'}</span>
            <span className="hero-stat-label">{isLaymanMode ? 'O tempo desacelera para quem viaja rápido' : 'Relatividade & Causalidade'}</span>
          </div>
          <div className="hero-stat-separator" />
          <div className="hero-stat">
            <span className="hero-stat-value">{isLaymanMode ? 'ESPAÇO CURVADO' : 'NOVIKOV'}</span>
            <span className="hero-stat-label">{isLaymanMode ? 'A gravidade é o tecido do espaço afundando' : 'Autoconsistência & Anti-Paradoxo'}</span>
          </div>
          <div className="hero-stat-separator" />
          <div className="hero-stat">
            <span className="hero-stat-value">{isLaymanMode ? 'MULTIVERSO' : 'MULTIVERSO'}</span>
            <span className="hero-stat-label">{isLaymanMode ? 'A física das infinitas probabilidades' : 'Paisagem de Supercordas'}</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-label">{isLaymanMode ? 'ROLE PARA ENTENDER MAIS' : 'EXPLORAR GEOMETRIA CAUSAL'}</span>
      </div>
    </section>
  );
}
