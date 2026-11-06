/**
 * R0675 (KIDS-03): the Learning Grove's listening cues, made in code. Each animal call and each
 * first sound (phoneme) is a short recipe of segments: a buzzy tone or a burst of noise, a
 * pitch glide, a vibrato and, for a vowel-ish colour, a few band-pass "formants". The recipes
 * are plain data (so a test can check every clip has one); `renderRecipe` turns one into Web
 * Audio nodes. They are stand-ins for recordings and say so in `docs/edu-clips.md`.
 */
import { animalClip, EDU_ANIMALS, EDU_PHONEMES, phonemeClip } from '../config/edu';

export interface Seg {
  /** Start, seconds from the clip's start. */
  t: number;
  dur: number;
  kind: 'tone' | 'noise';
  /** Tone pitch in Hz, gliding to `f1` when given. Noise ignores it. */
  f0?: number;
  f1?: number;
  wave?: OscillatorType;
  /** Vibrato [rate Hz, depth Hz]. */
  vib?: [number, number];
  /** Band-pass centres that colour the sound (a vowel or a nasal). */
  formants?: number[];
  /** Noise only: one band [low, high] Hz. */
  band?: [number, number];
  gain: number;
}

const tone = (
  t: number,
  dur: number,
  f0: number,
  f1: number | undefined,
  rest: Partial<Seg>,
): Seg => ({
  t,
  dur,
  kind: 'tone',
  f0,
  ...(f1 !== undefined ? { f1 } : {}),
  wave: 'sawtooth',
  gain: 0.5,
  ...rest,
});
const hiss = (t: number, dur: number, band: [number, number], gain: number): Seg => ({
  t,
  dur,
  kind: 'noise',
  band,
  gain,
});

/** A run of short repeats of the same tone (a quack, a cluck, a ribbit). */
function pulses(
  n: number,
  gap: number,
  dur: number,
  f0: number,
  f1: number,
  rest: Partial<Seg>,
): Seg[] {
  return Array.from({ length: n }, (_, i) => tone(i * gap, dur, f0, f1, rest));
}

const ANIMALS: Record<string, Seg[]> = {
  cow: [tone(0, 1.2, 135, 100, { vib: [5, 4], formants: [500, 900], gain: 0.9 })],
  duck: pulses(2, 0.2, 0.13, 420, 300, { formants: [900, 1800], gain: 0.8 }),
  dog: [
    ...pulses(2, 0.26, 0.16, 260, 150, { formants: [700, 1100], gain: 0.9 }),
    hiss(0, 0.04, [800, 3000], 0.5),
    hiss(0.26, 0.04, [800, 3000], 0.5),
  ],
  cat: [
    tone(0, 0.25, 420, 700, { formants: [800, 2200], gain: 0.8 }),
    tone(0.25, 0.5, 700, 480, { vib: [6, 10], formants: [700, 2100], gain: 0.8 }),
  ],
  sheep: [tone(0, 0.9, 310, 280, { vib: [24, 30], formants: [800, 1400], gain: 0.8 })],
  pig: [
    tone(0, 0.12, 180, 270, { formants: [600, 1200], gain: 0.8 }),
    tone(0.14, 0.3, 270, 130, { formants: [600, 1200], gain: 0.8 }),
    hiss(0.14, 0.3, [300, 1200], 0.25),
  ],
  frog: pulses(4, 0.09, 0.06, 150, 230, { wave: 'square', formants: [400, 1500], gain: 0.5 }),
  owl: [
    tone(0, 0.3, 430, 400, { wave: 'sine', formants: [450], gain: 0.9 }),
    tone(0.45, 0.55, 430, 360, { wave: 'sine', formants: [450], gain: 0.9 }),
  ],
  bee: [tone(0, 1, 185, 185, { vib: [40, 12], formants: [900], gain: 0.5 })],
  horse: [
    tone(0, 0.4, 600, 950, { vib: [9, 25], formants: [900, 2000], gain: 0.7 }),
    tone(0.4, 0.7, 950, 380, { vib: [10, 30], formants: [800, 1800], gain: 0.7 }),
    hiss(0, 1.1, [1500, 5000], 0.12),
  ],
  lion: [
    tone(0, 1.3, 95, 65, { vib: [22, 6], formants: [400, 800], gain: 0.9 }),
    hiss(0, 1.3, [200, 1500], 0.35),
  ],
  fish: pulses(3, 0.14, 0.08, 300, 520, { wave: 'sine', gain: 0.8 }),
  bird: pulses(3, 0.14, 0.09, 3000, 3900, { wave: 'sine', gain: 0.5 }),
  penguin: [
    tone(0, 0.45, 520, 680, { vib: [14, 20], formants: [1000, 2000], gain: 0.7 }),
    hiss(0, 0.45, [1000, 4000], 0.25),
  ],
  bear: [
    tone(0, 1, 75, 65, { vib: [30, 8], formants: [350, 700], gain: 0.9 }),
    hiss(0, 1, [150, 900], 0.4),
  ],
  chicken: pulses(3, 0.1, 0.07, 480, 300, { formants: [800, 1700], gain: 0.7 }),
};

/** A vowel: two formants over a gentle glide. */
const vowel = (t: number, dur: number, f: [number, number], pitch = 150, gain = 0.7): Seg =>
  tone(t, dur, pitch, pitch * 0.9, { formants: f, gain });

const voiced = (f: [number, number], len = 0.5): Seg[] => [
  tone(0, len, 128, 120, { formants: f, gain: 0.7 }),
];

const PHONEMES: Record<string, Seg[]> = {
  a: [vowel(0, 0.5, [700, 1700])],
  e: [vowel(0, 0.5, [550, 1900])],
  i: [vowel(0, 0.5, [400, 2000])],
  o: [vowel(0, 0.5, [650, 1000])],
  u: [vowel(0, 0.5, [600, 1200])],
  b: [
    tone(0, 0.05, 110, 140, { wave: 'sine', gain: 0.8 }),
    vowel(0.05, 0.12, [500, 1400], 130, 0.35),
  ],
  d: [
    tone(0, 0.04, 140, 160, { wave: 'sine', gain: 0.7 }),
    hiss(0.01, 0.03, [3000, 5000], 0.2),
    vowel(0.05, 0.12, [500, 1600], 130, 0.35),
  ],
  g: [
    tone(0, 0.05, 110, 130, { wave: 'sine', gain: 0.7 }),
    hiss(0, 0.04, [1200, 2500], 0.3),
    vowel(0.05, 0.12, [500, 1300], 130, 0.35),
  ],
  k: [hiss(0, 0.05, [1500, 3500], 0.7), vowel(0.06, 0.1, [500, 1500], 140, 0.18)],
  p: [hiss(0, 0.04, [600, 2500], 0.6), vowel(0.05, 0.1, [500, 1400], 140, 0.18)],
  t: [hiss(0, 0.04, [3500, 7000], 0.6), vowel(0.05, 0.1, [500, 1700], 140, 0.18)],
  j: [hiss(0, 0.07, [2500, 5500], 0.45), vowel(0.05, 0.14, [450, 1900], 140, 0.4)],
  f: [hiss(0, 0.5, [2500, 8000], 0.35)],
  h: [hiss(0, 0.4, [800, 3500], 0.3)],
  s: [hiss(0, 0.55, [5000, 9500], 0.45)],
  z: [hiss(0, 0.5, [5000, 9500], 0.25), tone(0, 0.5, 130, 130, { wave: 'sine', gain: 0.35 })],
  v: [
    hiss(0, 0.45, [2500, 8000], 0.2),
    tone(0, 0.45, 120, 120, { formants: [300, 900], gain: 0.4 }),
  ],
  m: voiced([250, 1000], 0.55),
  n: voiced([250, 1700], 0.55),
  l: voiced([350, 1100]),
  r: voiced([350, 1250]),
  w: voiced([300, 700], 0.45),
  y: voiced([280, 2200], 0.45),
  kw: [
    hiss(0, 0.05, [1500, 3500], 0.6),
    tone(0.07, 0.4, 130, 130, { formants: [300, 700], gain: 0.7 }),
  ],
};

/** Clip id -> recipe, for every animal and first sound. Words are said by the voice instead. */
export const EDU_RECIPES: Readonly<Record<string, readonly Seg[]>> = (() => {
  const out: Record<string, readonly Seg[]> = {};
  for (const a of EDU_ANIMALS) out[animalClip(a.name)] = ANIMALS[a.name] ?? [];
  for (const p of EDU_PHONEMES) out[phonemeClip(p)] = PHONEMES[p] ?? [];
  return out;
})();

/** How long a recipe lasts, seconds. */
export function recipeLength(segs: readonly Seg[]): number {
  return segs.reduce((m, s) => Math.max(m, s.t + s.dur), 0);
}

export interface SynthOut {
  ctx: AudioContext;
  bus: GainNode;
  noise: AudioBuffer;
}

/** Schedule a recipe on the audio graph, starting `delay` seconds from now. */
export function renderRecipe(out: SynthOut, segs: readonly Seg[], delay = 0.02): void {
  const { ctx, bus } = out;
  const t0 = ctx.currentTime + delay;
  for (const s of segs) {
    const start = t0 + s.t;
    const end = start + s.dur;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, start);
    env.gain.linearRampToValueAtTime(s.gain, start + Math.min(0.02, s.dur / 3));
    env.gain.setValueAtTime(s.gain, Math.max(start, end - Math.min(0.06, s.dur / 2)));
    env.gain.linearRampToValueAtTime(0, end);
    env.connect(bus);
    let src: AudioScheduledSourceNode;
    if (s.kind === 'tone') {
      const o = ctx.createOscillator();
      o.type = s.wave ?? 'sawtooth';
      o.frequency.setValueAtTime(s.f0 ?? 200, start);
      if (s.f1 !== undefined) o.frequency.linearRampToValueAtTime(s.f1, end);
      if (s.vib) {
        const lfo = ctx.createOscillator();
        const depth = ctx.createGain();
        lfo.frequency.value = s.vib[0];
        depth.gain.value = s.vib[1];
        lfo.connect(depth).connect(o.frequency);
        lfo.start(start);
        lfo.stop(end + 0.02);
      }
      src = o;
    } else {
      const n = ctx.createBufferSource();
      n.buffer = out.noise;
      n.loop = true;
      src = n;
    }
    if (s.formants?.length) {
      const share = 1 / s.formants.length;
      for (const f of s.formants) {
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = f;
        bp.Q.value = 5;
        const g = ctx.createGain();
        g.gain.value = share * 2.2;
        src.connect(bp).connect(g).connect(env);
      }
    } else if (s.band) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      const [lo, hi] = s.band;
      bp.frequency.value = Math.sqrt(lo * hi);
      bp.Q.value = Math.max(0.5, Math.sqrt(lo * hi) / (hi - lo));
      src.connect(bp).connect(env);
    } else {
      src.connect(env);
    }
    src.start(start);
    src.stop(end + 0.03);
  }
}
