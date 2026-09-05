/**
 * nasaCosmologyData.ts
 *
 * Dossiê Cosmológico da NASA e Grandes Observatórios Espaciais.
 * Apresenta a Linha do Tempo das Grandes Épocas do Universo,
 * telemetria dos telescópios (JWST, Hubble, Planck, Chandra)
 * e dados astronômicos verificados de lentes gravitacionais e exoplanetas.
 */

export interface CosmologicalEpoch {
  id: string;
  name: string;
  timeRange: string;
  redshiftRange: string;
  temperature: string;
  descriptionDidactic: string;
  descriptionTechnical: string;
  primaryPhysics: string;
  keyPhenomenon: string;
  formula?: string;
  formulaLabel?: string;
  nasaMissionRef: string;
  color: string;
}

export interface NasaObservatory {
  id: string;
  name: string;
  acronym: string;
  launchDate: string;
  orbitType: string;
  wavelength: string;
  primaryMirror: string;
  missionStatus: string;
  highlightDiscovery: string;
  technicalTelemetry: {
    distanceFromEarth: string;
    operatingTemp: string;
    fieldOfView: string;
    resolutionArcsec: string;
  };
  featuredTarget: string;
  color: string;
}

export const COSMOLOGICAL_EPOCHS: CosmologicalEpoch[] = [
  {
    id: 'planck_era',
    name: '01 // Era de Planck',
    timeRange: '0 a 10⁻⁴³ segundos',
    redshiftRange: 'z → ∞',
    temperature: '> 10³² Kelvin (Temperatura de Planck)',
    descriptionDidactic:
      'O primeiro instante absoluto de existência. O universo inteiro estava concentrado em um espaço infinitamente menor que a cabeça de um alfinete. Aqui, as 4 forças da natureza (gravidade, eletromagnetismo e forças nucleares) eram uma só força unificada.',
    descriptionTechnical:
      'Domínio da Gravitação Quântica e supersimetria em escala de Planck. As flutuações quânticas da geometria do espaço-tempo tornam a métrica suave de Einstein inaplicável devido à formação de espuma quântica (Spacetime Foam). Densidade $\\rho_P = c^5 / (\\hbar G^2) \\approx 5.15 \\times 10^{96} \\text{ kg/m}^3$.',
    primaryPhysics: 'Unificação Gravito-Quântica (Teoria das Supercordas 11D / Gravidade Quântica em Loop)',
    keyPhenomenon: 'Singularidade Inicial e Espuma Quântica de Espaço-Tempo',
    formula: 't_P = \\sqrt{\\frac{\\hbar G}{c^5}} \\approx 5.391 \\times 10^{-44} \\text{ s}, \\quad \\ell_P = \\sqrt{\\frac{\\hbar G}{c^3}} \\approx 1.616 \\times 10^{-35} \\text{ m}',
    formulaLabel: 'Tempo e Comprimento Fundamentais de Planck',
    nasaMissionRef: 'Pesquisa Teórica NASA Goddard / Fermilab Quantum Labs',
    color: '#a855f7',
  },
  {
    id: 'inflation_era',
    name: '02 // Inflação Cósmica Primordial',
    timeRange: '10⁻³⁶ a 10⁻³² segundos',
    redshiftRange: 'z ≈ 10²⁶',
    temperature: '10²⁷ K resfriando bruscamente',
    descriptionDidactic:
      'Uma fração de segundo após o início, o universo passou por um surto de crescimento inacreditável: expandiu-se mais rápido que a luz, aumentando de tamanho por um fator de 10²⁶! Isso alisou o cosmos como um lençol e gerou as sementes onde galáxias e estrelas nasceriam.',
    descriptionTechnical:
      'Fase de expansão quase-de Sitter superluminal induzida pela densidade de energia de vácuo do campo escalar do inflaton $\\phi$. Resolve simultaneamente o Problema do Horizonte Causal e da Planura (Flatness), gerando flutuações quânticas que se esticaram em perturbações de densidade adiabáticas quase invariantes de escala.',
    primaryPhysics: 'Quebra espontânea de simetria GUT e potencial de campo inflaton $V(\\phi)$',
    keyPhenomenon: 'Amplificação de flutuações quânticas em sementes de superaglomerados galácticos',
    formula: 'a(t) = a_0 \\exp(H_{inf} t), \\quad \\mathcal{P}_\\mathcal{R}(k) = A_s \\left(\\frac{k}{k_*}\\right)^{n_s - 1} \\quad (n_s \\approx 0.965)',
    formulaLabel: 'Fator de Escala Inflacionário e Espectro de Potência Primitivo',
    nasaMissionRef: 'Sondas NASA COBE, WMAP e Experimento SPHEREx',
    color: '#00e5ff',
  },
  {
    id: 'nucleosynthesis_era',
    name: '03 // Nucleossíntese Primordial (BBN)',
    timeRange: '10 segundos a 20 minutos',
    redshiftRange: 'z ≈ 10⁸ a 10⁷',
    temperature: '1 bilhão a 10 milhões de Kelvin',
    descriptionDidactic:
      'O universo agora era um reator de fusão nuclear cósmico gigante. Prótons e nêutrons colidiram para fundir os primeiros núcleos atômicos: 75% Hidrogênio, 25% Hélio e uma pitada de Lítio. Todos os átomos de hidrogênio da água que você bebe foram fabricados nesses 20 minutos!',
    descriptionTechnical:
      'Quando a taxa de expansão de Hubble superou a taxa das reações fracas de conversão próton-nêutron ($n + \\nu_e \\leftrightarrow p + e^-$), a razão nêutron-próton congelou em $n/p \\approx 1/7$. A captura radiativa subsequente fundiu quase todos os nêutrons em núcleos de $^{4}\\text{He}$, com traços de Deutério ($^2\\text{H}$) e Lítio-7.',
    primaryPhysics: 'Termodinâmica Nuclear em Expansão e Cinética de Reações Fracas',
    keyPhenomenon: 'Congelamento (Freeze-out) da proporção de Hidrogênio e Hélio Primordiais',
    formula: 'Y_p = \\frac{4 n_\\alpha}{n_p + n_n} = \\frac{2(n/p)}{1 + (n/p)} \\approx 0.245 \\pm 0.003',
    formulaLabel: 'Fração de Massa do Hélio Primordial (BBN)',
    nasaMissionRef: 'Espectroscopia de Quasares NASA Keck / Hubble COS',
    color: '#eab308',
  },
  {
    id: 'recombination_cmb',
    name: '04 // Recombinação & Emissão do CMB',
    timeRange: '380.000 anos após o Big Bang',
    redshiftRange: 'z ≈ 1.100',
    temperature: '3.000 K (hoje resfriado para 2,725 K)',
    descriptionDidactic:
      'Antes dessa época, o universo era uma névoa opaca e brilhante de plasma. Quando esfriou para 3.000 °C, os elétrons finalmente se uniram aos prótons para formar os primeiros átomos neutros. De repente, a luz pôde viajar livre pelo espaço! Essa primeira luz viaja até nós hoje como a Radiação Cósmica de Fundo.',
    descriptionTechnical:
      'Desacoplamento fóton-bárion (Superfície de Último Espalhamento). A profundidade óptica para espalhamento Thomson caiu abruptamente para $\\tau < 1$. Os fótons livres mantiveram uma distribuição de corpo negro perfeita de Planck, sofrendo redshift cosmológico contínuo por um fator de $1+z = 1101$, atingindo hoje $\\lambda_{max} \\approx 1.06 \\text{ mm}$ no espectro de micro-ondas.',
    primaryPhysics: 'Equação de Ionização de Saha e Desacoplamento da Radiação Thomson',
    keyPhenomenon: 'O universo torna-se opticamente transparente; criação do Fundo Cósmico de Micro-ondas',
    formula: 'T_{CMB}(z) = T_0 (1 + z) = 2.7255 \\text{ K} \\times (1 + z), \\quad I(\\nu, T) = \\frac{2h\\nu^3}{c^2}\\frac{1}{e^{h\\nu/k_BT}-1}',
    formulaLabel: 'Lei de Radiação de Corpo Negro de Planck e Resfriamento do CMB',
    nasaMissionRef: 'Mapeador WMAP da NASA e Satélite Planck da ESA/NASA',
    color: '#f97316',
  },
  {
    id: 'dark_ages_and_jwst',
    name: '05 // Idade das Trevas e Alvorecer Cósmico',
    timeRange: '100 a 400 milhões de anos',
    redshiftRange: 'z ≈ 30 a 10',
    temperature: '60 K a 20 K',
    descriptionDidactic:
      'Durante centenas de milhões de anos não existia nenhuma estrela: apenas gás de hidrogênio e escuridão silenciosa. Então, a gravidade juntou nuvens colossais de gás e acendeu as Primeiras Estrelas (estrelas monstruosas da População III) e as primeiras protogaláxias, iluminando o cosmos pela primeira vez.',
    descriptionTechnical:
      'Colapso gravitacional de halos de matéria escura de Jeans $M > M_J$ no regime não linear. Formação das estrelas de População III de metalicidade zero ($Z=0$), gerando intensa radiação ultravioleta no contínuo de Lyman que reionizou o hidrogênio intergaláctico neutro (Época da Reionização, EoR).',
    primaryPhysics: 'Instabilidade de Jeans Barion-Matéria Escura e Reionização de Lyman',
    keyPhenomenon: 'Nascimento das primeiras estrelas hipermassivas e primeiras galáxias detectadas pelo JWST',
    formula: 'M_J = \\frac{\\pi}{6} \\rho \\lambda_J^3 = \\frac{\\pi}{6} \\left(\\frac{\\pi k_B T}{G \\mu m_H}\\right)^{3/2} \\rho^{-1/2}',
    formulaLabel: 'Massa Crítica de Jeans para Colapso Gravitacional',
    nasaMissionRef: 'Telescópio Espacial James Webb (JWST NIRCam / MIRI)',
    color: '#38bdf8',
  },
  {
    id: 'dark_energy_acceleration',
    name: '06 // Domínio da Energia Escura & Era Atual',
    timeRange: '9 bilhões de anos até Hoje (13,8 Ga)',
    redshiftRange: 'z ≈ 0.6 a 0',
    temperature: '2,725 K',
    descriptionDidactic:
      'Há cerca de 5 bilhões de anos, quando o nosso Sistema Solar estava se formando, algo inesperado aconteceu: a gravidade mútua das galáxias começou a perder força para a Energia Escura, e o universo passou a acelerar sua expansão para sempre.',
    descriptionTechnical:
      'Transição de desaceleração para aceleração cósmica no redshift $z_{trans} \\approx 0.65$. A densidade de matéria $\\rho_m \\propto a^{-3}$ decaiu abaixo da densidade constante de energia de vácuo $\\rho_\\Lambda$, tornando o parâmetro de desaceleração negativo: $q_0 = \\frac{\\Omega_m}{2} - \\Omega_\\Lambda < 0$.',
    primaryPhysics: 'Dinâmica de Friedmann com Constante Cosmológica Positiva (Universo $\\Lambda$CDM)',
    keyPhenomenon: 'Aceleração da expansão do espaço e isolamento de superaglomerados galácticos',
    formula: 'H(z) = H_0 \\sqrt{\\Omega_m (1+z)^3 + \\Omega_r (1+z)^4 + \\Omega_\\Lambda}, \\quad q(z) = \\frac{\\Omega_m(1+z)^3 - 2\\Omega_\\Lambda}{2[\\Omega_m(1+z)^3 + \\Omega_\\Lambda]}',
    formulaLabel: 'Equação de Expansão de Friedmann e Parâmetro de Aceleração $q(z)$',
    nasaMissionRef: 'Telescópio Espacial Nancy Grace Roman / Supernova Cosmology Project',
    color: '#22c55e',
  },
  {
    id: 'cosmic_destiny_freeze',
    name: '07 // Destino Cósmico: O Grande Congelamento',
    timeRange: '10¹⁴ a 10¹⁰⁰ anos no Futuro',
    redshiftRange: 'z → -1 (Horizonte de De Sitter)',
    temperature: '0.00000000001 K → Zero Absoluto',
    descriptionDidactic:
      'Em centenas de trilhões de anos, as últimas estrelas anãs vermelhas queimarão seu combustível e se apagarão. Restarão apenas buracos negros, anãs brancas e estrelas de nêutrons. Após 10¹⁰⁰ anos, até os buracos negros evaporarão por radiação Hawking, deixando apenas um mar silencioso de fótons frios.',
    descriptionTechnical:
      'Morte Térmica (Heat Death) e Era dos Buracos Negros. As eras cosmológicas de Adams & Laughlin (1997): Era Degenerada ($10^{14}-10^{40}$ anos com decaimento de prótons via GUT $\\tau_p \\sim 10^{34}$ anos), Era dos Buracos Negros ($10^{40}-10^{100}$ anos onde buracos negros supermassivos evaporam via termodinâmica de Hawking) e Era Escura ($> 10^{100}$ anos com entropia máxima $S_{max}$).',
    primaryPhysics: 'Segunda Lei da Termodinâmica Cósmica e Evaporação de Hawking em Escala Eônica',
    keyPhenomenon: 'Evaporação de singularidades e maximização da entropia universal',
    formula: '\\tau_{evap} = \\frac{5120 \\pi G^2 M^3}{\\hbar c^4} \\approx 2.1 \\times 10^{67} \\left(\\frac{M}{M_\\odot}\\right)^3 \\text{ anos}',
    formulaLabel: 'Tempo de Vida de Evaporação Hawking de Buraco Negro',
    nasaMissionRef: 'Modelagem Teórica NASA Astrophysics Data System (ADS)',
    color: '#ec4899',
  },
];

export const NASA_OBSERVATORIES: NasaObservatory[] = [
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    acronym: 'JWST',
    launchDate: '25 de Dezembro de 2021',
    orbitType: 'Halo em torno do Ponto Lagrangiano Terra-Sol L2 (1.500.000 km)',
    wavelength: 'Infravermelho Próximo e Médio (0,6 a 28,5 μm)',
    primaryMirror: '6,5 metros (18 segmentos hexagonais de berílio folheados a ouro)',
    missionStatus: 'OPERACIONAL // 100% NOMINAL',
    highlightDiscovery:
      'Detecção de galáxias primitivas a z > 13 formadas há apenas 300 milhões de anos após o Big Bang (JADES-GS-z14-0) e água em discos protoplanetários.',
    technicalTelemetry: {
      distanceFromEarth: '1.512.400 km',
      operatingTemp: '7 K (-266 °C no MIRI criogênico)',
      fieldOfView: '9,7 minutos de arco²',
      resolutionArcsec: '0,07 arcsegundos a 2 μm',
    },
    featuredTarget: 'Aglomerado SMACS 0723 e Nebulosa de Carina',
    color: '#eab308',
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    acronym: 'HST',
    launchDate: '24 de Abril de 1990',
    orbitType: 'Órbita Terrestre Baixa (LEO a 540 km de altitude, inclinação 28,5°)',
    wavelength: 'Ultravioleta, Visível e Infravermelho Próximo (115 a 2.500 nm)',
    primaryMirror: '2,4 metros (Vidro ULE com revestimento de alumínio e fluoreto de magnésio)',
    missionStatus: 'OPERACIONAL // 34 ANOS EM SERVIÇO',
    highlightDiscovery:
      'Cálculo preciso da Taxa de Expansão do Universo (Constante de Hubble $H_0$), comprovação da existência de buracos negros supermassivos em galáxias e Hubble Ultra Deep Field.',
    technicalTelemetry: {
      distanceFromEarth: '538 km',
      operatingTemp: '20 °C (ambiente controlado internamente)',
      fieldOfView: '202 x 202 segundos de arco (WFC3)',
      resolutionArcsec: '0,05 arcsegundos',
    },
    featuredTarget: 'Pilares da Criação (M16) e Campo Ultra-Profundo',
    color: '#00e5ff',
  },
  {
    id: 'planck',
    name: 'Planck Satellite & WMAP',
    acronym: 'PLANCK / WMAP',
    launchDate: '14 de Maio de 2009 (Planck) / 30 de Junho de 2001 (WMAP)',
    orbitType: 'Lissajous no Ponto L2 Terra-Sol',
    wavelength: 'Micro-ondas e Submilimétrico (30 GHz a 857 GHz / 350 μm a 1 cm)',
    primaryMirror: '1,5 x 1,9 metros (Telescópio Gregoriano fora do eixo)',
    missionStatus: 'MISSÃO CONCLUÍDA COM SUCESSO (Catálogo Definitivo de Cosmologia)',
    highlightDiscovery:
      'Medição da idade exata do universo em 13,787 ± 0,020 bilhões de anos e determinação da composição: 68,3% Energia Escura, 26,8% Matéria Escura, 4,9% Matéria Bariônica.',
    technicalTelemetry: {
      distanceFromEarth: '1.500.000 km',
      operatingTemp: '0,1 Kelvin (-273,05 °C, o objeto mais frio do universo feito pelo homem)',
      fieldOfView: 'Todo o céu (Full Sky Survey 4π)',
      resolutionArcsec: '5 minutos de arco a 857 GHz',
    },
    featuredTarget: 'Mapa Completo da Radiação Cósmica de Fundo (CMB)',
    color: '#f97316',
  },
  {
    id: 'chandra',
    name: 'Chandra X-ray Observatory',
    acronym: 'CXO',
    launchDate: '23 de Julho de 1999',
    orbitType: 'Órbita Terrestre Altamente Elíptica (HEO: 14.000 a 133.000 km)',
    wavelength: 'Raios-X de Alta Energia (0,1 a 10 keV / 0,12 a 12 nm)',
    primaryMirror: '1,2 metros (4 pares de espelhos parabólicos e hiperbólicos de Wolter Tipo I)',
    missionStatus: 'OPERACIONAL // 25 ANOS EM SERVIÇO',
    highlightDiscovery:
      'Primeira evidência direta de matéria escura através da separação de massa de gás no Aglomerado da Bala (Bullet Cluster) e observação dos jatos relativísticos de Sagittarius A*.',
    technicalTelemetry: {
      distanceFromEarth: '133.000 km (apogeu)',
      operatingTemp: '-120 °C (detectores ACIS CCD)',
      fieldOfView: '17 x 17 minutos de arco',
      resolutionArcsec: '0,49 arcsegundos (Recorde em Raios-X)',
    },
    featuredTarget: 'Aglomerado da Bala (Bullet Cluster) e Pulsar do Caranguejo',
    color: '#a855f7',
  },
  {
    id: 'voyager1',
    name: 'Sonda Interestelar Voyager 1',
    acronym: 'VOYAGER 1',
    launchDate: '5 de Setembro de 1977',
    orbitType: 'Trajetória Hiperbólica de Escape Solar (Espaço Interestelar)',
    wavelength: 'Ondas de Rádio Banda X e S / Magnetometria / Detector de Raios Cósmicos',
    primaryMirror: 'Antena Parabólica de Alto Ganho de 3,7 metros de diâmetro',
    missionStatus: 'OPERACIONAL // OBJETO HUMANO MAIS DISTANTE DA HISTÓRIA',
    highlightDiscovery:
      'Travessia da Heliopausa em 25 de Agosto de 2012, entrando oficialmente no meio interestelar puro a mais de 120 Unidades Astronômicas da Terra.',
    technicalTelemetry: {
      distanceFromEarth: '24,5 bilhões de km (163,8 AU)',
      operatingTemp: '-240 °C (alimentado por geradores RTG de Plutônio-238)',
      fieldOfView: 'Omnidirecional de campo magnético e plasma',
      resolutionArcsec: 'Velocidade de escape: 16,9 km/s (61.000 km/h)',
    },
    featuredTarget: 'Heliopausa e Meio Interestelar da Via Láctea',
    color: '#10b981',
  },
];

export const NASA_DEEP_FIELD_TARGETS = [
  {
    id: 'smacs0723',
    name: 'Lente Gravitacional de SMACS 0723 (JWST First Deep Field)',
    constellation: 'Volans (Peixe Voador)',
    distance: '4,6 bilhões de anos-luz (aglomerado) / até 13,1 bilhões de anos-luz (arcos de fundo)',
    description:
      'Uma área do céu do tamanho de um grão de areia segurado com o braço esticado. A massa colossal do aglomerado curva o tecido do espaço-tempo como uma lente de aumento natural, amplificando e distorcendo a luz de galáxias remotas que existiram no início do universo.',
    imageUrl: '/celestial/jwst_smacs0723.jpg',
    scientificFact: 'Deformação geométrica de lente gravitacional forte com amplificação de até 20x pelo anel de Einstein.',
  },
  {
    id: 'hudf',
    name: 'Hubble Ultra Deep Field (HUDF)',
    constellation: 'Fornax (Fornalha)',
    distance: 'Até 13 bilhões de anos-luz',
    description:
      'Apontado para um pedaço de céu aparentemente vazio e completamente escuro durante 11 dias de exposição acumulada, o Hubble revelou quase 10.000 galáxias completas, cada uma contendo centenas de bilhões de estrelas.',
    imageUrl: '/celestial/hubble_deep_field.jpg',
    scientificFact: 'Evidência definitiva de que o universo observável contém mais de 2 trilhões de galáxias.',
  },
  {
    id: 'trappist1',
    name: 'Sistema Planetário TRAPPIST-1 (NASA Spitzer/JWST)',
    constellation: 'Aquarius (Aquário)',
    distance: '39,46 anos-luz da Terra',
    description:
      'Uma estrela anã vermelha ultra-fria cercada por 7 planetas rochosos de tamanho similar à Terra, três dos quais (TRAPPIST-1e, f e g) orbitam na Zona Habitável, onde a água pode se manter líquida.',
    imageUrl: '/celestial/trappist1_system.jpg',
    scientificFact: 'Ressonância orbital complexa em cadeia de Laplace (24:15:9:6:4:3:2) indicando migração suave de formação.',
  },
];
