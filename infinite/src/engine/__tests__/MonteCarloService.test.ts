import { describe, it, expect } from 'vitest';
import { MonteCarloService } from '../MonteCarloService';
import { EventStatus, CausalRelation, type Universe } from '../../types/temporal';

function createMockUniverse(hasCycles = false): Universe {
  return {
    id: 'test_univ',
    name: 'Universo de Teste',
    temporalIntegrity: 85,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    travelers: [],
    paradoxes: [],
    dimensions: [
      {
        id: 'dim_1',
        universeId: 'test_univ',
        name: 'Dimensão Primária',
        designation: 'Ω-01',
        color: '#00e5ff',
        integrity: 85,
        events: [
          {
            id: 'ev_1',
            dimensionId: 'dim_1',
            title: 'Evento Alfa',
            description: 'Origem causal',
            year: 1910,
            category: 'Científico',
            importance: 80,
            status: EventStatus.STABLE,
            position: { x: 0, y: 0 },
            parents: [],
            children: ['ev_2'],
            causes: [],
            consequences: ['ev_2'],
          },
          {
            id: 'ev_2',
            dimensionId: 'dim_1',
            title: 'Evento Beta',
            description: 'Efeito intermediário',
            year: 1920,
            category: 'Científico',
            importance: 75,
            status: EventStatus.STABLE,
            position: { x: 100, y: 0 },
            parents: ['ev_1'],
            children: hasCycles ? ['ev_1'] : ['ev_3'],
            causes: ['ev_1'],
            consequences: hasCycles ? ['ev_1'] : ['ev_3'],
          },
          {
            id: 'ev_3',
            dimensionId: 'dim_1',
            title: 'Evento Gama',
            description: 'Consequência final',
            year: 1930,
            category: 'Científico',
            importance: 70,
            status: EventStatus.STABLE,
            position: { x: 200, y: 0 },
            parents: ['ev_2'],
            children: [],
            causes: ['ev_2'],
            consequences: [],
          },
        ],
      },
    ],
    edges: [
      { id: 'e1', source: 'ev_1', target: 'ev_2', active: true, type: CausalRelation.CAUSES },
      hasCycles
        ? { id: 'e2', source: 'ev_2', target: 'ev_1', active: true, type: CausalRelation.CAUSES }
        : { id: 'e2', source: 'ev_2', target: 'ev_3', active: true, type: CausalRelation.CAUSES },
    ],
  };
}

describe('MonteCarloService', () => {
  it('executa simulação estocástica com probabilidades válidas somando 100%', () => {
    const universe = createMockUniverse(false);
    const result = MonteCarloService.runSimulation(universe, 1000);

    expect(result.iterations).toBe(1000);
    expect(result.stableProbability).toBeGreaterThanOrEqual(0);
    expect(result.bifurcationProbability).toBeGreaterThanOrEqual(0);
    expect(result.inconsistencyProbability).toBeGreaterThanOrEqual(0);

    const sum = result.stableProbability + result.bifurcationProbability + result.inconsistencyProbability;
    expect(sum).toBeCloseTo(100, 0);
    expect(result.shannonEntropyBits).toBeGreaterThanOrEqual(0);
    expect(result.convergenceSeries.length).toBeGreaterThan(0);
  });

  it('detecta ciclos (CTCs) corretamente na saúde topológica do grafo', () => {
    const acyclicUniv = createMockUniverse(false);
    const healthAcyclic = MonteCarloService.assessGraphHealth(acyclicUniv);
    expect(healthAcyclic.hasCycles).toBe(false);

    const cyclicUniv = createMockUniverse(true);
    const healthCyclic = MonteCarloService.assessGraphHealth(cyclicUniv);
    expect(healthCyclic.hasCycles).toBe(true);
  });

  it('gera recomendações causais prescritivas para grafos com ciclos', () => {
    const cyclicUniv = createMockUniverse(true);
    const result = MonteCarloService.runSimulation(cyclicUniv, 1000);
    const recs = MonteCarloService.generateCausalRecommendations(cyclicUniv, result);

    const cycleRec = recs.find(r => r.id === 'rec_cycles');
    expect(cycleRec).toBeDefined();
    expect(cycleRec?.type).toBe('critical');
    expect(cycleRec?.technicalDesc).toContain('Censura Cronológica');
  });

  it('gera recomendação de estabilidade para universos acíclicos com alta integridade', () => {
    const acyclicUniv = createMockUniverse(false);
    const result = {
      iterations: 1000,
      stableProbability: 92,
      bifurcationProbability: 6,
      inconsistencyProbability: 2,
      shannonEntropyBits: 0.45,
      lyapunovMax: 0.12,
      convergenceSeries: [90, 92],
    };
    const recs = MonteCarloService.generateCausalRecommendations(acyclicUniv, result);

    const stableRec = recs.find(r => r.type === 'stable');
    expect(stableRec).toBeDefined();
    expect(stableRec?.title).toContain('Autoconsistência');
  });
});
