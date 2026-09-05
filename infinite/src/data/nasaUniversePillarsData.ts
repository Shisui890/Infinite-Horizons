/**
 * nasaUniversePillarsData.ts
 *
 * Dados oficiais dos 8 Grandes Pilares de "The Universe" da NASA Science
 * (https://science.nasa.gov/universe/)
 *
 * Pilares:
 * 1. Exoplanets (Exoplanetas)
 * 2. The Search for Life in the Universe (A Busca por Vida no Universo)
 * 3. Stars (Estrelas & Ciclo Estelar)
 * 4. Galaxies (Galáxias & Estrutura Cósmica)
 * 5. Black Holes (Buracos Negros & Singularidades)
 * 6. The Big Bang (O Big Bang & Cosmologia Primordial)
 * 7. Dark Energy (Energia Escura & Aceleração Cósmica)
 * 8. Dark Matter (Matéria Escura & Halo Gravitacional)
 */

export interface NasaUniversePillar {
  id: string;
  titleEn: string;
  titlePt: string;
  tagline: string;
  nasaUrl: string;
  badge: string;
  color: string;
  summaryDidactic: string;
  summaryTechnical: string;
  keyStats: {
    label: string;
    value: string;
    subtext: string;
  }[];
  keyMissions: {
    name: string;
    role: string;
    status: 'Ativa' | 'Futura' | 'Legado';
  }[];
  coreDiscoveries: string[];
  formula?: {
    latex: string;
    label: string;
    explanation: string;
  };
  nasaDirectorateQuote: string;
}

export const NASA_UNIVERSE_PILLARS: NasaUniversePillar[] = [
  {
    id: 'exoplanets',
    titleEn: 'Exoplanets',
    titlePt: 'Exoplanetas',
    tagline: 'Mundos fascinantes orbitando estrelas distantes além do nosso Sistema Solar',
    nasaUrl: 'https://science.nasa.gov/universe/exoplanets/',
    badge: 'CENSO PLANETÁRIO // NASA ARCHIVE',
    color: '#00e5ff',
    summaryDidactic:
      'Até o início dos anos 1990, não sabíamos se existiam planetas ao redor de outras estrelas. Hoje, telescópios espaciais da NASA já confirmaram mais de 5.700 exoplanetas em nossa galáxia! Encontramos desde gigantes gasosos mais quentes que ferro fundido até mundos rochosos do tamanho da Terra na Zona Habitável, onde água líquida pode existir.',
    summaryTechnical:
      'Estudo da formação, arquitetura orbital e caracterização atmosférica de planetas extrassolares. Métodos primários de detecção incluem Fotometria de Trânsito ($\Delta F / F$), Velocidade Radial Espectroscópica via efeito Doppler, Microlenteamento Gravitacional e Coronagrafia de Imagem Direta de alto contraste.',
    keyStats: [
      { label: 'Planetas Confirmados', value: '5.700+', subtext: 'Catalogados no NASA Exoplanet Archive' },
      { label: 'Sistemas Planetários', value: '4.200+', subtext: 'Estrelas com múltiplos mundos em órbita' },
      { label: 'Candidatos em Análise', value: '10.000+', subtext: 'Identificados por TESS e Kepler' },
      { label: 'Exoplanetas Terrestres', value: '200+', subtext: 'Mundos rochosos com raio similar ao terrestre' },
    ],
    keyMissions: [
      { name: 'TESS (Transiting Exoplanet Survey Satellite)', role: 'Varredura de 85% do céu em busca de trânsitos próximos', status: 'Ativa' },
      { name: 'James Webb Space Telescope (JWST)', role: 'Espectroscopia de transmissão e busca de vapor de água e CO₂', status: 'Ativa' },
      { name: 'Nancy Grace Roman Space Telescope', role: 'Censo microlente e coronógrafo para imagens diretas', status: 'Futura' },
      { name: 'Kepler Space Telescope', role: 'Missão pioneira que provou que planetas superam estrelas', status: 'Legado' },
    ],
    coreDiscoveries: [
      'Confirmação do sistema TRAPPIST-1 com 7 planetas rochosos em órbita de uma anã vermelha.',
      'Detecção de dióxido de carbono, água e nuvens de silicatos na atmosfera de gigantes gasosos via JWST.',
      'Descoberta de classes planetárias inexistentes no Sistema Solar: Superterras e Mini-Netunos.',
      'Identificação de planetas circumbinários (que orbitam dois sóis ao mesmo tempo, como Tatooine).',
    ],
    formula: {
      latex: '\\frac{\\Delta F}{F} \\approx \\left( \\frac{R_p}{R_*} \\right)^2, \\quad T_{eq} = T_* \\left( \\frac{R_*}{2a} \\right)^{1/2} (1 - A_B)^{1/4}',
      label: 'Profundidade do Trânsito Fotométrico e Temperatura de Equilíbrio Planetária',
      explanation: 'Determina a fração de luz estelar bloqueada pelo raio do planeta ($R_p$) e estima a temperatura superficial considerando o albedo de Bond ($A_B$).',
    },
    nasaDirectorateQuote:
      '"Nossa busca por exoplanetas nos ensinou que os planetas são a regra, não a exceção, no cosmos." — NASA Astrophysics Division',
  },
  {
    id: 'search-for-life',
    titleEn: 'The Search for Life in the Universe',
    titlePt: 'A Busca por Vida no Universo',
    tagline: 'A investigação mais profunda da humanidade: Estamos sozinhos no cosmos?',
    nasaUrl: 'https://science.nasa.gov/universe/exoplanets/the-search-for-life/',
    badge: 'ASTROBIOLOGIA // HABITABILIDADE',
    color: '#10b981',
    summaryDidactic:
      'A NASA utiliza astrobiologia para rastrear os ingredientes fundamentais da vida: água líquida, fontes de energia estáveis e elementos orgânicos (carbono, hidrogênio, nitrogênio, oxigênio, fósforo e enxofre). Essa busca estende-se desde oceanos subsuperficiais sob as luas de gelo de Júpiter e Saturno até as atmosferas de mundos orbitando sóis a centenas de anos-luz.',
    summaryTechnical:
      'Investigação de bioassinaturas espectrais atmosféricas em desequilíbrio termodinâmico químico (coexistência de $CH_4$ e $O_2$/$O_3$). Avaliação de ambientes extremos por meio de análogos terrestres, modelagem de radiação estelar UV/raios-X e missões in situ em corpos gelados com plumas hidrotérmicas.',
    keyStats: [
      { label: 'Oceanos em Luas Geladas', value: 'Europa & Encélado', subtext: 'Mais água líquida que todos os oceanos da Terra' },
      { label: 'Bioassinaturas Alvo', value: 'CH₄, H₂O, O₃, CO₂', subtext: 'Moléculas indicativas de atividade biológica' },
      { label: 'Exoplanetas na Zona Habitável', value: '60+', subtext: 'Orbitam na distância correta para água líquida' },
      { label: 'Sensibilidade Espectroscópica', value: '< 10 ppm', subtext: 'Capacidade do NIRSpec do JWST' },
    ],
    keyMissions: [
      { name: 'Europa Clipper', role: 'Sonda enviada a Júpiter para analisar o oceano subterrâneo de Europa', status: 'Ativa' },
      { name: 'Dragonfly', role: 'Drone octocóptero autônomo para explorar a superfície orgânica de Titã', status: 'Futura' },
      { name: 'Habitable Worlds Observatory (HWO)', role: 'Telescópio óptico de 6m projetado para detectar bioassinaturas em 25 Terras', status: 'Futura' },
      { name: 'Mars Perseverance Rover', role: 'Coleta de amostras na Cratera Jezero em busca de biofósseis microbianos', status: 'Ativa' },
    ],
    coreDiscoveries: [
      'Detecção de gêiseres de vapor d’água ricos em sais orgânicos e hidrogênio molecular em Encélado.',
      'Mapeamento da química pré-biótica complexa em Titã, repleta de lagos de metano líquido.',
      'Primeira espectroscopia de transmissão do exoplaneta K2-18b detectando moléculas contendo carbono.',
      'Identificação de micro-organismos extremófilos terrestres prosperando sob vácuo e alta radiação.',
    ],
    formula: {
      latex: 'N = R_* \\cdot f_p \\cdot n_e \\cdot f_l \\cdot f_i \\cdot f_c \\cdot L',
      label: 'Equação de Drake para Estimativa de Civilizações Comunicativas',
      explanation: 'Relaciona a taxa de formação estelar ($R_*$), fração de planetas ($f_p$), mundos habitáveis ($n_e$) e longevidade das civilizações ($L$).',
    },
    nasaDirectorateQuote:
      '"Procuramos vida não apenas procurando uma cópia exata da Terra, mas entendendo a incrível diversidade de ambientes que o cosmos oferece." — NASA Astrobiology Program',
  },
  {
    id: 'stars',
    titleEn: 'Stars',
    titlePt: 'Estrelas',
    tagline: 'Reatores nucleares cósmicos que forjam os elementos pesados da tabela periódica',
    nasaUrl: 'https://science.nasa.gov/universe/stars/',
    badge: 'EVOLUÇÃO ESTELAR // ASTROFÍSICA',
    color: '#f59e0b',
    summaryDidactic:
      'As estrelas são as grandes fornalhas do universo. Dentro de seus núcleos, a gravidade esmaga átomos de hidrogênio em hélio, liberando a luz e o calor que alimentam planetas. Quando estrelas massivas morrem em violentas explosões de supernovas, elas espalham ferro, cálcio, ouro e oxigênio pelo espaço. Cada átomo do seu corpo foi forjado no coração de uma estrela extinta!',
    summaryTechnical:
      'Corpos esferoidais autogravitantes em equilíbrio hidrostático onde o gradiente de pressão térmica nuclear contrabalança a compressão gravitacional. A evolução segue trajetórias no Diagrama Hertzsprung-Russell ($L \\propto T_{eff}^4$), finalizando como Anãs Brancas sustentadas por degenerescência eletrônica, Estrelas de Nêutrons ou Buracos Negros.',
    keyStats: [
      { label: 'Estrelas na Via Láctea', value: '100 a 400 Bilhões', subtext: 'Maioria absoluta composta por anãs vermelhas classe M' },
      { label: 'Temperatura Central Solar', value: '15.700.000 K', subtext: 'Condição necessária para cadeia Próton-Próton' },
      { label: 'Densidade em Estrelas de Nêutrons', value: '10¹⁴ g/cm³', subtext: 'Uma colher de chá pesaria 1 bilhão de toneladas' },
      { label: 'Tempo de Vida Solar', value: '~10 Bilhões de Anos', subtext: 'Atualmente na meia-idade da Sequência Principal (~4.6 Ga)' },
    ],
    keyMissions: [
      { name: 'NICER (Neutron star Interior Composition Explorer)', role: 'Telescópio de raios-X na ISS para mapear a equação de estado de pulsares', status: 'Ativa' },
      { name: 'Chandra X-ray Observatory', role: 'Imagens de altíssima energia de remanescentes de supernovas e ventos estelares', status: 'Ativa' },
      { name: 'Hubble Space Telescope', role: 'Mapeamento de berçários estelares e nebulosas planetárias em alta resolução', status: 'Ativa' },
      { name: 'NuSTAR', role: 'Telescópio de focalização em raios-X duros para estudar colapsos estelares', status: 'Ativa' },
    ],
    coreDiscoveries: [
      'Confirmação da nucleossíntese explosiva de elementos pesados via processo r em colisões de estrelas de nêutrons (quilonovas).',
      'Descoberta de magnetares: pulsares com campos magnéticos de $10^{15}$ Gauss geradores de Fast Radio Bursts (FRBs).',
      'Resolução de oscilações heliosísmicas mapeando o transporte de energia convectiva e rotação diferencial estelar.',
      'Detecção de Earendel pelo Hubble/JWST, a estrela individual mais distante já observada ($z = 6.2$).',
    ],
    formula: {
      latex: '\\frac{dP}{dr} = -\\frac{G M(r) \\rho(r)}{r^2}, \\quad L \\approx 4\\pi R^2 \\sigma_{SB} T_{eff}^4',
      label: 'Equilíbrio Hidrostático Estelar e Lei de Stefan-Boltzmann',
      explanation: 'Define o balanço mecânico estável entre o peso das camadas estelares e a pressão interna gerada por fusão radiativa.',
    },
    nasaDirectorateQuote:
      '"Somos literalmente poeira de estrelas: o ferro no nosso sangue e o oxigênio que respiramos foram cozidos em caldeirões estelares." — NASA Science Mission Directorate',
  },
  {
    id: 'galaxies',
    titleEn: 'Galaxies',
    titlePt: 'Galáxias',
    tagline: 'Vastas cidades cósmicas compostas por bilhões de estrelas ligadas pela gravidade',
    nasaUrl: 'https://science.nasa.gov/universe/galaxies/',
    badge: 'ESTRUTURA EM LARGA ESCALA // COSMOS',
    color: '#ec4899',
    summaryDidactic:
      'As galáxias são os maiores blocos de construção estrutural do cosmos observável. Estima-se que existam mais de 2 trilhões de galáxias no universo! Elas vêm em formatos espetaculares: espirais majestosas com braços giratórios (como a nossa Via Láctea e Andrômeda), galáxias elípticas gigantes e formas irregulares moldadas por colisões monumentais.',
    summaryTechnical:
      'Sistemas estelares gravitacionalmente ligados imersos em halos massivos de matéria escura. Classificadas pela Sequência de Hubble (espirais $S$, barradas $SB$, elípticas $E$ e lenticulares $S0$). Apresentam buracos negros supermassivos centrais cujos jatos relativísticos exercem feedback térmico regulando a taxa de formação estelar ($SFR$).',
    keyStats: [
      { label: 'Galáxias no Cosmos Observável', value: '~2 Trilhões', subtext: 'Estimativa após contagens do Hubble Deep Field' },
      { label: 'Diâmetro da Via Láctea', value: '~100.000 Anos-luz', subtext: 'Contém aproximadamente 200 a 400 bilhões de estrelas' },
      { label: 'Colisão com Andrômeda', value: 'Em ~4,5 Bilhões de Anos', subtext: 'Fusão prevista formando a galáxia elíptica Milkomeda' },
      { label: 'Galáxia Mais Distante (JWST)', value: 'JADES-GS-z14-0', subtext: 'Observada em z = 14.32, apenas 290 Ma após o Big Bang' },
    ],
    keyMissions: [
      { name: 'James Webb Space Telescope (JWST)', role: 'Visão infravermelha penetrando na poeira cósmica nas primeiras galáxias', status: 'Ativa' },
      { name: 'Hubble Space Telescope', role: 'Criador do icônico Hubble Ultra Deep Field com milhares de galáxias primordiais', status: 'Ativa' },
      { name: 'Nancy Grace Roman Space Telescope', role: 'Campo de visão 100x maior que o Hubble para censos galácticos massivos', status: 'Futura' },
      { name: 'Spitzer Space Telescope', role: 'Pioneiro em luz infravermelha mapeando a poeira interestelar de braços galácticos', status: 'Legado' },
    ],
    coreDiscoveries: [
      'Descoberta de galáxias luminosas e estruturadas surpreendentemente cedo no cosmos jovem pelo JWST.',
      'Confirmação de que praticamente todas as galáxias massivas abrigam um buraco negro supermassivo no centro.',
      'Identificação da teia cósmica filamentar ligando aglomerados através de pontes de gás intergaláctico.',
      'Evidência de que colisões de galáxias geram surtos espetaculares de nascimento estelar (Starburst galaxies).',
    ],
    formula: {
      latex: 'v = H_0 \\cdot d, \\quad L \\propto v_{rot}^4 \\quad (\\text{Tully-Fisher})',
      label: 'Lei de Expansão de Hubble-Lemaître e Relação Tully-Fisher',
      explanation: 'Mede a recessão galáctica em função da distância ($H_0$) e correlaciona a luminosidade intrínseca com a velocidade de rotação assintótica.',
    },
    nasaDirectorateQuote:
      '"Cada ponto brilhante no campo profundo não é uma estrela, mas uma galáxia inteira com centenas de bilhões de mundos." — NASA Astrophysics Archive',
  },
  {
    id: 'black-holes',
    titleEn: 'Black Holes',
    titlePt: 'Buracos Negros',
    tagline: 'Onde o tecido do espaço-tempo é distorcido ao extremo e as leis da física são testadas',
    nasaUrl: 'https://science.nasa.gov/universe/black-holes/',
    badge: 'RELATIVIDADE GERAL // HORIZONTE DE EVENTOS',
    color: '#8b5cf6',
    summaryDidactic:
      'Um buraco negro é um objeto tão denso e com gravidade tão avassaladora que nada — nem mesmo a partícula mais rápida do universo, a luz — consegue escapar após ultrapassar seu Horizonte de Eventos. Próximo a ele, o tempo passa muito mais devagar para quem está perto em comparação com quem observa de longe (dilatação gravitacional do tempo).',
    summaryTechnical:
      'Soluções exatas das Equações de Campo de Einstein no vácuo para massas colapsadas com simetria esférica (Métrica de Schwarzschild) e rotação estacionária (Métrica de Kerr com ergossfera e rotação do espaço-tempo via Lense-Thirring). No centro reside uma singularidade física onde a curvatura do tensor de Riemann diverge para o infinito.',
    keyStats: [
      { label: 'Sagitário A* (Centro da Via Láctea)', value: '4,15 Milhões M☉', subtext: 'A cerca de 26.700 anos-luz da Terra' },
      { label: 'M87* (Supermassivo)', value: '6,5 Bilhões M☉', subtext: 'Primeiro buraco negro diretamente imageado pelo EHT' },
      { label: 'Velocidade de Escape', value: '> 299.792 km/s', subtext: 'Supera a velocidade da luz dentro do Horizonte de Eventos' },
      { label: 'Dilatação Temporal Relativística', value: 't → ∞ no horizonte', subtext: 'Para um observador distante, a queda congela na fronteira' },
    ],
    keyMissions: [
      { name: 'Chandra X-ray Observatory', role: 'Detecção de radiação térmica ultraquente emitida por discos de acreção', status: 'Ativa' },
      { name: 'Event Horizon Telescope (EHT - Parceria NASA)', role: 'Rede interferométrica global que produziu as fotos de M87* e Sgr A*', status: 'Ativa' },
      { name: 'IXPE (Imaging X-ray Polarimetry Explorer)', role: 'Mapeamento da polarização e linhas de campo magnético ao redor de singularidades', status: 'Ativa' },
      { name: 'LISA (Laser Interferometer Space Antenna)', role: 'Detecção espacial de ondas gravitacionais de fusões de buracos negros supermassivos', status: 'Futura' },
    ],
    coreDiscoveries: [
      'Primeiras imagens reais da silhueta do horizonte de eventos e anel de fótons de M87* e Sagitário A*.',
      'Detecção de ondas gravitacionais geradas por fusões binárias de buracos negros (LIGO/Virgo com suporte NASA).',
      'Confirmação de jatos de plasma relativísticos emitidos a 99% da velocidade da luz pelos polos magnéticos.',
      'Identificação do processo Blandford-Znajek extraindo energia rotacional pura da ergossfera de Kerr.',
    ],
    formula: {
      latex: 'R_s = \\frac{2 G M}{c^2}, \\quad T_H = \\frac{\\hbar c^3}{8 \\pi G M k_B}',
      label: 'Raio de Schwarzschild e Temperatura da Radiação Hawking',
      explanation: 'Determina a dimensão física do Horizonte de Eventos para uma massa $M$ e prevê a emissão termodinâmica quântica de evaporação.',
    },
    nasaDirectorateQuote:
      '"Os buracos negros não são aspiradores espaciais desgovernados: são os laboratórios naturais mais perfeitos para testar a Relatividade Geral de Einstein." — NASA Goddard Space Flight Center',
  },
  {
    id: 'the-big-bang',
    titleEn: 'The Big Bang',
    titlePt: 'O Big Bang',
    tagline: 'O nascimento cataclísmico do espaço, do tempo e de toda a matéria há 13,8 bilhões de anos',
    nasaUrl: 'https://science.nasa.gov/universe/the-big-bang/',
    badge: 'COSMOGONIA // RADIAÇÃO PRIMORDIAL',
    color: '#ef4444',
    summaryDidactic:
      'Ao contrário do que muitos imaginam, o Big Bang não foi uma explosão que aconteceu em algum lugar no espaço: foi a expansão súbita do próprio espaço em todos os lugares ao mesmo tempo! Há 13,8 bilhões de anos, todo o cosmos estava compactado em um ponto incrivelmente quente e denso que se expandiu, resfriou e permitiu a criação dos primeiros átomos.',
    summaryTechnical:
      'Modelo padrão cosmológico $\Lambda\\text{CDM}$ fundamentado na Relatividade Geral e na métrica FLRW homogênea e isotrópica. Evidências irrefutáveis incluem a recessão galáctica universal de Hubble, a Radiação Cósmica de Fundo em Micro-ondas ($CMB$) a $2.7255 \\text{ K}$ e a razão de abundância de elementos leves calculada pela Nucleossíntese Primordial.',
    keyStats: [
      { label: 'Idade do Universo', value: '13,787 ± 0,020 Ga', subtext: 'Determinada com precisão milimétrica pelo WMAP e Planck' },
      { label: 'Temperatura Atual do CMB', value: '2,7255 Kelvin', subtext: 'Espectro de corpo negro mais perfeito já medido na natureza' },
      { label: 'Primeira Luz Livre', value: '380.000 Anos após', subtext: 'Momento da Recombinação quando elétrons uniram-se a prótons' },
      { label: 'Fração de Hidrogênio Primordial', value: '~75% da massa', subtext: 'Com 25% de Hélio e traços de Deutério e Lítio' },
    ],
    keyMissions: [
      { name: 'WMAP (Wilkinson Microwave Anisotropy Probe)', role: 'Mapeou as flutuações de temperatura do CMB e fixou a idade do universo em 13,8 Ga', status: 'Legado' },
      { name: 'COBE (Cosmic Background Explorer)', role: 'Missão Nobel que provou o espectro de corpo negro e as sementes das galáxias', status: 'Legado' },
      { name: 'Planck Observatory (ESA com apoio da NASA)', role: 'Capa mais detalhada e de alta resolução angular do universo com 380 mil anos', status: 'Legado' },
      { name: 'SPHEREx', role: 'Mapeador espectroscópico de céu total para investigar a inflação primordial', status: 'Futura' },
    ],
    coreDiscoveries: [
      'Confirmação de que o universo possui geometria espacial euclidiana plana ($\Omega_k \\approx 0$).',
      'Descoberta de anomalias acústicas bariônicas (BAO) funcionando como régua padrão cósmica.',
      'Validação de que as minúsculas flutuações de temperatura de 1 parte em 100.000 geraram os superaglomerados.',
      'Medição do tempo de desacoplamento fóton-elétron em redshift $z \\approx 1100$.',
    ],
    formula: {
      latex: 'H^2(t) = \\left(\\frac{\\dot{a}}{a}\\right)^2 = \\frac{8\\pi G}{3}\\rho - \\frac{k c^2}{a^2} + \\frac{\\Lambda c^2}{3}',
      label: 'Primeira Equação Cosmológica de Friedmann',
      explanation: 'Governa a velocidade de expansão do tecido cósmico com base na densidade de matéria, radiação e energia escura.',
    },
    nasaDirectorateQuote:
      '"A Radiação Cósmica de Fundo é o retrato de bebê do nosso universo, capturado quando ele tinha apenas 380 mil anos." — NASA Jet Propulsion Laboratory (JPL)',
  },
  {
    id: 'dark-energy',
    titleEn: 'Dark Energy',
    titlePt: 'Energia Escura',
    tagline: 'O misterioso motor que domina 68% do cosmos e acelera a expansão do universo',
    nasaUrl: 'https://science.nasa.gov/universe/dark-energy/',
    badge: 'ENERGIA DE VÁCUO // ACELERAÇÃO CÓSMICA',
    color: '#a855f7',
    summaryDidactic:
      'Durante décadas, os cientistas achavam que a gravidade de todas as galáxias desaceleraria a expansão do universo. Mas em 1998, observando supernovas distantes, descobriu-se o oposto: o universo está se expandindo cada vez mais rápido! Uma pressão invisível e desconhecida, chamada Energia Escura, estica o próprio espaço e compõe quase 70% de tudo o que existe.',
    summaryTechnical:
      'Componente de densidade energética fluida com pressão negativa e equação de estado $w = P / \\rho \\approx -1$. Na formulação padrão, atua como a Constante Cosmológica $\\Lambda$ de Einstein nas equações de campo tensorais, gerando aceleração cósmica contínua quando o fator de escala atingiu $z \\approx 0.67$.',
    keyStats: [
      { label: 'Participação no Cosmos', value: '~68,3%', subtext: 'Maior constituinte de energia do universo' },
      { label: 'Pressão Cosmológica', value: 'Negativa (repulsiva)', subtext: 'Contraria a atração gravitacional clássica' },
      { label: 'Início da Aceleração', value: 'Há ~5 Bilhões de Anos', subtext: 'Superou a densidade de atração da matéria' },
      { label: 'Parâmetro de Equação de Estado', value: 'w = -1,03 ± 0,03', subtext: 'Compatível com energia pura do vácuo quântico' },
    ],
    keyMissions: [
      { name: 'Nancy Grace Roman Space Telescope', role: 'Missão principal da NASA com levantamento de supernovas para desvendar a energia escura', status: 'Futura' },
      { name: 'Euclid (ESA com instrumentação NASA)', role: 'Telescópio espacial mapeando a geometria do universo escuro em 3D', status: 'Ativa' },
      { name: 'Hubble Space Telescope', role: 'Pioneiro nas medições de velas-padrão de Supernovas Tipo Ia', status: 'Ativa' },
      { name: 'Vera C. Rubin Observatory (Apoio NASA)', role: 'Varredura óptica sinóptica do hemisfério sul para rastrear lentes cósmicas', status: 'Futura' },
    ],
    coreDiscoveries: [
      'Nobel de Física de 2011 concedido pela descoberta da expansão acelerada do cosmos.',
      'Constatação de que a densidade da energia escura parece permanecer constante conforme o espaço se expande.',
      'Demonstração de que o destino final mais provável do cosmos é a expansão eterna e o Big Freeze.',
      'Constatação de que a matéria bariônica comum (que forma humanos, estrelas e planetas) é inferior a 5% do cosmos.',
    ],
    formula: {
      latex: '\\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left(\\rho + \\frac{3P}{c^2}\\right) + \\frac{\\Lambda c^2}{3}, \\quad w = \\frac{P}{\\rho c^2} \\approx -1',
      label: 'Equação de Aceleração de Friedmann com Constante Cosmológica',
      explanation: 'Mostra que para uma pressão negativa $P < -\\rho c^2 / 3$, a derivada segunda do fator de escala torna-se positiva ($\ddot{a} > 0$), provocando expansão acelerada.',
    },
    nasaDirectorateQuote:
      '"A Energia Escura é talvez o mistério mais intrigante de toda a física fundamental moderna." — NASA Astrophysics Science Division',
  },
  {
    id: 'dark-matter',
    titleEn: 'Dark Matter',
    titlePt: 'Matéria Escura',
    tagline: 'O andaime invisível que compõe 85% de toda a massa do universo e sustenta as galáxias',
    nasaUrl: 'https://science.nasa.gov/universe/dark-matter/',
    badge: 'HALOS GRAVITACIONAIS // ANDAIME CÓSMICO',
    color: '#3b82f6',
    summaryDidactic:
      'Quando você olha para o céu noturno, todas as estrelas e galáxias que emitem luz são apenas a "ponta do iceberg". Cerca de 85% de toda a matéria do cosmos é Matéria Escura: uma substância misteriosa que não absorve, reflete nem emite luz, mas tem gravidade real. Sem ela, a Via Láctea giraria tão rápido que suas estrelas seriam arremessadas no espaço vazio!',
    summaryTechnical:
      'Matéria não-bariônica não-relativística (Cold Dark Matter - CDM) com seção de choque de interação eletromagnética nula ou extremamente suprimida. Evidenciada por curvas de rotação galáctica assintóticas planas ($v(r) = \\text{const}$), dispersão de velocidade em aglomerados de Zwicky, Lentes Gravitacionais Fracas e separação bariônica observada no Aglomerado da Bala (Bullet Cluster).',
    keyStats: [
      { label: 'Participação em Toda a Matéria', value: '~85%', subtext: 'A matéria comum visível representa apenas ~15%' },
      { label: 'Participação Total no Cosmos', value: '~26,8%', subtext: 'Matéria escura supera átomos normais por quase 6 para 1' },
      { label: 'Candidatos Físicos', value: 'WIMPs, Áxions, PBHs', subtext: 'Partículas hipotéticas além do Modelo Padrão' },
      { label: 'Massa do Halo da Via Láctea', value: '~1 a 1,5 Trilhões M☉', subtext: 'Estende-se por muito além do disco luminoso de estrelas' },
    ],
    keyMissions: [
      { name: 'Chandra X-ray Observatory', role: 'Mapeou o famoso Aglomerado da Bala comprovando a separação física entre matéria escura e gás visível', status: 'Ativa' },
      { name: 'Hubble & JWST Lensing Surveys', role: 'Mapeamento de matéria escura por distorção de lentes gravitacionais em aglomerados (ex: MACS J0717)', status: 'Ativa' },
      { name: 'Fermi Gamma-ray Space Telescope', role: 'Busca por assinaturas de aniquilação de matéria escura no centro galáctico', status: 'Ativa' },
      { name: 'Nancy Grace Roman Space Telescope', role: 'Mapeamento de alta precisão do cisalhamento cósmico (cosmic shear) em grande escala', status: 'Futura' },
    ],
    coreDiscoveries: [
      'Observação seminal de Vera Rubin provando que a velocidade orbital das estrelas não cai com a distância.',
      'Aglomerado da Bala (1E 0657-56): prova definitiva de que a matéria escura colidiu sem atrito, separando-se do gás quente.',
      'Mapeamento tridimensional dos filamentos de matéria escura que guiam a formação e colisão de galáxias.',
      'Constatação de que as primeiras estrelas e galáxias só conseguiram condensar-se graças aos poços gravitacionais de matéria escura.',
    ],
    formula: {
      latex: 'v(r) = \\sqrt{\\frac{G M(r)}{r}} \\approx \\text{constante} \\implies M(r) \\propto r, \\quad \\rho(r) = \\frac{\\rho_0}{\\frac{r}{R_s}\\left(1 + \\frac{r}{R_s}\\right)^2}',
      label: 'Curva Plana de Rotação Galáctica e Perfil de Densidade NFW',
      explanation: 'Indica que a massa gravitacional cresce linearmente com o raio do halo estendido, modelada pelo perfil analítico Navarro-Frenk-White.',
    },
    nasaDirectorateQuote:
      '"A matéria escura é o esqueleto invisível que sustentou a criação de todas as galáxias que existem hoje." — NASA Science Mission Directorate',
  },
];
