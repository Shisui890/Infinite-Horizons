/**
 * RealPhotographicViewer.tsx
 *
 * Visualizador de Fotografia Científica Real e Animações/GIFs em Alta Fidelidade
 * da NASA, ESA, Event Horizon Telescope (EHT), Cassini, Hubble e JWST.
 *
 * Estritamente contido no viewport tático sem distorção ou overflow de layout.
 */

import { useState } from 'react';
import type { CelestialBody } from '../../data/celestialBodies';
import { getCelestialRealMedia, type RealMediaView } from '../../data/celestialRealMedia';

interface Props {
  body: CelestialBody;
  isLaymanMode?: boolean;
}

export default function RealPhotographicViewer({ body, isLaymanMode = false }: Props) {
  const mediaProfile = getCelestialRealMedia(body.id);
  const [selectedViewId, setSelectedViewId] = useState<string>(mediaProfile?.defaultViewId || '');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showScanlines, setShowScanlines] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  if (!mediaProfile || mediaProfile.views.length === 0) {
    return (
      <div className="rpv-empty-box">
        <p>Mídia fotográfica direta em calibração para esta coordenada estelar.</p>
      </div>
    );
  }

  const activeView: RealMediaView =
    mediaProfile.views.find(v => v.id === selectedViewId) || mediaProfile.views[0];

  return (
    <div className="rpv-container">
      {/* 1. Seletor de Múltiplas Vistas / Fotografias Reais e GIFs */}
      {mediaProfile.views.length > 1 && (
        <div className="rpv-views-bar">
          {mediaProfile.views.map(view => {
            const isActive = view.id === activeView.id;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => {
                  setSelectedViewId(view.id);
                  setZoomLevel(1);
                }}
                className={`rpv-view-btn ${isActive ? 'active' : ''}`}
              >
                {view.isAnimated ? (
                  <span className="rpv-animated-dot" />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                )}
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Janela Principal de Visualização Fotográfica Bounded Hero */}
      <div className="rpv-hero-box">
        {/* Cantos Táticos do Visor Óptico */}
        <div className="ed-viewport-corner ed-corner-tl" />
        <div className="ed-viewport-corner ed-corner-tr" />
        <div className="ed-viewport-corner ed-corner-bl" />
        <div className="ed-viewport-corner ed-corner-br" />

        {/* Imagem ou GIF com Zoom Interativo estritamente contido */}
        <div
          className="rpv-hero-img-wrap"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={activeView.url}
            alt={activeView.title}
            className="rpv-hero-img"
            loading="lazy"
          />
        </div>

        {/* Efeito de Scanlines Opcional */}
        {showScanlines && <div className="rpv-scanlines" />}

        {/* Retícula e Telemetria Tática Overlay */}
        <div className="rpv-reticle-overlay">
          <div className="rpv-overlay-top">
            <div className="rpv-badge-group">
              <span className="rpv-rec-tag">
                REC // {activeView.agency}
              </span>
              {activeView.isAnimated && (
                <span className="rpv-dyn-tag">
                  <span className="rpv-pulse-dot" />
                  SIMULAÇÃO DINÂMICA
                </span>
              )}
            </div>
            <span className="rpv-wavelength-tag">λ {activeView.wavelength}</span>
          </div>

          <div className="rpv-overlay-bottom">
            <span className="rpv-observatory-tag" title={activeView.observatory}>{activeView.observatory}</span>
            <span className="rpv-resolution-tag">RES: {activeView.resolution}</span>
          </div>
        </div>

        {/* Barra Flutuante de Controles Ópticos */}
        <div className="rpv-controls-float">
          <button
            type="button"
            onClick={() => setZoomLevel(z => (z === 1 ? 1.5 : z === 1.5 ? 2.2 : 1))}
            title="Alternar Zoom Óptico"
            className="rpv-ctrl-btn"
          >
            {zoomLevel}x
          </button>
          <button
            type="button"
            onClick={() => setShowScanlines(s => !s)}
            title="Alternar Linhas de Varredura (Scanlines)"
            className={`rpv-ctrl-btn ${showScanlines ? 'active' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            title="Expandir Fotografia em Tela Cheia"
            className="rpv-ctrl-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Dossiê Científico da Captura / Telescópio */}
      <div className="rpv-dossier">
        <div className="rpv-dossier-header">
          <div className="rpv-dossier-title-block">
            <span className="rpv-dossier-kicker">// DOSSIÊ FOTOGRÁFICO DE MISSÃO</span>
            <h4 className="rpv-dossier-title">{activeView.title}</h4>
          </div>
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="rpv-expand-btn"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
            <span>TELA CHEIA</span>
          </button>
        </div>

        {/* Grade de Especificações da Observação */}
        <div className="rpv-specs-grid">
          <div className="rpv-spec-item rpv-spec-full">
            <span className="rpv-spec-lbl">OBSERVATÓRIO / AGÊNCIA</span>
            <strong className="rpv-spec-val" title={activeView.agency}>{activeView.agency}</strong>
          </div>
          <div className="rpv-spec-item rpv-spec-full">
            <span className="rpv-spec-lbl">INSTRUMENTO ÓPTICO</span>
            <strong className="rpv-spec-val" title={activeView.instrument}>{activeView.instrument}</strong>
          </div>
          <div className="rpv-spec-item">
            <span className="rpv-spec-lbl">COMPRIMENTO DE ONDA</span>
            <strong className="rpv-spec-val highlight">{activeView.wavelength}</strong>
          </div>
          <div className="rpv-spec-item">
            <span className="rpv-spec-lbl">DATA DE REGISTRO</span>
            <strong className="rpv-spec-val">{activeView.captureDate}</strong>
          </div>
        </div>

        {/* Legenda Explicativa & Insight Físico */}
        <div className="rpv-captions">
          <p className="rpv-caption-text">{activeView.caption}</p>
          <div className="rpv-insight-box">
            <span className="rpv-insight-lbl">
              {isLaymanMode ? 'ENTENDENDO A IMAGEM:' : 'ANÁLISE RELATIVÍSTICA / ASTROFÍSICA:'}
            </span>
            <span className="rpv-insight-text">{activeView.scientificInsight}</span>
          </div>
        </div>
      </div>

      {/* 4. Modal Lightbox de Alta Resolução */}
      {isLightboxOpen && (
        <div
          className="rpv-lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="rpv-lightbox-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="rpv-lightbox-header">
              <div className="rpv-lightbox-meta">
                <span className="rpv-rec-tag">{activeView.agency}</span>
                <div>
                  <h3 className="rpv-lightbox-title">{activeView.title}</h3>
                  <div className="rpv-lightbox-sub">
                    {activeView.observatory} // {activeView.captureDate}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="rpv-lightbox-close"
                title="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="rpv-lightbox-stage">
              <img
                src={activeView.url}
                alt={activeView.title}
                className="rpv-lightbox-img"
              />
            </div>

            <div className="rpv-lightbox-footer">
              <p>{activeView.caption}</p>
              <p className="rpv-insight-text">
                <strong>Insight Científico:</strong> {activeView.scientificInsight}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
