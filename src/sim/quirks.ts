/**
 * R0553 (SOUL-36), the lane A r10 half: each personality's own idle quirk. Cheerful and
 * mischievous are both outgoing, shy and lazy both stay put; these are what tell each pair
 * apart at a glance:
 * - cheerful twirls on the spot for the joy of it (a star);
 * - mischievous tiptoes up behind another Nubbin or the Keeper and grins (a smirk);
 * - shy hides its face when the Keeper comes near, or watches from a distance (no ball);
 * - lazy lies down for a doze wherever it is (zz).
 *
 * Chances are hashed (`roll`), so no world rng is drawn, and none of it runs while catching
 * up on time away (`soulLive`). Behaviour only, never stats.
 */
import { QUIRKS } from '../config/tuning-soul-r10';
import { liveliness, soulLive } from './antics';
import { leaningPersonality } from './personality';
import type { IdleAct } from './soul-idle';
import { roll } from './traits';
import type { Nubbin, Personality, Vec2, World } from './types';

export type QuirkId = 'twirl' | 'sneak' | 'hideFace' | 'watch' | 'doze';
export const QUIRK_IDS: readonly QuirkId[] = ['twirl', 'sneak', 'hideFace', 'watch', 'doze'];

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

function personalityOf(n: Nubbin): { p: Personality; s: number } | null {
  if (n.personality) return { p: n.personality, s: 1 };
  const lean = n.stage === 'child' ? leaningPersonality(n) : null;
  return lean ? { p: lean, s: QUIRKS.childStrength } : null;
}

const span = (n: Nubbin, now: number, [lo, hi]: readonly [number, number]): number =>
  lo + (hi - lo) * roll(n, 'quirkMs', now);

/** The idle choice's personality quirk, or null. */
export function quirkAct(n: Nubbin, world: World, now: number): IdleAct | null {
  if (!soulLive() || n.stage === 'egg' || n.stage === 'cocoon') return null;
  const who = personalityOf(n);
  if (!who) return null;
  const chance = QUIRKS.chance[who.p] * who.s * liveliness(world);
  if (roll(n, 'quirk', now) >= Math.min(1, chance)) return null;
  const k = world.keeper.pos;
  switch (who.p) {
    case 'cheerful':
      return { state: 'perform', ms: span(n, now, QUIRKS.twirlMs), itemId: 'twirl' };
    case 'mischievous': {
      // Up behind the nearest other Nubbin or the Keeper, whichever is nearer.
      let mark: { pos: Vec2; facing: number } | null =
        dist(k, n.pos) < QUIRKS.sneakRadius ? world.keeper : null;
      for (const o of world.nubbins)
        if (
          o !== n &&
          o.stage !== 'egg' &&
          dist(o.pos, n.pos) < QUIRKS.sneakRadius &&
          (!mark || dist(o.pos, n.pos) < dist(mark.pos, n.pos))
        )
          mark = o;
      if (!mark) return null;
      return {
        state: 'perform',
        ms: QUIRKS.sneakMs,
        itemId: 'sneak',
        target: {
          x: mark.pos.x - Math.sin(mark.facing) * QUIRKS.sneakBehind,
          z: mark.pos.z - Math.cos(mark.facing) * QUIRKS.sneakBehind,
        },
      };
    }
    case 'shy': {
      const near = dist(k, n.pos) < QUIRKS.hideRadius;
      return {
        state: 'sit',
        ms: span(n, now, near ? QUIRKS.hideMs : QUIRKS.watchMs),
        itemId: near ? 'hideFace' : 'watch',
        // Hiding: turned away from the Keeper; watching: turned toward it.
        facing: Math.atan2(k.x - n.pos.x, k.z - n.pos.z) + (near ? Math.PI : 0),
      };
    }
    case 'lazy':
      return { state: 'sit', ms: span(n, now, QUIRKS.dozeMs), itemId: 'doze' };
  }
}
