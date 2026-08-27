import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  Universe,
  TemporalEvent,
  Paradox,
  SimulationLog,
  AIButterflyResult,
  AIParadoxResolution,
  HistoricalResearch,
} from '../../types/temporal';
import { EventStatus, TravelerStatus, CausalRelation } from '../../types/temporal';
import { SimulationService } from '../../engine/SimulationService';
import { AITemporalService } from '../../engine/AITemporalService';

import SimulatorHeader from './SimulatorHeader';
import TimelineCanvas from './TimelineCanvas';
import LeftSidebar from './LeftSidebar';
import EventInspector from './EventInspector';
import ParadoxConsole from './ParadoxConsole';
import AIDrawer from './ai/AIDrawer';
import TemporalControls from './TemporalControls';
import ConferenceModeModal from '../presentation/ConferenceModeModal';
import Minkowski3DModal from '../visualization/Minkowski3DModal';
import {
  AddEventModal,
  AddTravelerModal,
  TimeTravelModal,
  AddDimensionModal,
} from './Modals';

interface Props {
  onExit: () => void;
  initialState?: { universe: Universe; logs: SimulationLog[] } | null;
}

const SIMULATION_STORAGE_KEY = 'infinite-horizons:simulation';

export default function SimulatorView({ onExit, initialState }: Props) {
  const [universeState, setUniverseState] = useState(() => {
    if (initialState) return initialState;
    const savedSimulation = localStorage.getItem(SIMULATION_STORAGE_KEY);
    if (!savedSimulation) return SimulationService.createDefaultUniverse();

    try {
      return JSON.parse(savedSimulation) as ReturnType<typeof SimulationService.createDefaultUniverse>;
    } catch {
      localStorage.removeItem(SIMULATION_STORAGE_KEY);
      return SimulationService.createDefaultUniverse();
    }
  });
  const [activeDimensionId, setActiveDimensionId] = useState(() => initialState?.universe.dimensions[0]?.id || 'dim-omega-01');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [highlightChain, setHighlightChain] = useState<string[]>([]);
  const [timelineYear, setTimelineYear] = useState(2025);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [history, setHistory] = useState<Array<{ universe: Universe; logs: SimulationLog[] }>>([]);
  const [future, setFuture] = useState<Array<{ universe: Universe; logs: SimulationLog[] }>>([]);
  const lastSnapshotRef = useRef(JSON.stringify(universeState));
  const historyNavigationRef = useRef(false);

  // AI Drawer & Last Result State
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [lastAIResult, setLastAIResult] = useState<AIButterflyResult | null>(null);

  // New Academic Presentation & 3D Visualization States
  const [showConferenceMode, setShowConferenceMode] = useState(false);
  const [showMinkowski3D, setShowMinkowski3D] = useState(false);

  // Modals state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddTraveler, setShowAddTraveler] = useState(false);
  const [showTimeTravel, setShowTimeTravel] = useState(false);
  const [showAddDimension, setShowAddDimension] = useState(false);

  const universe = universeState.universe;
  const logs = universeState.logs;

  useEffect(() => {
    localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(universeState));
    const snapshot = JSON.stringify(universeState);
    if (snapshot === lastSnapshotRef.current) return;
    if (!historyNavigationRef.current) {
      const previous = JSON.parse(lastSnapshotRef.current) as { universe: Universe; logs: SimulationLog[] };
      setHistory(current => [...current.slice(-29), previous]);
      setFuture([]);
    }
    historyNavigationRef.current = false;
    lastSnapshotRef.current = snapshot;
  }, [universeState]);

  const handleUndo = useCallback(() => {
    const previous = history[history.length - 1];
    if (!previous) return;
    historyNavigationRef.current = true;
    setHistory(current => current.slice(0, -1));
    setFuture(current => [...current, universeState]);
    setUniverseState(previous);
  }, [history, universeState]);

  const handleRedo = useCallback(() => {
    const next = future[future.length - 1];
    if (!next) return;
    historyNavigationRef.current = true;
    setFuture(current => current.slice(0, -1));
    setHistory(current => [...current, universeState]);
    setUniverseState(next);
  }, [future, universeState]);

  const handleExport = useCallback((format: 'json' | 'csv') => {
    const events = universe.dimensions.flatMap(dimension => dimension.events);
    const content = format === 'json'
      ? JSON.stringify(universeState, null, 2)
      : [
          'id,titulo,ano,categoria,status,importancia,confianca,fonte',
          ...events.map(event => [event.id, event.title, event.year, event.category, event.status, event.importance, event.evidenceConfidence || '', event.sourceUrl || '']
            .map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')),
        ].join('\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${universe.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.${format}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [universe, universeState]);

  const addLog = useCallback((message: string, type: 'info' | 'warning' | 'error' | 'success') => {
    const newLog: SimulationLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setUniverseState(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs],
    }));
  }, []);

  const activeDimensionEvents = universe.dimensions.flatMap(d => d.events);
  const visibleEventCount = activeDimensionEvents.filter(event => event.year <= timelineYear).length;
  const selectedEvent = activeDimensionEvents.find(e => e.id === selectedEventId) || null;

  // Handlers
  const handleAlterEvent = useCallback(
    (eventId: string, newStatus: EventStatus) => {
      const { updatedUniverse, affectedCount } = SimulationService.alterEvent(universe, eventId, newStatus);
      setUniverseState(prev => ({ ...prev, universe: updatedUniverse }));

      const targetEv = activeDimensionEvents.find(e => e.id === eventId);
      const title = targetEv ? targetEv.title : eventId;

      if (newStatus === EventStatus.ERASED) {
        addLog(`Evento "${title}" foi removido da linha temporal. (${affectedCount} dependentes afetados).`, 'warning');
      } else if (newStatus === EventStatus.ALTERED) {
        addLog(`Evento "${title}" foi modificado causalmente. Propagação executada.`, 'warning');
      } else {
        addLog(`Estado do evento "${title}" restaurado para ESTÁVEL.`, 'success');
      }
    },
    [universe, activeDimensionEvents, addLog]
  );

  const handleSimulateAI = useCallback(
    async (targetEv: TemporalEvent) => {
      addLog(`Processando Efeito Borboleta com IA para "${targetEv.title}"...`, 'info');
      const { result, updatedUniverse } = await AITemporalService.simulateUnexpectedButterflyEffect(universe, targetEv);
      setUniverseState(prev => ({ ...prev, universe: updatedUniverse }));
      setLastAIResult(result);
      setShowAIDrawer(true);

      addLog(
        `IA GEROU RESULTADO INESPERADO (Impacto ${result.impactScore}%): ${result.unexpectedEffects[0]}`,
        'warning'
      );
    },
    [universe, addLog]
  );

  const handleApplyAIResolution = useCallback(
    (resolution: AIParadoxResolution) => {
      if (resolution.actionType === 'restore_origin' && resolution.targetEventId) {
        const { updatedUniverse } = SimulationService.alterEvent(universe, resolution.targetEventId, EventStatus.STABLE);
        setUniverseState(prev => ({ ...prev, universe: updatedUniverse }));
        addLog(`INTERVENÇÃO IA: Evento de origem restaurado para ESTÁVEL. Paradoxo solucionado!`, 'success');
      } else if (resolution.actionType === 'create_branch') {
        const newDim = {
          id: `dim-ai-branch-${Date.now()}`,
          universeId: universe.id,
          name: 'Ramificação de Emergência IA',
          designation: 'Ω-03',
          color: '#ec4899',
          events: [],
          integrity: 100,
        };
        universe.dimensions.push(newDim);
        SimulationService.updateSimulation(universe);
        setUniverseState(prev => ({ ...prev, universe: { ...universe } }));
        addLog(`INTERVENÇÃO IA: Linha isolada em nova dimensão "Ω-03 — Ramificação de Emergência IA".`, 'success');
      } else if (resolution.actionType === 'anchor_event' && resolution.targetEventId) {
        const targetEv = activeDimensionEvents.find(e => e.id === resolution.targetEventId);
        if (targetEv) {
          targetEv.status = EventStatus.STABLE;
          targetEv.isAnchor = true;
          SimulationService.updateSimulation(universe);
          setUniverseState(prev => ({ ...prev, universe: { ...universe } }));
          addLog(`INTERVENÇÃO IA: Causalidade alternativa ancorada. Paradoxo resolvido!`, 'success');
        }
      }
    },
    [universe, activeDimensionEvents, addLog]
  );

  const handleInvestigateParadox = useCallback((paradox: Paradox) => {
    setHighlightChain(paradox.causalChain || []);
    if (paradox.eventId) {
      setSelectedEventId(paradox.eventId);
    }
  }, []);

  const handleReset = useCallback(() => {
    const defaultData = SimulationService.createDefaultUniverse();
    localStorage.removeItem(SIMULATION_STORAGE_KEY);
    setUniverseState(defaultData);
    setSelectedEventId(null);
    setHighlightChain([]);
    setLastAIResult(null);
    setTimelineYear(2025);
    setIsTimelinePlaying(false);
  }, []);

  const handleAddEvent = useCallback(
    (data: { title: string; description: string; sourceUrl?: string; year: number; dimensionId: string; category: string; importance: number; causeIds: string[] }) => {
      const newEventId = `evt-${Date.now()}`;
      const newEvent: TemporalEvent = {
        id: newEventId,
        dimensionId: data.dimensionId,
        title: data.title,
        description: data.description,
        sourceUrl: data.sourceUrl,
        year: data.year,
        category: data.category,
        importance: data.importance,
        position: { x: Math.min(800, Math.max(100, (data.year - 1950) * 5)), y: 150 + Math.random() * 100 },
        status: EventStatus.STABLE,
        parents: data.causeIds,
        children: [],
        causes: data.causeIds,
        consequences: [],
      };

      const updatedDimensions = universe.dimensions.map(dim => {
        if (dim.id === data.dimensionId) {
          return { ...dim, events: [...dim.events, newEvent] };
        }
        return dim;
      });

      const newEdges = [...universe.edges];
      for (const causeId of data.causeIds) {
        newEdges.push({
          id: `edg-${Date.now()}-${causeId}`,
          source: causeId,
          target: newEventId,
          type: CausalRelation.CAUSES,
          active: true,
        });

        for (const dim of updatedDimensions) {
          const parentEv = dim.events.find(e => e.id === causeId);
          if (parentEv) {
            parentEv.children.push(newEventId);
            parentEv.consequences.push(newEventId);
          }
        }
      }

      const updatedUniv: Universe = {
        ...universe,
        dimensions: updatedDimensions,
        edges: newEdges,
      };

      SimulationService.updateSimulation(updatedUniv);
      setUniverseState(prev => ({ ...prev, universe: updatedUniv }));
      addLog(`Novo evento criado: "${data.title}" (Ano ${data.year}).`, 'info');
    },
    [universe, addLog]
  );

  const handleResearchHistoricalEvent = useCallback(async (query: string): Promise<HistoricalResearch> => {
    const result = await AITemporalService.researchHistoricalEvent(query);
    addLog(`Pesquisa histórica concluída: "${result.title}" (${result.year}).`, 'success');
    return result;
  }, [addLog]);

  const handleAddTraveler = useCallback(
    (data: { name: string; originDimensionId: string; originYear: number; originEventId?: string }) => {
      const newTraveler = {
        id: `trv-${Date.now()}`,
        name: data.name,
        originDimensionId: data.originDimensionId,
        originYear: data.originYear,
        currentDimensionId: data.originDimensionId,
        currentYear: data.originYear,
        originEventId: data.originEventId,
        status: TravelerStatus.NORMAL,
        travelHistory: [],
      };

      const updatedUniv = {
        ...universe,
        travelers: [...universe.travelers, newTraveler],
      };

      SimulationService.updateSimulation(updatedUniv);
      setUniverseState(prev => ({ ...prev, universe: updatedUniv }));
      addLog(`Referencial de observação "${data.name}" registrado na coordenada de referência (${data.originYear}).`, 'info');
    },
    [universe, addLog]
  );

  const handleExecuteTravel = useCallback(
    (data: { travelerId: string; destinationYear: number; alterTargetEventId?: string }) => {
      const traveler = universe.travelers.find(t => t.id === data.travelerId);
      if (!traveler) return;

      traveler.currentYear = data.destinationYear;

      addLog(
        `Referencial ${traveler.name} recalibrado para a coordenada ${data.destinationYear}.`,
        'warning'
      );

      if (data.alterTargetEventId) {
        const targetEv = activeDimensionEvents.find(e => e.id === data.alterTargetEventId);
        if (targetEv) {
          if (AITemporalService.getConfig().autoButterflyEnabled) {
            handleSimulateAI(targetEv);
          } else {
            handleAlterEvent(data.alterTargetEventId, EventStatus.ERASED);
          }
        }
      } else {
        SimulationService.updateSimulation(universe);
        setUniverseState(prev => ({ ...prev, universe: { ...universe } }));
      }
    },
    [universe, activeDimensionEvents, handleSimulateAI, handleAlterEvent, addLog]
  );

  const handleAddDimension = useCallback(
    (data: { name: string; designation: string; color: string }) => {
      const newDim = {
        id: `dim-${Date.now()}`,
        universeId: universe.id,
        name: data.name,
        designation: data.designation,
        color: data.color,
        events: [],
        integrity: 100,
      };

      const updatedUniv = {
        ...universe,
        dimensions: [...universe.dimensions, newDim],
      };

      setUniverseState(prev => ({ ...prev, universe: updatedUniv }));
      addLog(`Nova dimensão paralela "${data.designation} — ${data.name}" criada.`, 'success');
    },
    [universe, addLog]
  );

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
        onToggleAIDrawer={() => setShowAIDrawer(prev => !prev)}
        onReset={handleReset}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={handleExport}
      />

      {/* Main Workspace Body */}
      <div className="sim-body">
        {/* Left Roster Sidebar */}
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
          <AIDrawer
            universe={universe}
            lastAIResult={lastAIResult}
            onClose={() => setShowAIDrawer(false)}
            onApplyResolution={handleApplyAIResolution}
          />
        )}
      </div>

      <TemporalControls
        year={timelineYear}
        minYear={1900}
        maxYear={2060}
        eventCount={activeDimensionEvents.length}
        visibleEventCount={visibleEventCount}
        isPlaying={isTimelinePlaying}
        onYearChange={setTimelineYear}
        onTogglePlay={() => setIsTimelinePlaying(prev => !prev)}
        onReset={() => {
          setTimelineYear(2025);
          setIsTimelinePlaying(false);
        }}
      />

      {/* Bottom Console Panel */}
      <ParadoxConsole
        paradoxes={universe.paradoxes}
        logs={logs}
        onInvestigateParadox={handleInvestigateParadox}
      />

      {/* Modals */}
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
        <ConferenceModeModal
          universe={universe}
          onClose={() => setShowConferenceMode(false)}
        />
      )}

      {/* Minkowski 3D & Calabi-Yau Visualization Modal */}
      {showMinkowski3D && (
        <Minkowski3DModal
          universe={universe}
          onClose={() => setShowMinkowski3D(false)}
        />
      )}
    </div>
  );
}
