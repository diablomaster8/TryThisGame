/**
 * Strays as a small chase rather than a tax (R0162, DUNG-22). A stray that snatches Shells
 * drops them one by one as it flees, so running after it gets them back; it snatches at most
 * twice on a floor, never in the arrival grace or a fight, and a party Nubbin can chase one
 * off for a little energy. Once seen, a stray shows on the automap. Feeding one a fruit still
 * recruits it (`feedStray` in dungeon.ts).
 */
import { DUNGEON, HOLLOW } from '../config/tuning';
import { cellOf, isExplored, type Floor } from './dungeon';
import type { DungeonRun, DungeonStray, SimEvent, World } from './types';

const S = HOLLOW.strays;

/** Whether this stray may snatch now (outside the grace, under its cap, not shooed). */
export function maySnatch(s: DungeonStray, settling: boolean): boolean {
  return !settling && !s.shooed && (s.snatches ?? 0) < S.maxSnatches;
}

/** The snatch itself: the Shells go with the stray, to be dropped as it runs. */
export function snatch(world: World, run: DungeonRun, s: DungeonStray, events: SimEvent[]): void {
  const shells = Math.min(world.inventory.shells, DUNGEON.straySnatch);
  world.inventory.shells -= shells;
  run.haul.shells = Math.max(0, run.haul.shells - shells);
  s.cooldownMs = DUNGEON.strayCooldownMs;
  s.snatches = (s.snatches ?? 0) + 1;
  s.carrying = (s.carrying ?? 0) + shells;
  events.push({ kind: 'strayStartled', shells });
}

/**
 * One step of a stray's trail and sightings: a fleeing stray drops a Shell every
 * `dropEveryMs`, and one within sight of the Keeper (on an explored cell) is marked seen.
 */
export function stepStray(
  world: World,
  run: DungeonRun,
  f: Floor,
  s: DungeonStray,
  dtMs: number,
): void {
  const c = cellOf(f, s.pos);
  if (!s.seen && isExplored(run, f, c.x, c.y)) {
    const k = world.keeper.pos;
    if (Math.hypot(s.pos.x - k.x, s.pos.z - k.z) <= S.seeRadius) s.seen = true;
  }
  if (!s.carrying) return;
  const t = (dropClock.get(s) ?? 0) + dtMs;
  // One Shell every `dropEveryMs`; a stray about to stop fleeing drops the rest.
  const all = s.cooldownMs <= S.dropEveryMs;
  if (t < S.dropEveryMs && !all) {
    dropClock.set(s, t);
    return;
  }
  dropClock.set(s, 0);
  const trail = (run.shellTrail ??= []);
  for (let n = all ? s.carrying : 1; n > 0; n--) {
    s.carrying -= 1;
    trail.push({ id: `${s.id}-${s.snatches ?? 0}-${s.carrying}`, x: s.pos.x, z: s.pos.z });
  }
}

// Time since a fleeing stray last dropped a Shell; runtime only (a reload restarts it).
const dropClock = new WeakMap<DungeonStray, number>();

/** The Keeper walks over dropped Shells and picks them up. */
export function pickTrail(world: World, run: DungeonRun, events: SimEvent[]): void {
  const trail = run.shellTrail;
  if (!trail?.length) return;
  const k = world.keeper.pos;
  for (let i = trail.length - 1; i >= 0; i--) {
    const t = trail[i]!;
    if (Math.hypot(t.x - k.x, t.z - k.z) > DUNGEON.pickupRadius) continue;
    trail.splice(i, 1);
    world.inventory.shells += 1;
    run.haul.shells += 1;
    events.push({ kind: 'trailShell' });
  }
}

/**
 * Shoo a stray: the liveliest party Nubbin with the energy for it chases the stray away.
 * It flees and never snatches again on this floor. False when no Nubbin can.
 */
export function shooStray(world: World, run: DungeonRun, id: string, events: SimEvent[]): boolean {
  const s = run.strays.find((x) => x.id === id);
  if (!s || s.shooed) return false;
  const chaser = run.party
    .map((pid) => world.nubbins.find((n) => n.id === pid))
    .filter((n) => !!n && n.stage !== 'egg' && n.stage !== 'cocoon')
    .filter((n) => n!.needs.energy >= S.shooEnergy)
    .sort((a, b) => b!.needs.energy - a!.needs.energy)[0];
  if (!chaser) return false;
  chaser.needs.energy -= S.shooEnergy;
  s.shooed = true;
  s.cooldownMs = DUNGEON.strayCooldownMs;
  s.target = null;
  events.push({ kind: 'strayShooed', by: chaser.id });
  return true;
}
