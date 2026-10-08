import { describe, it, expect } from 'vitest';
import { PhaseSpaceEntropyEngine } from '../PhaseSpaceEntropyEngine';
import { AcademicGenealogyEngine } from '../AcademicGenealogyEngine';
import { CausalBacktrackingEngine } from '../CausalBacktrackingEngine';
import type { Universe } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';

describe('Advanced Historical & Physical Engines', () => {
  const mockUniverse: Universe = {
    id: 'u-test',
    name: 'Universo Teste',
    temporalIntegrity: 100,
    createdAt: Date.now(),
    dimensions: [
      {
        id: 'dim-test',
        universeId: 'u-test',
        name: 'Linha Principal Alfa',
        designation: 'ALFA-0',
        color: '#00d4ff',
        integrity: 100,
        events: [
          {
            id: 'evt-1',
            dimensionId: 'dim-test',
            title: 'Interferômetro de Michelson-Morley',
            year: 1887,
            category: 'SCIENCE',
            importance: 90,
            position: { x: 100, y: 100 },
            status: EventStatus.STABLE,
            description: 'Experimento do éter luminífero',
            parents: [],
            children: ['evt-2'],
            causes: [],
            consequences: ['evt-2'],
          },
          {
            id: 'evt-2',
            dimensionId: 'dim-test',
            title: 'Teoria da Relatividade Especial',
            year: 1905,
            category: 'SCIENCE',
            importance: 98,
            position: { x: 200, y: 100 },
            status: EventStatus.STABLE,
            description: 'Publicação de Einstein nos Annalen der Physik',
            parents: ['evt-1'],
            children: [],
            causes: ['evt-1'],
            consequences: [],
          },
          {
            id: 'evt-3',
            dimensionId: 'dim-test',
            title: 'Desenvolvimento do Radar de Micro-ondas',
            year: 1940,
            category: 'WARFARE',
            importance: 85,
            position: { x: 300, y: 100 },
            status: EventStatus.STABLE,
            description: 'Magnetron de cavidade em Birmingham',
            parents: [],
            children: [],
            causes: [],
            consequences: [],
          },
        ],
      },
    ],
    edges: [],
    travelers: [],
    paradoxes: [],
    updatedAt: Date.now(),
  };

  const sampleEvent = mockUniverse.dimensions[0].events[0];

  describe('PhaseSpaceEntropyEngine', () => {
    it('calculates baseline Shannon entropy greater than zero', () => {
      const allEvents = mockUniverse.dimensions[0].events;
      const entropy = PhaseSpaceEntropyEngine.calculateShannonEntropy(allEvents);
      expect(entropy).toBeGreaterThan(0);
    });

    it('computes Lyapunov exponent and divergence metrics correctly', () => {
      const result = PhaseSpaceEntropyEngine.computePhaseSpaceAnalysis(mockUniverse, sampleEvent, 18);
      expect(result.shannonEntropyBaseline).toBeGreaterThan(0);
      expect(result.shannonEntropyCurrent).toBeGreaterThan(0);
      expect(typeof result.lyapunovExponentLambda).toBe('number');
      expect(result.trajectoryPoints.length).toBeGreaterThan(0);
      expect(result.interpretiveSummary).toContain('Lyapunov');
    });
  });

  describe('AcademicGenealogyEngine', () => {
    it('resolves authentic historical lineage for Michelson-Morley', () => {
      const lineage = AcademicGenealogyEngine.resolveLineage(sampleEvent);
      expect(lineage.primaryPioneer).toContain('Michelson');
      expect(lineage.mentors.length).toBeGreaterThan(0);
      expect(lineage.mentors[0].name).toContain('Helmholtz');
      expect(lineage.disciples.length).toBeGreaterThan(0);
      expect(lineage.epistemicLineageChain).toContain('Helmholtz (Berlim)');
    });

    it('resolves Einstein lineage for relativity event', () => {
      const relEvent = mockUniverse.dimensions[0].events[1];
      const lineage = AcademicGenealogyEngine.resolveLineage(relEvent);
      expect(lineage.primaryPioneer).toContain('Einstein');
      expect(lineage.mentors.some(m => m.name.includes('Minkowski'))).toBe(true);
      expect(lineage.schoolOfThought).toContain('Espaço-Tempo');
    });
  });

  describe('CausalBacktrackingEngine', () => {
    it('provides preset goals with mathematical formulas', () => {
      expect(CausalBacktrackingEngine.PRESET_GOALS.length).toBeGreaterThanOrEqual(4);
      const quantumGoal = CausalBacktrackingEngine.PRESET_GOALS[0];
      const plan = CausalBacktrackingEngine.solveBacktrackingPlan(
        mockUniverse,
        quantumGoal.title,
        quantumGoal.desiredYear,
        quantumGoal.originalYear
      );
      expect(plan.totalShiftYears).toBeGreaterThan(0);
      expect(plan.prerequisiteSteps.length).toBeGreaterThan(0);
      expect(plan.primaryBottleneckFormula).toContain('hbar');
      expect(plan.pioneerCandidates.length).toBeGreaterThan(0);
    });

    it('generates an accelerated counterfactual dimension properly', () => {
      const plan = CausalBacktrackingEngine.solveBacktrackingPlan(
        mockUniverse,
        'Energia Nuclear',
        1910,
        1938
      );
      const { newDimension, newEdges } = CausalBacktrackingEngine.generateAcceleratedDimension(
        mockUniverse,
        plan
      );
      expect(newDimension.id).toContain('dim-accelerated');
      expect(newDimension.events.length).toBeGreaterThan(0);
      expect(newEdges.length).toBeGreaterThan(0);
      expect(newDimension.designation).toContain('REV-');
    });
  });
});
