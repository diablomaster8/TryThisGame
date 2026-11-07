import { EDU_REGION_BOUNDS } from '../config/tuning-r15d1';
import type { RegionId } from '../config/regions';
import type { Vec2, World } from './types';

/**
 * R0099 (WORLD-40): in the Learning Grove a drawn region is only a slice (`EDU_REGION_BOUNDS`:
 * the shore's beach, the Wood's first clearing). `stepRegionWalk` calls `holdInSlice` so the
 * Keeper and any walk target stay inside it; `sliceAllows` tells the travel rules whether a
 * way out or an arrival point lies inside the slice of its region.
 */
export function inSlice(region: RegionId, p: Vec2): boolean {
  const b = EDU_REGION_BOUNDS[region];
  return !b || (p.x >= b.minX && p.x <= b.maxX && p.z >= b.minZ && p.z <= b.maxZ);
}

/** Whether a region has a slice at all (a region without one is whole, or not for kids). */
export function hasSlice(region: RegionId): boolean {
  return EDU_REGION_BOUNDS[region] !== undefined;
}

function pull(region: RegionId, p: Vec2): void {
  const b = EDU_REGION_BOUNDS[region];
  if (!b) return;
  p.x = Math.min(b.maxX - b.margin, Math.max(b.minX + b.margin, p.x));
  p.z = Math.min(b.maxZ - b.margin, Math.max(b.minZ + b.margin, p.z));
}

/** With the Learning Grove on, keep the Keeper and its walk target inside the region's slice. */
export function holdInSlice(world: World, region: RegionId): void {
  if (!world.edu || !hasSlice(region)) return;
  const k = world.keeper;
  if (!inSlice(region, k.pos)) pull(region, k.pos);
  if (k.moveTarget && !inSlice(region, k.moveTarget)) {
    k.moveTarget = { ...k.moveTarget };
    pull(region, k.moveTarget);
  }
}
