import { BEACON_LANDMARKS } from '../config/region-extras-r11d6';
import { REGIONS, type RegionId } from '../config/regions';
import { regionOf } from './regions';
import type { World } from './types';

/**
 * R0117 (WORLD-50): landmarks as orientation. Each region has one tall beacon
 * (`BEACON_LANDMARKS`); from where the Keeper stands, the beacons of the regions next door lie
 * the way their exits do. `neighbourBeacons` gives each with its bearing (radians, 0 = south /
 * +z, turning toward +x like the sprites' yaw) and the icon and name the compass rim shows.
 * Read-only over the world.
 */
export interface BeaconBearing {
  region: RegionId;
  name: string;
  icon: string;
  /** Direction of the way there from the region's middle, as `atan2(dx, dz)`. */
  bearing: number;
  /** Distance of that exit from the middle, world units. */
  distance: number;
}

export function neighbourBeacons(world: Pick<World, 'location'>): BeaconBearing[] {
  const here = REGIONS[regionOf(world.location)];
  const out: BeaconBearing[] = [];
  const seen = new Set<string>();
  for (const e of here.exits) {
    if (seen.has(e.to) || e.to === here.id) continue;
    const b = BEACON_LANDMARKS[e.to as keyof typeof BEACON_LANDMARKS];
    if (!b || !REGIONS[e.to].built) continue;
    seen.add(e.to);
    out.push({
      region: e.to,
      name: b.name,
      icon: b.icon,
      bearing: Math.atan2(e.rect.x, e.rect.z),
      distance: Math.hypot(e.rect.x, e.rect.z),
    });
  }
  return out;
}
