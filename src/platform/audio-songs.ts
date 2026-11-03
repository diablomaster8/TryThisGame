/**
 * The score: every song as a few tracks of notes in a readable notation (TECH-37, split out
 * of audio.ts, which keeps the sequencer, the synth voices and the effects). Original music.
 * Pure data: building it needs no AudioContext.
 */
import type { SongName } from './audio';

export type Inst = 'lead' | 'pluck' | 'bass' | 'pad' | 'bell' | 'brass' | 'kick' | 'snare' | 'hat';

export interface Note {
  /** Start beat. */
  t: number;
  /** Length in beats. */
  d: number;
  /** MIDI pitches (several for a chord). Empty for drums. */
  p: number[];
}

export interface Track {
  inst: Inst;
  gain: number;
  notes: Note[];
}

export interface Song {
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

export const SONGS: Record<SongName, Song> = {
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
