import { GROVE } from '../config/tuning';
import type { SceneryKind } from './sprites/scenery';

/** A placed piece of scenery; `pick` makes it tappable. */
export interface SceneryPlacement {
  kind: SceneryKind;
  x: number;
  z: number;
  /** World width of the sprite; height follows the 1:1 cell. */
  size: number;
  pick?: { kind: 'tree' | 'building'; id: string };
  /** Sway amplitude in world units (canopies). */
  sway?: number;
}

/** Where the buildings stand; also kept clear by decor placement. */
export const BUILDINGS: Record<string, { x: number; z: number }> = {
  cottage: { x: -7, z: 14 },
  school: { x: -3, z: -18 },
  dojo: { x: 18, z: -4 },
  well: { x: 3, z: 10 },
};

export const SCENERY: SceneryPlacement[] = [
  ...GROVE.trees.map((t, i) => ({
    kind: (i % 2 === 0 ? 'tree' : 'tree2') as SceneryKind,
    x: t.x,
    z: t.z,
    size: 4.2,
    pick: { kind: 'tree' as const, id: `tree-${i + 1}` },
    sway: 0.05,
  })),
  // Bushes at the edges and near the water.
  { kind: 'bush', x: -11, z: 1, size: 2.2 },
  { kind: 'bush2', x: 13.5, z: 10.5, size: 2.2 },
  { kind: 'bush', x: -20, z: -4, size: 2.2 },
  { kind: 'bush2', x: 2, z: 18, size: 2.2 },
  { kind: 'bush', x: 13, z: -2.5, size: 2.0 },
  { kind: 'bush2', x: -10, z: -10, size: 2.0 },
  { kind: 'bush', x: 20, z: 18, size: 2.2 },
  { kind: 'bush2', x: -20, z: 20, size: 2.2 },
  { kind: 'bush', x: 8, z: -20, size: 2.0 },
  { kind: 'bush2', x: -1, z: -8, size: 1.9 },
  { kind: 'log', x: -1, z: 20, size: 2.4 },
  { kind: 'log', x: 3, z: -5, size: 2.4 },
  { kind: 'log', x: -17, z: 2, size: 2.4 },
  {
    kind: 'cottage',
    x: BUILDINGS.cottage!.x,
    z: BUILDINGS.cottage!.z,
    size: 5.2,
    pick: { kind: 'building', id: 'cottage' },
  },
  {
    kind: 'school',
    x: BUILDINGS.school!.x,
    z: BUILDINGS.school!.z,
    size: 5.2,
    pick: { kind: 'building', id: 'school' },
  },
  {
    kind: 'dojo',
    x: BUILDINGS.dojo!.x,
    z: BUILDINGS.dojo!.z,
    size: 5.0,
    pick: { kind: 'building', id: 'dojo' },
  },
  { kind: 'well', x: BUILDINGS.well!.x, z: BUILDINGS.well!.z, size: 2.6 },
];

/** Fence posts along both sides of the main path from the start to the pond. */
export function fenceSpots(): Array<{ x: number; z: number }> {
  const out: Array<{ x: number; z: number }> = [];
  const a = GROVE.keeperStart;
  const b = { x: GROVE.pond.x - GROVE.pond.r - 1.4, z: GROVE.pond.z - 1 };
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  const nx = -(b.z - a.z) / len;
  const nz = (b.x - a.x) / len;
  for (let d = 1.2; d < len - 0.6; d += 1.0) {
    const t = d / len;
    const x = a.x + (b.x - a.x) * t;
    const z = a.z + (b.z - a.z) * t;
    out.push({ x: x + nx * 1.1, z: z + nz * 1.1 });
    out.push({ x: x - nx * 1.1, z: z - nz * 1.1 });
  }
  return out;
}

/** Footprints that decor and decorations must keep clear. */
export function nearBuilding(x: number, z: number, margin = 2.6): boolean {
  return Object.values(BUILDINGS).some((b) => Math.hypot(b.x - x, b.z - z) < margin);
}
