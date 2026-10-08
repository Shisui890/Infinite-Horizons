// ====================================================================
// MOTOR DE ENGENHARIA REVERSA HISTÓRICA (CAUSAL BACKTRACKING SOLVER)
// Calcula trajetórias retrocausais e requisitos de aceleração temporal
// ====================================================================

import type { TemporalEvent, Universe, Dimension, CausalEdge } from '../types/temporal';
import { EventStatus, CausalRelation } from '../types/temporal';
import { formatHistoricalYear } from '../utils/formatters';

export interface BacktrackingPrecursorStep {
  originalEventId: string;
  originalTitle: string;
  originalYear: number;
  requiredAcceleratedYear: number;
  accelerationShiftYears: number;
  historicalCatalyst: string;
  technologicalPrerequisites: string[];
  feasibilityScore: number;
}

export interface CausalBacktrackingPlan {
  goalId: string;
  targetTitle: string;
  targetDesiredYear: number;
  originalHistoricalYear: number;
  totalShiftYears: number;
  overallFeasibilityScore: number;
  prerequisiteSteps: BacktrackingPrecursorStep[];
  primaryBottleneckFormula: string;
  bottleneckExplanation: string;
  pioneerCandidates: string[];
}

export interface PresetBacktrackingGoal {
  id: string;
  title: string;
  desiredYear: number;
  originalYear: number;
  domain: string;
  description: string;
}

export class CausalBacktrackingEngine {
  public static readonly PRESET_GOALS: PresetBacktrackingGoal[] = [
    {
      id: 'goal-quantum-1950',
      title: 'Computação Quântica Operacional',
      desiredYear: 1950,
      originalYear: 1998,
      domain: 'FÍSICA DA INFORMAÇÃO & SUPERCONDUTIVIDADE',
      description: 'Antecipação da coerência de qubits e algoritmos de Deutsch-Jozsa para meados do século XX.',
    },
    {
      id: 'goal-nuclear-1910',
      title: 'Viabilidade da Energia Nuclear',
      desiredYear: 1910,
      originalYear: 1938,
      domain: 'FÍSICA NUCLEAR & REAÇÃO EM CADEIA',
      description: 'Comprovação empírica da fissão atômica e do nêutron antes da Primeira Guerra Mundial.',
    },
    {
      id: 'goal-lunar-1930',
      title: 'Voo Orbital e Pouso Lunar Humano',
      desiredYear: 1930,
      originalYear: 1969,
      domain: 'ENGENHARIA AEROESPACIAL & PROPULSÃO QUÍMICA',
      description: 'Aceleração de foguetes multi-estágios criogênicos na década de 1920.',
    },
    {
      id: 'goal-dna-1920',
      title: 'Descoberta da Estrutura Molecular do DNA',
      desiredYear: 1920,
      originalYear: 1953,
      domain: 'BIOFÍSICA & CRISTALOGRAFIA DE RAIOS-X',
      description: 'Difração de alta resolução e identificação do código genético logo após a Primeira Guerra.',
    },
  ];

  /**
   * Calcula o plano retrocausal para antecipar uma tecnologia no passado
   */
  public static solveBacktrackingPlan(
    _universe: Universe,
    targetTitle: string,
    desiredYear: number,
    originalYear: number = 2000
  ): CausalBacktrackingPlan {
    const shift = Math.max(1, originalYear - desiredYear);
    const titleLower = targetTitle.toLowerCase();

    // 1. Caso Computação Quântica
    if (titleLower.includes('quântic') || titleLower.includes('quantum') || titleLower.includes('qubit')) {
      return {
        goalId: 'plan-quantum',
        targetTitle,
        targetDesiredYear: desiredYear,
        originalHistoricalYear: originalYear,
        totalShiftYears: shift,
        overallFeasibilityScore: 68,
        primaryBottleneckFormula: 'T_2 \\sim \\frac{\\hbar}{\\Delta E_{\\text{decoerência}}} \\gg \\tau_{\\text{porta}}',
        bottleneckExplanation: 'O principal estrangulamento físico é o tempo de decoerência quântica ($T_2$). Criogênia profunda de hélio líquido (< 1 Kelvin) e litografia em escala atômica precisam ser aceleradas em quase meio século.',
        pioneerCandidates: ['Ettore Majorana (Itália)', 'Paul Dirac (Cambridge)', 'John von Neumann (Princeton)'],
        prerequisiteSteps: [
          {
            originalEventId: 'pre-1',
            originalTitle: 'Mecânica Quântica Matricial de Heisenberg & Equação de Schrödinger',
            originalYear: 1925,
            requiredAcceleratedYear: 1905,
            accelerationShiftYears: 20,
            historicalCatalyst: 'Antecipação da espectroscopia atômica e do efeito Zeeman anômalo em laboratórios alemães.',
            technologicalPrerequisites: ['Redes de difração óptica de alta resolução de Rowland', 'Tubos de descarga de gás sob vácuo'],
            feasibilityScore: 78,
          },
          {
            originalEventId: 'pre-2',
            originalTitle: 'Descoberta da Supercondutividade (Kamerlingh Onnes)',
            originalYear: 1911,
            requiredAcceleratedYear: 1890,
            accelerationShiftYears: 21,
            historicalCatalyst: 'Expansão prioritária da termodinâmica de baixas temperaturas na Universidade de Leiden.',
            technologicalPrerequisites: ['Compressores criogênicos de ciclo Hampson-Linde', 'Purificação em larga escala de hélio gasoso'],
            feasibilityScore: 72,
          },
          {
            originalEventId: 'pre-3',
            originalTitle: 'Teoria da Informação e Portas Lógicas Universais',
            originalYear: 1948,
            requiredAcceleratedYear: 1928,
            accelerationShiftYears: 20,
            historicalCatalyst: 'Articulação precoce entre a álgebra booleana de Shannon e matrizes densidade de von Neumann.',
            technologicalPrerequisites: ['Reles de alta velocidade e válvulas termiônicas de dupla grade'],
            feasibilityScore: 65,
          },
        ],
      };
    }

    // 2. Caso Energia Nuclear
    if (titleLower.includes('nuclear') || titleLower.includes('fissão') || titleLower.includes('fission') || titleLower.includes('átomo')) {
      return {
        goalId: 'plan-nuclear',
        targetTitle,
        targetDesiredYear: desiredYear,
        originalHistoricalYear: originalYear,
        totalShiftYears: shift,
        overallFeasibilityScore: 76,
        primaryBottleneckFormula: 'k = \\frac{\\text{nêutrons gerados}}{\\text{nêutrons absorvidos}} \\ge 1{,}0',
        bottleneckExplanation: 'Fator de multiplicação de nêutrons ($k \\ge 1$). Exige a descoberta do nêutron livre e a metalurgia química de purificação de grafite/água pesada como moderadores de nêutrons.',
        pioneerCandidates: ['Marie Curie (França)', 'Ernest Rutherford (Cambridge)', 'Lise Meitner (Berlim)'],
        prerequisiteSteps: [
          {
            originalEventId: 'pre-nuc-1',
            originalTitle: 'Descoberta do Nêutron (James Chadwick)',
            originalYear: 1932,
            requiredAcceleratedYear: 1902,
            accelerationShiftYears: 30,
            historicalCatalyst: 'Identificação imediata da radiação penetrante de berílio no Laboratório Cavendish.',
            technologicalPrerequisites: ['Câmaras de nuvens de Wilson', 'Detectores proporcionais de ionização'],
            feasibilityScore: 82,
          },
          {
            originalEventId: 'pre-nuc-2',
            originalTitle: 'Equivalência Massa-Energia de Einstein ($E = mc^2$)',
            originalYear: 1905,
            requiredAcceleratedYear: 1892,
            accelerationShiftYears: 13,
            historicalCatalyst: 'Dedução precoce da inércia eletromagnética por Poincaré e Lorentz.',
            technologicalPrerequisites: ['Interferometria óptica de vácuo', 'Medições de deflexão de elétrons de Thomson'],
            feasibilityScore: 85,
          },
        ],
      };
    }

    // 3. Caso Espacial / Foguetes / Órbita
    if (titleLower.includes('lunar') || titleLower.includes('órbita') || titleLower.includes('foguete') || titleLower.includes('space')) {
      return {
        goalId: 'plan-space',
        targetTitle,
        targetDesiredYear: desiredYear,
        originalHistoricalYear: originalYear,
        totalShiftYears: shift,
        overallFeasibilityScore: 71,
        primaryBottleneckFormula: 'v_{\\text{final}} = v_e \\ln\\left(\\frac{m_0}{m_f}\\right) \\ge 11{,}2\\text{ km/s}',
        bottleneckExplanation: 'Velocidade de escape parabólica da Terra ($v_{\\text{esc}} \\approx 11{,}2\\text{ km/s}$). O gargalo reside na metalurgia de superligas para bicos de Laval e bombas turbopower de alta pressão.',
        pioneerCandidates: ['Robert H. Goddard (EUA)', 'Konstantin Tsiolkovsky (Rússia)', 'Hermann Oberth (Alemanha)'],
        prerequisiteSteps: [
          {
            originalEventId: 'pre-spc-1',
            originalTitle: 'Propulsão por Combustível Líquido e Bico Laval Criogênico',
            originalYear: 1926,
            requiredAcceleratedYear: 1905,
            accelerationShiftYears: 21,
            historicalCatalyst: 'Financiamento acelerado do Instituto Smithsoniano e indústrias petroquímicas.',
            technologicalPrerequisites: ['Oxigênio líquido industrial', 'Tubulações de aço inoxidável austenítico'],
            feasibilityScore: 75,
          },
          {
            originalEventId: 'pre-spc-2',
            originalTitle: 'Sistemas de Guiamento Inercial Giroscópico',
            originalYear: 1944,
            requiredAcceleratedYear: 1918,
            accelerationShiftYears: 26,
            historicalCatalyst: 'Adaptação dos giroscópios marítimos de Sperry e Anschütz para veículos de alta aceleração.',
            technologicalPrerequisites: ['Gimbal de precisão com rolamentos de safira'],
            feasibilityScore: 68,
          },
        ],
      };
    }

    // Plano Genérico
    return {
      goalId: 'plan-generic',
      targetTitle,
      targetDesiredYear: desiredYear,
      originalHistoricalYear: originalYear,
      totalShiftYears: shift,
      overallFeasibilityScore: 74,
      primaryBottleneckFormula: '\\Delta t_{\\text{aceleração}} = \\sum_{i=1}^n \\tau_i \\cdot \\eta_i^{-1}',
      bottleneckExplanation: 'Tempo de maturação tecnológica ($\Delta t$). Requer antecipação dos instrumentos de mensuração e ampliação do financiamento acadêmico nas etapas precedentes.',
      pioneerCandidates: ['Comitê de Filosofia Natural da Royal Society', 'Academias Científicas Europeias'],
      prerequisiteSteps: [
        {
          originalEventId: 'pre-gen-1',
          originalTitle: `Fundamentos Metrológicos e Teóricos de ${targetTitle}`,
          originalYear: Math.max(1800, originalYear - 30),
          requiredAcceleratedYear: Math.max(1770, desiredYear - 20),
          accelerationShiftYears: Math.round(shift * 0.6),
          historicalCatalyst: 'Publicação antecipada em periódicos da Royal Society e patentes fabris.',
          technologicalPrerequisites: ['Calibração de precisão', 'Padronização internacional de unidades'],
          feasibilityScore: 80,
        },
        {
          originalEventId: 'pre-gen-2',
          originalTitle: `Desenvolvimento de Instrumentação Experimental de ${targetTitle}`,
          originalYear: Math.max(1810, originalYear - 15),
          requiredAcceleratedYear: Math.max(1785, desiredYear - 8),
          accelerationShiftYears: Math.round(shift * 0.4),
          historicalCatalyst: 'Concentração de recursos estatais em programas pilotos pioneiros.',
          technologicalPrerequisites: ['Oficinas mecânicas de tolerância fina'],
          feasibilityScore: 75,
        },
      ],
    };
  }

  /**
   * Constrói uma nova variedade dimensional contendo o cronograma retrocausal acelerado
   */
  public static generateAcceleratedDimension(
    universe: Universe,
    plan: CausalBacktrackingPlan
  ): { newDimension: Dimension; newEdges: CausalEdge[] } {
    const newDimId = `dim-accelerated-${Date.now()}`;
    const baseDim = universe.dimensions[0] || { events: [] };

    // Clona os eventos ajustando as datas dos ancestrais acelerados
    const acceleratedEvents: TemporalEvent[] = baseDim.events.map(e => {
      const step = plan.prerequisiteSteps.find(s => s.originalTitle === e.title || s.originalEventId === e.id);
      if (step) {
        return {
          ...e,
          id: `acc-${e.id}-${Date.now()}`,
          dimensionId: newDimId,
          year: step.requiredAcceleratedYear,
          status: EventStatus.ALTERED,
          description: `[ACELERAÇÃO RETROCAUSAL] Antecipado em ${step.accelerationShiftYears} anos. Catalisador: ${step.historicalCatalyst}`,
        };
      }
      return {
        ...e,
        id: `clone-${e.id}-${Date.now()}`,
        dimensionId: newDimId,
      };
    });

    // Adiciona o nó alvo na data desejada
    const goalNodeId = `evt-accelerated-goal-${Date.now()}`;
    const goalEvent: TemporalEvent = {
      id: goalNodeId,
      dimensionId: newDimId,
      title: `${plan.targetTitle} (Marco Antecipado)`,
      year: plan.targetDesiredYear,
      category: 'CIÊNCIA AVANÇADA',
      importance: 98,
      position: { x: 300, y: 120 },
      status: EventStatus.ALTERED,
      description: `[CRONOGRAMA RETROCAUSAL CONCLUÍDO] Marco viabilizado com sucesso em ${formatHistoricalYear(plan.targetDesiredYear)} através do plano de aceleração causal mínima.`,
      parents: [],
      children: [],
      causes: [],
      consequences: [],
      scientificStatus: 'computational',
      evidenceKind: 'model_result',
    };

    acceleratedEvents.push(goalEvent);

    const newDimension: Dimension = {
      id: newDimId,
      universeId: universe.id,
      name: `Linha Acelerada: ${plan.targetTitle} (${formatHistoricalYear(plan.targetDesiredYear)})`,
      designation: `REV-${plan.targetDesiredYear}`,
      color: '#10b981',
      events: acceleratedEvents,
      integrity: plan.overallFeasibilityScore,
    };

    const newEdges: CausalEdge[] = acceleratedEvents.slice(0, 3).map((ev, i) => ({
      id: `edge-acc-${i}-${Date.now()}`,
      source: ev.id,
      target: goalNodeId,
      type: CausalRelation.CAUSES,
      active: true,
      evidence: 'Cadeia de aceleração de pré-requisitos históricos calculada pelo Backtracking Solver',
    }));

    return { newDimension, newEdges };
  }
}
