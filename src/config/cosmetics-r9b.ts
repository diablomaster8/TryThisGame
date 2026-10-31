/**
 * Lane B round 9, helper b: the secret levels' keepsakes, plain wearable data drawn by both
 * renderers like the other Hollow hats (`cosmetics-hollow.ts`). The Pillow Crown is the Pillow
 * Trio's prize (R0183); the sun bonnet is the Cow Queen's (R0189). Looks are art suggestions.
 */
import type { Cosmetic } from './cosmetics';
import { SECRETS_R9B_TEXT } from './strings-hollow-r9-b';

const T = SECRETS_R9B_TEXT.wearables;

export const PILLOW_CROWN = 'pillow-crown';
export const MOO_BONNET = 'moo-bonnet';

export const SECRETS_R9B_COSMETICS: readonly Cosmetic[] = [
  {
    id: PILLOW_CROWN,
    label: T[PILLOW_CROWN] ?? PILLOW_CROWN,
    slot: 'hat',
    rarity: 'prize',
    source: 'hollow',
    // A plump cushion with a little gold crown sat on it.
    px: [
      ['ellipse', 0, 0, 8, 3, 'cream'],
      ['rect', -7, 1, 14, 1, 'berry'],
      ['tri', -5, -2, -3, -7, -1, -2, 'sunYellow'],
      ['tri', -2, -2, 0, -8, 2, -2, 'sunYellow'],
      ['tri', 1, -2, 3, -7, 5, -2, 'sunYellow'],
      ['disc', 0, -7, 1, 'berry'],
    ],
    mesh: [
      ['sphere', 'cream', [0, 0.05, 0], [0.82, 0.24, 0.72]],
      ['torus', 'berry', [0, 0.02, 0], [0.78, 0.78, 0.4], [Math.PI / 2, 0, 0]],
      ['cyl', 'sunYellow', [0, 0.32, 0], [0.38, 0.22, 0.38]],
      ['cone', 'sunYellow', [-0.22, 0.52, 0], [0.09, 0.2, 0.09]],
      ['cone', 'sunYellow', [0.22, 0.52, 0], [0.09, 0.2, 0.09]],
      ['cone', 'sunYellow', [0, 0.56, 0.2], [0.09, 0.22, 0.09]],
      ['sphere', 'berry', [0, 0.38, 0.36], 0.07],
    ],
  },
  {
    id: MOO_BONNET,
    label: T[MOO_BONNET] ?? MOO_BONNET,
    slot: 'hat',
    rarity: 'prize',
    source: 'hollow',
    // A wide straw sun bonnet with a cow-print band.
    px: [
      ['ellipse', 0, 0, 10, 3, 'cream'],
      ['ellipse', 0, -3, 6, 4, 'cream'],
      ['rect', -6, -2, 12, 2, 'white'],
      ['rect', -4, -2, 2, 2, 'ink'],
      ['rect', 2, -2, 2, 2, 'ink'],
    ],
    mesh: [
      ['cyl', 'cream', [0, 0, 0], [1.0, 0.04, 1.0]],
      ['dome', 'cream', [0, 0, 0], [0.62, 0.42, 0.62]],
      ['cyl', 'white', [0, 0.08, 0], [0.64, 0.1, 0.64]],
      ['sphere', 'ink', [0.3, 0.1, 0.5], 0.09],
      ['sphere', 'ink', [-0.4, 0.1, 0.4], 0.08],
    ],
  },
];
