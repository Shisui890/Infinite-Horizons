import { useLaymanMode } from '../context/LaymanModeContext';
import HeroSection from './HeroSection';
import ConceptSection from './ConceptSection';
import FeaturesSection from './FeaturesSection';
import DemoSection from './DemoSection';

interface Props {
  onStartSimulator: () => void;
}

export default function LandingPage({ onStartSimulator }: Props) {
  const { isLaymanMode, toggleLaymanMode } = useLaymanMode();

  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Navegação principal">
        <a className="brand-lockup" href="#hero-section" aria-label="Infinite-Horizons início">
          <span className="brand-mark">IH</span>
          <span className="brand-name">INFINITE<span>-HORIZONS</span></span>
        </a>
        <div className="landing-nav-links">
          <button
            type="button"
            className={`btn-toggle-layman-nav ${isLaymanMode ? 'active-layman' : ''}`}
            onClick={toggleLaymanMode}
            title={isLaymanMode ? 'Clique para voltar ao Modo Acadêmico Rigoroso' : 'Clique para ativar o Modo Simplificado para Leigos com Analogias'}
          >
            {isLaymanMode ? 'Modo: Para Leigos (Ativo)' : 'Modo: Para Leigos'}
          </button>
          <a href="#concept-section">{isLaymanMode ? 'Como Funciona' : 'Fundamentação Teórica'}</a>
          <a href="#features-section">{isLaymanMode ? 'Recursos' : 'Capacidades'}</a>
          <a href="#demo-section">{isLaymanMode ? 'Demonstração' : 'Simulador Vivo'}</a>
          <button type="button" onClick={onStartSimulator}>
            {isLaymanMode ? 'Entrar no Simulador' : 'Laboratório Temporal'}
          </button>
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
