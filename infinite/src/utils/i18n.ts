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
    aiOracle: 'Oráculo IA',
    cliTerminal: '>_ CLI',
    challenges: 'Desafios',
    splitView: 'Comparador',
    addNode: '+ Nó',
    addObserver: '+ Obs',
    intervention: 'Intervenção',
    shareLink: 'Compartilhar Link',
    export: 'Exportar',
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
    aiOracle: 'AI Oracle',
    cliTerminal: '>_ CLI',
    challenges: 'Challenges',
    splitView: 'Compare',
    addNode: '+ Node',
    addObserver: '+ Obs',
    intervention: 'Intervention',
    shareLink: 'Share Link',
    export: 'Export',
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
