import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
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
import { exportToLaTeX, exportToBibTeX } from '../../utils/exportAcademic';
import {
  AddEventModal,
  AddTravelerModal,
  TimeTravelModal,
  AddDimensionModal,
} from './Modals';

// Lazy-loaded Heavy Modals & Drawers (Code Splitting)
const ConferenceModeModal = lazy(() => import('../presentation/ConferenceModeModal'));
const Minkowski3DModal = lazy(() => import('../visualization/Minkowski3DModal'));
const MonteCarloModal = lazy(() => import('./MonteCarloModal'));
const AIDrawer = lazy(() => import('./ai/AIDrawer'));
const PreflightPreviewModal = lazy(() => import('./PreflightPreviewModal'));
const DimensionComparatorModal = lazy(() => import('./DimensionComparatorModal'));

interface Props {
  onExit: () => void;
  onOpenGuide?: () => void;
  initialState?: { universe: Universe; logs: SimulationLog[] } | null;
}

export default function SimulatorView({ onExit, onOpenGuide, initialState }: Props) {
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

  const [showComparatorModal, setShowComparatorModal] = useState(false);

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

  // Keyboard Shortcuts (Ctrl+Z: Undo, Ctrl+Shift+Z/Ctrl+Y: Redo)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          if (canRedo()) redo();
        } else {
          if (canUndo()) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        if (canRedo()) redo();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  const handleExport = useCallback((format: 'json' | 'csv' | 'latex' | 'bibtex' | 'png') => {
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
    } else if (format === 'latex') {
      content = exportToLaTeX(universe);
      mimeType = 'application/x-latex';
      fileExtension = 'tex';
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
  }, [universe, universeState]);

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
    <div className="simulator-root">
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
          onSelectEvent={setSelectedEventId}
        />

        {/* Right Event Inspector Sidebar */}
        <EventInspector
          event={selectedEvent}
          events={activeDimensionEvents}
          onAlterEvent={handleAlterEvent}
          onSimulateAI={handleSimulateAI}
          onClose={() => setSelectedEventId(null)}
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
    </div>
  );
}

