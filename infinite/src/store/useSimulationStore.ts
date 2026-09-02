import { create } from 'zustand';
import type {
  Universe,
  TemporalEvent,
  Traveler,
  Dimension,
  SimulationLog,
  PreflightImpact,
  ReplayFrame,
} from '../types/temporal';
import { EventStatus, TravelerStatus, CausalRelation } from '../types/temporal';
import { SimulationService } from '../engine/SimulationService';
import { GraphEngine } from '../engine/GraphEngine';
import { ParadoxEngine } from '../engine/ParadoxEngine';
import { IntegrityEngine } from '../engine/IntegrityEngine';

const SIMULATION_STORAGE_KEY = 'infinite-horizons:simulation';
const THEME_STORAGE_KEY = 'infinite-horizons:theme';

function loadInitialState(): { universe: Universe; logs: SimulationLog[] } {
  try {
    const saved = localStorage.getItem(SIMULATION_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore storage parse error
  }
  return SimulationService.createDefaultUniverse();
}

function loadInitialTheme(): 'cyberpunk' | 'academic' | 'high-contrast' {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'academic' || saved === 'high-contrast' || saved === 'cyberpunk') {
      return saved;
    }
  } catch {
    // Ignore
  }
  return 'cyberpunk';
}

export interface SimulationStore {
  // Universe & Simulation Core
  universeState: { universe: Universe; logs: SimulationLog[] };
  activeDimensionId: string;
  selectedEventId: string | null;
  highlightChain: string[];

  // Timeline & Time Scrubber
  timelineYear: number;
  isTimelinePlaying: boolean;
  playbackSpeed: number;

  // History for Undo / Redo
  history: Array<{ universe: Universe; logs: SimulationLog[] }>;
  future: Array<{ universe: Universe; logs: SimulationLog[] }>;

  // Modals & Drawers UI State
  showConferenceMode: boolean;
  showMinkowski3D: boolean;
  showMonteCarlo: boolean;
  showAIDrawer: boolean;
  showCLIModal: boolean;
  showAddEvent: boolean;
  showAddTraveler: boolean;
  showTimeTravel: boolean;
  showAddDimension: boolean;

  // New PRD Features: Preflight Preview, Replay & Theme
  preflightImpact: PreflightImpact | null;
  isReplayActive: boolean;
  replayFrames: ReplayFrame[];
  replayCurrentIndex: number;
  theme: 'cyberpunk' | 'academic' | 'high-contrast';

  // Actions
  setUniverseState: (
    stateOrUpdater:
      | { universe: Universe; logs: SimulationLog[] }
      | ((prev: { universe: Universe; logs: SimulationLog[] }) => { universe: Universe; logs: SimulationLog[] })
  ) => void;
  setActiveDimensionId: (id: string) => void;
  setSelectedEventId: (id: string | null) => void;
  setHighlightChain: (chain: string[]) => void;
  setTimelineYear: (year: number) => void;
  setIsTimelinePlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;

  // Modals toggles
  setShowConferenceMode: (show: boolean) => void;
  setShowMinkowski3D: (show: boolean) => void;
  setShowMonteCarlo: (show: boolean) => void;
  setShowAIDrawer: (show: boolean) => void;
  setShowCLIModal: (show: boolean) => void;
  setShowAddEvent: (show: boolean) => void;
  setShowAddTraveler: (show: boolean) => void;
  setShowTimeTravel: (show: boolean) => void;
  setShowAddDimension: (show: boolean) => void;

  // Theme
  setTheme: (theme: 'cyberpunk' | 'academic' | 'high-contrast') => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Domain Actions
  addEvent: (dimensionId: string, eventData: Partial<TemporalEvent>) => void;
  updateEvent: (eventId: string, updates: Partial<TemporalEvent>) => void;
  removeEvent: (eventId: string) => void;
  addTraveler: (travelerData: { name: string; originDimensionId: string; originYear: number }) => void;
  timeTravel: (travelerId: string, destDimId: string, destYear: number, purpose?: string) => void;
  addDimension: (name: string, designation: string, color: string) => void;
  
  // Pre-flight & Replay
  calculatePreflight: (targetEventId: string, action: 'erase' | 'alter' | 'branch') => PreflightImpact;
  setPreflightImpact: (impact: PreflightImpact | null) => void;
  startReplay: (frames: ReplayFrame[]) => void;
  stepReplay: (index: number) => void;
  stopReplay: () => void;

  // Reset
  resetUniverse: () => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => {
  const initial = loadInitialState();
  const initialDim = initial.universe.dimensions[0]?.id || 'dim-omega-01';
  const initialTheme = loadInitialTheme();

  return {
    universeState: initial,
    activeDimensionId: initialDim,
    selectedEventId: null,
    highlightChain: [],

    timelineYear: 2025,
    isTimelinePlaying: false,
    playbackSpeed: 1,

    history: [],
    future: [],

    showConferenceMode: false,
    showMinkowski3D: false,
    showMonteCarlo: false,
    showAIDrawer: false,
    showCLIModal: false,
    showAddEvent: false,
    showAddTraveler: false,
    showTimeTravel: false,
    showAddDimension: false,

    preflightImpact: null,
    isReplayActive: false,
    replayFrames: [],
    replayCurrentIndex: 0,
    theme: initialTheme,

    setUniverseState: stateOrUpdater => {
      set(current => {
        const next =
          typeof stateOrUpdater === 'function' ? stateOrUpdater(current.universeState) : stateOrUpdater;
        
        try {
          localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Storage quota handling
        }

        return {
          history: [...current.history.slice(-29), current.universeState],
          future: [],
          universeState: next,
        };
      });
    },

    setActiveDimensionId: id => set({ activeDimensionId: id }),
    setSelectedEventId: id => set({ selectedEventId: id }),
    setHighlightChain: chain => set({ highlightChain: chain }),
    setTimelineYear: year => set({ timelineYear: year }),
    setIsTimelinePlaying: playing => set({ isTimelinePlaying: playing }),
    setPlaybackSpeed: speed => set({ playbackSpeed: speed }),

    setShowConferenceMode: show => set({ showConferenceMode: show }),
    setShowMinkowski3D: show => set({ showMinkowski3D: show }),
    setShowMonteCarlo: show => set({ showMonteCarlo: show }),
    setShowAIDrawer: show => set({ showAIDrawer: show }),
    setShowCLIModal: show => set({ showCLIModal: show }),
    setShowAddEvent: show => set({ showAddEvent: show }),
    setShowAddTraveler: show => set({ showAddTraveler: show }),
    setShowTimeTravel: show => set({ showTimeTravel: show }),
    setShowAddDimension: show => set({ showAddDimension: show }),

    setTheme: theme => {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        // Ignore
      }
      document.body.dataset.theme = theme;
      set({ theme });
    },

    undo: () => {
      const { history, future, universeState } = get();
      if (history.length === 0) return;

      const previous = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      try {
        localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(previous));
      } catch {
        // Ignore
      }

      set({
        universeState: previous,
        history: newHistory,
        future: [...future, universeState],
      });
    },

    redo: () => {
      const { history, future, universeState } = get();
      if (future.length === 0) return;

      const next = future[future.length - 1];
      const newFuture = future.slice(0, -1);

      try {
        localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }

      set({
        universeState: next,
        history: [...history, universeState],
        future: newFuture,
      });
    },

    canUndo: () => get().history.length > 0,
    canRedo: () => get().future.length > 0,

    addEvent: (dimensionId, eventData) => {
      const { universeState } = get();
      const universe = universeState.universe;
      const newId = `evt-${Date.now()}`;

      const newEvent: TemporalEvent = {
        id: newId,
        dimensionId,
        title: eventData.title || 'Novo Evento Quântico',
        description: eventData.description || '',
        year: eventData.year || 2025,
        category: eventData.category || 'FÍSICA TEÓRICA',
        importance: eventData.importance || 80,
        position: eventData.position || { x: 50, y: 150 },
        status: EventStatus.STABLE,
        scientificStatus: eventData.scientificStatus || 'theoretical_untested',
        parents: eventData.parents || [],
        children: eventData.children || [],
        causes: eventData.causes || [],
        consequences: eventData.consequences || [],
        isAnchor: eventData.isAnchor || false,
        sourceUrl: eventData.sourceUrl,
        academicCitation: eventData.academicCitation,
        doi: eventData.doi,
        evidenceKind: eventData.evidenceKind || 'scientific_theory',
        evidenceConfidence: eventData.evidenceConfidence || 85,
        uncertainty: eventData.uncertainty,
      };

      const updatedDimensions = universe.dimensions.map(dim =>
        dim.id === dimensionId ? { ...dim, events: [...dim.events, newEvent] } : dim
      );

      const newEdges = [...universe.edges];
      if (newEvent.parents.length > 0) {
        for (const pId of newEvent.parents) {
          newEdges.push({
            id: `edge-${pId}-${newId}`,
            source: pId,
            target: newId,
            type: CausalRelation.CAUSES,
            active: true,
          });
        }
      }

      const allUpdatedEvents = updatedDimensions.flatMap(d => d.events);
      const paradoxes = ParadoxEngine.detectParadoxes(allUpdatedEvents, universe.travelers, newEdges);
      const integrity = IntegrityEngine.calculate(allUpdatedEvents, paradoxes);

      const nextState = {
        universe: {
          ...universe,
          dimensions: updatedDimensions,
          edges: newEdges,
          paradoxes,
          temporalIntegrity: integrity,
          updatedAt: Date.now(),
        },
        logs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            message: `Evento adicionado: "${newEvent.title}" (${newEvent.year})`,
            type: 'info' as const,
          },
          ...universeState.logs,
        ],
      };

      get().setUniverseState(nextState);
    },

    updateEvent: (eventId, updates) => {
      const { universeState } = get();
      const universe = universeState.universe;

      const updatedDimensions = universe.dimensions.map(dim => ({
        ...dim,
        events: dim.events.map(ev => (ev.id === eventId ? { ...ev, ...updates } : ev)),
      }));

      const allUpdatedEvents = updatedDimensions.flatMap(d => d.events);
      const paradoxes = ParadoxEngine.detectParadoxes(allUpdatedEvents, universe.travelers, universe.edges);
      const integrity = IntegrityEngine.calculate(allUpdatedEvents, paradoxes);

      const nextState = {
        universe: {
          ...universe,
          dimensions: updatedDimensions,
          paradoxes,
          temporalIntegrity: integrity,
          updatedAt: Date.now(),
        },
        logs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            message: `Evento atualizado: ${eventId}`,
            type: 'info' as const,
          },
          ...universeState.logs,
        ],
      };

      get().setUniverseState(nextState);
    },

    removeEvent: eventId => {
      const { universeState } = get();
      const universe = universeState.universe;

      const updatedDimensions = universe.dimensions.map(dim => ({
        ...dim,
        events: dim.events.filter(ev => ev.id !== eventId),
      }));

      const updatedEdges = universe.edges.filter(e => e.source !== eventId && e.target !== eventId);
      const allUpdatedEvents = updatedDimensions.flatMap(d => d.events);
      const paradoxes = ParadoxEngine.detectParadoxes(allUpdatedEvents, universe.travelers, updatedEdges);
      const integrity = IntegrityEngine.calculate(allUpdatedEvents, paradoxes);

      const nextState = {
        universe: {
          ...universe,
          dimensions: updatedDimensions,
          edges: updatedEdges,
          paradoxes,
          temporalIntegrity: integrity,
          updatedAt: Date.now(),
        },
        logs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            message: `Evento removido: ${eventId}`,
            type: 'warning' as const,
          },
          ...universeState.logs,
        ],
      };

      get().setUniverseState(nextState);
      if (get().selectedEventId === eventId) {
        set({ selectedEventId: null });
      }
    },

    addTraveler: travelerData => {
      const { universeState } = get();
      const universe = universeState.universe;
      const newId = `trv-${Date.now()}`;

      const newTraveler: Traveler = {
        id: newId,
        name: travelerData.name,
        originDimensionId: travelerData.originDimensionId,
        originYear: travelerData.originYear,
        currentDimensionId: travelerData.originDimensionId,
        currentYear: travelerData.originYear,
        status: TravelerStatus.NORMAL,
        travelHistory: [],
      };

      const nextState = {
        universe: {
          ...universe,
          travelers: [...universe.travelers, newTraveler],
          updatedAt: Date.now(),
        },
        logs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            message: `Viajante temporal registrado: ${newTraveler.name}`,
            type: 'info' as const,
          },
          ...universeState.logs,
        ],
      };

      get().setUniverseState(nextState);
    },

    timeTravel: (travelerId, destDimId, destYear, purpose) => {
      const { universeState } = get();
      const universe = universeState.universe;

      const updatedTravelers = universe.travelers.map(trv => {
        if (trv.id !== travelerId) return trv;
        const newRecord = {
          id: `rec-${Date.now()}`,
          travelerId: trv.id,
          originDimensionId: trv.currentDimensionId,
          originYear: trv.currentYear,
          destinationDimensionId: destDimId,
          destinationYear: destYear,
          purpose: purpose || 'Salto de Geodésica',
          timestamp: Date.now(),
        };
        return {
          ...trv,
          currentDimensionId: destDimId,
          currentYear: destYear,
          status: TravelerStatus.TRAVELING,
          travelHistory: [...trv.travelHistory, newRecord],
        };
      });

      const allEvents = universe.dimensions.flatMap(d => d.events);
      const paradoxes = ParadoxEngine.detectParadoxes(allEvents, updatedTravelers, universe.edges);
      const integrity = IntegrityEngine.calculate(allEvents, paradoxes);

      const nextState = {
        universe: {
          ...universe,
          travelers: updatedTravelers,
          paradoxes,
          temporalIntegrity: integrity,
          updatedAt: Date.now(),
        },
        logs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            message: `Salto temporal executado para ano ${destYear}`,
            type: 'success' as const,
          },
          ...universeState.logs,
        ],
      };

      get().setUniverseState(nextState);
    },

    addDimension: (name, designation, color) => {
      const { universeState } = get();
      const universe = universeState.universe;
      const newDimId = `dim-${Date.now()}`;

      const newDim: Dimension = {
        id: newDimId,
        universeId: universe.id,
        name,
        designation,
        color,
        events: [],
        integrity: 100,
      };

      const nextState = {
        universe: {
          ...universe,
          dimensions: [...universe.dimensions, newDim],
          updatedAt: Date.now(),
        },
        logs: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('pt-BR'),
            message: `Nova dimensão acoplada: ${designation} (${name})`,
            type: 'info' as const,
          },
          ...universeState.logs,
        ],
      };

      get().setUniverseState(nextState);
    },

    calculatePreflight: (targetEventId, action) => {
      const { universeState } = get();
      const universe = universeState.universe;
      const allEvents = universe.dimensions.flatMap(d => d.events);
      const targetEvent = allEvents.find(e => e.id === targetEventId);

      const descendants = Array.from(GraphEngine.getDescendants(targetEventId, universe.edges));
      const directChildren = GraphEngine.getChildren(targetEventId, universe.edges);

      const threatenedTravelers = universe.travelers
        .filter(t => t.originEventId === targetEventId || descendants.includes(t.originEventId || ''))
        .map(t => t.name);

      const criticalAnchorsAtRisk = allEvents
        .filter(e => (e.id === targetEventId || descendants.includes(e.id)) && e.isAnchor)
        .map(e => e.title);

      const estimatedDrop = action === 'erase' ? 25 + descendants.length * 4 : 10 + descendants.length * 2;
      const predictedIntegrity = Math.max(0, universe.temporalIntegrity - estimatedDrop);

      return {
        targetEventId,
        targetEventTitle: targetEvent?.title || 'Evento Desconhecido',
        action,
        directEffectsCount: directChildren.length,
        indirectEffectsCount: Math.max(0, descendants.length - directChildren.length),
        threatenedTravelers,
        predictedParadoxesCount: threatenedTravelers.length > 0 ? threatenedTravelers.length : descendants.length > 3 ? 1 : 0,
        currentIntegrity: universe.temporalIntegrity,
        predictedIntegrity,
        criticalAnchorsAtRisk,
      };
    },

    setPreflightImpact: impact => set({ preflightImpact: impact }),

    startReplay: frames => {
      set({
        isReplayActive: true,
        replayFrames: frames,
        replayCurrentIndex: 0,
      });
    },

    stepReplay: index => {
      const { replayFrames } = get();
      if (index >= 0 && index < replayFrames.length) {
        set({ replayCurrentIndex: index });
      }
    },

    stopReplay: () => {
      set({
        isReplayActive: false,
        replayFrames: [],
        replayCurrentIndex: 0,
      });
    },

    resetUniverse: () => {
      const defaultState = SimulationService.createDefaultUniverse();
      try {
        localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(defaultState));
      } catch {
        // Ignore
      }
      set({
        universeState: defaultState,
        activeDimensionId: defaultState.universe.dimensions[0]?.id || 'dim-omega-01',
        selectedEventId: null,
        highlightChain: [],
        history: [],
        future: [],
      });
    },
  };
});
