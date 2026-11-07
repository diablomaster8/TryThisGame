import type { ReadonlyWorld } from './readonly';
import { WEATHER_PLAY } from '../config/tuning-more/world-content-tables';
import type { RegionId } from '../config/regions';
import { localHourOf, tzOf } from './local-time';
import { regionSkyAt, type RegionSky } from './region-weather-live';
import { drawnRegionOf } from './region-walk';
import type { SimEvent, World } from './types';

/**
 * R0137 (WORLD-71): weather you can use. The region's live sky (`region-weather-live.ts`) opens
 * small things: wind on the ridge makes a glide a third longer, fog on the shore shows a ghost
 * ship out at sea (a gag, seen once per save for the album's sake and again any foggy day), and
 * rain turns the Wood's mill wheel faster (`millWheelMul`, read by its drawing). None of it is
 * needed for anything.
 */
function skyHere(world: ReadonlyWorld, region: RegionId): RegionSky | null {
  const hour = localHourOf(world.lastWallMs, tzOf(world));
  return regionSkyAt(world.seed, region, world.timeMs, hour, world.debugSeason ?? world.season);
}

/** How much longer a glide runs in the region the Keeper is in: 1.3 on a windy ridge, else 1. */
export function windGlideMul(world: World): number {
  if (drawnRegionOf(world.location) !== 'ridge') return 1;
  return skyHere(world, 'ridge')?.kind === 'wind' ? WEATHER_PLAY.windGlide : 1;
}

/** How much faster the Wood's mill wheel turns: faster in rain (and a sunshower), else 1. */
export function millWheelMul(world: ReadonlyWorld): number {
  if (drawnRegionOf(world.location) !== 'wood') return 1;
  const k = skyHere(world, 'wood')?.kind;
  return k === 'rain' || k === 'sunshower' ? WEATHER_PLAY.millRain : 1;
}

/** The ghost ship's spot while the shore is in fog and the Keeper is on the shore, else null. */
export function ghostShipHere(world: ReadonlyWorld): { x: number; z: number } | null {
  const g = WEATHER_PLAY.ghost;
  if (drawnRegionOf(world.location) !== g.region) return null;
  return skyHere(world, g.region)?.kind === 'fog' ? { x: g.x, z: g.z } : null;
}

const noted = new WeakMap<ReadonlyWorld, boolean>();

/** Seeing the ghost ship says so once per sighting (it comes and goes with the fog). */
export function stepWeatherPlay(world: World, events: SimEvent[]): void {
  const ship = ghostShipHere(world);
  const near =
    !!ship &&
    Math.hypot(ship.x - world.keeper.pos.x, ship.z - world.keeper.pos.z) <= WEATHER_PLAY.ghost.seen;
  if (near === (noted.get(world) ?? false)) return;
  noted.set(world, near);
  if (near) {
    const key = `gag:${WEATHER_PLAY.ghost.region}-ghost-ship`;
    const first = (world.collected ??= {})[key] === undefined;
    if (first) world.collected[key] = world.timeMs;
    events.push({ kind: 'regionGag', id: 'ghost-ship', first });
  }
}
