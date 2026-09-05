/**
 * aiKnowledgeBank.ts
 *
 * Banco de Conhecimento Sub-Escondido / Interno de Alta Densidade Semântica.
 * Objetivo Primordial: Economizar tokens de chamadas de LLM (OpenRouter / APIs)
 * fornecendo respostas científicas locais instantâneas (0 tokens gastos e 0ms latência)
 * ou sementes factuais ultracompactas que reduzem o tamanho do prompt em mais de 70%.
 */

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  topic: string;
  title: string;
  didacticAnswer: string;
  technicalAnswer: string;
  formula?: string;
  formulaLabel?: string;
  sources: string[];
}

export const AI_KNOWLEDGE_BANK: KnowledgeEntry[] = [
  {
    id: 'novikov',
    keywords: ['novikov', 'autoconsistencia', 'auto-consistencia', 'paradoxo do avo', 'mudar o passado', 'viagem no tempo'],
    topic: 'Causalidade Relativística',
    title: 'Princípio de Autoconsistência de Novikov (1986)',
    didacticAnswer:
      'Pense no tempo como um rio com correntes fortes: se você tentar mudar o passado, as leis da física já "sabiam" disso. Qualquer ação que você tome no passado acabará sendo a causa exata daquilo que você estava tentando evitar. Não há paradoxo porque o passado é uma história única e coerente que não pode ser reescrita.',
    technicalAnswer:
      'Formulado por Igor Novikov em 1986, o princípio estipula que a probabilidade de ocorrência de qualquer evento que origine uma Curva Tipo-Tempo Fechada (CTC) autocontraditória é identicamente zero. Em termos de mecânica quântica e integração funcional de trajetórias de Feynman, apenas soluções globais auto-consistentes com variação de ação nula possuem amplitudes de probabilidade não nulas.',
    formula: 'S[\\gamma] = \\oint_{CTC} L(q, \\dot{q}, t) \\, dt, \\quad \\delta S = 0',
    formulaLabel: 'Condição Variacional de Auto-consistência Global',
    sources: ['Physical Review D (Novikov et al., 1990)', 'I. D. Novikov, Evolution of the Universe (1983)'],
  },
  {
    id: 'light_cones',
    keywords: ['cone de luz', 'cones de luz', 'minkowski', 'velocidade da luz', 'causalidade', 'intervalo espaçotempo'],
    topic: 'Espaço-Tempo de Minkowski',
    title: 'Cones de Luz e Estrutura Causal de Minkowski (1908)',
    didacticAnswer:
      'Imagine que a luz é o limite de velocidade máximo do universo. O cone de luz é como uma lanterna que se expande: para onde a luz não conseguiu chegar a tempo, nenhum sinal ou acontecimento pode causar qualquer efeito. O "Cone do Passado" é tudo o que pôde afetar você; o "Cone do Futuro" é tudo o que você pode alcançar.',
    technicalAnswer:
      'Em uma variedade pseudo-riemanniana dotada de métrica métrica de Minkowski $\\eta_{\\mu\\nu} = \\text{diag}(-c^2, 1, 1, 1)$, o cone de luz divide o fibrado tangente em três regiões invariantes sob transformações de Lorentz: Tipo-Tempo ($ds^2 < 0$, regiões causalmente conectáveis), Tipo-Luz ($ds^2 = 0$, geodésicas nulas de fótons) e Tipo-Espaço ($ds^2 > 0$, eventos causalmente desconectados proibidos de transmissão de sinal superluminal).',
    formula: 'ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2 = \\eta_{\\mu\\nu} dx^\\mu dx^\\nu',
    formulaLabel: 'Intervalo Métrico Diferencial Invariante de Lorentz',
    sources: ['H. Minkowski, Space and Time (1908)', 'Misner, Thorne & Wheeler, Gravitation (1973)'],
  },
  {
    id: 'time_dilation',
    keywords: ['dilatacao do tempo', 'dilatacao temporal', 'lorentz', 'tempo passa mais devagar', 'gravidade tempo', 'gêmeos'],
    topic: 'Relatividade Especial e Geral',
    title: 'Dilatação Temporal Cinemática e Gravitacional',
    didacticAnswer:
      'O tempo não é um relógio mestre igual para todo mundo. Se você estiver se movendo a velocidades próximas à da luz, ou estiver perto de um objeto superpesado como um buraco negro, o seu tempo passa mais devagar em relação a quem ficou parado na Terra. Um minuto para você pode durar anos para quem está fora!',
    technicalAnswer:
      'A dilatação temporal cinemática decorre diretamente da invariância da velocidade da luz $c$, sendo quantificada pelo fator de Lorentz $\\gamma = 1/\\sqrt{1 - v^2/c^2}$. A dilatação gravitacional provém do decaimento do tensor métrico $g_{00}$ em campos gravitacionais de acordo com o Princípio de Equivalência de Einstein: relógios em potenciais mais baixos batem mais devagar na proporção $d\\tau = \\sqrt{-g_{00}} dt$.',
    formula: '\\Delta t\' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}} = \\gamma \\Delta t, \\quad d\\tau = dt \\sqrt{1 - \\frac{2GM}{r c^2}}',
    formulaLabel: 'Dilatação Cinemática (SR) e Gravitacional de Schwarzschild (GR)',
    sources: ['A. Einstein, Zur Elektrodynamik bewegter Körper (1905)', 'Physical Review Letters'],
  },
  {
    id: 'einstein_equations',
    keywords: ['equacoes de einstein', 'relatividade geral', 'curvatura do espaco', 'gravitacao', 'tensor de energia momento'],
    topic: 'Relatividade Geral',
    title: 'Equações de Campo de Einstein (1915)',
    didacticAnswer:
      'A matéria e a energia dizem ao espaço como se curvar, e o espaço curvo diz à matéria como se mover. O que sentimos como "gravidade" não é uma corda puxando as coisas, mas sim os corpos deslizando pela curvatura que a massa do Sol e dos planetas cria no tecido do universo.',
    technicalAnswer:
      'As Equações de Campo de Einstein (EFE) constituem um sistema não linear de 10 equações diferenciais parciais hiperbólico-elípticas que acoplam a curvatura intrínseca da variedade 4D (Tensor de Ricci $R_{\\mu\\nu}$ e Escalar de Ricci $R$) com o conteúdo de matéria-energia (Tensor de Energia-Momento $T_{\\mu\\nu}$).',
    formula: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} \\equiv R_{\\mu\\nu} - \\frac{1}{2} R g_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
    formulaLabel: 'Equações de Campo de Einstein com Constante Cosmológica',
    sources: ['A. Einstein, Sitzungsberichte der Preussischen Akademie der Wissenschaften (1915)', 'Living Reviews in Relativity'],
  },
  {
    id: 'black_holes_kerr',
    keywords: ['buraco negro', 'singularidade', 'kerr', 'schwarzschild', 'horizonte de eventos', 'ergosfera', 'sagittarius a'],
    topic: 'Astrofísica Relativística',
    title: 'Buracos Negros: Métricas de Schwarzschild e Kerr',
    didacticAnswer:
      'Um buraco negro é uma região onde tanta matéria foi espremida em um ponto que nada, nem a luz, consegue escapar de dentro do "Horizonte de Eventos". Se o buraco negro estiver girando (como Sagittarius A* e M87*), ele arrasta o próprio espaço ao redor como uma batedeira, criando uma região chamada Ergosfera.',
    technicalAnswer:
      'A solução de Schwarzschild (1916) modela buracos negros esfericamente simétricos sem carga ($Q=0, J=0$) com raio de horizonte $r_s = 2GM/c^2$. A solução exata de Roy Kerr (1963) descreve buracos negros em rotação estacionária axissimétrica com momento angular $J = aM$, exibindo arrasto de referenciais (frame-dragging de Lense-Thirring) e um horizonte interno de Cauchy.',
    formula: 'r_s = \\frac{2GM}{c^2}, \\quad r_+ = \\frac{GM}{c^2} + \\sqrt{\\left(\\frac{GM}{c^2}\\right)^2 - a^2}',
    formulaLabel: 'Raio de Schwarzschild e Horizonte de Eventos Externo de Kerr',
    sources: ['R. P. Kerr, Gravitational field of a spinning mass (1963)', 'Event Horizon Telescope Collaboration (2019, 2022)'],
  },
  {
    id: 'hawking_radiation',
    keywords: ['radiacao hawking', 'evaporacao de buraco negro', 'termodinamica de buracos negros', 'temperatura hawking', 'entropia bekenstein'],
    topic: 'Gravitação Quântica Semissclássica',
    title: 'Radiação e Termodinâmica de Buracos Negros de Hawking (1974)',
    didacticAnswer:
      'No vácuo quântico, pares de partículas e antipartículas surgem e somem o tempo todo. Bem na beira do horizonte de um buraco negro, uma partícula pode cair para dentro enquanto a outra escapa para o espaço! Isso faz o buraco negro emitir um calor suave e perder massa muito lentamente ao longo de éons até evaporar por completo.',
    technicalAnswer:
      'Stephen Hawking demonstrou que a teoria quântica de campos em espaço-tempo curvo prediz que horizontes de eventos emitem radiação térmica de corpo negro com espectro puramente planckiano. A temperatura de Hawking é inversamente proporcional à massa $M$ e a entropia de Bekenstein-Hawking é proporcional à área do horizonte dividida por $4\\ell_P^2$.',
    formula: 'T_H = \\frac{\\hbar c^3}{8\\pi G M k_B}, \\quad S_{BH} = \\frac{k_B c^3 A}{4 G \\hbar} = \\frac{k_B A}{4 \\ell_P^2}',
    formulaLabel: 'Temperatura de Hawking e Entropia de Bekenstein-Hawking',
    sources: ['S. W. Hawking, Nature 248, 30–31 (1974)', 'Communications in Mathematical Physics 43 (1975)'],
  },
  {
    id: 'cosmic_inflation',
    keywords: ['inflacao cosmica', 'big bang', 'cmb', 'radiacao cosmica de fundo', 'universo primordial', 'alan guth'],
    topic: 'Cosmologia Primordial',
    title: 'Inflação Cósmica e Fundo de Micro-ondas (CMB)',
    didacticAnswer:
      'Uma fração minúscula de segundo após o Big Bang, o universo se expandiu mais rápido que a velocidade da luz em um surto gigantesco chamado Inflação. Essa expansão esticou tudo e deixou a "foto de bebê" do universo gravada no céu: a Radiação Cósmica de Fundo (CMB), um brilho que ainda banha o cosmos a -270,4 °C.',
    technicalAnswer:
      'Proposta por Alan Guth (1981) e Andrei Linde, a inflação postula uma fase de expansão quase-de Sitter impulsionada pela densidade de energia potencial de um campo escalar primordial (o inflaton $\\phi$) com equação de estado $w \\approx -1$. Resolve simultaneamente o Problema do Horizonte, da Plenitude (Flatness) e dos Monopolos Magnéticos, predizendo perturbações gaussianas quase invariantes de escala verificadas pelas sondas COBE, WMAP e Planck.',
    formula: 'H^2 = \\left(\\frac{\\dot{a}}{a}\\right)^2 \\approx \\frac{8\\pi G}{3} V(\\phi), \\quad N = \\int_{t_i}^{t_f} H \\, dt \\gtrsim 60',
    formulaLabel: 'Equação de Friedmann para Inflaton e Número de e-folds',
    sources: ['A. H. Guth, Physical Review D 23, 347 (1981)', 'Planck Collaboration (A&A 2020)'],
  },
  {
    id: 'dark_matter_energy',
    keywords: ['materia escura', 'energia escura', 'constante cosmologica', 'expansao acelerada', 'lambda cdm', 'lcdm'],
    topic: 'Cosmologia Observacional',
    title: 'Modelo Padrão $\\Lambda$CDM: Matéria Escura e Energia Escura',
    didacticAnswer:
      'Tudo o que conseguimos ver — estrelas, planetas, galáxias e nós mesmos — representa menos de 5% do universo! Cerca de 27% é Matéria Escura (uma matéria invisível que funciona como um esqueleto gravitacional) e 68% é Energia Escura (uma força misteriosa que está fazendo o universo acelerar sua expansão para sempre).',
    technicalAnswer:
      'O Modelo Concordante $\\Lambda$CDM fundamenta-se na métrica FLRW com densidades críticas fracionárias medidas pelo satélite Planck da ESA e pesquisas com Supernovas Tipo Ia: $\\Omega_b \\approx 0.049$ (bariônica), $\\Omega_c \\approx 0.268$ (matéria escura fria não-bariônica fracamente interativa) e $\\Omega_\\Lambda \\approx 0.683$ (energia de ponto zero ou constante cosmológica com pressão negativa $P = -\\rho c^2$).',
    formula: '\\Omega_{total} = \\Omega_m + \\Omega_\\Lambda + \\Omega_r \\approx 1.000 \\pm 0.002, \\quad w = \\frac{P}{\\rho c^2} \\approx -1.03 \\pm 0.03',
    formulaLabel: 'Parâmetro de Densidade Crítica Total e Equação de Estado',
    sources: ['Supernova Cosmology Project (Perlmutter et al., 1999)', 'High-Z Supernova Search Team (Riess et al., 1998)', 'Planck 2018 Results'],
  },
  {
    id: 'nasa_jwst',
    keywords: ['jwst', 'james webb', 'nasa', 'hubble', 'smacs 0723', 'telescopio espacial', 'deep field', 'primeiras galaxias'],
    topic: 'Grandes Observatórios da NASA',
    title: 'James Webb Space Telescope (JWST) e Lentes Gravitacionais',
    didacticAnswer:
      'Orbitando a 1,5 milhão de km da Terra no ponto Lagrangiano L2, o telescópio James Webb usa um espelho de berílio folheado a ouro de 6,5 metros e visão infravermelha para perfurar nuvens de poeira e enxergar as primeiras galáxias que se acenderam após a Idade das Trevas do cosmos, há mais de 13,5 bilhões de anos.',
    technicalAnswer:
      'Equipado com os instrumentos NIRCam e MIRI resfriados criogenicamente a até 7 Kelvin, o JWST detecta desvios para o vermelho extremos ($z > 13$) causados pela expansão métrica do espaço. Ele utiliza o fenômeno da lente gravitacional em aglomerados maciços (como SMACS 0723) previstos pela Relatividade Geral para amplificar a luz de galáxias primordiais através do anel e arcos de Einstein.',
    formula: '1 + z = \\frac{\\lambda_{obs}}{\\lambda_{emit}} = \\frac{a(t_{obs})}{a(t_{emit})}, \\quad \\theta_E = \\sqrt{\\frac{4GM}{c^2} \\frac{D_{LS}}{D_L D_S}}',
    formulaLabel: 'Redshift Cosmológico e Raio Angular do Anel de Einstein',
    sources: ['NASA JWST Science Mission Directorate (2022-2024)', 'Nature Astronomy (Robertson et al., 2023)'],
  },
  {
    id: 'alcubierre',
    keywords: ['alcubierre', 'dobra espacial', 'warp drive', 'energia negativa', 'velocidade superior a luz', 'hiperespaco'],
    topic: 'Métricas Avançadas da Relatividade',
    title: 'Métrica de Alcubierre e Dobra Espacial (1994)',
    didacticAnswer:
      'Em vez de tentar empurrar uma nave espacial mais rápido que a luz (o que a física proíbe), o físico Miguel Alcubierre calculou que você poderia comprimir o espaço à frente da nave e expandir o espaço atrás dela. A nave fica parada dentro de uma "bolha" segura, e é o próprio espaço que se desloca!',
    technicalAnswer:
      'Proposta por Miguel Alcubierre em 1994, a métrica altera localmente o tensor métrico criando uma bolha de espaço plano transportada com velocidade arbitrária $v_s(t)$. No entanto, requer densidade de energia negativa violando as Condições de Energia Fraca e Nula da Relatividade Geral ($T_{\\mu\\nu} k^\\mu k^\\nu < 0$), demandando matéria exótica gerada por efeitos quânticos do tipo Casimir.',
    formula: 'ds^2 = -c^2 dt^2 + [dx - v_s(t) f(r_s) dt]^2 + dy^2 + dz^2',
    formulaLabel: 'Elemento de Linha da Métrica de Dobra de Alcubierre',
    sources: ['M. Alcubierre, Classical and Quantum Gravity 11, L73–L77 (1994)', 'Physical Review D'],
  },
  {
    id: 'shannon_entropy',
    keywords: ['entropia de shannon', 'teoria da informacao', 'estabilidade causal', 'monte carlo', 'lyapunov'],
    topic: 'Teoria da Informação & Caos',
    title: 'Entropia de Shannon e Teoria do Caos em Linhas de Tempo',
    didacticAnswer:
      'A Entropia mede quanta incerteza ou desordem existe em um sistema. No nosso laboratório, quando você faz intervenções ou altera nós no tempo, a entropia calcula se o futuro permanece previsível e estável ou se a linha do tempo se divide em um emaranhado de futuros caóticos e imprevisíveis.',
    technicalAnswer:
      'Introduzida por Claude Shannon (1948), a entropia informacional $H(X) = -\\sum P(x_i) \\log_2 P(x_i)$ quantifica a taxa média de incerteza estocástica das microestações causais. Acoplada ao Expoente Máximo de Lyapunov $\\lambda_{max}$, ela avalia a divergência exponencial entre trajetórias temporais adjacentes $\\Delta(t) \\sim \\Delta_0 e^{\\lambda t}$.',
    formula: 'H(X) = -\\sum_{i=1}^n P(x_i) \\log_2 P(x_i), \\quad \\lambda = \\lim_{t\\to\\infty} \\frac{1}{t} \\ln \\frac{|\\delta Z(t)|}{|\\delta Z(0)|}',
    formulaLabel: 'Entropia de Shannon e Expoente de Lyapunov Causal',
    sources: ['C. E. Shannon, Bell System Technical Journal (1948)', 'Strogatz, Nonlinear Dynamics and Chaos (2018)'],
  },
  {
    id: 'nasa_exoplanets',
    keywords: ['exoplaneta', 'exoplanetas', 'planetas fora do sistema solar', 'trappist', 'zona habitavel', 'kepler', 'tess'],
    topic: 'Astrofísica da NASA // The Universe',
    title: 'Exoplanetas e o Censo Planetário da NASA',
    didacticAnswer:
      'Exoplanetas são mundos que orbitam outras estrelas além do nosso Sol. A NASA já confirmou mais de 5.700 exoplanetas, incluindo gigantes gasosos incandescentes, mundos cobertos de oceanos e planetas rochosos de tamanho similar à Terra localizados na Zona Habitável, onde pode haver água líquida.',
    technicalAnswer:
      'Detecção primária por Fotometria de Trânsito ($\Delta F/F = R_p^2/R_*^2$), Velocidade Radial espectroscópica e Microlenteamento Gravitacional. A missão Kepler e o satélite TESS demonstraram que a ocorrência de planetas terrestres em zonas de habitabilidade circunstelar $(\\eta_\\oplus)$ varia de 0,1 a 0,3 ao redor de estrelas do tipo solar e anãs M.',
    formula: '\\frac{\\Delta F}{F} \\approx \\left(\\frac{R_p}{R_*}\\right)^2, \\quad T_{eq} = T_* \\left(\\frac{R_*}{2a}\\right)^{1/2} (1 - A_B)^{1/4}',
    formulaLabel: 'Trânsito Fotométrico e Temperatura de Equilíbrio Planetária',
    sources: ['NASA Exoplanet Archive (science.nasa.gov)', 'Borucki et al., Science (2010)'],
  },
  {
    id: 'nasa_search_for_life',
    keywords: ['vida no universo', 'busca por vida', 'astrobiologia', 'alienigena', 'bioassinatura', 'europa clipper'],
    topic: 'Astrobiologia da NASA // The Universe',
    title: 'A Busca por Vida no Universo (NASA Astrobiology)',
    didacticAnswer:
      'A NASA busca bioassinaturas rastreando os três pilares essenciais: água líquida, fontes de energia e elementos orgânicos. A investigação foca tanto em oceanos ocultos sob luas congeladas do nosso sistema solar (Europa e Encélado) quanto na detecção espectroscópica de gases de desequilíbrio (vapor d’água, metano e ozônio) com o telescópio James Webb.',
    technicalAnswer:
      'Análise de desequilíbrio termoquímico atmosférico multivariado em exoplanetas habitáveis combinando espectroscopia de transmissão e emissão térmica (NIRSpec/MIRI do JWST). No sistema solar, missões in situ como Europa Clipper e Dragonfly mapeiam quimiossíntese sob crostas criogênicas com plumas hidrotermais ativas.',
    formula: 'N = R_* \\cdot f_p \\cdot n_e \\cdot f_l \\cdot f_i \\cdot f_c \\cdot L',
    formulaLabel: 'Equação de Drake para Civilizações e Vida Extraterrestre',
    sources: ['NASA Astrobiology Strategy', 'Seager et al., Astrobiology (2013)'],
  },
  {
    id: 'nasa_dark_matter_energy',
    keywords: ['materia escura', 'energia escura', 'constante cosmologica', 'expansao acelerada', 'rubin', 'bullet cluster'],
    topic: 'Cosmologia da NASA // The Universe',
    title: 'Matéria Escura e Energia Escura: O Universo Invisível',
    didacticAnswer:
      'Tudo o que vemos (estrelas, planetas e nós mesmos) representa menos de 5% do cosmos! Cerca de 27% é Matéria Escura — uma substância invisível com gravidade que mantém as galáxias unidas. Os outros 68% são Energia Escura — uma pressão que estica o próprio espaço e faz o universo se expandir em ritmo acelerado.',
    technicalAnswer:
      'No modelo padrão $\\Lambda\\text{CDM}$, a Matéria Escura Fria (CDM) explica curvas planas de rotação galáctica ($v(r) = \\text{const}$) e o desacoplamento bariônico no Aglomerado da Bala. A Energia Escura é parametrizada pela Constante Cosmológica $\\Lambda$ com equação de estado $w = P/\\rho \\approx -1$, induzindo aceleração $\\ddot{a} > 0$ detectada via Supernovas Ia.',
    formula: '\\Omega_m + \\Omega_\\Lambda + \\Omega_k = 1, \\quad \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3}(\\rho + 3P/c^2) + \\frac{\\Lambda c^2}{3}',
    formulaLabel: 'Densidades Críticas e Equação de Aceleração de Friedmann',
    sources: ['Perlmutter & Riess, Nobel Prize (2011)', 'NASA Roman Space Telescope Cosmology Team'],
  },
];

/**
 * Busca de Alta Eficiência na Base de Conhecimento Local (0 Tokens gastos!)
 */
export function searchKnowledgeBank(query: string): KnowledgeEntry | null {
  if (!query || query.trim().length < 3) return null;
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let bestEntry: KnowledgeEntry | null = null;
  let maxScore = 0;

  for (const entry of AI_KNOWLEDGE_BANK) {
    let score = 0;
    const titleNorm = entry.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (titleNorm.includes(q)) score += 10;

    for (const kw of entry.keywords) {
      const kwNorm = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (q.includes(kwNorm)) score += 5;
      else if (kwNorm.includes(q)) score += 3;
    }

    if (score > maxScore && score >= 5) {
      maxScore = score;
      bestEntry = entry;
    }
  }

  return bestEntry;
}

/**
 * Gera uma Semente Factual Ultracompacta para Injeção no Prompt de LLMs.
 * Evita que o modelo gaste centenas de tokens "alucinando" física básica.
 */
export function getKnowledgeBankSeed(query: string): string | null {
  const match = searchKnowledgeBank(query);
  if (!match) return null;
  return `[BASE_LOCAL_OFFLINE]: ${match.title} | Ref: ${match.formulaLabel || match.topic} | Princípio: ${match.didacticAnswer.slice(0, 120)}...`;
}

/**
 * Sugestões Rápidas para o Usuário
 */
export const POPULAR_COSMIC_QUERIES = [
  'O que é o Princípio de Novikov?',
  'Como funcionam os Cones de Luz?',
  'O que é dilatação temporal gravitacional?',
  'Como funcionam buracos negros de Kerr?',
  'O que o telescópio James Webb descobriu?',
  'É possível criar uma dobra de Alcubierre?',
  'O que é matéria e energia escura?',
];
