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
      // Dimensão 1: Continuum Eletromagnético, Relativístico & Cosmologia Estabelecida
      {
        id: 'evt-099',
        dimensionId: 'dim-omega-01',
        title: 'Equações de Maxwell & Eletrodinâmica Clássica',
        description: 'James Clerk Maxwell unifica eletricidade, magnetismo e óptica em quatro equações diferenciais. Demonstra que a luz é uma onda eletromagnética que se propaga no vácuo com velocidade constante invariante c = 1/√(μ₀ε₀).',
        year: 1865,
        category: 'ELETROMAGNETISMO',
        importance: 98,
        position: { x: 40, y: 100 },
        status: EventStatus.STABLE,
        scientificStatus: 'proven',
        doi: '10.1098/rstl.1865.0008',
        academicCitation: 'Maxwell, J. C. (1865). A Dynamical Theory of the Electromagnetic Field. Phil. Trans. R. Soc. Lond.',
        parents: [],
        children: ['evt-100'],
        causes: [],
        consequences: ['evt-100'],
        isAnchor: true,
        sourceUrl: 'https://royalsocietypublishing.org/doi/10.1098/rstl.1865.0008',
        evidenceKind: 'documented_fact',
        evidenceConfidence: 100,
        uncertainty: 'Fundamento que estabeleceu a constância da velocidade da luz como lei universal da física.',
      },
      {
        id: 'evt-100',
        dimensionId: 'dim-omega-01',
        title: 'Relatividade Especial & Invariância de Lorentz',
        description: 'Albert Einstein formula a Relatividade Especial: as leis físicas e a velocidade da luz c são invariantes em todos os referenciais inerciais. Unifica espaço e tempo no continuum 4D de Minkowski (ds² = -c²dt² + dx² + dy² + dz²) e deduz E = mc².',
        year: 1905,
        category: 'FÍSICA TEÓRICA',
        importance: 100,
        position: { x: 75, y: 220 },
        status: EventStatus.STABLE,
        scientificStatus: 'proven',
        doi: '10.1002/andp.19053221004',
        academicCitation: 'Einstein, A. (1905). Zur Elektrodynamik bewegter Körper. Annalen der Physik, 322(10), 891–921.',
        parents: ['evt-099'],
        children: ['evt-101'],
        causes: ['evt-099'],
        consequences: ['evt-101'],
        isAnchor: true,
        sourceUrl: 'https://einsteinpapers.press.princeton.edu/vol2-doc/311',
        evidenceKind: 'documented_fact',
        evidenceConfidence: 100,
        uncertainty: 'Comprovada experimentalmente com precisão extrema em colisores de partículas e satélites.',
      },
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
        scientificStatus: 'proven',
        doi: '10.1002/andp.19163540702',
        academicCitation: 'Einstein, A. (1916). Die Grundlage der allgemeinen Relativitätstheorie. Annalen der Physik, 354(7), 769–822.',
        parents: ['evt-100'],
        children: ['evt-102', 'evt-103'],
        causes: ['evt-100'],
        consequences: ['evt-102', 'evt-103'],
        isAnchor: true,
        sourceUrl: 'https://einsteinpapers.press.princeton.edu/vol6-doc/225',
        evidenceKind: 'documented_fact',
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
        scientificStatus: 'theoretical_untested',
        doi: '10.1103/PhysRev.48.73',
        academicCitation: 'Einstein, A., & Rosen, N. (1935). The Particle Problem in the General Theory of Relativity. Phys. Rev., 48(1), 73.',
        parents: ['evt-101'],
        children: ['evt-107'],
        causes: ['evt-101'],
        consequences: ['evt-107'],
        sourceUrl: 'https://journals.aps.org/pr/abstract/10.1103/PhysRev.48.73',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 90,
        uncertainty: 'Buracos de minhoca exigem matéria exótica com densidade de energia negativa para estabilização macroscópica.',
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
        scientificStatus: 'proven',
        doi: '10.1086/148307',
        academicCitation: 'Penzias, A. A., & Wilson, R. W. (1965). A Measurement of Excess Antenna Temperature at 4080 Mc/s. Astrophys. J., 142, 419.',
        parents: ['evt-101'],
        children: ['evt-104'],
        causes: ['evt-101'],
        consequences: ['evt-104'],
        sourceUrl: 'https://iopscience.iop.org/article/10.1086/148307',
        evidenceKind: 'documented_fact',
        evidenceConfidence: 100,
        uncertainty: 'Observações de satélites COBE, WMAP e Planck estabeleceram os parâmetros cosmológicos padrão com alta precisão.',
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
        scientificStatus: 'proven',
        doi: '10.1086/300499',
        academicCitation: 'Riess, A. G., et al. (1998). Observational Evidence from Supernovae for an Accelerating Universe. Astron. J., 116(3), 1009.',
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
        scientificStatus: 'proven',
        doi: '10.1103/PhysRevLett.116.061102',
        academicCitation: 'Abbott, B. P., et al. (LIGO/Virgo). (2016). Observation of Gravitational Waves from a Binary Black Hole Merger. Phys. Rev. Lett., 116(6), 061102.',
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
        scientificStatus: 'proven',
        doi: '10.3847/2041-8213/ab0ec7',
        academicCitation: 'Akiyama, K., et al. (EHT Collaboration). (2019). First M87 Event Horizon Telescope Results. I. Astrophys. J. Lett., 875(1), L1.',
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
        scientificStatus: 'theoretical_untested',
        doi: '10.1002/prop.201300020',
        academicCitation: 'Maldacena, J., & Susskind, L. (2013). Cool horizons for entangled black holes. Fortschritte der Physik, 61(9), 781–811.',
        parents: ['evt-102', 'evt-106'],
        children: [],
        causes: ['evt-102', 'evt-106'],
        consequences: [],
        isAnchor: true,
        sourceUrl: 'https://arxiv.org/abs/1306.0533',
        evidenceKind: 'scientific_theory',
        evidenceConfidence: 85,
        uncertainty: 'Artigo seminal sobre geometria emergente de estados emaranhados.',
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
        scientificStatus: 'theoretical_untested',
        doi: '10.1016/0370-2693(84)91565-X',
        academicCitation: 'Green, M. B., & Schwarz, J. H. (1984). Anomaly cancellations in supersymmetric D=10 gauge theory. Phys. Lett. B, 149(1-3), 117–122.',
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
        scientificStatus: 'theoretical_untested',
        doi: '10.1016/0550-3213(95)00158-O',
        academicCitation: 'Witten, E. (1995). String theory dynamics in various dimensions. Nucl. Phys. B, 443(1-2), 85–126.',
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
        scientificStatus: 'theoretical_untested',
        doi: '10.1023/A:1026654312961',
        academicCitation: 'Maldacena, J. (1999). The Large-N Limit of Superconformal Field Theories and Supergravity. Int. J. Theor. Phys., 38, 1113.',
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
        scientificStatus: 'theoretical_untested',
        doi: '10.1103/PhysRevD.68.046005',
        academicCitation: 'Susskind, L. (2003). The Anthropic Landscape of String Theory. arXiv:hep-th/0302219.',
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
      { id: 'edg-0a', source: 'evt-099', target: 'evt-100', type: CausalRelation.CAUSES, active: true, evidence: 'A invariância da velocidade da luz nas equações de Maxwell levou à formulação da Relatividade Especial.' },
      { id: 'edg-0b', source: 'evt-100', target: 'evt-101', type: CausalRelation.CAUSES, active: true, evidence: 'A incompatibilidade entre gravitação newtoniana e Relatividade Especial motivou Einstein a formular a curvatura do espaço-tempo.' },
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
