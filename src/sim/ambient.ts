/**
 * R0547 (SOUL-29), lane A round 11: little animals a Nubbin can chase. The sim keeps 0-3
 * butterflies by day (none in winter or rain), fireflies at dusk, a frog at the pond and
 * now and then a dragonfly over the water; the renderers draw them from `ambientOf(world)`.
 * A free Nubbin that notices one (curious, dreamy and cheerful ones three times as readily)
 * runs after it for four to eight seconds (`chaseFlutter`). It may catch it, and then the
 * butterfly sits on its head for three seconds and it glows (a heart); a clumsy one trips
 * instead. A miss is a shrug.
 *
 * The list is transient (a WeakMap keyed by the world, like the other soul acts' looks), so
 * no save field is needed; it fills again on load. Everything is hashed from the world seed,
 * the second and the critter, never from the world's rng, so seeded days stay as they were.
 * Live play only: nothing spawns or chases while catching up on time away.
 */
import { GROVE } from '../config/tuning';
import { AMBIENT } from '../config/tuning-more/soul-ambient-games';
import { liveliness, soulLive } from './antics';
import { react } from './behavior';
import { isFree } from './nubbin';
import { hashSeed } from './rng';
import { isNight } from './side-rule-kit';
import { hasTrait } from './traits';
import type { Nubbin, SimEvent, Vec2, World } from './types';

export type CritterKind = 'butterfly' | 'firefly' | 'frog' | 'dragonfly';
const KINDS: readonly CritterKind[] = ['butterfly', 'firefly', 'frog', 'dragonfly'];

export interface AmbientCritter {
  id: string;
  kind: CritterKind;
  pos: Vec2;
  /** Height above the ground. */
  y: number;
  heading: number;
  /** Sim time it drifts away. */
  until: number;
  /** A Nubbin chasing it, and until when the chase lasts. */
  chaser?: string;
  chaseEndMs?: number;
  /** A Nubbin it sits on, and until when. */
  landedOn?: string;
  landedUntil?: number;
  /** A frog's hop: where it started, when, and when the next one is. */
  hopFrom?: Vec2;
  hopAt?: number;
  nextHopMs?: number;
}

interface Store {
  list: AmbientCritter[];
  seq: number;
  /** Chases, catches and trips so far, for the debug panel and tests. */
  chases: number;
  catches: number;
  trips: number;
}

const stores = new WeakMap<World, Store>();

export function ambientStore(world: World): Store {
  let s = stores.get(world);
  if (!s) {
    s = { list: [], seq: 0, chases: 0, catches: 0, trips: 0 };
    stores.set(world, s);
  }
  return s;
}

/** The live ambient critters (what the renderers draw). */
export function ambientOf(world: World): readonly AmbientCritter[] {
  return stores.get(world)?.list ?? [];
}

const h01 = (key: string): number => hashSeed(key) / 4294967296;
const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);
const between = (r: readonly [number, number], t: number): number => r[0] + (r[1] - r[0]) * t;

/** The target butterfly count for the window `now` is in. */
function butterflyTarget(world: World, now: number): number {
  if (world.season === 'winter' || world.weather.kind !== 'clear' || isNight(now)) return 0;
  const r = h01(`bf:${world.seed}:${Math.floor(now / AMBIENT.windowMs)}`);
  const [a, b, c] = AMBIENT.butterflyOdds;
  return r < a ? 0 : r < b ? 1 : r < c ? 2 : 3;
}

function wanted(world: World, now: number): Record<CritterKind, number> {
  const night = isNight(now);
  const clear = world.weather.kind === 'clear';
  const warm = world.season !== 'winter';
  const dragon = h01(`df:${world.seed}:${Math.floor(now / 90_000)}`) < 0.5;
  return {
    butterfly: butterflyTarget(world, now),
    firefly: night && clear && warm ? AMBIENT.fireflyMax : 0,
    frog: !night && warm && world.weather.kind !== 'snow' ? 1 : 0,
    dragonfly: !night && clear && world.season === 'summer' && dragon ? 1 : 0,
  };
}

const awake = (n: Nubbin): boolean => n.stage !== 'egg' && n.stage !== 'cocoon';

function clampPos(p: Vec2): void {
  const lim = GROVE.size / 2 - AMBIENT.edge;
  p.x = Math.max(-lim, Math.min(lim, p.x));
  p.z = Math.max(-lim, Math.min(lim, p.z));
}

/** Where a new critter appears: near a Nubbin (or the Keeper); the pond's edge for water ones. */
function spawnPos(world: World, kind: CritterKind, key: string): Vec2 {
  const a = h01(`${key}:a`) * Math.PI * 2;
  if (kind === 'frog' || kind === 'dragonfly') {
    const p = GROVE.pond;
    const r = p.r + (kind === 'frog' ? 0.6 : 0.5 + h01(`${key}:r`) * 2);
    return { x: p.x + Math.cos(a) * r, z: p.z + Math.sin(a) * r };
  }
  const near = world.nubbins.filter(awake);
  const base =
    near.length > 0
      ? near[Math.floor(h01(`${key}:n`) * near.length) % near.length]!.pos
      : world.keeper.pos;
  const r = between(AMBIENT.spawnNear, h01(`${key}:r`));
  const p = { x: base.x + Math.cos(a) * r, z: base.z + Math.sin(a) * r };
  clampPos(p);
  return p;
}

function spawn(world: World, store: Store, kind: CritterKind, now: number): void {
  const key = `amb:${world.seed}:${now}:${store.seq}`;
  store.list.push({
    id: `amb${store.seq++}`,
    kind,
    pos: spawnPos(world, kind, key),
    y: kind === 'frog' ? 0 : 1,
    heading: h01(`${key}:h`) * Math.PI * 2,
    until: now + between(AMBIENT.lifeMs, h01(`${key}:life`)),
  });
}

/** A frog sits, then hops (away from a chaser, else along the shore). */
function driftFrog(world: World, c: AmbientCritter, now: number): void {
  if (c.hopFrom && c.hopAt !== undefined) {
    const t = Math.min(1, (now - c.hopAt) / 400);
    c.pos.x = c.hopFrom.x + Math.sin(c.heading) * AMBIENT.frogHop * t;
    c.pos.z = c.hopFrom.z + Math.cos(c.heading) * AMBIENT.frogHop * t;
    c.y = Math.sin(t * Math.PI) * 0.45;
    if (t >= 1) delete c.hopFrom;
    return;
  }
  const chased = c.chaser !== undefined;
  if (c.nextHopMs === undefined) c.nextHopMs = now + between(AMBIENT.frogHopMs, h01(`${c.id}:nh0`));
  if (now < c.nextHopMs && !chased) return;
  if (chased && now < c.nextHopMs) return;
  const chaser = c.chaser ? world.nubbins.find((x) => x.id === c.chaser) : undefined;
  const p = GROVE.pond;
  let hd = h01(`${c.id}:hop:${now}`) * Math.PI * 2;
  if (chaser && dist(chaser.pos, c.pos) < 2.5)
    hd = Math.atan2(c.pos.x - chaser.pos.x, c.pos.z - chaser.pos.z);
  if (dist(c.pos, p) > p.r + 3.5) hd = Math.atan2(p.x - c.pos.x, p.z - c.pos.z);
  c.heading = hd;
  c.hopFrom = { x: c.pos.x, z: c.pos.z };
  c.hopAt = now;
  const gap = between(AMBIENT.frogHopMs, h01(`${c.id}:nh:${now}`));
  c.nextHopMs = now + gap * (chased ? 0.3 : 1);
}

/** Drift one critter for `dt` seconds. */
function drift(world: World, c: AmbientCritter, now: number, dt: number): void {
  if (c.landedOn) {
    const host = world.nubbins.find((x) => x.id === c.landedOn);
    if (host) {
      c.pos.x = host.pos.x;
      c.pos.z = host.pos.z;
      c.y = 1.45 + Math.sin(now / 160) * 0.03;
    }
    return;
  }
  if (c.kind === 'frog') {
    driftFrog(world, c, now);
    return;
  }
  const speed = AMBIENT.speed[c.kind] * (c.chaser !== undefined ? AMBIENT.fleeBoost : 1);
  const wobble = c.kind === 'dragonfly' ? 3.4 : 2.2;
  c.heading += (h01(`${c.id}:w:${Math.floor(now / 300)}`) - 0.5) * wobble * dt;
  if (c.kind === 'dragonfly') {
    const p = GROVE.pond;
    if (dist(c.pos, p) > p.r + 2.5) c.heading = Math.atan2(p.x - c.pos.x, p.z - c.pos.z);
  }
  c.pos.x += Math.sin(c.heading) * speed * dt;
  c.pos.z += Math.cos(c.heading) * speed * dt;
  clampPos(c.pos);
  const base = c.kind === 'firefly' ? 1.1 : c.kind === 'dragonfly' ? 1.3 : 0.9;
  c.y = base + Math.sin(now / (c.kind === 'butterfly' ? 140 : 420) + c.heading) * 0.2;
}

/** Whether this Nubbin could set off after something now. */
function canChase(world: World, n: Nubbin): boolean {
  if (!awake(n) || !isFree(n)) return false;
  // Rule three: whoever sits beside the idle Keeper stays put.
  if (world.keeper.sitWith === n.id) return false;
  const s = n.behavior.state;
  return s === 'wander' || s === 'sit';
}

const eager = (n: Nubbin): boolean =>
  n.personality === 'curious' || n.personality === 'dreamy' || n.personality === 'cheerful';

function endChase(c: AmbientCritter, n: Nubbin | undefined, now: number, events: SimEvent[]): void {
  delete c.chaser;
  delete c.chaseEndMs;
  if (!n || n.behavior.itemId !== 'chaseFlutter') return;
  n.behavior.target = null;
  n.behavior.untilMs = now + 400;
  react(n, 'confused', now, events);
}

/** The chase reaches the critter: a catch (it lands on the head) or a trip (clumsy). */
function reach(
  world: World,
  store: Store,
  c: AmbientCritter,
  n: Nubbin,
  now: number,
  events: SimEvent[],
): void {
  const b = n.behavior;
  b.target = null;
  if (h01(`catch:${n.id}:${now}`) >= AMBIENT.catchPerSecond) return;
  delete c.chaser;
  delete c.chaseEndMs;
  b.state = 'perform';
  b.sinceMs = now;
  if (hasTrait(n, 'clumsy') && h01(`trip:${n.id}:${now}`) < 0.6) {
    store.trips++;
    b.itemId = 'chaseTrip';
    b.untilMs = now + AMBIENT.tripMs;
    b.reaction = 'dizzy';
    events.push({ kind: 'reaction', nubbinId: n.id, reaction: 'dizzy' });
    c.until = Math.min(c.until, now + 2500);
    return;
  }
  store.catches++;
  c.landedOn = n.id;
  c.landedUntil = now + AMBIENT.landedMs;
  c.until = Math.max(c.until, now + AMBIENT.landedMs + 2000);
  b.itemId = 'catchFlutter';
  b.untilMs = now + AMBIENT.landedMs;
  n.needs.happiness = Math.min(100, n.needs.happiness + 2);
  b.reaction = 'love';
  events.push({ kind: 'reaction', nubbinId: n.id, reaction: 'love' });
  void world;
}

/** Once a step: spawn, drift, start chases, and play them out. */
export function stepAmbient(
  world: World,
  dtMs: number,
  events: SimEvent[],
  offline: boolean,
): void {
  const store = ambientStore(world);
  if (offline || !soulLive() || world.location !== 'grove') {
    if (store.list.length) store.list = [];
    return;
  }
  const now = world.timeMs;
  const second = Math.floor(now / 1000) !== Math.floor((now - dtMs) / 1000);

  if (second) {
    const want = wanted(world, now);
    const have: Record<CritterKind, number> = { butterfly: 0, firefly: 0, frog: 0, dragonfly: 0 };
    for (const c of store.list) {
      have[c.kind]++;
      // Too many for this window: the surplus drifts off soon (never mid-chase).
      if (have[c.kind] > want[c.kind] && !c.chaser && !c.landedOn && c.until > now + 3000)
        c.until = now + 3000;
    }
    for (const kind of KINDS)
      if (
        have[kind] < want[kind] &&
        h01(`sp:${world.seed}:${now}:${kind}`) < AMBIENT.spawnPerSecond
      )
        spawn(world, store, kind, now);
  }

  for (const c of store.list) drift(world, c, now, dtMs / 1000);

  for (const c of store.list) {
    if (c.landedOn) {
      if (now < (c.landedUntil ?? 0)) continue;
      delete c.landedOn;
      delete c.landedUntil;
      c.until = Math.min(c.until, now + 2000);
      c.heading = h01(`${c.id}:off:${now}`) * Math.PI * 2;
      continue;
    }
    if (!c.chaser) continue;
    const n = world.nubbins.find((x) => x.id === c.chaser);
    const b = n?.behavior;
    if (!n || !b || b.state !== 'perform' || b.itemId !== 'chaseFlutter') {
      delete c.chaser;
      delete c.chaseEndMs;
    } else if (now >= (c.chaseEndMs ?? 0)) {
      endChase(c, n, now, events);
    } else if (dist(n.pos, c.pos) > AMBIENT.catchRadius) {
      b.target = { x: c.pos.x, z: c.pos.z };
    } else if (second) {
      reach(world, store, c, n, now, events);
    }
  }

  if (second && store.list.length) {
    const lively = liveliness(world);
    for (const n of world.nubbins) {
      if (!canChase(world, n)) continue;
      let best: AmbientCritter | null = null;
      for (const c of store.list) {
        if (c.chaser || c.landedOn) continue;
        const d = dist(n.pos, c.pos);
        if (d < AMBIENT.noticeRadius && (!best || d < dist(n.pos, best.pos))) best = c;
      }
      if (!best) continue;
      const chance = AMBIENT.chasePerSecond * (eager(n) ? AMBIENT.eagerBoost : 1) * lively;
      if (h01(`chase:${n.id}:${now}`) >= Math.min(1, chance)) continue;
      const ms = between(AMBIENT.chaseMs, h01(`chaseMs:${n.id}:${now}`));
      const b = n.behavior;
      b.state = 'perform';
      b.sinceMs = now;
      b.untilMs = now + ms + 1500;
      b.itemId = 'chaseFlutter';
      b.target = { x: best.pos.x, z: best.pos.z };
      best.chaser = n.id;
      best.chaseEndMs = now + ms;
      store.chases++;
    }
  }

  store.list = store.list.filter((c) => c.until > now || c.landedOn !== undefined);
}
