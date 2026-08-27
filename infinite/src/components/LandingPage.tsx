import HeroSection from './HeroSection';
import ConceptSection from './ConceptSection';
import FeaturesSection from './FeaturesSection';
import DemoSection from './DemoSection';

interface Props {
  onStartSimulator: () => void;
}

export default function LandingPage({ onStartSimulator }: Props) {
  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Navegação principal">
        <a className="brand-lockup" href="#hero-section" aria-label="Infinite-Horizons início">
          <span className="brand-mark">IH</span>
          <span className="brand-name">INFINITE<span>-HORIZONS</span></span>
        </a>
        <div className="landing-nav-links">
          <a href="#concept-section">Fundamentação Teórica</a>
          <a href="#features-section">Capacidades</a>
          <a href="#demo-section">Simulador Vivo</a>
          <button type="button" onClick={onStartSimulator}>Laboratório Temporal <span>↗</span></button>
        </div>
      </nav>
      <HeroSection onStartSimulator={onStartSimulator} />
      <ConceptSection />
      <FeaturesSection />
      <DemoSection onStartSimulator={onStartSimulator} />

      {/* Footer */}
      <footer id="footer" className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">IH</span>
            <span className="footer-title">INFINITE-HORIZONS</span>
          </div>
          <p className="footer-tagline">
            Investigação de Causalidade, Relatividade Geral, Supercordas e Multiverso Quântico.
          </p>
          <div className="footer-divider" />
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Infinite-Horizons — Laboratório de Física Teórica e Simulação Causal
          </p>
        </div>
      </footer>
    </main>
  );
}
