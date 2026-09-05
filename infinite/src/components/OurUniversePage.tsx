import { useState, useMemo } from 'react';
import {
  CELESTIAL_BODIES,
  CELESTIAL_SECTORS,
  type CelestialSector,
} from '../data/celestialBodies';
import { getCelestialRealMedia } from '../data/celestialRealMedia';
import StellarOrreryCanvas from './universe/StellarOrreryCanvas';
import TargetScannerPanel from './universe/TargetScannerPanel';
import AerospaceFlightSimulator from './aerospace/AerospaceFlightSimulator';
import NasaCosmologyObservatory from './universe/NasaCosmologyObservatory';
import { useLaymanMode } from '../context/LaymanModeContext';

interface Props {
  onBack: () => void;
  onStartSimulator: () => void;
}

type MainUniverseMode = 'cartography' | 'aerospace_sim' | 'nasa_observatory';

export default function OurUniversePage({ onBack, onStartSimulator }: Props) {
  const { isLaymanMode, toggleLaymanMode } = useLaymanMode();
  const [universeMode, setUniverseMode] = useState<MainUniverseMode>('cartography');
  const [activeSector, setActiveSector] = useState<CelestialSector>('solar_system');

  // Filter bodies by active sector
  const sectorBodies = useMemo(
    () => CELESTIAL_BODIES.filter(b => b.sector === activeSector),
    [activeSector]
  );

  // Selected celestial body
  const [selectedBodyId, setSelectedBodyId] = useState<string>('sol');

  const selectedBody = useMemo(() => {
    return (
      CELESTIAL_BODIES.find(b => b.id === selectedBodyId) ||
      sectorBodies[0] ||
      CELESTIAL_BODIES[0]
    );
  }, [selectedBodyId, sectorBodies]);

  const handleSelectSector = (sector: CelestialSector) => {
    setActiveSector(sector);
    const firstBody = CELESTIAL_BODIES.find(b => b.sector === sector);
    if (firstBody) setSelectedBodyId(firstBody.id);
  };

  const currentSectorMeta = CELESTIAL_SECTORS.find(s => s.id === activeSector)!;

  return (
    <div className="ed-cockpit-root">
      {/* 1. Cockpit HUD Header */}
      <header className="ed-hud-header">
        <div className="ed-header-left">
          <button
            type="button"
            className="ed-btn-back"
            onClick={onBack}
            title="Voltar à Página Inicial"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>VOLTAR À BASE</span>
          </button>

          <div className="ed-system-identity">
            <span className="ed-status-beacon" />
            <div className="ed-id-text">
              <span className="ed-id-title">
                {universeMode === 'cartography'
                  ? 'CARTOGRAFIA ESTELAR // SISTEMA ONLINE'
                  : universeMode === 'aerospace_sim'
                  ? 'SIMULADOR AEROESPACIAL // KSP & RE-ENTRY'
                  : 'PORTAL NASA // THE UNIVERSE & COSMOLOGIA'}
              </span>
              <span className="ed-id-sub">EXPLORAÇÃO DE CORPOS CELESTES E DADOS DA NASA</span>
            </div>
          </div>
        </div>

        {/* Center Primary Mode Switcher */}
        <div className="ed-main-mode-toggle">
          <button
            type="button"
            className={`btn-mode-nav ${universeMode === 'cartography' ? 'active' : ''}`}
            onClick={() => setUniverseMode('cartography')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>CARTOGRAFIA ESTELAR</span>
          </button>

          <button
            type="button"
            className={`btn-mode-nav ${universeMode === 'aerospace_sim' ? 'active' : ''}`}
            onClick={() => setUniverseMode('aerospace_sim')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="12 2 2 22 22 22" />
            </svg>
            <span>SIMULADOR AEROESPACIAL</span>
          </button>

          <button
            type="button"
            className={`btn-mode-nav ${universeMode === 'nasa_observatory' ? 'active' : ''}`}
            onClick={() => setUniverseMode('nasa_observatory')}
          >
            <span className="nasa-mode-badge-dot" />
            <span>PORTAL NASA // THE UNIVERSE</span>
          </button>
        </div>

        <div className="ed-header-right">
          <button
            type="button"
            className={`ed-btn-mode ${isLaymanMode ? 'active-layman' : ''}`}
            onClick={toggleLaymanMode}
            title="Alterna entre explicações intuitivas do dia a dia e formalismo matemático com tensores"
          >
            {isLaymanMode ? 'MODO DIDÁTICO' : 'MODO TÉCNICO'}
          </button>

          <button
            type="button"
            className="ed-btn-launch-sim"
            onClick={onStartSimulator}
            title="Alternar para o Laboratório de Linhas Temporais"
          >
            <span>SIMULADOR TEMPORAL</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </header>

      {/* MODE 1: CARTOGRAFIA ESTELAR (ELITE DANGEROUS) */}
      {universeMode === 'cartography' && (
        <>
          {/* 2. Tactical Sector Navigation Bar (Elite Dangerous Style Tabs) */}
          <nav className="ed-sector-nav" aria-label="Seletor de Setores Cósmicos">
            <div className="ed-sector-tabs">
              {CELESTIAL_SECTORS.map(sec => {
                const isActive = sec.id === activeSector;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    className={`ed-sector-tab ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectSector(sec.id)}
                  >
                    <span className="ed-tab-code">[{sec.code}]</span>
                    <span className="ed-tab-label">{sec.label.toUpperCase()}</span>
                    {isActive && <span className="ed-tab-active-indicator" />}
                  </button>
                );
              })}
            </div>

            <div className="ed-sector-intel">
              <span className="ed-intel-code">{currentSectorMeta.code}</span>
              <span className="ed-intel-desc">{currentSectorMeta.desc}</span>
            </div>
          </nav>

          {/* 3. Main Cockpit Exploration Bridge Grid */}
          <main className="ed-cockpit-grid">
            {/* Left Column: Orrery Star Chart Canvas + Sector Bodies Quick Bar */}
            <section className="ed-map-column">
              <StellarOrreryCanvas
                bodies={sectorBodies}
                selectedBody={selectedBody}
                sector={activeSector}
                onSelectBody={b => setSelectedBodyId(b.id)}
              />

              {/* Tactical Target Selector List */}
              <div className="ed-targets-strip">
                <div className="ed-strip-header">
                  <span className="ed-strip-title">
                    CORPOS CATALOGADOS NO SETOR ({sectorBodies.length})
                  </span>
                  <span className="ed-strip-tip">CLIQUE PARA TRAVAR O SCANNER</span>
                </div>

                <div className="ed-targets-grid">
                  {sectorBodies.map(body => {
                    const isSelected = body.id === selectedBody.id;
                    const realMedia = getCelestialRealMedia(body.id);
                    const thumbUrl = realMedia?.views[0]?.url;

                    return (
                      <button
                        key={body.id}
                        type="button"
                        className={`ed-target-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedBodyId(body.id)}
                      >
                        <div className="ed-card-indicator">
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={body.name}
                              className="ed-card-thumb"
                              loading="lazy"
                            />
                          ) : (
                            <span
                              className="ed-target-dot"
                              style={{ backgroundColor: body.color }}
                            />
                          )}
                        </div>
                        <div className="ed-card-data">
                          <strong className="ed-card-name">{body.name}</strong>
                          <span className="ed-card-type">{body.type}</span>
                        </div>
                        {isSelected && (
                          <span className="ed-card-locked-tag">LOCKED</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Right Column: Tactical Telemetry Scanner Panel with Tabs */}
            <section className="ed-scanner-column">
              <TargetScannerPanel
                body={selectedBody}
                onOpenAerospaceSim={() => setUniverseMode('aerospace_sim')}
              />
            </section>
          </main>
        </>
      )}

      {/* MODE 2: SIMULADOR AEROESPACIAL (KSP & RE-ENTRY) */}
      {universeMode === 'aerospace_sim' && (
        <AerospaceFlightSimulator isLaymanMode={isLaymanMode} />
      )}

      {/* MODE 3: OBSERVATÓRIO NASA & COSMOLOGIA */}
      {universeMode === 'nasa_observatory' && (
        <NasaCosmologyObservatory isLaymanMode={isLaymanMode} />
      )}
    </div>
  );
}
