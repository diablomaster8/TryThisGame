import { TOWN } from '../config/tuning';
import { VILLAGE, type VillageBuilding, type VillageService } from '../config/region-village';
import { townUnlocks } from './town';
import type { TownRole, Vec2, World } from './types';

/**
 * R0095 (WORLD-32): what the village looks like now, as pure data both renderers read: which
 * service buildings stand, how many dressing sets hang, and where each recruit is on its loop.
 * Nothing here is stepped or saved: positions come from the sim clock, so a reload puts every
 * recruit back on the same spot and the village costs nothing while nobody looks.
 */
export interface VillageRecruit {
  index: number;
  name: string;
  species: string;
  role: TownRole;
  pos: Vec2;
  /** Walking direction, radians about y (three.js convention: 0 faces +z). */
  yaw: number;
}

/** The buildings standing at this prosperity, in `VILLAGE.buildings` order. */
export function villageBuildings(world: World): VillageBuilding[] {
  const u = townUnlocks(world);
  return VILLAGE.buildings.filter((b) => u[b.id]);
}

/** Dressing sets hung: one per `dressingStep` of prosperity, at most one per set. */
export function villageDressing(world: World): number {
  const p = Math.min(TOWN.max, world.town.prosperity);
  return Math.min(VILLAGE.dressing.length, Math.floor(p / VILLAGE.dressingStep));
}

/** The building a role walks by: the guards (and any role without one) walk the fountain. */
function homeOf(role: TownRole): VillageBuilding | null {
  return VILLAGE.buildings.find((b) => b.id === (role as VillageService)) ?? null;
}

/**
 * Every recruit's place at `timeMs`: a slow ellipse in front of its role's building (or round
 * the fountain), each a different phase so neighbours never walk in step.
 */
export function villageRecruits(world: World, timeMs: number = world.timeMs): VillageRecruit[] {
  const L = VILLAGE.loop;
  const sq = VILLAGE.square;
  return world.town.recruits.slice(0, L.max).map((r, index) => {
    const home = homeOf(r.role);
    // A loop's centre: out in front of the building, or a ring round the fountain.
    const cx = home ? home.x + Math.sin(home.yaw) * L.out : sq.x;
    const cz = home ? home.z + Math.cos(home.yaw) * L.out : sq.z;
    const rad = home ? L.r : VILLAGE.fountain.r + 1.6;
    const t = ((timeMs / L.ms + index * 0.37) % 1) * Math.PI * 2;
    const dir = index % 2 ? -1 : 1;
    const pos = { x: cx + Math.cos(t * dir) * rad, z: cz + Math.sin(t * dir) * rad * 0.7 };
    // Facing along the loop: the tangent of the ellipse.
    const tx = -Math.sin(t * dir) * dir * rad;
    const tz = Math.cos(t * dir) * dir * rad * 0.7;
    return {
      index,
      name: r.name,
      species: r.species,
      role: r.role,
      pos,
      yaw: Math.atan2(tx, tz),
    };
  });
}
