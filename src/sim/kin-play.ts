/**
 * R0572 (SOUL-55), R0565 (SOUL-48) and R0571 (SOUL-54), lane A round 11: Nubbins notice the
 * people and things around them.
 * - Family: a bred child and its parents start as friends (50); a parent follows the child at
 *   two units for the child's first ten minutes and comforts it when it cries; the child copies
 *   its parent's lesson performance. Siblings are more compatible (see `rivals.compat`).
 * - Visitors: while a visiting speaker or trainer is in the Grove (and no story beat is
 *   running) a shy one hides behind a tree, a curious one walks up and sniffs, a bold one
 *   stands in front of the Keeper, a mischievous one tugs the coat, the rest wave hello.
 * - The Keeper's own doings: a jump is copied with a hop (cheerful and bold, a copycat
 *   always); a shaken tree makes the nearby look up and a glutton runs over; coming home from
 *   an expedition draws up to three fond Nubbins to the Keeper; a run past makes a shy one
 *   flinch and sends a mischievous one after the Keeper for three seconds.
 * Hashed chances, live play only, behaviour and looks only.
 */
import { KEEPER_ACTS, KIN, VISITOR } from '../config/tuning-more/soul-ambient-games';
import { liveliness, soulLive } from './antics';
import { LESSON_IDS, lessonLevel } from './kindergarten';
import { hasTrait } from './traits';
import {
  act,
  awake,
  awayFrom,
  dist,
  h01,
  idle,
  moveToward,
  noticing,
  storyBusy,
} from './soul-kit';
import type { Nubbin, SimEvent, Vec2, World } from './types';

interface Store {
  /** Keeper tracking between steps. */
  last: { x: number; z: number; expeditions: number } | null;
  /** Reactions by name, for tests and the debug panel. */
  seen: Record<string, number>;
  /** The mischievous chases of the Keeper, and until when. */
  chasing: Map<string, number>;
}

const stores = new WeakMap<World, Store>();

/** Expeditions finished this session (campaign or not): what the gate greeting watches. */
const homeCount = new WeakMap<World, number>();

export function noteExpeditionHome(world: World): void {
  homeCount.set(world, (homeCount.get(world) ?? 0) + 1);
}

function store(world: World): Store {
  let s = stores.get(world);
  if (!s) {
    s = { last: null, seen: {}, chasing: new Map() };
    stores.set(world, s);
  }
  return s;
}

export const kinSeen = (world: World): Readonly<Record<string, number>> => store(world).seen;

const mark = (s: Store, what: string): void => {
  s.seen[what] = (s.seen[what] ?? 0) + 1;
};

// ---------------------------------------------------------------- R0572: family

function stepFamily(world: World, s: Store, now: number, second: boolean): void {
  for (const child of world.nubbins) {
    if (!child.parents || !awake(child)) continue;
    const parents = child.parents
      .map((id) => world.nubbins.find((p) => p.id === id))
      .filter((p): p is Nubbin => !!p && awake(p));
    // At hatch: the bond (friend 50), once and both ways.
    for (const p of parents) {
      if (child.friends[p.id] === undefined) {
        child.friends[p.id] = KIN.bond;
        mark(s, 'bond');
      }
      if (p.friends[child.id] === undefined) p.friends[child.id] = KIN.bond;
    }
    if (!second) continue;
    const young = child.stage === 'child' && child.stageMs < KIN.followMs;
    for (const p of parents) {
      if (child.behavior.state === 'cry') {
        // Comfort: the nearest parent goes over and pats (soul-idle's `comfort:` act).
        if (idle(p) && dist(p.pos, child.pos) < KIN.comfortRadius) {
          act(p, now, `comfort:${child.id}`, 2500, { x: child.pos.x + 0.7, z: child.pos.z });
          mark(s, 'comfort');
        }
        continue;
      }
      if (young && idle(p) && dist(p.pos, child.pos) > KIN.followGap * 1.5) {
        // Falls in at two units, for as long as the child is small.
        const b = p.behavior;
        b.state = 'wander';
        b.sinceMs = now;
        b.untilMs = now + 3000;
        b.itemId = 'followChild';
        b.target = { x: child.pos.x + KIN.followGap, z: child.pos.z };
        mark(s, 'follow');
      }
      // The copycat moment: a parent's lesson performance is copied.
      const pb = p.behavior;
      if (
        idle(child) &&
        pb.state === 'perform' &&
        (LESSON_IDS as readonly string[]).includes(pb.itemId ?? '') &&
        lessonLevel(p, pb.itemId as (typeof LESSON_IDS)[number]) > 0 &&
        dist(p.pos, child.pos) < KIN.copyRadius
      ) {
        act(child, now, pb.itemId!, KIN.copyMs);
        child.facing = Math.atan2(p.pos.x - child.pos.x, p.pos.z - child.pos.z);
        mark(s, 'copy');
      }
    }
  }
}

// ---------------------------------------------------------------- R0565: visitors

function stepVisitors(world: World, s: Store, now: number, second: boolean): void {
  if (!second || world.npcs.length === 0 || storyBusy(world)) return;
  const lively = liveliness(world);
  for (const n of world.nubbins) {
    if (!idle(n)) continue;
    let npc = null as (typeof world.npcs)[number] | null;
    for (const v of world.npcs)
      if (
        dist(v.pos, n.pos) < VISITOR.radius &&
        (!npc || dist(v.pos, n.pos) < dist(npc.pos, n.pos))
      )
        npc = v;
    if (!npc) continue;
    if (h01(`visit:${n.id}:${now}`) >= VISITOR.perSecond * lively) continue;
    const k = world.keeper.pos;
    const gap = 1.1;
    switch (n.personality) {
      case 'shy': {
        let tree: Vec2 | null = null;
        for (const t of world.trees)
          if (!tree || dist(t.pos, n.pos) < dist(tree, n.pos)) tree = t.pos;
        if (!tree) {
          act(n, now, 'hideFace', VISITOR.reactMs);
          break;
        }
        act(n, now, 'peekTree', VISITOR.reactMs * 2, awayFrom(tree, npc.pos, 1.1));
        break;
      }
      case 'curious':
        act(n, now, 'sniffNpc', VISITOR.reactMs, { x: npc.pos.x + 0.9, z: npc.pos.z });
        break;
      case 'bold': {
        // In front of the Keeper, facing the visitor.
        const d = dist(k, npc.pos) || 1;
        act(n, now, 'guardKeeper', VISITOR.reactMs * 2, {
          x: k.x + ((npc.pos.x - k.x) / d) * gap,
          z: k.z + ((npc.pos.z - k.z) / d) * gap,
        });
        break;
      }
      case 'mischievous':
        act(n, now, 'tugCoat', VISITOR.reactMs, { x: npc.pos.x - 0.8, z: npc.pos.z });
        break;
      default:
        act(n, now, 'waveHello', VISITOR.reactMs);
        n.facing = Math.atan2(npc.pos.x - n.pos.x, npc.pos.z - n.pos.z);
    }
    mark(s, `visitor:${n.behavior.itemId}`);
  }
}

// ---------------------------------------------------------------- R0571: the Keeper's doings

function stepKeeperDoings(
  world: World,
  s: Store,
  now: number,
  dtMs: number,
  events: SimEvent[],
): void {
  const k = world.keeper;
  const A = KEEPER_ACTS;
  const last = s.last;
  const exp = homeCount.get(world) ?? 0;
  s.last = { x: k.pos.x, z: k.pos.z, expeditions: exp };
  for (const e of events) {
    if (e.kind === 'keeperJumped') {
      for (const n of world.nubbins) {
        if (!noticing(n)) continue;
        const copycat = hasTrait(n, 'copycat');
        const eager = n.personality === 'cheerful' || n.personality === 'bold';
        const d = dist(n.pos, k.pos);
        if (!(copycat ? d < A.copycatRadius : eager && d < A.jumpRadius)) continue;
        act(n, now, 'copyHop', A.hopMs);
        n.facing = Math.atan2(k.pos.x - n.pos.x, k.pos.z - n.pos.z);
        mark(s, 'copyHop');
      }
    } else if (e.kind === 'treeShaken') {
      const tree = world.trees.find((t) => t.id === e.treeId);
      if (!tree) continue;
      for (const n of world.nubbins) {
        if (!noticing(n)) continue;
        const d = dist(n.pos, tree.pos);
        if (hasTrait(n, 'glutton') && d < A.gluttonRadius) {
          act(n, now, 'runToTree', 5000, { x: tree.pos.x + 0.8, z: tree.pos.z });
          mark(s, 'runToTree');
        } else if (d < A.lookRadius) {
          act(n, now, 'lookUp', A.lookMs);
          mark(s, 'lookUp');
        }
      }
    }
  }
  // Home from an expedition: up to three fond ones run to the Keeper.
  if (last && exp > last.expeditions) {
    const fond = world.nubbins
      .filter(
        (n) =>
          noticing(n) &&
          n.needs.affection >= A.greetAffection &&
          dist(n.pos, k.pos) < A.greetRadius,
      )
      .sort((a, b) => b.needs.affection - a.needs.affection)
      .slice(0, A.greetMax);
    for (const n of fond) {
      act(n, now, 'greetGate', 6000, { x: k.pos.x + 0.9, z: k.pos.z });
      mark(s, 'greetGate');
    }
  }
  // A run past.
  if (last && k.running) {
    const speed = Math.hypot(k.pos.x - last.x, k.pos.z - last.z) / (dtMs / 1000);
    if (speed > A.runSpeed)
      for (const n of world.nubbins) {
        if (!noticing(n) || dist(n.pos, k.pos) > A.runRadius) continue;
        if (n.personality === 'shy') {
          act(n, now, 'flinch', A.flinchMs);
          n.facing = Math.atan2(k.pos.x - n.pos.x, k.pos.z - n.pos.z);
          mark(s, 'flinch');
        } else if (n.personality === 'mischievous') {
          act(n, now, 'chaseKeeper', A.chaseMs);
          s.chasing.set(n.id, now + A.chaseMs);
          mark(s, 'chaseKeeper');
        }
      }
  }
  for (const [id, until] of s.chasing) {
    const n = world.nubbins.find((x) => x.id === id);
    if (
      !n ||
      now >= until ||
      n.behavior.itemId !== 'chaseKeeper' ||
      n.behavior.state !== 'perform'
    ) {
      s.chasing.delete(id);
      continue;
    }
    moveToward(n, k.pos, 2.2, dtMs, 0.8);
  }
}

/** Once a step. */
export function stepKin(world: World, dtMs: number, events: SimEvent[], offline: boolean): void {
  if (offline || !soulLive() || world.location !== 'grove') return;
  const s = store(world);
  const now = world.timeMs;
  const second = Math.floor(now / 1000) !== Math.floor((now - dtMs) / 1000);
  stepFamily(world, s, now, second);
  stepVisitors(world, s, now, second);
  stepKeeperDoings(world, s, now, dtMs, events);
}
