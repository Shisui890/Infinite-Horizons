import { useState, useEffect, useRef } from 'react';
import { COSMIC_SIGNALS, CosmicSonificationService, type CosmicSignal } from '../../engine/CosmicSonificationService';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface Props {
  onClose: () => void;
  initialSignalId?: string;
}

export default function CosmicAcousticsModal({ onClose, initialSignalId }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const [selectedSignalId, setSelectedSignalId] = useState<string>(initialSignalId || COSMIC_SIGNALS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.6);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeSignal: CosmicSignal =
    COSMIC_SIGNALS.find(s => s.id === selectedSignalId) || COSMIC_SIGNALS[0];

  // Alterna sinal e inicia reprodução
  function handleSelectSignal(id: string) {
    setSelectedSignalId(id);
    if (isPlaying) {
      CosmicSonificationService.playSignal(id, isLooping);
    }
  }

  function handleTogglePlay() {
    if (isPlaying) {
      CosmicSonificationService.stopAll();
      setIsPlaying(false);
    } else {
      CosmicSonificationService.playSignal(selectedSignalId, isLooping);
      setIsPlaying(true);
    }
  }

  function handleVolumeChange(val: number) {
    setVolume(val);
    CosmicSonificationService.setVolume(val);
  }

  // Desliga o áudio ao desmontar o componente
  useEffect(() => {
    return () => {
      CosmicSonificationService.stopAll();
    };
  }, []);

  // Osciloscópio / Espectrograma em tempo real no Canvas
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = CosmicSonificationService.getAnalyser();

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Fundo escuro estelar
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Linhas de grade sutis
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 30) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        // Desenha onda senoidal / forma de onda
        ctx.lineWidth = 2.5;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, '#00d4ff');
        grad.addColorStop(0.5, '#38bdf8');
        grad.addColorStop(1, '#a855f7');
        ctx.strokeStyle = grad;

        ctx.beginPath();
        const sliceWidth = (width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Brilho fluorescente
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      } else {
        // Linha de repouso (silêncio)
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div className="cosmic-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cosmic-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="cosmic-modal-header">
          <div className="cosmic-header-left">
            <span className="cosmic-pill-badge">
              <span className="pill-dot" />
              {isLaymanMode ? 'LABORATÓRIO DE SONS DO UNIVERSO // NASA & LIGO' : 'ASTROFÍSICA OBSERVACIONAL // SONIFICAÇÃO DE DADOS'}
            </span>
            <h2 className="cosmic-modal-title">
              {isLaymanMode ? 'Ouça os Sons Reais Gravados no Espaço Profundo' : 'Laboratório de Acústica Espacial & Ondas Relativísticas'}
            </h2>
          </div>

          <button
            type="button"
            className="btn-cosmic-close"
            onClick={onClose}
            aria-label="Fechar laboratório acústico"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Signals Tabs Selector */}
        <div className="cosmic-signals-grid">
          {COSMIC_SIGNALS.map(s => {
            const isSelected = s.id === selectedSignalId;
            return (
              <button
                key={s.id}
                type="button"
                className={`cosmic-signal-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectSignal(s.id)}
              >
                <div className="signal-card-top">
                  <span className="signal-year-badge">{s.yearRecorded}</span>
                  <span className={`signal-status-dot ${isSelected && isPlaying ? 'pulsing' : ''}`} />
                </div>
                <h4 className="signal-card-name">{s.name}</h4>
                <span className="signal-source-label">{s.sourceBody}</span>
                <span className="signal-obs-meta">{s.observatory}</span>
              </button>
            );
          })}
        </div>

        {/* Oscilloscope & Live Player Area */}
        <div className="cosmic-player-stage">
          <div className="oscilloscope-container">
            <canvas ref={canvasRef} width={760} height={120} className="oscilloscope-canvas" />
            <div className="oscilloscope-hud">
              <span className="hud-label">SINAL: <strong>{activeSignal.name}</strong></span>
              <span className="hud-freq">{activeSignal.frequencyRange}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="cosmic-controls-bar">
            <button
              type="button"
              className={`btn-cosmic-play-toggle ${isPlaying ? 'playing' : ''}`}
              onClick={handleTogglePlay}
            >
              {isPlaying ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>PAUSAR ÁUDIO</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>OUVIR SINAL CÓSMICO</span>
                </>
              )}
            </button>

            <div className="cosmic-audio-options">
              <label className="loop-toggle-lbl">
                <input
                  type="checkbox"
                  checked={isLooping}
                  onChange={e => setIsLooping(e.target.checked)}
                />
                <span>Repetir em Loop</span>
              </label>

              <div className="volume-slider-group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="cosmic-vol-slider"
                  aria-label="Volume"
                />
                <span className="vol-text">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dual-Mode Dossier (Didático vs Acadêmico) */}
        <div className="cosmic-dossier-card">
          <div className="dossier-card-meta-row">
            <div className="meta-badge-item">
              <span className="meta-lbl">FONTE OBSERVACIONAL</span>
              <span className="meta-val">{activeSignal.sourceBody}</span>
            </div>
            <div className="meta-badge-item">
              <span className="meta-lbl">DISTÂNCIA DA TERRA</span>
              <span className="meta-val">{activeSignal.distanceLightYears}</span>
            </div>
            <div className="meta-badge-item">
              <span className="meta-lbl">INSTRUMENTO / MISSÃO</span>
              <span className="meta-val">{activeSignal.observatory}</span>
            </div>
          </div>

          {isLaymanMode ? (
            <div className="dossier-layman-content">
              <div className="dossier-header-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <strong>COMO IMAGINAR ESTE SOM:</strong>
              </div>
              <p className="dossier-desc-simple">{activeSignal.laymanDescription}</p>
              <div className="dossier-analogy-box">
                <strong>Analogia do Cotidiano:</strong>
                <p>{activeSignal.laymanAnalogy}</p>
              </div>
            </div>
          ) : (
            <div className="dossier-academic-content">
              <div className="academic-header-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <strong>MECANISMO ASTROFÍSICO & MODELAGEM TEÓRICA:</strong>
              </div>
              <p className="dossier-desc-academic">{activeSignal.academicPhysics}</p>

              <div className="dossier-citation-box">
                <div className="citation-head">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 6h10M6 10h10" />
                  </svg>
                  <span>FONTE PRIMÁRIA CANÔNICA CITADA:</span>
                </div>
                <div className="citation-text">
                  <strong>{activeSignal.academicCitation.author} ({activeSignal.academicCitation.year})</strong>. 
                  <em> "{activeSignal.academicCitation.title}"</em>. {activeSignal.academicCitation.journal}. 
                  <span className="cite-doi-pill">{activeSignal.academicCitation.doi}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
