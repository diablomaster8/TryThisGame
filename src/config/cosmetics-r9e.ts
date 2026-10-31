/**
 * R0424 (LOOK-54, lane E r9): the remembrance flower hat. When a Nubbin departs, the friends
 * it was bonded with (`sim/remembrance.ts`) may wear the hill's memorial flower: blush petals
 * round a yellow eye, tucked over one ear. Plain cosmetic data, drawn by both renderers from
 * `px` and `mesh` like any other wearable; never sold.
 */
import type { Cosmetic } from './cosmetics';
import { REMEMBRANCE_TEXT } from './strings-look-r9e';

export const REMEMBRANCE_HAT = 'remembrance';

const PETALS = [
  [0, -3],
  [3, 0],
  [0, 3],
  [-3, 0],
] as const;

export const LANE_E_R9_COSMETICS: readonly Cosmetic[] = [
  {
    id: REMEMBRANCE_HAT,
    label: REMEMBRANCE_TEXT.label,
    slot: 'hat',
    rarity: 'prize',
    source: 'keepsake',
    px: [
      ['line', 4, 1, 1, -2, 'forest'],
      ['ellipse', 1, 0, 2, 1, 'leaf'],
      ...PETALS.map(([dx, dy]) => ['disc', 5 + dx * 0.8, -4 + dy * 0.8, 1.6, 'blush'] as const),
      ['disc', 5, -4, 1.4, 'sunYellow'],
    ],
    mesh: [
      ['cyl', 'forest', [0.2, 0.05, 0.1], [0.03, 0.2, 0.03], [0, 0, -0.5]],
      ['sphere', 'leaf', [0.12, 0.04, 0.16], [0.14, 0.04, 0.08]],
      ...PETALS.map(
        ([dx, dy]) =>
          ['sphere', 'blush', [0.32 + dx * 0.035, 0.24 - dy * 0.035, 0.12], 0.08] as const,
      ),
      ['sphere', 'sunYellow', [0.32, 0.24, 0.16], 0.065],
    ],
  },
];
