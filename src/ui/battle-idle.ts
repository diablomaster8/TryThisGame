import { BATTLE_R6 } from '../config/tuning-battle-r6';
import type { Combatant } from '../sim/battle/types';

/**
 * Personality idles in battle (recs FIGHT-78): while a bout waits for the Keeper, each
 * combatant plays its own little idle every 3–6 s. The timing is seeded per view (the
 * combatant's id and the view's own seed), never from the sim, so it never touches a replay.
 *
 * - Cheerful bounces and waves at the Keeper; Shy peeks out from behind its ears;
 *   Mischievous sticks out its tongue at the foe; Lazy yawns and sits.
 * - Moody Grumpy crosses its arms; Sleepy nods off. Eternals float a little, always.
 *
 * With reduced motion the idle is a still pose: the glyph shows, the sprite does not move.
 */
export type IdleKind = 'bounce' | 'peek' | 'tongue' | 'yawn' | 'cross' | 'nod' | 'float';

export interface IdlePose {
  kind: IdleKind | null;
  /** Offsets in view pixels (one unit = one sprite pixel at the view's scale). */
  dx: number;
  dy: number;
  /** A small emote drawn over the head while the idle plays; '' for none. */
  glyph: string;
}

export const IDLE_GLYPH: Readonly<Record<IdleKind, string>> = {
  bounce: '👋',
  peek: '🙈',
  tongue: '😛',
  yawn: '🥱',
  cross: '💢',
  nod: '💤',
  float: '',
};

const I = BATTLE_R6.idle;
const STILL: IdlePose = { kind: null, dx: 0, dy: 0, glyph: '' };

/** A small string hash (FNV-1a), for per-view seeding. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Which idle a combatant has: its moody trait first, then its personality. */
export function idleKind(
  c: Pick<Combatant, 'personality' | 'eternal'> & { moody?: string | null },
): IdleKind | null {
  if (c.moody === 'grumpy') return 'cross';
  if (c.moody === 'sleepy') return 'nod';
  switch (c.personality) {
    case 'cheerful':
      return 'bounce';
    case 'shy':
      return 'peek';
    case 'mischievous':
      return 'tongue';
    case 'lazy':
      return 'yawn';
    default:
      return c.eternal ? 'float' : null;
  }
}

/**
 * The idle pose at `now` (ms) for `kind`, for a combatant `id` in a view seeded `seed`. The
 * idle plays for `playMs` once per cycle of 3–6 s; Eternals float all the time.
 */
export function idlePose(
  kind: IdleKind | null,
  id: string,
  seed: number,
  now: number,
  reduce: boolean,
): IdlePose {
  if (!kind) return STILL;
  if (kind === 'float')
    return { kind, dx: 0, dy: reduce ? -2 : -2 + Math.sin(now / 500) * 1.5, glyph: '' };
  // Cycles of a seeded length; the idle sits at a seeded point inside each one.
  const base = hash(`${seed}:${id}`);
  const span = I.minMs + (base % (I.maxMs - I.minMs));
  const cycle = Math.floor(now / span);
  const at = hash(`${base}:${cycle}`) % Math.max(1, span - I.playMs);
  const t = now - cycle * span - at;
  if (t < 0 || t >= I.playMs) return STILL;
  const k = t / I.playMs;
  const glyph = IDLE_GLYPH[kind];
  if (reduce) return { kind, dx: 0, dy: 0, glyph };
  const wave = Math.sin(k * Math.PI);
  switch (kind) {
    case 'bounce':
      return { kind, dx: 0, dy: -Math.abs(Math.sin(k * Math.PI * 3)) * 4, glyph };
    case 'peek':
      return { kind, dx: -wave * 2, dy: wave * 2, glyph };
    case 'tongue':
      return { kind, dx: wave * 2, dy: 0, glyph };
    case 'yawn':
    case 'nod':
      return { kind, dx: 0, dy: wave * 3, glyph };
    case 'cross':
      return { kind, dx: Math.sin(k * Math.PI * 6) * 1, dy: 0, glyph };
  }
}

/** Reduced motion, from the page's class or the system setting. */
export const reducedMotion = (): boolean =>
  typeof document !== 'undefined' &&
  (document.documentElement.classList.contains('reduce-motion') ||
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
