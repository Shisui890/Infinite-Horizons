import { useState, useEffect, useCallback } from 'react';
import type { Universe, TemporalEvent } from '../../types/temporal';
import MathFormula from '../MathFormula';
import { exportToLaTeX, exportToBibTeX } from '../../utils/exportAcademic';

interface Props {
  universe: Universe;
  onClose: () => void;
}

const FORMULAS_BY_YEAR: Record<number, { latex: string; label: string }> = {
  1915: {
    latex: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
    label: 'Equações de Campo da Relatividade Geral',
  },
  1935: {
    latex: 'ds^2 = -\\left(1 - \\frac{2m}{r}\\right) dt^2 + \\left(1 - \\frac{2m}{r}\\right)^{-1} dr^2 + r^2 d\\Omega^2',
    label: 'Métrica da Ponte de Einstein-Rosen',
  },
  1965: {
    latex: 'T_{\\text{CMB}} = 2.7255 \\pm 0.0006\\,\\text{K} \\quad (\\text{Espectro de Planck de Corpo Negro})',
    label: 'Radiação Residual da Recombinação Cósmica',
  },
  1984: {
    latex: 'S = -\\frac{1}{4\\pi\\alpha\'} \\int d^2\\sigma \\sqrt{-\\gamma} \\gamma^{ab} \\partial_a X^\\mu \\partial_b X^\\nu \\eta_{\\mu\\nu}',
    label: 'Ação de Polyakov para Supercordas em 10D',
  },
  1995: {
    latex: 'S_{\\text{11D}} = \\frac{1}{2\\kappa_{11}^2} \\int d^{11}x \\sqrt{-g} \\left( R - \\frac{1}{2} |F_4|^2 \\right) - \\frac{1}{6} C_3 \\wedge F_4 \\wedge F_4',
    label: 'Ação de Supergravidade em 11 Dimensões (Teoria M)',
  },
  1997: {
    latex: '\\mathcal{Z}_{\\text{AdS}}[\\phi_0] = \\left\\langle \\exp\\left( \\int_{\\partial \\text{AdS}} \\phi_0 \\mathcal{O} \\right) \\right\\rangle_{\\text{CFT}}',
    label: 'Dualidade Holográfica AdS/CFT de Maldacena',
  },
  1998: {
    latex: 'H^2(z) = H_0^2 \\left[ \\Omega_m (1+z)^3 + \\Omega_r (1+z)^4 + \\Omega_k (1+z)^2 + \\Omega_\\Lambda \\right]',
    label: 'Equação de Friedmann com Constante Cosmológica \\Lambda',
  },
  2013: {
    latex: 'S_{\\text{entanglement}} = \\frac{\\text{Area}(\\gamma_A)}{4 G_N} \\quad \\Longleftrightarrow \\quad \\text{ER} = \\text{EPR}',
    label: 'Conjectura Holográfica de Susskind & Maldacena',
  },
  2015: {
    latex: 'h(t) = \\frac{4}{r} \\left(\\frac{G \\mathcal{M}_c}{c^2}\\right)^{5/3} \\left(\\frac{\\pi f_{\\text{GW}}}{c}\\right)^{2/3} \\cos(2\\pi f_{\\text{GW}} t)',
    label: 'Sinal de Onda Gravitacional da Coalescência Binária',
  },
  2019: {
    latex: 'r_{\\text{shadow}} = \\sqrt{27}\\,\\frac{GM}{c^2} \\approx 5.2\\, r_g \\quad (\\text{Sombra de Kerr})',
    label: 'Raio Crítico da Sombra do Horizonte de Eventos',
  },
};

export default function ConferenceModeModal({ universe, onClose }: Props) {
  const events = universe.dimensions.flatMap(d => d.events).sort((a, b) => a.year - b.year);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentEvent: TemporalEvent | undefined = events[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < events.length - 1 ? prev + 1 : 0));
  }, [events.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : events.length - 1));
  }, [events.length]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [isPlaying, handleNext]);

  function handleDownloadTeX() {
    const content = exportToLaTeX(universe);
    const blob = new Blob([content], { type: 'application/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infinite-horizons-artigo-${universe.id}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadBib() {
    const content = exportToBibTeX(universe);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referencias-bibtex-${universe.id}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!currentEvent) return null;

  const formulaInfo = FORMULAS_BY_YEAR[currentEvent.year];

  return (
    <div className="conference-modal-backdrop">
      <div className="conference-modal-container">
        {/* Top Header */}
        <div className="conference-header">
          <div className="conference-brand">
            <span className="conf-badge">MODO APRESENTAÇÃO ACADÊMICA</span>
            <h1 className="conf-title">{universe.name}</h1>
          </div>

          <div className="conference-header-controls">
            <button
              type="button"
              className={`conf-btn ${isPlaying ? 'conf-btn-active' : ''}`}
              onClick={() => setIsPlaying(prev => !prev)}
            >
              {isPlaying ? 'PAUSAR APRESENTAÇÃO' : 'AUTO-AVANÇO'}
            </button>
            <button type="button" className="conf-btn conf-btn-export" onClick={handleDownloadTeX} title="Baixar Artigo em LaTeX">
              Baixar Artigo (.tex)
            </button>
            <button type="button" className="conf-btn conf-btn-export" onClick={handleDownloadBib} title="Baixar Bibliografia BibTeX">
              BibTeX (.bib)
            </button>
            <button type="button" className="conf-btn-close" onClick={onClose} title="Sair da Apresentação (Esc)">
              ✕ Sair
            </button>
          </div>
        </div>

        {/* Main Slide Card */}
        <div className="conference-slide">
          <div className="conf-slide-top">
            <div className="conf-step-counter">
              SLIDE {currentIndex + 1} DE {events.length}
            </div>
            <div className="conf-year-pill">
              Ano {currentEvent.year}
            </div>
            <div className="conf-category-pill">
              {currentEvent.category}
            </div>
          </div>

          <h2 className="conf-event-title">{currentEvent.title}</h2>

          <p className="conf-event-description">{currentEvent.description}</p>

          {/* KaTeX Formula Box */}
          {formulaInfo && (
            <div className="conf-formula-card">
              <div className="conf-formula-header">
                <span className="conf-formula-tag">FORMULAÇÃO MATEMÁTICA</span>
                <span className="conf-formula-label">{formulaInfo.label}</span>
              </div>
              <div className="conf-formula-math">
                <MathFormula math={formulaInfo.latex} block />
              </div>
            </div>
          )}

          {/* Academic Source Link */}
          {currentEvent.sourceUrl && (
            <div className="conf-source-link">
              <span>Referência Documental: </span>
              <a href={currentEvent.sourceUrl} target="_blank" rel="noreferrer">
                {currentEvent.sourceUrl} ↗
              </a>
            </div>
          )}

          {/* Metrics bar */}
          <div className="conf-metrics-row">
            <div className="conf-metric">
              <span className="metric-label">Grau de Impacto Causal</span>
              <span className="metric-val">{currentEvent.importance}/100</span>
            </div>
            <div className="conf-metric">
              <span className="metric-label">Status de Comprovação</span>
              <span className="metric-val" style={{ color: '#00d4ff' }}>
                {currentEvent.evidenceKind === 'documented_fact' ? 'COMPROVAÇÃO OBSERVACIONAL' : 'MODELO TEÓRICO DEDUTIVO'}
              </span>
            </div>
            <div className="conf-metric">
              <span className="metric-label">Conexões no Cone de Luz</span>
              <span className="metric-val">{currentEvent.causes.length + currentEvent.consequences.length} Geodésicas</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="conference-footer">
          <button type="button" className="conf-nav-btn" onClick={handlePrev}>
            ← Anterior (Seta Esquerda)
          </button>

          <div className="conf-timeline-dots">
            {events.map((ev, idx) => (
              <button
                key={ev.id}
                type="button"
                className={`conf-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                title={`${ev.year}: ${ev.title}`}
              >
                <span>{ev.year}</span>
              </button>
            ))}
          </div>

          <button type="button" className="conf-nav-btn conf-nav-btn-next" onClick={handleNext}>
            Próximo (Espaço / Seta Direita) →
          </button>
        </div>
      </div>
    </div>
  );
}
