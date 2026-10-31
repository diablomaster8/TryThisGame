/**
 * R0507 (TECH-64): a rough loudness estimate for each song, read from the score's notes
 * rather than rendered audio, so a test can hold the songs level with one another. It is
 * a proxy, not LUFS: each note's power is its track gain squared, times its instrument's
 * oscillator mix, times how long it really sounds (held part at sustain, plus a share of
 * the release), averaged over one loop. A rendered `?audiolab` measurement is still to
 * come; until then this keeps a new or edited song from landing far louder or quieter.
 */
import { SONG_TRIM_DB } from '../config/tuning-r8d-audio';
import { SCORE, type SongName } from './audio';

type Song = (typeof SCORE)[SongName];
type Inst = Song['tracks'][number]['inst'];

/** Per instrument: oscillator power, sustain level, a cap on the held part (s), release (s). */
const INST: Record<Inst, { pow: number; sus: number; hold: number; rel: number }> = {
  lead: { pow: 0.6 ** 2 + 0.18 ** 2, sus: 0.7, hold: Infinity, rel: 0.18 },
  pluck: { pow: 0.35 ** 2 + 0.15 ** 2, sus: 0.15, hold: 0.3, rel: 0.25 },
  bass: { pow: 0.7 ** 2 + 0.3 ** 2 + 0.08 ** 2, sus: 0.8, hold: Infinity, rel: 0.1 },
  pad: { pow: 2 * 0.18 ** 2 + 0.08 ** 2, sus: 0.9, hold: Infinity, rel: 0.9 },
  bell: { pow: 0.6 ** 2 + 0.18 ** 2 + 0.06 ** 2, sus: 0.1, hold: 0.25, rel: 1.2 },
  brass: { pow: 2 * 0.3 ** 2 + 0.1 ** 2, sus: 0.85, hold: Infinity, rel: 0.2 },
  kick: { pow: 1, sus: 1, hold: 0.06, rel: 0.1 },
  snare: { pow: 0.5, sus: 1, hold: 0.04, rel: 0.05 },
  hat: { pow: 0.1, sus: 1, hold: 0.01, rel: 0.02 },
};

/** The song's estimated level in dB (relative; only differences between songs mean much). */
export function songLevelDb(name: SongName, trimDb = 0): number {
  const song = SCORE[name];
  const secPerBeat = 60 / song.bpm;
  let energy = 0;
  for (const track of song.tracks) {
    const k = INST[track.inst];
    for (const n of track.notes) {
      const voices = Math.max(1, n.p.length);
      const held = Math.min(n.d * secPerBeat, k.hold);
      energy += track.gain ** 2 * k.pow * voices * (held * k.sus ** 2 + (k.rel * k.sus ** 2) / 3);
    }
  }
  const power = energy / (song.beats * secPerBeat);
  return 10 * Math.log10(Math.max(power, 1e-12)) + trimDb;
}

/** The level after the song's trim in tuning. */
export function trimmedSongLevelDb(name: SongName): number {
  return songLevelDb(name, SONG_TRIM_DB[name] ?? 0);
}
