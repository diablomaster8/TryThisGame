/**
 * R0741 (KIDS-73): the Learning Grove's three keepsakes, worn as hats. Earning one (50 stars in
 * its domain, `sim/edu-keepsakes.ts`) puts it in the hat box and, if the first Nubbin's hat
 * slot is empty, on its head. They are plain cosmetic data drawn by both renderers from `px`
 * and `mesh` like any other wearable, built only from shapes the renderers already have; the
 * hat id is the keepsake's id. Never sold.
 */
import type { Cosmetic } from './cosmetics';
import { BUDDY_HAT_LABELS } from './strings-buddy';

export const EDU_HAT_IDS: readonly string[] = ['edu-abacus', 'edu-paintbrush', 'edu-book'];

export const EDU_COSMETICS: readonly Cosmetic[] = [
  {
    // A small wooden frame on the crown: two wires, four beads.
    id: 'edu-abacus',
    label: BUDDY_HAT_LABELS['edu-abacus'],
    slot: 'hat',
    rarity: 'prize',
    source: 'keepsake',
    px: [
      ['rect', -6, -7, 12, 8, 'bark'],
      ['rect', -5, -6, 10, 6, 'cream'],
      ['rect', -5, -4, 10, 1, 'wood'],
      ['rect', -5, -2, 10, 1, 'wood'],
      ['disc', -3, -5, 1.1, 'ember'],
      ['disc', -1, -5, 1.1, 'ember'],
      ['disc', 2, -3, 1.1, 'water'],
      ['disc', 4, -3, 1.1, 'water'],
      ['disc', 0, -1, 1.1, 'leaf'],
    ],
    mesh: [
      ['box', 'bark', [0, 0.14, 0], [0.62, 0.42, 0.1]],
      ['box', 'cream', [0, 0.14, 0.04], [0.52, 0.32, 0.06]],
      ['cyl', 'wood', [0, 0.2, 0.08], [0.012, 0.5, 0.012], [0, 0, Math.PI / 2]],
      ['cyl', 'wood', [0, 0.08, 0.08], [0.012, 0.5, 0.012], [0, 0, Math.PI / 2]],
      ['sphere', 'ember', [-0.16, 0.2, 0.1], 0.06],
      ['sphere', 'ember', [-0.05, 0.2, 0.1], 0.06],
      ['sphere', 'water', [0.1, 0.08, 0.1], 0.06],
      ['sphere', 'water', [0.21, 0.08, 0.1], 0.06],
    ],
  },
  {
    // A rose beret with a paintbrush tucked in, its tip dipped in blue.
    id: 'edu-paintbrush',
    label: BUDDY_HAT_LABELS['edu-paintbrush'],
    slot: 'hat',
    rarity: 'prize',
    source: 'keepsake',
    px: [
      ['ellipse', 0, -1, 8, 3.5, 'rose'],
      ['px', 0, -5, 'roseDeep'],
      ['line', 2, -3, 8, -10, 'wood'],
      ['line', 3, -3, 9, -10, 'bark'],
      ['disc', 8.5, -10.5, 1.6, 'water'],
    ],
    mesh: [
      ['dome', 'rose', [0, -0.04, 0], [0.76, 0.3, 0.76]],
      ['sphere', 'roseDeep', [0, 0.26, 0], 0.05],
      ['cyl', 'wood', [0.3, 0.3, 0.1], [0.035, 0.7, 0.035], [0, 0, -0.5]],
      ['sphere', 'water', [0.5, 0.64, 0.1], 0.07],
    ],
  },
  {
    // A tiny open book, blue cover, cream pages, resting on the crown.
    id: 'edu-book',
    label: BUDDY_HAT_LABELS['edu-book'],
    slot: 'hat',
    rarity: 'prize',
    source: 'keepsake',
    px: [
      ['rect', -7, -3, 14, 4, 'water'],
      ['rect', -6, -6, 6, 4, 'cream'],
      ['rect', 1, -6, 6, 4, 'cream'],
      ['rect', -1, -6, 2, 5, 'deepWater'],
      ['line', -5, -4, -2, -4, 'greyLight'],
      ['line', 2, -4, 5, -4, 'greyLight'],
    ],
    mesh: [
      ['box', 'water', [0, 0.04, 0], [0.66, 0.1, 0.46]],
      ['box', 'cream', [-0.15, 0.13, 0], [0.28, 0.07, 0.38], [0, 0, 0.18]],
      ['box', 'cream', [0.15, 0.13, 0], [0.28, 0.07, 0.38], [0, 0, -0.18]],
    ],
  },
];
