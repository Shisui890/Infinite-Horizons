// ====================================================================
// LABORATÓRIO ACÚSTICO ESPACIAL: SONIFICAÇÃO DE SINAIS ASTROFÍSICOS DA NASA
// Síntese em tempo real com Web Audio API nativa
// ====================================================================

export interface CosmicSignal {
  id: string;
  name: string;
  sourceBody: string;
  observatory: string;
  yearRecorded: number;
  frequencyRange: string;
  distanceLightYears: string;
  laymanDescription: string;
  laymanAnalogy: string;
  academicPhysics: string;
  academicCitation: {
    author: string;
    year: number;
    title: string;
    journal: string;
    doi: string;
  };
}

export const COSMIC_SIGNALS: CosmicSignal[] = [
  {
    id: 'ligo',
    name: 'Ondas Gravitacionais (GW150914)',
    sourceBody: 'Fusão de Dois Buracos Negros (36 M☉ + 29 M☉)',
    observatory: 'Interferômetro LIGO (Hanford & Livingston)',
    yearRecorded: 2015,
    frequencyRange: '35 Hz a 250 Hz (Chirp Exponencial)',
    distanceLightYears: '1,3 Bilhões de anos-luz',
    laymanDescription: 'O som real do próprio tecido do espaço e do tempo tremendo violentamente enquanto dois buracos negros gigantes giram e colidem.',
    laymanAnalogy: 'Parece o piado de um pássaro ("chirp") ou uma gota caindo em um lago profundo que acelera rapidamente antes de sumir no silêncio.',
    academicPhysics: 'Radiação gravitacional quadrupolar emitida na fase de inspiralamento relativístico tardio (ISCO) e coalescência de buracos negros binários de Kerr, culminando no estado de ringdown amortecido por quase-modos normais.',
    academicCitation: {
      author: 'Abbott, B. P. et al. (LIGO Scientific Collaboration)',
      year: 2016,
      title: 'Observation of Gravitational Waves from a Binary Black Hole Merger',
      journal: 'Physical Review Letters, 116(6): 061102',
      doi: 'doi:10.1103/PhysRevLett.116.061102',
    },
  },
  {
    id: 'pulsar',
    name: 'Pulsar do Caranguejo (PSR B0531+21)',
    sourceBody: 'Estrela de Nêutrons Magnética Remanescente de Supernova',
    observatory: 'Radiotelescópio de Arecibo & Observatório Green Bank',
    yearRecorded: 1968,
    frequencyRange: '30,2 Hz (Período P = 33,08 ms)',
    distanceLightYears: '6.500 anos-luz',
    laymanDescription: 'O bater rítmico frenético de uma estrela do tamanho de uma cidade, girando mais de 30 vezes a cada segundo no espaço.',
    laymanAnalogy: 'Lembra o motor acelerado de um helicóptero ou de uma turbina distante, batendo com a precisão de um relógio atômico cósmico.',
    academicPhysics: 'Emissão coerente de curvatura síncrotron e perda de momento angular rotacional eletrodinâmico (spin-down dipole radiation) em uma magnetosfera relativística com campo dipolar de 3,8 × 10¹² Gauss.',
    academicCitation: {
      author: 'Staelin, David H. & Reifenstein, Edward C.',
      year: 1968,
      title: 'Pulsating Radio Sources Near the Crab Nebula',
      journal: 'Science, 162(3861): 1481–1483',
      doi: 'doi:10.1126/science.162.3861.1481',
    },
  },
  {
    id: 'jupiter',
    name: 'Ondas de Plasma da Magnetosfera de Júpiter',
    sourceBody: 'Cinturão de Radiação & Torus de Íons de Io em Júpiter',
    observatory: 'Sondas Espaciais Voyager 1 (1979) e Juno (2016) / NASA',
    yearRecorded: 1979,
    frequencyRange: '300 Hz a 1.800 Hz (Modos Whistler / Silvios)',
    distanceLightYears: '43 minutos-luz (628 Milhões de km da Terra)',
    laymanDescription: 'Sons misteriosos semelhantes a assobios extraterrestres que viajam pelas gigantescas tempestades elétricas e pelo campo magnético de Júpiter.',
    laymanAnalogy: 'Parece o som de raios laser de ficção científica ou o canto fantasmagórico de baleias ecoando no fundo do oceano.',
    academicPhysics: 'Ondas eletromagnéticas de modo Whistler em plasma frio dispersivo geradas por descargas elétricas atmosféricas, propagando-se ao longo das linhas do tensor dipolar magnético com dispersão D = t √f.',
    academicCitation: {
      author: 'Scarf, F. L., Gurnett, D. A. & Kurth, W. S.',
      year: 1979,
      title: 'Jupiter\'s Plasma Wave Environment: First Results from Voyager 1',
      journal: 'Science, 204(4396): 991–995',
      doi: 'doi:10.1126/science.204.4396.991',
    },
  },
  {
    id: 'cmb',
    name: 'Eco Primordial do Big Bang (Radiação Cósmica de Fundo)',
    sourceBody: 'Superfície de Último Espalhamento Fóton-Bárion (380.000 anos após o Big Bang)',
    observatory: 'Radiotelescópio Bell Labs (Penzias & Wilson 1965) / Satélite Planck (ESA/NASA)',
    yearRecorded: 1965,
    frequencyRange: 'Ruído Térmico Negro 160,2 GHz transposto para 120 Hz – 480 Hz',
    distanceLightYears: '13,8 Bilhões de anos-luz (Horizonte Cosmológico)',
    laymanDescription: 'O primeiro som que existiu no universo! O chiado fóssil da explosão que criou todo o tempo e o espaço.',
    laymanAnalogy: 'Lembra o chiado suave de uma televisão antiga fora do canal ou o vento soprando à noite através de uma floresta vasta.',
    academicPhysics: 'Oscilações Acústicas de Bárions (BAO) congeladas na época da recombinação em z ≈ 1100, constituindo um espectro de corpo negro quase ideal com temperatura T = 2,7255 K e flutuações ΔT/T ~ 10⁻⁵.',
    academicCitation: {
      author: 'Penzias, Arno A. & Wilson, Robert W.',
      year: 1965,
      title: 'A Measurement of Excess Antenna Temperature at 4080 Mc/s',
      journal: 'The Astrophysical Journal, 142: 419–421',
      doi: 'doi:10.1086/148307',
    },
  },
];

class CosmicSonificationEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private isCurrentlyPlaying = false;
  private activeSignalId: string | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    this.getContext();
    return this.analyser;
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  public getActiveSignalId(): string | null {
    return this.activeSignalId;
  }

  public stopAll() {
    this.activeNodes.forEach(n => {
      try {
        n.stop();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    this.isCurrentlyPlaying = false;
    this.activeSignalId = null;
  }

  // Reproduz sinal astrofísico baseado no ID
  public playSignal(signalId: string, loop = false) {
    this.stopAll();
    const ctx = this.getContext();
    this.isCurrentlyPlaying = true;
    this.activeSignalId = signalId;

    switch (signalId) {
      case 'ligo':
        this.synthesizeLigo(ctx, loop);
        break;
      case 'pulsar':
        this.synthesizeCrabPulsar(ctx, loop);
        break;
      case 'jupiter':
        this.synthesizeJupiterWhistler(ctx, loop);
        break;
      case 'cmb':
        this.synthesizeCMBNoise(ctx, loop);
        break;
      default:
        this.synthesizeLigo(ctx, loop);
    }
  }

  // 1. ONDAS GRAVITACIONAIS LIGO (GW150914)
  private synthesizeLigo(ctx: AudioContext, loop: boolean) {
    const playOnce = () => {
      if (!this.isCurrentlyPlaying) return;
      const now = ctx.currentTime;
      const duration = 0.55;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(35, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + duration * 0.85);
      osc.frequency.exponentialRampToValueAtTime(140, now + duration);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.5, now + duration * 0.85);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + duration);

      this.activeNodes.push({ stop: () => osc.stop() });

      if (loop && this.isCurrentlyPlaying) {
        setTimeout(playOnce, (duration + 0.8) * 1000);
      }
    };
    playOnce();
  }

  // 2. PULSAR DO CARANGUEJO (PSR B0531+21) - 30.2 Hz
  private synthesizeCrabPulsar(ctx: AudioContext, loop: boolean) {
    const carrierOsc = ctx.createOscillator();
    const pulseGain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    const now = ctx.currentTime;
    const duration = loop ? 60 : 6.0;

    // Frequência de rádio modulada
    carrierOsc.type = 'triangle';
    carrierOsc.frequency.setValueAtTime(180, now);

    // LFO girando a 30.2 Hz (rotações do pulsar por segundo)
    lfo.type = 'sawtooth';
    lfo.frequency.setValueAtTime(30.2, now);

    lfoGain.gain.setValueAtTime(0.45, now);
    lfo.connect(lfoGain);

    pulseGain.gain.setValueAtTime(0.1, now);
    lfoGain.connect(pulseGain.gain);

    carrierOsc.connect(pulseGain);
    pulseGain.connect(this.masterGain!);

    carrierOsc.start(now);
    lfo.start(now);
    carrierOsc.stop(now + duration);
    lfo.stop(now + duration);

    this.activeNodes.push({
      stop: () => {
        try {
          carrierOsc.stop();
          lfo.stop();
        } catch {
          // ignore
        }
      },
    });
  }

  // 3. JÚPITER MAGNETOSFERA - ONDAS WHISTLER
  private synthesizeJupiterWhistler(ctx: AudioContext, loop: boolean) {
    const playWhistleBurst = () => {
      if (!this.isCurrentlyPlaying) return;
      const now = ctx.currentTime;
      const duration = 1.4;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Deslize descendente característico de plasma whistler
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + duration);
      filter.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + duration);

      this.activeNodes.push({ stop: () => osc.stop() });

      if (loop && this.isCurrentlyPlaying) {
        setTimeout(playWhistleBurst, (duration + 0.6) * 1000);
      }
    };
    playWhistleBurst();
  }

  // 4. RADIAÇÃO CÓSMICA DE FUNDO (CMB) - RUÍDO PRIMORDIAL DO BIG BANG
  private synthesizeCMBNoise(ctx: AudioContext, loop: boolean) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Ruído rosa com filtragem térmica
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = loop;

    // Filtro ressonante das oscilações acústicas de bárions (BAO)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    const now = ctx.currentTime;
    noiseSource.start(now);
    if (!loop) {
      noiseSource.stop(now + 8);
    }

    this.activeNodes.push({
      stop: () => {
        try {
          noiseSource.stop();
        } catch {
          // ignore
        }
      },
    });
  }
}

export const CosmicSonificationService = new CosmicSonificationEngine();
