import { GROVE } from '../config/tuning';
import type { SimEvent, TileKind, Vec2, World } from './types';

/** Terraforming: painted tiles on a half-unit grid, drawn into the ground texture. */
export function tileKey(pos: Vec2): string {
  return `${Math.round(pos.x * 2) / 2},${Math.round(pos.z * 2) / 2}`;
}

export function paintTile(world: World, pos: Vec2, tile: TileKind, events: SimEvent[]): boolean {
  const half = GROVE.size / 2 - 0.5;
  if (Math.abs(pos.x) > half || Math.abs(pos.z) > half) return false;
  const pond = GROVE.pond;
  if (Math.hypot(pos.x - pond.x, pos.z - pond.z) < pond.r + 0.5) return false;
  const key = tileKey(pos);
  if (tile === 'grass') delete world.tiles[key];
  else world.tiles[key] = tile;
  events.push({ kind: 'tilePainted', tile });
  return true;
}

/** Whether a point stands on painted water (Nubbins avoid it; a wading Keeper does not). */
export function onWaterTile(world: World, pos: Vec2): boolean {
  return world.tiles[tileKey(pos)] === 'water';
}
