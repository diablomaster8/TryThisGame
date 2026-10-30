/**
 * The Hollow's milestone wearables (R0206, DUNG-61): one hat per act boss, given the first
 * time it falls, and the "Keeper of the Hollow" cape once all five are home. They are plain
 * cosmetic data, drawn by both renderers from their `px` and `mesh` lists like any other
 * wearable (`cosmetics.ts` lists them). The looks are art suggestions only.
 */
import type { Cosmetic } from './cosmetics';
import { HOLLOW_R7_TEXT } from './strings-dungeon';

const T = HOLLOW_R7_TEXT.wearables;

/** The act bosses' hats in act order, then the cape. */
export const HOLLOW_HATS = [
  'hollow-mushroom',
  'hollow-hedge',
  'hollow-looroll',
  'hollow-noodle',
  'hollow-hearth',
] as const;
export const HOLLOW_CAPE = 'hollow-cape';

export const HOLLOW_COSMETICS: readonly Cosmetic[] = [
  {
    id: 'hollow-mushroom',
    label: T['hollow-mushroom'],
    slot: 'hat',
    rarity: 'prize',
    source: 'hollow',
    px: [
      ['ellipse', 0, -2, 8, 5, 'berry'],
      ['rect', -8, 1, 16, 2, 'cream'],
      ['disc', -4, -3, 1.5, 'white'],
      ['disc', 3, -4, 1.5, 'white'],
      ['disc', 0, 0, 1, 'white'],
    ],
    mesh: [
      ['dome', 'berry', [0, 0, 0], [0.78, 0.48, 0.78]],
      ['cyl', 'cream', [0, -0.04, 0], [0.8, 0.05, 0.8]],
      ['sphere', 'white', [-0.32, 0.28, 0.3], 0.1],
      ['sphere', 'white', [0.26, 0.36, 0.18], 0.09],
      ['sphere', 'white', [0.05, 0.42, -0.3], 0.08],
    ],
  },
  {
    id: 'hollow-hedge',
    label: T['hollow-hedge'],
    slot: 'hat',
    rarity: 'prize',
    source: 'hollow',
    px: [
      ['ellipse', 0, -2, 7, 5, 'leaf'],
      ['ellipse', -4, -4, 3, 2, 'leafDeep'],
      ['ellipse', 3, -5, 3, 2, 'leafLight'],
      ['rect', -7, 1, 14, 2, 'forest'],
    ],
    mesh: [
      ['dome', 'leaf', [0, 0, 0], [0.7, 0.55, 0.7]],
      ['sphere', 'leafDeep', [-0.3, 0.32, 0.2], 0.2],
      ['sphere', 'leafLight', [0.28, 0.38, -0.1], 0.18],
      ['cyl', 'forest', [0, -0.04, 0], [0.74, 0.06, 0.74]],
    ],
  },
  {
    id: 'hollow-looroll',
    label: T['hollow-looroll'],
    slot: 'hat',
    rarity: 'prize',
    source: 'hollow',
    px: [
      ['rect', -7, -2, 14, 4, 'white'],
      ['line', -7, 0, 7, -2, 'pale'],
      ['rect', 5, 2, 2, 5, 'white'],
    ],
    mesh: [
      ['torus', 'white', [0, -0.12, 0], [0.72, 0.72, 0.2]],
      ['torus', 'pale', [0, 0.02, 0], [0.66, 0.66, 0.16]],
      ['box', 'white', [0.5, -0.4, -0.3], [0.14, 0.4, 0.03], [0, 0, 0.3]],
    ],
  },
  {
    id: 'hollow-noodle',
    label: T['hollow-noodle'],
    slot: 'hat',
    rarity: 'prize',
    source: 'hollow',
    px: [
      ['ellipse', 0, -2, 7, 4, 'sunLight'],
      ['line', -5, -3, -2, 1, 'sandLight'],
      ['line', 0, -5, 2, 1, 'sandLight'],
      ['line', 4, -4, 5, 1, 'sandLight'],
      ['disc', 0, -7, 2, 'ember'],
    ],
    mesh: [
      ['dome', 'sunLight', [0, 0, 0], [0.66, 0.48, 0.66]],
      ['torus', 'sandLight', [0, 0.1, 0], [0.62, 0.62, 0.08]],
      ['sphere', 'ember', [0, 0.56, 0], 0.16],
    ],
  },
  {
    id: 'hollow-hearth',
    label: T['hollow-hearth'],
    slot: 'hat',
    rarity: 'prize',
    source: 'hollow',
    px: [
      ['rect', -6, -2, 12, 4, 'orange'],
      ['tri', -6, -2, -3, -7, 0, -2, 'ember'],
      ['tri', -2, -2, 1, -8, 4, -2, 'sunYellow'],
      ['tri', 2, -2, 5, -6, 6, -2, 'ember'],
    ],
    mesh: [
      ['cyl', 'orange', [0, 0, 0], [0.56, 0.2, 0.56]],
      ['cone', 'ember', [-0.3, 0.3, 0], [0.12, 0.3, 0.12]],
      ['cone', 'sunYellow', [0, 0.36, 0.1], [0.14, 0.4, 0.14]],
      ['cone', 'ember', [0.3, 0.3, -0.05], [0.12, 0.3, 0.12]],
    ],
  },
  {
    id: HOLLOW_CAPE,
    label: T[HOLLOW_CAPE],
    slot: 'back',
    rarity: 'prize',
    source: 'hollow',
    px: [
      ['rect', -5, -5, 10, 9, 'violetDeep'],
      ['rect', -5, -5, 10, 1, 'sunYellow'],
    ],
    pxBack: [
      ['rect', -7, -6, 14, 12, 'violetDeep'],
      ['rect', -7, -6, 14, 2, 'sunYellow'],
      ['disc', 0, 1, 2, 'sunYellow'],
    ],
    mesh: [
      ['box', 'violetDeep', [0, 0.05, -0.08], [0.95, 0.95, 0.05]],
      ['box', 'sunYellow', [0, 0.52, -0.08], [0.97, 0.08, 0.06]],
    ],
  },
];
