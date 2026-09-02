import { useState } from 'react';
import { CosmicAudio } from '../../engine/CosmicAudioEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenShortcuts?: () => void;
}

export default function InteractiveTourModal({ isOpen, onClose, onOpenShortcuts }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      badge: 'PASSO 1 DE 5 • O UNIVERSO ATIVO',
      title: 'Bem-vindo ao Laboratório Infinite Horizons',
      description:
        'Você está no controle de um modelo de espaço-tempo relativístico. À esquerda estão as Variedades Dimensionais (11D e paralelas). No centro, o Grafo Causal mostra como os eventos históricos se conectam através da velocidade da luz.',
      highlightTarget: '.sim-universe-title',
    },
    {
      badge: 'PASSO 2 DE 5 • CONTROLE TEMPORAL',
      title: 'A Máquina do Tempo e Régua de Anos',
      description:
        'Na barra inferior, você pode arrastar a coordenada de tempo ou clicar em Reproduzir (atalho: Espaço). O universo se expandirá ano a ano, revelando apenas os eventos que já aconteceram até aquela época.',
      highlightTarget: '.time-scrubber-container',
    },
    {
      badge: 'PASSO 3 DE 5 • INTERVENÇÕES & FÍSICA',
      title: 'Inspecione Nós e Altere a História',
      description:
        'Clique em qualquer nó no gráfico para abrir o Inspetor Lateral à direita. Lá você pode ouvir o som de ondas gravitacionais, ler as equações de Einstein e testar o que acontece ao alterar ou anular um evento do passado.',
      highlightTarget: '.timeline-canvas-container',
    },
    {
      badge: 'PASSO 4 DE 5 • INTELIGÊNCIA ARTIFICIAL',
      title: 'Crono-Oráculo de IA e Efeito Borboleta',
      description:
        'O botão "Oráculo IA" na barra superior (atalho: O) conecta você a um comitê científico com modelos de IA de ponta para calcular ramificações no multiverso, resolver paradoxos de Novikov e debater hipóteses.',
      highlightTarget: '.sim-btn-ai',
    },
    {
      badge: 'PASSO 5 DE 5 • ATALHOS & ÁUDIO CÓSMICO',
      title: 'Navegação por Teclado e Som Espacial',
      description:
        'O laboratório possui sintetizador de áudio nativo (controle na barra superior) e atalhos rápidos: Espaço (play/pause), setas (navegar anos), L (modo didático), Esc (fechar janelas) e ? para a lista completa.',
      highlightTarget: '.shortcuts-tip',
    },
  ];

  const step = tourSteps[currentStep];

  function handleNext() {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      CosmicAudio.playNodeSelect(60 + currentStep * 10);
    } else {
      CosmicAudio.playOracleChime();
      onClose();
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      CosmicAudio.playNodeSelect(50);
    }
  }

  return (
    <div className="tour-spotlight-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tour-spotlight-card" onClick={e => e.stopPropagation()}>
        <div className="tour-card-header">
          <span className="tour-step-badge">{step.badge}</span>
          <button type="button" className="sim-btn-close" onClick={onClose} aria-label="Pular Tour">
            ✕
          </button>
        </div>

        <h2 className="tour-step-title">{step.title}</h2>
        <p className="tour-step-desc">{step.description}</p>

        <div className="tour-dots-indicator">
          {tourSteps.map((_, idx) => (
            <span
              key={idx}
              className={`tour-dot ${idx === currentStep ? 'active' : ''}`}
              onClick={() => {
                setCurrentStep(idx);
                CosmicAudio.playNodeSelect(60);
              }}
            />
          ))}
        </div>

        <div className="tour-card-actions">
          {currentStep > 0 ? (
            <button type="button" className="btn-tour-secondary" onClick={handlePrev}>
              ← Anterior
            </button>
          ) : (
            <button type="button" className="btn-tour-skip" onClick={onClose}>
              Pular Tutorial
            </button>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep === tourSteps.length - 1 && onOpenShortcuts && (
              <button
                type="button"
                className="btn-tour-secondary"
                onClick={() => {
                  onClose();
                  onOpenShortcuts();
                }}
              >
                Ver Atalhos (?)
              </button>
            )}
            <button type="button" className="btn-tour-primary" onClick={handleNext}>
              {currentStep < tourSteps.length - 1 ? 'Próximo →' : 'Concluir Tour'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
