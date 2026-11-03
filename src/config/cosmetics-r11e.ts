/**
 * R0400 (LOOK-32, lane E r11): the face slot. Glasses and masks sit on the eyes, so their
 * shapes are drawn around the two eyes: the pixel list gives the right eye at +4 (the
 * drawer places side and three-quarter views from it) and the left at -4; the 3D list sits
 * on the eye anchor with the eyes at x = +-0.3. Plain data, drawn by both renderers.
 */
import type { Cosmetic } from './cosmetics';
import { FACE_WEAR_LABELS } from './strings-look-r11e';

export const FACE_COSMETICS: readonly Cosmetic[] = [
  {
    id: 'sunglasses',
    label: FACE_WEAR_LABELS.sunglasses,
    slot: 'face',
    rarity: 'common',
    source: 'shop',
    px: [
      ['rect', -7, 0, 6, 4, 'ink'],
      ['rect', 1, 0, 6, 4, 'ink'],
      ['rect', -1, 1, 2, 1, 'ink'],
      ['px', -6, 1, 'lilacGrey'],
      ['px', 2, 1, 'lilacGrey'],
    ],
    mesh: [
      ['box', 'ink', [-0.3, 0, 0], [0.3, 0.2, 0.04]],
      ['box', 'ink', [0.3, 0, 0], [0.3, 0.2, 0.04]],
      ['box', 'ink', [0, 0.04, 0], [0.16, 0.04, 0.04]],
      ['box', 'lilacGrey', [-0.38, 0.05, 0.03], [0.07, 0.03, 0.02]],
      ['box', 'lilacGrey', [0.22, 0.05, 0.03], [0.07, 0.03, 0.02]],
    ],
  },
  {
    id: 'heart-glasses',
    label: FACE_WEAR_LABELS['heart-glasses'],
    slot: 'face',
    rarity: 'common',
    source: 'shop',
    px: [
      ['disc', -4, 1, 2.6, 'berry'],
      ['disc', 4, 1, 2.6, 'berry'],
      ['disc', -4, 1, 1.7, 'rose'],
      ['disc', 4, 1, 1.7, 'rose'],
      ['line', -2, 1, 2, 1, 'berry'],
      ['px', -5, 0, 'white'],
      ['px', 3, 0, 'white'],
    ],
    mesh: [
      ['torus', 'berry', [-0.3, 0, 0.02], [0.2, 0.2, 0.2]],
      ['torus', 'berry', [0.3, 0, 0.02], [0.2, 0.2, 0.2]],
      ['sphere', 'rose', [-0.3, 0, 0.02], [0.16, 0.16, 0.03]],
      ['sphere', 'rose', [0.3, 0, 0.02], [0.16, 0.16, 0.03]],
      ['box', 'berry', [0, 0.03, 0.02], [0.2, 0.03, 0.03]],
    ],
  },
  {
    id: 'whiskers',
    label: FACE_WEAR_LABELS.whiskers,
    slot: 'face',
    rarity: 'common',
    source: 'shop',
    px: [
      ['line', -9, 4, -5, 4, 'darkPlum'],
      ['line', -9, 6, -5, 5, 'darkPlum'],
      ['line', 5, 4, 9, 4, 'darkPlum'],
      ['line', 5, 5, 9, 6, 'darkPlum'],
    ],
    mesh: [
      ['box', 'darkPlum', [-0.5, -0.2, -0.02], [0.3, 0.015, 0.015], [0, 0, 0.1]],
      ['box', 'darkPlum', [-0.5, -0.27, -0.02], [0.3, 0.015, 0.015], [0, 0, -0.1]],
      ['box', 'darkPlum', [0.5, -0.2, -0.02], [0.3, 0.015, 0.015], [0, 0, -0.1]],
      ['box', 'darkPlum', [0.5, -0.27, -0.02], [0.3, 0.015, 0.015], [0, 0, 0.1]],
    ],
  },
];
