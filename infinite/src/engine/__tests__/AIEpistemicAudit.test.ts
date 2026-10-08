import { describe, it, expect } from 'vitest';
import { AITemporalService } from '../AITemporalService';
import { CausalBacktrackingEngine } from '../CausalBacktrackingEngine';
import { EventStatus, type TemporalEvent, type Universe } from '../../types/temporal';

describe('AITemporalService - Epistemic AI Scientific Audits', () => {
  AITemporalService.updateConfig({ apiKey: '', provider: 'builtin' });

  const dummyUniverse: Universe = {
    id: 'u-test',
    name: 'Universo de Teste',
    description: 'Teste',
    temporalIntegrity: 100,
    dimensions: [],
    travelers: [],
    edges: [],
    paradoxes: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('audits quantum computing backtracking with thermodynamic and materials rigor', async () => {
    const plan = CausalBacktrackingEngine.solveBacktrackingPlan(
      dummyUniverse,
      'Computação Quântica Operacional',
      1950,
      1998
    );

    const audit = await AITemporalService.auditBacktrackingWithAI(plan);

    expect(audit).toBeDefined();
    expect(audit.verdictScore).toBeGreaterThanOrEqual(50);
    expect(audit.thermodynamicAssessment).toContain('decoerência');
    expect(audit.entropyDeltaFormula).toContain('\\Delta S');
    expect(audit.lorentzInvarianceCheck).toContain('Lorentz');
    expect(audit.materialHurdles.length).toBeGreaterThanOrEqual(2);
    expect(audit.primaryAcademicSources.length).toBeGreaterThanOrEqual(2);
    expect(audit.primaryAcademicSources.some(s => s.author.includes('von Neumann'))).toBe(true);
  });

  it('audits nuclear energy backtracking with high feasibility and historical citations', async () => {
    const plan = CausalBacktrackingEngine.solveBacktrackingPlan(
      dummyUniverse,
      'Viabilidade da Energia Nuclear',
      1910,
      1938
    );

    const audit = await AITemporalService.auditBacktrackingWithAI(plan);

    expect(audit.verdict).toBe('approved');
    expect(audit.causalFeasibilityRatio).toBeGreaterThan(80);
    expect(audit.primaryAcademicSources.some(s => s.author.includes('Rutherford') || s.author.includes('Chadwick'))).toBe(true);
  });

  it('answers bypass engineering inquiry with period-appropriate technological methods', async () => {
    const plan = CausalBacktrackingEngine.solveBacktrackingPlan(
      dummyUniverse,
      'Computação Quântica Operacional',
      1950,
      1998
    );

    const answer = await AITemporalService.consultAIBacktrackingBypass(
      'Como substituir semicondutores de silício ultra-puro?',
      plan
    );

    expect(answer).toBeDefined();
    expect(answer).toContain('Análise do Comitê Histórico');
    expect(answer).toContain('válvulas termiônicas');
  });

  it('generates academic peer-review audit for an individual historical event', () => {
    const testEvent: TemporalEvent = {
      id: 'evt-1905',
      dimensionId: 'dim-alpha',
      title: 'Teoria da Relatividade Especial',
      year: 1905,
      category: 'FÍSICA TEÓRICA',
      importance: 95,
      position: { x: 0, y: 0 },
      status: EventStatus.STABLE,
      description: 'Artigo clássico de Albert Einstein sobre a eletrodinâmica dos corpos em movimento.',
      parents: [],
      children: [],
      causes: [],
      consequences: [],
      scientificStatus: 'proven',
      evidenceKind: 'documented_fact',
      doi: '10.1002/andp.19053221004',
      academicCitation: 'Albert Einstein (1905). Zur Elektrodynamik bewegter Körper.',
    };

    const audit = AITemporalService.auditEventScientificRigor(testEvent);

    expect(audit.verdict).toBe('approved');
    expect(audit.verdictScore).toBe(98);
    expect(audit.lorentzInvarianceCheck).toContain('Lorentz');
    expect(audit.primaryAcademicSources[0].doiOrCitation).toContain('10.1002/andp.19053221004');
  });
});
