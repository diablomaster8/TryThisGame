/**
 * The parts of a world the renderers keep as their own state rather than reading every
 * frame: the painted ground and the Hollow floor. Both renderers are told about them when
 * a world is loaded or replaced (import, reset), not only when a sim event says they
 * changed, so a reload or an import never shows the last world's ground or cave
 * (review D, bug 5).
 */
import { runFloor } from '../sim/dungeon';
import type { Floor } from '../sim/dungeon';
import type { TileKind, World } from '../sim/types';

/** Whatever draws painted ground: the pixel Grove scene. */
export interface TileTarget {
  setTiles(tiles: Record<string, TileKind>): void;
}

/** Whatever draws the Hollow: both scenes and the pixel world view. */
export interface DungeonTarget {
  setDungeon(floor: Floor | null, depth?: number): void;
}

/** Show the Hollow floor the world is on, or the surface. */
export function syncDungeon(world: World, targets: ReadonlyArray<DungeonTarget | null>): void {
  const floor = runFloor(world);
  for (const t of targets) t?.setDungeon(floor, world.dungeon?.depth);
}

/** Bring every renderer in line with a world that was just loaded or swapped in. */
export function syncWorldScenes(
  world: World,
  tiles: TileTarget | null,
  dungeon: ReadonlyArray<DungeonTarget | null>,
): void {
  tiles?.setTiles(world.tiles);
  syncDungeon(world, dungeon);
}
