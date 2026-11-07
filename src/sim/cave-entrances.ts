/**
 * R0115 (WORLD-38, R11 lane D d7): the world owns the ways into its caves. Each cave has an
 * entrance in a region (an exit of kind `stairs`: the Grove's Hollow mouth, the ridge's ice
 * caves, the ruins' sealed door) and a way back out whose `arrive` stands just outside that
 * mouth, facing away from it. Lane B's dungeon code asks here where a run that went in by a
 * mouth comes back out (`caveReturn`), so DUNG's floors attach to the world's entrances.
 */
import { REGIONS, type RegionExit, type RegionId } from '../config/regions';
import { CAVE_WAYS, type CaveWayDef } from '../config/tuning-r17d1';
import type { Vec2 } from './types';

/** How near the mouth the Keeper stands when it counts as going in by it. */
const NEAR = 4;

/** Every cave mouth in the world and the way back out of it: [region, entrance, return]. */
export function caveMouths(): { region: RegionId; mouth: RegionExit; back: RegionExit }[] {
  const out: { region: RegionId; mouth: RegionExit; back: RegionExit }[] = [];
  for (const id of Object.keys(REGIONS) as RegionId[])
    for (const e of REGIONS[id].exits) {
      if (e.kind !== 'stairs') continue;
      const back = REGIONS[e.to].exits.find((b) => b.kind === 'stairs' && b.to === id);
      // Only the entrance side: the cave's own way up is the pair's other half.
      if (back && REGIONS[e.to].biome === 'cave' && REGIONS[id].biome !== 'cave')
        out.push({ region: id, mouth: e, back });
    }
  return out;
}

/**
 * Where a Keeper who went into a cave from `from` in `region` comes back out: the mouth's way
 * back, facing away from it; null when `from` is not at a mouth (an acorn portal, a debug jump).
 */
export function caveReturn(region: RegionId, from: Vec2): { pos: Vec2; facing: number } | null {
  for (const c of caveMouths()) {
    if (c.region !== region) continue;
    const cx = c.mouth.rect.x + c.mouth.rect.w / 2;
    const cz = c.mouth.rect.z + c.mouth.rect.h / 2;
    if (Math.hypot(from.x - cx, from.z - cz) > NEAR) continue;
    return { pos: { x: c.back.arrive.x, z: c.back.arrive.z }, facing: c.back.facing };
  }
  return null;
}

// ---------------------------------------------------------------- R17 d1: the caves' floors

/** The cave a mouth's exit leads into (`ridge-ice`, `ruins-door`), or null for any other way. */
export function caveWayOf(exitId: string): CaveWayDef | null {
  return CAVE_WAYS[exitId] ?? null;
}

/** The place a cave is, as the world names it: `caves:<id>`. */
export function cavePlace(def: Pick<CaveWayDef, 'id'>): string {
  return `caves:${def.id}`;
}

/** The cave region's own way back out of a cave: its `arrive` is the mouth's spot, facing out. */
export function caveBack(def: CaveWayDef): RegionExit | null {
  return REGIONS.caves.exits.find((e) => e.id === def.back) ?? null;
}
