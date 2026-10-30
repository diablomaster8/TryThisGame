import { CAVE_MOUTH, COTTAGE_LANTERN, WILD_PROPS } from '../config/grove-layout';
import { OUTER_PROPS, OUTER_TREES } from '../config/outer-ring';
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
  { kind: 'lanternPost', x: COTTAGE_LANTERN.x, z: COTTAGE_LANTERN.z, size: 0.8 },
  // The Hollow Below opens in the east face of the north-west hill.
  {
    kind: 'caveMouth',
    x: CAVE_MOUTH.x,
    z: CAVE_MOUTH.z,
    size: 4.0,
    pick: { kind: 'building', id: 'cave' },
  },
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
  // Bushes, logs, rocks and the outer ring's wild trees, from the shared layout (MOVE-01).
  ...WILD_PROPS.map((p) => ({
    kind: p.art as SceneryKind,
    x: p.x,
    z: p.z,
    size: p.size,
    ...(p.art.startsWith('wild') ? { sway: 0.05 } : {}),
  })),
  // R0072: the outer ring's places and the north wood's extra trees (config/outer-ring.ts).
  ...OUTER_TREES.map((t) => ({
    kind: t.art as SceneryKind,
    x: t.x,
    z: t.z,
    size: t.size,
    sway: 0.05,
  })),
  ...OUTER_PROPS.map((p) => ({
    kind: p.art as SceneryKind,
    x: p.x,
    z: p.z,
    size: p.size,
    ...(p.tap ? { pick: { kind: 'building' as const, id: `outer:${p.id}` } } : {}),
    ...(p.art === 'orchard-tree' ? { sway: 0.04 } : {}),
  })),
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
