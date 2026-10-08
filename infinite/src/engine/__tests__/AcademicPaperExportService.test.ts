import { describe, it, expect } from 'vitest';
import { AcademicPaperExportService } from '../AcademicPaperExportService';
import { Universe, EventStatus, CausalRelation } from '../../types/temporal';

function createMockUniverse(): Universe {
  return {
    id: 'test-univ-01',
    name: 'Universo Alfa de Teste',
    temporalIntegrity: 92,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    dimensions: [
      {
        id: 'dim-01',
        universeId: 'test-univ-01',
        name: 'Linha Principal',
        designation: 'Ω-01',
        color: '#00d4ff',
        integrity: 95,
        events: [
          {
            id: 'ev-1',
            dimensionId: 'dim-01',
            title: 'Descoberta do Fogo',
            year: -400000,
            category: 'TECNOLÓGICO',
            importance: 90,
            status: EventStatus.STABLE,
            position: { x: 50, y: 100 },
            parents: [],
            children: ['ev-2'],
            causes: [],
            consequences: ['ev-2'],
          },
          {
            id: 'ev-2',
            dimensionId: 'dim-01',
            title: 'Princípios Matemáticos de Newton',
            year: 1687,
            category: 'CIENTÍFICO',
            importance: 98,
            status: EventStatus.STABLE,
            position: { x: 150, y: 100 },
            parents: ['ev-1'],
            children: [],
            causes: ['ev-1'],
            consequences: [],
          },
        ],
      },
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'ev-1',
        target: 'ev-2',
        type: CausalRelation.CAUSES,
        active: true,
      },
    ],
    travelers: [],
    paradoxes: [],
  };
}

describe('AcademicPaperExportService', () => {
  it('computes rigorous paper metrics correctly', () => {
    const universe = createMockUniverse();
    const metrics = AcademicPaperExportService.computePaperMetrics(universe);

    expect(metrics.totalEvents).toBe(2);
    expect(metrics.totalEdges).toBe(1);
    expect(metrics.dimensionsCount).toBe(1);
    expect(metrics.temporalIntegrity).toBe(92);
    expect(metrics.paradoxCount).toBe(0);
    expect(metrics.novikovIndex).toBeGreaterThan(0.8);
    expect(metrics.lyapunovExponent).toBeGreaterThan(0);
    expect(metrics.kolmogorovEntropy).toBeGreaterThanOrEqual(metrics.lyapunovExponent);
  });

  it('generates authentic RevTeX LaTeX source code', () => {
    const universe = createMockUniverse();
    const latex = AcademicPaperExportService.generateRevTeX(universe);

    expect(latex).toContain('\\documentclass[aps,prd,twocolumn');
    expect(latex).toContain('Universo Alfa de Teste');
    expect(latex).toContain('Princípio de Autoconsistência de Novikov');
    expect(latex).toContain('Métrica de Kerr e Termodinâmica de Bekenstein-Hawking');
    expect(latex).toContain('\\begin{thebibliography}');
    expect(latex).toContain('\\bibitem{kerr1963}');
    expect(latex).toContain('\\end{document}');
  });

  it('generates well-formed BibTeX bibliography', () => {
    const universe = createMockUniverse();
    const bib = AcademicPaperExportService.generateBibTeX(universe);

    expect(bib).toContain('@article{michelson1887,');
    expect(bib).toContain('@article{einstein1915,');
    expect(bib).toContain('@article{minkowski1908,');
    expect(bib).toContain('@article{kerr1963,');
    expect(bib).toContain('@article{novikov1990,');
    expect(bib).toContain('@article{hawking1974,');
    expect(bib).toContain('Universo Alfa de Teste');
  });
});
