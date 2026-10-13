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
  'tap' | 'pickup' | 'jump' | 'hit' | 'hatch' | 'evolve' | 'pet' | 'buy' | 'cheer' | 'win' | 'sad';

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
  | 'karate';

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
    buildGraph(ctx);
    unlocked = true;
    if (pendingSong) playSong(pendingSong);
  } catch {
    ctx = null;
  }
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

export function playSound(name: SoundName): void {
  if (!sfxEnabled || !unlocked || !ctx) return;
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

/** For tests: the parsed songs. */
export const SCORE: Readonly<Record<SongName, Song>> = SONGS;
