// Web Audio API Synthesizer for iOS mechanical keyboard clicks and haptics

class KeyboardAudioEngine {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick(
    keyAction: 'char' | 'space' | 'backspace' | 'return' | 'modifier' = 'char',
    soundStyle: 'ios' | 'mechanical' | 'bubble' | 'silent' = 'ios'
  ) {
    if (soundStyle === 'silent') return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';

      let baseFreq = 1200;
      let decay = 0.018;
      let volume = 0.28;

      if (soundStyle === 'bubble') {
        // Water droplet / soft bubble sound
        osc.type = 'sine';
        baseFreq = 500 + Math.random() * 80;
        decay = 0.045;
        volume = 0.35;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + decay);
        filter.frequency.setValueAtTime(3200, now);
      } else if (soundStyle === 'mechanical') {
        // Tactile mechanical switch click
        osc.type = 'sawtooth';
        baseFreq = 1800 + Math.random() * 150;
        decay = 0.014;
        volume = 0.22;
        filter.frequency.setValueAtTime(2800, now);
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.3, now + decay);
      } else {
        // Standard iOS damped impulse
        osc.type = 'triangle';
        switch (keyAction) {
          case 'space':
            baseFreq = 750;
            decay = 0.024;
            volume = 0.32;
            filter.frequency.setValueAtTime(1600, now);
            break;
          case 'backspace':
            baseFreq = 650;
            decay = 0.022;
            volume = 0.35;
            filter.frequency.setValueAtTime(1400, now);
            break;
          case 'return':
            baseFreq = 1450;
            decay = 0.028;
            volume = 0.38;
            filter.frequency.setValueAtTime(2600, now);
            break;
          case 'modifier':
            baseFreq = 1100;
            decay = 0.015;
            volume = 0.2;
            filter.frequency.setValueAtTime(2000, now);
            break;
          case 'char':
          default:
            baseFreq = 1150 + Math.random() * 80;
            decay = 0.016;
            volume = 0.26;
            filter.frequency.setValueAtTime(2400, now);
            break;
        }
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + decay);
      }

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    } catch {
      // Audio playback fails silently if restricted
    }
  }

  public triggerHaptic(type: 'light' | 'medium' | 'selection' = 'light') {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'light') {
          navigator.vibrate(8);
        } else if (type === 'medium') {
          navigator.vibrate(14);
        } else {
          navigator.vibrate(5);
        }
      } catch {
        // Ignore
      }
    }
  }
}

export const keyboardAudio = new KeyboardAudioEngine();
