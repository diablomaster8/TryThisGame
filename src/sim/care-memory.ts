/**
 * R0541 (SOUL-23): a Nubbin remembers how it was treated, and shows it. The last few things
 * the Keeper did (pets, hugs, hand feeding, throws, drops) are kept on `n.recentCare` and
 * fade after a while, so this is never a chore. When the Keeper walks up:
 * - thrown or dropped in the last few minutes, it flinches (a quick crouch, a sweat drop),
 *   and a shy one backs off a step;
 * - petted or hugged three times lately, it runs up and asks for more, arms up.
 * And fed by hand lately, it trails after a Keeper who still has fruit in the bag.
 *
 * Live play only (`soulLive`): the Keeper never acts during catch-up, and nothing starts
 * there. Chances are hashed (`roll`), so no world rng is drawn.
 */
import { CARE_MEMORY, type CareKind } from '../config/tuning-soul-r10';
import { soulLive } from './antics';
import type { IdleAct } from './soul-idle';
import { roll } from './traits';
import type { Nubbin, Vec2, World } from './types';

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

/** Note something the Keeper did (live play only; old memories fade). */
export function rememberCare(n: Nubbin, kind: CareKind, now: number): void {
  if (!soulLive() || n.stage === 'egg') return;
  n.recentCare = [
    ...(n.recentCare ?? []).filter((c) => now - c.atMs < CARE_MEMORY.fadeMs),
    { kind, atMs: now },
  ].slice(-CARE_MEMORY.keep);
}

/** How many of these it remembers from the last `withinMs`. */
export function recalls(n: Nubbin, kinds: readonly CareKind[], withinMs: number, now: number) {
  return (n.recentCare ?? []).filter((c) => kinds.includes(c.kind) && now - c.atMs < withinMs)
    .length;
}

/** Whether the Keeper was within reach last step, per Nubbin (transient). */
const wasNear = new WeakMap<Nubbin, boolean>();

/**
 * On the step the Keeper walks up (for a wandering or sitting Nubbin): the flinch or the
 * ask for more, or null.
 */
export function approachAct(n: Nubbin, world: World, now: number): IdleAct | null {
  const k = world.keeper.pos;
  const near = dist(n.pos, k) < CARE_MEMORY.approachRadius;
  const before = wasNear.get(n) ?? false;
  wasNear.set(n, near);
  if (!near || before || !soulLive() || !n.recentCare?.length) return null;
  const toKeeper = Math.atan2(k.x - n.pos.x, k.z - n.pos.z);
  if (recalls(n, ['throw', 'drop'], CARE_MEMORY.flinchWithinMs, now) > 0) {
    const shy = n.personality === 'shy';
    const away = dist(n.pos, k) || 1;
    return {
      state: 'perform',
      ms: CARE_MEMORY.flinchMs,
      itemId: 'flinch',
      facing: toKeeper,
      ...(shy
        ? {
            target: {
              x: n.pos.x + ((n.pos.x - k.x) / away) * CARE_MEMORY.backOff,
              z: n.pos.z + ((n.pos.z - k.z) / away) * CARE_MEMORY.backOff,
            },
          }
        : {}),
    };
  }
  if (recalls(n, ['pet', 'hug'], CARE_MEMORY.askWithinMs, now) >= CARE_MEMORY.askPets) {
    const gap = 0.9;
    return {
      state: 'perform',
      ms: CARE_MEMORY.askMs,
      itemId: 'askUp',
      target: { x: k.x - Math.sin(toKeeper) * gap, z: k.z - Math.cos(toKeeper) * gap },
    };
  }
  return null;
}

/** The idle choice's trail after a Keeper with fruit, once fed by hand lately, or null. */
export function followFruitAct(n: Nubbin, world: World, now: number): IdleAct | null {
  if (!soulLive() || n.stage === 'egg' || n.stage === 'cocoon') return null;
  if (world.inventory.fruit <= 0) return null;
  const k = world.keeper;
  if (dist(n.pos, k.pos) > CARE_MEMORY.followRadius) return null;
  if (recalls(n, ['feed'], CARE_MEMORY.followWithinMs, now) === 0) return null;
  if (roll(n, 'followFruit', now) >= CARE_MEMORY.followChance) return null;
  const a = k.facing + Math.PI + (roll(n, 'followSide', now) - 0.5);
  return {
    state: 'wander',
    ms: CARE_MEMORY.followMs,
    itemId: 'followFruit',
    target: {
      x: k.pos.x + Math.sin(a) * CARE_MEMORY.followGap,
      z: k.pos.z + Math.cos(a) * CARE_MEMORY.followGap,
    },
  };
}
