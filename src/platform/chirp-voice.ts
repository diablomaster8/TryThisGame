/**
 * R0462 (TECH-65): a Nubbin's own chirp voice, from its id and its personality, so two of
 * the same species sound different and each sounds the same after a reload. Pure: no
 * audio, no randomness, just a hash of the id into the tuning ranges.
 */
import { CHIRP_VOICE } from '../config/tuning-r8d-audio';
import type { Personality } from '../sim/types';

export interface ChirpVoice {
  /** Frequency multiplier. */
  pitch: number;
  /** Tempo multiplier: note lengths and gaps divide by it. */
  speed: number;
  /** Extra rise at the end of each slide (a share of the frequency). */
  wobble: number;
  /** Loudness multiplier. */
  gain: number;
  /** Length multiplier for the chirp's last note. */
  tail: number;
}

export const PLAIN_VOICE: ChirpVoice = { pitch: 1, speed: 1, wobble: 0, gain: 1, tail: 1 };

/** FNV-1a over the id, then three independent shares 0..1 from its bits. */
function shares(id: string): [number, number, number] {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const mix = (x: number) => {
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
    return ((x ^ (x >>> 16)) >>> 0) / 0xffffffff;
  };
  return [mix(h), mix(h ^ 0x9e3779b9), mix(h ^ 0x7f4a7c15)];
}

const lerp = ([lo, hi]: readonly [number, number], t: number) => lo + (hi - lo) * t;

export function chirpVoice(id: string, personality: Personality | null): ChirpVoice {
  const [a, b, c] = shares(id);
  const p = personality ? CHIRP_VOICE.personality[personality] : null;
  return {
    pitch: lerp(CHIRP_VOICE.pitch, a) * (p?.pitch ?? 1),
    speed: lerp(CHIRP_VOICE.speed, b) * (p?.speed ?? 1),
    wobble: lerp(CHIRP_VOICE.wobble, c) + (p?.wobble ?? 0),
    gain: p?.gain ?? 1,
    tail: p?.tail ?? 1,
  };
}
