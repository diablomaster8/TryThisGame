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
import { GROVE } from '../config/tuning';
import { QUIRKS_R11 } from '../config/tuning-soul-r11';
import { liveliness, soulLive } from './antics';
import { leaningPersonality } from './personality';
import type { IdleAct } from './soul-idle';
import { roll } from './traits';
import type { Nubbin, Personality, Vec2, World } from './types';

export type QuirkId =
  | 'twirl'
  | 'sneak'
  | 'hideFace'
  | 'watch'
  | 'doze'
  // R0529 (SOUL-11): the second four, three each, the top one first.
  | 'roam'
  | 'peer'
  | 'poke'
  | 'comfort'
  | 'offerFruit'
  | 'tend'
  | 'lead'
  | 'splash'
  | 'flex'
  | 'cloudGaze'
  | 'butterfly'
  | 'daydream';
export const QUIRK_IDS: readonly QuirkId[] = [
  'twirl',
  'sneak',
  'hideFace',
  'watch',
  'doze',
  'roam',
  'peer',
  'poke',
  'comfort',
  'offerFruit',
  'tend',
  'lead',
  'splash',
  'flex',
  'cloudGaze',
  'butterfly',
  'daydream',
];

/** R0529: each personality's signature quirks, the top (most likely) one first. */
export const SIGNATURE_QUIRKS: Record<Personality, readonly QuirkId[]> = {
  cheerful: ['twirl'],
  mischievous: ['sneak'],
  shy: ['hideFace', 'watch'],
  lazy: ['doze'],
  curious: ['roam', 'peer', 'poke'],
  gentle: ['comfort', 'offerFruit', 'tend'],
  bold: ['lead', 'splash', 'flex'],
  dreamy: ['cloudGaze', 'butterfly', 'daydream'],
};

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
    default:
      return secondQuirk(n, who.p, world, now);
  }
}

/**
 * R0529: the second four's quirks. The first of a personality's three is tried on most
 * rolls, then the second, then the third; one that needs something nearby (a sad friend, a
 * fruit, a pond) falls through to the next, and the last always plays.
 */
function secondQuirk(
  n: Nubbin,
  p: 'curious' | 'gentle' | 'bold' | 'dreamy',
  world: World,
  now: number,
): IdleAct | null {
  const r = roll(n, 'quirk-pick', now);
  const [a, b] = QUIRKS_R11.pick;
  const start = r < a ? 0 : r < a + b ? 1 : 2;
  const ids = SIGNATURE_QUIRKS[p];
  for (let i = start; i < ids.length; i++) {
    const act = quirkOf(n, ids[i]!, world, now);
    if (act) return act;
  }
  return null;
}

const Q = QUIRKS_R11;

/** Others free to be patted, followed or shown things. */
const others = (n: Nubbin, world: World, r: number): Nubbin[] =>
  world.nubbins.filter(
    (o) => o !== n && o.stage !== 'egg' && o.stage !== 'cocoon' && dist(o.pos, n.pos) < r,
  );

function quirkOf(n: Nubbin, id: QuirkId, world: World, now: number): IdleAct | null {
  const angle = roll(n, 'quirk-angle', now) * Math.PI * 2;
  const away = (r: number): Vec2 => ({
    x: n.pos.x + Math.cos(angle) * r,
    z: n.pos.z + Math.sin(angle) * r,
  });
  switch (id) {
    case 'roam': {
      // Off somewhere far, to see what is there.
      const r = Q.roamRange[0] + (Q.roamRange[1] - Q.roamRange[0]) * roll(n, 'roam-r', now);
      return { state: 'wander', ms: span(n, now, Q.roamMs), itemId: 'roam', target: away(r) };
    }
    case 'peer':
      return { state: 'sit', ms: span(n, now, Q.peerMs), itemId: 'peer', facing: angle };
    case 'poke': {
      let best: Vec2 | null = null;
      for (const i of world.items)
        if (dist(i.pos, n.pos) < Q.pokeRadius && (!best || dist(i.pos, n.pos) < dist(best, n.pos)))
          best = i.pos;
      const at = best ? { x: best.x + 0.7, z: best.z } : away(2);
      return { state: 'perform', ms: Q.pokeMs, itemId: 'poke', target: at };
    }
    case 'comfort': {
      // The saddest (or hungriest) one nearby gets a pat.
      let best: Nubbin | null = null;
      let worst = 0;
      for (const o of others(n, world, Q.patRadius)) {
        const need = Math.max(-o.needs.happiness / 100, 1 - o.needs.hunger * 2);
        if (need > worst) {
          worst = need;
          best = o;
        }
      }
      if (!best) return null;
      return {
        state: 'perform',
        ms: Q.patMs,
        itemId: `comfort:${best.id}`,
        target: { x: best.pos.x + 0.7, z: best.pos.z },
      };
    }
    case 'offerFruit': {
      const friend = others(n, world, Q.patRadius)[0];
      if (!friend || !world.items.some((i) => i.kind === 'fruit')) return null;
      return {
        state: 'perform',
        ms: Q.offerMs,
        itemId: 'offerFruit',
        target: { x: friend.pos.x + 0.8, z: friend.pos.z },
      };
    }
    case 'tend': {
      let tree: Vec2 | null = null;
      for (const t of world.trees)
        if (!tree || dist(t.pos, n.pos) < dist(tree, n.pos)) tree = t.pos;
      const at = tree ? { x: tree.x + 0.9, z: tree.z } : away(2);
      return { state: 'perform', ms: span(n, now, Q.tendMs), itemId: 'tend', target: at };
    }
    case 'lead': {
      // Off at a march, and the friends nearby fall in behind.
      const to = away(Q.leadRange);
      const ms = span(n, now, Q.leadMs);
      for (const o of others(n, world, Q.leadFollowRadius))
        if (o.behavior.state === 'wander' || o.behavior.state === 'sit') {
          o.behavior.state = 'wander';
          o.behavior.sinceMs = now;
          o.behavior.untilMs = now + ms;
          o.behavior.itemId = `follow:${n.id}`;
          o.behavior.target = { x: to.x - Math.cos(angle) * 1.2, z: to.z - Math.sin(angle) * 1.2 };
        }
      return { state: 'wander', ms, itemId: 'lead', target: to };
    }
    case 'splash': {
      const p = GROVE.pond;
      const d = dist(p, n.pos) || 1;
      // At the near edge of the pond, one step in.
      const at = {
        x: p.x + ((n.pos.x - p.x) / d) * (p.r - 0.6),
        z: p.z + ((n.pos.z - p.z) / d) * (p.r - 0.6),
      };
      return { state: 'perform', ms: span(n, now, Q.splashMs), itemId: 'splash', target: at };
    }
    case 'flex':
      return { state: 'perform', ms: Q.flexMs, itemId: 'flex' };
    case 'cloudGaze':
      return { state: 'sit', ms: span(n, now, Q.gazeMs), itemId: 'cloudGaze' };
    case 'butterfly':
      return {
        state: 'wander',
        ms: span(n, now, Q.butterflyMs),
        itemId: 'butterfly',
        target: away(Q.butterflyRange),
      };
    case 'daydream':
      return { state: 'sit', ms: span(n, now, Q.daydreamMs), itemId: 'daydream' };
    default:
      return null;
  }
}
