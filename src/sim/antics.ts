/**
 * R0544 (SOUL-26): little physical comedy with nobody prompting it. A walk can end in a
 * trip and a faceplant; walking past flowers brings a sneeze (more in spring); two fruits
 * inside a minute bring the hiccups; a cheerful or mischievous child chases its own tail.
 * Each is under two seconds and cosmetic (±1 happiness at most). Bonks into trunks are the
 * slapstick walk's already (`sim/slapstick.ts`).
 *
 * Chances come from a hash of the Nubbin and the second, not from the world's rng, so adding
 * the antics leaves every seeded day as it was. Nothing fires while the world is catching
 * up on time away (`setAnticsLive`, set by `stepWorld`).
 */
import { ANTICS } from '../config/tuning';
import { hashSeed } from './rng';
import type { Nubbin, SimEvent, World } from './types';

export type AnticKind = 'trip' | 'sneeze' | 'hiccup' | 'chaseTail';

let live = true;

/** Off during offline catch-up: antics are for watching. */
export function setAnticsLive(on: boolean): void {
  live = on;
}

/** A 0..1 roll for this Nubbin, this purpose and this whole second. */
function roll(n: Nubbin, what: string, now: number): number {
  return hashSeed(`${n.id}:${what}:${Math.floor(now / 1000)}`) / 4294967296;
}

/** True once per sim second (the first step of it). */
const secondTick = (now: number, dtMs: number): boolean =>
  Math.floor(now / 1000) !== Math.floor((now - dtMs) / 1000);

/** When each Nubbin last ate, for the hiccups; transient, as the antics are cosmetic. */
const lastAte = new WeakMap<Nubbin, number>();
const hiccupDue = new WeakSet<Nubbin>();

/** A fruit eaten: a second inside a minute queues the hiccups for its next idle choice. */
export function noteAteForAntics(n: Nubbin, now: number): void {
  const before = lastAte.get(n);
  lastAte.set(n, now);
  if (live && before !== undefined && now - before < ANTICS.hiccupWithinMs) hiccupDue.add(n);
}

function nearFlowers(n: Nubbin, world: World): boolean {
  const r = ANTICS.sneezeRadius;
  const near = (p: { x: number; z: number }) => Math.hypot(p.x - n.pos.x, p.z - n.pos.z) < r;
  return (
    world.placed.some((d) => d.kind === 'flowerbed' && near(d.pos)) ||
    world.memorials.some((m) => near(m.pos)) ||
    world.plants.some((p) => near(p.pos))
  );
}

/** A walking step: maybe a trip or a sneeze. Returns the antic to start, or null. */
export function walkAntic(n: Nubbin, world: World, now: number, dtMs: number): AnticKind | null {
  if (!live || n.stage === 'egg' || !secondTick(now, dtMs)) return null;
  if (roll(n, 'trip', now) < ANTICS.tripPerSecond) return 'trip';
  const spring = world.season === 'spring' ? 2 : 1;
  if (nearFlowers(n, world) && roll(n, 'sneeze', now) < ANTICS.sneezePerSecond * spring)
    return 'sneeze';
  return null;
}

/** An idle choice: the hiccups if due, or a child's tail chase. */
export function idleAntic(n: Nubbin, now: number): AnticKind | null {
  if (!live || n.stage === 'egg') return null;
  if (hiccupDue.has(n)) {
    hiccupDue.delete(n);
    return 'hiccup';
  }
  const p = n.personality ?? null;
  if (
    n.stage === 'child' &&
    p !== 'shy' &&
    p !== 'lazy' &&
    roll(n, 'tail', now) < ANTICS.tailChance
  )
    return 'chaseTail';
  return null;
}

/** How long each antic plays, and the event that tells the HUD and the sound. */
export function anticMs(kind: AnticKind): number {
  return kind === 'trip'
    ? ANTICS.tripMs
    : kind === 'sneeze'
      ? ANTICS.sneezeMs
      : kind === 'hiccup'
        ? ANTICS.hiccupMs
        : ANTICS.tailMs;
}

export function anticEvent(n: Nubbin, kind: AnticKind): SimEvent {
  return { kind: 'antic', nubbinId: n.id, antic: kind };
}

export function isAntic(id: string | null): id is AnticKind {
  return id === 'trip' || id === 'sneeze' || id === 'hiccup' || id === 'chaseTail';
}
