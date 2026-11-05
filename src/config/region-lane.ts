/**
 * WORLD-33 (R12 lane D): the neighbourhood lane as a drawn region, 24 × 120 north to south. The
 * Grove's gate opens onto its north end; a lane runs south past ten garden gates, one for each
 * trainer, every 12 u on alternating sides, each with the trainer's mailbox colour and flag;
 * the far end runs on toward the village. Walking through a garden gate is a loaded way into
 * that trainer's garden (`visit:<id>`, today's visit). Region-local, centred, +z south.
 */
import type { PoiDef, RegionExit } from './regions';
import type { RegionSpec } from './region-layout';

/** The trainers in gate order down the lane (the same ids and order as `sim/trainers.ts`). */
export const LANE_TRAINERS = [
  'fern',
  'marina',
  'sparks',
  'clover',
  'pixel',
  'luna',
  'ember',
  'byte',
  'dusty',
  'nova',
] as const;

/**
 * Each trainer's mailbox colour, distinct down the lane (taken from their look's accents); the
 * box also carries the trainer's initial, so the colour is never the only way to tell.
 */
export const LANE_MAILBOX: Record<(typeof LANE_TRAINERS)[number], string> = {
  fern: '#f29c2e',
  marina: '#4a9be0',
  sparks: '#f2d34c',
  clover: '#e85a7a',
  pixel: '#3fbfa8',
  luna: '#9b5de5',
  ember: '#c8392c',
  byte: '#7a6f8c',
  dusty: '#a06a3b',
  nova: '#1b2a5c',
};

/** Where the Grove's gate lets out, at the lane's north end. */
export const LANE_ARRIVE = { x: 0, z: -55 };

/** Each garden gate: its trainer, the gate's centre in the hedge and the lane side (±1). */
export const LANE_GATES = LANE_TRAINERS.map((id, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  return { id, x: side * 8.5, z: -50 + i * 12, side };
});

/** The garden ways: a loaded gate into each trainer's garden (the sub-place `visit:<id>`). */
export const LANE_GATE_EXITS: readonly RegionExit[] = LANE_GATES.map((g) => ({
  id: `lane-${g.id}`,
  rect: { x: g.x + (g.side > 0 ? 0.5 : -2.5), z: g.z - 1.5, w: 2, h: 3 },
  to: 'lane',
  sub: `visit:${g.id}`,
  arrive: { x: 0, z: 4 },
  facing: Math.PI,
  kind: 'gate',
}));

export const LANE_POIS: readonly PoiDef[] = [
  { id: 'lane-top', x: 0, z: -54, tier: 'minor' },
  ...LANE_GATES.map((g) => ({
    id: `gate-${g.id}`,
    x: g.x - g.side * 2,
    z: g.z,
    tier: 'minor' as const,
  })),
  // The lane's two meeting places: the green with its bench, and the old milestone.
  { id: 'lane-green', x: 0, z: -26, tier: 'major' },
  { id: 'milestone', x: 0, z: 30, tier: 'major' },
];

export const LANE_SPEC: RegionSpec = {
  id: 'lane',
  size: { w: 24, h: 120 },
  seed: 0x1a_e0,
  path: [
    { x: 0, z: -58 },
    { x: 0, z: 58 },
  ],
  loop: false,
  pois: LANE_POIS,
  // The lane between its hedges, and a wider verge at each gate.
  open: [
    { x: 0, z: 0, w: 9, h: 120 },
    ...LANE_GATES.map((g) => ({ x: g.x - g.side * 1.5, z: g.z, w: 5, h: 4 })),
  ],
  treeKeep: 0.85,
  micro: [
    { x: -3.6, z: -30 },
    { x: 3.6, z: -8 },
    { x: -3.6, z: 18 },
    { x: 3.6, z: 40 },
  ],
};
