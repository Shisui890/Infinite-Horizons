import type { Universe, Dimension, TemporalEvent, Traveler, CausalEdge, SimulationLog } from '../types/temporal';
import { EventStatus, TravelerStatus, CausalRelation } from '../types/temporal';
import { PropagationEngine } from './PropagationEngine';
import { ParadoxEngine } from './ParadoxEngine';
import { IntegrityEngine } from './IntegrityEngine';

export class SimulationService {
  public static createDefaultUniverse(): { universe: Universe; logs: SimulationLog[] } {
    const dim1: Dimension = {
      id: 'dim-omega-01',
      universeId: 'univ-01',
      name: 'Realidade Primária',
      designation: 'Ω-01',
      color: '#00d4ff',
      events: [],
      integrity: 100,
    };

    const dim2: Dimension = {
      id: 'dim-omega-02',
      universeId: 'univ-01',
      name: 'Ramificação Quantum',
      designation: 'Ω-02',
      color: '#a855f7',
      events: [],
      integrity: 100,
    };

    const events: TemporalEvent[] = [
      {
        id: 'evt-101',
        dimensionId: 'dim-omega-01',
        title: 'Nascimento de Alex Chronos',
        description: 'Nascimento do cientista Alex Chronos na Terra Primária.',
        year: 2000,
        category: 'NASCIMENTO',
        importance: 85,
        position: { x: 120, y: 180 },
        status: EventStatus.STABLE,
        parents: [],
        children: ['evt-102'],
        causes: [],
        consequences: ['evt-102'],
        isAnchor: true,
      },
      {
        id: 'evt-102',
        dimensionId: 'dim-omega-01',
        title: 'Descoberta da Partícula TQuark',
        description: 'A descoberta que tornou viável a dobra temporal.',
        year: 2020,
        category: 'DESCOBERTA',
        importance: 90,
        position: { x: 300, y: 120 },
        status: EventStatus.STABLE,
        parents: ['evt-101'],
        children: ['evt-103'],
        causes: ['evt-101'],
        consequences: ['evt-103'],
      },
      {
        id: 'evt-103',
        dimensionId: 'dim-omega-01',
        title: 'Construção da Máquina Temporal',
        description: 'Primeiro gerador de fenda cronal estabilizada.',
        year: 2050,
        category: 'TECNOLÓGICO',
        importance: 95,
        position: { x: 500, y: 180 },
        status: EventStatus.STABLE,
        parents: ['evt-102'],
        children: ['evt-104'],
        causes: ['evt-102'],
        consequences: ['evt-104'],
        isAnchor: true,
      },
      {
        id: 'evt-104',
        dimensionId: 'dim-omega-01',
        title: 'Primeira Viagem ao Passado',
        description: 'Alex Chronos ativa o motor temporal rumo a 1990.',
        year: 2060,
        category: 'VIAGEM',
        importance: 100,
        position: { x: 680, y: 120 },
        status: EventStatus.STABLE,
        parents: ['evt-103'],
        children: [],
        causes: ['evt-103'],
        consequences: [],
      },
      {
        id: 'evt-105',
        dimensionId: 'dim-omega-02',
        title: 'Tratado Interdimensional de 2040',
        description: 'Acordo firmado entre Ω-01 e Ω-02.',
        year: 2040,
        category: 'POLÍTICO',
        importance: 70,
        position: { x: 420, y: 320 },
        status: EventStatus.STABLE,
        parents: [],
        children: [],
        causes: [],
        consequences: [],
      },
    ];

    dim1.events = events.filter(e => e.dimensionId === dim1.id);
    dim2.events = events.filter(e => e.dimensionId === dim2.id);

    const edges: CausalEdge[] = [
      { id: 'edg-1', source: 'evt-101', target: 'evt-102', type: CausalRelation.CAUSES, active: true },
      { id: 'edg-2', source: 'evt-102', target: 'evt-103', type: CausalRelation.ENABLES, active: true },
      { id: 'edg-3', source: 'evt-103', target: 'evt-104', type: CausalRelation.CAUSES, active: true },
    ];

    const travelers: Traveler[] = [
      {
        id: 'trv-001',
        name: 'Alex Chronos',
        originDimensionId: 'dim-omega-01',
        originYear: 2060,
        currentDimensionId: 'dim-omega-01',
        currentYear: 2060,
        originEventId: 'evt-101',
        status: TravelerStatus.NORMAL,
        travelHistory: [],
      },
    ];

    const universe: Universe = {
      id: 'univ-01',
      name: 'O Experimento Chronos',
      description: 'Simulação inicial da linha temporal primária e suas dependências causais.',
      temporalIntegrity: 100,
      dimensions: [dim1, dim2],
      travelers,
      edges,
      paradoxes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const logs: SimulationLog[] = [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Universo "O Experimento Chronos" inicializado com sucesso (Integridade: 100%).',
        type: 'info',
      },
    ];

    return { universe, logs };
  }

  public static updateSimulation(universe: Universe): { updatedUniverse: Universe; paradoxesDetected: number } {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const paradoxes = ParadoxEngine.detectParadoxes(allEvents, universe.travelers, universe.edges);
    const newIntegrity = IntegrityEngine.calculate(allEvents, paradoxes);

    universe.paradoxes = paradoxes;
    universe.temporalIntegrity = newIntegrity;
    universe.updatedAt = Date.now();

    for (const dim of universe.dimensions) {
      const dimEvents = allEvents.filter(e => e.dimensionId === dim.id);
      dim.integrity = IntegrityEngine.calculate(dimEvents, paradoxes.filter(p => p.dimensionId === dim.id));
    }

    return { updatedUniverse: { ...universe }, paradoxesDetected: paradoxes.length };
  }

  public static alterEvent(
    universe: Universe,
    eventId: string,
    newStatus: EventStatus
  ): { updatedUniverse: Universe; affectedCount: number } {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const eventsMap = new Map<string, TemporalEvent>(allEvents.map(e => [e.id, e]));

    const targetEvent = eventsMap.get(eventId);
    if (targetEvent) {
      targetEvent.status = newStatus;
      const affected = PropagationEngine.propagate(eventId, eventsMap, universe.edges);
      this.updateSimulation(universe);
      return { updatedUniverse: { ...universe }, affectedCount: affected.length };
    }

    return { updatedUniverse: universe, affectedCount: 0 };
  }
}
