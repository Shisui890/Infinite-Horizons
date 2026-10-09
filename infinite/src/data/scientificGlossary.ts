// ====================================================================
// GLOSSÁRIO CIENTÍFICO INTEGRADO: FÍSICA TEÓRICA & HISTÓRIA DA CIÊNCIA
// Contém definições duplas: Modo Didático (analogias) e Modo Acadêmico (rigor tensorial)
// ====================================================================

export interface GlossaryEntry {
  id: string;
  term: string;
  aliases: string[];
  category: 'RELATIVIDADE' | 'QUÂNTICA' | 'TERMODINÂMICA' | 'ASTROFÍSICA' | 'HISTÓRIA DA CIÊNCIA';
  
  // Conteúdo para o Modo Leigo (Iniciantes)
  layman: {
    shortDefinition: string;
    everydayAnalogy: string;
    iconSvg: string;
  };

  // Conteúdo para o Modo Acadêmico (Estudantes Universitários & Pesquisadores)
  academic: {
    formalDefinition: string;
    mathematicalFormula?: string;
    tensorNotation?: string;
    canonicalPaper: {
      author: string;
      year: number;
      title: string;
      journal: string;
      doiOrCitation: string;
    };
    unitsOrDimension?: string;
  };
}

export const SCIENTIFIC_GLOSSARY: Record<string, GlossaryEntry> = {
  entropia: {
    id: 'entropia',
    term: 'Entropia (S)',
    aliases: ['entropia', 'entropia causal', '2ª lei da termodinâmica', 'seta do tempo'],
    category: 'TERMODINÂMICA',
    layman: {
      shortDefinition: 'A medida natural do aumento da desordem e perda de energia utilizável no universo.',
      everydayAnalogy: 'É como a bagunça do seu quarto: deixado sozinho, ele sempre tende a se desarrumar com o tempo; para arrumá-lo de volta, você é obrigado a gastar energia física.',
      iconSvg: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>',
    },
    academic: {
      formalDefinition: 'Grandeza termodinâmica extensiva proporcional ao logaritmo natural do volume hiper-dimensional do espaço de fase acessível ao microestado do sistema (definição de Boltzmann-Gibbs), satisfazendo a inequação de Clausius dS ≥ δQ/T.',
      mathematicalFormula: 'S = k_B \\ln \\Omega = -k_B \\sum_i p_i \\ln p_i  \\quad [\\Delta S_{\\text{universo}} \\ge 0]',
      tensorNotation: '\\nabla_\\mu s^\\mu \\ge 0 \\quad (\\text{4-vetor densidade de corrente de entropia})',
      canonicalPaper: {
        author: 'Boltzmann, Ludwig',
        year: 1877,
        title: 'Über die Beziehung zwischen dem zweiten Hauptsatze der mechanischen Wärmetheorie und der Wahrscheinlichkeitsrechnung',
        journal: 'Wiener Berichte, 76: 373–435',
        doiOrCitation: 'ISBN 978-3-540-42838-1',
      },
      unitsOrDimension: 'J/K (Joule por Kelvin) ou nats / bits em Teoria da Informação de Shannon',
    },
  },

  geodesica: {
    id: 'geodesica',
    term: 'Geodésica',
    aliases: ['geodésica', 'geodésicas', 'trajetória geodésica', 'linha de mundo'],
    category: 'RELATIVIDADE',
    layman: {
      shortDefinition: 'O caminho mais curto e natural que a luz ou um objeto percorre através do espaço-tempo curvado pela gravidade.',
      everydayAnalogy: 'Pense em aviões voando em rotas que parecem curvas no mapa plano, mas que na verdade são a linha mais reta possível sobre a esfera da Terra.',
      iconSvg: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    },
    academic: {
      formalDefinition: 'Curva parametrizada γ(τ) em uma variedade pseudo-riemanniana (M, g) cujo vetor tangente é transportado paralelamente ao longo de si mesmo, minimizando ou tornando estacionário o funcional da ação de comprimento de arco relativístico.',
      mathematicalFormula: '\\frac{d^2 x^\\mu}{d\\lambda^2} + \\Gamma^\\mu_{\\alpha \\beta} \\frac{dx^\\alpha}{d\\lambda} \\frac{dx^\\beta}{d\\lambda} = 0',
      tensorNotation: 'u^\\nu \\nabla_\\nu u^\\mu = 0 \\quad (\\text{com aceleração própria nula } a^\\mu = 0)',
      canonicalPaper: {
        author: 'Einstein, Albert',
        year: 1915,
        title: 'Die Feldgleichungen der Gravitation',
        journal: 'Sitzungsberichte der Königlich Preußischen Akademie der Wissenschaften: 844–847',
        doiOrCitation: 'Bibcode: 1915SPAW.......844E',
      },
      unitsOrDimension: 'Adimensional (trajetória no fibrado tangente TM)',
    },
  },

  cone_de_luz: {
    id: 'cone_de_luz',
    term: 'Cone de Luz de Minkowski',
    aliases: ['cone de luz', 'cones de luz', 'cone de causalidade', 'estrutura causal'],
    category: 'RELATIVIDADE',
    layman: {
      shortDefinition: 'A fronteira invisível que delimita todos os lugares do universo que um acontecimento consegue alcançar ou ser influenciado.',
      everydayAnalogy: 'Imagine acender uma lâmpada no chão: o raio luminoso se abre em cone. Tudo fora desse cone está no escuro absoluto e não pode sofrer impacto daquela luz.',
      iconSvg: '<polygon points="12 2 2 22 22 22 12 2"/>',
    },
    academic: {
      formalDefinition: 'Hipersuperfície nula quadrática gerada pelo conjunto de geodésicas luminosas ds² = 0 originadas em um evento pontual p ∈ M, dividindo o espaço de Minkowski nas regiões tipo-tempo (interior), tipo-luz (borda) e tipo-espaço (exterior alhures).',
      mathematicalFormula: 'ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2 = \\eta_{\\mu\\nu} dx^\\mu dx^\\nu',
      tensorNotation: 'g_{\\mu\\nu} k^\\mu k^\\nu = 0 \\quad (k^\\mu = \\text{4-vetor de onda nulo})',
      canonicalPaper: {
        author: 'Minkowski, Hermann',
        year: 1908,
        title: 'Raum und Zeit',
        journal: 'Physikalische Zeitschrift, 10: 104–111',
        doiOrCitation: 'JFM 40.0698.01',
      },
      unitsOrDimension: 'Geometria pseudo-euclidiana com assinatura Lorentziana (-+++) ou (+---)',
    },
  },

  invariancia_lorentz: {
    id: 'invariancia_lorentz',
    term: 'Invariância de Lorentz',
    aliases: ['invariância de lorentz', 'transformação de lorentz', 'grupo de lorentz', 'so(1,3)'],
    category: 'RELATIVIDADE',
    layman: {
      shortDefinition: 'A lei física que garante que as regras da natureza e a velocidade da luz são rigorosamente iguais para qualquer pessoa, não importa a sua velocidade.',
      everydayAnalogy: 'Se você estiver dentro de um trem bala a 300 km/h sem janelas e jogar uma moeda para cima, ela sobe e desce perfeitamente na sua mão, exatamente igual a como faria parado na sala da sua casa.',
      iconSvg: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
    },
    academic: {
      formalDefinition: 'Simetria global de rotações e empurrões (boosts) sob a ação do grupo de Lie de Lorentz O(1,3) / SO^+(1,3) que preserva a métrica de Minkowski η_μν = Λ^α_μ Λ^β_ν η_αβ, fundamentando a teoria quântica de campos relativística.',
      mathematicalFormula: 'x\'^\\mu = \\Lambda^\\mu_\\nu x^\\nu, \\quad \\det(\\Lambda) = +1, \\quad \\Lambda^0_0 \\ge +1',
      tensorNotation: '\\Lambda^T \\eta \\Lambda = \\eta \\iff \\eta_{\\alpha\\beta} \\Lambda^\\alpha_\\mu \\Lambda^\\beta_\\nu = \\eta_{\\mu\\nu}',
      canonicalPaper: {
        author: 'Lorentz, Hendrik Antoon',
        year: 1904,
        title: 'Electromagnetic phenomena in a system moving with any velocity smaller than that of light',
        journal: 'Proceedings of the Royal Netherlands Academy of Arts and Sciences, 6: 809–831',
        doiOrCitation: 'Bibcode: 1904KNAB....6..809L',
      },
      unitsOrDimension: 'Representação tensorial de dimensão finita (j_L, j_R) de álgebra de Lie so(1,3) ≅ su(2) ⊕ su(2)',
    },
  },

  novikov: {
    id: 'novikov',
    term: 'Autoconsistência de Novikov',
    aliases: ['novikov', 'princípio de novikov', 'autoconsistência de novikov', 'paradoxo do avô'],
    category: 'RELATIVIDADE',
    layman: {
      shortDefinition: 'A regra física que impede paradoxos temporais: se você voltasse no passado, as leis naturais impediriam qualquer ação que destruísse o presente.',
      everydayAnalogy: 'É como tentar pisar na própria sombra da sua cabeça para fazê-la desaparecer: cada movimento que você faz já estava previsto e apenas garante que a sombra continue exatamente lá.',
      iconSvg: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    },
    academic: {
      formalDefinition: 'Princípio formulado por Igor Novikov postulando que em qualquer variedade espaço-temporal admitindo curvas tipo-tempo fechadas (CTCs), apenas soluções globalmente auto-consistentes das equações de campo locais possuem probabilidade não-nula, garantindo P(paradoxo) = 0.',
      mathematicalFormula: '\\mathcal{P}(\\text{história inconsistente}) = 0, \\quad \\oint_{\\text{CTC}} dS = 0',
      tensorNotation: 'S[\\phi] = \\int d^4x \\sqrt{-g} \\mathcal{L}(\\phi, \\partial_\\mu \\phi) \\implies \\delta S = 0 \\text{ com condições periódicas}',
      canonicalPaper: {
        author: 'Novikov, Igor D. et al.',
        year: 1990,
        title: 'Cauchy problem in spacetimes with closed timelike curves',
        journal: 'Physical Review D, 42(6): 1915–1930',
        doiOrCitation: 'doi:10.1103/PhysRevD.42.1915',
      },
      unitsOrDimension: 'Condição topológica de fibrado sobre variedades compactas em tempo S¹',
    },
  },

  ergosfera: {
    id: 'ergosfera',
    term: 'Ergosfera de Kerr',
    aliases: ['ergosfera', 'limite estático', 'processo de penrose', 'arraste de referenciais'],
    category: 'ASTROFÍSICA',
    layman: {
      shortDefinition: 'A região ao redor de um buraco negro giratório onde o próprio espaço se move tão rápido que é impossível ficar parado.',
      everydayAnalogy: 'Imagine uma canoa caindo num redemoinho gigante de água: mesmo remando com toda a força do mundo na direção oposta, a água te força a girar em círculos junto com ela.',
      iconSvg: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="4 2"/>',
    },
    academic: {
      formalDefinition: 'Região externa ao horizonte de eventos de uma métrica de Kerr delimitada pela superfície limite estático r_E(θ) onde o vetor de Killing temporal ξ^μ = (∂/∂t)^μ torna-se do tipo-espaço (ξ^μ ξ_μ = g_00 > 0), permitindo extração de energia rotacional via Processo de Penrose.',
      mathematicalFormula: 'r_E(\\theta) = M + \\sqrt{M^2 - a^2 \\cos^2 \\theta} \\quad (r_+ \\le r \\le r_E)',
      tensorNotation: 'g_{00} = -\\left(1 - \\frac{2Mr}{\\rho^2}\\right) = 0 \\implies r = r_E(\\theta)',
      canonicalPaper: {
        author: 'Kerr, Roy P.',
        year: 1963,
        title: 'Gravitational Field of a Spinning Mass as an Example of Algebraically Special Metrics',
        journal: 'Physical Review Letters, 11(5): 237–238',
        doiOrCitation: 'doi:10.1103/PhysRevLett.11.237',
      },
      unitsOrDimension: 'Raio geométrico em unidades gravitacionais G=c=1 (metros)',
    },
  },

  ondas_gravitacionais: {
    id: 'ondas_gravitacionais',
    term: 'Ondas Gravitacionais',
    aliases: ['ondas gravitacionais', 'ligo', 'chirp gravitacional', 'gw150914'],
    category: 'ASTROFÍSICA',
    layman: {
      shortDefinition: 'Ondulações reais no tecido do espaço-tempo provocadas por colisões violentas de buracos negros ou estrelas no espaço profundo.',
      everydayAnalogy: 'Quando você atira uma pedra pesada em um lago quieto, ondas circulares se espalham pela água. Colisões de buracos negros fazem exatamente o mesmo, mas com o tecido do universo.',
      iconSvg: '<path d="M2 12h2a8 8 0 0 1 8 8v2"/><path d="M2 12a14 14 0 0 1 14 14v0"/><path d="M2 12h20"/>',
    },
    academic: {
      formalDefinition: 'Perturbações tensoriais h_μν na aproximação de campo fraco da métrica de fundo g_μν = η_μν + h_μν que se propagam à velocidade da luz c no calibre transversal sem traço (TT), transportando momento angular e energia radiada via fórmula quadrupolar de Einstein.',
      mathematicalFormula: '\\Box \\bar{h}_{\\mu\\nu} = -\\frac{16\\pi G}{c^4} T_{\\mu\\nu}, \\quad h_{ij}^{\\text{TT}} = h_+ e_{ij}^+ + h_\\times e_{ij}^\\times',
      tensorNotation: '\\nabla^\\alpha \\nabla_\\alpha h_{\\mu\\nu} = 0 \\quad (\\text{em vácuo com } \\partial^\\mu h_{\\mu\\nu} = 0, h^\\mu_\\mu = 0)',
      canonicalPaper: {
        author: 'Abbott, B. P. et al. (LIGO Scientific Collaboration)',
        year: 2016,
        title: 'Observation of Gravitational Waves from a Binary Black Hole Merger',
        journal: 'Physical Review Letters, 116(6): 061102',
        doiOrCitation: 'doi:10.1103/PhysRevLett.116.061102',
      },
      unitsOrDimension: 'Deformação adimensional strain h ~ ΔL / L (ordem de 10⁻²¹ em detectores interferométricos)',
    },
  },

  supercordas: {
    id: 'supercordas',
    term: 'Teoria das Supercordas & Teoria M',
    aliases: ['supercordas', 'teoria das cordas', 'teoria m', 'calabi-yau', '11 dimensões'],
    category: 'QUÂNTICA',
    layman: {
      shortDefinition: 'A teoria que propõe que as menores partículas do universo não são esferas sólidas, mas pequenos laços de energia vibrando como cordas de violino.',
      everydayAnalogy: 'Uma mesma corda de violão pode tocar notas diferentes (dó, ré, mi) dependendo de como vibra. Na física das cordas, uma nota diferente cria um elétron, um fóton ou um graviton.',
      iconSvg: '<path d="M2 12c3-6 7-6 10 0s7 6 10 0"/>',
    },
    academic: {
      formalDefinition: 'Quadro unificado de gravidade quântica que substitui partículas pontuais de dimensão zero por objetos estendidos unidimensionais (cordas com tensão T = 1/(2πα\')), exigindo 10 dimensões no espaço-tempo crítico supersimétrico e 11 dimensões na Teoria M de Witten.',
      mathematicalFormula: 'S_{\\text{Polyakov}} = -\\frac{1}{4\\pi \\alpha\'} \\int d^2\\sigma \\sqrt{-h} h^{ab} \\partial_a X^\\mu \\partial_b X^\\nu g_{\\mu\\nu}',
      tensorNotation: '\\beta^\\mu_\\nu(g) = R_{\\mu\\nu} + 2\\nabla_\\mu \\nabla_\\nu \\Phi - \\frac{1}{4} H_{\\mu\\alpha\\beta} H_\\nu{}^{\\alpha\\beta} + \\mathcal{O}(\\alpha\') = 0',
      canonicalPaper: {
        author: 'Witten, Edward',
        year: 1995,
        title: 'String theory dynamics in various dimensions',
        journal: 'Nuclear Physics B, 443(1-2): 85–126',
        doiOrCitation: 'doi:10.1016/0550-3213(95)00158-O',
      },
      unitsOrDimension: 'Comprimento fundamental de Planck ℓ_s = √(α\') ~ 1.6 × 10⁻³⁵ m',
    },
  },

  redshift: {
    id: 'redshift',
    term: 'Desvio para o Vermelho (Redshift / z)',
    aliases: ['redshift', 'desvio para o vermelho', 'expansão do universo', 'hubble'],
    category: 'ASTROFÍSICA',
    layman: {
      shortDefinition: 'O esticamento das ondas de luz quando uma galáxia está se afastando de nós, fazendo sua cor parecer mais avermelhada.',
      everydayAnalogy: 'Quando uma ambulância passa rápido e se afasta de você, o som da sirene fica mais grave e esticado. Com a luz de estrelas que se afastam, o mesmo acontece: ela estica e vai para o vermelho.',
      iconSvg: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    },
    academic: {
      formalDefinition: 'Parâmetro adimensional z = (λ_obs - λ_emit) / λ_emit que quantifica o alongamento do comprimento de onda de fótons decorrente do fator de escala a(t) na métrica de Friedmann-Lemaître-Robertson-Walker (FLRW), ou devido a campos gravitacionais intensos (redshift gravitacional).',
      mathematicalFormula: '1 + z = \\frac{\\lambda_{\\text{obs}}}{\\lambda_{\\text{emit}}} = \\frac{a(t_{\\text{obs}})}{a(t_{\\text{emit}})} = \\left(1 - \\frac{2GM}{c^2 r}\\right)^{-1/2}',
      tensorNotation: '1 + z = \\frac{(u_\\mu k^\\mu)_{\\text{emit}}}{(u_\\mu k^\\mu)_{\\text{obs}}} \\quad (\\text{com 4-velocidade do observador } u_\\mu)',
      canonicalPaper: {
        author: 'Hubble, Edwin',
        year: 1929,
        title: 'A Relation between Distance and Radial Velocity among Extra-Galactic Nebulae',
        journal: 'PNAS, 15(3): 168–173',
        doiOrCitation: 'doi:10.1073/pnas.15.3.168',
      },
      unitsOrDimension: 'Grandeza adimensional z ∈ (-1, +∞)',
    },
  },

  massa_solar: {
    id: 'massa_solar',
    term: 'Massa Solar (M☉)',
    aliases: ['massa solar', 'm☉', 'massa do sol'],
    category: 'ASTROFÍSICA',
    layman: {
      shortDefinition: 'A unidade padrão que os astrônomos usam para pesar estrelas, galáxias e buracos negros, igual ao peso de 1 Sol.',
      everydayAnalogy: 'Em vez de medir o peso de um elefante em gramas, você usa toneladas. No espaço, em vez de quilos, medimos tudo em "quantos Sóis aquilo pesa".',
      iconSvg: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    },
    academic: {
      formalDefinition: 'Constante astronômica de massa nominal definida pela União Astronômica Internacional (IAU) com valor nominal GM_☉ = 1.3271244 × 10²⁰ m³ s⁻², correspondendo a aproximadamente 1.9884 × 10³⁰ kg (~333.000 vezes a massa da Terra).',
      mathematicalFormula: 'M_\\odot = \\frac{4\\pi^2 (1\\,\\text{AU})^3}{G (1\\,\\text{ano})^2} \\approx 1.988435 \\times 10^{30}\\,\\text{kg}',
      tensorNotation: '\\mu = \\frac{G M_\\odot}{c^2} \\approx 1.477\\,\\text{km} \\quad (\\text{raio gravitacional geométrico do Sol})',
      canonicalPaper: {
        author: 'IAU Resolution B3',
        year: 2015,
        title: 'On recommended nominal conversion constants for selected solar and planetary properties',
        journal: 'International Astronomical Union XXIX General Assembly',
        doiOrCitation: 'arXiv:1510.07674',
      },
      unitsOrDimension: '1.9884 × 10³⁰ kg',
    },
  },
};
