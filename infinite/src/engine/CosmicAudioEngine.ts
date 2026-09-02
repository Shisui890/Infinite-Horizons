// ====================================================================
// MOTOR DE ÁUDIO ESPACIAL CÓSMICO (WEB AUDIO API PROCEDURAL)
// Sintetizador harmônico nativo sem dependências externas pesadas
// ====================================================================

class CosmicAudioEngineService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted: boolean = false;
  private volume: number = 0.25; // Nível confortável e sutil

  constructor() {
    // Carrega preferência persistida
    try {
      const savedMute = localStorage.getItem('ih_audio_muted');
      if (savedMute !== null) {
        this.muted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('ih_audio_volume');
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol) || 0.25;
      }
    } catch {
      // Ignora erro de localStorage
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      localStorage.setItem('ih_audio_muted', String(muted));
    } catch {
      // Ignora
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    try {
      localStorage.setItem('ih_audio_volume', String(this.volume));
    } catch {
      // Ignora
    }
    if (this.masterGain && this.ctx && !this.muted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  /**
   * 1. Som de Deslocamento Temporal (Warp Glissando)
   * Disparado suavemente ao navegar ou arrastar a régua de anos
   */
  public playTemporalWarp(progress01: number = 0.5): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    // Frequência modulada pelo progresso temporal (180 Hz a 540 Hz)
    const baseFreq = 180 + progress01 * 360;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, ctx.currentTime + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  /**
   * 2. Pulso de Nó Quântico (Harmonic Bell Chime)
   * Disparado ao selecionar ou clicar em nós de geodésica
   */
  public playNodeSelect(importance: number = 50): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    // Frequência fundamental proporcional à importância
    const baseFreq = 380 + (importance / 100) * 320;
    const now = ctx.currentTime;

    [1, 1.5, 2.02].forEach((ratio, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      const amp = idx === 0 ? 0.2 : 0.08 / idx;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + idx * 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  }

  /**
   * 3. Impacto Causal / Alerta de Paradoxo
   * Ressonância sub-grave que denota alteração na curvatura ou paradoxo
   */
  public playCausalImpact(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 0.45);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  /**
   * 4. Acorde Cósmico do Oráculo (432 Hz Solfeggio)
   * Disparado ao abrir o Crono-Oráculo de IA
   */
  public playOracleChime(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    // Acorde harmônico: 432 Hz (A), 540 Hz (C#), 648 Hz (E)
    const chord = [432, 540, 648];

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 / chord.length, now + 0.08 * (idx + 1));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  /**
   * 5. Ondulação Gravitacional (Gravitational Ripple Sweep)
   * Efeito acústico espacial de propagação de ondas na métrica
   */
  public playMetricWave(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.4);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(3.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }
}

export const CosmicAudio = new CosmicAudioEngineService();
