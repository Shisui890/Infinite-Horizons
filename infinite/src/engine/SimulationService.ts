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
      name: 'Continuum Relativístico (Relatividade & ΛCDM)',
      designation: 'Ω-01',
      color: '#00d4ff',
      events: [],
      integrity: 100,
    };

    const dim2: Dimension = {
      id: 'dim-omega-02',
      universeId: 'univ-01',
      name: 'Variedades de Calabi-Yau (Teoria M & 11D)',
      designation: 'Ω-02',
      color: '#a855f7',
      events: [],
      integrity: 100,
    };

    const events: TemporalEvent[] = [
      // Dimensão 1: Continuum Relativístico & Cosmologia Estabelecida
      {
        id: 'evt-101',
        dimensionId: 'dim-omega-01',
        title: 'Equações de Campo de Einstein (Relatividade Geral)',
        description: 'Albert Einstein formula a Relatividade Geral: a gravitação não é uma força clássica, mas a curvatura dinâmica do espaço-tempo quadridimensional induzida pelo tensor de energia-momento (G_μν + Λg_μν = 8πG/c⁴ T_μν).',
        year: 1915,
        category: 'FÍSICA TEÓRICA',
        importance: 99,
        position: { x: 100, y: 110 },
        status: EventStatus.STABLE,
        parents: [],
        children: ['evt-102', 'evt-103'],
        causes: [],
        consequences: ['evt-102', 'evt-103'],
        isAnchor: true,
        sourceUrl: 'https://einsteinpapers.press.princeton.edu/vol6-doc/225',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 99,
        uncertainty: 'Teoria confirmada com precisão nanométrica em regimes de campo fraco e extremo.',
      },
      {
        id: 'evt-102',
        dimensionId: 'dim-omega-01',
        title: 'Pontes de Einstein-Rosen & Paradoxo EPR',
        description: 'Publicação das pontes no espaço-tempo (túneis geométricos que conectam pontos remotos do cosmos) e do emaranhamento quântico (estados correlacionados não-locais que desafiam o realismo local).',
        year: 1935,
        category: 'MECÂNICA QUÂNTICA',
        importance: 93,
        position: { x: 230, y: 230 },
        status: EventStatus.STABLE,
        parents: ['evt-101'],
        children: ['evt-107'],
        causes: ['evt-101'],
        consequences: ['evt-107'],
        sourceUrl: 'https://journals.aps.org/pr/abstract/10.1103/PhysRev.48.73',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 90,
        uncertainty: 'Buracos de minhoca exigem matéria exótica com densidade de energia negativa para estabilização.',
      },
      {
        id: 'evt-103',
        dimensionId: 'dim-omega-01',
        title: 'Descoberta da Radiação Cósmica de Fundo (CMB)',
        description: 'Arno Penzias e Robert Wilson detectam o fundo térmico primordial isotrópico de 2.725 K, comprovando que o cosmos emergiu de um estado ultra-quente e denso no Big Bang.',
        year: 1965,
        category: 'COSMOLOGIA',
        importance: 94,
        position: { x: 380, y: 100 },
        status: EventStatus.STABLE,
        parents: ['evt-101'],
        children: ['evt-104'],
        causes: ['evt-101'],
        consequences: ['evt-104'],
        sourceUrl: 'https://iopscience.iop.org/article/10.1086/148307',
        evidenceKind: 'documented_fact',
        evidenceConfidence: 100,
        uncertainty: 'Observações de satélites COBE, WMAP e Planck estabeleceram os parâmetros cosmológicos padrão.',
      },
      {
        id: 'evt-104',
        dimensionId: 'dim-omega-01',
        title: 'Evidência da Expansão Acelerada (Energia Escura)',
        description: 'Medições de supernovas distantes do Tipo Ia demonstram que a expansão do tecido cósmico está acelerando, regida por uma pressão negativa de energia de vácuo (constante cosmológica Λ).',
        year: 1998,
        category: 'OBSERVAÇÃO',
        importance: 95,
        position: { x: 540, y: 220 },
        status: EventStatus.STABLE,
        parents: ['evt-103'],
        children: ['evt-105'],
        causes: ['evt-103'],
        consequences: ['evt-105'],
        sourceUrl: 'https://iopscience.iop.org/article/10.1086/300499',
        evidenceKind: 'documented_fact',
        evidenceConfidence: 98,
      },
      {
        id: 'evt-105',
        dimensionId: 'dim-omega-01',
        title: 'Detecção Direta de Ondas Gravitacionais (LIGO)',
        description: 'A colaboração LIGO/Virgo registra o evento GW150914: perturbações métricas no espaço-tempo geradas pela fusão de buracos negros binários a 1.3 bilhão de anos-luz.',
        year: 2015,
        category: 'ASTROFÍSICA',
        importance: 98,
        position: { x: 680, y: 85 },
        status: EventStatus.STABLE,
        parents: ['evt-104'],
        children: ['evt-106'],
        causes: ['evt-104'],
        consequences: ['evt-106'],
        isAnchor: true,
        sourceUrl: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.116.061102',
        evidenceKind: 'documented_fact',
        evidenceConfidence: 100,
      },
      {
        id: 'evt-106',
        dimensionId: 'dim-omega-01',
        title: 'Imagem do Horizonte de Eventos de M87* (EHT)',
        description: 'O Event Horizon Telescope reconstrói a primeira imagem do anel de emissão e sombra gravitacional de um buraco negro supermassivo, validando a métrica de Kerr sob gravidade extrema.',
        year: 2019,
        category: 'OBSERVAÇÃO',
        importance: 95,
        position: { x: 800, y: 240 },
        status: EventStatus.STABLE,
        parents: ['evt-105'],
        children: ['evt-107'],
        causes: ['evt-105'],
        consequences: ['evt-107'],
        sourceUrl: 'https://iopscience.iop.org/article/10.3847/2041-8213/ab0ec7',
        evidenceKind: 'documented_fact',
        evidenceConfidence: 98,
      },
      {
        id: 'evt-107',
        dimensionId: 'dim-omega-01',
        title: 'Conjectura Holográfica ER = EPR (Susskind & Maldacena)',
        description: 'Leonard Susskind e Juan Maldacena propõem que o emaranhamento quântico fundamental (EPR) e as pontes métricas no espaço-tempo (ER) são manifestações equivalentes da gravitação quântica holográfica.',
        year: 2013,
        category: 'GRAVITAÇÃO QUÂNTICA',
        importance: 98,
        position: { x: 640, y: 160 },
        status: EventStatus.STABLE,
        parents: ['evt-102', 'evt-106'],
        children: [],
        causes: ['evt-102', 'evt-106'],
        consequences: [],
        isAnchor: true,
        sourceUrl: 'https://arxiv.org/abs/1306.0533',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 85,
        uncertainty: 'Artigo seminal "Cool horizons for entangled black holes" (Progress of Physics, 2013).',
      },

      // Dimensão 2: Variedades de Calabi-Yau & Teoria das Supercordas
      {
        id: 'evt-201',
        dimensionId: 'dim-omega-02',
        title: 'Primeira Revolução das Supercordas (Green-Schwarz)',
        description: 'Demonstração de que a substituição de partículas pontuais por filamentos vibrantes unidimensionais na escala de Planck (~10⁻³⁵ m) cancela todas as anomalias quânticas em 10 dimensões.',
        year: 1984,
        category: 'SUPERSTRING THEORY',
        importance: 90,
        position: { x: 370, y: 110 },
        status: EventStatus.STABLE,
        parents: [],
        children: ['evt-202'],
        causes: [],
        consequences: ['evt-202'],
        sourceUrl: 'https://www.sciencedirect.com/science/article/pii/037026938491565X',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 85,
      },
      {
        id: 'evt-202',
        dimensionId: 'dim-omega-02',
        title: 'Segunda Revolução das Cordas & Teoria M (11D)',
        description: 'Edward Witten unifica as 5 teorias de supercordas através de dualidades não-perturbativas (S e T) em uma única teoria em 11 dimensões de espaço-tempo povoada por D-branas estendidas.',
        year: 1995,
        category: 'TEORIA M (11D)',
        importance: 98,
        position: { x: 480, y: 230 },
        status: EventStatus.STABLE,
        parents: ['evt-201'],
        children: ['evt-203'],
        causes: ['evt-201'],
        consequences: ['evt-203'],
        isAnchor: true,
        sourceUrl: 'https://arxiv.org/abs/hep-th/9503124',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 80,
      },
      {
        id: 'evt-203',
        dimensionId: 'dim-omega-02',
        title: 'Correspondência Holográfica AdS/CFT (Maldacena)',
        description: 'Juan Maldacena formula a dualidade exata onde a gravidade quântica de supercordas em 5 dimensões Anti-de Sitter é matematicamente equivalente a uma teoria de campos na fronteira 4D.',
        year: 1997,
        category: 'PRINCÍPIO HOLOGRÁFICO',
        importance: 96,
        position: { x: 550, y: 120 },
        status: EventStatus.STABLE,
        parents: ['evt-202'],
        children: ['evt-204'],
        causes: ['evt-202'],
        consequences: ['evt-204'],
        sourceUrl: 'https://arxiv.org/abs/hep-th/9711200',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 88,
      },
      {
        id: 'evt-204',
        dimensionId: 'dim-omega-02',
        title: 'Paisagem de Vácuos de Calabi-Yau (String Landscape)',
        description: 'A compactificação geométrica das 6 dimensões extras em variedades de Calabi-Yau gera cerca de 10⁵⁰⁰ configurações de vácuo estáveis, fundamentando a física do multiverso de cordas.',
        year: 2003,
        category: 'MULTIVERSO DE CORDAS',
        importance: 88,
        position: { x: 650, y: 240 },
        status: EventStatus.STABLE,
        parents: ['evt-203'],
        children: [],
        causes: ['evt-203'],
        consequences: [],
        sourceUrl: 'https://arxiv.org/abs/hep-th/0301240',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 70,
        uncertainty: 'A enorme quantidade de vácuos fundamenta a variabilidade de constantes físicas.',
      },
    ];

    dim1.events = events.filter(e => e.dimensionId === dim1.id);
    dim2.events = events.filter(e => e.dimensionId === dim2.id);

    const edges: CausalEdge[] = [
      { id: 'edg-1', source: 'evt-101', target: 'evt-102', type: CausalRelation.CAUSES, active: true, evidence: 'Geometria do espaço-tempo fundamenta buracos de minhoca e cones de luz.' },
      { id: 'edg-2', source: 'evt-101', target: 'evt-103', type: CausalRelation.ENABLES, active: true, evidence: 'Modelos cosmológicos de Friedmann-Lemaître decorrem das equações de Einstein.' },
      { id: 'edg-3', source: 'evt-103', target: 'evt-104', type: CausalRelation.CAUSES, active: true, evidence: 'Parâmetros de densidade da CMB orientaram a busca por aceleração via supernovas.' },
      { id: 'edg-4', source: 'evt-104', target: 'evt-105', type: CausalRelation.ENABLES, active: true, evidence: 'Astronomia multimensageira apoiada na dinâmica do espaço-tempo acelerado.' },
      { id: 'edg-5', source: 'evt-105', target: 'evt-106', type: CausalRelation.CAUSES, active: true, evidence: 'Detecção de ondas de buracos negros estimulou o imageamento direto de horizontes.' },
      { id: 'edg-6', source: 'evt-106', target: 'evt-107', type: CausalRelation.ENABLES, active: true, evidence: 'Confirmação do horizonte térmico de buracos negros vincula termodinâmica à geometria.' },
      { id: 'edg-7', source: 'evt-102', target: 'evt-107', type: CausalRelation.CAUSES, active: true, evidence: 'Origem da correspondência entre micro-túneis ER e emaranhamento quântico EPR.' },
      // Relações em Supercordas
      { id: 'edg-8', source: 'evt-201', target: 'evt-202', type: CausalRelation.CAUSES, active: true, evidence: 'Cancelamento de anomalias abriu caminho para a unificação via dualidades em 11D.' },
      { id: 'edg-9', source: 'evt-202', target: 'evt-203', type: CausalRelation.ENABLES, active: true, evidence: 'Estruturas de D-branas da Teoria M serviram de substrato para a dualidade AdS/CFT.' },
      { id: 'edg-10', source: 'evt-203', target: 'evt-204', type: CausalRelation.CAUSES, active: true, evidence: 'O princípio holográfico permitiu calcular a estabilidade de vácuos no String Landscape.' },
    ];

    const travelers: Traveler[] = [
      {
        id: 'trv-001',
        name: 'Referencial Primário (Relatividade)',
        originDimensionId: 'dim-omega-01',
        originYear: 2019,
        currentDimensionId: 'dim-omega-01',
        currentYear: 2019,
        originEventId: 'evt-106',
        status: TravelerStatus.NORMAL,
        travelHistory: [],
      },
      {
        id: 'trv-002',
        name: 'Observador Quântico (11D)',
        originDimensionId: 'dim-omega-02',
        originYear: 1995,
        currentDimensionId: 'dim-omega-02',
        currentYear: 1995,
        originEventId: 'evt-202',
        status: TravelerStatus.NORMAL,
        travelHistory: [],
      },
    ];

    const universe: Universe = {
      id: 'univ-01',
      name: 'Cosmologia Relativística & Multiverso de Supercordas',
      description: 'Modelo de física fundamental que interconecta a Relatividade Geral de Einstein, cosmologia observacional do Big Bang, Teoria das Supercordas (10D) e Teoria M unificada (11D).',
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
        message: 'Modelo "Cosmologia Relativística & Multiverso de Supercordas" inicializado com sucesso (Integridade Temporal: 100%).',
        type: 'info',
      },
      {
        id: 'log-2',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Cones de luz de Minkowski calibrados: velocidade da luz c invariante em todas as geodésicas.',
        type: 'success',
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
