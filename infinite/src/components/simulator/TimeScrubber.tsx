import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { useLaymanMode } from '../../context/LaymanModeContext';

export default function TimeScrubber() {
  const { isLaymanMode } = useLaymanMode();
  const {
    universeState,
    timelineYear,
    setTimelineYear,
    isTimelinePlaying,
    setIsTimelinePlaying,
    playbackSpeed,
    setPlaybackSpeed,
  } = useSimulationStore();

  const allEvents = universeState.universe.dimensions.flatMap(d => d.events);
  const years = allEvents.map(e => e.year);
  const minYear = years.length > 0 ? Math.min(...years) - 20 : 1850;
  const maxYear = years.length > 0 ? Math.max(...years) + 50 : 2150;

  const activeEventsCount = allEvents.filter(e => e.year <= timelineYear).length;
  const activeTravelers = universeState.universe.travelers.filter(t => t.currentYear <= timelineYear);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isTimelinePlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(50, Math.floor(400 / playbackSpeed));
    timerRef.current = window.setInterval(() => {
      setTimelineYear(timelineYear >= maxYear ? minYear : timelineYear + 1);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimelinePlaying, playbackSpeed, timelineYear, maxYear, minYear, setTimelineYear]);

  return (
    <div className="time-scrubber-container">
      <div className="time-scrubber-header">
        <div className="scrubber-badge">
          <span className="scrubber-dot" />
          <span className="scrubber-label">
            {isLaymanMode ? 'ANO DA LINHA DO TEMPO:' : 'MÁQUINA DO TEMPO:'}
          </span>
          <strong className="scrubber-year">{timelineYear} AD</strong>
        </div>

        <div className="scrubber-stats">
          <span className="scrubber-stat-chip">
            <strong>{activeEventsCount}</strong> / {allEvents.length}{' '}
            {isLaymanMode ? 'acontecimentos até este ano' : 'eventos manifestos'}
          </span>
          <span className="scrubber-stat-chip">
            <strong>{activeTravelers.length}</strong>{' '}
            {isLaymanMode ? 'viajantes presentes' : 'observadores presentes'}
          </span>
        </div>
      </div>

      <div className="time-scrubber-track-wrap">
        <span className="scrubber-edge-year">{minYear}</span>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={timelineYear}
          onChange={e => setTimelineYear(Number(e.target.value))}
          className="time-scrubber-slider"
          aria-label="Controle deslizante de navegação temporal"
        />
        <span className="scrubber-edge-year">{maxYear}</span>
      </div>

      <div className="time-scrubber-controls">
        <div className="scrubber-btn-group">
          <button
            type="button"
            className="btn-scrubber-nav"
            onClick={() => setTimelineYear(minYear)}
            title="Início dos Tempos"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>
          <button
            type="button"
            className="btn-scrubber-nav"
            onClick={() => setTimelineYear(Math.max(minYear, timelineYear - 5))}
            title="-5 Anos"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="11 19 2 12 11 5 11 19" />
              <polygon points="22 19 13 12 22 5 22 19" />
            </svg>
          </button>
          <button
            type="button"
            className={`btn-scrubber-play ${isTimelinePlaying ? 'active' : ''}`}
            onClick={() => setIsTimelinePlaying(!isTimelinePlaying)}
            title={isTimelinePlaying ? 'Pausar' : 'Reproduzir Tempo'}
          >
            {isTimelinePlaying ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>PAUSAR</span>
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>REPRODUZIR</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-scrubber-nav"
            onClick={() => setTimelineYear(Math.min(maxYear, timelineYear + 5))}
            title="+5 Anos"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 19 22 12 13 5 13 19" />
              <polygon points="2 19 11 12 2 5 2 19" />
            </svg>
          </button>
          <button
            type="button"
            className="btn-scrubber-nav"
            onClick={() => setTimelineYear(2025)}
            title="Presente (2025)"
          >
            PRESENTE
          </button>
        </div>

        <div className="scrubber-speed-group">
          <span className="speed-label">Velocidade:</span>
          {[0.5, 1, 2, 5].map(speed => (
            <button
              key={speed}
              type="button"
              className={`btn-scrubber-speed ${playbackSpeed === speed ? 'active' : ''}`}
              onClick={() => setPlaybackSpeed(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
