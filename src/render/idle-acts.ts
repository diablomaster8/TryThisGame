/**
 * R0421 (LOOK-51), lane E r10: the garden idle acts, read by both renderers. Between its
 * personality gags (`gag-play.ts`), a content Nubbin standing idle now and then draws in the
 * dirt with a crayon, toots a toy trumpet (notes rise, never words), dances a four-beat spin,
 * has a thought ("?", then "!" and a hop), trips and sits up with a brief swirl, stretches,
 * yawns, or waves at the Keeper close by. Which act and when is seeded by the Nubbin's id and
 * the wall clock, as the gags are, so both modes agree and the sim is untouched. Each act is
 * an existing clip and pose (plus `stretch` and `yawn` in the Pixel sheet), and the props,
 * notes, spin and hops go through the performance look (`perform-look.ts`) both views
 * already draw. Reduced motion keeps the poses and props and drops the spin and hops. A trip
 * never cries.
 */
import { IDLE_ACTS } from '../config/tuning-look-r10e';
import type { Nubbin, Vec2 } from '../sim/types';
import type { PoseName } from '../samples/species';
import { gagAt, gagPersonality } from './gag-play';
import type { PerformLook } from './perform-look';
import type { EmoteShape } from './sprites/emote';

export type IdleActId =
  'draw' | 'trumpet' | 'dance' | 'think' | 'trip' | 'stretch' | 'yawn' | 'wave';
export const IDLE_ACT_IDS: readonly IdleActId[] = [
  'draw',
  'trumpet',
  'dance',
  'think',
  'trip',
  'stretch',
  'yawn',
  'wave',
];

export interface IdleActFrame {
  id: IdleActId;
  /** 0..1 through the act. */
  p: number;
  /** The Pixel clip and frame (drawn only where the sheet has it). */
  clip: string;
  frame: number;
  pose3d: PoseName;
  emote: EmoteShape;
  /** The prop, notes, spin, hop and squash, in the performance look's shape. */
  perf: PerformLook;
  /** The act's start, wall ms (a drawing's scribble is keyed by it). */
  startMs: number;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Pick one act from a weighted table with a 0..1 roll. */
export function pickAct(weights: Readonly<Record<IdleActId, number>>, roll: number): IdleActId {
  let total = 0;
  for (const id of IDLE_ACT_IDS) total += Math.max(0, weights[id]);
  let r = roll * total;
  for (const id of IDLE_ACT_IDS) {
    r -= Math.max(0, weights[id]);
    if (r < 0) return id;
  }
  return 'think';
}

const look: PerformLook = {
  lesson: 'dance',
  level: 1,
  clip: 'idle',
  prop: null,
  sw: 1,
  sh: 1,
  dx: 0,
  dy: 0,
  turn: 0,
  propDx: 0,
  propDy: 0,
  notes: false,
};
const out: IdleActFrame = {
  id: 'think',
  p: 0,
  clip: 'idle',
  frame: 0,
  pose3d: 'idle',
  emote: 'none',
  perf: look,
  startMs: 0,
};

/** Which act period `k` holds for a Nubbin: its personality's table, the wave only near the Keeper. */
export function actFor(
  n: Pick<Nubbin, 'id' | 'stage' | 'personality' | 'childCare'>,
  k: number,
  keeperNear: boolean,
): IdleActId {
  const who = gagPersonality(n) ?? 'none';
  const w: Record<IdleActId, number> = { ...IDLE_ACTS.weights[who] };
  if (!keeperNear) w.wave = 0;
  return pickAct(w, (hash(`${n.id}:act:${k}`) % 10007) / 10007);
}

/**
 * The idle act at wall time `nowMs`, or null between acts, while a gag plays, when not
 * `content`, or for an egg or cocoon. `keeper` is the Keeper's ground position (for the wave).
 * The returned object is reused: read it at once.
 */
export function idleActAt(
  n: Pick<Nubbin, 'id' | 'stage' | 'personality' | 'childCare' | 'pos'>,
  nowMs: number,
  content: boolean,
  keeper: Vec2 | null,
  reduce: boolean,
): IdleActFrame | null {
  if (!content || (n.stage !== 'child' && n.stage !== 'adult')) return null;
  if (gagAt(n, nowMs, content)) return null;
  const A = IDLE_ACTS;
  const h = hash(`${n.id}:acts`);
  const [lo, hi] = A.gapMs;
  const gap = (lo + (h % (hi - lo))) / (n.stage === 'child' ? A.childRate : 1);
  const period = gap + A.playMs;
  const shifted = nowMs + (h % period);
  const t = shifted % period;
  if (t >= A.playMs) return null;
  const k = Math.floor(shifted / period);
  const near = !!keeper && Math.hypot(keeper.x - n.pos.x, keeper.z - n.pos.z) < A.waveRange;
  const id = actFor(n, k, near);
  const p = t / A.playMs;
  look.lesson = 'dance';
  look.clip = 'idle';
  look.prop = null;
  look.sw = 1;
  look.sh = 1;
  look.dx = 0;
  look.dy = 0;
  look.turn = 0;
  look.propDx = 0;
  look.propDy = 0;
  look.notes = false;
  out.id = id;
  out.p = p;
  out.startMs = nowMs - t;
  out.emote = 'none';
  const two = (ms: number) => Math.floor(t / ms) % 2;
  switch (id) {
    case 'draw':
      // Sat down, the crayon scribbling low at its side; the scribble appears on the ground.
      out.clip = 'sit';
      out.frame = two(600);
      out.pose3d = 'sit';
      look.lesson = 'drawing';
      look.prop = 'crayon';
      look.propDx = reduce ? 0 : Math.sin(t / 70) * 0.05;
      look.propDy = -0.25 + (reduce ? 0 : Math.abs(Math.sin(t / 110)) * 0.05);
      break;
    case 'trumpet':
      out.clip = 'happy';
      out.frame = two(300);
      out.pose3d = 'happy';
      out.emote = 'note';
      look.lesson = 'instrument';
      look.prop = 'trumpet';
      look.notes = true;
      look.propDy = reduce ? 0 : Math.sin(t / 150) * 0.03;
      break;
    case 'dance': {
      // Four beats, a quarter turn and a bounce on each.
      out.clip = 'happy';
      out.frame = two(250);
      out.pose3d = 'happy';
      out.emote = 'star';
      const beats = p * 4;
      const b = Math.floor(beats);
      const f = beats - b;
      const ease = f * f * (3 - 2 * f);
      look.turn = reduce ? 0 : (b + ease) * (Math.PI / 2);
      look.dy = reduce ? 0 : Math.sin(f * Math.PI) * A.hop * 0.6;
      break;
    }
    case 'think':
      // A "?" for a while, then the "!" and a hop of delight.
      out.clip = 'idle';
      out.frame = 0;
      out.pose3d = p < 0.55 ? 'idle' : 'surprised';
      out.emote = p < 0.55 ? 'question' : 'exclaim';
      if (!reduce && p >= 0.55 && p < 0.75)
        look.dy = Math.sin(((p - 0.55) / 0.2) * Math.PI) * A.hop;
      break;
    case 'trip':
      // Over it goes, then it sits up, a little dazed (a swirl, never tears).
      if (p < 0.25) {
        out.clip = 'tumble';
        out.frame = Math.min(3, Math.floor((p / 0.25) * 4));
        out.pose3d = 'tumble';
        out.emote = 'exclaim';
      } else {
        out.clip = 'sit';
        out.frame = 0;
        out.pose3d = 'sit';
        out.emote = p < 0.7 ? 'spiral' : 'none';
      }
      break;
    case 'stretch':
      out.clip = 'stretch';
      out.frame = p < 0.5 ? 0 : 1;
      out.pose3d = 'itemGet';
      look.sh = reduce ? 1 : 1 + Math.sin(p * Math.PI) * 0.06;
      look.sw = reduce ? 1 : 1 - Math.sin(p * Math.PI) * 0.03;
      break;
    case 'yawn':
      out.clip = 'yawn';
      out.frame = p < 0.6 ? 0 : 1;
      out.pose3d = 'surprised';
      out.emote = 'zz';
      look.sh = reduce ? 1 : 1 + Math.sin(Math.min(1, p / 0.6) * Math.PI) * 0.04;
      break;
    case 'wave':
      out.clip = 'wave';
      out.frame = two(220);
      out.pose3d = 'happy';
      out.emote = 'heart';
      break;
  }
  return out;
}

/** A drawing's scribble on the ground: where, which picture, and when (sim ms). */
export interface ActDoodle {
  key: string;
  x: number;
  z: number;
  kind: number;
  atMs: number;
}

const DOODLES: ActDoodle[] = [];

/** Lay a drawing's scribble once per drawing, a little in front of the artist. */
export function noteActDoodle(
  n: Pick<Nubbin, 'id' | 'pos' | 'facing'>,
  act: IdleActFrame,
  simMs: number,
  kinds: number,
): void {
  if (act.id !== 'draw') return;
  const key = `${n.id}:${act.startMs}`;
  if (DOODLES.some((d) => d.key === key)) return;
  DOODLES.push({
    key,
    x: n.pos.x + Math.sin(n.facing) * 0.7,
    z: n.pos.z + Math.cos(n.facing) * 0.7,
    kind: hash(key) % Math.max(1, kinds),
    atMs: simMs,
  });
  while (DOODLES.length > IDLE_ACTS.doodleMax) DOODLES.shift();
}

/** A scribble's opacity at sim time `now`: drawn in over the act, faded out at the end. */
export function actDoodleAlpha(d: { atMs: number }, now: number): number {
  const A = IDLE_ACTS;
  const age = now - d.atMs;
  if (age < 0 || age >= A.doodleMs) return 0;
  return Math.min(1, age / A.playMs) * Math.min(1, (A.doodleMs - age) / A.doodleFadeMs);
}

/** The live scribbles (both renderers draw them beside the lesson doodles). */
export function actDoodles(): readonly ActDoodle[] {
  return DOODLES;
}
