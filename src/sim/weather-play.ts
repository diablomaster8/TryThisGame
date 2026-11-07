/**
 * R0562 (SOUL-45), lane A round 11: play that belongs to the weather and the season, so each
 * kind of day has something no other has.
 * - Snow: a snowball thrown at a friend (a lob, a puff, a giggle) and two Nubbins rolling a
 *   snow figure that stays as a decal and melts once the snow stops.
 * - Rain: puddles appear on the paths and a Nubbin stomps in one.
 * - Clear summer: sunbathing (lazy three times as often), lying flat, then a sparkle.
 * - Autumn: a jump into a pile of leaves. Spring: sniffing a flower, then a sneeze if sneezy.
 * Decals live in a transient store (`snowFigures`, `puddlesOf`) that the renderers draw.
 * Hashed chances, live play only, behaviour and looks only.
 */
import { WEATHER_PLAY } from '../config/tuning-more/soul-ambient-games';
import { liveliness, soulLive } from './antics';
import { react } from './behavior';
import { hasTrait } from './traits';
import { act, awake, clampToGrove, dist, h01, idle, stillIn } from './soul-kit';
import type { Nubbin, SimEvent, Vec2, World } from './types';

export interface Decal {
  x: number;
  z: number;
  atMs: number;
}

export interface Ball {
  fromX: number;
  fromZ: number;
  toX: number;
  toZ: number;
  startMs: number;
  endMs: number;
}

interface Later {
  id: string;
  atMs: number;
  what: 'snowHit' | 'snowman' | 'sunSparkle' | 'sneeze';
  other?: string;
  at?: Vec2;
}

interface Store {
  snow: Decal[];
  /** R0562: snowballs in the air (a lob, drawn by the renderers from `snowballsOf`). */
  balls: Ball[];
  puddles: Decal[];
  later: Later[];
  snowEndedMs: number;
  rainEndedMs: number;
  /** Acts begun, by name (tests and the debug panel). */
  acts: Record<string, number>;
  seq: number;
}

const stores = new WeakMap<World, Store>();

function store(world: World): Store {
  let s = stores.get(world);
  if (!s) {
    s = {
      snow: [],
      balls: [],
      puddles: [],
      later: [],
      snowEndedMs: 0,
      rainEndedMs: 0,
      acts: {},
      seq: 0,
    };
    stores.set(world, s);
  }
  return s;
}

export const weatherPlayActs = (world: World): Readonly<Record<string, number>> =>
  store(world).acts;
export const snowFigures = (world: World): readonly Decal[] => stores.get(world)?.snow ?? [];
/** A snowball's place on its lob at `timeMs`, for the renderers. y is the height above the ground. */
export function ballAt(b: Ball, timeMs: number): { x: number; y: number; z: number } {
  const k = Math.max(0, Math.min(1, (timeMs - b.startMs) / (b.endMs - b.startMs)));
  return {
    x: b.fromX + (b.toX - b.fromX) * k,
    y: 0.5 + Math.sin(k * Math.PI) * WEATHER_PLAY.lobHeight,
    z: b.fromZ + (b.toZ - b.fromZ) * k,
  };
}
export const snowballsOf = (world: World): readonly Ball[] => stores.get(world)?.balls ?? [];
export const puddlesOf = (world: World): readonly Decal[] => stores.get(world)?.puddles ?? [];

const PLAY = [
  'snowball',
  'snowBuild',
  'puddleStomp',
  'sunbathe',
  'leafPileJump',
  'flowerSniff',
  'sneeze',
  'snowTaken',
];

function count(s: Store, what: string): void {
  s.acts[what] = (s.acts[what] ?? 0) + 1;
}

function stepDecals(world: World, s: Store, now: number, second: boolean): void {
  const snowing = world.weather.kind === 'snow';
  const raining = world.weather.kind === 'rain';
  if (snowing) s.snowEndedMs = 0;
  else if (s.snow.length && s.snowEndedMs === 0) s.snowEndedMs = now;
  if (raining) s.rainEndedMs = 0;
  else if (s.puddles.length && s.rainEndedMs === 0) s.rainEndedMs = now;
  if (s.snowEndedMs && now - s.snowEndedMs > WEATHER_PLAY.meltMs) {
    s.snow = [];
    s.snowEndedMs = 0;
  }
  if (s.rainEndedMs && now - s.rainEndedMs > WEATHER_PLAY.meltMs) {
    s.puddles = [];
    s.rainEndedMs = 0;
  }
  if (raining && second && s.puddles.length < WEATHER_PLAY.puddleMax) {
    const key = `pud:${world.seed}:${now}`;
    if (h01(key) < WEATHER_PLAY.puddlePerSecond) {
      const near = world.nubbins.filter(awake);
      const base = near.length
        ? near[Math.floor(h01(`${key}:n`) * near.length) % near.length]!.pos
        : world.keeper.pos;
      const a = h01(`${key}:a`) * Math.PI * 2;
      const [lo, hi] = WEATHER_PLAY.puddleSpan;
      const r = lo + (hi - lo) * h01(`${key}:r`);
      const p = { x: base.x + Math.cos(a) * r, z: base.z + Math.sin(a) * r };
      clampToGrove(p);
      s.puddles.push({ x: p.x, z: p.z, atMs: now });
    }
  }
}

function runLater(world: World, s: Store, now: number, events: SimEvent[]): void {
  const due = s.later.filter((l) => l.atMs <= now);
  if (!due.length) return;
  s.later = s.later.filter((l) => l.atMs > now);
  for (const l of due) {
    const n = world.nubbins.find((x) => x.id === l.id);
    const o = l.other ? world.nubbins.find((x) => x.id === l.other) : undefined;
    switch (l.what) {
      case 'snowHit':
        // The friend gets a surprise, then giggles.
        if (o && idle(o)) {
          react(o, 'surprised', now, events);
          count(s, 'snowHit');
        }
        break;
      case 'snowman':
        if (stillIn(n, PLAY) && l.at) {
          s.snow.push({ x: l.at.x, z: l.at.z, atMs: now });
          if (s.snow.length > WEATHER_PLAY.snowmanMax) s.snow.shift();
          count(s, 'snowman');
          react(n, 'happy', now, events);
          if (o && stillIn(o, PLAY)) react(o, 'happy', now, events);
        }
        break;
      case 'sunSparkle':
        if (stillIn(n, PLAY)) {
          count(s, 'sunSparkle');
          react(n, 'happy', now, events);
        }
        break;
      case 'sneeze':
        if (stillIn(n, PLAY)) {
          act(n, now, 'sneeze', WEATHER_PLAY.sneezeMs);
          count(s, 'sneeze');
        }
        break;
    }
  }
}

/** What this Nubbin might do in today's weather, or null. */
function choose(world: World, s: Store, n: Nubbin, now: number): boolean {
  const W = WEATHER_PLAY;
  const weather = world.weather.kind;
  const near = world.nubbins.filter((o) => o !== n && idle(o) && dist(o.pos, n.pos) < 6);
  if (weather === 'snow') {
    const friend = near[0];
    if (!friend) return false;
    if (h01(`sn:${n.id}:${now}`) < 0.5 && s.snow.length < W.snowmanMax) {
      // Two roll a figure together, beside each other.
      const spot = { x: n.pos.x + 1, z: n.pos.z };
      act(n, now, 'snowBuild', W.snowBuildMs);
      act(friend, now, 'snowBuild', W.snowBuildMs);
      friend.facing = Math.atan2(n.pos.x - friend.pos.x, n.pos.z - friend.pos.z);
      s.later.push({
        id: n.id,
        atMs: now + W.snowBuildMs - 200,
        what: 'snowman',
        other: friend.id,
        at: spot,
      });
      count(s, 'snowBuild');
    } else {
      act(n, now, 'snowball', W.snowballMs);
      n.facing = Math.atan2(friend.pos.x - n.pos.x, friend.pos.z - n.pos.z);
      s.later.push({ id: n.id, atMs: now + 900, what: 'snowHit', other: friend.id });
      s.balls.push({
        fromX: n.pos.x,
        fromZ: n.pos.z,
        toX: friend.pos.x,
        toZ: friend.pos.z,
        startMs: now + 250,
        endMs: now + 900,
      });
      count(s, 'snowball');
    }
    return true;
  }
  if (weather === 'rain') {
    let pud: Decal | null = null;
    for (const p of s.puddles)
      if (dist(p, n.pos) < 12 && (!pud || dist(p, n.pos) < dist(pud, n.pos))) pud = p;
    if (!pud) return false;
    act(n, now, 'puddleStomp', W.stompMs, { x: pud.x, z: pud.z });
    count(s, 'puddleStomp');
    return true;
  }
  if (weather !== 'clear') return false;
  if (world.season === 'summer') {
    if (n.personality !== 'lazy' && h01(`sun:${n.id}:${now}`) >= 1 / W.lazySun) return false;
    act(n, now, 'sunbathe', W.sunbatheMs);
    s.later.push({ id: n.id, atMs: now + W.sunbatheMs - 300, what: 'sunSparkle' });
    count(s, 'sunbathe');
    return true;
  }
  if (world.season === 'autumn') {
    act(n, now, 'leafPileJump', W.leafJumpMs);
    count(s, 'leafPileJump');
    return true;
  }
  if (world.season === 'spring') {
    act(n, now, 'flowerSniff', W.sniffMs);
    if (hasTrait(n, 'sneezy'))
      s.later.push({ id: n.id, atMs: now + W.sniffMs - 200, what: 'sneeze' });
    count(s, 'flowerSniff');
    return true;
  }
  return false;
}

/** Once a step. */
export function stepWeatherPlay(
  world: World,
  dtMs: number,
  events: SimEvent[],
  offline: boolean,
): void {
  const s = store(world);
  if (offline || !soulLive() || world.location !== 'grove') {
    s.later = [];
    s.balls = [];
    return;
  }
  const now = world.timeMs;
  const second = Math.floor(now / 1000) !== Math.floor((now - dtMs) / 1000);
  stepDecals(world, s, now, second);
  if (s.balls.length) s.balls = s.balls.filter((b) => b.endMs + 200 > now);
  runLater(world, s, now, events);
  if (!second) return;
  const lively = liveliness(world);
  for (const n of world.nubbins) {
    if (!idle(n) || n.behavior.itemId === 'gatherJam') continue;
    if (h01(`wp:${n.id}:${now}`) >= WEATHER_PLAY.perSecond * lively) continue;
    choose(world, s, n, now);
  }
}
