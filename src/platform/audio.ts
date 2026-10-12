/**
 * Sound: a few synthesized blips so there are no audio assets to license. Starts
 * muted and only turns on after the first tap or click (browser policy and CLAUDE.md).
 * The user can mute it in Settings; that preference lives in the save.
 */
export type SoundName =
  'tap' | 'pickup' | 'jump' | 'hit' | 'hatch' | 'evolve' | 'pet' | 'buy' | 'cheer' | 'win' | 'sad';

let ctx: AudioContext | null = null;
let unlocked = false;
let enabled = true;

/** Call from the first user gesture. Safe to call repeatedly. */
export function unlockAudio(): void {
  if (unlocked) return;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
    void ctx.resume();
    unlocked = true;
    startMusic();
  } catch {
    ctx = null;
  }
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  if (on) startMusic();
  else stopMusic();
}

// ---------- music: a slow pentatonic loop, very quiet ----------

let musicTimer = 0;
let musicStep = 0;
const SCALE = [262, 294, 330, 392, 440, 523, 587, 659];
const PATTERN = [0, 2, 4, 7, 5, 4, 2, 1, 0, 2, 5, 7, 4, 2, 1, 3];

function musicTick(): void {
  if (!ctx || !enabled) return;
  const note = PATTERN[musicStep % PATTERN.length] ?? 0;
  const freq = SCALE[note] ?? 262;
  tone(freq, 0, 420, 'triangle', 0.025);
  if (musicStep % 4 === 0) tone(freq / 2, 0, 800, 'sine', 0.02);
  musicStep += 1;
}

export function startMusic(): void {
  if (musicTimer || !unlocked || !enabled) return;
  musicTimer = window.setInterval(musicTick, 500);
}

export function stopMusic(): void {
  if (!musicTimer) return;
  clearInterval(musicTimer);
  musicTimer = 0;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

function tone(
  freq: number,
  startMs: number,
  durMs: number,
  type: OscillatorType = 'square',
  gain = 0.08,
  slideTo?: number,
): void {
  if (!ctx) return;
  const t0 = ctx.currentTime + startMs / 1000;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + durMs / 1000);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + durMs / 1000 + 0.02);
}

export function playSound(name: SoundName): void {
  if (!enabled || !unlocked || !ctx) return;
  try {
    switch (name) {
      case 'tap':
        tone(660, 0, 50, 'square', 0.04);
        break;
      case 'pickup':
        tone(880, 0, 60);
        tone(1320, 60, 90);
        break;
      case 'jump':
        tone(300, 0, 120, 'square', 0.06, 600);
        break;
      case 'hit':
        tone(160, 0, 160, 'sawtooth', 0.07, 60);
        break;
      case 'hatch':
        tone(523, 0, 90);
        tone(659, 90, 90);
        tone(784, 180, 160);
        break;
      case 'evolve':
        tone(523, 0, 110);
        tone(659, 110, 110);
        tone(784, 220, 110);
        tone(1047, 330, 320, 'triangle', 0.1);
        break;
      case 'pet':
        tone(900, 0, 70, 'sine', 0.06, 1200);
        break;
      case 'buy':
        tone(700, 0, 60, 'triangle');
        tone(1050, 70, 100, 'triangle');
        break;
      case 'cheer':
        tone(500, 0, 60, 'square', 0.06);
        tone(750, 60, 60, 'square', 0.06);
        tone(1000, 120, 120, 'square', 0.06);
        break;
      case 'win':
        tone(659, 0, 100);
        tone(784, 100, 100);
        tone(988, 200, 100);
        tone(1319, 300, 300, 'triangle', 0.1);
        break;
      case 'sad':
        tone(440, 0, 160, 'triangle', 0.06, 330);
        tone(330, 180, 240, 'triangle', 0.06, 220);
        break;
    }
  } catch {
    // Audio problems must never break the game.
  }
}
