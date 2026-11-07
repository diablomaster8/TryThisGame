import { MOON_POIS, SUN_POIS } from './region-sunmoon';

/**
 * R0096 (WORLD-34, round 14): the props of the Nubbin gardens in the Sun and Moon lands, where
 * the mirrors of their adults stroll. Each garden is a small ring round its POI: a bench, two
 * beds of flowers (or glow-caps), a toy stand and four fence posts. Region-local, centred,
 * +z south; drawn by both renderers on the region kit, walkable (no solids).
 */
export type GardenPropKind = 'bench' | 'bed' | 'toy' | 'post';

export interface GardenProp {
  kind: GardenPropKind;
  x: number;
  z: number;
}

/** Offsets round a garden's centre, shared by every garden. */
const RING: readonly { kind: GardenPropKind; dx: number; dz: number }[] = [
  { kind: 'bench', dx: 0, dz: -3.2 },
  { kind: 'bed', dx: -3, dz: 0.6 },
  { kind: 'bed', dx: 3, dz: 0.6 },
  { kind: 'toy', dx: 1.6, dz: 2.6 },
  { kind: 'post', dx: -4.2, dz: -2.6 },
  { kind: 'post', dx: 4.2, dz: -2.6 },
  { kind: 'post', dx: -4.2, dz: 3.4 },
  { kind: 'post', dx: 4.2, dz: 3.4 },
];

function garden(poi: { x: number; z: number } | undefined): GardenProp[] {
  if (!poi) return [];
  return RING.map((r) => ({ kind: r.kind, x: poi.x + r.dx, z: poi.z + r.dz }));
}

const sun = (id: string) => SUN_POIS.find((p) => p.id === id);
const moon = (id: string) => MOON_POIS.find((p) => p.id === id);

/** The Sun lands' two terrace gardens. */
export const SUN_GARDEN_PROPS: readonly GardenProp[] = [
  ...garden(sun('east-garden')),
  ...garden(sun('west-garden')),
];

/** The Moon lands' two shore gardens: the west shore and beside the standing stones. */
export const MOON_GARDEN_PROPS: readonly GardenProp[] = [
  ...garden(moon('west-shore')),
  ...garden(moon('moon-stones')),
];
