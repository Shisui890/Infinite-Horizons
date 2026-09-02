import { useLaymanMode } from '../context/LaymanModeContext';
import HeroSection from './HeroSection';
import ConceptSection from './ConceptSection';
import FeaturesSection from './FeaturesSection';
import DemoSection from './DemoSection';

interface Props {
  onStartSimulator: () => void;
  onOpenGuide: () => void;
}

export default function LandingPage({ onStartSimulator, onOpenGuide }: Props) {
  const { isLaymanMode, toggleLaymanMode } = useLaymanMode();

  return (
    <main className="landing-page">
      {/* Floating Capsule Header */}
      <header className="landing-nav-wrapper">
        <nav className="landing-nav" aria-label="Navegação principal">
          <a className="brand-lockup" href="#hero-section" aria-label="Infinite-Horizons início">
            <span className="brand-mark brand-mark-emblem">
              <img src="/logo-emblem.png" alt="Infinite Horizons Logo" className="brand-logo-emblem-img" />
            </span>
            <span className="brand-name">
              INFINITE<span className="brand-accent">HORIZONS</span>
            </span>
          </a>

          <div className="landing-nav-links">
            <button
              type="button"
              className="nav-link"
              onClick={onOpenGuide}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {isLaymanMode ? 'Como Funciona' : 'Manual do Lab'}
            </button>
            <a href="#concept-section" className="nav-link">
              {isLaymanMode ? 'Conceitos' : 'Física Teórica'}
            </a>
            <a href="#features-section" className="nav-link">
              {isLaymanMode ? 'Recursos' : 'Capacidades'}
            </a>
            <a href="#demo-section" className="nav-link">
              {isLaymanMode ? 'Demonstração' : 'Simulador'}
            </a>
          </div>

          <div className="landing-nav-actions">
            <button
              type="button"
              className={`btn-mode-toggle ${isLaymanMode ? 'mode-layman' : 'mode-academic'}`}
              onClick={toggleLaymanMode}
              title={isLaymanMode ? 'Alternar para Modo Rigoroso (Matemático)' : 'Alternar para Modo Didático (Acessível)'}
            >
              <span className="mode-toggle-dot" />
              <span className="mode-toggle-label">{isLaymanMode ? 'Modo Didático' : 'Modo Rigoroso'}</span>
            </button>

            <button type="button" className="btn-nav-primary" onClick={onStartSimulator}>
              <span>{isLaymanMode ? 'Abrir Simulador' : 'Laboratório'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <HeroSection onStartSimulator={onStartSimulator} onOpenGuide={onOpenGuide} />
      <ConceptSection />
      <FeaturesSection />
      <DemoSection onStartSimulator={onStartSimulator} />

      {/* Footer */}
      <footer id="footer" className="footer">
        <div className="footer-content">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="brand-mark footer-mark brand-mark-emblem">
                <img src="/logo-emblem.png" alt="Infinite Horizons Logo" className="brand-logo-emblem-img" />
              </span>
              <span className="footer-title">INFINITE-HORIZONS</span>
            </div>
            <p className="footer-tagline">
              Plataforma de Simulação de Causalidade, Relatividade Geral, Supercordas e Cosmologia Quântica.
            </p>
          </div>
          <div className="footer-divider" />
          <div className="footer-bottom">
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} Infinite Horizons. Rigor Científico, Causalidade Relativística e Exploração Dimensional.
            </p>
            <div className="footer-links">
              <a href="#concept-section">Fundamentação</a>
              <a href="#features-section">Recursos</a>
              <a href="#demo-section">Experimento</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
