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
      <HeroSection onStartSimulator={onStartSimulator} />
      <ConceptSection />
      <FeaturesSection />
      <DemoSection onStartSimulator={onStartSimulator} />

      {/* Footer */}
      <footer id="footer" className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">◈</span>
            <span className="footer-title">PAINEL DO PARADOXO TEMPORAL</span>
          </div>
          <p className="footer-tagline">
            Observe o passado. Altere a realidade. Enfrente as consequências.
          </p>
          <div className="footer-divider" />
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Infinite Horizons — Simulador Temporal
          </p>
        </div>
      </footer>
    </main>
  );
}
