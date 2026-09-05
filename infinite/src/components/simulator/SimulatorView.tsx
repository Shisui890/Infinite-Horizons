import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import type {
  Universe,
  TemporalEvent,
  Paradox,
  SimulationLog,
  AIButterflyResult,
  AIParadoxResolution,
  HistoricalResearch,
} from '../../types/temporal';
import { EventStatus } from '../../types/temporal';
import { SimulationService } from '../../engine/SimulationService';
import { AITemporalService } from '../../engine/AITemporalService';
import { useSimulationStore } from '../../store/useSimulationStore';

import SimulatorHeader from './SimulatorHeader';
import TimelineCanvas from './TimelineCanvas';
import LeftSidebar from './LeftSidebar';
import EventInspector from './EventInspector';
import ParadoxConsole from './ParadoxConsole';
import TimeScrubber from './TimeScrubber';
import ReplayControls from './ReplayControls';
import { exportToBibTeX } from '../../utils/exportAcademic';
import {
  AddEventModal,
  AddTravelerModal,
  TimeTravelModal,
  AddDimensionModal,
} from './Modals';
import { CosmicAudio } from '../../engine/CosmicAudioEngine';
import { ScientificReportEngine } from '../../engine/ScientificReportEngine';
import { useLaymanMode } from '../../context/LaymanModeContext';

// Lazy-loaded Heavy Modals & Drawers (Code Splitting)
const ConferenceModeModal = lazy(() => import('../presentation/ConferenceModeModal'));
const Minkowski3DModal = lazy(() => import('../visualization/Minkowski3DModal'));
const MonteCarloModal = lazy(() => import('./MonteCarloModal'));
const AIDrawer = lazy(() => import('./ai/AIDrawer'));
const PreflightPreviewModal = lazy(() => import('./PreflightPreviewModal'));
const DimensionComparatorModal = lazy(() => import('./DimensionComparatorModal'));
const KeyboardShortcutsModal = lazy(() => import('./KeyboardShortcutsModal'));
const InteractiveTourModal = lazy(() => import('./InteractiveTourModal'));

interface Props {
  onExit: () => void;
  onOpenGuide?: () => void;
  initialState?: { universe: Universe; logs: SimulationLog[] } | null;
}

export default function SimulatorView({ onExit, onOpenGuide, initialState }: Props) {
  const [mobileTab, setMobileTab] = useState<'canvas' | 'inspector' | 'dimensions' | 'console' | 'tools'>('canvas');
  const {
    universeState,
    setUniverseState,
    activeDimensionId,
    setActiveDimensionId,
    selectedEventId,
    setSelectedEventId,
    highlightChain,
    setHighlightChain,
    timelineYear,
    undo,
    redo,
    canUndo,
    canRedo,
    showConferenceMode,
    setShowConferenceMode,
    showMinkowski3D,
    setShowMinkowski3D,
    showMonteCarlo,
    setShowMonteCarlo,
    showAIDrawer,
    setShowAIDrawer,
    showAddEvent,
    setShowAddEvent,
    showAddTraveler,
    setShowAddTraveler,
    showTimeTravel,
    setShowTimeTravel,
    showAddDimension,
    setShowAddDimension,
    calculatePreflight,
    setPreflightImpact,
    resetUniverse,
  } = useSimulationStore();

  const { isLaymanMode, toggleLaymanMode } = useLaymanMode();
  const [showComparatorModal, setShowComparatorModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [shortcutToast, setShortcutToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setShortcutToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setShortcutToast(null), 1800);
  }, []);

  const handleCanvasSelectEvent = useCallback((id: string | null) => {
    setSelectedEventId(id);
    if (id && typeof window !== 'undefined' && window.innerWidth <= 860) {
      setMobileTab('inspector');
    }
  }, [setSelectedEventId]);

  const handleCloseInspector = useCallback(() => {
    setSelectedEventId(null);
    setMobileTab('canvas');
  }, [setSelectedEventId]);

  useEffect(() => {
    if (initialState) {
      setUniverseState(initialState);
      if (initialState.universe.dimensions[0]) {
        setActiveDimensionId(initialState.universe.dimensions[0].id);
      }
    }
  }, [initialState, setUniverseState, setActiveDimensionId]);

  const { universe, logs } = universeState;
  const [lastAIResult, setLastAIResult] = useState<AIButterflyResult | null>(null);

  // Full Keyboard Shortcuts Engine
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          if (canRedo()) redo();
        } else {
          if (canUndo()) undo();
        }
        return;
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (canRedo()) redo();
        return;
      }

      // Space: Play / Pause Timeline
      if (e.code === 'Space') {
        e.preventDefault();
        const store = useSimulationStore.getState();
        const next = !store.isTimelinePlaying;
        store.setIsTimelinePlaying(next);
        if (next) {
          CosmicAudio.playNodeSelect(75);
          triggerToast('Linha do Tempo em Reprodução');
        } else {
          CosmicAudio.playTemporalWarp(0.5);
          triggerToast('Linha do Tempo Pausada');
        }
        return;
      }

      // ArrowLeft: Step Year Backward
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 5;
        const store = useSimulationStore.getState();
        const ny = Math.max(1850, store.timelineYear - step);
        store.setTimelineYear(ny);
        CosmicAudio.playTemporalWarp(0.3);
        triggerToast(`Ano ${ny} AD (-${step}a)`);
        return;
      }

      // ArrowRight: Step Year Forward
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 5;
        const store = useSimulationStore.getState();
        const ny = Math.min(2200, store.timelineYear + step);
        store.setTimelineYear(ny);
        CosmicAudio.playTemporalWarp(0.7);
        triggerToast(`Ano ${ny} AD (+${step}a)`);
        return;
      }

      // Escape: Close all active modals/drawers
      if (e.code === 'Escape') {
        setShowShortcutsModal(false);
        setShowTourModal(false);
        setShowConferenceMode(false);
        setShowMinkowski3D(false);
        setShowMonteCarlo(false);
        setShowAIDrawer(false);
        setShowAddEvent(false);
        setShowAddTraveler(false);
        setShowTimeTravel(false);
        setShowAddDimension(false);
        setShowComparatorModal(false);
        setSelectedEventId(null);
        return;
      }

      // O: Toggle AI Oracle Drawer
      if (e.code === 'KeyO' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const next = !showAIDrawer;
        setShowAIDrawer(next);
        if (next) CosmicAudio.playOracleChime();
        triggerToast(next ? 'Oráculo IA Aberto' : 'Oráculo IA Fechado');
        return;
      }

      // C: Toggle Dimension Comparator
      if (e.code === 'KeyC' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShowComparatorModal(prev => !prev);
        CosmicAudio.playNodeSelect(85);
        return;
      }

      // M: Toggle Monte Carlo Simulation
      if (e.code === 'KeyM' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const store = useSimulationStore.getState();
        setShowMonteCarlo(!store.showMonteCarlo);
        CosmicAudio.playNodeSelect(80);
        return;
      }

      // L: Toggle Layman / Academic Mode
      if (e.code === 'KeyL' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleLaymanMode();
        CosmicAudio.playNodeSelect(60);
        triggerToast(isLaymanMode ? 'Modo Rigoroso Ativado' : 'Modo Didático Ativado');
        return;
      }

      // H: Toggle Heatmap
      if (e.code === 'KeyH' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const heatBtn = document.querySelector('.btn-canvas-hud') as HTMLButtonElement | null;
        if (heatBtn) heatBtn.click();
        triggerToast('Mapa de Calor Alternado');
        return;
      }

      // ?: Open Keyboard Shortcuts Cheatsheet
      if (e.key === '?' || (e.shiftKey && e.code === 'Slash')) {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
        CosmicAudio.playNodeSelect(90);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    canUndo,
    canRedo,
    undo,
    redo,
    showAIDrawer,
    setShowAIDrawer,
    setShowConferenceMode,
    setShowMinkowski3D,
    setShowMonteCarlo,
    setShowAddEvent,
    setShowAddTraveler,
    setShowTimeTravel,
    setShowAddDimension,
    setSelectedEventId,
    toggleLaymanMode,
    isLaymanMode,
    triggerToast,
  ]);

  const handleExport = useCallback((format: 'json' | 'csv' | 'latex' | 'bibtex' | 'png' | 'pdf') => {
    if (format === 'pdf') {
      ScientificReportEngine.openPrintableReport(universe);
      triggerToast('Relatório PDF aberto para impressão');
      return;
    }

    if (format === 'png') {
      const canvas = document.querySelector('.sim-canvas') as HTMLCanvasElement;
      if (canvas) {
        const link = document.createElement('a');
        link.download = `infinite_horizons_${universe.id}_4k.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      return;
    }

    if (format === 'latex') {
      const latexCode = ScientificReportEngine.generateLaTeX(universe);
      const blob = new Blob([latexCode], { type: 'application/x-latex;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `artigo_cientifico_${universe.id}.tex`;
      link.click();
      URL.revokeObjectURL(url);
      triggerToast('Artigo LaTeX exportado (.tex)');
      return;
    }

    let content = '';
    let mimeType = 'text/plain';
    let fileExtension = 'txt';

    if (format === 'json') {
      content = JSON.stringify(universeState, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else if (format === 'csv') {
      const allEvents = universe.dimensions.flatMap(d => d.events);
      content = [
        'id,title,year,category,importance,status,dimension',
        ...allEvents.map(
          e => `"${e.id}","${e.title}",${e.year},"${e.category}",${e.importance},"${e.status}","${e.dimensionId}"`
        ),
      ].join('\n');
      mimeType = 'text/csv';
      fileExtension = 'csv';
    } else if (format === 'bibtex') {
      content = exportToBibTeX(universe);
      mimeType = 'text/plain';
      fileExtension = 'bib';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `infinite_horizons_${universe.id}_${Date.now()}.${fileExtension}`;
    link.click();
    URL.revokeObjectURL(url);
  }, [universe, universeState, triggerToast]);

  const activeDimension =
    universe.dimensions.find(dimension => dimension.id === activeDimensionId) ||
    universe.dimensions[0] || {
      id: 'dim-omega-01',
      universeId: universe.id,
      name: 'Continuum Principal',
      designation: 'Ω-01',
      color: '#00d4ff',
      events: [],
      integrity: 100,
    };

  const activeDimensionEvents = activeDimension.events;
  const selectedEvent = activeDimensionEvents.find(event => event.id === selectedEventId) || null;

  const addLog = useCallback((message: string, type: SimulationLog['type'] = 'info') => {
    const newLog: SimulationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      message,
      type,
    };
    setUniverseState(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs.slice(0, 49)],
    }));
  }, [setUniverseState]);

  const handleAlterEvent = useCallback((eventId: string, newStatus: EventStatus) => {
    if (newStatus === EventStatus.ERASED) {
      const impact = calculatePreflight(eventId, 'erase');
      setPreflightImpact(impact);
      return;
    }

    const { updatedUniverse } = SimulationService.alterEvent(universe, eventId, newStatus);
    setUniverseState(prev => ({ ...prev, universe: updatedUniverse }));
    addLog(`Intervenção no evento ${eventId}: Estado alterado para ${newStatus.toUpperCase()}`, 'warning');
  }, [universe, calculatePreflight, setPreflightImpact, setUniverseState, addLog]);

  const handleInvestigateParadox = useCallback((paradox: Paradox) => {
    setHighlightChain(paradox.causalChain || []);
    if (paradox.eventId) setSelectedEventId(paradox.eventId);
    addLog(`Investigação de paradoxo iniciada: ${paradox.title}`, 'warning');
  }, [setHighlightChain, setSelectedEventId, addLog]);

  const handleSimulateAI = useCallback(async (event: TemporalEvent) => {
    setShowAIDrawer(true);
    addLog(`Simulação com IA requisitada para "${event.title}"...`, 'info');
    try {
      const { result, updatedUniverse } = await AITemporalService.simulateUnexpectedButterflyEffect(universe, event);
      setLastAIResult(result);
      setUniverseState(prev => ({ ...prev, universe: updatedUniverse }));
      addLog(`Efeito Borboleta calculado com impacto de ${result.impactScore}%.`, 'success');
    } catch {
      addLog('Falha ao calcular Efeito Borboleta pela IA.', 'error');
    }
  }, [universe, setShowAIDrawer, setUniverseState, addLog]);

  const handleApplyAIResolution = useCallback((resolution: AIParadoxResolution) => {
    addLog(`Resolução de IA aplicada: ${resolution.title}`, 'success');
  }, [addLog]);

  const handleResearchHistoricalEvent = useCallback(async (query: string): Promise<HistoricalResearch> => {
    addLog(`Pesquisando fontes primárias para "${query}"...`, 'info');
    try {
      const data = await AITemporalService.researchHistoricalEvent(query);
      addLog(`Descoberta localizada: "${data.title}" (${data.year}) via ${data.source}`, 'success');
      return data;
    } catch {
      addLog(`Pesquisa offline utilizada para "${query}".`, 'warning');
      return {
        title: query,
        description: 'Registro histórico deduzido via modelo Lorentziano.',
        year: 1950,
        category: 'CIENTÍFICO',
        importance: 80,
        source: 'Arquivo Científico Local',
      };
    }
  }, [addLog]);

  const handleAddEvent = useCallback((eventData: {
    title: string;
    description: string;
    sourceUrl?: string;
    year: number;
    dimensionId: string;
    category: string;
    importance: number;
    causeIds: string[];
  }) => {
    const dimId = eventData.dimensionId || activeDimensionId;
    useSimulationStore.getState().addEvent(dimId, {
      ...eventData,
      parents: eventData.causeIds,
      causes: eventData.causeIds,
    });
    addLog(`Novo evento incorporado: "${eventData.title}" (${eventData.year})`, 'success');
  }, [activeDimensionId, addLog]);

  const handleAddTraveler = useCallback((travelerData: {
    name: string;
    originDimensionId: string;
    originYear: number;
    originEventId?: string;
  }) => {
    useSimulationStore.getState().addTraveler(travelerData);
    addLog(`Novo observador registrado: "${travelerData.name}"`, 'success');
  }, [addLog]);

  const handleExecuteTravel = useCallback((data: {
    travelerId: string;
    destinationYear: number;
    alterTargetEventId?: string;
  }) => {
    useSimulationStore.getState().timeTravel(data.travelerId, activeDimensionId, data.destinationYear, 'Salto Relativístico');
    addLog(`Salto de geodésica executado para o ano ${data.destinationYear}.`, 'warning');
  }, [activeDimensionId, addLog]);

  const handleAddDimension = useCallback((data: { name: string; designation: string; color: string }) => {
    useSimulationStore.getState().addDimension(data.name, data.designation, data.color);
    addLog(`Nova variedade dimensional acoplada: "${data.designation} — ${data.name}"`, 'success');
  }, [addLog]);

  return (
    <div className={`simulator-root mobile-tab-active-${mobileTab}`}>
      {/* Top Header Controls */}
      <SimulatorHeader
        universe={universe}
        onExit={onExit}
        onOpenAddEvent={() => setShowAddEvent(true)}
        onOpenAddTraveler={() => setShowAddTraveler(true)}
        onOpenTimeTravel={() => setShowTimeTravel(true)}
        onOpenConferenceMode={() => setShowConferenceMode(true)}
        onOpenMinkowski3D={() => setShowMinkowski3D(true)}
        onOpenMonteCarlo={() => setShowMonteCarlo(true)}
        onToggleAIDrawer={() => setShowAIDrawer(!showAIDrawer)}
        onOpenComparator={() => setShowComparatorModal(true)}
        onOpenGuide={onOpenGuide}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        onStartTour={() => setShowTourModal(true)}
        onReset={resetUniverse}
        canUndo={canUndo()}
        canRedo={canRedo()}
        onUndo={undo}
        onRedo={redo}
        onExport={handleExport}
      />

      {/* Main Simulation Viewport Grid */}
      <div className="sim-body">
        {/* Left Dimension Selector Sidebar */}
        <LeftSidebar
          dimensions={universe.dimensions}
          activeDimensionId={activeDimensionId}
          travelers={universe.travelers}
          onSelectDimension={setActiveDimensionId}
          onOpenAddDimension={() => setShowAddDimension(true)}
        />

        {/* Central Graph Timeline Canvas */}
        <TimelineCanvas
          events={activeDimensionEvents}
          edges={universe.edges}
          selectedEventId={selectedEventId}
          highlightChain={highlightChain}
          visibleUntilYear={timelineYear}
          onSelectEvent={handleCanvasSelectEvent}
        />

        {/* Right Event Inspector Sidebar */}
        <EventInspector
          event={selectedEvent}
          events={activeDimensionEvents}
          onAlterEvent={handleAlterEvent}
          onSimulateAI={handleSimulateAI}
          onClose={handleCloseInspector}
        />

        {/* AI Control Drawer */}
        {showAIDrawer && (
          <Suspense fallback={<div className="drawer-loading-fallback">Carregando Oráculo IA...</div>}>
            <AIDrawer
              universe={universe}
              lastAIResult={lastAIResult}
              onClose={() => setShowAIDrawer(false)}
              onApplyResolution={handleApplyAIResolution}
            />
          </Suspense>
        )}
      </div>

      {/* Interactive Global Time Scrubber */}
      <TimeScrubber />

      {/* Bottom Console Panel */}
      <ParadoxConsole
        paradoxes={universe.paradoxes}
        logs={logs}
        onInvestigateParadox={handleInvestigateParadox}
      />

      {/* Replay Controls HUD */}
      <ReplayControls />

      {/* Modals with Lazy Loading */}
      {showAddEvent && (
        <AddEventModal
          dimensions={universe.dimensions}
          events={activeDimensionEvents}
          onClose={() => setShowAddEvent(false)}
          onAddEvent={handleAddEvent}
          onResearchHistoricalEvent={handleResearchHistoricalEvent}
        />
      )}

      {showAddTraveler && (
        <AddTravelerModal
          dimensions={universe.dimensions}
          events={activeDimensionEvents}
          onClose={() => setShowAddTraveler(false)}
          onAddTraveler={handleAddTraveler}
        />
      )}

      {showTimeTravel && (
        <TimeTravelModal
          travelers={universe.travelers}
          events={activeDimensionEvents}
          onClose={() => setShowTimeTravel(false)}
          onExecuteTravel={handleExecuteTravel}
        />
      )}

      {showAddDimension && (
        <AddDimensionModal
          onClose={() => setShowAddDimension(false)}
          onAddDimension={handleAddDimension}
        />
      )}

      {/* Academic Presentation Modal */}
      {showConferenceMode && (
        <Suspense fallback={null}>
          <ConferenceModeModal
            universe={universe}
            onClose={() => setShowConferenceMode(false)}
          />
        </Suspense>
      )}

      {/* Minkowski 3D & Calabi-Yau Visualization Modal */}
      {showMinkowski3D && (
        <Suspense fallback={null}>
          <Minkowski3DModal
            universe={universe}
            onClose={() => setShowMinkowski3D(false)}
          />
        </Suspense>
      )}

      {/* Stochastic Monte Carlo Simulation Modal */}
      {showMonteCarlo && (
        <Suspense fallback={null}>
          <MonteCarloModal
            universe={universe}
            onClose={() => setShowMonteCarlo(false)}
          />
        </Suspense>
      )}

      {/* Preflight Preview Modal */}
      <Suspense fallback={null}>
        <PreflightPreviewModal />
      </Suspense>

      {/* Dimension Split-View Comparator Modal */}
      {showComparatorModal && (
        <Suspense fallback={null}>
          <DimensionComparatorModal
            universe={universe}
            onClose={() => setShowComparatorModal(false)}
            onMergeDimensions={newDim => {
              setUniverseState(prev => ({
                ...prev,
                universe: {
                  ...prev.universe,
                  dimensions: [...prev.universe.dimensions, newDim],
                },
                logs: [
                  {
                    id: `log-fused-${Date.now()}`,
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Fusão dimensional concluída: "${newDim.designation} — ${newDim.name}".`,
                    type: 'success',
                  },
                  ...prev.logs,
                ],
              }));
              setActiveDimensionId(newDim.id);
            }}
          />
        </Suspense>
      )}

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      {showShortcutsModal && (
        <Suspense fallback={null}>
          <KeyboardShortcutsModal
            isOpen={showShortcutsModal}
            onClose={() => setShowShortcutsModal(false)}
          />
        </Suspense>
      )}

      {/* Interactive Guided Tour Modal */}
      {showTourModal && (
        <Suspense fallback={null}>
          <InteractiveTourModal
            isOpen={showTourModal}
            onClose={() => setShowTourModal(false)}
            onOpenShortcuts={() => setShowShortcutsModal(true)}
          />
        </Suspense>
      )}

      {/* HUD Toast for Keyboard Actions */}
      {shortcutToast && (
        <div className="shortcut-toast-pill" role="status" aria-live="polite">
          <span className="toast-dot" />
          <span>{shortcutToast}</span>
        </div>
      )}

      {/* Mobile Dedicated Tools Grid Panel (when mobileTab === 'tools') */}
      {mobileTab === 'tools' && (
        <div className="sim-mobile-tools-overlay">
          <div className="sim-mobile-tools-content">
            <div className="mobile-tools-header">
              <span className="tools-title">PAINEL DE FERRAMENTAS & AÇÕES</span>
              <button
                type="button"
                className="btn-tools-close"
                onClick={() => setMobileTab('canvas')}
              >
                Fechar
              </button>
            </div>

            <div className="mobile-tools-grid">
              <button
                type="button"
                className="m-tool-card"
                onClick={() => {
                  setShowAddEvent(true);
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
                <span className="m-tool-name">Novo Evento</span>
                <span className="m-tool-sub">Inserir marco na geodésica</span>
              </button>

              <button
                type="button"
                className="m-tool-card"
                onClick={() => {
                  setShowAddTraveler(true);
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <span className="m-tool-name">Novo Viajante</span>
                <span className="m-tool-sub">Registrar observador</span>
              </button>

              <button
                type="button"
                className="m-tool-card highlight-tool"
                onClick={() => {
                  setShowTimeTravel(true);
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <span className="m-tool-name">Mudar Passado</span>
                <span className="m-tool-sub">Salto relativístico</span>
              </button>

              <button
                type="button"
                className="m-tool-card"
                onClick={() => {
                  setShowAIDrawer(true);
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" />
                    <line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" />
                    <line x1="15" y1="20" x2="15" y2="23" />
                  </svg>
                </span>
                <span className="m-tool-name">Oráculo IA</span>
                <span className="m-tool-sub">Resolução & hipóteses</span>
              </button>

              <button
                type="button"
                className="m-tool-card"
                onClick={() => {
                  setShowMinkowski3D(true);
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </span>
                <span className="m-tool-name">Cones 3D</span>
                <span className="m-tool-sub">Espaço-tempo tridimensional</span>
              </button>

              <button
                type="button"
                className="m-tool-card"
                onClick={() => {
                  setShowMonteCarlo(true);
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 8h.01" />
                    <path d="M8 8h.01" />
                    <path d="M8 16h.01" />
                    <path d="M16 16h.01" />
                    <path d="M12 12h.01" />
                  </svg>
                </span>
                <span className="m-tool-name">Monte Carlo</span>
                <span className="m-tool-sub">1.000 iterações estocásticas</span>
              </button>

              <button
                type="button"
                className="m-tool-card"
                onClick={() => {
                  setShowConferenceMode(true);
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <span className="m-tool-name">Apresentação</span>
                <span className="m-tool-sub">Modo palestra com slides</span>
              </button>

              <button
                type="button"
                className="m-tool-card"
                onClick={() => {
                  setShowComparatorModal(true);
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                  </svg>
                </span>
                <span className="m-tool-name">Comparar Dimensões</span>
                <span className="m-tool-sub">Fusão e divergência</span>
              </button>

              {onOpenGuide && (
                <button
                  type="button"
                  className="m-tool-card"
                  onClick={() => {
                    setMobileTab('canvas');
                    onOpenGuide();
                  }}
                >
                  <span className="m-tool-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </span>
                  <span className="m-tool-name">Manual & Guia</span>
                  <span className="m-tool-sub">Como funciona o simulador</span>
                </button>
              )}

              <button
                type="button"
                className="m-tool-card"
                onClick={() => {
                  setShowShortcutsModal(true);
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <line x1="6" y1="8" x2="6" y2="8" />
                    <line x1="10" y1="8" x2="10" y2="8" />
                    <line x1="14" y1="8" x2="14" y2="8" />
                    <line x1="18" y1="8" x2="18" y2="8" />
                    <line x1="6" y1="12" x2="6" y2="12" />
                    <line x1="10" y1="12" x2="10" y2="12" />
                    <line x1="14" y1="12" x2="14" y2="12" />
                    <line x1="18" y1="12" x2="18" y2="12" />
                    <line x1="7" y1="16" x2="17" y2="16" />
                  </svg>
                </span>
                <span className="m-tool-name">Atalhos de Teclado</span>
                <span className="m-tool-sub">Comandos rápidos</span>
              </button>

              <button
                type="button"
                className="m-tool-card"
                onClick={() => {
                  resetUniverse();
                  setMobileTab('canvas');
                }}
              >
                <span className="m-tool-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                </span>
                <span className="m-tool-name">Resetar Modelo</span>
                <span className="m-tool-sub">Restaurar linha padrão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Visible only on screens <= 860px) */}
      <nav className="sim-mobile-tab-bar" aria-label="Navegação do simulador em dispositivos móveis">
        <button
          type="button"
          className={`sim-mobile-tab-btn ${mobileTab === 'canvas' ? 'active' : ''}`}
          onClick={() => setMobileTab('canvas')}
        >
          <span className="tab-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="6" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
          </span>
          <span className="tab-label">Linha</span>
        </button>

        <button
          type="button"
          className={`sim-mobile-tab-btn ${mobileTab === 'inspector' ? 'active' : ''}`}
          onClick={() => setMobileTab('inspector')}
        >
          <span className="tab-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="22" y1="12" x2="18" y2="12" />
              <line x1="6" y1="12" x2="2" y2="12" />
              <line x1="12" y1="6" x2="12" y2="2" />
              <line x1="12" y1="22" x2="12" y2="18" />
            </svg>
          </span>
          <span className="tab-label">Inspetor</span>
          {selectedEventId && <span className="tab-badge-dot" />}
        </button>

        <button
          type="button"
          className={`sim-mobile-tab-btn ${mobileTab === 'dimensions' ? 'active' : ''}`}
          onClick={() => setMobileTab('dimensions')}
        >
          <span className="tab-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </span>
          <span className="tab-label">Dimensões</span>
        </button>

        <button
          type="button"
          className={`sim-mobile-tab-btn ${mobileTab === 'console' ? 'active' : ''}`}
          onClick={() => setMobileTab('console')}
        >
          <span className="tab-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          <span className="tab-label">Alertas</span>
          {universe.paradoxes.length > 0 && (
            <span className="tab-badge-count">{universe.paradoxes.length}</span>
          )}
        </button>

        <button
          type="button"
          className={`sim-mobile-tab-btn ${mobileTab === 'tools' ? 'active' : ''}`}
          onClick={() => setMobileTab('tools')}
        >
          <span className="tab-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </span>
          <span className="tab-label">Ações</span>
        </button>
      </nav>
    </div>
  );
}

