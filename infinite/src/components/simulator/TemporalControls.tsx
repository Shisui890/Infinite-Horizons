import { useEffect } from 'react';

interface Props {
  year: number;
  minYear: number;
  maxYear: number;
  eventCount: number;
  visibleEventCount: number;
  isPlaying: boolean;
  onYearChange: (year: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
}

export default function TemporalControls({
  year,
  minYear,
  maxYear,
  eventCount,
  visibleEventCount,
  isPlaying,
  onYearChange,
  onTogglePlay,
  onReset,
}: Props) {
  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      onYearChange(year >= maxYear ? minYear : Math.min(maxYear, year + 5));
    }, 700);
    return () => window.clearInterval(interval);
  }, [isPlaying, maxYear, minYear, onYearChange, year]);

  const mode = year < 2025 ? 'HISTÓRICO' : year === 2025 ? 'PRESENTE' : 'PROJEÇÃO';
  const progress = ((year - minYear) / (maxYear - minYear)) * 100;

  return (
    <section className="temporal-controls" aria-label="Controle temporal global">
      <div className="temporal-controls-heading">
        <div>
          <span className="temporal-kicker">EIXO TEMPORAL</span>
          <strong>{mode}</strong>
        </div>
        <div className="temporal-readout">
          <strong>{year}</strong>
          <span>{visibleEventCount}/{eventCount} eventos visíveis</span>
        </div>
      </div>
      <div className="temporal-slider-wrap">
        <span>{minYear}</span>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          step="5"
          value={year}
          aria-label={`Ano selecionado: ${year}`}
          style={{ '--timeline-progress': `${progress}%` } as React.CSSProperties}
          onChange={event => onYearChange(Number(event.target.value))}
        />
        <span>{maxYear}</span>
      </div>
      <div className="temporal-controls-actions">
        <button type="button" className="temporal-control-button" onClick={onTogglePlay}>
          {isPlaying ? 'PAUSAR' : 'REPRODUZIR'}
        </button>
        <button type="button" className="temporal-control-button temporal-control-reset" onClick={onReset}>
          PRESENTE
        </button>
      </div>
    </section>
  );
}
