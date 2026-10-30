/**
 * Boss floors (R0160, DUNG-20; lane B round 6). The last level of each act dungeon ends in a
 * boss room built from a 'boss'-tagged piece (its `B` socket holds the boss). Beating the boss
 * the first time opens the big chest: a guaranteed Legendary piece at the boss's level, straight
 * into the satchel. Then the celebration card (the boss poofs and runs home), and the next
 * act's camp waypoint hums awake so the way on is one tap from the cave mouth. Losing to a boss
 * costs nothing: the party is back at the stairs, fully rested, to try again.
 *
 * The boss's phases are data for the fight side (`bossPhases`): at half its puff, adds join.
 * Lane C's encounter core does not read them yet.
 */
import { ACTS } from '../config/dungeon-acts';
import { HOLLOW_R6 } from '../config/tuning-dungeon';
import { HOLLOW_CAPE, HOLLOW_HATS } from '../config/cosmetics-hollow';
import { actFamilies } from '../config/dungeon-foes';
import { rollGear, keepGear } from './gear';
import type { Rng } from './rng';
import type { DungeonRun, SimEvent, World } from './types';

/** A boss's phases: below `hpTo` of its puff, `adds` (foe looks) join the fight. */
export interface BossPhase {
  hpTo: number;
  adds: string[];
}

/** The act's boss phases: one at half puff, with two of the act's own foes as adds. */
export function bossPhases(act: number | undefined): BossPhase[] {
  if (act === undefined) return [];
  const fam = actFamilies(act)[0];
  return fam ? [{ hpTo: 0.5, adds: [fam.look, fam.look] }] : [];
}

/** The waypoint id the next act opens at (its camp), or null after the last act. */
export function nextActWaypoint(act: number): string | null {
  const next = ACTS[act + 1];
  return next ? `${next.id}.town` : null;
}

/**
 * The act's boss is beaten (the flag is already set). The first time: the big chest and the
 * next act's waypoint, with the celebration card. Later wins only get the usual drops.
 */
export function bossWon(
  world: World,
  run: DungeonRun,
  level: number,
  rng: Rng,
  events: SimEvent[],
): void {
  const act = run.act;
  if (act === undefined) return;
  // R0206: the act's hat, and the cape once all five are home (once each, on any tier).
  giveWearable(world, HOLLOW_HATS[act], events);
  if (HOLLOW_HATS.every((h) => world.inventory.hats.includes(h)))
    giveWearable(world, HOLLOW_CAPE, events);
  const paid = (world.hollow.bossChests ??= []);
  if (paid.includes(act)) return;
  paid.push(act);
  const item = rollGear(world, rng, level, 0, HOLLOW_R6.bossChestRarity);
  keepGear(world, item);
  const next = nextActWaypoint(act);
  if (next && !world.hollow.waypoints.includes(next)) world.hollow.waypoints.push(next);
  events.push({ kind: 'bossCelebration', act, item, next });
}

/** R0206: a milestone wearable, given once. */
function giveWearable(world: World, id: string | undefined, events: SimEvent[]): void {
  if (!id || world.inventory.hats.includes(id)) return;
  world.inventory.hats.push(id);
  events.push({ kind: 'hollowWearable', id });
}

/** A lost boss fight: everyone rests up fully for the retry. */
export function bossRetry(world: World, run: DungeonRun): void {
  for (const id of run.party) {
    const n = world.nubbins.find((x) => x.id === id);
    if (n) n.needs.energy = Math.max(n.needs.energy, HOLLOW_R6.bossRetryEnergy);
  }
}
