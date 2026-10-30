/**
 * Region rules (WORLD-04): which region the Keeper is in, which exits lead out, and the
 * `travel` command. The region is derived from `World.location`, so saves keep their shape:
 * the Grove is 'grove', the Hollow Below ('dungeon') is 'hollow', and the neighbours' gardens
 * and the campaign's homes are places in the lane. Nubbins keep simulating in the Grove only;
 * travel never touches them or the random stream, so leaving and coming back changes nothing
 * at home.
 */
import { REGIONS, REGION_ORDER, type RegionDef, type RegionId } from '../config/regions';
import { setLocation } from './campaign';
import { visit } from './neighbourhood';
import { TRAINERS } from './trainers';
import type { Location, SimEvent, World } from './types';

/** The region a location belongs to. */
export function regionOf(location: Location): RegionId {
  if (location === 'grove') return 'grove';
  if (location === 'dungeon') return 'hollow';
  return 'lane';
}

/** The place inside the region, where it has more than one (the lane's gardens). */
export function subOf(location: Location): string | undefined {
  return regionOf(location) === 'lane' ? location : undefined;
}

export function regionDef(id: RegionId): RegionDef {
  return REGIONS[id];
}

/** Regions entered so far, in map order; the Grove and the current region always count. */
export function regionsFound(world: World): RegionId[] {
  const found = new Set<string>(world.regionsFound ?? []);
  found.add('grove');
  found.add(regionOf(world.location));
  return REGION_ORDER.filter((r) => found.has(r));
}

/** Why an exit can't be taken now, or null when it can. */
export function travelBlock(
  world: World,
  exitId: string,
  sub?: string,
  regions: Readonly<Record<RegionId, RegionDef>> = REGIONS,
): string | null {
  const here = regions[regionOf(world.location)];
  const exit = here.exits.find((e) => e.id === exitId);
  if (!exit) return 'no-exit';
  const to = regions[exit.to];
  if (!to.built) return 'unbuilt';
  if (exit.unlock && !world.campaign?.flags[exit.unlock]) return 'locked';
  // The Hollow Below is entered through the cave by its own command, which starts a run.
  if (exit.to === 'hollow') return 'use-entrance';
  if (exit.to === 'lane' && !(sub && TRAINERS.some((t) => `visit:${t.id}` === sub))) {
    return 'no-place';
  }
  return null;
}

/** Take an exit. Refusals are an event, never an error, so the map can say why. */
export function travel(world: World, exitId: string, events: SimEvent[], sub?: string): boolean {
  const reason = travelBlock(world, exitId, sub);
  if (reason) {
    events.push({ kind: 'travelRefused', exit: exitId, reason });
    return false;
  }
  const from = regionOf(world.location);
  const exit = REGIONS[from].exits.find((e) => e.id === exitId)!;
  // R0124: when this region was left, for its closed-form ageing on the way back.
  (world.regionLeftMs ??= {})[from] = world.timeMs;
  if (exit.to === 'lane') visit(world, sub!.slice('visit:'.length), events);
  else setLocation(world, 'grove', events);
  world.keeper.pos = { x: exit.arrive.x, z: exit.arrive.z };
  world.keeper.facing = exit.facing;
  noteRegion(world, events);
  return true;
}

/** Record the current region as entered, with the events the map and toasts read. */
export function noteRegion(world: World, events: SimEvent[]): void {
  const region = regionOf(world.location);
  events.push({ kind: 'regionEntered', region });
  const found = (world.regionsFound ??= []);
  if (!found.includes(region)) {
    found.push(region);
    events.push({ kind: 'regionDiscovered', region });
  }
}

/**
 * R0124 (WORLD-58): how long a region has stood frozen since the Keeper left it, or Infinity
 * if never. Only the Grove simulates during catch-up (needs, fruit, weather); every other
 * region keeps this timestamp and ages on entry by cheap closed-form rules (its weather spell
 * from `regionSpell`, its clock from `regionHour`, its season from the date), so a week away
 * costs nothing extra however many regions there are.
 */
export function regionAwayMs(world: World, region: RegionId): number {
  if (regionOf(world.location) === region) return 0;
  const left = world.regionLeftMs?.[region];
  return left === undefined ? Infinity : world.timeMs - left;
}
