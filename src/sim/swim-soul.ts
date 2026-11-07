/**
 * R0582 (SOUL-65): who swims, and how. A Swim form or a strong Swim lean is at home in the
 * pond (`swimFactor`, ×3 on the idle table's swim weight); the personality's own swim
 * multiplier does the rest (sim/personality.ts). A shy one only wades at the edge
 * (`swimSpot`), a lazy one floats on its back (state-flavour.ts), and two in the water
 * splash each other now and then (`splashFriend`, a short mark on the swim act's `itemId`
 * the renderers show). Splashing is live play only and hashed (`roll`); no world rng.
 */
import { GROVE } from '../config/tuning';
import { SWIM_SOUL } from '../config/tuning-more/soul-quirks-gait';
import { soulLive } from './antics';
import { roll } from './traits';
import type { Nubbin, Vec2, World } from './types';

/** How much more often this Nubbin swims than the table's base. */
export function swimFactor(n: Nubbin): number {
  return n.form?.type === 'swim' || n.typeLean.swim > SWIM_SOUL.leanAt ? SWIM_SOUL.typeBoost : 1;
}

/** Where a shy one wades: just inside the rim on its own side; null for the rest. */
export function swimSpot(n: Nubbin, now: number): Vec2 | null {
  if (n.personality !== 'shy') return null;
  const p = GROVE.pond;
  const base = Math.atan2(n.pos.z - p.z, n.pos.x - p.x);
  const a = base + (roll(n, 'wade', now) - 0.5) * 0.8;
  const r = p.r - SWIM_SOUL.edgeIn;
  return { x: p.x + Math.cos(a) * r, z: p.z + Math.sin(a) * r };
}

/**
 * Once a second while swimming: maybe splash a friend swimming close by. The mark is the
 * swim act's `itemId`, `splashFriend:<friend id>:<sim ms>`, cleared here `splashMs` later.
 */
export function splashFriend(n: Nubbin, world: World, now: number, dtMs: number): void {
  const b = n.behavior;
  if (b.itemId?.startsWith('splashFriend:')) {
    const at = Number(b.itemId.split(':')[2] ?? 0);
    if (now - at >= SWIM_SOUL.splashMs) b.itemId = null;
    return;
  }
  if (!soulLive() || b.itemId) return;
  if (Math.floor(now / 1000) === Math.floor((now - dtMs) / 1000)) return;
  const friend = world.nubbins.find(
    (o) =>
      o !== n &&
      o.behavior.state === 'swim' &&
      Math.hypot(o.pos.x - n.pos.x, o.pos.z - n.pos.z) < SWIM_SOUL.splashRadius,
  );
  if (!friend || roll(n, 'splash', now) >= SWIM_SOUL.splashChance) return;
  b.itemId = `splashFriend:${friend.id}:${now}`;
  n.facing = Math.atan2(friend.pos.x - n.pos.x, friend.pos.z - n.pos.z);
}
