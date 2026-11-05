/**
 * R0561 (SOUL-44) and R0587 (SOUL-70), lane A round 11: games for several Nubbins and one
 * for the Keeper.
 * - A bold or cheerful Nubbin with two or more friends near may start a game: tag (the chaser
 *   runs at x1.4 and on contact the roles swap with a squeal; 30 s), follow-the-leader (a
 *   conga line through three points, a hop gait) or hide and seek (the others use the
 *   `peekTree` pose behind trees while the seeker counts with its hands over its eyes).
 * - A mischievous or bold Nubbin that is fond of the Keeper taps it ("tag!") and runs off;
 *   catch it within 15 s and both laugh (affection +2), else it gloats and comes back. Once
 *   per 10 minutes at most, and it can be ignored.
 * The games live in a transient store (`gamesOf`); members are plain `perform` acts, moved by
 * hand for the quick ones, so a pickup ends a Nubbin's part cleanly. Hashed chances only,
 * live play only, behaviour and looks only.
 */
import { BEHAVIOR } from '../config/tuning';
import { GAMES, KEEPER_TAG } from '../config/tuning-soul-r11g';
import { liveliness, soulLive } from './antics';
import { react } from './behavior';
import { friendship } from './friendships';
import { addAffection } from './needs';
import { act, awake, awayFrom, dist, h01, idle, moveToward, stillIn } from './soul-kit';
import type { Nubbin, SimEvent, Vec2, World } from './types';

export type GameKind = 'tag' | 'follow' | 'hide';
const KINDS: readonly GameKind[] = ['tag', 'follow', 'hide'];

export interface Game {
  id: string;
  kind: GameKind;
  /** The starter first; in follow-the-leader, the line's order. */
  members: string[];
  startMs: number;
  endMs: number;
  /** Tag: who is it. Hide and seek: the seeker. */
  it: string;
  immuneId: string;
  immuneUntil: number;
  squealUntil: number;
  /** Follow-the-leader: the three points and the one being walked to. */
  legs: Vec2[];
  leg: number;
  /** Hide and seek: where each hider goes, and who has been found. */
  spots: Record<string, Vec2>;
  found: string[];
}

interface KeeperTag {
  id: string;
  phase: 'approach' | 'run' | 'gloat';
  startMs: number;
  endMs: number;
}

interface Store {
  games: Game[];
  seq: number;
  cooldownUntil: number;
  tag: KeeperTag | null;
  tagCooldownUntil: number;
  /** Counters for tests and the debug panel. */
  started: Record<GameKind, number>;
  swaps: number;
  found: number;
  tagCaught: number;
  tagGloated: number;
}

const stores = new WeakMap<World, Store>();

export function gameStore(world: World): Store {
  let s = stores.get(world);
  if (!s) {
    s = {
      games: [],
      seq: 0,
      cooldownUntil: 0,
      tag: null,
      tagCooldownUntil: 0,
      started: { tag: 0, follow: 0, hide: 0 },
      swaps: 0,
      found: 0,
      tagCaught: 0,
      tagGloated: 0,
    };
    stores.set(world, s);
  }
  return s;
}

export const gamesOf = (world: World): readonly Game[] => stores.get(world)?.games ?? [];

const ITEMS = [
  'tagIt',
  'tagRun',
  'followLine',
  'seekCount',
  'seekFind',
  'hideRun',
  'peekTree',
  'tagKeeper',
  'tagKeeperRun',
  'tagGloat',
];

const find = (world: World, id: string): Nubbin | undefined =>
  world.nubbins.find((n) => n.id === id);

function friendsNear(world: World, n: Nubbin): Nubbin[] {
  return world.nubbins.filter(
    (o) =>
      o !== n &&
      idle(o) &&
      dist(o.pos, n.pos) < GAMES.radius &&
      friendship(n, o) >= GAMES.friendAt &&
      friendship(o, n) >= GAMES.friendAt,
  );
}

function start(world: World, store: Store, starter: Nubbin, friends: Nubbin[], now: number): void {
  // Taking turns through the three kinds, from a hashed first pick.
  const kind = KINDS[(store.seq + Math.floor(h01(`gk:${world.seed}`) * 3)) % 3]!;
  const members = [starter, ...friends.slice(0, GAMES.maxMembers - 1)];
  const game: Game = {
    id: `game${store.seq++}`,
    kind,
    members: members.map((m) => m.id),
    startMs: now,
    endMs: now + (kind === 'hide' ? GAMES.hideMs : GAMES.ms),
    it: starter.id,
    immuneId: '',
    immuneUntil: 0,
    squealUntil: 0,
    legs: [],
    leg: 0,
    spots: {},
    found: [],
  };
  if (kind === 'follow') {
    let p = { x: starter.pos.x, z: starter.pos.z };
    for (let i = 0; i < 3; i++) {
      const a = h01(`${game.id}:leg:${i}`) * Math.PI * 2;
      const r =
        GAMES.legRange[0] + (GAMES.legRange[1] - GAMES.legRange[0]) * h01(`${game.id}:r:${i}`);
      p = { x: p.x + Math.cos(a) * r, z: p.z + Math.sin(a) * r };
      game.legs.push(p);
    }
  }
  if (kind === 'hide') {
    // Each hider takes the nearest tree not yet taken, and goes round to its far side.
    const used = new Set<number>();
    for (const h of members.slice(1)) {
      let best = -1;
      world.trees.forEach((t, i) => {
        if (used.has(i)) return;
        if (best < 0 || dist(t.pos, h.pos) < dist(world.trees[best]!.pos, h.pos)) best = i;
      });
      if (best >= 0) {
        used.add(best);
        const t = world.trees[best]!.pos;
        game.spots[h.id] = awayFrom(t, starter.pos, GAMES.hideBehind);
        // awayFrom is from the tree outward, so the spot is behind it from the seeker.
      } else game.spots[h.id] = awayFrom(h.pos, starter.pos, 5);
    }
  }
  for (const m of members) {
    const item =
      kind === 'tag'
        ? m === starter
          ? 'tagIt'
          : 'tagRun'
        : kind === 'follow'
          ? 'followLine'
          : m === starter
            ? 'seekCount'
            : 'hideRun';
    act(m, now, item, game.endMs - now);
  }
  store.games.push(game);
  store.started[kind]++;
}

/** One tick of one game. Returns false when it is over. */
function play(
  world: World,
  store: Store,
  g: Game,
  now: number,
  dtMs: number,
  events: SimEvent[],
): boolean {
  g.members = g.members.filter((id) => stillIn(find(world, id), ITEMS));
  if (g.members.length < 2 || now >= g.endMs) return false;
  const ms = g.members.map((id) => find(world, id)!);
  for (const m of ms) if (m.behavior.untilMs < g.endMs) m.behavior.untilMs = g.endMs;
  const speed = BEHAVIOR.walkSpeed;
  if (g.kind === 'tag') {
    const it = find(world, g.it);
    if (!it || !g.members.includes(g.it)) return false;
    let prey: Nubbin | null = null;
    for (const m of ms)
      if (m !== it && !(m.id === g.immuneId && now < g.immuneUntil))
        if (!prey || dist(m.pos, it.pos) < dist(prey.pos, it.pos)) prey = m;
    if (prey) {
      moveToward(it, prey.pos, speed * GAMES.chaserBoost, dtMs, GAMES.swapReach * 0.5);
      if (dist(it.pos, prey.pos) <= GAMES.swapReach) {
        // Contact: the roles swap, with a squeal.
        it.behavior.itemId = 'tagRun';
        prey.behavior.itemId = 'tagIt';
        g.it = prey.id;
        g.immuneId = it.id;
        g.immuneUntil = now + GAMES.immuneMs;
        g.squealUntil = now + GAMES.squealMs;
        store.swaps++;
        events.push({ kind: 'reaction', nubbinId: prey.id, reaction: 'surprised' });
      }
    }
    for (const m of ms) if (m !== it) moveToward(m, awayFrom(m.pos, it.pos, 4), speed, dtMs, 0.05);
    return true;
  }
  if (g.kind === 'follow') {
    const lead = ms[0]!;
    const to = g.legs[g.leg];
    if (!to) return false;
    if (moveToward(lead, to, speed * 0.85, dtMs, 0.4)) g.leg++;
    for (let i = 1; i < ms.length; i++) {
      const prev = ms[i - 1]!;
      if (dist(ms[i]!.pos, prev.pos) > GAMES.followGap)
        moveToward(ms[i]!, prev.pos, speed * 1.1, dtMs, GAMES.followGap);
      else ms[i]!.facing = prev.facing;
    }
    return g.leg < g.legs.length;
  }
  // Hide and seek.
  const seeker = find(world, g.it);
  if (!seeker || !g.members.includes(g.it)) return false;
  const counting = now < g.startMs + GAMES.countMs;
  if (counting) {
    seeker.behavior.itemId = 'seekCount';
    seeker.facing = Math.PI; // faces a tree-trunk's worth of nothing, hands over its eyes
    for (const m of ms) {
      if (m === seeker) continue;
      const spot = g.spots[m.id];
      if (spot && dist(m.pos, spot) > 0.3) moveToward(m, spot, speed * 1.5, dtMs, 0.3);
      else m.behavior.itemId = 'peekTree';
    }
    return true;
  }
  seeker.behavior.itemId = 'seekFind';
  let target: Nubbin | null = null;
  for (const m of ms)
    if (m !== seeker && !g.found.includes(m.id))
      if (!target || dist(m.pos, seeker.pos) < dist(target.pos, seeker.pos)) target = m;
  if (!target) return false;
  moveToward(seeker, target.pos, speed, dtMs, GAMES.foundReach * 0.5);
  if (dist(seeker.pos, target.pos) <= GAMES.foundReach) {
    g.found.push(target.id);
    store.found++;
    target.behavior.itemId = 'tagRun';
    react(target, 'happy', now, events);
    // react() takes the Nubbin out of the act; it drops out of the game by itself.
  }
  return true;
}

function finish(world: World, g: Game, now: number, events: SimEvent[]): void {
  for (const id of g.members) {
    const n = find(world, id);
    if (stillIn(n, ITEMS)) react(n, 'happy', now, events);
  }
}

// ---------------------------------------------------------------- R0587: tag with the Keeper

function stepKeeperTag(
  world: World,
  store: Store,
  now: number,
  dtMs: number,
  second: boolean,
  events: SimEvent[],
): void {
  const t = store.tag;
  const k = world.keeper;
  if (t) {
    const n = find(world, t.id);
    if (!stillIn(n, ITEMS) || (t.phase !== 'gloat' && k.carrying)) {
      store.tag = null;
      return;
    }
    if (t.phase === 'approach') {
      if (moveToward(n, k.pos, KEEPER_TAG.speed, dtMs, 0.9)) {
        // "tag!" and off it runs.
        t.phase = 'run';
        t.startMs = now;
        t.endMs = now + KEEPER_TAG.runMs;
        n.behavior.itemId = 'tagKeeperRun';
        n.behavior.untilMs = t.endMs + 1000;
        events.push({ kind: 'reaction', nubbinId: n.id, reaction: 'surprised' });
      }
      return;
    }
    if (t.phase === 'run') {
      if (now - t.startMs > 1200 && dist(k.pos, n.pos) <= KEEPER_TAG.catchReach) {
        // Caught: both laugh.
        addAffection(n, KEEPER_TAG.affection);
        store.tagCaught++;
        store.tag = null;
        n.behavior.itemId = null;
        react(n, 'happy', now, events);
        return;
      }
      moveToward(n, awayFrom(n.pos, k.pos, 6), KEEPER_TAG.speed, dtMs, 0.05);
      if (now >= t.endMs) {
        // Not caught: it gloats, then comes back.
        t.phase = 'gloat';
        t.endMs = now + KEEPER_TAG.gloatMs;
        store.tagGloated++;
        act(n, now, 'tagGloat', KEEPER_TAG.gloatMs);
        n.facing = Math.atan2(k.pos.x - n.pos.x, k.pos.z - n.pos.z);
      }
      return;
    }
    if (now >= t.endMs) {
      store.tag = null;
      n.behavior.state = 'wander';
      n.behavior.sinceMs = now;
      n.behavior.untilMs = now + 4000;
      n.behavior.itemId = null;
      n.behavior.target = { x: k.pos.x + 1, z: k.pos.z };
    }
    return;
  }
  if (!second || now < store.tagCooldownUntil || k.carrying || store.games.length > 0) return;
  const lively = liveliness(world);
  for (const n of world.nubbins) {
    if (!idle(n) || n.needs.affection < KEEPER_TAG.affectionAt) continue;
    if (n.personality !== 'mischievous' && n.personality !== 'bold') continue;
    if (dist(n.pos, k.pos) > KEEPER_TAG.radius || dist(n.pos, k.pos) < 1.2) continue;
    if (h01(`ktag:${n.id}:${now}`) >= KEEPER_TAG.perSecond * lively) continue;
    store.tag = { id: n.id, phase: 'approach', startMs: now, endMs: now + 15_000 };
    store.tagCooldownUntil = now + KEEPER_TAG.cooldownMs;
    act(n, now, 'tagKeeper', 30_000);
    return;
  }
}

/** Once a step. */
export function stepGames(world: World, dtMs: number, events: SimEvent[], offline: boolean): void {
  const store = gameStore(world);
  if (offline || !soulLive() || world.location !== 'grove') {
    if (store.games.length) store.games = [];
    store.tag = null;
    return;
  }
  const now = world.timeMs;
  const second = Math.floor(now / 1000) !== Math.floor((now - dtMs) / 1000);
  store.games = store.games.filter((g) => {
    if (play(world, store, g, now, dtMs, events)) return true;
    finish(world, g, now, events);
    store.cooldownUntil = now + GAMES.cooldownMs;
    return false;
  });
  stepKeeperTag(world, store, now, dtMs, second, events);
  if (!second || store.games.length > 0 || now < store.cooldownUntil || store.tag) return;
  const lively = liveliness(world);
  for (const n of world.nubbins) {
    if (!idle(n) || !awake(n)) continue;
    if (n.personality !== 'bold' && n.personality !== 'cheerful') continue;
    if (h01(`game:${n.id}:${now}`) >= GAMES.startPerSecond * lively) continue;
    const friends = friendsNear(world, n);
    if (friends.length < 2) continue;
    start(world, store, n, friends, now);
    return;
  }
}
