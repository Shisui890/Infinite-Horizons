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
          <a href="#concept-section">O laboratório</a>
          <a href="#features-section">Capacidades</a>
          <button type="button" onClick={onStartSimulator}>Abrir simulador <span>↗</span></button>
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
            Investigue causas. Teste hipóteses. Entenda as consequências.
          </p>
          <div className="footer-divider" />
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Infinite-Horizons — Laboratório Temporal
          </p>
        </div>
      </footer>
    </main>
  );
}
