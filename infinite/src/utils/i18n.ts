export type Language = 'pt' | 'en';

export const DICTIONARY = {
  pt: {
    // Header & Brand
    appTitle: 'Infinite Horizons',
    tagline: 'LABORATÓRIO DE FÍSICA TEÓRICA & CAUSALIDADE',
    laymanTagline: 'SIMULADOR DESCOMPLICADO DE VIAGEM NO TEMPO',
    home: 'Início',
    academic: 'Acadêmico',
    layman: 'Para Leigos',
    integrity: 'INTEGRIDADE (NOVIKOV)',
    laymanIntegrity: 'SAÚDE DO TEMPO',
    paradoxes: 'PARADOXOS',
    stable: 'ESTÁVEL',
    withoutParadox: 'SEM PARADOXOS',
    monteCarlo: 'Monte Carlo',
    presentation: 'Apresentação',
    slides: 'Slides',
    cones3D: 'Cones 3D',
    aiOracle: 'Oráculo IA',
    cliTerminal: '>_ CLI',
    challenges: 'Desafios',
    splitView: 'Comparador',
    addNode: '+ Nó',
    addObserver: '+ Obs',
    intervention: 'Intervenção',
    shareLink: 'Compartilhar Link',
    export: 'Exportar',
    linkCopied: 'Link do universo copiado para a área de transferência!',

    // Left Sidebar
    dimensionsTitle: 'VARIEDADES DIMENSIONAIS',
    laymanDimensionsTitle: 'LINHAS DO TEMPO',
    addNewDimension: '+ Nova (11D)',
    laymanAddNewDimension: '+ Nova Linha',
    geodesicNodes: 'nós de geodésica',
    laymanEvents: 'acontecimentos',
    coherence: 'coerência',
    laymanStability: 'estabilidade',
    observersTitle: 'SONDAS & OBSERVADORES',
    laymanObserversTitle: 'VIAJANTES NO TEMPO',
    coordinate: 'Coordenada: Ano',
    laymanCoordinate: 'Local: Ano',
    metricOrigin: 'Origem Métrico-Temporal: Ano',
    laymanMetricOrigin: 'Ano de Origem:',
    presentInYear: 'Presente no ano',
    observerCongruent: 'CONGRUENTE',
    observerWarp: 'EM CURVATURA',
    observerDisplaced: 'DESLOCADO',
    observerThreat: 'AMEAÇA DE NOVIKOV',
    observerParadox: 'CURVA FECHADA (CTC)',
    observerErased: 'ANIQUILADO',
    observerDuplicated: 'BIFURCAÇÃO QUÂNTICA',
    laymanObserverNormal: 'ESTÁVEL',
    laymanObserverTraveling: 'VIAJANDO NO TEMPO',
    laymanObserverDisplaced: 'FORA DA ÉPOCA',
    laymanObserverThreat: 'RISCO DE PARADOXO',
    laymanObserverParadox: 'PRESO EM LOOP',
    laymanObserverErased: 'APAGADO DA HISTÓRIA',
    laymanObserverDuplicated: 'DUPLICADO NO TEMPO',

    // Timeline Canvas
    gravitationalWaves: 'Ondas Gravitacionais',
    laymanGravitationalWaves: 'Ondas no Espaço',
    causalGravity: 'Gravidade Causal',
    laymanCausalGravity: 'Destacar Impacto',
    heatActive: 'Calor Ativo',
    laymanHeatActive: 'Destaque Ativo',
    resetView: '⟲ Reset',
    laymanResetView: 'Centralizar',
    lightCone: 'CONE DE LUZ',

    // Time Scrubber
    timeScrubber: 'MÁQUINA DO TEMPO:',
    laymanTimeScrubber: 'ANO DA LINHA DO TEMPO:',
    manifestEvents: 'eventos manifestos',
    laymanManifestEvents: 'acontecimentos até este ano',
    observersPresent: 'observadores presentes',
    laymanTravelersPresent: 'viajantes presentes',
    beginningOfTime: 'Início dos Tempos',
    endOfTime: 'Fim dos Tempos',
    play: 'REPRODUZIR',
    pause: 'PAUSAR',
    present: 'PRESENTE',
    speed: 'Velocidade:',

    // Paradox Console
    minimizeConsole: '▼ MINIMIZAR CONSOLE',
    openAlertsConsole: '▲ ABRIR CONSOLE DE ALERTAS & PARADOXOS',
    openTelemetryConsole: '▲ ABRIR CONSOLE DE TELEMETRIA & PARADOXOS',
    conflicts: 'conflitos',
    ctcs: 'CTCs',
    records: 'registros',
    logs: 'logs',
    consoleParadoxTitle: 'CURVAS TIPO TEMPO FECHADAS & PARADOXOS',
    laymanConsoleParadoxTitle: 'CONFLITOS E PARADOXOS NO TEMPO',
    noParadoxDetected: 'Nenhuma violação do princípio de Novikov detectada. O continuum espaço-temporal permanece estável.',
    laymanNoParadoxDetected: 'Nenhum conflito na história detectado! Todas as causas e efeitos estão consistentes e o tempo flui com segurança.',
    consoleTerminalTitle: 'TERMINAL DE MÉTRICA & TERMODINÂMICA',
    laymanConsoleTerminalTitle: 'REGISTRO DE AÇÕES NO ESPAÇO-TEMPO',
    investigateParadox: 'INVESTIGAR CONES DE LUZ & GEODÉSICAS',
    laymanInvestigateParadox: 'VER ONDE A HISTÓRIA FOI AFETADA',

    // Spacetime Interval Card
    minkowskiGeometry: 'GEOMETRIA DE MINKOWSKI 4D',
    laymanMinkowskiGeometry: 'CONEXÃO DE CAUSA E EFEITO',
    intervalTitle: 'Intervalo Relativístico (ds²)',
    laymanIntervalTitle: 'Um evento consegue influenciar o outro?',
    connectionType: 'INTERVALO (ds²)',
    laymanConnectionType: 'TIPO DE CONEXÃO',
    temporalSeparation: 'SEPARAÇÃO TEMPORAL (Δt)',
    laymanTemporalSeparation: 'DIFERENÇA DE ANOS',
    spatialDistance: 'DISTÂNCIA ESPACIAL (Δx)',
    laymanSpatialDistance: 'DISTÂNCIA NO ESPAÇO',
    properTime: 'TEMPO PRÓPRIO (Δτ)',
    laymanProperTime: 'TEMPO REAL EXPERIMENTADO',
    years: 'anos',
    units: 'u',
    lightLimit: 'Limite da Luz',
    timelikeAllowed: 'Permitida',
    spacelikeNoContact: 'Sem Contato',
    unattainable: 'Inatingível (mais rápido que a luz)',
    undefinedSuperluminal: 'Indefinido (v > c)',
    openCalculator: 'Abrir Calculadora de Física Computacional',
    viewDocumentation: 'VER BASE DOCUMENTAL / TEORIA ↗',
    laymanViewDocumentation: 'VER ARTIGO CIENTÍFICO ORIGINAL ↗',
    timelikeLabel: 'TIPO-TEMPO (CAUSALMENTE CONECTADO: ds² < 0)',
    timelikeDesc: 'O evento posterior está contido no cone de luz do evento anterior. A causalidade física é rigorosamente preservada por sinais com velocidade subluminal v < c.',
    lightlikeLabel: 'TIPO-LUZ (CONE NULO: ds² = 0)',
    lightlikeDesc: 'A separação ocorre exatamente na superfície do cone de luz. Fótons e radiação eletromagnética viajam por esta geodésica na velocidade exata c.',
    spacelikeLabel: 'TIPO-ESPAÇO (DESCONECTADO CAUSALMENTE: ds² > 0)',
    spacelikeDesc: 'Os eventos estão fora dos respectivos cones de luz. Nenhuma informação ou partícula física pode conectar ambos sem violar a invariância de Lorentz (exigiria v > c).',
    laymanTimelikeLabel: 'Conexão Causal Válida',
    laymanTimelikeDesc: 'Houve tempo suficiente para a informação ou luz viajar de um evento até o outro. Portanto, o primeiro acontecimento pode sim ter causado o segundo com total consistência!',
    laymanLightlikeLabel: 'No Limite da Velocidade da Luz',
    laymanLightlikeDesc: 'A influência viajou exatamente na velocidade máxima permitida no universo (300.000 km/s, a velocidade da luz).',
    laymanSpacelikeLabel: 'Eventos Isolados (Sem Ligação Direta)',
    laymanSpacelikeDesc: 'Estes dois acontecimentos estão tão distantes no espaço e aconteceram com intervalo tão curto de tempo que nem mesmo um raio de luz conseguiria ligá-los a tempo. Um não pode ter sido a causa do outro.',

    // Event Inspector
    causalDossier: 'DOSSIÊ DO NÓ CAUSAL',
    laymanCausalDossier: 'GUIA DO VIAJANTE NO TEMPO',
    noEventTitle: 'SCAN',
    laymanNoEventTitle: 'Nenhum Evento Selecionado',
    noEventPrompt: 'Selecione um nó no mapa de geodésicas para inspecionar seus dados de física, métricas e causalidade.',
    laymanNoEventPrompt: 'Clique em qualquer ponto na linha do tempo para descobrir a história, ver referências de filmes e entender a ciência!',
    yearLabel: 'Ano',
    temporalCoord: 'COORDENADA TEMPORAL',
    laymanYearLabel: 'ANO',
    metricState: 'ESTADO MÉTRICO',
    laymanTimeStatus: 'STATUS DO TEMPO',
    statusStableMinkowski: 'ESTÁVEL (MINKOWSKI)',
    statusAlteredMetric: 'PERTURBAÇÃO MÉTRICA',
    statusUnstableQuantum: 'FLUTUAÇÃO QUÂNTICA',
    statusSingularityCollapse: 'COLAPSO DE SINGULARIDADE',
    statusNovikovParadox: 'PARADOXO (CTC / NOVIKOV)',
    statusCausalAnnihilation: 'ANIQUILAÇÃO CAUSAL',
    statusEverettBranch: 'RAMIFICAÇÃO EVERETTIANA (11D)',
    laymanSavedAndStable: 'Salvo e Estável',
    laymanLineAltered: 'Linha Alterada',
    theoreticalDomain: 'DOMÍNIO TEÓRICO',
    laymanDomain: 'TIPO DE FENÔMENO',
    causalWeight: 'PESO CAUSAL',
    laymanImpact: 'IMPACTO NO UNIVERSO',
    directCauses: 'CONES DE LUZ PASSADO (CAUSAS: {count})',
    laymanDirectCauses: 'O QUE PROVOCOU ESTE EVENTO ({count})',
    directConsequences: 'CONES DE LUZ FUTURO (CONSEQUÊNCIAS: {count})',
    laymanDirectConsequences: 'O QUE ESTE EVENTO GEROU NO FUTURO ({count})',
    noAncestors: 'Origem assintótica / Evento primordial independente',
    laymanNoAncestors: 'Ponto de partida histórico (sem causa anterior cadastrada)',
    noDescendants: 'Fronteira aberta da linha temporal',
    laymanNoDescendants: 'Fim da cadeia atual (ainda sem desdobramentos futuros)',
    actionsTitle: 'INTERVENÇÃO MÉTRICA & ORÁCULO DE IA',
    laymanActionsTitle: 'MUDAR A HISTÓRIA & SIMULAR COM IA',
    simulateButterfly: 'Simular Efeito Borboleta com IA',
    alterEvent: 'Modificar Geodésica',
    laymanAlterEvent: 'Mudar Rumos do Evento',
    eraseEvent: 'Aniquilar Nó Temporal',
    laymanEraseEvent: 'Apagar da História',
    restoreEvent: 'Restaurar Estado Fundamental',
    laymanRestoreEvent: 'Restaurar Original',
    ligoHearSpacetime: 'Sinal Acústico Real do Espaço-Tempo',
    laymanLigoHear: 'Ouça o Som do Espaço-Tempo',
    ligoHearSub: 'Chirp de fusão GW150914 captado pelos interferômetros do LIGO',
    laymanLigoHearSub: 'O chiado real de dois buracos negros colidindo gravado pelo LIGO!',
    hearCollision: 'Ouvir Colisão no Espaço',
    playingAudio: 'Reproduzindo...',
    closeCalc: '▲ Ocultar Calculadora de Tensores',
    laymanCloseCalc: '▲ Fechar Brincadeira do Tempo',
    openCalc: 'Abrir Calculadora de Física Computacional ▼',
    laymanOpenCalc: 'Simular Efeito Interestelar & Dilatação do Tempo ▼',
    anchorBadgeTitle: 'ÂNCORA GEODÉSICA DO CONTINUUM',
    laymanAnchorBadgeTitle: 'EVENTO FUNDAMENTAL DA HISTÓRIA',
    anchorBadgeDesc: 'Evento primordial que estabiliza o tensor métrico e preserva a autoconsistência de Novikov.',
    laymanAnchorBadgeDesc: 'Este acontecimento é tão importante que serve de base firme para todas as descobertas que vieram depois.',
    aiAnomalyTitle: 'ANOMALIA QUÂNTICA GERADA POR IA',
    laymanAiAnomalyTitle: 'HISTÓRIA ALTERADA POR INTELIGÊNCIA ARTIFICIAL',
    aiAnomalyDesc: 'Bifurcação emergente gerada por perturbações no cone de luz.',
    laymanAiAnomalyDesc: 'Uma nova possibilidade gerada para testar o que aconteceria com o universo.',
    physicsSectionTitle: 'INTERPRETAÇÃO EM FÍSICA TEÓRICA',
    laymanPhysicsSectionTitle: 'COMO A CIÊNCIA EXPLICA ESTE EVENTO',
    fivePillars: '5 PILARES DO ESPAÇO-TEMPO',
    laymanFivePillars: '5 LEIS FUNDAMENTAIS',
    howItWorks: 'COMO FUNCIONA (SEM COMPLICAÇÃO)',
    dailyAnalogy: 'Analogia do Dia a Dia:',
    curiosity: 'Curiosidade:',
    formulaMeaning: 'O QUE ESTA FÓRMULA SIGNIFICA',

    // Scientific Status Badge
    provenTitle: 'COMPROVADO EXPERIMENTALMENTE',
    laymanProvenTitle: 'COMPROVADO PELA CIÊNCIA',
    provenSubtitle: 'Física / Astronomia Observacional Confirmada',
    laymanProvenSubtitle: 'Descoberta testada e comprovada no mundo real',
    theoreticalTitle: 'TEORIA REAL (FÍSICA TEÓRICA)',
    laymanTheoreticalTitle: 'TEORIA MATEMÁTICA REAL',
    theoreticalSubtitle: 'Modelo Matemático Formal (Sem Prova Empírica)',
    laymanTheoreticalSubtitle: 'Cálculo real de físicos famosos aguardando testes',
    numericalTitle: 'MÉTODO NUMÉRICO / GRAFOS',
    laymanNumericalTitle: 'SIMULAÇÃO DO COMPUTADOR',
    numericalSubtitle: 'Cálculo Computacional & Algorítmico',
    laymanNumericalSubtitle: 'Calculado matematicamente pelo simulador',

    // Replay Controls
    replayInProgress: 'REPLAY CAUSAL EM ANDAMENTO',
    replayStep: 'PASSO',
    replayIntegrityStep: 'Integridade no Passo:',
    replayPrevious: 'Anterior',
    replayResume: 'CONTINUAR',
    replayNext: 'Próximo',
  },
  en: {
    // Header & Brand
    appTitle: 'Infinite Horizons',
    tagline: 'THEORETICAL PHYSICS & CAUSALITY LABORATORY',
    laymanTagline: 'INTUITIVE TIME TRAVEL SIMULATOR',
    home: 'Home',
    academic: 'Academic',
    layman: 'Layman Mode',
    integrity: 'TEMPORAL INTEGRITY',
    laymanIntegrity: 'TIMELINE HEALTH',
    paradoxes: 'PARADOXES',
    stable: 'STABLE',
    withoutParadox: 'NO PARADOXES',
    monteCarlo: 'Monte Carlo',
    presentation: 'Presentation',
    slides: 'Slides',
    cones3D: '3D Cones',
    aiOracle: 'AI Oracle',
    cliTerminal: '>_ CLI',
    challenges: 'Challenges',
    splitView: 'Compare',
    addNode: '+ Node',
    addObserver: '+ Obs',
    intervention: 'Intervention',
    shareLink: 'Share Link',
    export: 'Export',
    linkCopied: 'Universe link copied to clipboard!',

    // Left Sidebar
    dimensionsTitle: 'DIMENSIONAL MANIFOLDS',
    laymanDimensionsTitle: 'TIMELINES',
    addNewDimension: '+ New (11D)',
    laymanAddNewDimension: '+ New Line',
    geodesicNodes: 'geodesic nodes',
    laymanEvents: 'events',
    coherence: 'coherence',
    laymanStability: 'stability',
    observersTitle: 'PROBES & OBSERVERS',
    laymanObserversTitle: 'TIME TRAVELERS',
    coordinate: 'Coordinate: Year',
    laymanCoordinate: 'Location: Year',
    metricOrigin: 'Metric-Temporal Origin: Year',
    laymanMetricOrigin: 'Origin Year:',
    presentInYear: 'Present in year',
    observerCongruent: 'CONGRUENT',
    observerWarp: 'IN WARP',
    observerDisplaced: 'DISPLACED',
    observerThreat: 'NOVIKOV THREAT',
    observerParadox: 'CLOSED CURVE (CTC)',
    observerErased: 'ANNIHILATED',
    observerDuplicated: 'QUANTUM BRANCHING',
    laymanObserverNormal: 'STABLE',
    laymanObserverTraveling: 'TIME TRAVELING',
    laymanObserverDisplaced: 'OUT OF TIME PERIOD',
    laymanObserverThreat: 'PARADOX RISK',
    laymanObserverParadox: 'TRAPPED IN LOOP',
    laymanObserverErased: 'ERASED FROM HISTORY',
    laymanObserverDuplicated: 'TIME DUPLICATE',

    // Timeline Canvas
    gravitationalWaves: 'Gravitational Waves',
    laymanGravitationalWaves: 'Space Ripples',
    causalGravity: 'Causal Gravity',
    laymanCausalGravity: 'Highlight Impact',
    heatActive: 'Heatmap Active',
    laymanHeatActive: 'Highlight Active',
    resetView: '⟲ Reset',
    laymanResetView: 'Center',
    lightCone: 'LIGHT CONE',

    // Time Scrubber
    timeScrubber: 'TIME MACHINE:',
    laymanTimeScrubber: 'TIMELINE YEAR:',
    manifestEvents: 'manifest events',
    laymanManifestEvents: 'events up to this year',
    observersPresent: 'observers present',
    laymanTravelersPresent: 'travelers present',
    beginningOfTime: 'Beginning of Time',
    endOfTime: 'End of Time',
    play: 'PLAY',
    pause: 'PAUSE',
    present: 'PRESENT',
    speed: 'Speed:',

    // Paradox Console
    minimizeConsole: '▼ MINIMIZE CONSOLE',
    openAlertsConsole: '▲ OPEN ALERTS & PARADOXES CONSOLE',
    openTelemetryConsole: '▲ OPEN TELEMETRY & PARADOXES CONSOLE',
    conflicts: 'conflicts',
    ctcs: 'CTCs',
    records: 'records',
    logs: 'logs',
    consoleParadoxTitle: 'CLOSED TIMELIKE CURVES & PARADOXES',
    laymanConsoleParadoxTitle: 'TIMELINE CONFLICTS & PARADOXES',
    noParadoxDetected: 'No Novikov self-consistency violation detected. Spacetime continuum remains stable.',
    laymanNoParadoxDetected: 'No history conflict detected! All cause and effect remain consistent and time flows safely.',
    consoleTerminalTitle: 'METRIC & THERMODYNAMICS TERMINAL',
    laymanConsoleTerminalTitle: 'SPACETIME ACTION LOG',
    investigateParadox: 'INVESTIGATE LIGHT CONES & GEODESICS',
    laymanInvestigateParadox: 'SEE WHERE TIMELINE WAS ALTERED',

    // Spacetime Interval Card
    minkowskiGeometry: '4D MINKOWSKI GEOMETRY',
    laymanMinkowskiGeometry: 'CAUSE & EFFECT CONNECTION',
    intervalTitle: 'Relativistic Interval (ds²)',
    laymanIntervalTitle: 'Can one event influence the other?',
    connectionType: 'INTERVAL (ds²)',
    laymanConnectionType: 'CONNECTION TYPE',
    temporalSeparation: 'TEMPORAL SEPARATION (Δt)',
    laymanTemporalSeparation: 'YEAR DIFFERENCE',
    spatialDistance: 'SPATIAL DISTANCE (Δx)',
    laymanSpatialDistance: 'DISTANCE IN SPACE',
    properTime: 'PROPER TIME (Δτ)',
    laymanProperTime: 'PROPER TIME EXPERIENCED',
    years: 'years',
    units: 'u',
    lightLimit: 'Light Limit',
    timelikeAllowed: 'Allowed',
    spacelikeNoContact: 'No Contact',
    unattainable: 'Unattainable (faster than light)',
    undefinedSuperluminal: 'Undefined (v > c)',
    openCalculator: 'Open Computational Physics Calculator',
    viewDocumentation: 'VIEW DOCUMENTATION / THEORY ↗',
    laymanViewDocumentation: 'VIEW ORIGINAL SCIENTIFIC PAPER ↗',
    timelikeLabel: 'TIMELIKE (CAUSALLY CONNECTED: ds² < 0)',
    timelikeDesc: 'The subsequent event is contained within the past event\'s light cone. Physical causality is strictly preserved via subluminal signals v < c.',
    lightlikeLabel: 'LIGHTLIKE (NULL CONE: ds² = 0)',
    lightlikeDesc: 'Separation occurs exactly on the surface of the light cone. Photons and electromagnetic radiation propagate along this geodesic at exact speed c.',
    spacelikeLabel: 'SPACELIKE (CAUSALLY DISCONNECTED: ds² > 0)',
    spacelikeDesc: 'Events lie outside each other\'s light cones. No physical information or particle can link them without violating Lorentz invariance (would require v > c).',
    laymanTimelikeLabel: 'Valid Causal Connection',
    laymanTimelikeDesc: 'There was enough time for light or information to travel from one event to the other. Therefore, the first event could indeed cause the second with complete consistency!',
    laymanLightlikeLabel: 'At the Speed of Light Limit',
    laymanLightlikeDesc: 'Influence traveled at the exact maximum speed allowed in the universe (300,000 km/s, the speed of light).',
    laymanSpacelikeLabel: 'Isolated Events (No Direct Link)',
    laymanSpacelikeDesc: 'These two events are so distant in space and occurred in such a short time that not even a beam of light could link them in time. One cannot have caused the other.',

    // Event Inspector
    causalDossier: 'CAUSAL NODE DOSSIER',
    laymanCausalDossier: 'TIME TRAVELER GUIDE',
    noEventTitle: 'SCAN',
    laymanNoEventTitle: 'No Event Selected',
    noEventPrompt: 'Select a node on the geodesic map to inspect its physics, metrics, and causality data.',
    laymanNoEventPrompt: 'Click any point on the timeline to discover the story, see movie references, and understand the science!',
    yearLabel: 'Year',
    temporalCoord: 'TEMPORAL COORDINATE',
    laymanYearLabel: 'YEAR',
    metricState: 'METRIC STATE',
    laymanTimeStatus: 'TIMELINE STATUS',
    statusStableMinkowski: 'STABLE (MINKOWSKI)',
    statusAlteredMetric: 'METRIC PERTURBATION',
    statusUnstableQuantum: 'QUANTUM FLUCTUATION',
    statusSingularityCollapse: 'SINGULARITY COLLAPSE',
    statusNovikovParadox: 'PARADOX (CTC / NOVIKOV)',
    statusCausalAnnihilation: 'CAUSAL ANNIHILATION',
    statusEverettBranch: 'EVERETTIAN BRANCHING (11D)',
    laymanSavedAndStable: 'Safe and Stable',
    laymanLineAltered: 'Altered Timeline',
    theoreticalDomain: 'THEORETICAL DOMAIN',
    laymanDomain: 'PHENOMENON TYPE',
    causalWeight: 'CAUSAL WEIGHT',
    laymanImpact: 'UNIVERSE IMPACT',
    directCauses: 'PAST LIGHT CONES (CAUSES: {count})',
    laymanDirectCauses: 'WHAT CAUSED THIS EVENT ({count})',
    directConsequences: 'FUTURE LIGHT CONES (CONSEQUENCES: {count})',
    laymanDirectConsequences: 'WHAT THIS EVENT GENERATED IN THE FUTURE ({count})',
    noAncestors: 'Asymptotic origin / Independent primordial root event',
    laymanNoAncestors: 'Historical starting point (no prior registered cause)',
    noDescendants: 'Open frontier of the timeline',
    laymanNoDescendants: 'End of current chain (no future developments yet)',
    actionsTitle: 'METRIC INTERVENTION & AI ORACLE',
    laymanActionsTitle: 'CHANGE HISTORY & SIMULATE WITH AI',
    simulateButterfly: 'Simulate Butterfly Effect with AI',
    alterEvent: 'Modify Geodesic',
    laymanAlterEvent: 'Change Course of Event',
    eraseEvent: 'Annihilate Temporal Node',
    laymanEraseEvent: 'Erase from History',
    restoreEvent: 'Restore Ground State',
    laymanRestoreEvent: 'Restore Original',
    ligoHearSpacetime: 'Real Acoustic Spacetime Signal',
    laymanLigoHear: 'Hear the Sound of Spacetime',
    ligoHearSub: 'GW150914 merger chirp captured by LIGO interferometers',
    laymanLigoHearSub: 'Real chirp of two colliding black holes recorded by LIGO!',
    hearCollision: 'Hear Collision in Space',
    playingAudio: 'Playing...',
    closeCalc: '▲ Hide Tensor Calculator',
    laymanCloseCalc: '▲ Close Time Exploration',
    openCalc: 'Open Computational Physics Calculator ▼',
    laymanOpenCalc: 'Simulate Interstellar & Time Dilation Effect ▼',
    anchorBadgeTitle: 'CONTINUUM GEODESIC ANCHOR',
    laymanAnchorBadgeTitle: 'PIVOTAL HISTORICAL EVENT',
    anchorBadgeDesc: 'Primordial event that stabilizes the metric tensor and preserves Novikov self-consistency.',
    laymanAnchorBadgeDesc: 'This event is so crucial that it serves as the rock-solid foundation for all discoveries that followed.',
    aiAnomalyTitle: 'AI GENERATED QUANTUM ANOMALY',
    laymanAiAnomalyTitle: 'HISTORY ALTERED BY ARTIFICIAL INTELLIGENCE',
    aiAnomalyDesc: 'Emergent bifurcation generated by light cone perturbations.',
    laymanAiAnomalyDesc: 'A new timeline possibility generated to test what would happen to the universe.',
    physicsSectionTitle: 'THEORETICAL PHYSICS INTERPRETATION',
    laymanPhysicsSectionTitle: 'HOW SCIENCE EXPLAINS THIS EVENT',
    fivePillars: '5 SPACETIME PILLARS',
    laymanFivePillars: '5 FUNDAMENTAL LAWS',
    howItWorks: 'HOW IT WORKS (SIMPLIFIED)',
    dailyAnalogy: 'Everyday Analogy:',
    curiosity: 'Fun Fact:',
    formulaMeaning: 'WHAT THIS FORMULA MEANS',

    // Scientific Status Badge
    provenTitle: 'EXPERIMENTALLY PROVEN',
    laymanProvenTitle: 'PROVEN BY SCIENCE',
    provenSubtitle: 'Observational Physics / Astronomy Confirmed',
    laymanProvenSubtitle: 'Discovery tested and proven in the real world',
    theoreticalTitle: 'THEORETICAL PHYSICS (REAL THEORY)',
    laymanTheoreticalTitle: 'REAL MATHEMATICAL THEORY',
    theoreticalSubtitle: 'Formal Mathematical Model (Awaiting Empirical Proof)',
    laymanTheoreticalSubtitle: 'Real calculations by renowned physicists awaiting experimental tests',
    numericalTitle: 'NUMERICAL METHOD / GRAPH',
    laymanNumericalTitle: 'COMPUTER SIMULATION',
    numericalSubtitle: 'Computational & Algorithmic Calculus',
    laymanNumericalSubtitle: 'Calculated mathematically by the simulator',

    // Replay Controls
    replayInProgress: 'CAUSAL REPLAY IN PROGRESS',
    replayStep: 'STEP',
    replayIntegrityStep: 'Integrity at Step:',
    replayPrevious: 'Previous',
    replayResume: 'RESUME',
    replayNext: 'Next',
  },
};

export const EVENT_TRANSLATIONS: Record<string, { en: { title: string; description?: string } }> = {
  'evt-099': {
    en: {
      title: "Maxwell's Equations & Classical Electrodynamics",
      description: 'James Clerk Maxwell unifies electricity, magnetism, and optics into four differential equations. Proves light is an electromagnetic wave propagating in vacuum at invariant constant speed $c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}}$.',
    },
  },
  'evt-099b': {
    en: {
      title: 'Michelson-Morley Experiment & The Aether Crisis',
      description: 'Albert Michelson and Edward Morley attempt to detect the "aether wind" from Earth\'s orbital velocity using ultra-precise optical interferometry. The null result refuted the stationary luminiferous aether and triggered the crisis resolved by Einstein.',
    },
  },
  'evt-100': {
    en: {
      title: 'Special Relativity & Lorentz Invariance',
      description: 'Albert Einstein formulates Special Relativity: physical laws and the speed of light $c$ are invariant across all inertial reference frames. Unifies space and time into the 4D Minkowski continuum ($ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2$) and deduces $E = mc^2$.',
    },
  },
  'evt-101': {
    en: {
      title: 'Einstein Field Equations (General Relativity)',
      description: 'Albert Einstein formulates General Relativity: gravity is not a classical force, but the dynamic curvature of four-dimensional spacetime induced by the energy-momentum tensor ($G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$).',
    },
  },
  'evt-102': {
    en: {
      title: 'Einstein-Rosen Bridges & EPR Paradox',
      description: 'Publication of spacetime bridges (geometric tunnels connecting remote points of the cosmos) and quantum entanglement (non-local correlated states challenging local realism).',
    },
  },
  'evt-103': {
    en: {
      title: 'Cosmic Microwave Background (CMB) Discovery',
      description: 'Arno Penzias and Robert Wilson detect the isotropic primordial 2.725 K thermal background, proving the cosmos emerged from an ultra-hot, dense state in the Big Bang.',
    },
  },
  'evt-104': {
    en: {
      title: 'Accelerating Expansion Evidence (Dark Energy)',
      description: 'Measurements of distant Type Ia supernovae demonstrate the cosmic fabric expansion is accelerating, governed by negative vacuum energy pressure (cosmological constant $\\Lambda$).',
    },
  },
  'evt-105': {
    en: {
      title: 'Direct Gravitational Wave Detection (LIGO)',
      description: 'The LIGO/Virgo collaboration records GW150914: metric perturbations in spacetime generated by binary black hole mergers 1.3 billion light-years away.',
    },
  },
  'evt-106': {
    en: {
      title: 'M87* Event Horizon Image (EHT)',
      description: 'The Event Horizon Telescope reconstructs the first image of the emission ring and gravitational shadow of a supermassive black hole, validating the Kerr metric under extreme gravity.',
    },
  },
  'evt-107': {
    en: {
      title: 'Holographic ER = EPR Conjecture (Susskind & Maldacena)',
      description: 'Leonard Susskind and Juan Maldacena propose that fundamental quantum entanglement (EPR) and metric bridges in spacetime (ER) are equivalent manifestations of holographic quantum gravity.',
    },
  },
  'evt-201': {
    en: {
      title: 'First Superstring Revolution (Green-Schwarz)',
      description: 'Demonstration that replacing point particles with 1D vibrating filaments at the Planck scale ($\\sim 10^{-35}\\text{ m}$) cancels all quantum anomalies in 10 dimensions.',
    },
  },
  'evt-202': {
    en: {
      title: 'Second String Revolution & M-Theory (11D)',
      description: 'Edward Witten unifies the 5 superstring theories via non-perturbative dualities (S and T) into a single 11-dimensional spacetime theory populated by extended D-branes.',
    },
  },
  'evt-203': {
    en: {
      title: 'AdS/CFT Holographic Correspondence (Maldacena)',
      description: 'Juan Maldacena formulates the exact duality where superstring quantum gravity in 5-dimensional Anti-de Sitter space is mathematically equivalent to a conformal field theory on the 4D boundary.',
    },
  },
  'evt-204': {
    en: {
      title: 'Calabi-Yau String Landscape',
      description: 'Geometric compactification of the 6 extra dimensions on Calabi-Yau manifolds generates ~10⁵⁰⁰ stable vacuum states, founding the physics of the string theory multiverse.',
    },
  },
};

export const DIMENSION_TRANSLATIONS: Record<string, { en: { name: string } }> = {
  'dim-omega-01': {
    en: { name: 'Relativistic Continuum (Relativity & ΛCDM)' },
  },
  'dim-omega-02': {
    en: { name: 'Calabi-Yau Manifolds (M-Theory & 11D)' },
  },
};

export const TRAVELER_TRANSLATIONS: Record<string, { en: { name: string } }> = {
  'trv-001': {
    en: { name: 'Primary Reference Frame (Relativity)' },
  },
  'trv-002': {
    en: { name: 'Quantum Observer (11D)' },
  },
};

export function getLocalizedEventTitle(event: { id: string; title: string }, lang: Language): string {
  if (lang === 'en' && EVENT_TRANSLATIONS[event.id]?.en?.title) {
    return EVENT_TRANSLATIONS[event.id].en.title;
  }
  return event.title;
}

export function getLocalizedEventDescription(event: { id: string; description?: string }, lang: Language): string {
  if (lang === 'en' && EVENT_TRANSLATIONS[event.id]?.en?.description) {
    return EVENT_TRANSLATIONS[event.id].en.description!;
  }
  return event.description || '';
}

export function getLocalizedDimensionName(dim: { id: string; name: string }, lang: Language): string {
  if (lang === 'en' && DIMENSION_TRANSLATIONS[dim.id]?.en?.name) {
    return DIMENSION_TRANSLATIONS[dim.id].en.name;
  }
  return dim.name;
}

export function getLocalizedTravelerName(trv: { id: string; name: string }, lang: Language): string {
  if (lang === 'en' && TRAVELER_TRANSLATIONS[trv.id]?.en?.name) {
    return TRAVELER_TRANSLATIONS[trv.id].en.name;
  }
  return trv.name;
}

export function getLocalizedUniverseName(univ: { id?: string; name: string }, lang: Language): string {
  if (lang === 'en' && (univ.id === 'univ-01' || univ.name.includes('Cosmologia Relativística') || univ.name.includes('Relatividade'))) {
    return 'Relativistic Cosmology & Superstring Multiverse';
  }
  return univ.name;
}

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  'ELETROMAGNETISMO': 'ELECTROMAGNETISM',
  'FÍSICA EXPERIMENTAL': 'EXPERIMENTAL PHYSICS',
  'RELATIVIDADE RESTRITA': 'SPECIAL RELATIVITY',
  'RELATIVIDADE GERAL': 'GENERAL RELATIVITY',
  'GRAVITAÇÃO QUÂNTICA': 'QUANTUM GRAVITY',
  'COSMOLOGIA': 'COSMOLOGY',
  'ASTROFÍSICA': 'ASTROPHYSICS',
  'OBSERVAÇÃO': 'OBSERVATION',
  'TEORIA DE CORDAS': 'STRING THEORY',
  'TEORIA M': 'M-THEORY',
  'MULTIVERSO DE CORDAS': 'STRING MULTIVERSE',
  'FÍSICA TEÓRICA': 'THEORETICAL PHYSICS',
  'Eletricidade e Luz': 'Electricity and Light',
  'Experimento Científico': 'Scientific Experiment',
  'Velocidade da Luz e Tempo': 'Speed of Light and Time',
  'Gravidade e Espaço Curvo': 'Gravity and Curved Space',
  'Física Quântica e Portais': 'Quantum Physics and Portals',
  'Origem do Universo': 'Origin of the Universe',
  'Destino do Universo': 'Fate of the Universe',
  'Ondas no Espaço': 'Waves in Space',
  'Buracos Negros': 'Black Holes',
  'Teoria das Cordas': 'String Theory',
};

export function getLocalizedCategory(category: string, lang: Language): string {
  if (lang === 'en' && CATEGORY_TRANSLATIONS[category]) {
    return CATEGORY_TRANSLATIONS[category];
  }
  return category;
}

const LANG_STORAGE_KEY = 'infinite-horizons:lang';

export function getStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'pt') return saved;
  } catch {
    // Ignore
  }
  return 'pt';
}

export function setStoredLanguage(lang: Language) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore
  }
}
