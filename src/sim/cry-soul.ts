/**
 * R0558 (SOUL-41), the cry half, and R0581 (SOUL-64): crying gets a personality, happens for
 * more than hunger, and is answered.
 * - How it cries: a shy one sniffles quietly (`sniffle`), a bold one cries short and ends in a
 *   stomp (`cryStomp`), a gentle one walks to the Keeper to cry (`cryToKeeper`); the rest wail
 *   (`cry`). The renderers read the act's `itemId`.
 * - Brief cries, besides starving: a rival's puff makes a soft-hearted one cry, a snatched
 *   fruit does, and so does a third throw in a short while.
 * - A friend within reach (gentle ×3, Sun ×2) comes over and pats (the `comfort:` act that
 *   soul-idle's `arriveAct` already plays); the crier stops, both get a heart.
 *
 * Live play only (`soulLive`): time away cries as plainly as before. Chances are hashed per
 * Nubbin and second (`roll`), so no world rng is drawn.
 */
import { ALIGNMENT, BEHAVIOR, SIM } from '../config/tuning';
import { CRY_SOUL } from '../config/tuning-more/soul-quirks-gait';
import { soulLive } from './antics';
import { isFree } from './nubbin';
import { roll } from './traits';
import type { Nubbin, SimEvent, Vec2, World } from './types';

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

export type CryId = 'cry' | 'sniffle' | 'cryStomp' | 'cryToKeeper';

/** How this Nubbin cries: the act's name, its time scale and where it walks to (if anywhere). */
export function cryFlavour(
  n: Nubbin,
  world: World,
): { itemId: CryId; scale: number; target?: Vec2 } {
  if (!soulLive()) return { itemId: 'cry', scale: 1 };
  switch (n.personality) {
    case 'shy':
      return { itemId: 'sniffle', scale: 1 };
    case 'bold':
      return { itemId: 'cryStomp', scale: CRY_SOUL.boldScale };
    case 'gentle': {
      const k = world.keeper.pos;
      const d = dist(k, n.pos);
      if (world.location !== 'grove' || d <= CRY_SOUL.keeperGap)
        return { itemId: 'cryToKeeper', scale: CRY_SOUL.gentleScale };
      return {
        itemId: 'cryToKeeper',
        scale: CRY_SOUL.gentleScale,
        target: {
          x: k.x + ((n.pos.x - k.x) / d) * CRY_SOUL.keeperGap,
          z: k.z + ((n.pos.z - k.z) / d) * CRY_SOUL.keeperGap,
        },
      };
    }
    default:
      return { itemId: 'cry', scale: 1 };
  }
}

/** Starts a cry now, in this Nubbin's way; `ms` is the plain cry's length. */
export function startCry(n: Nubbin, world: World, now: number, ms: number): void {
  const f = cryFlavour(n, world);
  const b = n.behavior;
  b.state = 'cry';
  b.sinceMs = now;
  b.untilMs = now + ms * f.scale;
  b.itemId = f.itemId;
  b.target = f.target ?? null;
  b.reaction = null;
  delete b.progress;
}

/** Whether a free, calm Nubbin may break into a brief cry. */
function canCry(n: Nubbin): boolean {
  const s = n.behavior.state;
  return isFree(n) && (s === 'wander' || s === 'sit' || s === 'react' || s === 'perform');
}

/** The others that are fond of `n` and near enough to come over. */
function friendsNear(n: Nubbin, world: World): Nubbin[] {
  return world.nubbins.filter(
    (o) =>
      o !== n &&
      isFree(o) &&
      o.stage !== 'egg' &&
      (o.behavior.state === 'wander' || o.behavior.state === 'sit') &&
      Math.max(o.friends[n.id] ?? 0, n.friends[o.id] ?? 0) >= CRY_SOUL.friendAt &&
      dist(o.pos, n.pos) < CRY_SOUL.comfortRadius,
  );
}

/** Whether `o` is already on its way to comfort `n`. */
const comforting = (world: World, n: Nubbin): boolean =>
  world.nubbins.some((o) => o.behavior.itemId === `comfort:${n.id}`);

/**
 * Once per step after the behaviours: the brief cries this step's events call for, and a
 * friend sent over to each crier (a roll per second). Live play only.
 */
export function stepCrying(world: World, events: SimEvent[], offline: boolean): void {
  if (offline || !soulLive() || world.location !== 'grove') return;
  const now = world.timeMs;
  const byId = (id: string): Nubbin | undefined => world.nubbins.find((x) => x.id === id);
  for (const e of events) {
    let who: Nubbin | undefined;
    if (e.kind === 'snatched') who = byId(e.victimId);
    else if (e.kind === 'rivalPuff') {
      // The softer of the two (if either is soft-hearted) has a little cry.
      for (const id of [e.a, e.b]) {
        const c = byId(id);
        const p = c?.personality;
        if (c && (p === 'shy' || p === 'gentle' || p === 'dreamy')) {
          if (roll(c, 'taunt-cry', now) < CRY_SOUL.tauntChance) who = c;
          break;
        }
      }
    } else if (e.kind === 'landed') {
      const c = byId(e.nubbinId);
      const throws = (c?.recentCare ?? []).filter(
        (r) => r.kind === 'throw' && now - r.atMs < CRY_SOUL.throwWindowMs,
      ).length;
      if (c && throws >= CRY_SOUL.throwStreak) who = c;
    }
    if (who && who.behavior.state !== 'cry' && canCry(who))
      startCry(who, world, now, CRY_SOUL.briefMs);
  }
  // Friends come over, once a second each.
  if (Math.floor(now / 1000) === Math.floor((now - SIM.stepMs) / 1000)) return;
  for (const n of world.nubbins) {
    if (n.behavior.state !== 'cry' || comforting(world, n)) continue;
    for (const o of friendsNear(n, world)) {
      const boost =
        (o.personality === 'gentle' ? CRY_SOUL.gentleBoost : 1) *
        (o.alignment > ALIGNMENT.sunThreshold ? CRY_SOUL.sunBoost : 1);
      if (roll(o, `comfort:${n.id}`, now) >= Math.min(1, CRY_SOUL.comfortPerSecond * boost))
        continue;
      const b = o.behavior;
      b.state = 'perform';
      b.sinceMs = now;
      b.untilMs = now + CRY_SOUL.comfortMs;
      b.itemId = `comfort:${n.id}`;
      b.target = { x: n.pos.x + 0.7, z: n.pos.z };
      b.reaction = null;
      delete b.progress;
      break;
    }
  }
}

/** A walking cry's pace (a gentle one on its way to the Keeper). */
export const cryWalkSpeed = (): number => BEHAVIOR.walkSpeed * CRY_SOUL.gentleSpeed;
