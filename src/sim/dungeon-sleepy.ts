/**
 * Sleepy packs and warm losses (lane B round 6).
 *
 * R0203 (DUNG-69): a share of normal packs start the level asleep (Zzz). A Keeper who walks by
 * within a few cells earns a "Tiptoe!" bonus and they snore on; a running Keeper wakes them
 * and they give chase. A Lazy party Nubbin may yawn one awake, which is funny, not a penalty.
 *
 * R0180 (DUNG-37): losing a fight never costs anything. The party gets the giggles, is carried
 * back to the stairs and rests to at least half energy. After a few losses to the same pack
 * the Keeper is offered "Sneak past?", which makes that pack look the other way for a minute.
 */
import { DUNGEON } from '../config/tuning';
import { HOLLOW_R6 } from '../config/tuning-dungeon';
import { Rng } from './rng';
import type { DungeonPack, DungeonRun, SimEvent, World } from './types';

/** Whether a fresh pack starts asleep: seeded by the floor and the pack, never by the roster. */
export function startsAsleep(floorKey: string, packId: string, kind: string): boolean {
  if (kind !== 'normal') return false;
  return Rng.fromSeed(`${floorKey}:${packId}:sleepy`).next() < HOLLOW_R6.sleepyShare;
}

/**
 * One step of a sleeping pack; true while it is still asleep (the caller leaves it be). Waking
 * clears the flag and starts the chase with the usual "!" beat.
 */
export function stepSleepy(
  world: World,
  run: DungeonRun,
  pack: DungeonPack,
  toKeeper: number,
  rng: Rng,
  events: SimEvent[],
): boolean {
  if (!pack.asleep || pack.state === 'beaten') return false;
  if (toKeeper > HOLLOW_R6.wakeCells * DUNGEON.cell) return true;
  const wake = (yawn: boolean): false => {
    delete pack.asleep;
    pack.state = 'chase';
    pack.noticedMs = world.timeMs;
    events.push({ kind: 'packWoke', packId: pack.id, yawn });
    events.push({ kind: 'packNoticed', packId: pack.id });
    return false;
  };
  if (world.keeper.running) return wake(false);
  if (pack.tiptoed) return true;
  pack.tiptoed = true;
  const lazy = run.party.some(
    (id) => world.nubbins.find((n) => n.id === id)?.personality === 'lazy',
  );
  if (lazy && rng.chance(HOLLOW_R6.lazyYawn)) return wake(true);
  world.inventory.shells += HOLLOW_R6.tiptoeShells;
  run.haul.shells += HOLLOW_R6.tiptoeShells;
  events.push({ kind: 'tiptoe', packId: pack.id, shells: HOLLOW_R6.tiptoeShells });
  return true;
}

/** A pack the Keeper chose to sneak past is looking the other way. */
export function sneaking(world: World, run: DungeonRun, pack: DungeonPack): boolean {
  return (run.sneakUntil?.[pack.id] ?? -1) > world.timeMs;
}

/** A fight lost to `packId`: the party rests up a little, and the losses are counted. */
export function lostTo(world: World, run: DungeonRun, packId: string, events: SimEvent[]): void {
  for (const id of run.party) {
    const n = world.nubbins.find((x) => x.id === id);
    if (n) n.needs.energy = Math.max(n.needs.energy, HOLLOW_R6.lossEnergy);
  }
  const losses = (run.packLosses ??= {});
  losses[packId] = (losses[packId] ?? 0) + 1;
  if (losses[packId]! >= HOLLOW_R6.sneakAfter) events.push({ kind: 'sneakOffer', packId });
}

/** "Sneak past?" accepted: only after enough losses to that pack. */
export function sneakPast(world: World, packId: string, events: SimEvent[]): boolean {
  const run = world.dungeon;
  if (!run || (run.packLosses?.[packId] ?? 0) < HOLLOW_R6.sneakAfter) return false;
  (run.sneakUntil ??= {})[packId] = world.timeMs + HOLLOW_R6.sneakMs;
  const pack = run.packs?.find((p) => p.id === packId);
  if (pack && pack.state === 'chase') pack.state = 'home';
  events.push({ kind: 'sneakPast', packId });
  return true;
}
