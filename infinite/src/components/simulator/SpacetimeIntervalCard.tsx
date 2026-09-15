import { useState } from 'react';
import type { TemporalEvent } from '../../types/temporal';
import { MinkowskiCalculus } from '../../engine/MinkowskiCalculus';
import { useLaymanMode } from '../../context/useLaymanMode';
import { useSimulationStore } from '../../store/useSimulationStore';
import { DICTIONARY, getLocalizedEventTitle } from '../../utils/i18n';
import MathFormula from '../MathFormula';

interface Props {
  currentEvent: TemporalEvent;
  allEvents: TemporalEvent[];
}

export default function SpacetimeIntervalCard({ currentEvent, allEvents }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const { language } = useSimulationStore();
  const t = DICTIONARY[language];

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

  const causalStatusLabel = isLaymanMode
    ? isTimelike
      ? t.laymanTimelikeLabel
      : isLightlike
      ? t.laymanLightlikeLabel
      : t.laymanSpacelikeLabel
    : isTimelike
    ? t.timelikeLabel
    : isLightlike
    ? t.lightlikeLabel
    : t.spacelikeLabel;

  const scientificExplanation = isLaymanMode
    ? isTimelike
      ? t.laymanTimelikeDesc
      : isLightlike
      ? t.laymanLightlikeDesc
      : t.laymanSpacelikeDesc
    : isTimelike
    ? t.timelikeDesc
    : isLightlike
    ? t.lightlikeDesc
    : t.spacelikeDesc;

  return (
    <div className="spacetime-interval-card">
      <div className="st-card-header">
        <div className="st-title-group">
          <span className="st-kicker">
            {isLaymanMode ? t.laymanMinkowskiGeometry : t.minkowskiGeometry}
          </span>
          <h4 className="st-title">
            {isLaymanMode ? t.laymanIntervalTitle : t.intervalTitle}
          </h4>
        </div>
        <select
          className="st-target-select"
          value={targetEventId || ''}
          onChange={e => setTargetEventId(e.target.value)}
          title={language === 'en' ? 'Select event to compare temporal and spatial interval' : 'Selecionar evento para comparar distância temporal e espacial'}
        >
          {otherEvents.map(e => {
            const locTitle = getLocalizedEventTitle(e, language);
            const shortTitle = locTitle.length > 26 ? locTitle.slice(0, 24) + '…' : locTitle;
            return (
              <option key={e.id} value={e.id}>
                vs. [{e.year}] {shortTitle}
              </option>
            );
          })}
        </select>
      </div>

      {!isLaymanMode ? (
        <div className="st-formula-box">
          <MathFormula math="ds^2 = -(c \Delta t)^2 + \Delta x^2" />
        </div>
      ) : (
        <div className="st-formula-box" style={{ fontSize: '0.85rem', color: '#bae6fd' }}>
          {language === 'en' ? 'Time Distance:' : 'Distância no Tempo:'} <strong>{result.dtYears} {t.years}</strong> |{' '}
          {language === 'en' ? 'Space Distance:' : 'Distância no Espaço:'} <strong>{result.dxSpace} {language === 'en' ? 'units' : 'unidades'}</strong>
        </div>
      )}

      <div className="st-metrics-grid">
        <div className="st-metric-item">
          <span className="st-metric-label">
            {isLaymanMode ? t.laymanConnectionType : t.connectionType}
          </span>
          <strong className="st-metric-value" style={{ color: typeColor }}>
            {isLaymanMode
              ? (isTimelike ? t.timelikeAllowed : isLightlike ? t.lightLimit : t.spacelikeNoContact)
              : `${result.s2} al²`}
          </strong>
        </div>
        <div className="st-metric-item">
          <span className="st-metric-label">
            {isLaymanMode ? t.laymanTemporalSeparation : t.temporalSeparation}
          </span>
          <strong className="st-metric-value">{result.dtYears} {t.years}</strong>
        </div>
        <div className="st-metric-item">
          <span className="st-metric-label">
            {isLaymanMode ? t.laymanSpatialDistance : t.spatialDistance}
          </span>
          <strong className="st-metric-value">{result.dxSpace} {t.units}</strong>
        </div>
        <div className="st-metric-item">
          <span className="st-metric-label">
            {isLaymanMode ? t.laymanProperTime : t.properTime}
          </span>
          <strong className="st-metric-value">
            {result.properTimeTau !== null ? `${result.properTimeTau} ${t.years}` : (isLaymanMode ? t.unattainable : t.undefinedSuperluminal)}
          </strong>
        </div>
      </div>

      <div className="st-classification-badge" style={{ borderColor: typeColor }}>
        <span className="st-status-badge" style={{ color: typeColor }}>
          {causalStatusLabel}
        </span>
        <p className="st-status-desc">
          {scientificExplanation}
        </p>
      </div>
    </div>
  );
}

