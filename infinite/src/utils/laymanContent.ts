export interface LaymanEventExplanation {
  simpleTitle: string;
  simpleDescription: string;
  popCultureRef: string;
  analogy: string;
  funFact: string;
  laymanCategory: string;
}

export const LAYMAN_EXPLANATIONS_BY_YEAR: Record<number, LaymanEventExplanation> = {
  1865: {
    simpleTitle: 'Como a Eletricidade e o Magnetismo Criam a Luz',
    simpleDescription: 'James Clerk Maxwell descobriu que eletricidade e magnetismo não são forças separadas, mas duas faces da mesma moeda. Ao juntar essas forças em equações matemáticas, ele descobriu algo incrível: as ondas eletromagnéticas viajam exatamente na velocidade da luz (300.000 km/s), provando que a própria luz visível, o rádio e os raios-X são todos a mesma manifestação da natureza.',
    popCultureRef: 'Exemplo: É o princípio físico que permite a existência de lasers, telecomunicações, satélites e energia elétrica.',
    analogy: 'Pense em dois remadores sincronizados num caiaque: o campo elétrico empurra o campo magnético, que por sua vez empurra o elétrico de volta, impulsionando a onda de luz pelo vácuo sem precisar de nenhum suporte material.',
    funFact: 'Essa descoberta permitiu a invenção do rádio, do radar, da televisão, do Wi-Fi e de toda a tecnologia de comunicação sem fio moderna.',
    laymanCategory: 'ELETROMAGNETISMO E LUZ',
  },
  1887: {
    simpleTitle: 'O Mistério do Vento do Éter Inexistente (Experimento de Michelson-Morley)',
    simpleDescription: 'Cientistas acreditavam que a luz precisava de uma substância invisível preenchendo todo o espaço chamada "éter luminífero" para viajar, assim como o som precisa do ar. Em 1887, Albert Michelson e Edward Morley construíram um detector óptico ultrapreciso para medir o "vento do éter" provocado pelo movimento da Terra ao redor do Sol. O resultado chocou a comunidade científica: a velocidade do vento do éter era exatamente zero! A luz viajava na mesma velocidade em qualquer direção. Esse resultado nulo criou o maior mistério da física do século XIX, preparando o terreno direto para Albert Einstein.',
    popCultureRef: 'Exemplo: O experimento com o resultado negativo mais famoso, revolucionário e importante de toda a história da ciência.',
    analogy: 'Imagine que você coloca a cabeça para fora da janela de um carro correndo a 120 km/h na rodovia, mas não sente absolutamente nenhuma brisa de vento no rosto. Os cientistas esperavam sentir o vento do éter cósmico pelo movimento da Terra, mas o universo não tinha vento algum!',
    funFact: 'O interferômetro era tão incrivelmente sensível que precisou ser montado sobre uma laje de pedra maciça flutuando em uma piscina de mercúrio líquido para evitar que os passos das pessoas na calçada atrapalhassem as medições.',
    laymanCategory: 'A CRISE DO ÉTER',
  },
  1905: {
    simpleTitle: 'Por Que o Tempo e o Espaço Não São Fixos (Relatividade Especial)',
    simpleDescription: 'Albert Einstein resolveu o mistério do experimento de 1887 de forma genial: o éter simplesmente não existe! Ele percebeu que a velocidade da luz no vácuo é invariante e constante para qualquer observador no universo, não importando a velocidade com que você se mova. Para que isso seja verdade, o tempo e o espaço deixam de ser rígidos: se você viajar numa nave a 99% da velocidade da luz, o seu relógio andará muito mais devagar e o tamanho da sua nave encolherá em relação a quem ficou parado na Terra.',
    popCultureRef: 'Exemplo: No filme Interestelar, viajar em alta velocidade ou perto de muita gravidade faz horas de viagem equivalerem a anos na Terra.',
    analogy: 'Imagine que você tem uma cota fixa de movimento total. Se você gasta quase toda essa cota correndo em altíssima velocidade pelo espaço, sobra quase nada de cota para você avançar no tempo, fazendo seu envelhecimento quase congelar.',
    funFact: 'Os satélites de GPS em órbita se movem tão rápido que seus computadores precisam corrigir essa diferença no tempo todos os dias, senão o seu mapa erraria a sua localização por vários quilômetros!',
    laymanCategory: 'TEMPO E VELOCIDADE',
  },

  1915: {
    simpleTitle: 'A Gravidade Como Deformação do Espaço-Tempo (Relatividade Geral)',
    simpleDescription: 'Einstein revolucionou nossa visão do cosmos ao mostrar que a gravidade não é um puxão invisível entre objetos, mas sim a curvatura que corpos pesados causam no próprio tecido do espaço e do tempo. O Sol não puxa a Terra diretamente: o Sol afunda o espaço ao seu redor, e a Terra simplesmente segue o caminho natural e curvado dentro desse afundamento.',
    popCultureRef: 'Exemplo: É a teoria que explica por que buracos negros existem e como lentes gravitacionais ampliam galáxias distantes no telescópio James Webb.',
    analogy: 'Coloque uma bola de boliche pesada no centro de uma cama elástica: ela cria uma depressão profunda no tecido. Se você rolar uma bolinha de gude na cama elástica, ela fará uma curva ao redor da bola de boliche, exatamente como os planetas orbitam o Sol.',
    funFact: 'Perto de um objeto extremamente pesado como a Terra ou o Sol, o próprio tempo passa mais devagar. No topo do Monte Everest, o tempo corre ligeiramente mais rápido do que no nível do mar!',
    laymanCategory: 'GRAVIDADE E ESPAÇO-TEMPO',
  },
  1935: {
    simpleTitle: 'Atalhos no Espaço e a Conexão Quântica (Buracos de Minhoca e EPR)',
    simpleDescription: 'Einstein e seus colegas descobriram duas possibilidades fascinantes: primeiro, que o espaço-tempo pode se dobrar tanto que conecta dois pontos muito distantes através de um túnel (buraco de minhoca); segundo, que duas partículas minúsculas podem se tornar tão entrelaçadas que qualquer alteração em uma afeta a outra instantaneamente, não importa a distância.',
    popCultureRef: 'Exemplo: A ideia clássica de portais espaciais que conectam lados opostos do universo em segundos sem violar as leis da física.',
    analogy: 'Desenhe dois pontos em lados opostos de uma folha de papel. Em vez de andar pela folha toda, dobre o papel até que os dois pontos se toquem e atravesse-os com a ponta de um lápis. Você acabou de criar um atalho no espaço.',
    funFact: 'O fenômeno do entrelaçamento quântico é real e comprovado em laboratório, sendo a base fundamental para a criação dos futuros computadores quânticos ultravelozes.',
    laymanCategory: 'ATALHOS E CONEXÕES QUÂNTICAS',
  },
  1965: {
    simpleTitle: 'O Eco Térmico do Big Bang (Radiação Cósmica de Fundo)',
    simpleDescription: 'Dois astrônomos detectaram acidentalmente um sinal de micro-ondas vindo de todas as direções do universo com a mesma intensidade. Eles haviam acabado de descobrir o calor residual que sobrou da grande expansão inicial do cosmos ocorrida há 13,8 bilhões de anos, a prova definitiva de que o universo teve um começo.',
    popCultureRef: 'Exemplo: A certidão de nascimento do nosso cosmos fotografada pelos satélites WMAP e Planck.',
    analogy: 'É exatamente como entrar em uma sala onde havia uma fogueira gigantesca horas atrás: mesmo depois que o fogo apagou, as paredes e o ar ainda guardam uma temperatura suave e morna daquela queima inicial.',
    funFact: 'Nas televisões de tubo antigas sem sinal, cerca de 1% do chiado na tela preta e branca era literalmente o sinal dessa radiação primordial sendo captado pela antena da sua casa.',
    laymanCategory: 'ORIGEM DO COSMOS',
  },
  1984: {
    simpleTitle: 'A Matéria Como Vibração Musical (Teoria das Supercordas)',
    simpleDescription: 'A física sempre imaginou os átomos e partículas fundamentais como pontinhos sólidos e duros. A Teoria das Cordas propõe algo mais elegante: no fundo de tudo, cada partícula é um filamento elástico minúsculo que vibra. Conforme a corda vibra de maneiras diferentes, ela cria partículas de matéria, partículas de luz ou a própria gravidade.',
    popCultureRef: 'Exemplo: A busca pela "Teoria de Tudo", uma única fórmula capaz de explicar todas as forças da natureza juntas.',
    analogy: 'Pense numa corda de violino: quando você toca a corda, uma vibração gera uma nota aguda (como um elétron); outra vibração gera uma nota grave (como um quark). Toda a matéria do universo seria como uma grande sinfonia cósmica.',
    funFact: 'Para que as equações matemáticas das cordas funcionem perfeitamente sem gerar contradições, o universo precisa ter 10 dimensões no total, com 6 delas enroladas em tamanhos subatômicos invisíveis.',
    laymanCategory: 'ESTRUTURA DA MATÉRIA',
  },
  1995: {
    simpleTitle: 'O Hiperespaço e as 11 Dimensões (Teoria M)',
    simpleDescription: 'O físico Edward Witten unificou as cinco versões diferentes da teoria das cordas em uma estrutura única mais ampla, chamada Teoria M. Ela demonstrou que vivemos em um universo de 11 dimensões no qual as cordas podem se expandir e formar membranas cósmicas gigantescas flutuando no hiperespaço.',
    popCultureRef: 'Exemplo: A base teórica de universos paralelos onde realidades distintas coexistem lado a lado separadas por dimensões extras.',
    analogy: 'Imagine formigas que só conseguem andar na superfície plana de uma mesa: elas acham que o mundo tem apenas duas dimensões (frente e lados), sem nunca perceber a altura (terceira dimensão) acima ou abaixo delas.',
    funFact: 'Alguns físicos teorizam que colisões entre membranas cósmicas vizinhas no hiperespaço de 11 dimensões podem ser o gatilho que cria novos Big Bangs.',
    laymanCategory: 'DIMENSÕES EXTRAS',
  },
  1997: {
    simpleTitle: 'O Princípio Holográfico do Cosmos (Correspondência AdS/CFT)',
    simpleDescription: 'Juan Maldacena descobriu uma das pontes matemáticas mais profundas da física: um universo tridimensional com gravidade e buracos negros pode ser perfeitamente equivalente a um conjunto de leis da física quântica gravadas apenas na borda bidimensional desse mesmo universo.',
    popCultureRef: 'Exemplo: A ideia de que nossa percepção tridimensional pode ser a projeção de informações armazenadas nos limites do espaço.',
    analogy: 'Pense em um holograma num cartão de crédito: a superfície do plástico é completamente plana (2D), mas quando a luz incide nela, você enxerga uma imagem tridimensional perfeita com profundidade.',
    funFact: 'Isso sugere que a gravidade e o próprio espaço podem não ser fundamentais, mas sim propriedades emergentes geradas por informações quânticas mais simples.',
    laymanCategory: 'HOLOGRAMA E INFORMAÇÃO',
  },
  1998: {
    simpleTitle: 'A Força Invisível Que Estica o Cosmos (Energia Escura)',
    simpleDescription: 'Observando supernovas em galáxias distantes, os astrônomos esperavam ver o universo desacelerando sua expansão devido à atração da gravidade. Em vez disso, descobriram que a expansão está acelerando cada vez mais rápido, impulsionada por uma energia misteriosa que preenche todo o vácuo do espaço.',
    popCultureRef: 'Exemplo: O maior enigma da cosmologia moderna, responsável por determinar o destino final do universo.',
    analogy: 'Imagine jogar uma bola pesada para cima e, em vez de ela desacelerar e cair no chão, você a vê disparando cada vez mais rápido em direção ao céu.',
    funFact: 'Essa energia misteriosa representa cerca de 68% de toda a energia e matéria de todo o cosmos, e a humanidade ainda está investigando qual é a sua verdadeira origem.',
    laymanCategory: 'EXPANSÃO DO UNIVERSO',
  },
  2003: {
    simpleTitle: 'Inúmeras Maneiras de Construir Leis da Física (Multiverso de Cordas)',
    simpleDescription: 'Descobriu-se que as dimensões extras da teoria das cordas podem se dobrar e se compactar de aproximadamente 10⁵⁰⁰ configurações geométricas diferentes. Cada configuração gera um universo com leis, massas de partículas e constantes físicas distintas, formando um vasto panorama de possíveis realidades.',
    popCultureRef: 'Exemplo: A explicação física para o ajuste fino do nosso universo, onde as constantes permitiram o surgimento de estrelas, planetas e vida.',
    analogy: 'Pense num conjunto infinito de peças de montar: dependendo de como as peças são encaixadas, você pode construir um castelo onde a gravidade é forte, outro onde átomos não se formam e o nosso, onde a química e a vida são possíveis.',
    funFact: '10⁵⁰⁰ é um número com quinhentos zeros, muito maior do que a quantidade total de átomos existentes em todo o universo observável.',
    laymanCategory: 'PANORAMA DO MULTIVERSO',
  },
  2013: {
    simpleTitle: 'A Ponte Entre a Gravidade e a Física Quântica (ER = EPR)',
    simpleDescription: 'Os físicos Juan Maldacena e Leonard Susskind propuseram que o entrelaçamento quântico (onde duas partículas se comunicam instantaneamente) e os buracos de minhoca (túneis no espaço-tempo) são na verdade o mesmo fenômeno em escalas diferentes: micro-túneis conectam as partículas entrelaçadas.',
    popCultureRef: 'Exemplo: O elo que finalmente aproxima a física de Einstein (que rege estrelas e galáxias) da física quântica (que rege os átomos).',
    analogy: 'Imagine duas ilhas separadas por um oceano que parecem desconectadas na superfície, mas que possuem uma ponte subterrânea sólida sob o fundo do mar ligando seus porões diretamente.',
    funFact: 'Se essa hipótese estiver correta, o próprio tecido contínuo do espaço-tempo pode ser "costurado" e mantido unido pelo entrelaçamento quântico das partículas fundamentais.',
    laymanCategory: 'UNIFICAÇÃO DA FÍSICA',
  },
  2015: {
    simpleTitle: 'Ondulações no Tecido do Espaço-Tempo (Ondas Gravitacionais)',
    simpleDescription: 'A 1,3 bilhão de anos-luz de distância, dois buracos negros gigantes giraram um ao redor do outro e colidiram a metade da velocidade da luz. O impacto foi tão violento que fez o próprio espaço-tempo vibrar em ondas que viajaram pelo cosmos até chegarem aos sensores ultraprecisos do observatório LIGO na Terra.',
    popCultureRef: 'Exemplo: Como passar de uma astronomia que apenas "enxergava" a luz para uma astronomia que agora consegue "escutar" o próprio movimento do espaço.',
    analogy: 'Quando você atira uma pedra pesada em um lago calmo, círculos de ondas se propagam pela superfície da água. Quando corpos ultra-pesados colidem no cosmos, o próprio espaço estica e encolhe em ondas idênticas.',
    funFact: 'A deformação que passou pela Terra foi tão minúscula que esticou os detectores a laser do LIGO por uma distância mil vezes menor do que o núcleo de um átomo!',
    laymanCategory: 'SOM DO ESPAÇO-TEMPO',
  },
  2019: {
    simpleTitle: 'A Primeira Imagem da Borda de um Buraco Negro (M87*)',
    simpleDescription: 'Cientistas de todo o planeta conectaram oito radiotelescópios espalhados pelo globo para criar um telescópio virtual do tamanho da própria Terra. Eles conseguiram capturar a primeira imagem real da sombra e do anel de luz incandescente ao redor do horizonte de eventos de um buraco negro supermassivo na galáxia M87.',
    popCultureRef: 'Exemplo: A confirmação visual direta de uma previsão feita pela teoria da relatividade mais de um século antes.',
    analogy: 'A precisão necessária para tirar essa foto foi equivalente a conseguir fotografar com nitidez uma bolinha de gude na superfície da Lua a partir da sua casa na Terra.',
    funFact: 'O buraco negro fotografado tem uma massa equivalente a 6,5 bilhões de sóis juntos, e seu horizonte de eventos é maior do que todo o nosso Sistema Solar.',
    laymanCategory: 'OBSERVAÇÃO DIRETA',
  },
};

export function getLaymanExplanation(year: number, title?: string): LaymanEventExplanation {
  if (LAYMAN_EXPLANATIONS_BY_YEAR[year]) {
    return LAYMAN_EXPLANATIONS_BY_YEAR[year];
  }

  return {
    simpleTitle: title || 'Marco Científico Fundamental',
    simpleDescription: 'Uma descoberta decisiva que revelou como as leis da física e a geometria do espaço-tempo moldam a estrutura e a evolução do cosmos.',
    popCultureRef: 'Exemplo: Um momento de virada na compreensão científica da natureza.',
    analogy: 'Como uma nova lente que permite enxergar detalhes antes invisíveis na engrenagem do universo.',
    funFact: 'Cada grande avanço na física teórica abriu portas para novas tecnologias que transformaram o cotidiano da humanidade.',
    laymanCategory: 'CONCEITO CÓSMICO',
  };
}
