import { useState } from 'react';
import type { TemporalEvent } from '../../types/temporal';
import { MinkowskiCalculus } from '../../engine/MinkowskiCalculus';
import { useLaymanMode } from '../../context/LaymanModeContext';
import MathFormula from '../MathFormula';

interface Props {
  currentEvent: TemporalEvent;
  allEvents: TemporalEvent[];
}

export default function SpacetimeIntervalCard({ currentEvent, allEvents }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const otherEvents = allEvents.filter(e => e.id !== currentEvent.id);
  const defaultTargetId =
    currentEvent.consequences[0] ||
    currentEvent.causes[0] ||
    (otherEvents.length > 0 ? otherEvents[0].id : null);

  const [targetEventId, setTargetEventId] = useState<string | null>(defaultTargetId);

  const targetEvent = allEvents.find(e => e.id === targetEventId) || null;

  if (!targetEvent) return null;

  const result = MinkowskiCalculus.calculateInterval(currentEvent, targetEvent);

  const isTimelike = result.intervalType === 'timelike';
  const isLightlike = result.intervalType === 'lightlike';

  const typeColor = isTimelike ? '#10b981' : isLightlike ? '#38bdf8' : '#f59e0b';

  return (
    <div className="spacetime-interval-card">
      <div className="st-card-header">
        <div className="st-title-group">
          <span className="st-kicker">
            {isLaymanMode ? 'CONEXÃO DE CAUSA E EFEITO' : 'GEOMETRIA DE MINKOWSKI 4D'}
          </span>
          <h4 className="st-title">
            {isLaymanMode ? 'Um evento consegue influenciar o outro?' : 'Intervalo Relativístico (ds²)'}
          </h4>
        </div>
        <select
          className="st-target-select"
          value={targetEventId || ''}
          onChange={e => setTargetEventId(e.target.value)}
          title="Selecionar evento para comparar distância temporal e espacial"
        >
          {otherEvents.map(e => (
            <option key={e.id} value={e.id}>
              vs. [{e.year}] {e.title.length > 26 ? e.title.slice(0, 24) + '…' : e.title}
            </option>
          ))}
        </select>
      </div>

      {!isLaymanMode ? (
        <div className="st-formula-box">
          <MathFormula math="ds^2 = -(c \Delta t)^2 + \Delta x^2" />
        </div>
      ) : (
        <div className="st-formula-box" style={{ fontSize: '0.85rem', color: '#bae6fd' }}>
          Distância no Tempo: <strong>{result.dtYears} anos</strong> | Distância no Espaço: <strong>{result.dxSpace} unidades</strong>
        </div>
      )}

      <div className="st-metrics-grid">
        <div className="st-metric-item">
          <span className="st-metric-label">
            {isLaymanMode ? 'TIPO DE CONEXÃO' : 'INTERVALO (ds²)'}
          </span>
          <strong className="st-metric-value" style={{ color: typeColor }}>
            {isLaymanMode
              ? (isTimelike ? 'Permitida' : isLightlike ? 'Limite da Luz' : 'Sem Contato')
              : `${result.s2} al²`}
          </strong>
        </div>
        <div className="st-metric-item">
          <span className="st-metric-label">
            {isLaymanMode ? 'DIFERENÇA DE ANOS' : 'SEPARAÇÃO TEMPORAL (Δt)'}
          </span>
          <strong className="st-metric-value">{result.dtYears} anos</strong>
        </div>
        <div className="st-metric-item">
          <span className="st-metric-label">
            {isLaymanMode ? 'DISTÂNCIA NO ESPAÇO' : 'DISTÂNCIA ESPACIAL (Δx)'}
          </span>
          <strong className="st-metric-value">{result.dxSpace} u</strong>
        </div>
        <div className="st-metric-item">
          <span className="st-metric-label">
            {isLaymanMode ? 'TEMPO REAL EXPERIMENTADO' : 'TEMPO PRÓPRIO (Δτ)'}
          </span>
          <strong className="st-metric-value">
            {result.properTimeTau !== null ? `${result.properTimeTau} anos` : (isLaymanMode ? 'Inatingível (mais rápido que a luz)' : 'Indefinido (v > c)')}
          </strong>
        </div>
      </div>

      <div className="st-classification-badge" style={{ borderColor: typeColor }}>
        <span className="st-status-badge" style={{ color: typeColor }}>
          {isLaymanMode
            ? (isTimelike
                ? 'Conexão Causal Válida'
                : isLightlike
                ? 'No Limite da Velocidade da Luz'
                : 'Eventos Isolados (Sem Ligação Direta)')
            : result.causalStatusLabel}
        </span>
        <p className="st-status-desc">
          {isLaymanMode
            ? (isTimelike
                ? 'Houve tempo suficiente para a informação ou luz viajar de um evento até o outro. Portanto, o primeiro acontecimento pode sim ter causado o segundo com total consistência!'
                : isLightlike
                ? 'A influência viajou exatamente na velocidade máxima permitida no universo (300.000 km/s, a velocidade da luz).'
                : 'Estes dois acontecimentos estão tão distantes no espaço e aconteceram com intervalo tão curto de tempo que nem mesmo um raio de luz conseguiria ligá-los a tempo. Um não pode ter sido a causa do outro.')
            : result.scientificExplanation}
        </p>
      </div>
    </div>
  );
}
