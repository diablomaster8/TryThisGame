/**
 * FUN-04: when each Nubbin plays its personality's comic idle gag, read by both renderers.
 * A content Nubbin standing idle plays one of its personality's gags every 40–90 s, seeded
 * by its id so the timing is the same in both modes and across reloads; a child plays its
 * leaning's gags (the personality it would lock in now, `decidePersonality` on its care so
 * far) at half the rate and "wobbly" (`gagLook`). Gags are drawn only, in place: they never
 * move a Nubbin or change the sim. The ones that need to travel (pushing the ball into the
 * pond, floating down the stream) wait for a sim state.
 */
import { GAG_TIMING } from '../config/tuning';
import { decidePersonality } from '../sim/personality';
import type { Nubbin } from '../sim/types';
import { gagLook, type GagId, type GagLook, type GagPersonality } from './gag-looks';

/** The gags each personality plays in place, four where the table has four that stay put. */
export const GAGS_IN_PLACE: Record<GagPersonality, readonly GagId[]> = {
  cheerful: ['spinDizzy', 'waveBird', 'hum', 'clap'],
  shy: ['hide', 'peek', 'hugTail', 'flowerEat'],
  mischievous: ['sneakBoo', 'fruitSit', 'shadowHat', 'ballPush'],
  lazy: ['standNap', 'roll', 'mouthOpen', 'streamFloat'],
};
/** Gags whose look needs water or a ball under them: skipped while those are not drawn. */
const NEEDS_PLACE: ReadonlySet<GagId> = new Set(['streamFloat', 'ballPush']);

export interface GagFrame {
  id: GagId;
  look: GagLook;
  /** The Pixel frame index into `look.clip`. */
  frame: number;
  /** 0..1 through the gag. */
  p: number;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** The personality a Nubbin's gags show: its own, or a child's leaning; none for an egg. */
export function gagPersonality(
  n: Pick<Nubbin, 'stage' | 'personality' | 'childCare'>,
): GagPersonality | null {
  if (n.personality) return n.personality;
  return n.stage === 'child' ? decidePersonality(n.childCare) : null;
}

/** The gag frame at wall time `nowMs`, or null between gags (or when not `content`). */
export function gagAt(
  n: Pick<Nubbin, 'id' | 'stage' | 'personality' | 'childCare'>,
  nowMs: number,
  content: boolean,
): GagFrame | null {
  if (!content || (n.stage !== 'child' && n.stage !== 'adult')) return null;
  const who = gagPersonality(n);
  if (!who) return null;
  const child = n.stage === 'child';
  const h = hash(n.id);
  const [lo, hi] = GAG_TIMING.gapMs;
  const gap = (lo + (h % (hi - lo))) / (child ? GAG_TIMING.childRate : 1);
  const period = gap + GAG_TIMING.playMs;
  const shifted = nowMs + (h % period);
  const t = shifted % period;
  if (t >= GAG_TIMING.playMs) return null;
  const pool = GAGS_IN_PLACE[who].filter((g) => !NEEDS_PLACE.has(g));
  const id = pool[hash(`${n.id}:${Math.floor(shifted / period)}`) % pool.length]!;
  const look = gagLook(id, child);
  return { id, look, frame: Math.floor(t / look.ms) % look.frames, p: t / GAG_TIMING.playMs };
}
