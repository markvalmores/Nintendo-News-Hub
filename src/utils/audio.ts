/**
 * Web Audio API Synthesizer for Authentic Nintendo Switch 2 Sound Effects & Music
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private musicInterval: any = null;
  private enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * The iconic Nintendo Switch "Snap / Click" mechanical sound
   */
  public playSwitchSnap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    this.vibrate(35);

    const now = this.ctx.currentTime;
    
    // First high click component
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1600, now);
    osc1.frequency.exponentialRampToValueAtTime(320, now + 0.045);
    
    gain1.gain.setValueAtTime(0.8, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    // Second metallic body resonance
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(820, now + 0.005);
    osc2.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    gain2.gain.setValueAtTime(0.6, now + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    // Magnetic latch click
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'square';
    osc3.frequency.setValueAtTime(2400, now + 0.02);
    osc3.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    gain3.gain.setValueAtTime(0.3, now + 0.02);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc3.connect(gain3);
    gain3.connect(this.ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.06);
    osc2.start(now + 0.005);
    osc2.stop(now + 0.09);
    osc3.start(now + 0.02);
    osc3.stop(now + 0.05);
  }

  /**
   * Joy-Con Detach / Release Sound
   */
  public playDetachSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    this.vibrate(20);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Soft Nintendo UI bubble blip on hover or focus
   */
  public playMenuBlip(pitchOffset: number = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 540 + pitchOffset;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 0.035);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Selection / Open Article Chime
   */
  public playConfirmDing() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    this.vibrate(15);

    const now = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const delay = idx * 0.03;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.22, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.25);
    });
  }

  /**
   * Back / Close Swoosh
   */
  public playCancelSwoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.09);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Dock Mode Activation Sound (TV power & sub resonance)
   */
  public playDockPower() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    this.vibrate([40, 60, 80]);

    const now = this.ctx.currentTime;
    // Sub bass
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(60, now);
    subOsc.frequency.exponentialRampToValueAtTime(140, now + 0.4);
    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    // Power chime
    const chimeOsc = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(440, now + 0.1);
    chimeOsc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
    chimeGain.gain.setValueAtTime(0.25, now + 0.1);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    chimeOsc.connect(chimeGain);
    chimeGain.connect(this.ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.52);
    chimeOsc.start(now + 0.1);
    chimeOsc.stop(now + 0.48);
  }

  /**
   * Miiverse "Yeah!" Coin / Star Chime
   */
  public playYeahSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    this.vibrate(25);

    const now = this.ctx.currentTime;
    const notes = [987.77, 1318.51]; // B5 -> E6 classic Mario coin
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const delay = idx * 0.08;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.18, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    });
  }

  /**
   * Procedural Nintendo eShop / Direct Ambient Chill Synth
   */
  public toggleAmbientMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public getMusicStatus(): boolean {
    return this.isMusicPlaying;
  }

  private startMusic() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    this.musicGainNode = this.ctx.createGain();
    this.musicGainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.musicGainNode.connect(this.ctx.destination);

    // Warm chord progression (Cmaj7 -> Am7 -> Fmaj7 -> Gsus4)
    const chordProgression = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 261.63, 329.63, 440.00], // Fmaj7
      [196.00, 261.63, 392.00, 523.25], // Gsus4
    ];

    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;
      const currentChord = chordProgression[chordIdx % chordProgression.length];
      chordIdx++;

      const now = this.ctx.currentTime;
      currentChord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.4 + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

        osc.connect(gain);
        gain.connect(this.musicGainNode!);
        osc.start(now);
        osc.stop(now + 2.7);
      });
    };

    playChordStep();
    this.musicInterval = setInterval(playChordStep, 2600);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore if not allowed
      }
    }
  }
}

export const soundEngine = new SoundEngine();
