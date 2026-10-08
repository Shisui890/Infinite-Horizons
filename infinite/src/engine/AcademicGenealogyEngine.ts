// ====================================================================
// MOTOR DE LINHAGENS ACADÊMICAS & REDE DE MENTORIA CIENTÍFICA
// Mapeia genealogia acadêmica, escolas de pensamento e transmissão epistêmica
// ====================================================================

export interface AcademicMentor {
  id: string;
  name: string;
  institution: string;
  centuryOrYear: string;
  specialty: string;
}

export interface AcademicLineageNode {
  eventId: string;
  primaryPioneer: string;
  institution: string;
  mentors: AcademicMentor[];
  disciples: AcademicMentor[];
  schoolOfThought: string;
  epistemicLineageChain: string[];
}

export class AcademicGenealogyEngine {
  private static lineageDatabase: Record<string, AcademicLineageNode> = {
    // Michelson-Morley
    'michelson': {
      eventId: 'evt-michelson-morley',
      primaryPioneer: 'Albert A. Michelson & Edward W. Morley',
      institution: 'Case Western Reserve University & Clark University',
      schoolOfThought: 'Metrologia Óptica Experimental e Interferometria de Precisão',
      mentors: [
        { id: 'm-helmholtz', name: 'Hermann von Helmholtz', institution: 'Universidade de Berlim', centuryOrYear: '1880 d.C.', specialty: 'Termodinâmica & Eletrodinâmica' },
        { id: 'm-quincke', name: 'Georg Hermann Quincke', institution: 'Universidade de Heidelberg', centuryOrYear: '1881 d.C.', specialty: 'Óptica Ondulatória' },
      ],
      disciples: [
        { id: 'd-millikan', name: 'Robert A. Millikan', institution: 'Universidade de Chicago', centuryOrYear: '1895 d.C.', specialty: 'Carga Elementar do Elétron' },
        { id: 'd-pease', name: 'Francis G. Pease', institution: 'Observatório Monte Wilson', centuryOrYear: '1920 d.C.', specialty: 'Diâmetros Estelares Interferométricos' },
      ],
      epistemicLineageChain: ['Helmholtz (Berlim)', 'Michelson (Case/Chicago)', 'Millikan (Nobel 1923)', 'Pease (Monte Wilson)'],
    },

    // Relatividade / Einstein
    'einstein': {
      eventId: 'evt-relativity',
      primaryPioneer: 'Albert Einstein',
      institution: 'ETH Zürich & Instituto de Estudos Avançados de Princeton',
      schoolOfThought: 'Geometria Diferencial do Espaço-Tempo & Teoria Quântica',
      mentors: [
        { id: 'm-weber', name: 'Heinrich Friedrich Weber', institution: 'ETH Zürich', centuryOrYear: '1898 d.C.', specialty: 'Termodinâmica & Eletromagnetismo' },
        { id: 'm-minkowski', name: 'Hermann Minkowski', institution: 'Universidade de Göttingen', centuryOrYear: '1900 d.C.', specialty: 'Geometria Quadridimensional' },
      ],
      disciples: [
        { id: 'd-wheeler', name: 'John Archibald Wheeler', institution: 'Universidade de Princeton', centuryOrYear: '1938 d.C.', specialty: 'Geometrodinâmica & Buracos Negros' },
        { id: 'd-rosen', name: 'Nathan Rosen', institution: 'Instituto de Estudos Avançados', centuryOrYear: '1935 d.C.', specialty: 'Pontes de Einstein-Rosen' },
      ],
      epistemicLineageChain: ['Minkowski (Göttingen)', 'Einstein (ETH/IAS)', 'Wheeler (Princeton)', 'Kip Thorne & Feynman (Caltech)'],
    },

    // Radar / Micro-ondas
    'radar': {
      eventId: 'evt-radar',
      primaryPioneer: 'Sir Robert Watson-Watt, John Randall & Harry Boot',
      institution: 'Universidade de Birmingham & Radiation Laboratory do MIT',
      schoolOfThought: 'Eletrodinâmica Aplicada de Alta Potência & Telecomunicação SHF',
      mentors: [
        { id: 'm-oliphant', name: 'Sir Mark Oliphant', institution: 'Universidade de Birmingham', centuryOrYear: '1938 d.C.', specialty: 'Física Nuclear e Tubos de Vácuo' },
        { id: 'm-rutherford', name: 'Ernest Rutherford', institution: 'Laboratório Cavendish (Cambridge)', centuryOrYear: '1910 d.C.', specialty: 'Estrutura Atômica' },
      ],
      disciples: [
        { id: 'd-bowen', name: 'Edward George Bowen', institution: 'CSIRO Radiophysics', centuryOrYear: '1946 d.C.', specialty: 'Radioastronomia Australiana' },
        { id: 'd-purcell', name: 'Edward Mills Purcell', institution: 'Radiation Lab (MIT) / Harvard', centuryOrYear: '1945 d.C.', specialty: 'Ressonância Magnética Nuclear (RMN)' },
      ],
      epistemicLineageChain: ['Rutherford (Cavendish)', 'Oliphant (Birmingham)', 'Randall & Boot (Magnetron)', 'Purcell (RMN / Harvard)'],
    },

    // Maxwell / Eletromagnetismo
    'maxwell': {
      eventId: 'evt-maxwell',
      primaryPioneer: 'James Clerk Maxwell',
      institution: 'Laboratório Cavendish & King\'s College London',
      schoolOfThought: 'Teoria Eletromagnética Clássica e Dinâmica Estatística',
      mentors: [
        { id: 'm-faraday', name: 'Michael Faraday', institution: 'Royal Institution of Great Britain', centuryOrYear: '1850 d.C.', specialty: 'Linhas de Força e Indução' },
        { id: 'm-hopkins', name: 'William Hopkins', institution: 'Universidade de Cambridge', centuryOrYear: '1854 d.C.', specialty: 'Matemática Aplicada e Geologia Física' },
      ],
      disciples: [
        { id: 'd-heaviside', name: 'Oliver Heaviside', institution: 'Pesquisador Independente / IEE', centuryOrYear: '1884 d.C.', specialty: 'Cálculo Vetorial e Equações de Maxwell Reduzidas' },
        { id: 'd-poynting', name: 'John Henry Poynting', institution: 'Universidade de Birmingham', centuryOrYear: '1884 d.C.', specialty: 'Vetor de Poynting & Fluxo de Energia' },
      ],
      epistemicLineageChain: ['Faraday (Royal Institution)', 'Maxwell (Cavendish)', 'Heaviside & Poynting', 'Hertz (Detecção de Ondas)'],
    },

    // Foguetes / Pólvora
    'rocket': {
      eventId: 'evt-rocketry',
      primaryPioneer: 'Robert H. Goddard, Konstantin Tsiolkovsky & Alquimistas da Dinastia Song',
      institution: 'Clark University & Instituto Smithsoniano',
      schoolOfThought: 'Balística de Reação e Mecânica de Massa Variável',
      mentors: [
        { id: 'm-mach', name: 'Ernst Mach', institution: 'Universidade de Praga', centuryOrYear: '1887 d.C.', specialty: 'Ondas de Choque e Aerodinâmica Supersônica' },
        { id: 'm-newton', name: 'Isaac Newton (Princípios Fundamentais)', institution: 'Universidade de Cambridge', centuryOrYear: '1687 d.C.', specialty: '3ª Lei do Movimento' },
      ],
      disciples: [
        { id: 'd-malina', name: 'Frank Malina', institution: 'Caltech / JPL', centuryOrYear: '1940 d.C.', specialty: 'Motores WAC Corporal e Fundação do JPL' },
        { id: 'd-oberth', name: 'Hermann Oberth', institution: 'Universidade de Heidelberg', centuryOrYear: '1923 d.C.', specialty: 'Foguetes Interplanetários' },
      ],
      epistemicLineageChain: ['Tsiolkovsky (Rússia)', 'Goddard (Smithsonian)', 'Malina & von Kármán (JPL)', 'Engenharia da Missão Apollo'],
    },
  };

  /**
   * Localiza a linhagem acadêmica associada a um evento com base em seu título ou descrição
   */
  public static getLineageForEvent(title: string, description: string = ''): AcademicLineageNode | null {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes('michelson') || text.includes('morley') || text.includes('éter') || text.includes('ether')) {
      return this.lineageDatabase['michelson'];
    }
    if (text.includes('relativid') || text.includes('einstein') || text.includes('gravita')) {
      return this.lineageDatabase['einstein'];
    }
    if (text.includes('radar') || text.includes('magnetron') || text.includes('micro-onda')) {
      return this.lineageDatabase['radar'];
    }
    if (text.includes('maxwell') || text.includes('eletromag') || text.includes('hertz')) {
      return this.lineageDatabase['maxwell'];
    }
    if (text.includes('rocket') || text.includes('foguete') || text.includes('propuls') || text.includes('pólvora')) {
      return this.lineageDatabase['rocket'];
    }

    // Gerador genérico para outros marcos científicos
    return {
      eventId: 'evt-generic',
      primaryPioneer: title,
      institution: 'Acervo Historiográfico Internacional',
      schoolOfThought: 'Tradição Experimental e Matemática Moderna',
      mentors: [
        { id: 'm-gen-1', name: 'Antecessores Empíricos do Iluminismo', institution: 'Sociedades Científicas Europeias', centuryOrYear: 'Século XVIII d.C.', specialty: 'Filosofia Natural' },
      ],
      disciples: [
        { id: 'd-gen-1', name: 'Pesquisadores Contemporâneos Derivados', institution: 'Institutos Tecnológicos do Século XX', centuryOrYear: 'Século XX d.C.', specialty: 'Ciência Aplicada' },
      ],
      epistemicLineageChain: ['Filosofia Natural', title, 'Aplicações Tecnológicas Contemporâneas'],
    };
  }

  /**
   * Alias de conveniência que recebe um evento temporal diretamente
   */
  public static resolveLineage(event: { title: string; description?: string }): AcademicLineageNode {
    return this.getLineageForEvent(event.title, event.description || '')!;
  }
}
