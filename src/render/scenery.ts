import { GROVE } from '../config/tuning';
import type { PaintedKind } from './paint/scenery';

export type SceneryKind = PaintedKind;

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
export const BUILDINGS: Record<string, { x: number; z: number }> = Object.fromEntries(
  Object.entries(GROVE.buildings).map(([id, b]) => [id, { x: b.x, z: b.z }]),
);

export const SCENERY: SceneryPlacement[] = [
  ...GROVE.trees.map((t, i) => ({
    kind: `tree-${i + 1}` as SceneryKind,
    x: t.x,
    z: t.z,
    size: 7.2,
    pick: { kind: 'tree' as const, id: `tree-${i + 1}` },
    sway: 0.05,
  })),
  // Bushes at the edges and near the water.
  { kind: 'bush-1', x: -11, z: 1, size: 2.4 },
  { kind: 'bush-2', x: 13.5, z: 10.5, size: 2.4 },
  { kind: 'bush-3', x: -20, z: -4, size: 2.4 },
  { kind: 'bush-1', x: 2, z: 18, size: 2.4 },
  { kind: 'bush-2', x: 13, z: -2.5, size: 2.2 },
  { kind: 'bush-3', x: -10, z: -10, size: 2.2 },
  { kind: 'bush-1', x: 20, z: 18, size: 2.4 },
  { kind: 'bush-2', x: -20, z: 20, size: 2.4 },
  { kind: 'bush-3', x: 8, z: -20, size: 2.2 },
  { kind: 'bush-1', x: -1, z: -8, size: 2.1 },
  { kind: 'log', x: -1, z: 20, size: 2.4 },
  { kind: 'log', x: 3, z: -5, size: 2.4 },
  { kind: 'log', x: -17, z: 2, size: 2.4 },
  { kind: 'rock-1', x: -7, z: 9, size: 1.6 },
  { kind: 'rock-2', x: -6, z: 9.8, size: 1.0 },
  { kind: 'rock-1', x: 6, z: -9, size: 1.4 },
  { kind: 'rock-2', x: 13, z: -5, size: 1.0 },
  { kind: 'rock-1', x: -13, z: 12, size: 1.3 },
  { kind: 'lanternPost', x: BUILDINGS.cottage!.x - 3.2, z: BUILDINGS.cottage!.z + 1.6, size: 0.8 },
  // The Hollow Below opens in the east face of the north-west hill.
  { kind: 'caveMouth', x: -12.4, z: -13.6, size: 4.0, pick: { kind: 'building', id: 'cave' } },
  {
    kind: 'windmill',
    x: BUILDINGS.windmill!.x,
    z: BUILDINGS.windmill!.z,
    size: 6.6,
    pick: { kind: 'building', id: 'windmill' },
  },
  {
    kind: 'cottage',
    x: BUILDINGS.cottage!.x,
    z: BUILDINGS.cottage!.z,
    size: 7.0,
    pick: { kind: 'building', id: 'cottage' },
  },
  {
    kind: 'school',
    x: BUILDINGS.school!.x,
    z: BUILDINGS.school!.z,
    size: 6.0,
    pick: { kind: 'building', id: 'school' },
  },
  {
    kind: 'dojo',
    x: BUILDINGS.dojo!.x,
    z: BUILDINGS.dojo!.z,
    size: 8.4,
    pick: { kind: 'building', id: 'dojo' },
  },
  { kind: 'well', x: BUILDINGS.well!.x, z: BUILDINGS.well!.z, size: 2.5 },
  // ---- the outer ring (the field grew to 96 units) ----
  // The north wood: a stand of wild trees between the cave hill and the north edge.
  { kind: 'wild-1', x: -30, z: -30, size: 7.0, sway: 0.05 },
  { kind: 'wild-2', x: -36, z: -24, size: 6.4, sway: 0.05 },
  { kind: 'wild-3', x: -24, z: -36, size: 6.8, sway: 0.05 },
  { kind: 'wild-4', x: -28, z: -42, size: 6.0, sway: 0.05 },
  { kind: 'wild-2', x: -18, z: -32, size: 6.2, sway: 0.05 },
  { kind: 'wild-1', x: -40, z: -14, size: 6.6, sway: 0.05 },
  { kind: 'wild-3', x: -8, z: -36, size: 6.4, sway: 0.05 },
  { kind: 'wild-4', x: 10, z: -40, size: 6.0, sway: 0.05 },
  { kind: 'wild-1', x: -14, z: -42, size: 6.4, sway: 0.05 },
  { kind: 'bush-3', x: -33, z: -36, size: 2.4 },
  { kind: 'bush-1', x: -22, z: -28, size: 2.2 },
  { kind: 'bush-2', x: -12, z: -30, size: 2.2 },
  { kind: 'log', x: -30, z: -20, size: 2.4 },
  { kind: 'rock-1', x: -22, z: -40, size: 1.4 },
  { kind: 'rock-2', x: -34, z: -20, size: 1.1 },
  // The east ridge: the big hill, scree and a few hardy trees.
  { kind: 'wild-3', x: 26, z: -26, size: 6.4, sway: 0.04 },
  { kind: 'wild-1', x: 40, z: -20, size: 6.0, sway: 0.04 },
  { kind: 'wild-2', x: 28, z: -42, size: 6.2, sway: 0.04 },
  { kind: 'rock-1', x: 20, z: -32, size: 1.6 },
  { kind: 'rock-2', x: 24, z: -30, size: 1.0 },
  { kind: 'rock-1', x: 30, z: 12, size: 1.4 },
  { kind: 'bush-3', x: 34, z: -12, size: 2.4 },
  { kind: 'bush-1', x: 40, z: 2, size: 2.4 },
  { kind: 'log', x: 36, z: 10, size: 2.4 },
  { kind: 'bush-2', x: 30, z: 20, size: 2.2 },
  // The far orchard corner and the south marsh along the stream.
  { kind: 'wild-4', x: 36, z: 22, size: 6.0, sway: 0.05 },
  { kind: 'wild-2', x: 22, z: 40, size: 6.4, sway: 0.05 },
  { kind: 'bush-1', x: 32, z: 36, size: 2.4 },
  { kind: 'rock-2', x: 36, z: 40, size: 1.0 },
  { kind: 'log', x: 2, z: 32, size: 2.4 },
  { kind: 'rock-1', x: -6, z: 34, size: 1.3 },
  { kind: 'wild-1', x: -4, z: 42, size: 6.2, sway: 0.05 },
  { kind: 'bush-3', x: 18, z: 30, size: 2.2 },
  { kind: 'bush-2', x: -12, z: 40, size: 2.2 },
  // The west meadow: open grass, flowers, a fruit tree and the low hill.
  { kind: 'wild-3', x: -42, z: 8, size: 6.4, sway: 0.05 },
  { kind: 'wild-4', x: -40, z: 28, size: 6.0, sway: 0.05 },
  { kind: 'wild-2', x: -22, z: 30, size: 6.4, sway: 0.05 },
  { kind: 'bush-1', x: -26, z: 24, size: 2.4 },
  { kind: 'bush-2', x: -36, z: 14, size: 2.2 },
  { kind: 'log', x: -24, z: 12, size: 2.4 },
  { kind: 'rock-1', x: -28, z: 8, size: 1.5 },
  { kind: 'bush-3', x: -30, z: 42, size: 2.4 },
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
