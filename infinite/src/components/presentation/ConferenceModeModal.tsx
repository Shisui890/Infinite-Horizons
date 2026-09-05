import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLaymanMode } from '../../context/LaymanModeContext';
import { getLaymanExplanation } from '../../utils/laymanContent';
import type { Universe, TemporalEvent } from '../../types/temporal';
import MathFormula from '../MathFormula';
import { exportToLaTeX, exportToBibTeX } from '../../utils/exportAcademic';

interface Props {
  universe: Universe;
  onClose: () => void;
}

interface FormulaDetail {
  latex: string;
  label: string;
  laymanLabel: string;
  laymanMeaning: string;
}

const FORMULAS_BY_YEAR: Record<number, FormulaDetail> = {
  1865: {
    latex: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}, \\quad \\nabla \\times \\mathbf{B} - \\frac{1}{c^2}\\frac{\\partial \\mathbf{E}}{\\partial t} = \\mu_0 \\mathbf{J} \\quad \\implies \\quad c = \\frac{1}{\\sqrt{\\mu_0 \\epsilon_0}}',
    label: 'Equações de Maxwell & Eletrodinâmica Clássica',
    laymanLabel: 'A Equação da Luz de Maxwell',
    laymanMeaning: 'Esta fórmula prova que eletricidade e magnetismo geram um ao outro continuamente, criando ondas que viajam pelo vácuo espacial na velocidade máxima da luz (c = 300.000 km/s).',
  },
  1887: {
    latex: '\\Delta t_{\\parallel} - \\Delta t_{\\perp} \\approx \\frac{L v^2}{c^3} \\quad \\implies \\quad \\Delta N = \\frac{2 L v^2}{\\lambda c^2} \\xrightarrow{\\text{Experimento}} 0',
    label: 'Experimento de Michelson-Morley & Resultado Nulo do Éter',
    laymanLabel: 'O Mistério do Vento do Éter Inexistente',
    laymanMeaning: 'Michelson e Morley tentaram medir a velocidade da Terra através do suposto "éter" cósmico. O resultado foi rigorosamente ZERO: a luz não precisa de meio mecânico e viaja na mesma velocidade em qualquer direção, estabelecendo a base para a Relatividade Especial.',
  },
  1905: {
    latex: 'ds^2 = -c^2 dt^2 + d\\mathbf{x}^2, \\qquad E = \\gamma m_0 c^2 = \\frac{m_0 c^2}{\\sqrt{1 - v^2/c^2}}',
    label: 'Métrica de Minkowski & Equivalência Massa-Energia',
    laymanLabel: 'O Tempo Elástico e E=mc² (Einstein)',
    laymanMeaning: 'Mostra que quanto mais rápido você viaja (velocidade v), mais devagar o seu tempo passa (fator γ) em comparação com quem ficou parado. Ela também demonstra que massa e energia são a mesma coisa.',
  },
  1915: {
    latex: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
    label: 'Equações de Campo da Relatividade Geral',
    laymanLabel: 'A Equação de Curvatura do Espaço-Tempo',
    laymanMeaning: 'O lado esquerdo mede o quanto o espaço está afundado e dobrado. O lado direito é o peso da matéria e da energia. Ou seja: a matéria diz ao espaço como se curvar, e o espaço curvado diz aos planetas como se mover.',
  },
  1935: {
    latex: 'ds^2 = -\\left(1 - \\frac{2m}{r}\\right) dt^2 + \\left(1 - \\frac{2m}{r}\\right)^{-1} dr^2 + r^2 d\\Omega^2',
    label: 'Métrica da Ponte de Einstein-Rosen',
    laymanLabel: 'A Geometria de um Buraco de Minhoca',
    laymanMeaning: 'Calcula como a gravidade extrema consegue dobrar o tecido do espaço sobre si mesmo até abrir um túnel direto ligando dois pontos distantes do universo.',
  },
  1965: {
    latex: 'T_{\\text{CMB}} = 2.7255 \\pm 0.0006\\,\\text{K} \\quad (\\text{Espectro de Planck de Corpo Negro})',
    label: 'Radiação Residual da Recombinação Cósmica',
    laymanLabel: 'A Temperatura do Eco do Big Bang',
    laymanMeaning: 'Mede a temperatura média do vácuo de todo o universo: 2,7 Kelvin (-270,4 °C). É o calor residual suave que ainda sobrou da grande expansão inicial do cosmos há 13,8 bilhões de anos.',
  },
  1984: {
    latex: 'S = -\\frac{1}{4\\pi\\alpha\'} \\int d^2\\sigma \\sqrt{-\\gamma} \\gamma^{ab} \\partial_a X^\\mu \\partial_b X^\\nu \\eta_{\\mu\\nu}',
    label: 'Ação de Polyakov para Supercordas em 10D',
    laymanLabel: 'A Vibração da Corda Fundamental',
    laymanMeaning: 'Calcula o movimento e a energia de uma corda elástica microscópica de 1 dimensão vibrando no espaço. Cada tipo de vibração gera uma partícula diferente da matéria.',
  },
  1995: {
    latex: 'S_{\\text{11D}} = \\frac{1}{2\\kappa_{11}^2} \\int d^{11}x \\sqrt{-g} \\left( R - \\frac{1}{2} |F_4|^2 \\right) - \\frac{1}{6} C_3 \\wedge F_4 \\wedge F_4',
    label: 'Ação de Supergravidade em 11 Dimensões (Teoria M)',
    laymanLabel: 'O Universo em 11 Dimensões',
    laymanMeaning: 'Descreve as leis da física em um hiperespaço de 11 dimensões, onde as cordas se expandem e formam membranas cósmicas gigantescas.',
  },
  1997: {
    latex: '\\mathcal{Z}_{\\text{AdS}}[\\phi_0] = \\left\\langle \\exp\\left( \\int_{\\partial \\text{AdS}} \\phi_0 \\mathcal{O} \\right) \\right\\rangle_{\\text{CFT}}',
    label: 'Dualidade Holográfica AdS/CFT de Maldacena',
    laymanLabel: 'O Princípio Holográfico',
    laymanMeaning: 'Prova matematicamente que tudo o que acontece em um universo 3D com gravidade pode ser perfeitamente descrito por leis quânticas gravadas na sua borda plana 2D (como um holograma num cartão).',
  },
  1998: {
    latex: 'H^2(z) = H_0^2 \\left[ \\Omega_m (1+z)^3 + \\Omega_r (1+z)^4 + \\Omega_k (1+z)^2 + \\Omega_\\Lambda \\right]',
    label: 'Equação de Friedmann com Constante Cosmológica \\Lambda',
    laymanLabel: 'A Expansão Acelerada pela Energia Escura',
    laymanMeaning: 'Calcula a velocidade com que o universo se expande. O termo final (Ω_Λ) representa a Energia Escura, a força invisível que está afastando as galáxias cada vez mais rápido.',
  },
  2013: {
    latex: 'S_{\\text{entanglement}} = \\frac{\\text{Area}(\\gamma_A)}{4 G_N} \\quad \\Longleftrightarrow \\quad \\text{ER} = \\text{EPR}',
    label: 'Conjectura Holográfica de Susskind & Maldacena',
    laymanLabel: 'A Ponte Quântica ER = EPR',
    laymanMeaning: 'Mostra que a conexão instantânea entre partículas quânticas (EPR) é idêntica a pequenos buracos de minhoca microscópicos (ER) costurando o espaço-tempo.',
  },
  2015: {
    latex: 'h(t) = \\frac{4}{r} \\left(\\frac{G \\mathcal{M}_c}{c^2}\\right)^{5/3} \\left(\\frac{\\pi f_{\\text{GW}}}{c}\\right)^{2/3} \\cos(2\\pi f_{\\text{GW}} t)',
    label: 'Sinal de Onda Gravitacional da Coalescência Binária',
    laymanLabel: 'A Onda do Tremor no Espaço-Tempo',
    laymanMeaning: 'Calcula a força das ondulações que viajam pelo tecido do espaço quando dois buracos negros gigantes colidem a 1,3 bilhão de anos-luz de distância.',
  },
  2019: {
    latex: 'r_{\\text{shadow}} = \\sqrt{27}\\,\\frac{GM}{c^2} \\approx 5.2\\, r_g \\quad (\\text{Sombra de Kerr})',
    label: 'Raio Crítico da Sombra do Horizonte de Eventos',
    laymanLabel: 'O Tamanho da Sombra do Buraco Negro',
    laymanMeaning: 'Calcula o tamanho exato da silhueta preta que o buraco negro supermassivo M87* projeta contra o anel de gás incandescente que gira ao seu redor.',
  },
};

export default function ConferenceModeModal({ universe, onClose }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const events = useMemo(
    () => universe.dimensions.flatMap(d => d.events).sort((a, b) => a.year - b.year),
    [universe]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalEvents = events.length;

  const currentEvent: TemporalEvent | undefined = events[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < totalEvents - 1 ? prev + 1 : 0));
  }, [totalEvents]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, totalEvents - 1)));
  }, [totalEvents]);

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
  const layman = getLaymanExplanation(currentEvent.year, currentEvent.title);

  return (
    <div className="conference-modal-backdrop">
      <div className="conference-modal-container">
        {/* Top Header */}
        <div className="conference-header">
          <div className="conference-brand">
            <span className="conf-badge">
              {isLaymanMode ? 'GUIA DESCOMPLICADO DO UNIVERSO' : 'MODO APRESENTAÇÃO ACADÊMICA'}
            </span>
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
              {isLaymanMode ? layman.laymanCategory : currentEvent.category}
            </div>
          </div>

          <h2 className="conf-event-title">
            {isLaymanMode ? layman.simpleTitle : currentEvent.title}
          </h2>

          <p className="conf-event-description">
            {isLaymanMode ? layman.simpleDescription : currentEvent.description}
          </p>

          {isLaymanMode && (
            <div className="layman-explanation-card" style={{ margin: '14px 0' }}>
              <div className="layman-analogy-box">
                <strong>Como Imaginar Isso:</strong>
                <p>{layman.analogy}</p>
              </div>
              <div className="layman-pop-culture">
                <span>{layman.popCultureRef}</span>
              </div>
              <div className="layman-fun-fact">
                <strong>Curiosidade:</strong>
                <p>{layman.funFact}</p>
              </div>
            </div>
          )}

          {/* KaTeX Formula Box */}
          {formulaInfo && (
            <div className="conf-formula-card">
              <div className="conf-formula-header">
                <span className="conf-formula-tag">
                  {isLaymanMode ? 'FÓRMULA CIENTÍFICA' : 'FORMULAÇÃO MATEMÁTICA'}
                </span>
                <span className="conf-formula-label">
                  {isLaymanMode ? formulaInfo.laymanLabel : formulaInfo.label}
                </span>
              </div>
              <div className="conf-formula-math">
                <MathFormula math={formulaInfo.latex} block />
              </div>
              {isLaymanMode && formulaInfo.laymanMeaning && (
                <div className="layman-formula-card" style={{ marginTop: '10px' }}>
                  <strong>O que esta fórmula significa:</strong>
                  <p>{formulaInfo.laymanMeaning}</p>
                </div>
              )}
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
            {events.map((ev: TemporalEvent, idx: number) => (
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
