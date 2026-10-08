import { describe, it, expect } from 'vitest';
import { formatHistoricalYear } from '../../utils/formatters';
import { ExpertCounterfactualEngine } from '../ExpertCounterfactualEngine';
import type { TemporalEvent, Universe } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';

describe('formatHistoricalYear', () => {
  it('formats positive years as d.C.', () => {
    expect(formatHistoricalYear(9)).toBe('9 d.C.');
    expect(formatHistoricalYear(2025)).toBe('2025 d.C.');
    expect(formatHistoricalYear('1969')).toBe('1969 d.C.');
    expect(formatHistoricalYear(1212)).toBe('1212 d.C.');
  });

  it('formats negative years as a.C.', () => {
    expect(formatHistoricalYear(-500)).toBe('500 a.C.');
    expect(formatHistoricalYear(-44)).toBe('44 a.C.');
  });

  it('formats year 0 as 0 d.C.', () => {
    expect(formatHistoricalYear(0)).toBe('0 d.C.');
  });

  it('handles empty or invalid inputs gracefully', () => {
    expect(formatHistoricalYear(undefined)).toBe('');
    expect(formatHistoricalYear(null)).toBe('');
    expect(formatHistoricalYear('')).toBe('');
  });
});

describe('ExpertCounterfactualEngine', () => {
  const dummyUniverse: Universe = {
    id: 'u1',
    name: 'Test Universe',
    description: 'Universe for test',
    dimensions: [],
    travelers: [],
    edges: [],
    paradoxes: [],
    temporalIntegrity: 100,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const rocketEvent: TemporalEvent = {
    id: 'evt-rocket',
    dimensionId: 'dim-1',
    title: 'First Recorded Rocket Launch',
    description: 'Pioneering solid fuel launch in ancient history',
    year: 9,
    category: 'TECNOLOGIA',
    importance: 85,
    status: EventStatus.STABLE,
    parents: [],
    children: ['evt-mars'],
    causes: [],
    consequences: ['evt-mars'],
    position: { x: 100, y: 100 },
  };

  const marsEvent: TemporalEvent = {
    id: 'evt-mars',
    dimensionId: 'dim-1',
    title: 'Mars Rover Curiosity Landing',
    description: 'Automated rover exploration on Mars',
    year: 2012,
    category: 'AEROESPACIAL',
    importance: 92,
    status: EventStatus.STABLE,
    parents: ['evt-rocket'],
    children: [],
    causes: ['evt-rocket'],
    consequences: [],
    position: { x: 500, y: 100 },
    isAnchor: true,
  };

  const radarEvent: TemporalEvent = {
    id: 'evt-radar',
    dimensionId: 'dim-1',
    title: 'The Development of Radar Technology',
    description: 'Centimetric microwave radar and cavity magnetron revolution',
    year: 1940,
    category: 'TECNOLOGIA',
    importance: 92,
    status: EventStatus.STABLE,
    parents: [],
    children: [],
    causes: [],
    consequences: [],
    position: { x: 300, y: 100 },
  };

  const michelsonEvent: TemporalEvent = {
    id: 'evt-mm',
    dimensionId: 'dim-1',
    title: 'Experimento de Michelson-Morley & Crise do Éter',
    description: 'Medição interferométrica nula da velocidade relativa do éter',
    year: 1887,
    category: 'FÍSICA',
    importance: 96,
    status: EventStatus.STABLE,
    parents: [],
    children: [],
    causes: [],
    consequences: [],
    position: { x: 250, y: 100 },
  };

  it('generates realistic, non-fictional analysis for rocketry and propulsion without emojis', () => {
    const analysis = ExpertCounterfactualEngine.generateRealisticAnalysis(
      rocketEvent,
      [marsEvent],
      dummyUniverse
    );

    expect(analysis.targetEventTitle).toBe('First Recorded Rocket Launch');
    expect(analysis.targetEventYear).toBe(9);
    expect(analysis.epistemicDelayYears).toBeGreaterThan(50);
    expect(analysis.realisticHistoricalSummary).toContain('interrompe o primeiro desenvolvimento prático da propulsão');
    expect(analysis.expertOpinions.length).toBe(3);
    expect(analysis.cascadingConsequences.length).toBe(1);
    expect(analysis.cascadingConsequences[0].historicalStatus).toBe('CANCELADO NA ÉPOCA');
    expect(analysis.methodologyNote).toContain('Análise contrafactual rigorosa');

    // Sources verification
    expect(analysis.detailedAIDeduction.primarySources.length).toBeGreaterThan(0);
    expect(analysis.detailedAIDeduction.extractionOrigin).toContain('NASA');
    expect(analysis.detailedAIDeduction.mostProbableScenario).toContain('Tsiolkovsky');

    // Emoji check
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(analysis.realisticHistoricalSummary)).toBe(false);
    expect(emojiRegex.test(analysis.consensusVerdict)).toBe(false);
  });

  it('generates verified sources for Radar Technology', () => {
    const analysis = ExpertCounterfactualEngine.generateRealisticAnalysis(
      radarEvent,
      [],
      dummyUniverse
    );

    expect(analysis.detailedAIDeduction.primarySources.some(s => s.title.includes('MIT Radiation Laboratory'))).toBe(true);
    expect(analysis.detailedAIDeduction.extractionOrigin).toContain('MIT Radiation Laboratory');
    expect(analysis.detailedAIDeduction.probabilityScore).toBeGreaterThanOrEqual(90);
  });

  it('generates verified sources for Michelson-Morley Experiment', () => {
    const analysis = ExpertCounterfactualEngine.generateRealisticAnalysis(
      michelsonEvent,
      [],
      dummyUniverse
    );

    expect(analysis.detailedAIDeduction.primarySources.some(s => s.title.includes('Luminiferous Ether'))).toBe(true);
    expect(analysis.detailedAIDeduction.extractionOrigin).toContain('American Journal of Science');
  });

  it('formats KaTeX mathematical equations inside specialist opinions without emojis', () => {
    const analysis = ExpertCounterfactualEngine.generateRealisticAnalysis(
      michelsonEvent,
      [],
      dummyUniverse
    );

    const stern = analysis.expertOpinions.find(o => o.specialistId === 'stern');
    expect(stern?.analysis).toContain('$');
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(stern?.analysis || '')).toBe(false);
  });

  it('generates academic BibTeX, LaTeX, and Markdown dossiers correctly', () => {
    const analysis = ExpertCounterfactualEngine.generateRealisticAnalysis(
      radarEvent,
      [],
      dummyUniverse
    );

    const bibtex = ExpertCounterfactualEngine.generateBibTeX(analysis, radarEvent);
    expect(bibtex).toContain('@article{');
    expect(bibtex).toContain('title');
    expect(bibtex).toContain('MIT');

    const latex = ExpertCounterfactualEngine.generateLaTeX(analysis, radarEvent);
    expect(latex).toContain('\\documentclass');
    expect(latex).toContain('\\begin{abstract}');
    expect(latex).toContain('\\begin{thebibliography}');
    expect(latex).toContain(radarEvent.title);

    const markdown = ExpertCounterfactualEngine.generateMarkdown(analysis, radarEvent);
    expect(markdown).toContain('# Dossiê de Causalidade Histórica:');
    expect(markdown).toContain('| Documento |');
    expect(markdown).toContain(radarEvent.title);
  });

  it('answers direct specialist inquiries realistically without fiction and with 0 emojis', () => {
    const analysis = ExpertCounterfactualEngine.generateRealisticAnalysis(
      radarEvent,
      [],
      dummyUniverse
    );

    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;

    const answerStern = ExpertCounterfactualEngine.answerSpecialistInquiry(
      'stern',
      'Como a aviação e o voo noturno seriam impactados?',
      analysis,
      radarEvent
    );
    expect(answerStern).toContain('instrumentação de voo');
    expect(emojiRegex.test(answerStern)).toBe(false);

    const answerPendelton = ExpertCounterfactualEngine.answerSpecialistInquiry(
      'pendelton',
      'Qual seria o impacto na medicina e hospitais?',
      analysis,
      radarEvent
    );
    expect(answerPendelton).toContain('medicina');
    expect(emojiRegex.test(answerPendelton)).toBe(false);

    const answerMendoza = ExpertCounterfactualEngine.answerSpecialistInquiry(
      'mendoza',
      'Como a computação e chips seriam afetados?',
      analysis,
      radarEvent
    );
    expect(answerMendoza).toContain('grafo');
    expect(emojiRegex.test(answerMendoza)).toBe(false);
  });
});

