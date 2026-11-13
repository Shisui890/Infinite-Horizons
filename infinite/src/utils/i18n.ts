export type Language = 'pt' | 'en';

export const DICTIONARY = {
  pt: {
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
    view3DLayman: 'Visão 3D',
    kerr3D: 'Kerr 3D',
    academicPaper: 'Artigo',
    cosmicAcoustics: 'Acústica NASA',
    cosmicSoundLayman: 'Som Cósmico',
    timelineSplit: 'Século XXI Split',
    beforeAfterLayman: 'Antes & Depois',
    vintageNewspaper: 'Jornal Histórico',
    vintageNewsLayman: 'Jornal Vintage',
    backtracking: 'Backtracking',
    reverseEngLayman: 'Engenharia Reversa',
    researchArchives: 'Pesquisa & Arquivos',
    aiOracle: 'Oráculo IA',
    cliTerminal: '>_ CLI',
    challenges: 'Desafios',
    splitView: 'Comparador',
    compareLayman: 'Comparar',
    addNode: '+ Nó',
    addEventLayman: '+ Evento',
    addObserver: '+ Obs',
    addTravelerLayman: '+ Viajante',
    intervention: 'Intervenção',
    jumpLayman: 'Salto',
    shareLink: 'Compartilhar Link',
    linkShort: 'Link',
    copied: 'Copiado!',
    export: 'Exportar',
    exportLatex: 'Artigo LaTeX & Prévia',
    exportBibtex: 'Bibliografia BibTeX (.bib)',
    exportPdf: 'Relatório PDF / Imprimir',
    exportPoster: 'Poster 4K',
    timeScrubber: 'MÁQUINA DO TEMPO:',
    present: 'PRESENTE',
    play: 'REPRODUZIR',
    pause: 'PAUSAR',
    speed: 'Velocidade:',
    linkCopied: 'Link do universo copiado para a área de transferência!',
  },
  en: {
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
    view3DLayman: '3D View',
    kerr3D: 'Kerr 3D',
    academicPaper: 'Paper',
    cosmicAcoustics: 'NASA Acoustics',
    cosmicSoundLayman: 'Cosmic Sound',
    timelineSplit: '21st Century Split',
    beforeAfterLayman: 'Before & After',
    vintageNewspaper: 'Historical Press',
    vintageNewsLayman: 'Vintage News',
    backtracking: 'Backtracking',
    reverseEngLayman: 'Reverse Eng.',
    researchArchives: 'Research & Archives',
    aiOracle: 'AI Oracle',
    cliTerminal: '>_ CLI',
    challenges: 'Challenges',
    splitView: 'Compare',
    compareLayman: 'Compare',
    addNode: '+ Node',
    addEventLayman: '+ Event',
    addObserver: '+ Obs',
    addTravelerLayman: '+ Traveler',
    intervention: 'Intervention',
    jumpLayman: 'Time Jump',
    shareLink: 'Share Link',
    linkShort: 'Link',
    copied: 'Copied!',
    export: 'Export',
    exportLatex: 'LaTeX Paper & Preview',
    exportBibtex: 'BibTeX Bibliography (.bib)',
    exportPdf: 'PDF Report / Print',
    exportPoster: '4K Poster',
    timeScrubber: 'TIME MACHINE:',
    present: 'PRESENT',
    play: 'PLAY',
    pause: 'PAUSE',
    speed: 'Speed:',
    linkCopied: 'Universe link copied to clipboard!',
  },
};

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
