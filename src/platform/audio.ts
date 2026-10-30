/**
 * Sound: synthesized effects and an original score, so there are nothing to license.
 * Starts muted and only turns on after the first tap or click (browser policy and
 * CLAUDE.md). Music and effects have separate switches; both live in the save.
 *
 * The score is a small sequencer over Web Audio: each song is a few tracks of notes in a
 * readable notation, played by synth instruments (lead, pluck, bass, pad, bell, drums)
 * through a delay, a generated reverb and a compressor. The pieces are written in the
 * spirit of the cozy garden games and the big adventure scores Maor named: a warm
 * waltz by day, a hushed music-box at night, a rising brass motif on the title screen,
 * a driving race theme, a bouncy expedition tune and a sparse story cue. All original.
 */
export type SoundName =
  | 'tap'
  | 'pickup'
  | 'jump'
  | 'hit'
  | 'hatch'
  | 'evolve'
  | 'pet'
  | 'buy'
  | 'cheer'
  | 'win'
  | 'sad'
  | 'drip'
  // MOVE-21/25: the Keeper's jump (a boop), double jump (a higher bip), landing (a pat) and
  // a long fall's soft plop (a "hup").
  | 'hop'
  | 'hopAir'
  | 'pat'
  | 'plop'
  // MOVE-35: a soft bonk when a tap cannot be reached.
  | 'bonk'
  // MOVE-46: footsteps on a deck (a hollow tok) and on stone (a light tap).
  | 'stepDeck'
  | 'stepStone'
  // MOVE-57: a spring mushroom's boing.
  | 'boing'
  // R0301 (FUN-12): the comic palette.
  | 'squeak'
  | 'slideDown'
  | 'slideUp'
  | 'pop'
  | 'sneeze'
  | 'hiccup'
  | 'gulp'
  | 'raspberry'
  | 'giggle'
  // Round 5 (R0304, R0310): a gate creak and the sprout sound words' own noises.
  | 'creak'
  | 'munch'
  | 'whoosh'
  | 'splash'
  | 'ding'
  // Lane C round 6 (FIGHT-76): battle hits by type, and a tuckered-out yawn.
  | 'woodblock'
  | 'swish'
  | 'patter'
  | 'yawn';

/** R0301: the comic sounds, for the debug panel's test row. */
export const COMIC_SOUNDS: readonly SoundName[] = [
  'boing',
  'bonk',
  'squeak',
  'slideDown',
  'slideUp',
  'pop',
  'sneeze',
  'hiccup',
  'gulp',
  'raspberry',
  'giggle',
];
// R0301: comic sounds never pile up: at most one per 100 ms.
let lastComicAt = -Infinity;

export type SongName =
  | 'title'
  | 'grove'
  | 'night'
  | 'race'
  | 'expedition'
  | 'story'
  | 'sorrow'
  | 'tense'
  | 'hollow'
  | 'karate'
  // Lane C round 6 (FIGHT-76): the bouts' own pieces.
  | 'battle'
  | 'circuit'
  | 'calm';

/** Every piece in the score, for the jukebox. */
export const SONG_NAMES: readonly SongName[] = [
  'title',
  'grove',
  'night',
  'race',
  'expedition',
  'story',
  'sorrow',
  'tense',
  'hollow',
  'karate',
  'battle',
  'circuit',
  'calm',
];

let ctx: AudioContext | null = null;
let unlocked = false;
let sfxEnabled = true;
let musicEnabled = true;
let musicVolume = 0.8;
let sfxVolume = 0.8;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let sfxBus: GainNode | null = null;
let delaySend: GainNode | null = null;
let reverbSend: GainNode | null = null;

/**
 * Call from user gestures: pointerup, touchend, click and keydown (iOS Safari does not
 * count pointerdown as one). Safe on every gesture: it builds the context once, then only
 * resumes it when it is not running, which also brings sound back after an interruption
 * (a phone call, Siri, another app's audio).
 */
export function unlockAudio(): void {
  if (!ctx) {
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
      buildGraph(ctx);
      ctx.addEventListener('statechange', onStateChange);
    } catch {
      ctx = null;
      return;
    }
  }
  resumeAudio();
}

/**
 * Resume a context that is not running, for example when the tab comes back. Sound
 * counts as unlocked only once the context really runs: resume() can fail, or be refused
 * outside a gesture, and the next gesture tries again.
 */
export function resumeAudio(): void {
  const ac = ctx;
  if (!ac || ac.state === 'running' || ac.state === 'closed') return;
  ac.resume().then(onStateChange, () => undefined);
}

/**
 * The tab is hidden: suspend the context and stop the music scheduler and the bird timer,
 * so nothing plays or wakes the CPU in a background tab (review D, bug 43). `resumeAudio`
 * on show brings it back, and `onStateChange` restarts the timers once it runs.
 */
export function suspendAudio(): void {
  const ac = ctx;
  if (!ac || ac.state !== 'running') return;
  if (current) {
    clearInterval(current.timer);
    current.timer = 0;
  }
  window.clearTimeout(birdTimer);
  ac.suspend().catch(() => undefined);
}

function onStateChange(): void {
  if (ctx?.state !== 'running') return;
  if (!unlocked) {
    unlocked = true;
    if (pendingSong) playSong(pendingSong);
  }
  // Back from a hidden tab: carry on the song where it paused, and the birds.
  const p = current;
  if (p && !p.timer) {
    schedule(p);
    p.timer = window.setInterval(() => schedule(p), 60);
  }
  scheduleBird();
}

function buildGraph(ac: AudioContext): void {
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 4;
  master = ac.createGain();
  master.gain.value = 0.9;
  master.connect(comp).connect(ac.destination);
  musicBus = ac.createGain();
  musicBus.gain.value = musicEnabled ? musicVolume : 0;
  musicBus.connect(master);
  sfxBus = ac.createGain();
  sfxBus.gain.value = sfxEnabled ? sfxVolume : 0;
  sfxBus.connect(master);
  // Echo.
  const delay = ac.createDelay(1.0);
  delay.delayTime.value = 0.32;
  const fb = ac.createGain();
  fb.gain.value = 0.28;
  const dlp = ac.createBiquadFilter();
  dlp.type = 'lowpass';
  dlp.frequency.value = 2400;
  delay.connect(dlp).connect(fb).connect(delay);
  delaySend = ac.createGain();
  delaySend.gain.value = 0.35;
  delaySend.connect(delay);
  delay.connect(musicBus);
  // A small hall: exponentially decaying noise as the impulse.
  const seconds = 1.8;
  const rate = ac.sampleRate;
  const impulse = ac.createBuffer(2, Math.floor(rate * seconds), rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.6) * (ch === 0 ? 1 : 0.9);
    }
  }
  const reverb = ac.createConvolver();
  reverb.buffer = impulse;
  reverbSend = ac.createGain();
  reverbSend.gain.value = 0.22;
  reverbSend.connect(reverb).connect(musicBus);
}

export function setSoundEnabled(on: boolean): void {
  sfxEnabled = on;
  if (sfxBus && ctx) sfxBus.gain.setTargetAtTime(on ? sfxVolume : 0, ctx.currentTime, 0.05);
}

export function setMusicEnabled(on: boolean): void {
  musicEnabled = on;
  if (musicBus && ctx) musicBus.gain.setTargetAtTime(on ? musicVolume : 0, ctx.currentTime, 0.2);
  if (on && unlocked && !current && pendingSong) playSong(pendingSong);
}

/** 0..1 sliders from Settings. */
export function setMusicVolume(v: number): void {
  musicVolume = Math.max(0, Math.min(1, v));
  if (musicBus && ctx && musicEnabled) {
    musicBus.gain.setTargetAtTime(musicVolume, ctx.currentTime, 0.1);
  }
}

export function setSfxVolume(v: number): void {
  sfxVolume = Math.max(0, Math.min(1, v));
  if (sfxBus && ctx && sfxEnabled) sfxBus.gain.setTargetAtTime(sfxVolume, ctx.currentTime, 0.05);
}

/** True once the first tap or click has turned sound on (read-aloud waits for it too). */
export function isAudioUnlocked(): boolean {
  return unlocked;
}

export function isSoundEnabled(): boolean {
  return sfxEnabled;
}

export function isMusicEnabled(): boolean {
  return musicEnabled;
}

// ---------------------------------------------------------------- score

type Inst = 'lead' | 'pluck' | 'bass' | 'pad' | 'bell' | 'brass' | 'kick' | 'snare' | 'hat';

interface Note {
  /** Start beat. */
  t: number;
  /** Length in beats. */
  d: number;
  /** MIDI pitches (several for a chord). Empty for drums. */
  p: number[];
}

interface Track {
  inst: Inst;
  gain: number;
  notes: Note[];
}

interface Song {
  bpm: number;
  /** Loop length in beats. */
  beats: number;
  tracks: Track[];
}

const NOTE_INDEX: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function midi(name: string): number {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) throw new Error(`Bad note ${name}`);
  const semis = NOTE_INDEX[m[1]!]! + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return 12 * (Number(m[3]) + 1) + semis;
}

/**
 * Notation: tokens separated by spaces. `C4:2` is a note for two beats, `C4+E4+G4:4` a
 * chord, `r:1` a rest, `x:0.5` a drum hit. A bare token lasts one beat.
 */
function seq(inst: Inst, gain: number, text: string): Track {
  const notes: Note[] = [];
  let t = 0;
  for (const tok of text.trim().split(/\s+/)) {
    if (!tok) continue;
    const [body, durText] = tok.split(':');
    const d = durText ? Number(durText) : 1;
    if (body !== 'r') {
      const p = body === 'x' ? [] : body!.split('+').map(midi);
      notes.push({ t, d, p });
    }
    t += d;
  }
  return { inst, gain, notes };
}

const SONGS: Record<SongName, Song> = {
  // A warm waltz for the garden: lilting lead over a gentle bass, the pad breathing under it.
  grove: {
    bpm: 108,
    beats: 48,
    tracks: [
      seq(
        'lead',
        0.5,
        'E5:2 G5 A5:2 G5 E5:2 D5 C5:3 r:3 ' +
          'D5:2 E5 G5:2 E5 D5:2 C5 A4:3 r:3 ' +
          'E5:2 G5 B5:2 A5 G5:2 E5 D5:3 r:3 ' +
          'C5:2 D5 E5:2 G5 E5:2 D5 C5:4 r:2',
      ),
      seq(
        'bell',
        0.28,
        'r:3 C6:1 r:2 r:3 G5:1 r:2 r:3 A5:1 r:2 r:3 E5:1 r:2 ' +
          'r:3 D6:1 r:2 r:3 B5:1 r:2 r:3 G5:1 r:2 r:3 E6:1 r:2',
      ),
      seq(
        'bass',
        0.55,
        'C3:3 C3:3 A2:3 A2:3 F2:3 F2:3 G2:3 G2:3 ' + 'C3:3 C3:3 E3:3 E3:3 F2:3 G2:3 C3:3 C3:3',
      ),
      seq(
        'pad',
        0.16,
        'C4+E4+G4:6 A3+C4+E4:6 F3+A3+C4:6 G3+B3+D4:6 ' +
          'C4+E4+G4:6 E4+G4+B4:6 F4+A4+C5:3 G3+B3+D4:3 C4+E4+G4:6',
      ),
      seq('hat', 0.07, 'r x:0.5 r:0.5 x r x:0.5 r:0.5 x '.repeat(8)),
    ],
  },
  // Night: a slow music box over a long pad; lanterns and fireflies.
  night: {
    bpm: 66,
    beats: 32,
    tracks: [
      seq(
        'bell',
        0.4,
        'A4:1 C5:1 E5:2 D5:1 C5:1 B4:2 A4:1 E5:1 D5:2 C5:4 ' +
          'F4:1 A4:1 C5:2 B4:1 A4:1 G4:2 E4:1 G4:1 B4:2 A4:4',
      ),
      seq('pluck', 0.2, 'r:0.5 E5:0.5 r:1 A5:0.5 r:1.5 r:0.5 D5:0.5 r:1 G5:0.5 r:1.5 '.repeat(4)),
      seq('bass', 0.45, 'A2:4 A2:4 F2:4 G2:4 F2:4 F2:4 E2:4 A2:4'),
      seq('pad', 0.2, 'A3+C4+E4:8 F3+A3+C4:4 G3+B3+D4:4 F3+A3+C4:8 E3+G#3+B3:4 A3+C4+E4:4'),
    ],
  },
  // Title: a rising brass motif, the kind that opens an adventure, then a lift.
  title: {
    bpm: 92,
    beats: 32,
    tracks: [
      seq(
        'brass',
        0.42,
        'C4:1 G4:1 C5:2 B4:1 G4:1 A4:2 F4:1 A4:1 C5:2 D5:4 ' +
          'E5:1 D5:1 C5:2 G4:1 A4:1 B4:2 C5:1 E5:1 G5:4 r:2',
      ),
      seq('lead', 0.25, 'r:8 r:8 C5:1 E5:1 G5:2 F5:1 D5:1 B4:2 C5:1 E5:1 G5:2 C6:4 r:2'),
      seq('bass', 0.5, 'C2:4 F2:4 F2:4 G2:4 C2:4 G2:4 C2:4 C2:4'),
      seq(
        'pad',
        0.2,
        'C3+G3+C4:4 F3+A3+C4:4 F3+A3+C4:4 G3+B3+D4:4 C3+E3+G3:4 G3+B3+D4:4 C4+E4+G4:8',
      ),
      seq('kick', 0.5, 'x r x r x r x r '.repeat(4)),
      seq('snare', 0.25, 'r:2 x:1 r:1 '.repeat(8)),
    ],
  },
  // Race: fast, driving, a little dangerous. E minor.
  race: {
    bpm: 152,
    beats: 32,
    tracks: [
      seq(
        'lead',
        0.4,
        'E5:0.5 G5:0.5 B5:1 A5:0.5 G5:0.5 E5:1 D5:0.5 E5:0.5 G5:1 E5:2 ' +
          'G5:0.5 A5:0.5 B5:1 D6:0.5 B5:0.5 A5:1 G5:0.5 A5:0.5 B5:1 G5:2 ' +
          'E5:0.5 G5:0.5 B5:1 A5:0.5 G5:0.5 E5:1 D5:0.5 E5:0.5 G5:1 A5:2 ' +
          'B5:0.5 A5:0.5 G5:1 E5:0.5 D5:0.5 E5:1 G5:0.5 A5:0.5 B5:2 r:2',
      ),
      seq(
        'pluck',
        0.22,
        'E4:0.5 B4:0.5 E5:0.5 B4:0.5 '.repeat(4) +
          'C4:0.5 G4:0.5 C5:0.5 G4:0.5 '.repeat(2) +
          'D4:0.5 A4:0.5 D5:0.5 A4:0.5 '.repeat(2) +
          'E4:0.5 B4:0.5 E5:0.5 B4:0.5 '.repeat(4) +
          'A3:0.5 E4:0.5 A4:0.5 E4:0.5 '.repeat(2) +
          'B3:0.5 F#4:0.5 B4:0.5 F#4:0.5 '.repeat(2),
      ),
      seq(
        'bass',
        0.55,
        'E2:0.5 E2:0.5 E3:0.5 E2:0.5 '.repeat(4) +
          'C2:0.5 C2:0.5 C3:0.5 C2:0.5 '.repeat(2) +
          'D2:0.5 D2:0.5 D3:0.5 D2:0.5 '.repeat(2) +
          'E2:0.5 E2:0.5 E3:0.5 E2:0.5 '.repeat(4) +
          'A2:0.5 A2:0.5 A3:0.5 A2:0.5 '.repeat(2) +
          'B2:0.5 B2:0.5 B3:0.5 B2:0.5 '.repeat(2),
      ),
      seq('kick', 0.55, 'x r x r '.repeat(8)),
      seq('snare', 0.3, 'r x r x '.repeat(8)),
      seq('hat', 0.12, 'x:0.5 x:0.5 '.repeat(32)),
    ],
  },
  // Expedition: bouncy, bright, a tune to jump to.
  expedition: {
    bpm: 132,
    beats: 32,
    tracks: [
      seq(
        'lead',
        0.42,
        'G4:0.5 A4:0.5 B4:1 D5:1 B4:0.5 A4:0.5 G4:1 E4:1 ' +
          'G4:0.5 A4:0.5 B4:1 D5:1 E5:2 D5:1 ' +
          'E5:0.5 D5:0.5 B4:1 G4:1 A4:0.5 B4:0.5 A4:1 E4:1 ' +
          'G4:0.5 A4:0.5 B4:1 A4:1 G4:3 r:1',
      ),
      seq(
        'pluck',
        0.2,
        'G3:0.5 D4:0.5 G4:0.5 D4:0.5 '.repeat(2) +
          'C4:0.5 G4:0.5 C5:0.5 G4:0.5 '.repeat(2) +
          'E3:0.5 B3:0.5 E4:0.5 B3:0.5 '.repeat(2) +
          'D4:0.5 A4:0.5 D5:0.5 A4:0.5 '.repeat(2) +
          'G3:0.5 D4:0.5 G4:0.5 D4:0.5 '.repeat(2) +
          'C4:0.5 G4:0.5 C5:0.5 G4:0.5 '.repeat(2) +
          'D4:0.5 A4:0.5 D5:0.5 A4:0.5 '.repeat(2) +
          'G3:0.5 D4:0.5 G4:0.5 D4:0.5 '.repeat(2),
      ),
      seq(
        'bass',
        0.5,
        'G2:1 G2:1 C3:1 C3:1 E2:1 E2:1 D3:1 D3:1 '.repeat(2) +
          'G2:1 G2:1 C3:1 C3:1 D3:1 D3:1 G2:1 G2:1 '.repeat(2),
      ),
      seq('kick', 0.5, 'x r:0.5 x:0.5 r x r:0.5 x:0.5 r '.repeat(4)),
      seq('hat', 0.1, 'r:0.5 x:0.5 '.repeat(32)),
    ],
  },
  // Sorrow: for the rain on the hill and Hazel's goodbye. A slow bell line over minor pads.
  sorrow: {
    bpm: 60,
    beats: 32,
    tracks: [
      seq(
        'bell',
        0.38,
        'E5:2 D5:1 C5:1 B4:3 r:1 A4:2 B4:1 C5:1 E5:3 r:1 ' +
          'D5:2 C5:1 B4:1 A4:3 r:1 G4:2 A4:1 B4:1 A4:4',
      ),
      seq('pluck', 0.16, 'r:1 A3:0.5 r:2.5 r:1 E4:0.5 r:2.5 '.repeat(4)),
      seq('bass', 0.4, 'A2:4 F2:4 C3:4 G2:4 A2:4 F2:4 E2:4 A2:4'),
      seq(
        'pad',
        0.22,
        'A3+C4+E4:4 F3+A3+C4:4 C4+E4+G4:4 G3+B3+D4:4 A3+C4+E4:4 F3+A3+C4:4 E3+G#3+B3:4 A3+C4+E4:4',
      ),
    ],
  },
  // Tense: Corvin's scenes. A low pulse, a wary motif, no resolution.
  tense: {
    bpm: 100,
    beats: 32,
    tracks: [
      seq(
        'lead',
        0.3,
        'r:2 D4:0.5 Eb4:0.5 D4:1 r:4 r:2 D4:0.5 F4:0.5 Eb4:1 r:4 ' +
          'r:2 G4:0.5 Ab4:0.5 G4:1 r:4 r:2 F4:0.5 Eb4:0.5 D4:2 r:3',
      ),
      seq(
        'bass',
        0.5,
        'D2:0.5 r:0.5 D2:0.5 r:0.5 '.repeat(12) + 'Bb1:0.5 r:0.5 Bb1:0.5 r:0.5 '.repeat(4),
      ),
      seq('pad', 0.18, 'D3+F3+A3:8 D3+F3+Ab3:8 G3+Bb3+D4:8 Bb2+D3+F3:8'),
      seq('kick', 0.35, 'x r:3 '.repeat(8)),
      seq('hat', 0.06, 'r:0.5 x:0.5 '.repeat(32)),
    ],
  },
  // Hollow: past the falls. Sparse bells, a long pad, something breathing in the dark.
  hollow: {
    bpm: 70,
    beats: 32,
    tracks: [
      seq(
        'bell',
        0.3,
        'r:3 F#5:1 r:3 E5:1 r:3 C#5:1 r:3 D5:1 r:3 B4:1 r:3 F#5:1 r:3 E5:1 r:3 C#5:1',
      ),
      seq('pluck', 0.14, 'B3:0.5 r:3.5 F#3:0.5 r:3.5 '.repeat(4)),
      seq('bass', 0.42, 'B2:8 G2:8 A2:8 F#2:8'),
      seq('pad', 0.22, 'B3+D4+F#4:8 G3+B3+D4:8 A3+C#4+E4:8 F#3+A3+C#4:8'),
    ],
  },
  // Karate: taiko-like kicks and a short, punchy call. The dojo.
  karate: {
    bpm: 140,
    beats: 16,
    tracks: [
      seq(
        'lead',
        0.32,
        'A4:0.5 A4:0.5 C5:1 r:1 E5:0.5 D5:0.5 C5:1 r:1 A4:0.5 C5:0.5 D5:1 r:1 E5:1 G5:1 r:2',
      ),
      seq(
        'bass',
        0.5,
        'A2:0.5 A2:0.5 r:1 A2:0.5 A2:0.5 r:1 '.repeat(2) +
          'G2:0.5 G2:0.5 r:1 G2:0.5 G2:0.5 r:1 '.repeat(2),
      ),
      seq('kick', 0.6, 'x x:0.5 x:0.5 r x r:0.5 x:0.5 x r '.repeat(2)),
      seq('snare', 0.3, 'r:3 x:1 '.repeat(4)),
    ],
  },
  // FIGHT-76: a bouncy play-fight for turn bouts. Major, 132 bpm, never menacing.
  battle: {
    bpm: 132,
    beats: 16,
    tracks: [
      seq(
        'lead',
        0.3,
        'C5:0.5 E5:0.5 G5:1 r:0.5 A5:0.5 G5:1 E5:0.5 F5:0.5 G5:1 r:1 D5:0.5 E5:0.5 F5:1 E5:0.5 D5:0.5 C5:2 r:2',
      ),
      seq(
        'bass',
        0.45,
        'C3:1 G2:1 C3:1 G2:1 F2:1 C3:1 F2:1 C3:1 G2:1 D3:1 G2:1 D3:1 C3:1 G2:1 C3:2',
      ),
      seq('kick', 0.5, 'x:1 r:1 '.repeat(8)),
      seq('hat', 0.18, 'r:0.5 x:0.5 '.repeat(16)),
    ],
  },
  // The Circuit: brass fanfare over a marching snare, a gym-badge strut.
  circuit: {
    bpm: 120,
    beats: 16,
    tracks: [
      seq(
        'brass',
        0.3,
        'G4:1 C5:1 E5:1.5 D5:0.5 C5:1 G4:1 A4:2 F4:1 A4:1 C5:1.5 B4:0.5 A4:1 G4:1 C5:2',
      ),
      seq('bass', 0.45, 'C3:2 G2:2 F2:2 C3:2 F2:2 C3:2 G2:2 C3:2'),
      seq('snare', 0.25, 'r:1 x:0.5 x:0.5 '.repeat(8)),
      seq('kick', 0.45, 'x:2 '.repeat(8)),
    ],
  },
  // Calm bouts (gentle, befriending, a Shadow to soothe): a slow lullaby in 3.
  calm: {
    bpm: 84,
    beats: 24,
    tracks: [
      seq('pluck', 0.28, 'E5:2 D5:1 C5:2 G4:1 A4:2 C5:1 D5:3 E5:2 G5:1 E5:2 D5:1 C5:3 r:3'),
      seq('pad', 0.14, 'C3+G3+E4:6 A2+E3+C4:6 F2+C3+A3:6 G2+D3+B3:6'),
      seq('bell', 0.16, 'r:5 G5:1 r:5 E5:1 r:5 C6:1 r:5 D5:1'),
    ],
  },
  // Story: sparse, for the dialogue box. A slow arpeggio and a held pad.
  story: {
    bpm: 76,
    beats: 32,
    tracks: [
      seq(
        'pluck',
        0.3,
        'C4:1 G4:1 E5:2 r:4 A3:1 E4:1 C5:2 r:4 F3:1 C4:1 A4:2 r:4 G3:1 D4:1 B4:2 r:4',
      ),
      seq('bell', 0.18, 'r:6 G5:2 r:6 E5:2 r:6 C5:2 r:6 D5:2'),
      seq('pad', 0.16, 'C3+G3+E4:8 A2+E3+C4:8 F2+C3+A3:8 G2+D3+B3:8'),
    ],
  },
};

// ---------------------------------------------------------------- sequencer

interface Playing {
  name: SongName;
  song: Song;
  gain: GainNode;
  startTime: number;
  nextBeat: number;
  timer: number;
}

let current: Playing | null = null;
let pendingSong: SongName | null = null;

/** Switch songs with a short crossfade. The same song keeps playing. */
export function playSong(name: SongName): void {
  pendingSong = name;
  if (!ctx || !musicBus || !unlocked) return;
  if (current?.name === name) return;
  if (current) fadeOut(current);
  const song = SONGS[name];
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.2);
  gain.connect(musicBus);
  const p: Playing = {
    name,
    song,
    gain,
    startTime: ctx.currentTime + 0.1,
    nextBeat: 0,
    timer: 0,
  };
  current = p;
  schedule(p);
  p.timer = window.setInterval(() => schedule(p), 60);
}

export function stopMusic(): void {
  pendingSong = null;
  if (current) fadeOut(current);
  current = null;
}

function fadeOut(p: Playing): void {
  clearInterval(p.timer);
  if (!ctx) return;
  p.gain.gain.cancelScheduledValues(ctx.currentTime);
  p.gain.gain.setValueAtTime(p.gain.gain.value, ctx.currentTime);
  p.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
  const g = p.gain;
  window.setTimeout(() => g.disconnect(), 1200);
  if (current === p) current = null;
}

/** Schedule every note that starts within the look-ahead window. */
function schedule(p: Playing): void {
  if (!ctx || current !== p) return;
  const secPerBeat = 60 / p.song.bpm;
  const horizon = ctx.currentTime + 0.25;
  while (p.startTime + p.nextBeat * secPerBeat < horizon) {
    const beatInLoop = p.nextBeat % p.song.beats;
    const beatTime = p.startTime + p.nextBeat * secPerBeat;
    for (const track of p.song.tracks) {
      for (const n of track.notes) {
        if (n.t !== beatInLoop) continue;
        play(track, n, beatTime, n.d * secPerBeat, p.gain);
      }
    }
    p.nextBeat += 1;
  }
}

const mtof = (m: number): number => 440 * Math.pow(2, (m - 69) / 12);

function play(track: Track, n: Note, t0: number, dur: number, out: GainNode): void {
  if (!ctx) return;
  const ac = ctx;
  switch (track.inst) {
    case 'kick': {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.frequency.setValueAtTime(150, t0);
      o.frequency.exponentialRampToValueAtTime(45, t0 + 0.12);
      g.gain.setValueAtTime(track.gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
      o.connect(g).connect(out);
      o.start(t0);
      o.stop(t0 + 0.3);
      return;
    }
    case 'snare':
    case 'hat': {
      const len = track.inst === 'hat' ? 0.05 : 0.14;
      const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * len), ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const src = ac.createBufferSource();
      src.buffer = buf;
      const f = ac.createBiquadFilter();
      f.type = track.inst === 'hat' ? 'highpass' : 'bandpass';
      f.frequency.value = track.inst === 'hat' ? 7000 : 1800;
      const g = ac.createGain();
      g.gain.setValueAtTime(track.gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
      src.connect(f).connect(g).connect(out);
      src.start(t0);
      if (track.inst === 'snare') {
        const o = ac.createOscillator();
        const og = ac.createGain();
        o.frequency.setValueAtTime(190, t0);
        og.gain.setValueAtTime(track.gain * 0.6, t0);
        og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
        o.connect(og).connect(out);
        o.start(t0);
        o.stop(t0 + 0.12);
      }
      return;
    }
    default:
      break;
  }
  for (const pitch of n.p) voice(track.inst, mtof(pitch), t0, dur, track.gain, out);
}

/** A tuned voice: oscillators, a filter, an envelope, and sends to the echo and hall. */
function voice(
  inst: Inst,
  freq: number,
  t0: number,
  dur: number,
  gain: number,
  out: GainNode,
): void {
  if (!ctx) return;
  const ac = ctx;
  const g = ac.createGain();
  const f = ac.createBiquadFilter();
  f.type = 'lowpass';
  const oscs: OscillatorNode[] = [];
  const add = (type: OscillatorType, mult: number, detune: number, level: number) => {
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.value = freq * mult;
    o.detune.value = detune;
    const og = ac.createGain();
    og.gain.value = level;
    o.connect(og).connect(f);
    oscs.push(o);
  };
  let attack = 0.01;
  let release = 0.12;
  let sustain = 0.7;
  let hold = dur;
  let echo = 0;
  let hall = 0.4;
  switch (inst) {
    case 'lead':
      add('triangle', 1, -4, 0.6);
      add('square', 1, 4, 0.18);
      f.frequency.value = 2600;
      attack = 0.02;
      release = 0.18;
      echo = 0.5;
      break;
    case 'pluck':
      add('sawtooth', 1, 0, 0.35);
      add('triangle', 2, 0, 0.15);
      f.frequency.setValueAtTime(3200, t0);
      f.frequency.exponentialRampToValueAtTime(600, t0 + 0.25);
      attack = 0.004;
      release = 0.25;
      sustain = 0.15;
      hold = Math.min(dur, 0.3);
      echo = 0.35;
      break;
    case 'bass':
      add('sine', 1, 0, 0.7);
      add('triangle', 1, 0, 0.3);
      add('square', 0.5, 0, 0.08);
      f.frequency.value = 500;
      attack = 0.01;
      release = 0.1;
      sustain = 0.8;
      hall = 0.1;
      break;
    case 'pad':
      add('sawtooth', 1, -7, 0.18);
      add('sawtooth', 1, 7, 0.18);
      add('triangle', 2, 0, 0.08);
      f.frequency.value = 900;
      attack = Math.min(0.8, dur * 0.4);
      release = 0.9;
      sustain = 0.9;
      hall = 0.7;
      break;
    case 'bell':
      add('sine', 1, 0, 0.6);
      add('sine', 2.76, 0, 0.18);
      add('sine', 5.4, 0, 0.06);
      f.frequency.value = 6000;
      attack = 0.003;
      release = 1.2;
      sustain = 0.1;
      hold = Math.min(dur, 0.25);
      echo = 0.4;
      hall = 0.8;
      break;
    case 'brass':
      add('sawtooth', 1, -5, 0.3);
      add('sawtooth', 1, 5, 0.3);
      add('square', 0.5, 0, 0.1);
      f.frequency.setValueAtTime(700, t0);
      f.frequency.linearRampToValueAtTime(2400, t0 + 0.12);
      attack = 0.06;
      release = 0.2;
      sustain = 0.85;
      hall = 0.6;
      break;
    default:
      add('triangle', 1, 0, 0.5);
      break;
  }
  const peak = gain;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.setTargetAtTime(peak * sustain, t0 + attack, 0.08);
  const end = t0 + hold;
  g.gain.setValueAtTime(peak * sustain, end);
  g.gain.exponentialRampToValueAtTime(0.0001, end + release);
  f.connect(g);
  g.connect(out);
  if (echo > 0 && delaySend) {
    const s = ac.createGain();
    s.gain.value = echo;
    g.connect(s).connect(delaySend);
  }
  if (hall > 0 && reverbSend) {
    const s = ac.createGain();
    s.gain.value = hall;
    g.connect(s).connect(reverbSend);
  }
  for (const o of oscs) {
    o.start(t0);
    o.stop(end + release + 0.05);
  }
}

// ---------------------------------------------------------------- effects

function tone(
  freq: number,
  startMs: number,
  durMs: number,
  type: OscillatorType = 'square',
  gain = 0.08,
  slideTo?: number,
): void {
  if (!ctx || !sfxBus) return;
  const t0 = ctx.currentTime + startMs / 1000;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + durMs / 1000);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
  osc.connect(g).connect(sfxBus);
  osc.start(t0);
  osc.stop(t0 + durMs / 1000 + 0.02);
}

/**
 * A Hollow crystal's chime when someone brushes it (item 44): a soft sine bell and its
 * fifth, `pitch` a share 0..1 that picks the note from a pentatonic run, so neighbours
 * sound well together. Silent until the first tap unlocks sound, as every effect is.
 */
export function playChime(pitch: number): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  const notes = [1047, 1175, 1319, 1568, 1760, 2093];
  const f = notes[Math.min(notes.length - 1, Math.floor(pitch * notes.length))]!;
  try {
    tone(f, 0, 900, 'sine', 0.045);
    tone(f * 1.5, 30, 700, 'sine', 0.018);
    tone(f * 2, 0, 300, 'triangle', 0.01);
  } catch {
    // Audio is a nicety; a failed node never stops the game.
  }
}

/**
 * R0322 (FUN-33): a squeak raised `step` semitones (two per rapid tap), so a run of taps on
 * a Nubbin climbs like a toy. Not throttled with the comic sounds: the taps set the pace.
 */
export function playSqueakStep(step: number): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  const f = 700 * Math.pow(2, Math.min(step, 24) / 12);
  try {
    tone(f, 0, 90, 'sawtooth', 0.025, f * 1.5);
  } catch {
    // As above.
  }
}

/** A Hollow sconce catching from the Keeper's lamp: a soft rising whoosh. */
export function playKindle(): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  try {
    tone(220, 0, 260, 'triangle', 0.05, 520);
    tone(660, 120, 220, 'sine', 0.03, 880);
  } catch {
    // As above.
  }
}

export function playSound(name: SoundName): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  if (COMIC_SOUNDS.includes(name)) {
    const now = ctx.currentTime * 1000;
    if (now - lastComicAt < 100) return;
    lastComicAt = now;
  }
  try {
    switch (name) {
      case 'squeak':
        tone(900, 0, 90, 'sawtooth', 0.025, 1400);
        break;
      case 'slideDown':
        tone(1200, 0, 600, 'sine', 0.05, 300);
        break;
      case 'slideUp':
        tone(300, 0, 600, 'sine', 0.05, 1200);
        break;
      case 'pop':
        tone(500, 0, 40, 'sine', 0.07, 1100);
        break;
      case 'sneeze':
        // A little in-breath whistle, then the "choo".
        tone(700, 0, 220, 'sine', 0.02, 1100);
        burst(260, 140, 0.09, 1800);
        break;
      case 'hiccup':
        tone(500, 0, 50, 'square', 0.04, 900);
        break;
      case 'gulp':
        tone(320, 0, 70, 'sine', 0.06, 160);
        tone(260, 70, 60, 'sine', 0.04, 130);
        break;
      case 'raspberry':
        for (let i = 0; i < 6; i++) tone(110 + (i % 2) * 18, i * 45, 50, 'sawtooth', 0.025);
        break;
      case 'giggle':
        for (let i = 0; i < 3; i++) tone(900 + i * 160, i * 90, 70, 'sine', 0.04, 1200 + i * 160);
        break;
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
      case 'drip':
        tone(1500, 0, 50, 'sine', 0.03, 700);
        tone(1100, 70, 80, 'sine', 0.015, 600);
        break;
      case 'sad':
        tone(440, 0, 160, 'triangle', 0.06, 330);
        tone(330, 180, 240, 'triangle', 0.06, 220);
        break;
      case 'hop':
        tone(420, 0, 90, 'sine', 0.05, 640);
        break;
      case 'hopAir':
        tone(700, 0, 80, 'sine', 0.05, 1050);
        break;
      case 'pat':
        tone(180, 0, 45, 'triangle', 0.05, 120);
        break;
      case 'bonk':
        tone(220, 0, 70, 'triangle', 0.05, 150);
        break;
      case 'boing':
        tone(160, 0, 90, 'sine', 0.06, 440);
        tone(440, 80, 180, 'sine', 0.04, 300);
        break;
      case 'stepDeck':
        tone(210, 0, 40, 'triangle', 0.035, 170);
        break;
      case 'stepStone':
        tone(1400, 0, 18, 'triangle', 0.012);
        break;
      case 'plop':
        tone(260, 0, 70, 'sine', 0.06, 160);
        tone(520, 90, 90, 'sine', 0.05, 660);
        break;
      case 'creak':
        // A sticky hinge: a slow wobbling saw, low and dry.
        for (let i = 0; i < 4; i++)
          tone(140 + (i % 2) * 40, i * 110, 140, 'sawtooth', 0.02, 120 + i * 12);
        break;
      case 'munch':
        for (let i = 0; i < 3; i++) burst(i * 120, 60, 0.05, 900);
        break;
      case 'whoosh':
        burst(0, 380, 0.05, 1200);
        tone(300, 0, 380, 'sine', 0.02, 900);
        break;
      case 'splash':
        burst(0, 260, 0.08, 2400);
        tone(900, 40, 120, 'sine', 0.03, 400);
        break;
      // FIGHT-76: a hollow wood block for a Power or Normal hit.
      case 'woodblock':
        tone(880, 0, 45, 'triangle', 0.07, 760);
        tone(1320, 0, 25, 'sine', 0.03);
        break;
      // A Fly hit: a quick airy swish.
      case 'swish':
        burst(0, 160, 0.05, 5200);
        tone(1400, 0, 140, 'sine', 0.015, 600);
        break;
      // A Run hit: three little footsteps.
      case 'patter':
        for (let i = 0; i < 3; i++) tone(520 + i * 40, i * 55, 35, 'square', 0.03, 380);
        break;
      // Tuckered out: a long, sleepy downward yawn.
      case 'yawn':
        tone(520, 0, 520, 'sine', 0.05, 180);
        tone(260, 380, 300, 'sine', 0.03, 140);
        break;
      case 'ding':
        tone(1568, 0, 500, 'sine', 0.05);
        tone(2093, 0, 300, 'triangle', 0.015);
        break;
    }
  } catch {
    // Audio problems must never break the game.
  }
}

/** For tests: the parsed songs. */
export const SCORE: Readonly<Record<SongName, Song>> = SONGS;

// ---------------------------------------------------------------- ambience

/** What the garden sounds like right now. */
export interface AmbienceScene {
  phase: 'day' | 'night';
  weather: 'clear' | 'rain' | 'snow';
  /** Near the stream or the falls. */
  stream: boolean;
}

let ambienceEnabled = true;
let ambienceBus: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let streamGain: GainNode | null = null;
let rainGain: GainNode | null = null;
let cricketGain: GainNode | null = null;
let birdTimer = 0;
let currentScene: AmbienceScene | null = null;

/**
 * R0302 (FUN-13): one typewriter blip in a speaker's voice. Quiet, short, and silent with
 * SFX off or before the first tap unlocks sound.
 */
export function playBlip(hz: number, wave: OscillatorType, ms: number): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  try {
    tone(hz, 0, ms, wave, 0.018);
  } catch {
    // A blip is never worth an error.
  }
}

/** R0301: a short filtered noise burst (the sneeze's "choo"). */
function burst(startMs: number, durMs: number, gain: number, cutoff: number): void {
  if (!ctx || !sfxBus) return;
  const t0 = ctx.currentTime + startMs / 1000;
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = cutoff;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
  src.connect(f).connect(g).connect(sfxBus);
  src.start(t0);
  src.stop(t0 + durMs / 1000 + 0.02);
}

function noise(ac: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const seconds = 2;
  const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * seconds), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

function ensureAmbience(): boolean {
  if (!ctx || !sfxBus) return false;
  if (ambienceBus) return true;
  const ac = ctx;
  ambienceBus = ac.createGain();
  ambienceBus.gain.value = ambienceEnabled ? 1 : 0;
  ambienceBus.connect(sfxBus);
  // The stream: band-passed noise with a slow wobble.
  const stream = ac.createBufferSource();
  stream.buffer = noise(ac);
  stream.loop = true;
  const sbp = ac.createBiquadFilter();
  sbp.type = 'bandpass';
  sbp.frequency.value = 700;
  sbp.Q.value = 0.7;
  streamGain = ac.createGain();
  streamGain.gain.value = 0;
  const lfo = ac.createOscillator();
  lfo.frequency.value = 0.23;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain).connect(streamGain.gain);
  lfo.start();
  stream.connect(sbp).connect(streamGain).connect(ambienceBus);
  stream.start();
  // Rain: bright hissing noise.
  const rain = ac.createBufferSource();
  rain.buffer = noise(ac);
  rain.loop = true;
  const rhp = ac.createBiquadFilter();
  rhp.type = 'highpass';
  rhp.frequency.value = 2200;
  rainGain = ac.createGain();
  rainGain.gain.value = 0;
  rain.connect(rhp).connect(rainGain).connect(ambienceBus);
  rain.start();
  // Crickets: a high tone pulsed at about thirty times a second.
  const cricket = ac.createOscillator();
  cricket.type = 'triangle';
  cricket.frequency.value = 4300;
  const pulse = ac.createOscillator();
  pulse.type = 'square';
  pulse.frequency.value = 29;
  const pulseGain = ac.createGain();
  pulseGain.gain.value = 0.5;
  const am = ac.createGain();
  am.gain.value = 0.5;
  pulse.connect(pulseGain).connect(am.gain);
  cricketGain = ac.createGain();
  cricketGain.gain.value = 0;
  cricket.connect(am).connect(cricketGain).connect(ambienceBus);
  cricket.start();
  pulse.start();
  return true;
}

function birdCall(): void {
  if (!ctx || !ambienceBus || !ambienceEnabled) return;
  const ac = ctx;
  const t0 = ac.currentTime + 0.02;
  const notes = 2 + Math.floor(Math.random() * 3);
  const base = 2000 + Math.random() * 900;
  for (let i = 0; i < notes; i++) {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    const start = t0 + i * 0.11;
    osc.frequency.setValueAtTime(base, start);
    osc.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.2), start + 0.06);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.03, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
    osc.connect(g).connect(ambienceBus);
    osc.start(start);
    osc.stop(start + 0.1);
  }
}

function scheduleBird(): void {
  window.clearTimeout(birdTimer);
  if (!currentScene || currentScene.phase !== 'day' || currentScene.weather === 'rain') return;
  birdTimer = window.setTimeout(
    () => {
      birdCall();
      scheduleBird();
    },
    1800 + Math.random() * 4200,
  );
}

function ramp(g: GainNode | null, v: number): void {
  if (!g || !ctx) return;
  g.gain.cancelScheduledValues(ctx.currentTime);
  g.gain.setTargetAtTime(v, ctx.currentTime, 0.8);
}

/** Set the ambient layer: birds by day, crickets at night, rain, the stream. Null silences it. */
export function setAmbience(scene: AmbienceScene | null): void {
  const changed =
    !scene ||
    !currentScene ||
    scene.phase !== currentScene.phase ||
    scene.weather !== currentScene.weather ||
    scene.stream !== currentScene.stream;
  currentScene = scene ? { ...scene } : null;
  if (!unlocked || !ensureAmbience()) return;
  if (!changed) return;
  try {
    ramp(streamGain, scene?.stream ? 0.05 : 0);
    ramp(rainGain, scene?.weather === 'rain' ? 0.045 : 0);
    ramp(cricketGain, scene?.phase === 'night' && scene.weather !== 'rain' ? 0.012 : 0);
    scheduleBird();
  } catch {
    // Audio problems must never break the game.
  }
}

export function setAmbienceEnabled(on: boolean): void {
  ambienceEnabled = on;
  if (ambienceBus && ctx) ambienceBus.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.3);
  if (!on) window.clearTimeout(birdTimer);
  else scheduleBird();
}

/** A little voice per family when a Nubbin reacts. */
export function playChirp(family: 'chao' | 'pocket' | 'digi', happy = true): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  try {
    if (family === 'chao') {
      tone(happy ? 880 : 520, 0, 70, 'sine', 0.05, happy ? 1320 : 400);
      if (happy) tone(1180, 80, 90, 'sine', 0.04, 1500);
    } else if (family === 'pocket') {
      tone(happy ? 700 : 450, 0, 90, 'triangle', 0.05, happy ? 900 : 380);
      tone(happy ? 950 : 380, 100, 110, 'triangle', 0.04);
    } else {
      tone(happy ? 600 : 400, 0, 50, 'square', 0.035, happy ? 1000 : 300);
      tone(happy ? 1000 : 300, 60, 50, 'square', 0.035);
      if (happy) tone(1400, 120, 70, 'square', 0.03);
    }
  } catch {
    // Audio problems must never break the game.
  }
}

// ---------------------------------------------------------------- Hollow cues (lane B r7)

/**
 * R0199 (DUNG-56): the Hollow's encounter cues, all synthesised here like every other sound,
 * muted until the first tap and under the sound setting like the rest. `drop:<rarity>` rises
 * with the tier (a tick, a ting, two notes, an arpeggio, a chord); `boss:<act>` is a short
 * sting on its own root for each act.
 */
export type HollowCue =
  | 'notice'
  | 'poof'
  | 'shrine'
  | 'waypoint'
  | `drop:${'plain' | 'shiny' | 'fancy' | 'legendary' | 'set'}`
  | `boss:${number}`;

export function playHollowCue(cue: HollowCue): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
  try {
    if (cue === 'notice') {
      tone(1400, 0, 60, 'square', 0.035);
      tone(1800, 70, 80, 'square', 0.03);
    } else if (cue === 'poof') {
      tone(300, 0, 260, 'sine', 0.05, 1200);
      for (let i = 0; i < 3; i++) tone(1800 + i * 300, 200 + i * 60, 50, 'triangle', 0.025);
    } else if (cue === 'shrine') {
      tone(220, 0, 700, 'sine', 0.04);
      tone(330, 80, 620, 'sine', 0.025);
    } else if (cue === 'waypoint') {
      tone(180, 0, 380, 'triangle', 0.05, 900);
      tone(900, 300, 200, 'sine', 0.025, 1300);
    } else if (cue === 'drop:plain') {
      tone(1000, 0, 30, 'square', 0.025);
    } else if (cue === 'drop:shiny') {
      tone(1760, 0, 140, 'triangle', 0.04);
    } else if (cue === 'drop:fancy') {
      tone(1175, 0, 90, 'triangle', 0.05);
      tone(1568, 90, 160, 'triangle', 0.05);
    } else if (cue === 'drop:legendary') {
      [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 70, 160, 'triangle', 0.05));
    } else if (cue === 'drop:set') {
      for (const f of [523, 659, 784, 1047]) tone(f, 0, 600, 'triangle', 0.035);
    } else if (cue.startsWith('boss:')) {
      const root = [110, 98, 123, 87, 73][Number(cue.slice(5))] ?? 110;
      tone(root, 0, 500, 'sawtooth', 0.05);
      tone(root * 1.5, 120, 380, 'sawtooth', 0.04);
      tone(root * 2, 260, 520, 'square', 0.035, root * 1.89);
    }
  } catch {
    // As above.
  }
}
