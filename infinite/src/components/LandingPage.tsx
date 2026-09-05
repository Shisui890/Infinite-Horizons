import { useState } from 'react';
import { useLaymanMode } from '../context/LaymanModeContext';
import HeroSection from './HeroSection';
import ConceptSection from './ConceptSection';
import FeaturesSection from './FeaturesSection';
import DemoSection from './DemoSection';

interface Props {
  onStartSimulator: () => void;
  onOpenGuide: () => void;
  onOpenOurUniverse?: () => void;
}

export default function LandingPage({ onStartSimulator, onOpenGuide, onOpenOurUniverse }: Props) {
  const { isLaymanMode, toggleLaymanMode } = useLaymanMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            {onOpenOurUniverse && (
              <button
                type="button"
                className="nav-link nav-link-special"
                onClick={onOpenOurUniverse}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 150, 0, 0.08)',
                  border: '1px solid rgba(255, 150, 0, 0.35)',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  color: '#ffaa00',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
                <span>Exploração Cósmica</span>
              </button>
            )}
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

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              className="landing-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu Modal */}
      {isMobileMenuOpen && (
        <div className="landing-mobile-drawer" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="landing-mobile-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <span className="brand-dot" />
                <span className="brand-txt">INFINITE<strong>HORIZONS</strong></span>
              </div>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fechar menu móvel"
              >
                ✕
              </button>
            </div>

            <div className="mobile-drawer-links">
              <button
                type="button"
                className="mobile-drawer-link"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenGuide();
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{isLaymanMode ? 'Como Funciona (Manual do Lab)' : 'Manual de Operações do Lab'}</span>
              </button>

              {onOpenOurUniverse && (
                <button
                  type="button"
                  className="mobile-drawer-link highlight"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenOurUniverse();
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                  <span>Exploração Cósmica // Nosso Universo</span>
                </button>
              )}

              <a
                href="#concept-section"
                className="mobile-drawer-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>{isLaymanMode ? 'Conceitos Fundamentais' : 'Física Teórica & Métrica'}</span>
              </a>

              <a
                href="#features-section"
                className="mobile-drawer-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{isLaymanMode ? 'Recursos Principais' : 'Capacidades do Simulador'}</span>
              </a>

              <a
                href="#demo-section"
                className="mobile-drawer-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{isLaymanMode ? 'Demonstração Interativa' : 'Simulador Lorentziano'}</span>
              </a>
            </div>

            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="btn-drawer-sim"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onStartSimulator();
                }}
              >
                <span>{isLaymanMode ? 'Entrar no Simulador Agora' : 'Inicializar Laboratório'}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

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
