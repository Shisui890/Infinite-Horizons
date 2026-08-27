// ====================================================================
// SÍNTESE ACÚSTICA CIENTÍFICA: ONDAS GRAVITACIONAIS DO LIGO (GW150914)
// Baseado na física real da coalescência de buracos negros binários
// ====================================================================

class LigoAudioEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Reproduz o chirp de GW150914 (35 Hz -> 250 Hz com chirp de amplitude exponencial)
  public playLigoChirp() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 0.45;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';

      // Frequência de 35Hz acelerando para 250Hz até a coalescência
      osc.frequency.setValueAtTime(35, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + duration * 0.85);
      osc.frequency.exponentialRampToValueAtTime(140, now + duration); // Ringdown

      // Envelope de amplitude
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + duration * 0.85);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio playback silently handled if audio blocked by browser policy
    }
  }

  // Som suave de transição de geodésica / slide
  public playSubtleTick() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }
}

export const LigoAudio = new LigoAudioEngine();
