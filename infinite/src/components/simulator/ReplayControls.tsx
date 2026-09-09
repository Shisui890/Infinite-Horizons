import { useState, useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';

export default function ReplayControls() {
  const { isReplayActive, replayFrames, replayCurrentIndex, stepReplay, stopReplay } = useSimulationStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<number | null>(null);

  const totalFrames = replayFrames.length;
  const currentFrame = replayFrames[replayCurrentIndex];

  useEffect(() => {
    if (!isReplayActive || !isPlaying || totalFrames === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      if (replayCurrentIndex < totalFrames - 1) {
        stepReplay(replayCurrentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, 1200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isReplayActive, isPlaying, replayCurrentIndex, totalFrames, stepReplay]);

  if (!isReplayActive || !currentFrame) return null;

  return (
    <div className="replay-hud-overlay">
      <div className="replay-hud-card">
        <div className="replay-hud-header">
          <div className="replay-badge-tag">
            <span className="replay-pulse" />
            <span>REPLAY CAUSAL EM ANDAMENTO</span>
          </div>
          <div className="replay-step-counter">
            PASSO <strong>{replayCurrentIndex + 1}</strong> / {totalFrames}
          </div>
          <button type="button" className="btn-close-replay" onClick={stopReplay} title="Encerrar Replay">
            ✕
          </button>
        </div>

        <div className="replay-body">
          <p className="replay-description">{currentFrame.description}</p>

          <div className="replay-integrity-bar-wrap">
            <span className="replay-bar-label">Integridade no Passo:</span>
            <div className="replay-bar-track">
              <div
                className="replay-bar-fill"
                style={{
                  width: `${currentFrame.integritySnapshot}%`,
                  backgroundColor:
                    currentFrame.integritySnapshot > 70
                      ? '#10b981'
                      : currentFrame.integritySnapshot > 40
                      ? '#f59e0b'
                      : '#ef4444',
                }}
              />
            </div>
            <strong className="replay-bar-val">{currentFrame.integritySnapshot}%</strong>
          </div>
        </div>

        <div className="replay-footer-controls">
          <button
            type="button"
            className="btn-replay-nav"
            disabled={replayCurrentIndex <= 0}
            onClick={() => stepReplay(replayCurrentIndex - 1)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Anterior
          </button>
          <button
            type="button"
            className={`btn-replay-play ${isPlaying ? 'active' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                PAUSAR
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                CONTINUAR
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-replay-nav"
            disabled={replayCurrentIndex >= totalFrames - 1}
            onClick={() => stepReplay(replayCurrentIndex + 1)}
          >
            Próximo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
