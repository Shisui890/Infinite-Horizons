/**
 * celestialBodyDetails.ts
 *
 * Base de dados aprofundada de geologia interna, elementos orbitais keplerianos,
 * especificações de engenharia aeroespacial e diferenciação profunda entre
 * Modo Didático (analogias intuitivas do cotidiano) e Modo Técnico (formalismo matemático/tensores).
 *
 * Cobertura completa para todos os 33 corpos celestes da Cartografia Estelar.
 */

export interface GeologicalLayer {
  name: string;
  depthKm: string;
  composition: string;
  temperature: string;
  color: string;
  description: string;
}

export interface KeplerianElements {
  semiMajorAxisAU: number;
  eccentricity: number;
  inclinationDeg: number;
  orbitalVelocityKmS: number;
  periapsisDistance: string;
  apoapsisDistance: string;
}

export interface AerospaceSpecs {
  surfaceGravityMS2: number;
  surfacePressureBar: number;
  scaleHeightKm: number;
  hasAtmosphere: boolean;
  lowOrbitInsertionDeltaVKmS: number;
  surfaceLandingDeltaVKmS: number;
  entryVelocityKmS: number;
  aerobrakingFeasible: boolean;
  flightNotes: string;
}

export interface DidacticInfo {
  whatIsIt: string;
  everydayAnalogy: string;
  ifYouWereThere: string;
  howToReachIt: string;
  funFacts: string[];
}

export interface TechnicalDossier {
  formalDefinition: string;
  primaryEquations: { label: string; formula: string; desc: string }[];
  fieldEquationsDesc: string;
  thermodynamics: string;
  radiationRegime: string;
}

export interface BodyDetails {
  geology: GeologicalLayer[];
  keplerian: KeplerianElements;
  aerospace: AerospaceSpecs;
  didactic: DidacticInfo;
  technical: TechnicalDossier;
}

export const CELESTIAL_BODY_DETAILS: Record<string, BodyDetails> = {
  // =========================================================================
  // 1. SOL
  // =========================================================================
  sol: {
    geology: [
      {
        name: 'Núcleo de Fusão Termonuclear',
        depthKm: '0 a 175.000 km (0 a 0.25 R☉)',
        composition: 'Plasma ionizado superdenso de Prótons (H⁺), Partículas Alfa (He²⁺) e Elétrons livres',
        temperature: '15.700.000 K',
        color: '#ffffff',
        description: 'Fornalha nuclear onde ocorre a cadeia próton-próton (p-p), fundindo 600 milhões de toneladas de hidrogênio por segundo.',
      },
      {
        name: 'Zona Radiativa',
        depthKm: '175.000 a 490.000 km (0.25 a 0.7 R☉)',
        composition: 'Plasma de densidade média em equilíbrio radiativo',
        temperature: '7.000.000 K a 2.000.000 K',
        color: '#ffcc00',
        description: 'A energia se propaga por difusão de fótons gama. Um único fóton leva entre 100.000 e 200.000 anos para atravessar essa zona devido a colisões aleatórias com elétrons.',
      },
      {
        name: 'Zona Convectiva',
        depthKm: '490.000 a 696.000 km (0.7 a 1.0 R☉)',
        composition: 'Células gigantes de plasma em ebulição térmica convectiva',
        temperature: '2.000.000 K a 5.778 K',
        color: '#ff9900',
        description: 'O plasma quente sobe como água fervendo em uma panela, esfria na superfície e afunda novamente, gerando poderosas correntes de dínamo magnético.',
      },
      {
        name: 'Fotosfera e Corona',
        depthKm: 'Superfície visível a milhões de km no espaço',
        composition: 'Gás ionizado tênue permeado por campos magnéticos intensos',
        temperature: '5.778 K (Fotosfera) / 1.000.000 a 3.000.000 K (Corona)',
        color: '#ff6600',
        description: 'Paradoxo do aquecimento coronal: a atmosfera externa do Sol é inexplicavelmente centenas de vezes mais quente que a própria superfície, aquecida por ondas magnetohidrodinâmicas de Alfvén.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 7.25,
      orbitalVelocityKmS: 220,
      periapsisDistance: 'Centro Galáctico: ~26.000 AL',
      apoapsisDistance: 'Centro Galáctico: ~28.000 AL',
    },
    aerospace: {
      surfaceGravityMS2: 274.0,
      surfacePressureBar: 0.868,
      scaleHeightKm: 150,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 437.0,
      surfaceLandingDeltaVKmS: 617.5,
      entryVelocityKmS: 617.5,
      aerobrakingFeasible: false,
      flightNotes: 'Pouso impossível devido ao calor e pressão. A sonda Parker Solar Probe orbita na corona externa a 690.000 km/h protegida por escudo de carbono reforçado de 11,4 cm.',
    },
    didactic: {
      whatIsIt: 'O Sol é uma gigantesca esfera de gás incandescente que concentra 99,86% de toda a massa do Sistema Solar.',
      everydayAnalogy: 'Imagine que o Sistema Solar inteiro é uma melancia de 100 kg. O Sol é toda a polpa e a casca pesando 99,86 kg, enquanto a Terra é uma sementinha de apenas 3 gramas!',
      ifYouWereThere: 'Se você pesasse 70 kg na Terra, na "superfície" do Sol pesaria quase 2 toneladas (1.950 kg)! Seu corpo seria instantaneamente vaporizado em plasma a quase 6.000°C.',
      howToReachIt: 'Curiosamente, é mais difícil cair no Sol do que escapar do Sistema Solar! Para atingir o Sol a partir da Terra, uma nave precisa queimar 30 km/s de combustível para zerar a velocidade orbital da Terra.',
      funFacts: [
        'A luz do Sol que você enxerga demorou 8 minutos e 20 segundos para viajar pelo vácuo até os seus olhos.',
        'No entanto, a energia dessa luz foi criada no núcleo solar há mais de 100.000 anos, pulando lentamente entre átomos de plasma!',
        'A cada segundo, o Sol emite mais energia do que a humanidade consumiu em toda a sua história somada.',
      ],
    },
    technical: {
      formalDefinition: 'Estrela anã amarela da sequência principal de classe espectral G2V, operando em equilíbrio hidrostático entre a pressão de radiação e a autogravidade.',
      primaryEquations: [
        {
          label: 'Equilíbrio Hidrostático',
          formula: '\\frac{dP}{dr} = -\\frac{G M(r) \\rho(r)}{r^2}',
          desc: 'Gradiente de pressão contrabalanceando o colapso gravitacional em cada casca esférica.',
        },
        {
          label: 'Luminosidade de Stefan-Boltzmann',
          formula: 'L_\\odot = 4\\pi R_\\odot^2 \\sigma T_{eff}^4 \\approx 3.828 \\times 10^{26}\\text{ W}',
          desc: 'Potência total irradiada integrada na fotosfera a Teff = 5.778 K.',
        },
        {
          label: 'Cadeia Próton-Próton (p-p I)',
          formula: '4\\,^1\\text{H} \\longrightarrow \\,^4\\text{He} + 2e^+ + 2\\nu_e + 26.73\\text{ MeV}',
          desc: 'Balanço nuclear de fusão gerador de energia e neutrinos solares.',
        },
      ],
      fieldEquationsDesc: 'Métrica estática esfericamente simétrica de Schwarzschild para o campo externo (r > R☉) com tensor energia-momento de fluido perfeito T_μν no interior estelar.',
      thermodynamics: 'Transporte convectivo governado pela instabilidade de Schwarzschild (gradiente superadiabático dlnT/dlnP > (γ-1)/γ).',
      radiationRegime: 'Espectro contínuo de corpo negro modulado por mais de 20.000 linhas de absorção de Fraunhofer na fotosfera.',
    },
  },

  // =========================================================================
  // 2. MERCÚRIO
  // =========================================================================
  mercurio: {
    geology: [
      {
        name: 'Crosta de Silicatos Fraturada',
        depthKm: '0 a 35 km',
        composition: 'Basaltos anortosíticos ricos em magnésio e enxofre, sem água',
        temperature: '100 K (-173°C) a 700 K (+427°C)',
        color: '#9ca3af',
        description: 'Superfície pesadamente marcada por crateras de impacto e escarpas de encolhimento tectônico com até 3 km de altura.',
      },
      {
        name: 'Manto de Silicatos Fino',
        depthKm: '35 a 400 km',
        composition: 'Olivina e piroxênio sob alta compressão térmica',
        temperature: '700 K a 1.500 K',
        color: '#6b7280',
        description: 'Manto extremamente fino comparado à Terra, resultado de um impacto protoplanetário catastrófico que arrancou a maior parte de sua camada rochosa.',
      },
      {
        name: 'Núcleo Metálico Gigantesco',
        depthKm: '400 a 2.440 km (85% do raio do planeta!)',
        composition: 'Ferro-níquel líquido com capa de sulfeto de ferro e centro sólido',
        temperature: '1.500 K a 2.200 K',
        color: '#475569',
        description: 'Proporcionalmente o maior núcleo de qualquer planeta rochoso. Seu estado fluido parcial gera um campo magnético global ativo.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0.3871,
      eccentricity: 0.2056,
      inclinationDeg: 7.005,
      orbitalVelocityKmS: 47.36,
      periapsisDistance: 'Periélio: 46.001.200 km (0.307 AU)',
      apoapsisDistance: 'Afélio: 69.816.900 km (0.467 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 3.70,
      surfacePressureBar: 1e-15,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 3.01,
      surfaceLandingDeltaVKmS: 4.25,
      entryVelocityKmS: 4.25,
      aerobrakingFeasible: false,
      flightNotes: 'Sem atmosfera para frenagem aerodinâmica. Inserção orbital exige delta-V enorme (~13 km/s a partir da Terra) devido à gravidade do poço solar; necessita de múltiplos flybys gravitacionais.',
    },
    didactic: {
      whatIsIt: 'Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol, um mundo de contrastes térmicos insanos e sem atmosfera.',
      everydayAnalogy: 'Mercúrio é como uma frigideira que esquenta ao ponto de derreter chumbo de um lado, enquanto o outro lado vira um freezer cósmico de gelo seco no mesmo instante!',
      ifYouWereThere: 'O céu é completamente preto mesmo ao meio-dia, com estrelas visíveis ao lado de um Sol três vezes maior do que vemos da Terra. A temperatura salta de -173°C para +427°C quando o Sol nasce!',
      howToReachIt: 'A sonda BepiColombo (ESA/JAXA) precisa de 9 sobrevoos planetários (1 na Terra, 2 em Vênus e 6 em Mercúrio) ao longo de 7 anos apenas para desacelerar o suficiente contra a atração do Sol.',
      funFacts: [
        'Em Mercúrio, um dia dura mais que um ano! O planeta leva 88 dias terrestres para dar a volta no Sol, mas leva 176 dias para o Sol nascer e se pôr duas vezes no mesmo ponto.',
        'Apesar do calor escaldante, existem geleiras de água pura protegidas da luz do Sol no fundo de crateras profundas em seus polos.',
        'A precessão anômala de sua órbita foi a primeira prova incontestável que comprovou a Teoria da Relatividade Geral de Albert Einstein em 1915.',
      ],
    },
    technical: {
      formalDefinition: 'Planeta telúrico diferenciado de alta densidade volumétrica (5.43 g/cm³) com núcleo metálico sobredimensionado e ressonância órbita-rotação spin-órbita de 3:2.',
      primaryEquations: [
        {
          label: 'Avanço do Periélio de Einstein (RG)',
          formula: '\\Delta\\phi = \\frac{6\\pi G M_\\odot}{c^2 a(1 - e^2)} \\approx 42.98\'\'/\\text{século}',
          desc: 'Desvio relativístico da elipse kepleriana causado pela curvatura do espaço-tempo do Sol.',
        },
        {
          label: 'Ressonância Spin-Órbita 3:2',
          formula: 'P_{\\text{rot}} = \\frac{2}{3} P_{\\text{orb}} \\approx 58.646\\text{ dias}',
          desc: 'Travamento gravitacional de maré induzido pelo torque no periélio excêntrico.',
        },
      ],
      fieldEquationsDesc: 'Potencial efetivo com termo de correção relativístico V_eff(r) = -GM/r + L²/(2r²) - GML²/(c² r³).',
      thermodynamics: 'Oscilação térmica extrema diurna-noturna (ΔT ≈ 600 K) com inércia térmica superficial dominada por regolito poroso.',
      radiationRegime: 'Interação direta do vento solar supersônico com o solo, gerando ejeção de átomos de sódio e potássio na exosfera por sputtering iônico.',
    },
  },

  // =========================================================================
  // 3. VÊNUS
  // =========================================================================
  venus: {
    geology: [
      {
        name: 'Crosta Basáltica Tectônica de Placa Única',
        depthKm: '0 a 70 km',
        composition: 'Basaltos toleíticos com milhares de vulcões em escudo e coronae tectônicas',
        temperature: '737 K (+464°C uniforme em todo o globo)',
        color: '#eab308',
        description: 'Sem placas tectônicas móveis; a crosta acumula calor interno por centenas de milhões de anos até sofrer episódios catastróficos de resurfacing vulcânico global.',
      },
      {
        name: 'Manto de Silicatos Convectivo',
        depthKm: '70 a 2.800 km',
        composition: 'Peridotito anidro sob convecção vigorosa',
        temperature: '1.500 K a 3.000 K',
        color: '#ca8a04',
        description: 'Completamente desidratado; a perda primordial de água aumentou a viscosidade do manto rochoso.',
      },
      {
        name: 'Núcleo de Ferro e Níquel',
        depthKm: '2.800 a 6.052 km',
        composition: 'Ferro-níquel metálico sólido/líquido',
        temperature: '~4.000 K',
        color: '#713f12',
        description: 'Sem geodínamo detectável; a rotação ultra-lenta (243 dias) e a baixa convecção do núcleo impedem a geração de campo magnético intrínseco.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0.7233,
      eccentricity: 0.0067,
      inclinationDeg: 3.394,
      orbitalVelocityKmS: 35.02,
      periapsisDistance: 'Periélio: 107.476.000 km (0.718 AU)',
      apoapsisDistance: 'Afélio: 108.942.000 km (0.728 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 8.87,
      surfacePressureBar: 92.0,
      scaleHeightKm: 15.9,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 7.33,
      surfaceLandingDeltaVKmS: 10.36,
      entryVelocityKmS: 10.4,
      aerobrakingFeasible: true,
      flightNotes: 'Atmosfera densa excelente para aerofrenagem e uso de paraquedas, mas as sondas Soviéticas Venera foram esmagadas pela pressão de 92 bar e assadas a 464°C após apenas 1 a 2 horas no solo.',
    },
    didactic: {
      whatIsIt: 'Vênus é o "gêmeo infernal" da Terra: tem tamanho e gravidade quase idênticos aos nossos, mas foi devastado pelo mais extremo efeito estufa conhecido.',
      everydayAnalogy: 'Estar na superfície de Vênus seria como estar a 900 metros de profundidade no fundo do mar, mas com a água fervendo a 464°C e com uma tempestade de ácido de bateria sobre sua cabeça!',
      ifYouWereThere: 'A atmosfera de CO₂ é tão densa que se comporta quase como um líquido; você andaria com dificuldade como se estivesse dentro de uma piscina morna de óleo denso, sob uma penumbra alaranjada sombria.',
      howToReachIt: 'É o planeta mais fácil de alcançar da Terra em termos de Delta-V, mas o pouso exige cascos de titânio espessos e sistemas criogênicos de resfriamento para resistir mais que alguns minutos.',
      funFacts: [
        'Vênus é o planeta mais quente do Sistema Solar, superando até Mercúrio, apesar de estar duas vezes mais distante do Sol!',
        'Ele gira no sentido oposto ao de quase todos os outros planetas (rotação retrógrada): em Vênus, o Sol nasce no oeste e se põe no leste.',
        'Seus ventos no topo das nuvens viajam a mais de 360 km/h, dando a volta ao redor do planeta inteiro em apenas 4 dias terrestres (super-rotação atmosférica).',
      ],
    },
    technical: {
      formalDefinition: 'Planeta telúrico com atmosfera secundária hiperbárica dominada por CO₂ e SO₂, em regime estufa descontrolado (runaway greenhouse) com forçamento radiativo extremo.',
      primaryEquations: [
        {
          label: 'Equilíbrio Térmico em Atmosfera Opticamente Espessa',
          formula: 'T_s \\approx T_{eff} \\left( 1 + \\frac{3}{4}\\tau \\right)^{1/4}, \\quad \\tau \\gg 1',
          desc: 'Temperatura superficial amplificada pela profundidade óptica infravermelha colossal (τ > 100).',
        },
        {
          label: 'Equação Barométrica Hidrostática',
          formula: 'P(z) = P_0 \\exp\\left(-\\int_0^z \\frac{M g}{R T(\\tilde{z})} d\\tilde{z}\\right)',
          desc: 'Pressão basal de 92 bar com densidade superficial de 67 kg/m³ (fluido supercrítico de CO₂).',
        },
      ],
      fieldEquationsDesc: 'Geodésicas esferoidais em campo gravitacional quase perfeitamente esférico (J₂ = 4.45 × 10⁻⁶, ausência de achatamento centrífugo polar significativo).',
      thermodynamics: 'Superfície e baixa troposfera operando em estado supercrítico de dióxido de carbono com capacidade térmica massiva.',
      radiationRegime: 'Albedo de Bond de 0.77 (nuvens de H₂SO₄ refletem 77% da luz solar incidente), absorvendo apenas 23% mas retendo quase 100% da radiação térmica emitida.',
    },
  },

  // =========================================================================
  // 4. TERRA
  // =========================================================================
  terra: {
    geology: [
      {
        name: 'Crosta Terrestre (Oceânica e Continental)',
        depthKm: '0 a 35 km',
        composition: 'Silicatos de alumínio (sial) e basalto rico em magnésio (sima)',
        temperature: '290 K a 800 K (17°C a 500°C)',
        color: '#3b82f6',
        description: 'Casca sólida fragmentada em placas tectônicas móveis que flutuam sobre a astenosfera, gerando vulcanismo e deriva continental.',
      },
      {
        name: 'Manto Superior e Transição',
        depthKm: '35 a 660 km',
        composition: 'Peridotito e olivina de alta pressão',
        temperature: '800 K a 1.900 K',
        color: '#f97316',
        description: 'Rochas sólidas sob comportamento dúctil em escalas de tempo de milhões de anos, permitindo convecção térmica.',
      },
      {
        name: 'Manto Inferior (Mesosfera)',
        depthKm: '660 a 2.890 km',
        composition: 'Bridgmanita ((Mg,Fe)SiO3) e ferropericlásio',
        temperature: '1.900 K a 4.000 K',
        color: '#ea580c',
        description: 'A maior camada em volume do planeta, sob pressões de até 135 gigapascais.',
      },
      {
        name: 'Núcleo Externo Líquido',
        depthKm: '2.890 a 5.150 km',
        composition: 'Liga líquida de Ferro (85%), Níquel (5%) e elementos leves (S, O, Si)',
        temperature: '4.000 K a 5.700 K',
        color: '#dc2626',
        description: 'Correntes turbulentas de metal líquido geradas pela rotação da Terra criam o campo magnético planetário pelo efeito dínamo.',
      },
      {
        name: 'Núcleo Interno Sólido',
        depthKm: '5.150 a 6.371 km',
        composition: 'Cristal metálico de ferro-níquel superdenso',
        temperature: '~6.000 K (tão quente quanto a superfície do Sol!)',
        color: '#fef08a',
        description: 'Mantido em estado sólido pela pressão inacreditável de 3,6 milhões de atmosferas terrestres (360 GPa).',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 1.0000,
      eccentricity: 0.0167,
      inclinationDeg: 0.000,
      orbitalVelocityKmS: 29.78,
      periapsisDistance: 'Periélio: 147.098.074 km (0.983 AU)',
      apoapsisDistance: 'Afélio: 152.097.701 km (1.017 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 9.807,
      surfacePressureBar: 1.013,
      scaleHeightKm: 8.5,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 9.4,
      surfaceLandingDeltaVKmS: 11.2,
      entryVelocityKmS: 11.2,
      aerobrakingFeasible: true,
      flightNotes: 'Ponto de partida da exploração humana. O escudo térmico na reentrada orbital dissipa velocidades de 28.000 km/h (LEO) a mais de 40.000 km/h (retorno lunar de Orion/Apollo).',
    },
    didactic: {
      whatIsIt: 'A Terra é o nosso lar: o único planeta conhecido em todo o cosmos que possui vida inteligente, oceanos de água líquida e uma atmosfera rica em oxigênio.',
      everydayAnalogy: 'Se a Terra tivesse o tamanho de uma maçã, toda a atmosfera respirável onde aviões voam e montanhas existem seria mais fina que a casca dessa maçã!',
      ifYouWereThere: 'É o padrão universal que define o que consideramos confortável: gravidade de 1g, pressão de 1 atmosfera, clima temperado e ciclo dia/noite de 24 horas.',
      howToReachIt: 'Todas as viagens partem daqui! Entrar em órbita exige acelerar a 28.000 km/h consumindo mais de 90% do peso de um foguete apenas em propelentes.',
      funFacts: [
        'A Terra viaja ao redor do Sol a uma velocidade estonteante de 107.000 km/h (30 km por segundo!).',
        'Seu núcleo de ferro é tão quente quanto a superfície visível do Sol (cerca de 6.000°C).',
        'O campo magnético da Terra funciona como um escudo de força invisível que desvia o vento solar mortal, permitindo que a vida exista há mais de 3,8 bilhões de anos.',
      ],
    },
    technical: {
      formalDefinition: 'Planeta telúrico diferenciado da classe habitável com biosfera biogeoquímica ativa, tectônica de placas convectiva e dínamo magnetosférico auto-sustentado.',
      primaryEquations: [
        {
          label: 'Força Centrípeta Orbital',
          formula: 'v_{\\text{orb}} = \\sqrt{\\frac{G M_\\oplus}{r}} \\approx 7.91\\text{ km/s (na superfície)}',
          desc: 'Primeira velocidade cósmica para sustentação de órbita circular baixa.',
        },
        {
          label: 'Velocidade de Escape Parabólica',
          formula: 'v_{\\text{esc}} = \\sqrt{\\frac{2 G M_\\oplus}{R_\\oplus}} \\approx 11.19\\text{ km/s}',
          desc: 'Velocidade necessária para superar completamente a energia potencial gravitacional da Terra.',
        },
      ],
      fieldEquationsDesc: 'Potencial gravitacional expandido em harmônicos esféricos com coeficiente J₂ = 1.08263 × 10⁻³ decorrente do achatamento polar oblato do geoide.',
      thermodynamics: 'Temperatura de equilíbrio radiativo Teq = [L☉(1 - A) / (16π σ d²)]^(1/4) ≈ 255 K amplificada pelo forçamento radiativo de gases estufa para 288 K.',
      radiationRegime: 'Campo geomagnético dipolar (30 a 60 μT) que forma os Cinturões de Radiação de Van Allen aprisionando prótons e elétrons relativísticos do vento solar.',
    },
  },

  // =========================================================================
  // 5. LUA
  // =========================================================================
  lua: {
    geology: [
      {
        name: 'Regolito Lunar e Crosta de Anortosito',
        depthKm: '0 a 60 km',
        composition: 'Anortosito rico em plagioclásio nos planaltos claros e basaltos ricos em titânio e ferro nos mares escuros',
        temperature: '100 K (-173°C) a 390 K (+117°C)',
        color: '#94a3b8',
        description: 'Manto de poeira e rochas trituradas por bilhões de anos de impactos meteoríticos. Sem atmosfera para erosão, pegadas de astronautas durarão milhões de anos.',
      },
      {
        name: 'Manto Lunar Litosférico',
        depthKm: '60 a 1.000 km',
        composition: 'Olivina, ortopiroxênio e clinopiroxênio',
        temperature: '800 K a 1.400 K',
        color: '#64748b',
        description: 'Litosfera rígida espessa onde ocorrem os "sismos lunares" (moonquakes) causados pela tração de maré exercida pela Terra.',
      },
      {
        name: 'Núcleo Metálico Parcial',
        depthKm: '1.000 a 1.737 km',
        composition: 'Ferro com enxofre e níquel (apenas ~1% a 2% da massa total da Lua)',
        temperature: '~1.600 K',
        color: '#334155',
        description: 'Pequeno núcleo desprovido de convecção, indicando que o dínamo magnético lunar morreu há mais de 3 bilhões de anos.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0.00257,
      eccentricity: 0.0549,
      inclinationDeg: 5.145,
      orbitalVelocityKmS: 1.022,
      periapsisDistance: 'Perigeu: 362.600 km',
      apoapsisDistance: 'Apogeu: 405.400 km',
    },
    aerospace: {
      surfaceGravityMS2: 1.62,
      surfacePressureBar: 1e-14,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 0.83,
      surfaceLandingDeltaVKmS: 1.68,
      entryVelocityKmS: 2.38,
      aerobrakingFeasible: false,
      flightNotes: 'Pouso 100% retrofoguete (sem aerofrenagem). Gravidade de apenas 1/6 da Terra permite que pequenos estágios de ascensão (como o Módulo Lunar Apollo de 4,5 toneladas) alcancem órbita com facilidade.',
    },
    didactic: {
      whatIsIt: 'A Lua é o único satélite natural da Terra e o único mundo alienígena já pisado por seres humanos.',
      everydayAnalogy: 'Se você salta 50 centímetros na Terra, na Lua com o mesmo esforço muscular você daria um pulo de 3 metros de altura e flutuaria suavemente de volta!',
      ifYouWereThere: 'O silêncio é absoluto. Não há vento, água ou chuva. O céu é totalmente negro e a Terra fica suspensa no céu como uma bola azul brilhante quatro vezes maior que a Lua cheia.',
      howToReachIt: 'Leva apenas 3 dias de viagem espacial. O foguete Saturn V das missões Apollo e o SLS do programa Artemis injetam naves em órbita de Transferência Translunar (TLI) a 39.000 km/h.',
      funFacts: [
        'A Lua sempre mostra a mesma face para a Terra porque sua rotação está sincronizada com sua órbita.',
        'A poeira lunar (regolito) tem cheiro de pólvora queimada e é tão abrasiva quanto cacos microscópicos de vidro pontiagudo.',
        'A atração gravitacional da Lua move bilhões de toneladas de água nos oceanos da Terra todos os dias, criando as marés altas e baixas.',
      ],
    },
    technical: {
      formalDefinition: 'Satélite natural telúrico formado pelo impacto gigante primordial de Theia contra a proto-Terra (Giant Impact Hypothesis), em travamento de maré sincrônico (1:1 spin-orbit resonance).',
      primaryEquations: [
        {
          label: 'Força de Maré Diferencial',
          formula: 'F_{\\text{maré}} = \\frac{2 G M_\\oplus m R_{\\text{lua}}}{d^3}',
          desc: 'Gradiente de gravidade gerador do abaciamento de maré e da recessão orbital secular da Lua (3.8 cm/ano).',
        },
        {
          label: 'Velocidade Circular Lunar Baixa (LLO)',
          formula: 'v = \\sqrt{\\frac{G M_{\\text{lua}}}{R_{\\text{lua}}}} \\approx 1.68\\text{ km/s}',
          desc: 'Requisito de velocidade para órbita circular a 100 km de altitude lunar.',
        },
      ],
      fieldEquationsDesc: 'Campo de gravidade anisotrópico com anomalias de concentração de massa (mascons) nos bacias de impacto que perturbam órbitas de satélites baixos.',
      thermodynamics: 'Troca de calor estritamente radiativa com a rocha lunar; gradiente térmico de mais de 290 K entre a superfície exposta ao Sol e o solo sombreado.',
      radiationRegime: 'Exposição total e sem filtro ao vento solar e raios cósmicos galácticos (GCRs), enriquecendo o regolito com isótopo Hélio-3 (³He).',
    },
  },

  // =========================================================================
  // 6. ESTAÇÃO ESPACIAL INTERNACIONAL (ISS)
  // =========================================================================
  iss: {
    geology: [
      {
        name: 'Estrutura Primária e Módulos Pressurizados',
        depthKm: 'Envergadura de 109 m × 73 m (450 toneladas)',
        composition: 'Ligas de Alumínio-Lítio 2195, titânio, Kevlar e cobertores térmicos MLI',
        temperature: '295 K (+22°C ambiente interno controlado)',
        color: '#00e5ff',
        description: '16 módulos pressurizados (Destiny, Zvezda, Columbus, Kibo, Zarya, Tranquility, Cupola) com 916 m³ de volume habitável.',
      },
      {
        name: 'Asas Fotovoltaicas Solares (SAW e iROSA)',
        depthKm: 'Área de mais de 2.400 m² de células solares',
        composition: 'Silício semicondutor e células de junção tripla de Arsenieto de Gálio (GaAs)',
        temperature: '116 K a 394 K (-157°C a +121°C)',
        color: '#f59e0b',
        description: 'Geram até 120 quilowatts de energia elétrica sustentando sistemas de suporte de vida e experimentos laboratoriais.',
      },
      {
        name: 'Radiadores de Rejeição Térmica de Amônia',
        depthKm: 'Painéis dobráveis montados na treliça integrada (ITS)',
        composition: 'Circuitos fechados de titânio preenchidos com amônia anidra líquida',
        temperature: 'Dissipação contínua de calor no vácuo',
        color: '#cbd5e1',
        description: 'Rejeitam o calor excessivo produzido pelos computadores, instrumentos e corpo dos astronautas para o espaço escuro.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0.000045,
      eccentricity: 0.0005,
      inclinationDeg: 51.64,
      orbitalVelocityKmS: 7.66,
      periapsisDistance: 'Perigeu: 418 km',
      apoapsisDistance: 'Apogeu: 422 km',
    },
    aerospace: {
      surfaceGravityMS2: 0.00001,
      surfacePressureBar: 1.013,
      scaleHeightKm: 8.5,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 9.3,
      surfaceLandingDeltaVKmS: 7.66,
      entryVelocityKmS: 7.66,
      aerobrakingFeasible: true,
      flightNotes: 'Viaja a 27.600 km/h. Perde cerca de 100 metros de altitude por dia devido ao arrasto tênue da termosfera; necessita de queimas periódicas de reboost dos cargueiros Progress ou Cygnus.',
    },
    didactic: {
      whatIsIt: 'A Estação Espacial Internacional é o maior laboratório científico e posto habitado que a humanidade já construiu fora do planeta Terra.',
      everydayAnalogy: 'É como uma casa com 6 quartos, 2 banheiros e uma academia flutuando a 420 km de altura e se movendo na velocidade de uma bala disparada por um fuzil!',
      ifYouWereThere: 'Você flutuaria o tempo todo como se estivesse voando. Gotas de água viram bolhas flutuantes no ar e você precisa se amarrar em um saco de dormir na parede para não colidir com o teto enquanto dorme.',
      howToReachIt: 'Naves tripuladas como a Crew Dragon (SpaceX) e a Soyuz (Roscosmos) decolam da Terra e executam manobras de aproximação orbital automatizadas até atracar suavemente em suas escotilhas.',
      funFacts: [
        'A ISS dá uma volta completa na Terra a cada 92 minutos: os astronautas assistem a 16 nasceres e pores do Sol por dia!',
        'Mais de 270 astronautas e cosmonautas de mais de 20 países já viveram e trabalharam na estação desde o ano 2000.',
        'Em noites limpas, você pode ver a ISS a olho nu cruzando o céu como uma estrela brilhante que não pisca.',
      ],
    },
    technical: {
      formalDefinition: 'Estação orbital modular internacional em órbita baixa da Terra (LEO), operando como microgravidade de classe 10⁻⁵ g e bancada de testes de tecnologias de espaço profundo.',
      primaryEquations: [
        {
          label: 'Equilíbrio Centrífugo de Órbita Circular Baixa',
          formula: 'v_{\\text{LEO}} = \\sqrt{\\frac{G M_\\oplus}{R_\\oplus + h}} \\approx 7.66\\text{ km/s}',
          desc: 'Velocidade tangencial de sustentação orbital a h = 420 km de altitude.',
        },
        {
          label: 'Período de Revolução Orbital Kepleriano',
          formula: 'T = 2\\pi \\sqrt{\\frac{(R_\\oplus + h)^3}{G M_\\oplus}} \\approx 5.570\\text{ s (92.8 min)}',
          desc: 'Tempo decorrido para completar 360 graus de anomalia verdadeira em torno do geoide.',
        },
      ],
      fieldEquationsDesc: 'Arrasto de gravidade atmosférica residual parametrizado pelo coeficiente balístico B = m / (C_D A) com descida secular induzida pelo ciclo solar F10.7.',
      thermodynamics: 'Balanço térmico de circuito bifásico com bombas rotativas de amônia rejeitando calor por radiadores planos em radiação de corpo negro a 4 K do espaço.',
      radiationRegime: 'Exposição periódica à Anomalia do Atlântico Sul (SAA), onde o cinturão de Van Allen interno se aproxima da superfície e eleva as doses de radiação ionizante.',
    },
  },

  // =========================================================================
  // 7. MARTE
  // =========================================================================
  marte: {
    geology: [
      {
        name: 'Crosta Férrica Oxigenada (Solo Vermelho)',
        depthKm: '0 a 50 km',
        composition: 'Basaltos ricos em óxidos de ferro (ferrugem / hematita Fe₂O₃), percloratos e argilas',
        temperature: '140 K a 300 K (-133°C a +27°C)',
        color: '#ef4444',
        description: 'Abriga o colossal Valles Marineris (cânion com 4.000 km de comprimento) e o vulcão Olympus Mons (22 km de altura).',
      },
      {
        name: 'Manto Litosférico Estagnado',
        depthKm: '50 a 1.800 km',
        composition: 'Silicatos ricos em ferro mais densos que o manto da Terra',
        temperature: '1.200 K a 2.000 K',
        color: '#b91c1c',
        description: 'Manto rígido sem placas tectônicas ativas; permitiu que pontos quentes vulcânicos permanecessem no mesmo local por bilhões de anos, empilhando vulcões gigantescos.',
      },
      {
        name: 'Núcleo Líquido de Ferro-Enxofre',
        depthKm: '1.800 a 3.390 km',
        composition: 'Ferro, níquel e alta fração de enxofre leve (16%)',
        temperature: '2.000 K a 2.400 K',
        color: '#7f1d1d',
        description: 'Confirmado pela sonda InSight da NASA como sendo inteiramente líquido e de baixa densidade, mas desprovido de geodínamo global.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 1.5237,
      eccentricity: 0.0934,
      inclinationDeg: 1.850,
      orbitalVelocityKmS: 24.07,
      periapsisDistance: 'Periélio: 206.650.000 km (1.381 AU)',
      apoapsisDistance: 'Afélio: 249.261.000 km (1.666 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 3.72,
      surfacePressureBar: 0.00636,
      scaleHeightKm: 11.1,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 4.15,
      surfaceLandingDeltaVKmS: 5.03,
      entryVelocityKmS: 5.8,
      aerobrakingFeasible: true,
      flightNotes: 'Pouso ultra-desafiador ("7 minutos de terror"): a atmosfera é densa demais para ser ignorada, mas fina demais para frear uma nave apenas com paraquedas; exige escudos ablativos, paraquedas supersônicos e retrofoguetes sky crane.',
    },
    didactic: {
      whatIsIt: 'Marte é o Planeta Vermelho: um deserto gelado que já teve rios caudalosos, lagos de água doce e talvez vida microbiana há bilhões de anos.',
      everydayAnalogy: 'Marte é como o deserto do Saara congelado na Antártida, coberto por um céu rosa-salmão e com tempestades de poeira do tamanho de continentes inteiros!',
      ifYouWereThere: 'Você pesaria quase 1/3 do que pesa na Terra (se pesa 90 kg, pareceria ter 34 kg). O pôr do Sol em Marte é espetacularmente azul devido à poeira atmosférica fina.',
      howToReachIt: 'As janelas de lançamento de Hohmann da Terra para Marte abrem apenas a cada 26 meses (quando os dois planetas se alinham). A viagem leva cerca de 7 a 9 meses.',
      funFacts: [
        'O Monte Olimpo em Marte tem 21,9 km de altura: é quase 3 vezes mais alto que o Monte Everest e tem a área inteira da França!',
        'O cânion Valles Marineris é tão gigantesco que se estivesse no Brasil, atravessaria o país inteiro de São Paulo até a Amazônia.',
        'O helicóptero Ingenuity da NASA voou mais de 70 vezes na atmosfera rarefeita de Marte com hélices girando a 2.500 RPM.',
      ],
    },
    technical: {
      formalDefinition: 'Planeta telúrico pós-hidrológico com atmosfera colapsada dominada por escape de Jeans e erosão pelo vento solar após a cessação do geodínamo há 4 Ga.',
      primaryEquations: [
        {
          label: 'Taxa de Fuga Térmica de Jeans',
          formula: '\\Phi_J = \\frac{n_c v_{\\text{th}}}{2\\sqrt{\\pi}} (1 + \\lambda_c) e^{-\\lambda_c}, \\quad \\lambda_c = \\frac{G M m}{k_B T r_c}',
          desc: 'Perda atmosférica contínua de hidrogênio e oxigênio para o espaço no topo da exosfera.',
        },
        {
          label: 'Órbita de Transferência de Hohmann Terra-Marte',
          formula: '\\Delta v_1 = \\sqrt{\\frac{\\mu}{r_1}} \\left(\\sqrt{\\frac{2 r_2}{r_1 + r_2}} - 1\\right) \\approx 2.94\\text{ km/s}',
          desc: 'Impulso translacional na saída da órbita de estacionamento da Terra em direção a Marte.',
        },
      ],
      fieldEquationsDesc: 'Magnetismo crustal fóssil remanescente ("listras magnéticas") sem dipolo central, interagindo com o plasma interplanetário.',
      thermodynamics: 'Ciclo sazonal de sublimação e deposição de CO₂ que congela até 25% de toda a atmosfera marciana nas calotas polares todo inverno.',
      radiationRegime: 'Dose de radiação de superfície de ~250 mSv/ano (ausência de camada de ozônio e magnetopausa global), exigindo abrigos subterrâneos para humanos.',
    },
  },

  // =========================================================================
  // 8. CERES
  // =========================================================================
  ceres: {
    geology: [
      {
        name: 'Regolito Rico em Argila e Carbonatos',
        depthKm: '0 a 40 km',
        composition: 'Filossilicatos ricos em amônia, carbonato de sódio e compostos orgânicos',
        temperature: '130 K a 235 K (-143°C a -38°C)',
        color: '#737373',
        description: 'Superfície de albedo escuro cravejada de crateras e depósitos minerais brancos brilhantes trazidos por fontes criovulcânicas.',
      },
      {
        name: 'Manto Geloso Rico em Água e Salmoura',
        depthKm: '40 a 100 km',
        composition: 'Mistura de gelo de água, cloreto de sódio e sais de amônio em estado fluido/semissólido',
        temperature: '200 K a 240 K',
        color: '#0284c7',
        description: 'Oceano fóssil relicto subterrâneo com bolsões líquidos sustentados por depressão do ponto de congelamento pelos sais.',
      },
      {
        name: 'Núcleo Rochoso Diferenciado',
        depthKm: '100 a 470 km',
        composition: 'Silicatos hidratados densos e ferro oxidado',
        temperature: '~300 K',
        color: '#404040',
        description: 'Núcleo volumoso que comprova que Ceres sofreu diferenciação planetária interna completa, ao contrário dos asteroides comuns.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 2.7675,
      eccentricity: 0.0758,
      inclinationDeg: 10.593,
      orbitalVelocityKmS: 17.90,
      periapsisDistance: 'Periélio: 382.620.000 km (2.558 AU)',
      apoapsisDistance: 'Afélio: 445.410.000 km (2.977 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 0.28,
      surfacePressureBar: 1e-13,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 0.36,
      surfaceLandingDeltaVKmS: 0.51,
      entryVelocityKmS: 0.51,
      aerobrakingFeasible: false,
      flightNotes: 'Gravidade superficial mínima de 0,029 g. Uma sonda como a Dawn pôde orbitar Ceres a apenas 35 km de altitude e usar motores de propulsão iônica com eficiência máxima.',
    },
    didactic: {
      whatIsIt: 'Ceres é o maior objeto do Cinturão de Asteroides entre Marte e Júpiter e o único planeta anão localizado no Sistema Solar interior.',
      everydayAnalogy: 'Se o Cinturão de Asteroides fosse um bolo de chocolate gigante, Ceres seria uma fatia pesando um terço de todo o bolo sozinho!',
      ifYouWereThere: 'A gravidade é tão fraca que você pesaria menos de 3% do seu peso na Terra (se pesa 70 kg, pesaria apenas 2 kg!). Um arremesso de pedra atingiria facilmente a órbita do planeta.',
      howToReachIt: 'A sonda Dawn da NASA usou motores iônicos avançados que expeliam gás xenônio por anos ininterruptos, visitando o asteroide Vesta e depois entrando em órbita de Ceres.',
      funFacts: [
        'Ceres abriga a montanha Ahuna Mons, um vulcão criogênico de 4 km de altura que cospe lama salgada e gelo em vez de lava incandescente!',
        'Cientistas estimam que Ceres contém mais água doce congelada em seu manto do que todos os rios e lagos da Terra somados.',
        'Os misteriosos "pontos brilhantes" na Cratera Occator brilham no escuro porque são cristais puros de sal marinho expostos à luz do Sol.',
      ],
    },
    technical: {
      formalDefinition: 'Planeta anão protoplanetário relicto de classe C (carbonáceo) com diferenciação interna em equilíbrio hidrostático no Cinturão de Asteroides.',
      primaryEquations: [
        {
          label: 'Densidade Média e Fração de Gelo',
          formula: '\\rho = \\frac{M}{\\frac{4}{3}\\pi R^3} \\approx 2.16\\text{ g/cm}^3',
          desc: 'Indica uma composição híbrida de ~70% rocha silicatada e ~30% gelo de água/voláteis.',
        },
        {
          label: 'Velocidade Orbital de Escape Superficial',
          formula: 'v_{\\text{esc}} = \\sqrt{\\frac{2 G M}{R}} \\approx 0.51\\text{ km/s}',
          desc: 'Requisito propulsivo ultra-baixo para decolagem e escape interplanetário.',
        },
      ],
      fieldEquationsDesc: 'Esferoide oblato com compressão gravitacional hidrostática relaxada e momento de inércia C/(MR²) = 0.37.',
      thermodynamics: 'Criovulcanismo ativado por calor radiogênico residual e depressão crioscópica em salmouras hiper-salinas.',
      radiationRegime: 'Exosfera transitória de vapor d\'água detectada pelo telescópio espacial Herschel, gerada por sublimação de gelo superficial sob luz solar.',
    },
  },

  // =========================================================================
  // 9. JÚPITER & EUROPA
  // =========================================================================
  jupiter: {
    geology: [
      {
        name: 'Troposfera Joviana e Bandas Convectivas',
        depthKm: '0 a 1.000 km',
        composition: 'Hidrogênio (90%), Hélio (10%) com nuvens de Amônia (NH₃) e Hidrossulfeto de Amônio (NH₄SH)',
        temperature: '165 K (-108°C) a 300 K',
        color: '#d97706',
        description: 'Faixas alternadas de zonas claras frias e cinturões escuros quentes soprados por jatos zonais de até 500 km/h.',
      },
      {
        name: 'Manto de Hidrogênio Líquido Molecular',
        depthKm: '1.000 a 20.000 km',
        composition: 'Hidrogênio fluido supercrítico sob milhares de atmosferas',
        temperature: '2.000 K a 10.000 K',
        color: '#b45309',
        description: 'A transição entre gás e líquido é contínua; não há superfície sólida em nenhum ponto de Júpiter.',
      },
      {
        name: 'Manto de Hidrogênio Metálico Líquido',
        depthKm: '20.000 a 60.000 km',
        composition: 'Prótons e elétrons livres sob pressões colossais (> 300 GPa)',
        temperature: '10.000 K a 25.000 K',
        color: '#ea580c',
        description: 'O hidrogênio se comporta como mercúrio líquido metálico, gerando a maior e mais poderosa magnetosfera de todo o Sistema Solar.',
      },
      {
        name: 'Núcleo Diluído e Fragmentado',
        depthKm: '60.000 a 70.000 km',
        composition: 'Silicatos, ferro e gelos dissolvidos no hidrogênio metálico',
        temperature: '~30.000 K',
        color: '#78350f',
        description: 'Descoberto pela sonda Juno: o núcleo não é uma bola de rocha compacta, mas sim um "núcleo difuso" que se dissolveu na infância do planeta.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 5.2044,
      eccentricity: 0.0489,
      inclinationDeg: 1.303,
      orbitalVelocityKmS: 13.07,
      periapsisDistance: 'Periélio: 740.520.000 km (4.950 AU)',
      apoapsisDistance: 'Afélio: 816.620.000 km (5.459 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 24.79,
      surfacePressureBar: 2.0,
      scaleHeightKm: 27.0,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 42.1,
      surfaceLandingDeltaVKmS: 59.5,
      entryVelocityKmS: 60.0,
      aerobrakingFeasible: true,
      flightNotes: 'Entrada atmosférica extrema: a sonda atmosférica Galileo (1995) entrou a 170.000 km/h enfrentando calor mais quente que a fotosfera solar e desaceleração brutal de 228g.',
    },
    didactic: {
      whatIsIt: 'Júpiter é o rei dos planetas: tem duas vezes e meia a massa de todos os outros planetas do Sistema Solar somados!',
      everydayAnalogy: 'Júpiter é tão colossal que caberiam mais de 1.300 planetas Terra inteiros dentro dele!',
      ifYouWereThere: 'Não existe chão firme para pisar. Se você pulasse de paraquedas em Júpiter, afundaria continuamente na escuridão por milhares de quilômetros até ser esmagado pela pressão que liquefaz o próprio gás.',
      howToReachIt: 'As naves levam de 3 a 6 anos para chegar lá. As sondas Juno e Galileo precisaram de blindagens maciças de titânio para sobreviver aos cinturões de radiação letal de Júpiter.',
      funFacts: [
        'A famosa Grande Mancha Vermelha é um furacão com ventos de 430 km/h que está ativo há pelo menos 350 anos e é maior que a Terra inteira!',
        'Júpiter tem 95 luas catalogadas — incluindo Europa, que esconde um oceano líquido subterrâneo com duas vezes mais água que toda a Terra.',
        'Ele funciona como um "aspirador de pó cósmico": sua gravidade gigante suga ou desvia cometas e asteroides que poderiam colidir com a Terra.',
      ],
    },
    technical: {
      formalDefinition: 'Planeta gigante gasoso joviano primário de acreção de gás do disco protoplanetário com núcleo diluído (fuzzy core) e campo magnético gerado por dínamo de hidrogênio metálico.',
      primaryEquations: [
        {
          label: 'Momento Dipolar Magnético de Júpiter',
          formula: 'M_J \\approx 1.55 \\times 10^{20}\\text{ T}\\cdot\\text{m}^3 \\approx 20.000\\, M_\\oplus',
          desc: 'Campo magnético superficial no equador de 4.2 Gauss gerando auroras permanentes de raios-X nos polos.',
        },
        {
          label: 'Relação Massa-Raio Joviana Limite',
          formula: 'R \\propto M^{-1/3} \\quad (\\text{para matéria degenerada em } M > 2 M_J)',
          desc: 'Acrescentar mais massa a Júpiter faria ele encolher em volume devido à compressão quântica de elétrons.',
        },
      ],
      fieldEquationsDesc: 'Achatamento polar f = 0.06487 gerando harmônicos zonais colossais J₂, J₄, J₆ medidos pelas oscilações Doppler de rádio da sonda Juno.',
      thermodynamics: 'Contração gravitacional lenta pelo mecanismo de Kelvin-Helmholtz irradiando 1.67 vezes mais energia do que a absorvida do Sol.',
      radiationRegime: 'Toro de plasma ionizado gerado pelos vulcões de enxofre da lua Io acelerando elétrons a velocidades ultra-relativísticas nos cinturões de radiação.',
    },
  },

  // =========================================================================
  // 10. SATURNO & TITÃ
  // =========================================================================
  saturno: {
    geology: [
      {
        name: 'Atmosfera Superior e Nuvens',
        depthKm: '0 a 1.000 km',
        composition: 'Hidrogênio molecular (96%), Hélio (3%) e cristais de Amônia (NH₃)',
        temperature: '134 K a 273 K (-139°C a 0°C)',
        color: '#fde047',
        description: 'Faixas douradas uniformes geradas por névoas de hidrocarbonetos causadas pela fotólise da luz solar sobre o metano.',
      },
      {
        name: 'Manto de Hidrogênio Líquido e Chuva de Hélio',
        depthKm: '1.000 a 30.000 km',
        composition: 'Hidrogênio fluido supercrítico e gotas de Hélio em condensação',
        temperature: '2.000 K a 10.000 K',
        color: '#ca8a04',
        description: 'O hélio condensa como gotas de chuva no hidrogênio líquido e precipita em direção ao centro, liberando energia gravitacional que explica por que Saturno irradia 2,5 vezes mais calor do que recebe do Sol.',
      },
      {
        name: 'Manto de Hidrogênio Metálico',
        depthKm: '30.000 a 45.000 km',
        composition: 'Hidrogênio sob pressões colossais (> 200 GPa) com elétrons deslocalizados',
        temperature: '10.000 K a 15.000 K',
        color: '#eab308',
        description: 'Nesse estado exótico, o hidrogênio se comporta como um metal líquido condutor elétrico, gerando o campo magnético quase perfeitamente simétrico de Saturno.',
      },
      {
        name: 'Núcleo Rochoso e Geloso Difuso',
        depthKm: '45.000 a 58.232 km',
        composition: 'Silicatos de ferro, níquel, gelos de alta densidade (água, amônia, metano)',
        temperature: '~11.700 K',
        color: '#713f12',
        description: 'Dados da sonda Cassini revelaram um "núcleo difuso" que não tem fronteira nítida, estendendo-se por até 60% do raio do planeta em uma mistura gradual.',
      },
      {
        name: 'Sistema de Anéis Majestoso (Anéis A, B, C e Divisão de Cassini)',
        depthKm: 'Estendem-se de 66.900 km a 480.000 km do centro, com espessura de apenas 10 metros!',
        composition: '99% gelo de água pura (H₂O) fragmentado em pedregulhos de micrômetros a metros',
        temperature: '70 K a 110 K',
        color: '#fef08a',
        description: 'Os anéis são remanescentes de uma lua glacial destruída pela força de maré dentro do Limite de Roche de Saturno.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 9.5826,
      eccentricity: 0.0565,
      inclinationDeg: 2.485,
      orbitalVelocityKmS: 9.68,
      periapsisDistance: 'Periélio: 1.353.572.956 km (9.05 AU)',
      apoapsisDistance: 'Afélio: 1.513.325.783 km (10.12 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 10.44,
      surfacePressureBar: 1.4,
      scaleHeightKm: 59.5,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 25.6,
      surfaceLandingDeltaVKmS: 35.5,
      entryVelocityKmS: 36.0,
      aerobrakingFeasible: true,
      flightNotes: 'Não possui superfície sólida para pouso. Uma sonda mergulhando em Saturno enfrenta ventos de 1.800 km/h e temperaturas crescentes até ser esmagada pela pressão hidrostática extrema, como ocorreu com a Cassini em 2017.',
    },
    didactic: {
      whatIsIt: 'O segundo maior planeta do Sistema Solar, famoso por seu gigantesco e deslumbrante sistema de anéis de gelo brilhante.',
      everydayAnalogy: 'Saturno é tão pouco denso que se você encontrasse uma banheira de água grande o suficiente no universo, Saturno flutuaria nela como um patinho de borracha!',
      ifYouWereThere: 'Os anéis têm mais de 280.000 km de largura, mas têm apenas 10 metros de espessura média! Se os anéis tivessem a largura de uma folha de papel sulfite, seriam 10.000 vezes mais finos que a própria folha.',
      howToReachIt: 'Uma viagem direta até Saturno levaria mais de 7 anos. A sonda Cassini precisou usar a gravidade de Vênus (duas vezes), da Terra e de Júpiter como estilingues gravitacionais para economizar combustível.',
      funFacts: [
        'No polo norte de Saturno existe uma tempestade atmosférica com formato perfeitamente hexagonal estável há décadas, com mais de 30.000 km de diâmetro (maior que duas Terras inteiras!).',
        'Saturno tem 146 luas conhecidas — incluindo Titã (com rios e lagos de metano líquido) e Encélado (com gêiseres de água subterrânea).',
        'Os anéis estão "chovendo" para dentro do planeta sob a gravidade e o campo magnético; cientistas estimam que eles podem desaparecer em menos de 100 a 300 milhões de anos.',
      ],
    },
    technical: {
      formalDefinition: 'Planeta gigante gasoso joviano oblatizado por rotação rápida (P = 10,57 h) circundado por um disco circunplanetário colisional dentro do raio de maré de Roche.',
      primaryEquations: [
        {
          label: 'Limite de Roche para Ruptura de Maré',
          formula: 'd_R = 2.44\\, R_p \\left(\\frac{\\rho_p}{\\rho_m}\\right)^{1/3} \\approx 147.000\\text{ km}',
          desc: 'Distância mínima onde a gravidade própria de um satélite não resiste às forças de maré diferenciais do planeta.',
        },
        {
          label: 'Ressonância Orbital de Lindblad (Divisão de Cassini)',
          formula: 'm(\\Omega - \\Omega_p) = \\pm \\kappa',
          desc: 'Perturbação ressonante 2:1 com a lua Mimas esvaziando a divisão de 4.800 km nos anéis.',
        },
        {
          label: 'Achatamento Rotacional Hidrostático',
          formula: 'f = \\frac{R_{eq} - R_{pol}}{R_{eq}} = \\frac{60.268 - 54.364}{60.268} \\approx 0.09796',
          desc: 'Maior achatamento polar entre todos os planetas do Sistema Solar decorrente da baixa densidade média (0.687 g/cm³).',
        },
      ],
      fieldEquationsDesc: 'Campo gravitacional zonal assimétrico com harmônicos zonais ímpares e pares (J₂, J₄, J₆, J₈) medidos com ultraprecisão pela Cassini.',
      thermodynamics: 'Calor interno gerado por diferenciação gravitacional via demiscibilidade de hidrogênio e hélio (chuva de hélio em camadas supercríticas).',
      radiationRegime: 'Magnetosfera dipolar colinear quase perfeitamente alinhada com o eixo de rotação (< 0.007° de inclinação), gerando emissões de rádio quilométricas (SKR).',
    },
  },

  // =========================================================================
  // 11. URANO
  // =========================================================================
  urano: {
    geology: [
      {
        name: 'Atmosfera Ciano e Camada de Metano',
        depthKm: '0 a 5.000 km',
        composition: 'Hidrogênio (83%), Hélio (15%) e Metano (2.3%) com cristais de gelo de H₂S e NH₃',
        temperature: '49 K (-224°C) a 100 K',
        color: '#22d3ee',
        description: 'O metano na atmosfera superior absorve avidamente a luz vermelha do Sol, conferindo a Urano sua tonalidade verde-azulada característica.',
      },
      {
        name: 'Manto de Fluido Superiônico ("Gelos Quentes")',
        depthKm: '5.000 a 20.000 km',
        composition: 'Sopa iônica densa de Água (H₂O), Amônia (NH₃) e Metano (CH₄) sob altíssima pressão',
        temperature: '2.000 K a 5.000 K',
        color: '#0891b2',
        description: 'Não é gelo sólido, mas um fluido iônico supercrítico condutor elétrico onde oxigênio cristaliza e prótons de hidrogênio fluem livremente, gerando o campo magnético do planeta.',
      },
      {
        name: 'Núcleo Rochoso-Silicatado de Ferro',
        depthKm: '20.000 a 25.362 km',
        composition: 'Silicatos hidratados de magnésio, ferro e níquel',
        temperature: '~5.000 K',
        color: '#155e75',
        description: 'Núcleo com massa equivalente à da Terra (0,55 M⊕) sob 800 GPa de pressão.',
      },
      {
        name: 'Anéis Escuros Finos e Luas Pastorais',
        depthKm: '13 anéis estreitos estendendo-se de 38.000 a 98.000 km do centro',
        composition: 'Matéria orgânica carbonácea escura e rochas processadas por radiação (albedo ~0.02)',
        temperature: '60 K',
        color: '#334155',
        description: 'Anéis extremamente finos e escuros como carvão, mantidos estáveis pela gravidade de luas pastoras como Cordelia e Ophelia.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 19.1912,
      eccentricity: 0.0471,
      inclinationDeg: 0.772,
      orbitalVelocityKmS: 6.80,
      periapsisDistance: 'Periélio: 2.741.300.000 km (18.32 AU)',
      apoapsisDistance: 'Afélio: 3.003.620.000 km (20.08 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 8.69,
      surfacePressureBar: 1.2,
      scaleHeightKm: 27.7,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 15.1,
      surfaceLandingDeltaVKmS: 21.3,
      entryVelocityKmS: 21.5,
      aerobrakingFeasible: true,
      flightNotes: 'Inserção orbital a 19 AU exige manobras complexas de frenagem propulsiva após anos de viagem; prioridade máxima de missão no Planetary Science Decadal Survey da NASA.',
    },
    didactic: {
      whatIsIt: 'Urano é o sétimo planeta a partir do Sol: um gigante de gelo misterioso que gira completamente deitado como uma bola rolando em sua órbita.',
      everydayAnalogy: 'Enquanto a Terra gira como um peão sobre uma mesa, Urano gira como uma bola de boliche rolando na pista, com seus anéis verticais apontados para cima!',
      ifYouWereThere: 'É o planeta mais frio do Sistema Solar (-224°C). Por causa de sua inclinação maluca de 98°, se você estivesse em um dos polos, passaria 42 anos seguidos sob luz solar constante e depois 42 anos no escuro congelante total.',
      howToReachIt: 'Apenas uma espaçonave visitou Urano em toda a história humana: a Voyager 2, em janeiro de 1986, após quase uma década de viagem pelo espaço profundo.',
      funFacts: [
        'Urano é o único planeta cujo nome é derivado diretamente da mitologia grega (Ouranos, o deus do céu), enquanto os outros vieram da mitologia romana.',
        'Suas 28 luas conhecidas não têm nomes de deuses mitológicos, mas sim de personagens das peças de William Shakespeare e poemas de Alexander Pope (como Miranda, Titânia e Oberon).',
        'Cientistas teorizam que a pressão absurda nas profundezas de Urano e Netuno quebra o metano, fazendo chover pedras preciosas de diamantes sólidos em direção ao núcleo!',
      ],
    },
    technical: {
      formalDefinition: 'Planeta gigante de gelo caracterizado por manto condutor superiônico de H₂O-NH₃-CH₄, obliquidade axial de 97.77° e campo magnético multipolar não dipolar assimétrico.',
      primaryEquations: [
        {
          label: 'Equação de Estado Politrópica Barotrópica',
          formula: 'P = K \\rho^{1 + 1/n}, \\quad n \\approx 1.5 \\text{ a } 2.0',
          desc: 'Modela o interior compressível de mantos de água superiônica sob pressões de megabars.',
        },
        {
          label: 'Deslocamento do Eixo Magnético (Dipolo Descentrado)',
          formula: '\\Delta r_{\\text{mag}} = 0.31\\, R_u, \\quad \\theta_{\\text{tilt}} = 58.6^\\circ',
          desc: 'O campo magnético não nasce no centro do planeta, mas sim em uma camada rasa convectiva desbalanceada.',
        },
      ],
      fieldEquationsDesc: 'Geometria gravitacional influenciada pelo fluxo térmico interno anomalousmente quase nulo (Urano é o único gigante que quase não emite calor interno próprio).',
      thermodynamics: 'Troca de calor estritamente passiva; luminosidade intrínseca L_int / L_sol < 1.06, contrastando fortemente com Netuno que emite 2.6 vezes mais.',
      radiationRegime: 'Magnetosfera helicoidal "em saca-rolhas" retorcida a cada rotação de 17,2 horas pelo ângulo extremo entre o eixo de rotação e o eixo magnético.',
    },
  },

  // =========================================================================
  // 12. NETUNO & TRITÃO
  // =========================================================================
  netuno: {
    geology: [
      {
        name: 'Atmosfera Azul Cobalto Profundo',
        depthKm: '0 a 4.000 km',
        composition: 'Hidrogênio (80%), Hélio (19%), Metano (1.5%) e sulfeto de hidrogênio',
        temperature: '55 K a 72 K (-201°C)',
        color: '#2563eb',
        description: 'Cor azul intensa e vívida provocada por um composto cromóforo desconhecido em conjunto com o metano. Nuvens brilhantes de metano branco flutuam na alta atmosfera.',
      },
      {
        name: 'Manto Geloso Fluido Convectivo',
        depthKm: '4.000 a 18.000 km',
        composition: 'Água, amônia e metano iônicos superaquecidos',
        temperature: '2.000 K a 5.000 K',
        color: '#1d4ed8',
        description: 'Altamente condutivo e dinâmico; gera calor interno vigoroso que alimenta as tempestades mais velozes do Sistema Solar.',
      },
      {
        name: 'Núcleo Rochoso Metálico',
        depthKm: '18.000 a 24.622 km',
        composition: 'Silicatos, ferro e níquel sob pressões de até 700 GPa',
        temperature: '~5.400 K',
        color: '#1e3a8a',
        description: 'Possui aproximadamente 1,2 massas terrestres de material refratário compacto.',
      },
      {
        name: 'Lua Capturada Tritão (Criovulcanismo Ativo)',
        depthKm: 'Órbita retrógrada a 354.800 km',
        composition: 'Crosta de nitrogênio congelado com manto de gelo e núcleo rochoso',
        temperature: '38 K (-235°C / o lugar mais gelado do sistema)',
        color: '#60a5fa',
        description: 'Tritão é um mundo capturado do Cinturão de Kuiper que possui gêiseres ativos de nitrogênio que cospem poeira preta a 8 km de altura.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 30.0699,
      eccentricity: 0.0086,
      inclinationDeg: 1.770,
      orbitalVelocityKmS: 5.43,
      periapsisDistance: 'Periélio: 4.459.630.000 km (29.81 AU)',
      apoapsisDistance: 'Afélio: 4.536.870.000 km (30.33 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 11.15,
      surfacePressureBar: 1.5,
      scaleHeightKm: 20.0,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 16.6,
      surfaceLandingDeltaVKmS: 23.5,
      entryVelocityKmS: 23.6,
      aerobrakingFeasible: true,
      flightNotes: 'Distância de 30 AU (4,5 bilhões de km). Uma sonda em Netuno precisa de geradores termoelétricos de radioisótopos (RTGs de Plutônio-238) pois a luz solar é 900 vezes mais fraca que na Terra.',
    },
    didactic: {
      whatIsIt: 'Netuno é o oitavo e último planeta oficial do Sistema Solar: um gigante azul açoitado pelos ventos mais ferozes de todo o reino planetário.',
      everydayAnalogy: 'Se você colocasse um caça supersônico a jato para voar em Netuno com a velocidade do som, os ventos do planeta ainda seriam quase o dobro mais rápidos que ele!',
      ifYouWereThere: 'Um mundo de ventos aterradores de 2.100 km/h que rasgariam qualquer estrutura em milissegundos, sob nuvens de cirros de metano que correm em sombras nítidas sobre o manto azul.',
      howToReachIt: 'Apenas a Voyager 2 passou por lá em agosto de 1989. O sinal de rádio da sonda na velocidade da luz levou mais de 4 horas para viajar de Netuno até as antenas na Terra!',
      funFacts: [
        'Netuno leva 165 anos terrestres para dar uma única volta no Sol: desde que foi descoberto em 1846, completou apenas uma órbita inteira em 2011!',
        'Foi o primeiro planeta descoberto pela matemática antes de ser visto: os astrônomos calcularam sua posição exata observando as perturbações gravitacionais na órbita de Urano.',
        'Sua lua gigante Tritão orbita Netuno no sentido contrário ao da rotação do planeta, provando que foi um planeta anão independente capturado pela gravidade de Netuno.',
      ],
    },
    technical: {
      formalDefinition: 'Planeta gigante de gelo com a mais alta densidade entre os gigantes (1.64 g/cm³), ventos zonais supersônicos em contra-corrente e lua oceânica retrógrada em decaimento de maré.',
      primaryEquations: [
        {
          label: 'Balanço Geostrófico de Vento Zonal',
          formula: '2\\Omega u \\sin\\phi = -\\frac{1}{\\rho}\\frac{\\partial P}{\\partial y} \\implies u_{\\text{max}} \\approx 580\\text{ m/s (2.100 km/h)}',
          desc: 'Equilíbrio entre a força de Coriolis e o gradiente barométrico equatorial gerador dos ventos mais velozes do cosmos solar.',
        },
        {
          label: 'Evolução Orbital de Maré de Tritão',
          formula: '\\frac{da}{dt} = -\\frac{3 k_2 G M_T}{Q a^4} R_N^5 < 0',
          desc: 'Decaimento orbital inexorável que fará Tritão colidir e se despedaçar nos anéis de Netuno dentro de 3,6 bilhões de anos.',
        },
      ],
      fieldEquationsDesc: 'Eixo magnético inclinado a 47° e descentrado em 0.55 raios planetários, gerando dinâmica caótica na reconexão magnética com o vento solar.',
      thermodynamics: 'Netuno gera calor interno substancial: emite 2.61 vezes mais energia térmica do que absorve do Sol, acionando forte convecção atmosférica profunda.',
      radiationRegime: 'Detecção de fulgurações aurorais complexas observadas em infravermelho pelas câmeras NIRCam do Telescópio Espacial James Webb.',
    },
  },

  // =========================================================================
  // 13. PLUTÃO & CARONTE
  // =========================================================================
  plutao: {
    geology: [
      {
        name: 'Geleira Sputnik Planitia (O Coração de Plutão)',
        depthKm: '0 a 10 km',
        composition: 'Gelos voláteis de Nitrogênio (N₂), Monóxido de Carbono (CO) e Metano (CH₄)',
        temperature: '38 K (-235°C)',
        color: '#fed7aa',
        description: 'Geleira colossal de 1.000 km sem uma única cratera de impacto! Células poligonais de 30 km fervem lentamente em convecção em estado sólido, renovando a superfície.',
      },
      {
        name: 'Montanhas Glaciais de Água Pura (Montes Hillary e Norgay)',
        depthKm: 'Elevam-se até 3.500 m acima das planícies de nitrogênio',
        composition: 'Gelo de água pura (H₂O)',
        temperature: '40 K',
        color: '#d97706',
        description: 'Na temperatura de Plutão (-230°C), o gelo de água é tão duro e inquebrável quanto granito na Terra, servindo como a rocha que sustenta os picos montanhosos.',
      },
      {
        name: 'Manto de Gelo de Água e Possível Oceano Pastoso',
        depthKm: '10 a 300 km',
        composition: 'Camada rica em gelo e água líquida salobra residual com amônia anticongelante',
        temperature: '100 K a 250 K',
        color: '#92400e',
        description: 'Sustentado pelo decaimento radiogênico do núcleo rochoso, impedindo o congelamento completo.',
      },
      {
        name: 'Núcleo Rochoso Denso',
        depthKm: '300 a 1.188 km (70% da massa de Plutão)',
        composition: 'Silicatos hidratados de magnésio e ferro',
        temperature: '~600 K',
        color: '#451a03',
        description: 'Núcleo rochoso proporcionalmente muito maior que o das luas de gelo dos gigantes gasosos.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 39.482,
      eccentricity: 0.2488,
      inclinationDeg: 17.16,
      orbitalVelocityKmS: 4.74,
      periapsisDistance: 'Periélio: 4.436.820.000 km (29.66 AU / cruza a órbita de Netuno!)',
      apoapsisDistance: 'Afélio: 7.375.930.000 km (49.30 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 0.62,
      surfacePressureBar: 0.00001,
      scaleHeightKm: 60.0,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 0.86,
      surfaceLandingDeltaVKmS: 1.21,
      entryVelocityKmS: 1.25,
      aerobrakingFeasible: false,
      flightNotes: 'Para alcançar Plutão em 9,5 anos, a New Horizons foi lançada na maior velocidade da história humana (58.536 km/h) e passou zunindo a 49.600 km/h sem combustível para frear e entrar em órbita.',
    },
    didactic: {
      whatIsIt: 'Plutão é o rei do Cinturão de Kuiper: um mundo fascinante de gelo avermelhado que forma um sistema binário de dança cósmica com sua lua Caronte.',
      everydayAnalogy: 'Plutão e Caronte são como dois patinadores de gelo girando de mãos dadas em torno de um ponto vazio entre eles, encarando-se olho no olho o tempo todo!',
      ifYouWereThere: 'A gravidade é de apenas 6% da Terra: você saltaria como um super-herói sobre geleiras de nitrogênio em formato de coração sob um céu azulado brilhante.',
      howToReachIt: 'A sonda New Horizons viajou quase 5 bilhões de quilômetros ao longo de quase 10 anos para realizar um sobrevoo histórico de poucas horas em 14 de julho de 2015.',
      funFacts: [
        'A lua Caronte é tão grande comparada a Plutão (metade do tamanho de Plutão!) que o centro de gravidade em torno do qual eles giram fica fora do corpo de Plutão, no vácuo do espaço!',
        'Plutão tem um coração na superfície! A planície "Sputnik Planitia" tem o formato perfeito de um coração e é uma geleira gigante de nitrogênio puro.',
        'Em sua órbita oval inclinada, Plutão passa 20 anos de cada volta de 248 anos mais próximo do Sol do que o próprio planeta Netuno.',
      ],
    },
    technical: {
      formalDefinition: 'Planeta anão transnetuniano (plutino) em ressonância média de movimento de 3:2 com Netuno, formando um sistema planetário binário duplamente travado por maré com Caronte.',
      primaryEquations: [
        {
          label: 'Ressonância Média com Netuno (3:2)',
          formula: '3\\,n_N - 2\\,n_P = 0, \\quad 2\\,P_P \\approx 3\\,P_N \\approx 496\\text{ anos}',
          desc: 'Garante que Plutão e Netuno nunca colidam, mesmo com suas órbitas aparentando se cruzar na projeção planar.',
        },
        {
          label: 'Bari-centro Externo do Par Plutão-Caronte',
          formula: 'r_b = d \\frac{M_C}{M_P + M_C} \\approx 2.160\\text{ km (além do raio de 1.188 km de Plutão)}',
          desc: 'O centro de rotação mútua situa-se a 970 km acima da superfície de Plutão no vácuo.',
        },
      ],
      fieldEquationsDesc: 'Estabilidade orbital protegida pelo mecanismo de libração do argumento do periélio (oscilação em torno de ω = 90°).',
      thermodynamics: 'Convecção de Rayleigh-Bénard em estado sólido no nitrogênio plástico com viscosidade η ≈ 10¹² Pa·s e número de Rayleigh Ra > 10⁸.',
      radiationRegime: 'Fotólise do metano atmosférico por radiação ultravioleta Lyman-alfa interestelar, sintetizando tolina avermelhada que precipita sobre o solo.',
    },
  },

  // =========================================================================
  // 14. TELESCÓPIO ESPACIAL JAMES WEBB (JWST)
  // =========================================================================
  jwst: {
    geology: [
      {
        name: 'Espelho Primário Hexagonal de Berílio e Ouro (18 Segmentos)',
        depthKm: 'Diâmetro de 6,5 m com área de coleta de 25,4 m²',
        composition: 'Berílio O-30 ultraleve revestido com 100 nm de Ouro puro (48,25 g de ouro no total) e camada de SiO₂ protetora',
        temperature: '37 K a 50 K (-236°C a -223°C criogênico passivo)',
        color: '#eab308',
        description: '18 atuadores mecânicos por segmento ajustam o foco com precisão de fração de nanômetro (menos que a espessura de um vírus!).',
      },
      {
        name: 'Escudo Protetor Solar Térmico de 5 Camadas (Sunshield)',
        depthKm: 'Dimensões de 21,2 m × 14,2 m (tamanho de uma quadra de tênis)',
        composition: 'Filmes de poliimida Kapton revestidos com alumínio dopado com silício',
        temperature: 'Lado quente: +85°C (358 K) / Lado frio: -233°C (40 K)',
        color: '#cbd5e1',
        description: 'Atenua mais de 200 quilowatts de radiação solar para menos de um milésimo de watt, permitindo que os detectores infravermelhos vejam fótons tênues do alvorecer cósmico.',
      },
      {
        name: 'Módulo de Instrumentos Científicos Integrados (ISIM)',
        depthKm: 'Módulo criogênico traseiro',
        composition: 'Câmeras e espectrógrafos NIRCam, NIRSpec, MIRI e NIRISS com criorefrigerador de ciclo fechado de hélio a 6,7 K',
        temperature: '6.7 K (-266.45°C no instrumento MIRI)',
        color: '#38bdf8',
        description: 'Capaz de captar comprimentos de onda de 0,6 a 28,8 micrômetros, atravessando nuvens de poeira e enxergando as primeiras estrelas e galáxias formadas após o Big Bang.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 1.010,
      eccentricity: 0.016,
      inclinationDeg: 5.0,
      orbitalVelocityKmS: 30.1,
      periapsisDistance: 'Halo L2: 250.000 km de raio',
      apoapsisDistance: 'Halo L2: 800.000 km de raio',
    },
    aerospace: {
      surfaceGravityMS2: 0.000001,
      surfacePressureBar: 0,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 3.2,
      surfaceLandingDeltaVKmS: 0,
      entryVelocityKmS: 1.4,
      aerobrakingFeasible: false,
      flightNotes: 'Lançado no dia de Natal de 2021 pelo foguete Ariane 5 com precisão cirúrgica de inserção, economizando propelente a bordo e dobrando sua vida útil estimada de 10 para mais de 20 anos.',
    },
    didactic: {
      whatIsIt: 'O James Webb é o telescópio espacial mais poderoso, complexo e caro já construído pela humanidade: uma máquina do tempo capaz de enxergar o nascimento das primeiras galáxias do universo.',
      everydayAnalogy: 'O JWST é tão incrivelmente sensível que se você colocasse uma abelha comum pousada na superfície da Lua, ele conseguiria detectar o calor emitido pelo corpinho dela a partir da Terra!',
      ifYouWereThere: 'Um ambiente de silêncio absoluto e frio quase congelante a 1,5 milhão de km da Terra, com espelhos dourados gigantescos refletindo a luz infravermelha de galáxias distantes sob uma escuridão sem fim.',
      howToReachIt: 'Ele não orbita a Terra como o Hubble; viajou durante um mês inteiro até o Ponto de Lagrange Sol-Terra L2, onde as forças da gravidade da Terra e do Sol se equilibram com a força centrífuga.',
      funFacts: [
        'Como o espelho de 6,5 metros não cabia em nenhum foguete existente, ele foi dobrado como um origami e precisou realizar mais de 300 desdobramentos mecânicos no espaço sem cometer um único erro.',
        'O ouro que reveste todos os 18 espelhos é tão fino (100 nanômetros) que todo o ouro usado no telescópio inteiro pesa menos que uma bolinha de golfe (apenas 48 gramas!).',
        'Ele já descobriu galáxias brilhantes que existiam quando o universo tinha apenas 300 milhões de anos de idade, desafiando modelos teóricos clássicos de cosmologia.',
      ],
    },
    technical: {
      formalDefinition: 'Observatório espacial criogênico no infravermelho próximo e médio (0.6 - 28.8 μm) em órbita de halo quase-periódica em torno do ponto de libração colinear Sol-Terra L2.',
      primaryEquations: [
        {
          label: 'Ponto de Lagrange Colinear L2 (Potencial Efetivo)',
          formula: '\\nabla \\Phi_{\\text{eff}} = 0, \\quad \\Phi_{\\text{eff}} = -\\frac{G M_\\odot}{r_1} - \\frac{G M_\\oplus}{r_2} - \\frac{1}{2}\\Omega^2 r^2',
          desc: 'Equilíbrio exato entre o gradiente gravitacional Sol-Terra e a força centrífuga no referencial co-rotante.',
        },
        {
          label: 'Critério de Resolução Angular de Rayleigh',
          formula: '\\theta = 1.22 \\frac{\\lambda}{D} \\approx 0.032\'\' \\quad (\\text{para } \\lambda = 0.8\\,\\mu\\text{m}, D = 6.5\\text{ m})',
          desc: 'Capacidade de resolução espacial difração-limitada permitindo resolver estruturas planetárias em anos-luz.',
        },
      ],
      fieldEquationsDesc: 'Controle de atitude orbital de halo mantido por queimas de manutenção de estação (station-keeping) com Δv de apenas ~2.5 m/s por ano.',
      thermodynamics: 'Gradiente térmico passivo brutal através do escudo de 5 camadas: de 358 K (lado do Sol) a 37 K (lado científico), operando com emissividade ε < 0.03.',
      radiationRegime: 'Receptores fotodetectores de Arsenieto de Gálio e Silício dopado com Antimônio (Si:As) com corrente de escuro (dark current) inferior a 0.001 e⁻/pixel/s.',
    },
  },

  // =========================================================================
  // 15. SONDA ESPACIAL VOYAGER 1
  // =========================================================================
  voyager1: {
    geology: [
      {
        name: 'Antena Parabólica de Alto Ganho (HGA)',
        depthKm: 'Diâmetro de 3,7 metros',
        composition: 'Estrutura sanduíche de grafite-epóxi e malha de alumínio reflexiva de micro-ondas',
        temperature: '~35 K (-238°C no espaço interestelar)',
        color: '#f8fafc',
        description: 'Apontada continuamente para a Terra com precisão milimétrica, transmitindo sinais de rádio com a potência de uma lâmpada fraca de apenas 22 watts.',
      },
      {
        name: 'Geradores Termoelétricos de Radioisótopos (MHW-RTG)',
        depthKm: '3 unidades montadas em braço estrutural',
        composition: 'Óxido de Plutônio-238 (²³⁸PuO₂) e termopares de Silício-Germânio (SiGe)',
        temperature: 'Mais de 1.000°C no núcleo radioativo decaindo lentamente',
        color: '#ef4444',
        description: 'A energia térmica do decaimento alfa natural do plutônio é convertida diretamente em eletricidade; após 48 anos, ainda alimenta instrumentos científicos remanescentes.',
      },
      {
        name: 'Disco de Ouro da Voyager (The Golden Record)',
        depthKm: 'Diâmetro de 30 cm montado na fuselagem',
        composition: 'Cobre banhado a ouro puro com capa de alumínio eletrolítico e agulha fonográfica de diamante',
        temperature: '35 K',
        color: '#eab308',
        description: 'Uma garrafa lançada ao oceano cósmico: contém 115 fotos científicas da Terra, saudações em 55 idiomas, sons naturais da biosfera e 90 minutos de música de Bach a Chuck Berry.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: -163.5,
      eccentricity: 1.307,
      inclinationDeg: 35.86,
      orbitalVelocityKmS: 16.9,
      periapsisDistance: 'Periélio: 1 AU (Terra, 1977)',
      apoapsisDistance: 'Espaço Interestelar Aberto (Sem limite superior)',
    },
    aerospace: {
      surfaceGravityMS2: 0,
      surfacePressureBar: 0,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 0,
      surfaceLandingDeltaVKmS: 0,
      entryVelocityKmS: 16.9,
      aerobrakingFeasible: false,
      flightNotes: 'Mais distante de nós a cada segundo que passa (afasta-se a 3,6 AU / 540 milhões de km por ano). A comunicação via Rede de Espaço Profundo da NASA (DSN) leva mais de 22 horas e 30 minutos em cada direção!',
    },
    didactic: {
      whatIsIt: 'A Voyager 1 é a mensageira da humanidade: o objeto construído pela mão humana mais distante de todo o universo, agora navegando no espaço interestelar virgem entre as estrelas.',
      everydayAnalogy: 'A Voyager 1 está a mais de 24 bilhões de quilômetros de nós. Se a Terra fosse do tamanho de uma bola de futebol, a Voyager estaria a mais de 40 quilômetros de distância!',
      ifYouWereThere: 'Você estaria em um vácuo onde o Sol parece apenas mais uma estrela brilhante no céu. O silêncio cósmico é quebrado apenas pelo zumbido elétrico do vento interestelar detectado por seus sensores.',
      howToReachIt: 'Foi lançada em 1977 e aproveitou um alinhamento planetário que só acontece uma vez a cada 175 anos, saltando de Júpiter para Saturno como uma bola de bilhar gravitacional.',
      funFacts: [
        'Em 1990, a pedido do astrônomo Carl Sagan, a Voyager 1 virou sua câmera pela última vez e tirou a foto do "Pálido Ponto Azul", mostrando a Terra inteira ocupando menos de um único pixel.',
        'Em 25 de agosto de 2012, ela cruzou a heliopausa e se tornou a primeira nave humana a deixar para trás a bolha de proteção do Sol e entrar no verdadeiro espaço interestelar.',
        'Seu Disco de Ouro foi projetado para durar mais de 1 bilhão de anos no vácuo sem se desgastar, sobrevivendo potencialmente a toda a existência da civilização humana na Terra.',
      ],
    },
    technical: {
      formalDefinition: 'Sonda espacial interestelar não tripulada em trajetória de escape hiperbólica heliocêntrica não ligada (v_inf = 16.9 km/s), realizando medições in-situ do meio interestelar local (LISM).',
      primaryEquations: [
        {
          label: 'Frequência de Plasma de Oscilação Eletrônica Interestelar',
          formula: 'f_p = \\frac{1}{2\\pi}\\sqrt{\\frac{n_e e^2}{\\epsilon_0 m_e}} \\approx 3.1\\text{ kHz} \\implies n_e \\approx 0.12\\text{ cm}^{-3}',
          desc: 'Aumento abrupto na densidade do plasma medido pela Voyager 1 confirmando a travessia histórica da heliopausa.',
        },
        {
          label: 'Atenuação de Rádio em Espaço Livre (Equação de Friis)',
          formula: '\\frac{P_r}{P_t} = G_t G_r \\left( \\frac{\\lambda}{4\\pi d} \\right)^2 \\approx 10^{-21} \\quad (d = 163.5\\text{ AU})',
          desc: 'O sinal recebido pelas antenas de 70 metros da DSN na Terra chega com potência de bilionésimos de bilionésimos de watt (-160 dBm).',
        },
      ],
      fieldEquationsDesc: 'Órbita hiperbólica livre com energia mecânica específica positiva E = v²/2 - GM/r > 0 no referencial baricêntrico solar.',
      thermodynamics: 'Alimentação elétrica decrescente por decaimento radioativo (²³⁸Pu meia-vida de 87,7 anos); potência caiu de 470 W no lançamento para ~220 W atuais.',
      radiationRegime: 'Submersão completa nos Raios Cósmicos Galácticos de alta energia desprovidos da blindagem da heliosfera solar.',
    },
  },

  // =========================================================================
  // 16. PROXIMA CENTAURI & PROXIMA B
  // =========================================================================
  'proxima-centauri': {
    geology: [
      {
        name: 'Núcleo e Interior Convectivo Total (Estrela Próxima)',
        depthKm: '0 a 107.000 km (0.15 R☉)',
        composition: 'Plasma de Hidrogênio e Hélio em regime de convecção total da base ao topo',
        temperature: '4.000.000 K (Núcleo) a 3.042 K (Superfície)',
        color: '#f87171',
        description: 'Ao contrário do Sol, Próxima Centauri é inteiramente convectiva: todo o seu hidrogênio é lentamente misturado no núcleo, permitindo que a estrela queime combustível por até 4 trilhões de anos!',
      },
      {
        name: 'Exoplaneta Proxima b (Superfície Rochedosa)',
        depthKm: 'Raio de ~1.03 a 1.2 R⊕ (Massa mínima: 1.17 M⊕)',
        composition: 'Planeta rochoso com crosta de silicato e núcleo metálico sob alto fluxo de raios-X estelares',
        temperature: '234 K (-39°C temperatura de equilíbrio sem estufa)',
        color: '#b91c1c',
        description: 'Orbita na zona habitável da estrela a apenas 7,5 milhões de km (0,05 AU) em um período de 11,2 dias.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0.0485,
      eccentricity: 0.108,
      inclinationDeg: 61.0,
      orbitalVelocityKmS: 47.0,
      periapsisDistance: 'Periastro: 6.450.000 km (0.043 AU)',
      apoapsisDistance: 'Apoastro: 8.050.000 km (0.054 AU)',
    },
    aerospace: {
      surfaceGravityMS2: 10.8,
      surfacePressureBar: 1.0,
      scaleHeightKm: 8.0,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 8.5,
      surfaceLandingDeltaVKmS: 12.0,
      entryVelocityKmS: 12.5,
      aerobrakingFeasible: true,
      flightNotes: 'A uma distância de 4,24 anos-luz (40 trilhões de km), uma sonda química convencional levaria 75.000 anos para chegar lá; o projeto Breakthrough Starshot projeta micro-sondas com velas laser a 20% da velocidade da luz para alcançar o sistema em 20 anos.',
    },
    didactic: {
      whatIsIt: 'Próxima Centauri é a estrela mais próxima do nosso Sol e do nosso planeta Terra em todo o universo.',
      everydayAnalogy: 'Se o nosso Sol fosse uma lâmpada em São Paulo, Próxima Centauri seria uma velinha acesa no Rio de Janeiro, e todo o espaço entre as duas cidades estaria totalmente vazio!',
      ifYouWereThere: 'No planeta Proxima b, o céu teria um sol vermelho gigante ocupando grande parte do horizonte, sujeito a explosões solares súbitas de raios-X que iluminariam o céu com auroras boreais violetas e vermelhas.',
      howToReachIt: 'Naves espaciais tripuladas atuais demorariam milênios. Cientistas estão pesquisando velas solares impulsionadas por feixes de raio laser de alta potência da Terra para enviar sensores ultraleves.',
      funFacts: [
        'A luz de Próxima Centauri leva 4 anos e 3 meses para viajar pelo vácuo cósmico até os seus olhos na Terra.',
        'Próxima Centauri é uma estrela anã vermelha tão pequena que tem apenas 12% da massa do Sol e mal consegue realizar fusão nuclear.',
        'Ela é uma estrela "fulgurante" (flare star): periodicamente emite erupções magnéticas devastadoras que multiplicam seu brilho por centenas de vezes em poucos minutos.',
      ],
    },
    technical: {
      formalDefinition: 'Estrela anã vermelha da sequência principal de classe espectral M5.5Ve com queima por cadeia p-p em regime de convecção total, hospedeira de exoplaneta telúrico na zona habitável nominal.',
      primaryEquations: [
        {
          label: 'Raio da Zona Habitável Estelar',
          formula: 'r_{\\text{hab}} \\approx \\sqrt{\\frac{L_*}{L_\\odot}} \\approx \\sqrt{0.0017} \\approx 0.041\\text{ AU}',
          desc: 'Fluxo estelar equivalente na órbita de Proxima b comparável ao recebido pela Terra.',
        },
        {
          label: 'Tempo de Vida na Sequência Principal',
          formula: '\\tau_{\\text{MS}} \\propto \\frac{M}{L} \\propto M^{-2.5} \\implies \\tau \\sim 4 \\times 10^{12}\\text{ anos (4 trilhões de anos!)}',
          desc: 'Próxima Centauri viverá centenas de vezes mais tempo que a idade atual do universo.',
        },
      ],
      fieldEquationsDesc: 'Perturbações gravitacionais seculares de maré induzidas pelo par binário Alpha Centauri A e B orbitado a 13.000 AU.',
      thermodynamics: 'Pressão térmica balanceada pela densidade central ρ_c ≈ 56.8 g/cm³ com ausência de zona radiativa estelar intermediária.',
      radiationRegime: 'Espectro estelar dominado por emissão de infravermelho próximo e ultravioleta extremo (EUV) por reconexão magnética coronal.',
    },
  },

  // =========================================================================
  // 17. SIRIUS A & B
  // =========================================================================
  sirius: {
    geology: [
      {
        name: 'Sirius A: Estrela Branca de Sequência Principal',
        depthKm: 'Raio de 1.190.000 km (1.71 R☉)',
        composition: 'Plasma de Hidrogênio (74%), Hélio (25%) e enriquecimento metálico de Ferro e Enxofre',
        temperature: '9.940 K (Branco-Azulado Incandescente)',
        color: '#e0f2fe',
        description: 'Estrela com duas vezes a massa do Sol e 25 vezes mais brilhante, operando fusão nuclear predominante pelo ciclo catalítico CNO.',
      },
      {
        name: 'Sirius B ("O Filhote"): Anã Branca Superdensa',
        depthKm: 'Raio de apenas 5.800 km (menor que o planeta Terra!)',
        composition: 'Matéria quântica degenerada de Carbono e Oxigênio cristalizado revestida por fina capa de Hidrogênio',
        temperature: '25.200 K',
        color: '#67e8f9',
        description: 'Toda a massa do Sol (1,02 M☉) comprimida no volume da Terra! Um único centímetro cúbico de sua matéria pesa mais de 2 toneladas.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 20.0,
      eccentricity: 0.592,
      inclinationDeg: 136.5,
      orbitalVelocityKmS: 15.2,
      periapsisDistance: 'Periastro mútuo: 8.2 AU',
      apoapsisDistance: 'Apoastro mútuo: 31.5 AU',
    },
    aerospace: {
      surfaceGravityMS2: 77.5,
      surfacePressureBar: 1.0,
      scaleHeightKm: 120.0,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 480.0,
      surfaceLandingDeltaVKmS: 670.0,
      entryVelocityKmS: 670.0,
      aerobrakingFeasible: false,
      flightNotes: 'A gravidade de superfície na anã branca Sirius B é de 400.000 g! Qualquer nave que tentasse se aproximar a poucas centenas de quilômetros seria espaghetificada por forças de maré gravitacionais.',
    },
    didactic: {
      whatIsIt: 'Sirius é a estrela mais brilhante de todo o céu noturno da Terra, um sistema duplo formado por uma estrela branca jovem e o "fantasma" estelar de uma anã branca superdensa.',
      everydayAnalogy: 'Imagine esmagar o peso do Sol inteiro dentro de uma bolinha de gude do tamanho da Terra. Se você colocasse uma colher de chá de Sirius B na balança, ela pesaria tanto quanto um caminhão carregado com 2 carros!',
      ifYouWereThere: 'O brilho de Sirius A iluminaria a noite como dezenas de Luas cheias na Terra. Sua companheira Sirius B brilha com uma intensa luz azul-ciano fantasmagórica a poucas unidades astronômicas.',
      howToReachIt: 'Situada a 8,6 anos-luz, é um dos alvos primários para futuras missões interestelares com propulsão por antimatéria ou motores de fusão termonuclear.',
      funFacts: [
        'Civilizações antigas como os egípcios baseavam seu calendário anual no surgimento de Sirius no horizonte matutino, que anunciava as cheias férteis do Rio Nilo.',
        'Sirius B foi a primeira anã branca identificada na história da ciência, comprovando as previsões da mecânica quântica sobre a pressão de degenerescência dos elétrons.',
        'Por estar tão próxima e ser muito luminosa, você pode vê-la piscando em cores verdes, vermelhas e azuis cintilantes no céu de inverno devido à refração da atmosfera terrestre.',
      ],
    },
    technical: {
      formalDefinition: 'Sistema binário astrométrico composto por estrela de sequência principal A1V e anã branca DA2 sustentada por pressão de degenerescência eletrônica fermiônica relativística.',
      primaryEquations: [
        {
          label: 'Pressão de Degenerescência de Elétrons Não Relativística',
          formula: 'P_e = \\frac{(3\\pi^2)^{2/3} \\hbar^2}{5 m_e} n_e^{5/3} \\implies R \\propto M^{-1/3}',
          desc: 'Equilíbrio quântico que sustenta Sirius B contra o colapso gravitacional.',
        },
        {
          label: 'Desvio para o Vermelho Gravitacional (Teste Clássico da RG)',
          formula: 'z_{\\text{grav}} = \\frac{\\Delta \\lambda}{\\lambda} \\approx \\frac{G M}{c^2 R} \\approx 8.9 \\times 10^{-5} \\implies v_{\\text{grav}} \\approx 89\\text{ km/s}',
          desc: 'Deslocamento espectral das linhas de Balmer de Sirius B medido com precisão pelo Hubble.',
        },
      ],
      fieldEquationsDesc: 'Métrica de Schwarzschild externa com forte curvatura estática local gerando deflexão fotônica e efeito Einstein.',
      thermodynamics: 'Resfriamento secular passivo de anã branca governado pela lei de Mestel com condução térmica eletrônica ultra-eficiente.',
      radiationRegime: 'Emissão estelar dominada por radiação térmica ultravioleta intensa e contínuo óptico puro sem linhas de metais em Sirius B.',
    },
  },

  // =========================================================================
  // 18. BETELGEUSE
  // =========================================================================
  betelgeuse: {
    geology: [
      {
        name: 'Núcleo de Fusão de Silício e Ferro em Colapso',
        depthKm: '0 a 10.000 km',
        composition: 'Cinzas de Ferro (⁵⁶Fe), Níquel, Silício e Enxofre sob temperaturas extremas',
        temperature: 'Mais de 3.000.000.000 K (3 bilhões de graus Celsius!)',
        color: '#ffffff',
        description: 'Fornalha terminal onde o silício funde em ferro em escalas de apenas poucos dias antes do colapso final de núcleo de supernova Tipo II.',
      },
      {
        name: 'Cascas Concêntricas de Queima de Oxigênio, Neon e Carbono',
        depthKm: '10.000 a 200.000 km',
        composition: 'Camadas de queima nuclear acelerada lembrando as cascas de uma cebola cósmica',
        temperature: '500.000.000 K a 1.500.000.000 K',
        color: '#f97316',
        description: 'Cada camada queima um elemento progressivamente mais pesado em prazos de meses a séculos.',
      },
      {
        name: 'Envelope Convectivo Gigantesco e Atmosfera Expandida',
        depthKm: '200.000 km a 617.000.000 km (~900 raios solares!)',
        composition: 'Gás rarefeito turbulento de hidrogênio e hélio permeado por plumas de poeira',
        temperature: '3.600 K na superfície exterior',
        color: '#ea580c',
        description: 'Superfície borbulhante com células convectivas colossais do tamanho da órbita da Terra, ejetando nuvens de poeira que causam episódios de escurecimento visível.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 20.0,
      orbitalVelocityKmS: 215.0,
      periapsisDistance: 'Braço de Órion: ~640 AL',
      apoapsisDistance: 'Braço de Órion: ~650 AL',
    },
    aerospace: {
      surfaceGravityMS2: 0.005,
      surfacePressureBar: 0.0001,
      scaleHeightKm: 5000000.0,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 45.0,
      surfaceLandingDeltaVKmS: 65.0,
      entryVelocityKmS: 65.0,
      aerobrakingFeasible: false,
      flightNotes: 'A gravidade superficial é quase nula devido ao tamanho gigantesco. Uma nave poderia literalmente "mergulhar" nas camadas superiores de gás sem sofrer pressão gravitacional extrema, mas seria vaporizada pelo calor de 3.600 K.',
    },
    didactic: {
      whatIsIt: 'Betelgeuse é uma supergigante vermelha colossal na constelação de Órion que está à beira da morte estelar e explodirá como uma supernova espetacular.',
      everydayAnalogy: 'Se colocássemos Betelgeuse no centro do nosso Sistema Solar no lugar do Sol, sua superfície engoliria Mercúrio, Vênus, a Terra, Marte e chegaria até a órbita de Júpiter!',
      ifYouWereThere: 'Você veria uma parede infinita de fogo vermelho-alaranjado turbulento com bolhas gigantescas de plasma do tamanho do Sol subindo e descendo lentamente à sua frente.',
      howToReachIt: 'Situada a cerca de 642 anos-luz, a luz que vemos dela hoje partiu quando a Europa ainda vivia na Idade Média.',
      funFacts: [
        'Em 2019, Betelgeuse sofreu o famoso "Grande Escurecimento", perdendo mais de 60% de seu brilho aparente quando expeliu uma imensa bolha de gás que se condensou em poeira escura.',
        'Quando explodir como supernova (em qualquer momento nos próximos 100.000 anos), brilhará tanto quanto a Lua cheia e será claramente visível em pleno dia por semanas a fio!',
        'Apesar de sua explosão iminente, ela está a uma distância segura da Terra (642 anos-luz) e seu jato polar não está apontado para nós, então não trará perigo à nossa biosfera.',
      ],
    },
    technical: {
      formalDefinition: 'Estrela supergigante vermelha assintótica de alta massa (M ≈ 16.5 - 19 M☉, classe espectral M1-2 Ia-ab) nas fases finais de queima de silício no núcleo antes do colapso de supernova por fotodesintegração.',
      primaryEquations: [
        {
          label: 'Limite de Massa de Chandrasekhar para o Núcleo de Ferro',
          formula: 'M_{\\text{core}} > M_{\\text{Ch}} \\approx 1.44 M_\\odot \\left( \\frac{2 Y_e}{1} \\right)^2',
          desc: 'Quando o núcleo inerte de ferro ultrapassa esse limiar, a pressão de degenerescência eletrônica colapsa em frações de segundo.',
        },
        {
          label: 'Taxa de Perda de Massa por Vento Estelar Supergigante',
          formula: '\\dot{M} \\approx 10^{-6} \\text{ a } 10^{-5}\\, M_\\odot / \\text{ano}',
          desc: 'Ejeção massiva impulsionada pela pressão de radiação sobre grãos de silicato e poeira circum-estelar.',
        },
      ],
      fieldEquationsDesc: 'Geração de pulso colapsante de ondas gravitacionais de amplitude h ~ 10⁻²¹ esperada durante o colapso de núcleo catastrófico futuro detectável pelo LIGO/Virgo.',
      thermodynamics: 'Equilíbrio térmico quebrado: perda de energia por emissão desenfreada de neutrinos térmicos no núcleo superando em ordens de magnitude a radiação de fótons superficial.',
      radiationRegime: 'Emissão estelar dominada por espectro infravermelho de baixa frequência e linhas moleculares de TiO e vapor de água na fotosfera expandida.',
    },
  },

  // =========================================================================
  // 19. TRAPPIST-1
  // =========================================================================
  trappist1: {
    geology: [
      {
        name: 'Estrela TRAPPIST-1 (Anã Vermelha Ultrafria)',
        depthKm: 'Raio de 84.180 km (apenas 12% do raio do Sol / tamanho similar a Júpiter)',
        composition: 'Hidrogênio e Hélio com campos magnéticos intensos',
        temperature: '2.566 K (Superfície alaranjada escura)',
        color: '#fb7185',
        description: 'Estrela do tamanho de Júpiter mas com 89 vezes mais massa, queimando combustível tão lentamente que viverá por 12 trilhões de anos.',
      },
      {
        name: 'Sistema de 7 Exoplanetas Terrestres (b, c, d, e, f, g, h)',
        depthKm: 'Todos os 7 planetas têm raios entre 0,77 e 1,13 R⊕ e densidades rochosas',
        composition: 'Crosta de silicatos, manto rochoso e possíveis mantos de gelo/água',
        temperature: 'TRAPPIST-1e: ~251 K (-22°C temperatura de equilíbrio)',
        color: '#10b981',
        description: 'Três planetas (e, f, g) orbitam na zona habitável estelar teórica com chances de abrigar oceanos de água líquida caso tenham retido atmosfera.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0.029,
      eccentricity: 0.005,
      inclinationDeg: 89.8,
      orbitalVelocityKmS: 58.0,
      periapsisDistance: 'TRAPPIST-1e: 4.250.000 km',
      apoapsisDistance: 'TRAPPIST-1e: 4.350.000 km',
    },
    aerospace: {
      surfaceGravityMS2: 9.12,
      surfacePressureBar: 1.0,
      scaleHeightKm: 8.5,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 7.5,
      surfaceLandingDeltaVKmS: 10.5,
      entryVelocityKmS: 10.8,
      aerobrakingFeasible: true,
      flightNotes: 'Distância de 39,6 anos-luz. Os planetas orbitam tão incrivelmente perto uns dos outros que a transferência orbital entre mundos vizinhos levaria apenas poucos dias.',
    },
    didactic: {
      whatIsIt: 'TRAPPIST-1 é um sistema solar em miniatura com 7 planetas rochosos do tamanho da Terra amontoados ao redor de uma estrela minúscula e gelada.',
      everydayAnalogy: 'Imagine um sistema solar inteiro que caberia confortavelmente dentro da órbita de Mercúrio ao redor do Sol! Os planetas estão tão perto da estrela e uns dos outros quanto as luas de Júpiter!',
      ifYouWereThere: 'Se você estivesse na superfície de TRAPPIST-1e, olharia para o céu e veria os planetas vizinhos tão perto que conseguiria ver montanhas, nuvens e oceanos neles a olho nu, maiores que a nossa Lua cheia!',
      howToReachIt: 'O Telescópio Espacial James Webb (JWST) está atualmente observando suas atmosferas para detectar dióxido de carbono, água e possíveis bioassinaturas químicas.',
      funFacts: [
        'É o sistema com o maior número de planetas parecidos com a Terra já descoberto em toda a história da astronomia.',
        'Todos os 7 planetas estão em uma "ressonância harmônica musical" perfeita: cada vez que o planeta mais externo dá 2 voltas, os outros dão exatamente 3, 4, 6, 9, 15 e 24 voltas!',
        'Como a estrela é pequena e fria, os planetas estão em travamento de maré: um lado é dia eterno e o outro é noite eterna congelante.',
      ],
    },
    technical: {
      formalDefinition: 'Sistema planetário compacto ressonante com 7 exoplanetas telúricos em cadeia de ressonâncias de Laplace de três corpos, orbitando uma anã ultrafria M8V.',
      primaryEquations: [
        {
          label: 'Cadeia de Ressonâncias de Laplace de Três Corpos',
          formula: 'n_b : n_c : n_d : n_e : n_f : n_g : n_h \\approx 24 : 15 : 9 : 6 : 4 : 3 : 2',
          desc: 'Evidência definitiva de migração convergente suave no disco protoplanetário primordial.',
        },
        {
          label: 'Variação do Tempo de Trânsito (TTV)',
          formula: '\\delta t \\approx \\frac{P}{2\\pi} \\frac{m_j}{M_* + m_i} f(e_i, e_j, \\Delta\\varpi)',
          desc: 'Perturbações gravitacionais mútuas que permitiram medir a massa exata de cada planeta sem velocidade radial.',
        },
      ],
      fieldEquationsDesc: 'Estabilidade dinâmica de longo prazo (N-corpos) mantida pelo travamento das variáveis de ângulo crítico de ressonância.',
      thermodynamics: 'Aquecimento por forças de maré em excentricidades residuais sustentando circulação atmosférica nos terminadores dia-noite.',
      radiationRegime: 'Insolação ultravioleta estelar extrema com alta taxa de fotólise de água e perda hidrodinâmica de hidrogênio (escape fotoevaporativo).',
    },
  },

  // =========================================================================
  // 20. NEBULOSA DE ÓRION (M42)
  // =========================================================================
  m42_orion: {
    geology: [
      {
        name: 'Aglomerado Estelar Jovem do Trapézio (Theta¹ Orionis)',
        depthKm: 'Região central de 1,5 anos-luz de diâmetro',
        composition: '4 estrelas gigantes azuis jovens (O7V a B0.5V) de até 40 massas solares',
        temperature: '30.000 K a 45.000 K',
        color: '#60a5fa',
        description: 'Estrelas recém-nascidas há menos de 1 milhão de anos cuja radiação ultravioleta feroz ioniza e escava a nebulosa ao redor.',
      },
      {
        name: 'Casca de Hidrogênio Ionizado (Região H II)',
        depthKm: '24 anos-luz de extensão total (massa de ~2.000 sóis)',
        composition: 'Plasma fluorescente de Hidrogênio (H⁺), Hélio e Oxigênio duplamente ionizado [O III]',
        temperature: '10.000 K',
        color: '#00e5ff',
        description: 'O gás absorve os raios UV do Trapézio e reemite luz visível na transição H-alfa vermelha (656 nm) e oxigênio verde-azulado (500,7 nm).',
      },
      {
        name: 'Discos Protoplanetários (Proplyds) e Berçários Estelares',
        depthKm: 'Centenas de sistemas solares nascentes',
        composition: 'Casulos densos de gás molecular e poeira silicatada',
        temperature: '20 K a 100 K no interior protegido',
        color: '#f59e0b',
        description: 'Mais de 150 sistemas planetários em gestação direta descobertos pelo Telescópio Espacial Hubble e JWST.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 0,
      orbitalVelocityKmS: 220.0,
      periapsisDistance: 'Distância do Sol: 1.344 Anos-Luz',
      apoapsisDistance: 'Distância do Sol: 1.344 Anos-Luz',
    },
    aerospace: {
      surfaceGravityMS2: 0.0000001,
      surfacePressureBar: 1e-19,
      scaleHeightKm: 1e14,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 5.0,
      surfaceLandingDeltaVKmS: 0,
      entryVelocityKmS: 15.0,
      aerobrakingFeasible: false,
      flightNotes: 'Um meio interestelar gasoso espetacular: viajar por ele seria como voar pelo vácuo espacial pontilhado por filamentos de névoa brilhante e estrelas recém-nascidas.',
    },
    didactic: {
      whatIsIt: 'A Nebulosa de Órion é a maior e mais espetacular fábrica de estrelas e planetas próxima da Terra, visível a olho nu na espada do caçador Órion.',
      everydayAnalogy: 'É como uma imensa maternidade cósmica onde nuvens de gás gigantescas estão se condensando agora mesmo para dar à luz a centenas de novos sóis com seus próprios sistemas de planetas!',
      ifYouWereThere: 'Você estaria dentro de uma nuvem brilhante de cores fantasmagóricas de 24 anos-luz de largura, iluminada por estrelas gigantes azuis dezenas de milhares de vezes mais brilhantes que o Sol.',
      howToReachIt: 'Situada a 1.344 anos-luz, a luz que atinge nossos olhos hoje começou sua viagem no ano 680 d.C., durante a Alta Idade Média.',
      funFacts: [
        'A Nebulosa de Órion é tão brilhante que você pode vê-la a olho nu como uma manchinha borrada na "espada" da constelação de Órion mesmo em cidades pequenas.',
        'O telescópio James Webb descobriu lá dentro misteriosos "objetos binários do tamanho de Júpiter" (JuMBOS) que flutuam aos pares no espaço sem estarem presos a nenhuma estrela.',
        'O gás de hidrogênio na nebulosa daria para criar mais de 2.000 estrelas como o nosso Sol.',
      ],
    },
    technical: {
      formalDefinition: 'Região H II gigante com aglomerado estelar em colapso gravitacional de Jeans (Aglomerado do Trapézio) e frente de ionização impulsionada por fotoevaporação de discos protoplanetários.',
      primaryEquations: [
        {
          label: 'Massa de Jeans para Colapso Gravitacional de Nuvens',
          formula: 'M_J = \\frac{\\pi}{6} \\rho \\lambda_J^3 = \\frac{\\pi}{6} \\left( \\frac{5 k_B T}{G \\mu m_H} \\right)^{3/2} \\rho^{-1/2}',
          desc: 'Massa crítica necessária para que a autogravidade supere a pressão térmica do gás e inicie a formação estelar.',
        },
        {
          label: 'Raio da Esfera de Strömgren de Ionização',
          formula: 'R_S = \\left( \\frac{3 N_{\\text{Lyc}}}{4\\pi n_H^2 \\alpha_B} \\right)^{1/3}',
          desc: 'Volume de plasma de hidrogênio completamente ionizado sustentado pelo fluxo de fótons UV do Trapézio.',
        },
      ],
      fieldEquationsDesc: 'Campos magnéticos helicoidais de escala de parsec que canalizam os fluxos bipolares de jatos Herbig-Haro de protoestrelas.',
      thermodynamics: 'Resfriamento radiativo eficiente por linhas de estrutura fina proibidas de [C II] a 158 μm e [O I] a 63 μm mantendo a nuvem molecular fria (T ~ 20 K).',
      radiationRegime: 'Emissão contínua livre-livre (bremsstrahlung térmico) de rádio combinada com bandas de emissão aromática de hidrocarbonetos policíclicos (PAHs).',
    },
  },

  // =========================================================================
  // 21. PLÊIADES (M45)
  // =========================================================================
  pleiades: {
    geology: [
      {
        name: 'Estrelas Azuis Jovens do Aglomerado (As Sete Irmãs)',
        depthKm: 'Diâmetro central de 8 anos-luz (mais de 1.000 estrelas confirmadas)',
        composition: 'Estrelas azuis de classe espectral B com rotação ultra-rápida (Alcyone, Electra, Maia, Merope, Taygeta, Celaeno, Asterope)',
        temperature: '10.000 K a 14.000 K',
        color: '#60a5fa',
        description: 'Estrelas com apenas 100 milhões de anos de idade que nasceram juntas a partir de uma mesma nuvem primordial.',
      },
      {
        name: 'Nebulosa de Reflexão Interestelar de Poeira',
        depthKm: 'Filamentos de poeira cruzando o aglomerado',
        composition: 'Grãos microscópicos de grafite, silicatos e gelos de hidrocarbonetos',
        temperature: '30 K a 80 K',
        color: '#38bdf8',
        description: 'Nuvem independente de gás e poeira que não deu origem às estrelas, mas que está sendo atravessada por elas a 40 km/s e refletindo sua intensa luz azul.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 0,
      orbitalVelocityKmS: 220.0,
      periapsisDistance: 'Distância: 444 Anos-Luz',
      apoapsisDistance: 'Distância: 444 Anos-Luz',
    },
    aerospace: {
      surfaceGravityMS2: 0.00001,
      surfacePressureBar: 0,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 10.0,
      surfaceLandingDeltaVKmS: 0,
      entryVelocityKmS: 25.0,
      aerobrakingFeasible: false,
      flightNotes: 'Aglomerado aberto ligado gravitacionalmente viajando em grupo pelo Braço de Órion; sobrevida dinâmica estimada em 250 milhões de anos antes de ser dispersado por marés galácticas.',
    },
    didactic: {
      whatIsIt: 'As Plêiades (também conhecidas como "As Sete Irmãs") são o aglomerado de estrelas azuis mais famoso e bonito do céu noturno.',
      everydayAnalogy: 'É como um punhado de diamantes brilhantes salpicados sobre veludo azul escuro na constelação de Touro!',
      ifYouWereThere: 'Você estaria cercado por centenas de sóis azuis brilhantes em uma vizinhança tão próxima que o céu noturno nunca ficaria escuro, banhado por uma névoa azul fosforescente.',
      howToReachIt: 'Localizado a 444 anos-luz de distância, serviu como base fundamental para a calibração da "escada de distâncias cósmicas" pelos satélites Hipparcos e Gaia da ESA.',
      funFacts: [
        'A logo da montadora de carros japonesa Subaru é exatamente o desenho das estrelas das Plêiades (Subaru é o nome japonês do aglomerado!).',
        'Embora quase todo mundo consiga contar 6 estrelas a olho nu, com um binóculo simples você verá mais de 100 estrelas juntas.',
        'Elas nasceram na época em que os dinossauros caminhavam na Terra (há cerca de 100 milhões de anos) — em termos cósmicos, são estrelas recém-nascidas.',
      ],
    },
    technical: {
      formalDefinition: 'Aglomerado estelar aberto jovem (idade τ ≈ 115 ± 10 Ma) de metalicidade solar com nebulosidade de reflexão interestelar difusa iluminada por espalhamento de Mie.',
      primaryEquations: [
        {
          label: 'Espalhamento de Mie por Grãos de Poeira Interestelar',
          formula: 'I(\\lambda) \\propto I_0 \\lambda^{-p}, \\quad 1 \\le p \\le 4',
          desc: 'A poeira interestelar dispersa comprimentos de onda azuis muito mais eficientemente que vermelhos, gerando a tonalidade azul da nebulosa.',
        },
        {
          label: 'Tempo de Relaxação Dinâmica do Aglomerado',
          formula: 't_{\\text{relax}} \\approx \\frac{N}{8\\ln N} t_{\\text{cross}} \\approx 10^8\\text{ anos}',
          desc: 'Escala de tempo em que encontros gravitacionais estelares redistribuem energia cinética no núcleo do aglomerado.',
        },
      ],
      fieldEquationsDesc: 'Potencial de maré galáctico perturbador gerando evaporação estelar gradual através dos pontos de Lagrange do aglomerado.',
      thermodynamics: 'Estrelas B de rotação ultra-rápida (v sen i até 300 km/s) apresentando efeito de gravidade-escurecimento de von Zeipel com discos de ejeção gasosos circunstelares.',
      radiationRegime: 'Espectro estelar de alta energia dominado por radiação óptica azul, linhas de absorção de hidrogênio e emissão de raios-X coronais observados pelo satélite ROSAT.',
    },
  },

  // =========================================================================
  // 22. VEGA (ALPHA LYRAE)
  // =========================================================================
  vega: {
    geology: [
      {
        name: 'Superfície e Atmosfera de Estrela Branca A0V',
        depthKm: 'Raio equatorial: 1.962.000 km (2.36 R☉) / Raio polar: 1.640.000 km',
        composition: 'Hidrogênio (75%), Hélio (24%) e baixa metalicidade solar ([M/H] = -0.5)',
        temperature: '10.060 K nos polos / 8.152 K no equador (diferença de quase 2.000 K!)',
        color: '#bae6fd',
        description: 'Rotação vertiginosa: gira em 12,5 horas (a 93% da velocidade de ruptura centrífuga!), tornando a estrela extremamente achatada como uma bola de futebol americano.',
      },
      {
        name: 'Disco de Detritos Protoplanetários Circunstelar',
        depthKm: 'Estende-se de 80 a mais de 800 AU da estrela',
        composition: 'Fragmentos de cometas, asteroides e poeira rica em carbono e silicatos',
        temperature: '40 K a 120 K',
        color: '#a855f7',
        description: 'Primeiro disco de detritos já descoberto ao redor de outra estrela (satélite IRAS, 1983), evidenciando a formação ativa de planetas.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 5.0,
      orbitalVelocityKmS: 220.0,
      periapsisDistance: 'Distância: 25.04 Anos-Luz (7.68 pc)',
      apoapsisDistance: 'Distância: 25.04 Anos-Luz (7.68 pc)',
    },
    aerospace: {
      surfaceGravityMS2: 74.0,
      surfacePressureBar: 1.0,
      scaleHeightKm: 150.0,
      hasAtmosphere: true,
      lowOrbitInsertionDeltaVKmS: 450.0,
      surfaceLandingDeltaVKmS: 627.0,
      entryVelocityKmS: 627.0,
      aerobrakingFeasible: false,
      flightNotes: 'A apenas 25 anos-luz, é uma das vizinhas estelares mais brilhantes; seu disco de detritos é alvo primário de busca direta por exoplanetas jovianos por coronagrafia do JWST.',
    },
    didactic: {
      whatIsIt: 'Vega é uma estrela branca brilhante e fascinante na constelação da Lira que serviu por séculos como o "padrão de brilho zero" para os astrônomos.',
      everydayAnalogy: 'Vega gira tão alucinadamente rápido que está prestes a se despedaçar pela força centrífuga, como uma massa de pizza sendo girada no ar pelo pizzaiolo!',
      ifYouWereThere: 'Como vemos Vega quase exatamente de cima do seu polo norte, ela parece um círculo perfeito brilhando com uma luz branca azulada ofuscante.',
      howToReachIt: 'A 25 anos-luz, foi o destino para onde a humanidade enviou o sinal de rádio fictício no famoso livro e filme "Contato", de Carl Sagan.',
      funFacts: [
        'Por causa do "bamboleio" (precessão) do eixo da Terra, por volta do ano 12.000 d.C., Vega será a nova Estrela Polar do nosso céu!',
        'Foi a primeira estrela além do Sol a ser fotografada na história (no Observatório de Harvard, em 1850).',
        'Seus polos são quase 2.000°C mais quentes do que seu equador por causa do achatamento centrífugo extremo.',
      ],
    },
    technical: {
      formalDefinition: 'Estrela padrão fotométrica primária A0V de rotação ultra-rápida (v_eq ≈ 236 km/s, 93% da quebra crítica) com efeito de gravidade-escurecimento e disco de detritos com anéis ressonantes.',
      primaryEquations: [
        {
          label: 'Teorema de Gravidade-Escurecimento de von Zeipel',
          formula: 'T_{\\text{eff}}(g) \\propto g_{\\text{eff}}^{1/4} = \\left| -\\frac{G M}{r^2} + \\Omega^2 r \\sin^2\\theta \\right|^{1/4}',
          desc: 'Polos mais próximos do centro sentem maior gravidade e brilham com temperatura muito superior ao equador dilatado.',
        },
        {
          label: 'Velocidade Crítica de Ruptura Centrífuga',
          formula: 'v_{\\text{crit}} = \\sqrt{\\frac{G M}{R_{\\text{pol}}}} \\approx 250\\text{ km/s}',
          desc: 'Velocidade rotacional máxima onde a força centrífuga equatorial supera a gravidade estelar.',
        },
      ],
      fieldEquationsDesc: 'Geodésicas em campo gravitacional distorcido pelo momento quadrupolar oblato J₂ gerado pela deformação rápida.',
      thermodynamics: 'Interior estelar com zona convectiva nuclear e zona radiativa externa com transporte puramente condutivo-radiativo.',
      radiationRegime: 'Excesso de emissão no infravermelho distante (24 a 160 μm) provocado pelo reprocessamento de luz estelar pelo disco circunestelar de poeira.',
    },
  },

  // =========================================================================
  // 23. SAGITTARIUS A*
  // =========================================================================
  sgra: {
    geology: [
      {
        name: 'Singularidade Central Gravitacional Relativística',
        depthKm: 'r = 0 (Ponto de densidade infinita / Anel de Kerr)',
        composition: 'Massa de 4,3 milhões de sóis comprimida em volume zero pelo colapso gravitacional quântico',
        temperature: 'T_H ≈ 1.43 × 10⁻¹⁴ K (Radiação Hawking quase nula)',
        color: '#000000',
        description: 'Região limite onde a relatividade geral clássica prevê curvatura infinita do tecido do espaço-tempo.',
      },
      {
        name: 'Horizonte de Eventos de Kerr (Fronteira Causal)',
        depthKm: 'r₊ = M + √(M² - a²) ≈ 12,7 milhões de km (0.085 AU / 17 raios solares)',
        composition: 'Superfície nula unidirecional do espaço-tempo',
        temperature: 'Redshift gravitacional infinito',
        color: '#02040a',
        description: 'A fronteira sem retorno: a velocidade de escape é exatamente c. Qualquer matéria ou luz que cruzar esse limiar cai inexoravelmente no centro.',
      },
      {
        name: 'Esfera de Fótons e Disco de Acreção RIAF',
        depthKm: 'r_ph ≈ 19 a 25 milhões de km (Diâmetro do anel do EHT: 52 micro-arco-segundos)',
        composition: 'Plasma turbulento ultraquente de elétrons e prótons a mais de 1 bilhão de °C',
        temperature: 'Mais de 1.000.000.000 K',
        color: '#ffaa00',
        description: 'Anel brilhante capturado pelo Event Horizon Telescope em 2022 com 3 pontos quentes girando a 30% da velocidade da luz.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 134.0,
      orbitalVelocityKmS: 0,
      periapsisDistance: 'Centro da Via Láctea: Ponto Zero',
      apoapsisDistance: 'Centro da Via Láctea: Ponto Zero',
    },
    aerospace: {
      surfaceGravityMS2: 1e12,
      surfacePressureBar: 1e15,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 150000.0,
      surfaceLandingDeltaVKmS: 299792.4,
      entryVelocityKmS: 299792.4,
      aerobrakingFeasible: false,
      flightNotes: 'Pouso impossível: a dilatação temporal atinge o infinito no horizonte de eventos; da perspectiva de um observador externo, uma nave pareceria desacelerar até congelar para sempre no horizonte.',
    },
    didactic: {
      whatIsIt: 'Sagittarius A* é o monstro invisível que vive no coração da nossa galáxia: um buraco negro supermassivo com o peso de mais de 4 milhões de sóis esmagados em um único ponto.',
      everydayAnalogy: 'Imagine que a Via Láctea é um redemoinho gigante de água na banheira e Sagittarius A* é o ralo no centro exato por onde toda a galáxia gira!',
      ifYouWereThere: 'Você veria uma sombra circular negra perfeita no céu cercada por um anel de luz dourada rodopiante distorcida pela gravidade, com o tempo passando muito mais devagar para você do que para quem ficou na Terra.',
      howToReachIt: 'Fica a 26.700 anos-luz de nós. Em 2022, a colaboração mundial do Event Horizon Telescope usou 8 radiotelescópios sincronizados ao redor de toda a Terra para tirar a primeira foto real de sua sombra.',
      funFacts: [
        'Embora tenha a massa de 4,3 milhões de sóis, ele caberia confortavelmente dentro da órbita do planeta Mercúrio ao redor do Sol!',
        'Estrelas reais (chamadas de estrelas S) orbitam Sagittarius A* a velocidades assombrosas de mais de 25 milhões de km/h (quase 3% da velocidade da luz).',
        'Os astrônomos Andrea Ghez e Reinhard Genzel ganharam o Prêmio Nobel de Física em 2020 por provarem a existência de Sagittarius A* rastreando a órbita dessas estrelas por quase 30 anos.',
      ],
    },
    technical: {
      formalDefinition: 'Buraco negro supermassivo central da Via Láctea com métrica de Kerr estacionária com rotação não nula (a* ≈ 0.90), operando em regime de fluxo de acreção radiativamente ineficiente (RIAF).',
      primaryEquations: [
        {
          label: 'Raio de Schwarzschild do Horizonte Estático',
          formula: 'r_s = \\frac{2 G M}{c^2} = \\frac{2 \\times (6.674 \\times 10^{-11}) \\times (8.54 \\times 10^{36})}{(2.998 \\times 10^8)^2} \\approx 1.27 \\times 10^{10}\\text{ m} \\approx 0.085\\text{ AU}',
          desc: 'Tamanho físico do horizonte para um buraco negro de 4,297 milhões de massas solares.',
        },
        {
          label: 'Frequência da Última Órbita Circular Estável (ISCO)',
          formula: 'r_{\\text{ISCO}} = M \\left( 3 + Z_2 - \\sqrt{(3 - Z_1)(3 + Z_1 + 2 Z_2)} \\right) \\implies T_{\\text{orb}} \\approx 4 \\text{ a } 30\\text{ min}',
          desc: 'Período orbital ultracurto da matéria no ponto de maior proximidade antes do mergulho inexorável.',
        },
      ],
      fieldEquationsDesc: 'Métrica de Kerr no vácuo em coordenadas de Boyer-Lindquist: ds² = -(1 - 2Mr/ρ²)dt² - (4Mar sin²θ/ρ²)dtdφ + (ρ²/Δ)dr² + ρ² dθ² + (r² + a² + 2Ma²r sin²θ/ρ²)sin²θ dφ².',
      thermodynamics: 'Radiação de Hawking pura desprezível (T_H ~ 10⁻¹⁴ K) com entropia de área de Bekenstein-Hawking S = k_B A / (4 l_P²) ~ 10⁸⁴ J/K.',
      radiationRegime: 'Emissão não térmica de rádio polarizado a 230 GHz (1.3 mm) causada por turbulência magnetohidrodinâmica relativística (GRMHD) e espalhamento Compton térmico.',
    },
  },

  // =========================================================================
  // 24. M87* (MESSIER 87)
  // =========================================================================
  m87: {
    geology: [
      {
        name: 'Singularidade Central Gravitacional',
        depthKm: 'r = 0 (Ponto de densidade infinita / Anel de Kerr)',
        composition: 'Massa colapsada de 6,5 bilhões de sóis comprimida em volume nulo pelo colapso quântico',
        temperature: 'T_H ≈ 9.45 × 10⁻¹⁸ K (Frio quase absoluto pela radiação Hawking)',
        color: '#000000',
        description: 'Região onde a curvatura do espaço-tempo diverge para o infinito e a relatividade geral clássica deixa de operar sem gravitação quântica.',
      },
      {
        name: 'Horizonte de Eventos Interno e Externo de Kerr',
        depthKm: 'r₊ = M + √(M² - a²) ≈ 1.28 × 10¹⁰ km (85.6 AU / 2 vezes a órbita de Plutão)',
        composition: 'Fronteira geométrica causal unidirecional do espaço-tempo',
        temperature: 'Deslocamento para o vermelho gravitacional infinito',
        color: '#02040a',
        description: 'A superfície onde a velocidade de escape atinge a velocidade da luz no vácuo (c). Nada, nem fótons de luz, pode escapar de volta ao universo exterior.',
      },
      {
        name: 'Ergosfera Relativística (Frame Dragging)',
        depthKm: 'r_E(θ) = M + √(M² - a² cos²θ) até 1.92 × 10¹⁰ km no equador',
        composition: 'Espaço-tempo arrastado em vórtice na velocidade da luz pelo spin do buraco negro',
        temperature: 'Milhões de Kelvins nos limites de atrito turbulento',
        color: '#3b0764',
        description: 'O próprio tecido do espaço-tempo é forçado a girar junto com o buraco negro. É a região onde opera o Processo de Penrose e o mecanismo de Blandford-Znajek para extração de energia.',
      },
      {
        name: 'Jato Polar Relativístico Colimado',
        depthKm: 'Estende-se por mais de 5.000 anos-luz no espaço intergaláctico!',
        composition: 'Plasma de elétrons e pósitrons magnéticos a 99% da velocidade da luz',
        temperature: 'Radiação síncrotron não térmica de alta energia',
        color: '#a855f7',
        description: 'Campos magnéticos trançados na ergosfera canalizam matéria e energia em um feixe de plasma com poder de milhões de supernovas simultâneas.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 17.0,
      orbitalVelocityKmS: 0,
      periapsisDistance: 'Galáxia Messier 87: Centro',
      apoapsisDistance: 'Galáxia Messier 87: Centro',
    },
    aerospace: {
      surfaceGravityMS2: 1e11,
      surfacePressureBar: 1e16,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 120000.0,
      surfaceLandingDeltaVKmS: 299792.4,
      entryVelocityKmS: 299792.4,
      aerobrakingFeasible: false,
      flightNotes: 'O horizonte de eventos é maior do que o nosso Sistema Solar inteiro. Forças de maré no horizonte são curiosamente muito menores do que em buracos negros estelares devido ao raio de curvatura gigante (R ~ M).',
    },
    didactic: {
      whatIsIt: 'M87* é um titan cósmico: o primeiro buraco negro a ser fotografado na história da humanidade, pesando 6,5 bilhões de vezes mais do que o nosso Sol!',
      everydayAnalogy: 'Se Sagittarius A* é uma bola de boliche, M87* é uma montanha inteira! O tamanho da sua sombra engoliria todo o nosso Sistema Solar desde o Sol até além da órbita de Plutão!',
      ifYouWereThere: 'Você veria um anel de plasma cor de fogo e um feixe de luz azul fantasmagórico (o jato relativístico) sendo disparado pelo polo por milhares de anos-luz através do espaço intergaláctico.',
      howToReachIt: 'Fica a 53,5 milhões de anos-luz de nós na constelação de Virgem. A imagem histórica divulgada em abril de 2019 exigiu o esforço de mais de 300 cientistas e petabytes de dados.',
      funFacts: [
        'A foto histórica divulgada em 2019 foi a primeira vez em toda a história humana em que vimos a "silhueta" real de um buraco negro.',
        'Seu jato relativístico viaja tão perto da velocidade da luz que causa a ilusão de óptica de "movimento superluminal", parecendo se mover a 6 vezes a velocidade da luz!',
        'Sua sombra mede 40 bilhões de quilômetros de diâmetro — mais que o dobro da órbita de Plutão.',
      ],
    },
    technical: {
      formalDefinition: 'Buraco negro hipermassivo de Kerr no centro da galáxia elíptica gigante M87 com acreção radiativa magnetizada e ejeção relativística pelo processo de Blandford-Znajek.',
      primaryEquations: [
        {
          label: 'Potência Ejetada pelo Processo de Blandford-Znajek',
          formula: 'P_{\\text{BZ}} = \\frac{\\kappa}{4\\pi c} \\Phi_B^2 \\Omega_H^2 \\approx 10^{44}\\text{ erg/s} = 10^{37}\\text{ W}',
          desc: 'Extração da energia rotacional do buraco negro canalizada pelos campos magnéticos poloidais no jato.',
        },
        {
          label: 'Diâmetro Angular da Sombra de Schwarzschild-Kerr',
          formula: '\\theta = \\frac{2\\sqrt{27} G M}{c^2 d} \\approx 42 \\pm 3\\,\\mu\\text{as}',
          desc: 'Tamanho angular exato medido pelo Event Horizon Telescope em 1.3 mm.',
        },
      ],
      fieldEquationsDesc: 'Solução assintoticamente plana das Equações de Einstein G_μν = 8πG T_μν com T_μν = 0 no exterior do horizonte.',
      thermodynamics: 'Temperatura de Hawking T_H = ℏ c³ / (8π G M k_B) ≈ 9.45 × 10⁻¹⁸ K e entropia de Bekenstein-Hawking S_BH = k_B c³ A / (4 G ℏ).',
      radiationRegime: 'Radiação síncrotron polarizada e espalhamento Compton inverso emitidos por elétrons relativísticos ultra-energéticos no jato magnético colimado.',
    },
  },

  // =========================================================================
  // 25. CYGNUS X-1
  // =========================================================================
  'cygnus-x1': {
    geology: [
      {
        name: 'Horizonte de Buraco Negro Estelar de 21.2 M☉',
        depthKm: 'Raio de Schwarzschild de apenas 62.6 km!',
        composition: 'Matéria estelar colapsada em curvatura relativística pura',
        temperature: 'T_H ≈ 2.9 × 10⁻⁹ K',
        color: '#00ffd5',
        description: 'A massa de 21 sóis espremida em uma esfera menor que a cidade de São Paulo ou Londres, girando a 97% da velocidade máxima permitida pela física.',
      },
      {
        name: 'Estrela Companheira Supergigante Azul HDE 226868',
        depthKm: 'Raio de 20 a 22 milhões de km (30 a 32 R☉ / 41 M☉)',
        composition: 'Estrela quente de classe O9.7Iab de queima nuclear rápida',
        temperature: '31.000 K',
        color: '#38bdf8',
        description: 'Estrela colossal que perde massa a uma taxa furiosa através de vento estelar capturado pelo campo gravitacional do buraco negro.',
      },
      {
        name: 'Disco de Acreção de Raios-X Duro e Fino',
        depthKm: 'Estende-se de 63 km a 15.000 km',
        composition: 'Gás ionizado em atrito viscoso turbulento a 10% da velocidade da luz',
        temperature: 'Mais de 10.000.000 K (emite raios-X duros letais)',
        color: '#00e5ff',
        description: 'Gera uma das fontes de raios-X mais intensas e energéticas detectadas no céu da Terra.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0.2,
      eccentricity: 0.001,
      inclinationDeg: 27.1,
      orbitalVelocityKmS: 75.0,
      periapsisDistance: 'Período orbital binário: 5.6 dias terrestres',
      apoapsisDistance: 'Período orbital binário: 5.6 dias terrestres',
    },
    aerospace: {
      surfaceGravityMS2: 1.08e12,
      surfacePressureBar: 1e16,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 200000.0,
      surfaceLandingDeltaVKmS: 299792.4,
      entryVelocityKmS: 299792.4,
      aerobrakingFeasible: false,
      flightNotes: 'Fluxo letal de raios-X e forças de maré destrutivas. Nenhuma nave tripulada poderia se aproximar a menos de dezenas de milhões de quilômetros sem ser esterilizada pela radiação.',
    },
    didactic: {
      whatIsIt: 'Cygnus X-1 é uma das "feras" mais famosas do cosmos: o primeiro buraco negro confirmado na história da ciência, canibalizando sua estrela companheira azul.',
      everydayAnalogy: 'É como um mosquito gravitacional invisível mas pesando 21 vezes mais que o Sol, bebendo a matéria de uma estrela gigante através de um canudinho de plasma ultraquente!',
      ifYouWereThere: 'Você veria uma estrela azul titânica sendo esticada em formato de gota pela gravidade do buraco negro, com um rio brilhante de gás caindo em espiral em um disco ciano incandescente.',
      howToReachIt: 'Localizado a 7.300 anos-luz na constelação do Cisne, foi descoberto por foguetes lançados com detectores de raios-X na década de 1960 e 1970.',
      funFacts: [
        'Foi o objeto da famosa aposta científica de 1975 entre Stephen Hawking e Kip Thorne: Hawking apostou que NÃO era um buraco negro (como uma "apólice de seguro"), mas admitiu a derrota em 1990 quando as evidências se tornaram irrefutáveis.',
        'Ele gira a uma velocidade inacreditável: mais de 800 rotações por segundo sobre o próprio eixo!',
        'Sua estrela companheira e ele completam uma órbita mútua em apenas 5 dias e meio.',
      ],
    },
    technical: {
      formalDefinition: 'Binária de raios-X de alta massa (HMXB) de microquasar em estado espectral duro com buraco negro de Kerr de colapso estelar de 21.2 ± 2.2 M☉ acoplado por vento de lóbulo de Roche.',
      primaryEquations: [
        {
          label: 'Luminosidade de Acreção de Disco Padrão (Shakura-Sunyaev)',
          formula: 'L_{\\text{acc}} = \\eta \\dot{M} c^2, \\quad \\eta \\approx 1 - \\sqrt{1 - \\frac{2 r_s}{3 r_{\\text{ISCO}}}} \\approx 0.15',
          desc: 'Eficiência de conversão de matéria em radiação até 20 vezes superior à fusão nuclear estelar.',
        },
        {
          label: 'Spin Adimensional de Kerr Quase-Extremo',
          formula: 'a^* = \\frac{c J}{G M^2} > 0.95',
          desc: 'Medido pelo alargamento relativístico da linha de fluorescência de ferro Fe K-alfa a 6.4 keV.',
        },
      ],
      fieldEquationsDesc: 'Geodésicas nulas com arrasto de referenciais em ângulo extremo e alargamento gravitacional de Doppler relativístico assimétrico.',
      thermodynamics: 'Corona magnetizada com temperatura de elétrons k_B T_e ≈ 100 keV produzindo comptonização térmica reversa de fótons moles.',
      radiationRegime: 'Espectro de lei de potência duro (fótons de até centenas de keV) acompanhado por jatos de rádio sincrotron colimados.',
    },
  },

  // =========================================================================
  // 26. TON 618
  // =========================================================================
  ton618: {
    geology: [
      {
        name: 'Singularidade Ultramassiva (Maior Buraco Negro Conhecido)',
        depthKm: 'r = 0 (Massa colossal de 66 bilhões de sóis!)',
        composition: 'Colapso gravitacional primordial no alvorecer do universo',
        temperature: 'T_H ≈ 9.3 × 10⁻¹⁹ K',
        color: '#ffffff',
        description: 'Contém a massa de todas as estrelas da Via Láctea somadas multiplicada por várias vezes em um único objeto.',
      },
      {
        name: 'Horizonte de Eventos Gigantesco (Tamanho de Galáxias)',
        depthKm: 'r_s ≈ 195 bilhões de km (~1.300 AU / 40 vezes a órbita de Netuno!)',
        composition: 'Fronteira causal cósmica que engoliria sistemas solares inteiros',
        temperature: 'Quase zero absoluto pela enorme massa',
        color: '#050505',
        description: 'A luz leva semanas apenas para atravessar o diâmetro da sua sombra!',
      },
      {
        name: 'Disco de Acreção Hiper-Luminoso (Hiperquasar)',
        depthKm: 'Estende-se por anos-luz de diâmetro',
        composition: 'Gás e estrelas despedaçadas em plasma relativístico girando a frações de c',
        temperature: 'Mais de 100.000.000 K',
        color: '#f8fafc',
        description: 'Brilha com a luminosidade de 140 trilhões de sóis (140.000.000.000.000 L☉), ofuscando todas as 100 bilhões de estrelas de sua galáxia hospedeira.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 30.0,
      orbitalVelocityKmS: 0,
      periapsisDistance: 'Cosmos Primitivo: z = 2.219',
      apoapsisDistance: 'Cosmos Primitivo: z = 2.219',
    },
    aerospace: {
      surfaceGravityMS2: 1e10,
      surfacePressureBar: 1e18,
      scaleHeightKm: 0,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 250000.0,
      surfaceLandingDeltaVKmS: 299792.4,
      entryVelocityKmS: 299792.4,
      aerobrakingFeasible: false,
      flightNotes: 'A radiação expelida pelo disco de acreção aceleraria e destruiria qualquer matéria a anos-luz de distância por pura pressão de radiação de Eddington.',
    },
    didactic: {
      whatIsIt: 'TON 618 é o maior, mais pesado e mais aterrorizante buraco negro já descoberto em todo o universo observável: uma verdadeira aberração cósmica.',
      everydayAnalogy: 'Se a Terra fosse um grão de areia e o Sol fosse uma laranja, TON 618 seria uma montanha inteira maior que o Everest pesando o mesmo que 66 bilhões de estrelas juntas!',
      ifYouWereThere: 'Você não veria uma escuridão; veria um farol ofuscante e cegante brilhando mais que 100 galáxias inteiras somadas, com ventos furiosos de plasma soprando pelo espaço intergaláctico.',
      howToReachIt: 'Está situado a mais de 10,8 bilhões de anos-luz de distância da Terra. Estamos olhando para ele como era quando o universo tinha apenas um terço de sua idade atual.',
      funFacts: [
        'Ele pesa 66 bilhões de vezes mais do que o nosso Sol — é mais massivo que a soma de todas as estrelas da nossa própria galáxia Via Láctea!',
        'Seu disco de acreção gera tanta energia que brilha com a força de 140 trilhões de sóis juntos.',
        'Se você viajasse à velocidade da luz (300.000 km/s), demoraria semanas inteiras só para cruzar de uma ponta a outra da sombra do buraco negro.',
      ],
    },
    technical: {
      formalDefinition: 'Hiper-quasar radio-silencioso de linhas de emissão largas (Broad Absorption Line Quasar) energizado por buraco negro ultramassivo de Kerr de 6.6 × 10¹⁰ M☉ a redshift cosmológico z = 2.219.',
      primaryEquations: [
        {
          label: 'Luminosidade Limite de Eddington',
          formula: 'L_{\\text{Edd}} = \\frac{4\\pi G M m_p c}{\\sigma_T} \\approx 1.26 \\times 10^{38} \\left(\\frac{M}{M_\\odot}\\right)\\text{ erg/s} \\approx 8.3 \\times 10^{41}\\text{ W}',
          desc: 'Pressão de radiação máxima suportável antes de soprar para fora todo o gás do disco de acreção.',
        },
        {
          label: 'Taxa de Consumo de Massa de Acreção',
          formula: '\\dot{M} = \\frac{L_{\\text{bol}}}{\\eta c^2} \\approx 1.400\\, M_\\odot / \\text{ano}',
          desc: 'TON 618 devora o equivalente a vários sistemas solares inteiros todos os dias para sustentar seu brilho.',
        },
      ],
      fieldEquationsDesc: 'Métrica cosmológica FLRW combinada com poço gravitacional assintótico de Kerr de curvatura em escala de kiloparsecs.',
      thermodynamics: 'Gradiente de temperatura em disco de acreção espesso (super-Eddington) com aprisionamento convectivo de fótons (photon trapping).',
      radiationRegime: 'Ventos térmicos de absorção com velocidades terminais de ejeção de até 0.2c (60.000 km/s) soprando o gás fora de sua galáxia hospedeira.',
    },
  },

  // =========================================================================
  // 27. PULSAR DO CARANGUEJO (PSR B0531+21)
  // =========================================================================
  crab_pulsar: {
    geology: [
      {
        name: 'Crosta Externa Cristalina de Ferro Superdenso',
        depthKm: '0 a 0.3 km',
        composition: 'Rede cristalina de núcleos atômicos de Ferro-56 totalmente ionizados imersos em mar de elétrons relativísticos',
        temperature: '1.600.000 K',
        color: '#38bdf8',
        description: 'Tão rígida que é 10 bilhões de vezes mais resistente à fratura do que o melhor aço da Terra. Qualquer "montanha" nela mede menos de 1 milímetro de altura.',
      },
      {
        name: 'Crosta Interna e Pasta Nuclear',
        depthKm: '0.3 a 1.0 km',
        composition: 'Nêutrons gotejados, prótons e estruturas de "pasta nuclear" (gnocchi, espaguete e lasanha nuclear)',
        temperature: '2.000.000 K',
        color: '#0284c7',
        description: 'Sob pressões nucleares extremas, os núcleos atômicos se fundem em cilindros e placas com comportamento viscoelástico exótico.',
      },
      {
        name: 'Núcleo Superfluido de Nêutrons',
        depthKm: '1.0 a 12.0 km (Centro)',
        composition: 'Superfluido de nêutrons em pares de Cooper (vorticidade quantizada) e supercondutor de prótons',
        temperature: '~100.000.000 K',
        color: '#0369a1',
        description: 'Sem nenhuma viscosidade: gira com vórtices quânticos que causam os repentinos "glitches" (acelerações bruscas na rotação do pulsar).',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 63.0,
      orbitalVelocityKmS: 220.0,
      periapsisDistance: 'Remanescente de Supernova M1: Centro',
      apoapsisDistance: 'Remanescente de Supernova M1: Centro',
    },
    aerospace: {
      surfaceGravityMS2: 2.0e12,
      surfacePressureBar: 1e28,
      scaleHeightKm: 0.001,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 120000.0,
      surfaceLandingDeltaVKmS: 180000.0,
      entryVelocityKmS: 180000.0,
      aerobrakingFeasible: false,
      flightNotes: 'Se um objeto caísse na superfície do pulsar de uma altura de apenas 1 metro, bateria no solo a mais de 7 milhões de km/h em um milionésimo de segundo devido à gravidade colossal.',
    },
    didactic: {
      whatIsIt: 'O Pulsar do Caranguejo é uma estrela de nêutrons rodopiante que sobrou da explosão de uma supernova: um farol cósmico girando a 30 voltas por segundo!',
      everydayAnalogy: 'Imagine pegar uma estrela com a massa de um Sol e meio e esmagá-la com tanta força que ela caiba perfeitamente dentro do anel viário de uma cidade como São Paulo ou Belo Horizonte!',
      ifYouWereThere: 'Você ouviria e veria dois feixes de radiação azulada cortando o céu 30 vezes por segundo como um pisca-pisca frenético, enquanto o chão treme com campos magnéticos trilhões de vezes mais fortes que os da Terra.',
      howToReachIt: 'Localizado a 6.500 anos-luz no centro da Nebulosa do Caranguejo, seus pulsos de rádio foram descobertos em 1968 e sua rotação é tão precisa quanto os melhores relógios atômicos da Terra.',
      funFacts: [
        'A explosão que criou o Pulsar foi vista na Terra no ano de 1054 por astrônomos chineses, ficando tão brilhante que pôde ser vista em pleno dia por 23 dias seguidos!',
        'Uma única colher de chá de matéria do interior dessa estrela de nêutrons pesaria mais de 5 bilhões de toneladas (o peso de todas as montanhas de uma cordilheira!).',
        'Ele gira a exatas 30,2 rotações por segundo e está desacelerando cerca de 38 nanossegundos por dia devido à perda de energia eletromagnética.',
      ],
    },
    technical: {
      formalDefinition: 'Estrela de nêutrons jovem magnetizada com emissão pulsar alimentada por rotação (spin-powered pulsar), descrita pela equação de estado de matéria hadrônica ultra-densa (Tolman-Oppenheimer-Volkoff).',
      primaryEquations: [
        {
          label: 'Perda de Energia Rotacional (Luminosidade de Spin-Down)',
          formula: '\\dot{E} = -4\\pi^2 I \\frac{\\dot{P}}{P^3} \\approx 4.5 \\times 10^{38}\\text{ erg/s} = 4.5 \\times 10^{31}\\text{ W}',
          desc: 'Energia cinética rotacional convertida em ventos de partículas e radiação sincrotron na nebulosa.',
        },
        {
          label: 'Campo Magnético de Superfície Dipolar',
          formula: 'B_s = 3.2 \\times 10^{19} \\sqrt{P \\dot{P}} \\approx 3.8 \\times 10^8\\text{ Tesla} \\approx 3.8 \\times 10^{12}\\text{ Gauss}',
          desc: 'Campo magnético colossal gerado pela conservação do fluxo magnético durante o colapso do núcleo estelar.',
        },
      ],
      fieldEquationsDesc: 'Métrica TOV estática esfericamente simétrica relativística com desvio para o vermelho gravitacional superficial z = (1 - 2GM/Rc²)^(-1/2) - 1 ≈ 0.25.',
      thermodynamics: 'Equilíbrio térmico governado pelo processo Urca direto de emissão de neutrinos nucleares (n → p + e⁻ + ν_e).',
      radiationRegime: 'Aceleração de pares elétron-pósitron nas calotas polares da magnetosfera (polar gap) emitindo feixes de luz coerente de rádio até raios gama TeV.',
    },
  },

  // =========================================================================
  // 28. MAGNETAR SGR 1806-20
  // =========================================================================
  magnetar_1806: {
    geology: [
      {
        name: 'Crosta Metálica Eletrodinâmica Ultracomprimida',
        depthKm: '0 a 1.0 km',
        composition: 'Rede atômica esmagada sob tensões magnéticas de Lorentz que ultrapassam o limite de elasticidade mecânica',
        temperature: '2.000.000 K',
        color: '#ef4444',
        description: 'Sismos estelares na crosta ("starquakes") causam quebras na rede que liberam erupções titânicas de raios gama.',
      },
      {
        name: 'Interior Supercondutor Toroidal e Poloidal',
        depthKm: '1.0 a 10.5 km (Centro)',
        composition: 'Matéria de nêutrons supercondutora sustentando dínamo magnetohidrodinâmico congelado',
        temperature: '~500.000.000 K',
        color: '#b91c1c',
        description: 'Os tubos de fluxo magnético interno estão tão emaranhados que deformam a própria geometria da estrela em um esferoide prolato.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 0,
      orbitalVelocityKmS: 220.0,
      periapsisDistance: 'Distância: 50.000 Anos-Luz',
      apoapsisDistance: 'Distância: 50.000 Anos-Luz',
    },
    aerospace: {
      surfaceGravityMS2: 2.5e12,
      surfacePressureBar: 1e29,
      scaleHeightKm: 0.001,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 130000.0,
      surfaceLandingDeltaVKmS: 190000.0,
      entryVelocityKmS: 190000.0,
      aerobrakingFeasible: false,
      flightNotes: 'O campo magnético é tão brutal que a 1.000 km de distância de sua superfície ele simplesmente rasgaria a estrutura dos átomos de qualquer matéria ou organismo vivo.',
    },
    didactic: {
      whatIsIt: 'O Magnetar SGR 1806-20 é o ímã mais colossal, aterrorizante e violento já registrado em todo o universo.',
      everydayAnalogy: 'Se esse magnetar estivesse posicionado na metade da distância entre a Terra e a Lua, seu campo magnético apagaria instantaneamente todos os cartões de crédito e celulares na Terra e dissolveria as moléculas do nosso corpo!',
      ifYouWereThere: 'O próprio vácuo ao redor dele se comporta de forma bizarra: a luz é dividida em dois caminhos diferentes e fótons se transformam espontaneamente em pares de matéria e antimatéria pelo campo magnético.',
      howToReachIt: 'Localizado a 50.000 anos-luz de nós no outro lado da nossa galáxia, seus pulsos de energia viajam na velocidade da luz.',
      funFacts: [
        'Em 27 de dezembro de 2004, esse magnetar sofreu um terremoto estelar de meio milímetro em sua crosta que liberou em apenas um décimo de segundo mais energia do que o nosso Sol produziu nos últimos 250.000 anos juntos!',
        'Mesmo estando a 50.000 anos-luz de distância, o flash de raios gama dessa explosão de 2004 cegou temporariamente satélites no espaço e alterou a alta atmosfera da Terra.',
        'Seu campo magnético é mais de 100 trilhões de vezes mais poderoso que o campo magnético do planeta Terra.',
      ],
    },
    technical: {
      formalDefinition: 'Estrela de nêutrons da subclasse Soft Gamma Repeater (SGR) energizada pelo decaimento do campo magnético interno supercrítico (B >> B_QED).',
      primaryEquations: [
        {
          label: 'Campo Crítico da Eletrodinâmica Quântica (QED)',
          formula: 'B_{\\text{QED}} = \\frac{m_e^2 c^3}{e \\hbar} \\approx 4.414 \\times 10^9\\text{ Tesla} \\implies B_{\\text{magnetar}} \\sim 10^{11}\\text{ Tesla} \\approx 20\\, B_{\\text{QED}}',
          desc: 'Regime onde o campo magnético altera as propriedades quânticas do próprio vácuo (birrefringência magnética).',
        },
        {
          label: 'Energia Magnética Total Armazenada',
          formula: 'E_{\\text{mag}} = \\int \\frac{B^2}{2\\mu_0} dV \\approx \\frac{B^2}{6\\mu_0} R^3 \\sim 10^{40}\\text{ Joules}',
          desc: 'Reserva de energia que alimenta os flares gigantes de raios gama durante a quebra da crosta cristalina.',
        },
      ],
      fieldEquationsDesc: 'Métrica deformada anisotrópicamente por tensões magnéticas de Maxwell com polarização do tensor dielétrico do vácuo de Heisenberg-Euler.',
      thermodynamics: 'Decaimento de correntes elétricas no núcleo (ambipolar diffusion e efeito Hall) convertendo energia magnética em calor por bilhões de anos.',
      radiationRegime: 'Fissão de fótons (photon splitting γ → γ + γ) e fusão de pares de elétron-pósitron em bola de fogo ultra-relativística presa magneticamente.',
    },
  },

  // =========================================================================
  // 29. VIA LÁCTEA
  // =========================================================================
  milkyway: {
    geology: [
      {
        name: 'Disco Galáctico Fino e Grosso',
        depthKm: 'Diâmetro de 100.000 a 120.000 anos-luz (Espessura de 1.000 anos-luz)',
        composition: 'Gás interestelar, poeira e população de 100 a 400 bilhões de estrelas',
        temperature: '2.725 K a milhões de K em bolhas de supernova',
        color: '#38bdf8',
        description: 'Braços espirais (Braço de Órion, Perseus, Carina-Sagitário e Scutum-Crux) onde o Sol e a maioria das estrelas jovens orbitam.',
      },
      {
        name: 'Bojo Galáctico Central e Barra Estelar',
        depthKm: 'Extensão de 27.000 anos-luz no centro',
        composition: 'População estelar antiga de estrelas vermelhas e gigantes de População II',
        temperature: 'Milhões de Kelvins nas nuvens moleculares centrais',
        color: '#f59e0b',
        description: 'Estrutura em forma de barra assimétrica que conduz gás em direção ao buraco negro supermassivo Sagittarius A*.',
      },
      {
        name: 'Halo Esferoidal de Matéria Escura Fria (CDM)',
        depthKm: 'Estende-se por mais de 650.000 anos-luz no espaço intergaláctico!',
        composition: 'Partículas não bariônicas de matéria escura (85% da massa total da galáxia)',
        temperature: 'Desacoplada termicamente da radiação',
        color: '#8b5cf6',
        description: 'O invólucro invisível que impede a galáxia de se despedaçar pela sua própria rotação ultrarrápida.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 60.0,
      orbitalVelocityKmS: 630.0,
      periapsisDistance: 'Grupo Local de Galáxias',
      apoapsisDistance: 'Superaglomerado Laniakea',
    },
    aerospace: {
      surfaceGravityMS2: 0,
      surfacePressureBar: 0,
      scaleHeightKm: 1e16,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 220.0,
      surfaceLandingDeltaVKmS: 0,
      entryVelocityKmS: 550.0,
      aerobrakingFeasible: false,
      flightNotes: 'O Sol leva aproximadamente 230 milhões de anos terrestres para dar uma volta completa ao redor do centro da galáxia (um "Ano Cósmico"). Quando o Sol esteve na posição atual pela última vez, os primeiros dinossauros estavam surgindo na Terra!',
    },
    didactic: {
      whatIsIt: 'A Via Láctea é a nossa ilha cósmica: uma cidade estelar espiral majestosa composta por mais de 100 bilhões de estrelas e planetas, incluindo o nosso próprio Sistema Solar.',
      everydayAnalogy: 'Se a Via Láctea tivesse o tamanho do continente da América do Sul inteiro, o nosso Sistema Solar inteiro seria menor que uma moeda de um centavo pousada na grama!',
      ifYouWereThere: 'De fora, pareceria um gigantesco cata-vento prateado e dourado girando no escuro, com braços espirais salpicados de berçários de estrelas cor-de-rosa.',
      howToReachIt: 'Nós já vivemos dentro dela! Todas as estrelas que você já viu no céu a olho nu estão no nosso pequeno bairro dentro da Via Láctea.',
      funFacts: [
        'A Via Láctea contém entre 100 e 400 bilhões de estrelas e cientistas estimam que existam pelo menos 100 bilhões de planetas nela.',
        'Toda a galáxia está viajando pelo espaço a 2,2 milhões de km/h em direção ao misterioso "Grande Atrator".',
        'Daqui a 4,5 bilhões de anos, a Via Láctea vai colidir e se fundir com a vizinha Galáxia de Andrômeda, formando uma nova supergaláxia apelidada de "Lactômeda".',
      ],
    },
    technical: {
      formalDefinition: 'Galáxia espiral barrada gigante de tipo morfológico SBbc no Grupo Local, sustentada por curva de rotação plana induzida por perfil de densidade de matéria escura NFW.',
      primaryEquations: [
        {
          label: 'Curva de Rotação Plana e Evidência de Matéria Escura',
          formula: 'v(r) = \\sqrt{\\frac{G M(r)}{r}} \\approx 220\\text{ km/s} = \\text{constante} \\implies M(r) \\propto r',
          desc: 'Divergência gritante da previsão newtoniana kepleriana v ∝ r⁻¹/², provando que a maior parte da massa é invisível.',
        },
        {
          label: 'Perfil de Densidade de Navarro-Frenk-White (NFW)',
          formula: '\\rho(r) = \\frac{\\rho_0}{\\left(\\frac{r}{r_s}\\right) \\left(1 + \\frac{r}{r_s}\\right)^2}',
          desc: 'Distribuição universal de matéria escura fria colisionalmente desacoplada em halos galácticos.',
        },
      ],
      fieldEquationsDesc: 'Potencial de maré galáctico axisymmetricamente achatado com tensor de Oort A e B quantificando cisalhamento e vorticidade local.',
      thermodynamics: 'Estrutura multifásica de meio interestelar: fase fria neutra (CNM: T ~ 80 K), fase morna ionizada (WIM: T ~ 8.000 K) e fase coronal quente (HIM: T ~ 10⁶ K).',
      radiationRegime: 'Emissão contínua de rádio na linha de 21 cm do hidrogênio atômico neutro gerada pela transição hiperfina de inversão de spin.',
    },
  },

  // =========================================================================
  // 30. GALÁXIA DE ANDRÔMEDA (M31)
  // =========================================================================
  andromeda: {
    geology: [
      {
        name: 'Disco Espiral Gigante e Braços Estelares',
        depthKm: 'Diâmetro de 220.000 anos-luz (Mais que o dobro do tamanho da Via Láctea!)',
        composition: 'População de mais de 1 trilhão de estrelas com braços de poeira e gás',
        temperature: '2.725 K',
        color: '#a855f7',
        description: 'Possui anéis concêntricos de poeira perturbados por colisões passadas com sua galáxia satélite M32.',
      },
      {
        name: 'Núcleo Duplo e Buraco Negro Central Supermassivo',
        depthKm: 'Centro galáctico com anel estelar assimétrico excêntrico',
        composition: 'Anel elíptico de estrelas antigas e buraco negro de 140 milhões de massas solares',
        temperature: 'Milhões de Kelvins',
        color: '#c084fc',
        description: 'Um núcleo duplo aparente (P1 e P2) resultante da projeção de uma órbita estelar excêntrica em torno do buraco negro supermassivo.',
      },
      {
        name: 'Halo Gigantesco de Aglomerados Globulares',
        depthKm: 'Estende-se por mais de 1 milhão de anos-luz',
        composition: 'Mais de 500 aglomerados globulares densos e correntes de maré estelares',
        temperature: 'Vácuo intergaláctico',
        color: '#7e22ce',
        description: 'Halo imenso que já está colidindo e se tocando com o halo externo da nossa própria Via Láctea.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 77.0,
      orbitalVelocityKmS: 110.0,
      periapsisDistance: 'Distância da Terra: 2.537.000 Anos-Luz',
      apoapsisDistance: 'Distância da Terra: 2.537.000 Anos-Luz',
    },
    aerospace: {
      surfaceGravityMS2: 0,
      surfacePressureBar: 0,
      scaleHeightKm: 1e16,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 250.0,
      surfaceLandingDeltaVKmS: 0,
      entryVelocityKmS: 650.0,
      aerobrakingFeasible: false,
      flightNotes: 'Aproxima-se da Terra a 110 km por segundo (400.000 km/h). Em 4,5 bilhões de anos, as duas galáxias se entrelaçarão, mas como as estrelas estão muito distantes umas das outras, praticamente nenhuma estrela colidirá individualmente.',
    },
    didactic: {
      whatIsIt: 'Andrômeda é a maior galáxia do nosso Grupo Local e o objeto mais distante que você consegue ver a olho nu no céu sem telescópio!',
      everydayAnalogy: 'Se a Via Láctea e Andrômeda fossem duas pessoas, elas estariam correndo de braços abertos uma em direção à outra em câmera lenta para um abraço cósmico gigantesco!',
      ifYouWereThere: 'O céu noturno teria uma densidade de estrelas duas vezes maior que o nosso, com a Via Láctea aparecendo no horizonte como uma espiral majestosa.',
      howToReachIt: 'Fica a 2,5 milhões de anos-luz: a luz que você enxerga dela hoje partiu na época em que os primeiros hominídeos ancestrais da humanidade estavam aprendendo a usar pedras lascadas na Terra.',
      funFacts: [
        'É o objeto natural mais distante que o olho humano consegue enxergar sem ajuda de nenhum instrumento óptico.',
        'Andrômeda tem mais de 1 trilhão de estrelas — o dobro da nossa galáxia!',
        'Quando ela colidir com a Via Láctea, o Sol e a Terra não serão destruídos; seremos apenas gentilmente arremessados para uma nova órbita dentro da nova galáxia combinada.',
      ],
    },
    technical: {
      formalDefinition: 'Galáxia espiral gigante SA(s)b no Grupo Local com massa virial M_vir ≈ 1.5 × 10¹² M☉, em órbita de captura e colisão parabólica com a Via Láctea.',
      primaryEquations: [
        {
          label: 'Tempo de Colisão Inelástica de Fusão de Galáxias',
          formula: 't_{\\text{colisão}} \\approx \\frac{d_{\\text{sep}}}{v_{\\text{aprox}}} = \\frac{2.537 \\times 10^6\\text{ AL}}{110\\text{ km/s}} \\approx 4.5 \\times 10^9\\text{ anos}',
          desc: 'Tempo estimado para o primeiro periastro da fusão que resultará na galáxia elíptica gigante Lactômeda.',
        },
        {
          label: 'Atrito Dinâmico de Chandrasekhar na Fusão',
          formula: '\\mathbf{F}_{\\text{df}} = -\\frac{4\\pi G^2 M^2 \\rho \\ln\\Lambda}{v^2} \\left[ \\text{erf}(X) - \\frac{2X}{\\sqrt{\\pi}}e^{-X^2} \\right] \\frac{\\mathbf{v}}{v}',
          desc: 'Força de arrasto gravitacional dissipativa que converterá a energia orbital das duas galáxias em dispersão estelar térmica.',
        },
      ],
      fieldEquationsDesc: 'Simulação hidrodinâmica de N-corpos relativística com conservação de tensor energia-momento e relaxação violenta de Lynden-Bell.',
      thermodynamics: 'Ondas de choque no gás interestelar comprimido desencadeando uma era de "Starburst" (explosão de nascimento de estrelas) durante a fusão.',
      radiationRegime: 'Linhas moleculares de monóxido de carbono (CO) mapeando anéis de formação estelar induzidos por marés a 10 kpc do núcleo.',
    },
  },

  // =========================================================================
  // 31. GALÁXIA DO SOMBRERO (M104)
  // =========================================================================
  sombrero: {
    geology: [
      {
        name: 'Anel Espesso de Poeira Opaca e Gás Frio (A Aba do Chapéu)',
        depthKm: 'Estende-se por 50.000 anos-luz na borda equatorial',
        composition: 'Poeira interestelar densa de hidrocarbonetos e gás hidrogênio frio',
        temperature: '20 K a 50 K',
        color: '#f59e0b',
        description: 'Uma faixa contínua escura simétrica que absorve a luz do bojo brilhante traseiro, dando à galáxia sua icônica aparência de chapéu mexicano.',
      },
      {
        name: 'Bojo Esferoidal Colossal de Estrelas Velhas',
        depthKm: 'Raio esferoidal volumoso de mais de 30.000 anos-luz',
        composition: 'Centenas de bilhões de estrelas amarelas e vermelhas antigas',
        temperature: 'Milhões de Kelvins',
        color: '#fef08a',
        description: 'Bojo desproporcionalmente gigantesco comparado a galáxias espirais comuns, assemelhando-se a uma galáxia elíptica que engoliu um disco.',
      },
      {
        name: 'Buraco Negro Supermassivo Monstruoso de 1 Bilhão de M☉',
        depthKm: 'Centro galáctico (250 vezes mais massivo que Sagittarius A*!)',
        composition: 'Horizonte de eventos de 3 bilhões de km de diâmetro',
        temperature: 'T_H ~ 6 × 10⁻¹⁷ K',
        color: '#000000',
        description: 'Um dos buracos negros mais massivos do universo local, medido pela velocidade orbital rápida das estrelas centrais pelo telescópio Hubble.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 84.0,
      orbitalVelocityKmS: 1024.0,
      periapsisDistance: 'Distância da Terra: 29.3 Milhões de Anos-Luz',
      apoapsisDistance: 'Distância da Terra: 29.3 Milhões de Anos-Luz',
    },
    aerospace: {
      surfaceGravityMS2: 0,
      surfacePressureBar: 0,
      scaleHeightKm: 1e16,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 300.0,
      surfaceLandingDeltaVKmS: 0,
      entryVelocityKmS: 500.0,
      aerobrakingFeasible: false,
      flightNotes: 'Vista quase exatamente de perfil a partir da Terra (84° de inclinação), o que ressalta o contraste espetacular entre o halo de poeira escura e o bulbo brilhante central.',
    },
    didactic: {
      whatIsIt: 'A Galáxia do Sombrero é uma obra de arte cósmica: uma galáxia vista de perfil com um disco de poeira escura que lembra perfeitamente um chapéu sombrero mexicano!',
      everydayAnalogy: 'Parece um prato voador incandescente com uma faixa de chocolate escuro desenhada na borda!',
      ifYouWereThere: 'O céu noturno seria dominado por milhares de aglomerados de estrelas esféricos e uma faixa de poeira escura e fria dividindo o universo em dois hemisférios luminosos.',
      howToReachIt: 'Situada a 29 milhões de anos-luz na borda do aglomerado de Virgem, sua luz partiu quando a Terra estava na época geológica do Oligoceno.',
      funFacts: [
        'Ela possui um sistema de mais de 2.000 aglomerados globulares de estrelas — quase 15 vezes mais aglomerados do que a nossa Via Láctea!',
        'No coração do Sombrero mora um buraco negro de 1 bilhão de massas solares: ele é 250 vezes maior que o buraco negro central da nossa galáxia!',
        'A poeira escura de sua borda é tão densa que esconde quase todas as estrelas jovens que estão nascendo lá dentro.',
      ],
    },
    technical: {
      formalDefinition: 'Galáxia híbrida espiral com bojo hipertrofiado de tipo SA(s)a vista quase edge-on (i = 84°), apresentando halo globular massivo e SMBH de 1.0 ± 0.2 × 10⁹ M☉.',
      primaryEquations: [
        {
          label: 'Relação M-Sigma de Dispersão de Velocidades Estelares',
          formula: 'M_{\\text{BH}} \\approx 1.9 \\times 10^8 M_\\odot \\left( \\frac{\\sigma}{200\\text{ km/s}} \\right)^{4.24} \\implies M_{\\text{BH}} \\approx 10^9\\, M_\\odot',
          desc: 'Relação empírica que correlaciona a massa do buraco negro com a velocidade de dispersão estelar no bulbo galáctico.',
        },
        {
          label: 'Extinção de Poeira Interestelar em Perfil',
          formula: 'A_V = 1.086\\, \\tau_V = 1.086 \\int \\kappa_V \\rho_{\\text{poeira}} ds',
          desc: 'Profundidade óptica que gera o corte opaco equatorial escuro na luz do bulbo.',
        },
      ],
      fieldEquationsDesc: 'Perfil de densidade luminosa de de Vaucouleurs R¹/⁴ característico de sistemas elípticos acoplado a disco exponencial fino de Freeman.',
      thermodynamics: 'Emissão no infravermelho médio detectada pelo telescópio Spitzer mapeando a distribuição de hidrocarbonetos aromáticos policíclicos.',
      radiationRegime: 'Núcleo galáctico ativo (LINER) de baixa luminosidade ionizado por acreção sub-Eddington radiativamente ineficiente.',
    },
  },

  // =========================================================================
  // 32. CAMPO ULTRA-PROFUNDO DO JWST (JADES / HUDF)
  // =========================================================================
  deepfield: {
    geology: [
      {
        name: 'Galáxias do Alvorecer Cósmico (z > 10 a 14)',
        depthKm: 'Distâncias de até 13,4 bilhões de anos-luz (apenas 300 a 400 Ma após o Big Bang)',
        composition: 'Primeiras estrelas massivas de População III livres de metais pesados e primeiros buracos negros sementes',
        temperature: 'Gás primordial de Hidrogênio e Hélio a milhares de Kelvins',
        color: '#ec4899',
        description: 'Proto-galáxias compactas e irregulares captadas pelas câmeras de infravermelho profundo NIRCam do JWST.',
      },
      {
        name: 'Época da Reionização Cósmica',
        depthKm: 'Transição global do universo observável de neutro para ionizado',
        composition: 'Bolhas crescentes de gás hidrogênio ionizado por fótons ultravioleta energéticos',
        temperature: '10.000 K',
        color: '#f43f5e',
        description: 'A era cósmica onde o universo emergiu das "Idades das Trevas" (Dark Ages) e se tornou transparente à luz.',
      },
      {
        name: 'Fundo Cósmico de Micro-ondas e Estrutura em Teia Cósmica',
        depthKm: 'z = 1.100 (Borda observável do cosmos a 46,5 bilhões de anos-luz de distância comóvel)',
        composition: 'Radiação fóssil primordial do Big Bang',
        temperature: '2.725 K (Frio absoluto da radiação de fundo)',
        color: '#7c3aed',
        description: 'A primeira luz que viajou livremente pelo cosmos 380.000 anos após o Big Bang.',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 0,
      orbitalVelocityKmS: 299792.0,
      periapsisDistance: 'Fronteira Cósmica: z > 13',
      apoapsisDistance: 'Universo Observável: z ≈ 1.100',
    },
    aerospace: {
      surfaceGravityMS2: 0,
      surfacePressureBar: 0,
      scaleHeightKm: 1e20,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 0,
      surfaceLandingDeltaVKmS: 0,
      entryVelocityKmS: 0,
      aerobrakingFeasible: false,
      flightNotes: 'Representa a fronteira última da ótica humana. Observar esse campo é viajar 13,4 bilhões de anos no passado, olhando para o início de tudo o que existe no cosmos.',
    },
    didactic: {
      whatIsIt: 'O Campo Ultra-Profundo é a fotografia mais profunda e distante do universo já capturada pelos telescópios espaciais Hubble e James Webb.',
      everydayAnalogy: 'Imagine segurar um único grão de areia na ponta do dedo com o braço estendido contra o céu escuro: esse pedacinho minúsculo continha mais de 10.000 galáxias inteiras escondidas!',
      ifYouWereThere: 'Você estaria no início do próprio tempo: não veria estrelas isoladas, mas sim milhares de galáxias jovens recém-nascidas colidindo e se formando em um universo muito menor, mais quente e mais denso.',
      howToReachIt: 'É uma viagem no tempo! Como a luz viaja a uma velocidade finita, olhar para o objeto mais distante é enxergar como ele era quando o universo era um recém-nascido.',
      funFacts: [
        'Ao apontar para uma região do céu aparentemente 100% escura e vazia por semanas, os telescópios revelaram milhares de galáxias empilhadas até a borda do universo.',
        'O JWST descobriu galáxias gigantescas formadas apenas 300 milhões de anos após o Big Bang, surpreendendo os cientistas com a rapidez com que o cosmos começou a criar estrelas.',
        'Cada pontinho brilhante nessa imagem não é uma estrela, mas uma galáxia inteira contendo centenas de bilhões de sóis e mundos.',
      ],
    },
    technical: {
      formalDefinition: 'Campo profundo extragaláctico multiespectral (JADES / HUDF) mapeando a Época da Reionização a alto desvio para o vermelho cosmológico (z > 10 a 14.3) com fotometria e espectroscopia de quebra de Lyman.',
      primaryEquations: [
        {
          label: 'Desvio para o Vermelho Cosmológico (Fator de Escala)',
          formula: '1 + z = \\frac{a_0}{a(t)} = \\frac{\\lambda_{\\text{obs}}}{\\lambda_{\\text{emit}}} \\implies \\lambda_{\\text{obs}} = \\lambda_{\\text{emit}} (1 + z)',
          desc: 'A luz ultravioleta emitida no início do universo foi esticada pela expansão do espaço para o infravermelho captado pelo JWST.',
        },
        {
          label: 'Tempo de Olhar para Trás (Lookback Time no Modelo Lambda-CDM)',
          formula: 't_L = \\int_0^z \\frac{dz\'}{(1+z\') H_0 \\sqrt{\\Omega_m (1+z\')^3 + \\Omega_\\Lambda}} \\approx 13.4\\text{ bilhões de anos (para } z = 13.2\\text{)}',
          desc: 'Determina a idade exata do universo quando os fótons foram emitidos.',
        },
      ],
      fieldEquationsDesc: 'Equações de Friedmann na métrica FLRW com densidade de energia dominada por Matéria Escura (Ω_m = 0.315) e Energia Escura (Ω_Λ = 0.685).',
      thermodynamics: 'Resfriamento adiabático cósmico T(z) = T_0 (1 + z) com T_0 = 2.7255 K da radiação cósmica de fundo.',
      radiationRegime: 'Detecção de quebra de Lyman e salto de Balmer com espectrografia de fenda com microobturadores (Microshutter Array do NIRSpec).',
    },
  },

  // =========================================================================
  // 33. GALÁXIA DO REDEMOINHO (M51 / NGC 5194)
  // =========================================================================
  m51_whirlpool: {
    geology: [
      {
        name: 'Braços Espirais "Grand Design" de M51',
        depthKm: 'Diâmetro de 76.000 anos-luz (massa de ~1,6 × 10¹¹ M☉)',
        composition: 'Braços de poeira fria e gás hidrogênio molecular pontilhados por centenas de berçários estelares cor-de-rosa',
        temperature: '2.725 K',
        color: '#ec4899',
        description: 'Braços perfeitamente simétricos e esculpidos por ondas de densidade gravitacionais potencializadas pela passagem da galáxia companheira.',
      },
      {
        name: 'Galáxia Companheira Menor NGC 5195',
        depthKm: 'Galáxia anã lenticular passando atrás de M51',
        composition: 'Estrelas amarelas velhas e ricas em metais',
        temperature: 'Centenas de Kelvins',
        color: '#f59e0b',
        description: 'Galáxia menor conectada a M51 por uma ponte colossal de maré gravitacional de estrelas e poeira.',
      },
      {
        name: 'Núcleo Ativo Seyfert com Buraco Negro Supermassivo',
        depthKm: 'Centro galáctico com anel de poeira cruzado em forma de "X"',
        composition: 'Buraco negro central de ~20 milhões de massas solares em acreção ativa',
        temperature: 'Milhões de Kelvins',
        color: '#38bdf8',
        description: 'Gera jatos de plasma compactos detectados em ondas de rádio pelo Very Large Array (VLA).',
      },
    ],
    keplerian: {
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 20.0,
      orbitalVelocityKmS: 463.0,
      periapsisDistance: 'Distância: 23.5 Milhões de Anos-Luz (7.2 Mpc)',
      apoapsisDistance: 'Distância: 23.5 Milhões de Anos-Luz (7.2 Mpc)',
    },
    aerospace: {
      surfaceGravityMS2: 0,
      surfacePressureBar: 0,
      scaleHeightKm: 1e16,
      hasAtmosphere: false,
      lowOrbitInsertionDeltaVKmS: 210.0,
      surfaceLandingDeltaVKmS: 0,
      entryVelocityKmS: 450.0,
      aerobrakingFeasible: false,
      flightNotes: 'Sua orientação quase perfeitamente voltada de frente para a Terra ("face-on") permite estudar a estrutura interna dos braços espirais e das ondas de densidade com máxima clareza.',
    },
    didactic: {
      whatIsIt: 'A Galáxia do Redemoinho (M51) é o exemplo mais perfeito de uma galáxia espiral no universo: um turbilhão espetacular de estrelas dançando com uma galáxia companheira.',
      everydayAnalogy: 'É como duas dançarinas de valsa no salão: a galáxia maior rodopia enquanto a menor passa por trás dela puxando seus braços em um redemoinho cósmico!',
      ifYouWereThere: 'Você veria uma espiral perfeita de braços luminosos repletos de aglomerados de estrelas bebês cor-de-rosa recém-nascidas cortando o céu.',
      howToReachIt: 'Localizada a 23,5 milhões de anos-luz na constelação de Cães de Caça (Canes Venatici), foi a primeira galáxia onde a estrutura espiral foi identificada na história, em 1845.',
      funFacts: [
        'Foi a primeira galáxia da história em que os astrônomos conseguiram enxergar os braços em espiral, usando o telescópio "Leviatã de Parsonstown" na Irlanda em 1845.',
        'Os nós brilhantes cor-de-rosa ao longo dos braços são berçários estelares gigantes onde milhares de estrelas estão nascendo ao mesmo tempo.',
        'A galáxia menor amarela na ponta de um dos braços (NGC 5195) passou raspando por M51 há algumas centenas de milhões de anos, ativando as ondas que criaram os braços perfeitos.',
      ],
    },
    technical: {
      formalDefinition: 'Galáxia espiral interativa de grande desenho (Grand Design Spiral) de tipo SA(s)bc pec em par de interação gravitacional com NGC 5195, exibindo ondas de choque de densidade de Lin-Shu.',
      primaryEquations: [
        {
          label: 'Teoria da Onda de Densidade Espiral de Lin-Shu',
          formula: '(\\Omega(r) - \\Omega_p)^2 = \\kappa^2 - 2\\pi G \\Sigma |k| + v_s^2 k^2',
          desc: 'Os braços espirais não são estruturas rígidas de matéria, mas sim ondas de compressão de densidade através das quais o gás e as estrelas entram e saem.',
        },
        {
          label: 'Força de Maré Interativa M51-NGC 5195',
          formula: '\\mathbf{F}_{\\text{maré}} = -G M_{\\text{comp}} \\left[ \\frac{\\mathbf{r} - \\mathbf{d}}{|\\mathbf{r} - \\mathbf{d}|^3} + \\frac{\\mathbf{d}}{d^3} \\right]',
          desc: 'Perturbação de maré ressonante que amplificou a espiralidade simétrica de dois braços principais.',
        },
      ],
      fieldEquationsDesc: 'Simulação hidrodinâmica com acoplamento gravitacional perturbativo de encontro hiperbólico em disco fino.',
      thermodynamics: 'Compressão do meio interestelar molecular ao entrar na crista da onda de densidade, reduzindo o tempo de resfriamento e ativando a lei de Schmidt-Kennicutt.',
      radiationRegime: 'Mapeamento em infravermelho de alta resolução com instrumentos MIRI e NIRCam do JWST revelando a intrincada rede de filamentos de gás quente e teias de poeira.',
    },
  },
};

/**
 * Função utilitária para obter os detalhes científicos e didáticos de um corpo celeste.
 * Mapeia aliases conhecidos e garante dados de altíssima fidelidade.
 */
export function getBodyDetails(id: string): BodyDetails {
  const normalizedId = id === 'proxima' ? 'proxima-centauri'
    : id === 'cygnus_x1' ? 'cygnus-x1'
    : id;

  if (CELESTIAL_BODY_DETAILS[normalizedId]) {
    return CELESTIAL_BODY_DETAILS[normalizedId];
  }

  // Fallback seguro caso um ID não mapeado seja fornecido
  return CELESTIAL_BODY_DETAILS['sol'];
}
