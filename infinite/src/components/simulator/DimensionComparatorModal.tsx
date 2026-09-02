import { useState, useMemo } from 'react';
import type { Universe, Dimension, TemporalEvent } from '../../types/temporal';
import { LigoAudio } from '../../engine/LigoAudioService';
import { useLaymanMode } from '../../context/LaymanModeContext';
import { getLaymanExplanation } from '../../utils/laymanContent';

interface Props {
  universe: Universe;
  onClose: () => void;
  onMergeDimensions: (newDimension: Dimension) => void;
}

export default function DimensionComparatorModal({ universe, onClose, onMergeDimensions }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const dimensions = universe.dimensions;
  const [dimAId, setDimAId] = useState<string>(dimensions[0]?.id || '');
  const [dimBId, setDimBId] = useState<string>(dimensions[1]?.id || dimensions[0]?.id || '');

  const dimA = dimensions.find(d => d.id === dimAId) || dimensions[0];
  const dimB = dimensions.find(d => d.id === dimBId) || dimensions[1] || dimensions[0];

  const eventsA = useMemo(() => dimA?.events || [], [dimA]);
  const eventsB = useMemo(() => dimB?.events || [], [dimB]);

  // Calculate Causal Divergence Score
  const divergence = useMemo(() => {
    if (!dimA || !dimB || dimA.id === dimB.id) return 0;
    const totalEvents = eventsA.length + eventsB.length;
    if (totalEvents === 0) return 0;

    // Events with overlapping approximate years
    let sharedYearsCount = 0;
    eventsA.forEach(ea => {
      if (eventsB.some(eb => Math.abs(eb.year - ea.year) <= 5)) {
        sharedYearsCount++;
      }
    });

    const diffFraction = 1 - (sharedYearsCount * 2) / totalEvents;
    return Math.max(5, Math.min(95, Math.round(diffFraction * 100)));
  }, [dimA, dimB, eventsA, eventsB]);

  function handleExecuteMerge() {
    if (!dimA || !dimB || dimA.id === dimB.id) return;

    const mergedEvents: TemporalEvent[] = [
      ...eventsA,
      ...eventsB.filter(eb => !eventsA.some(ea => ea.id === eb.id)),
    ].sort((a, b) => a.year - b.year);

    const mergedDimension: Dimension = {
      id: `dim-fused-${Date.now()}`,
      universeId: universe.id,
      designation: `Ω-${dimensions.length + 1}`,
      name: `Fusão: ${dimA.name.slice(0, 15)} ✕ ${dimB.name.slice(0, 15)}`,
      color: '#10b981',
      events: mergedEvents,
      integrity: Math.round((dimA.integrity + dimB.integrity) / 2),
    };

    LigoAudio.playLigoChirp();
    onMergeDimensions(mergedDimension);
    onClose();
  }

  return (
    <div className="sim-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="comparator-title">
      <div className="modal-card dimension-comparator-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sim-modal-header mc-header">
          <div className="mc-header-info">
            <div className="mc-kicker-badge">
              <span className="mc-pulse-dot" />
              <span className="mc-kicker-text">
                {isLaymanMode ? 'COMPARAÇÃO DE LINHAS TEMPORAIS' : 'ANÁLISE DE MULTIVERSO & BIFURCAÇÃO EVERETTIANA'}
              </span>
            </div>
            <div className="mc-title-row">
              <h2 id="comparator-title" className="mc-title">
                {isLaymanMode ? 'Comparar Duas Linhas do Tempo Lado a Lado' : 'Comparador de Dimensões em Split-View'}
              </h2>
            </div>
          </div>
          <button type="button" className="sim-btn-close" onClick={onClose} aria-label="Fechar Modal">
            ✕
          </button>
        </div>

        {/* Dimension Selectors Bar */}
        <div className="comparator-selectors-bar">
          <div className="dim-select-group">
            <span className="dim-select-tag" style={{ color: dimA?.color || '#00d4ff' }}>
              {isLaymanMode ? 'LINHA DO TEMPO A:' : 'DIMENSÃO A:'}
            </span>
            <select value={dimAId} onChange={e => setDimAId(e.target.value)}>
              {dimensions.map(d => (
                <option key={d.id} value={d.id}>
                  {d.designation} — {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="divergence-metric-pill">
            <span>{isLaymanMode ? 'Diferença entre as Histórias' : 'Divergência Causal'}</span>
            <strong style={{ color: divergence > 50 ? '#ef4444' : '#00d4ff' }}>{divergence}%</strong>
          </div>

          <div className="dim-select-group">
            <span className="dim-select-tag" style={{ color: dimB?.color || '#a855f7' }}>
              {isLaymanMode ? 'LINHA DO TEMPO B:' : 'DIMENSÃO B:'}
            </span>
            <select value={dimBId} onChange={e => setDimBId(e.target.value)}>
              {dimensions.map(d => (
                <option key={d.id} value={d.id}>
                  {d.designation} — {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Split Grid */}
        <div className="comparator-split-grid">
          {/* Column A */}
          <div className="comparator-column">
            <div className="comparator-col-header" style={{ borderBottomColor: dimA?.color || '#00d4ff' }}>
              <h4>{dimA?.designation} — {dimA?.name}</h4>
              <span className="comp-integrity">
                {isLaymanMode ? `Estabilidade: ${dimA?.integrity}%` : `Integridade: ${dimA?.integrity}%`}
              </span>
            </div>
            <div className="comparator-event-list">
              {eventsA.map(ev => {
                const lay = isLaymanMode ? getLaymanExplanation(ev.year, ev.title) : null;
                return (
                  <div key={ev.id} className="comp-event-item">
                    <div className="comp-event-top">
                      <span className="comp-year" style={{ color: dimA?.color || '#00d4ff' }}>{ev.year}</span>
                      <span className="comp-cat">{lay ? lay.laymanCategory.toUpperCase() : ev.category}</span>
                    </div>
                    <h5 className="comp-title">{lay ? lay.simpleTitle : ev.title}</h5>
                    <p className="comp-desc">
                      {lay ? lay.simpleDescription : `${ev.description?.slice(0, 110)}...`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column B */}
          <div className="comparator-column">
            <div className="comparator-col-header" style={{ borderBottomColor: dimB?.color || '#a855f7' }}>
              <h4>{dimB?.designation} — {dimB?.name}</h4>
              <span className="comp-integrity">
                {isLaymanMode ? `Estabilidade: ${dimB?.integrity}%` : `Integridade: ${dimB?.integrity}%`}
              </span>
            </div>
            <div className="comparator-event-list">
              {eventsB.map(ev => {
                const lay = isLaymanMode ? getLaymanExplanation(ev.year, ev.title) : null;
                return (
                  <div key={ev.id} className="comp-event-item">
                    <div className="comp-event-top">
                      <span className="comp-year" style={{ color: dimB?.color || '#a855f7' }}>{ev.year}</span>
                      <span className="comp-cat">{lay ? lay.laymanCategory.toUpperCase() : ev.category}</span>
                    </div>
                    <h5 className="comp-title">{lay ? lay.simpleTitle : ev.title}</h5>
                    <p className="comp-desc">
                      {lay ? lay.simpleDescription : `${ev.description?.slice(0, 110)}...`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="comparator-footer">
          <button
            type="button"
            className="btn-merge-dimensions"
            onClick={handleExecuteMerge}
            disabled={dimAId === dimBId}
          >
            {isLaymanMode
              ? 'Juntar os Acontecimentos das Duas Histórias (Fusão)'
              : 'Fundir Linhas Temporais em Nova Dimensão (Ω-Fusion)'}
          </button>
        </div>
      </div>
    </div>
  );
}
