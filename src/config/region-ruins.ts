/**
 * WORLD-37 (R11 lane D, d7): the ruins, the Long Night's history told in stone. A 72 × 72
 * ruined terrace east of the Wood, through an old archway from the Wood's mill. From the arch a
 * frost-cracked lantern avenue runs east across the lower court, past the fallen archive and a
 * ring of stones, to a grand stair up to the upper terrace: a broken colonnade, the broken
 * spire, and the temple's sealed door.
 *
 * The ruins change with the campaign, read and never written (`ruinsState`): the door stays
 * sealed under ice until chapter 9 is behind the Keeper, and the avenue's lanterns are lit
 * again once an ending has played. Kept `main` (never reached from the Learning Grove,
 * `exitLocked`). Region-local, centred, x east and z south.
 */
import type { PoiDef } from './regions';
import type { RegionSpec } from './region-layout';
import type { CampaignState } from '../sim/types';

export const RUINS_TERRACES = [
  { z0: -36, z1: -6, y: 1.8 },
  { z0: -2, z1: 36, y: 0 },
] as const;

export const RUINS_POIS: readonly PoiDef[] = [
  { id: 'ruins-gate', x: -32, z: 0, tier: 'minor' },
  { id: 'avenue', x: -14, z: 4, tier: 'major' },
  { id: 'stair', x: 0, z: -4, tier: 'minor' },
  { id: 'temple', x: 0, z: -25, tier: 'major' },
  { id: 'spire', x: 22, z: -22, tier: 'minor' },
  { id: 'archive', x: 20, z: 20, tier: 'major' },
  { id: 'stones', x: -18, z: 24, tier: 'minor' },
];

/** The lanterns along the avenue, two rows. */
export const RUINS_LANTERNS: readonly { x: number; z: number }[] = [-26, -20, -14, -8].flatMap(
  (x) => [
    { x, z: 1.2 },
    { x, z: 7.6 },
  ],
);

/** The colonnade on the upper terrace's front: some whole, some broken (`broken`). */
export const RUINS_COLUMNS: readonly { x: number; z: number; broken: boolean }[] = [
  -20, -14, -8, 8, 14, 20,
].map((x, i) => ({ x, z: -12, broken: i % 3 === 1 }));

/** The temple's front wall and its door (at the wall's middle). */
export const RUINS_TEMPLE = { x: 0, z: -32, w: 22, h: 3 };
export const RUINS_DOOR = { x: 0, z: -30.3 };
export const RUINS_SPIRE = { x: 22, z: -24, r: 2.2 };

export const RUINS_SPEC: RegionSpec = {
  id: 'ruins',
  size: { w: 72, h: 72 },
  seed: 0x0_1d_c01d,
  path: [
    { x: -36, z: 0 },
    { x: -24, z: 4.4 },
    { x: -4, z: 4.4 },
    { x: 0, z: 2 },
    { x: 0, z: -10 },
    { x: 0, z: -27 },
  ],
  loop: false,
  pois: RUINS_POIS,
  spurs: [
    [
      { x: 0, z: -18 },
      { x: 20, z: -18 },
    ],
    [
      { x: 0, z: 8 },
      { x: 18, z: 18 },
    ],
  ],
  open: [
    { x: 2, z: 16, w: 52, h: 30 },
    { x: 0, z: -20, w: 50, h: 22 },
  ],
  treeKeep: 0.55,
  terraces: RUINS_TERRACES,
  solids: [
    { x: RUINS_TEMPLE.x, z: RUINS_TEMPLE.z, r: 6, w: RUINS_TEMPLE.w, h: RUINS_TEMPLE.h },
    RUINS_SPIRE,
    ...RUINS_COLUMNS.map((c) => ({ x: c.x, z: c.z, r: 0.55 })),
    ...RUINS_LANTERNS.map((l) => ({ x: l.x, z: l.z, r: 0.3 })),
    // The archive's fallen walls.
    { x: 20, z: 14, r: 5, w: 10, h: 1 },
    { x: 15, z: 19, r: 4, w: 1, h: 8 },
    { x: 26, z: 22, r: 3, w: 1, h: 5 },
  ],
  micro: [
    { x: -28, z: 14 },
    { x: -10, z: 16 },
    { x: 6, z: 28 },
    { x: 28, z: 6 },
    { x: -24, z: -16 },
    { x: -10, z: -26 },
    { x: 12, z: -28 },
    { x: 26, z: -10 },
    { x: -16, z: 30 },
    { x: 10, z: 10 },
  ],
};

export type RuinsState = 'sealed' | 'thawed' | 'relit';

/**
 * The ruins' dressing from the campaign, read only: sealed under ice through chapter 9, the
 * door thawed after it, the lanterns relit once an ending has played (chapter 13).
 */
export function ruinsState(campaign: Readonly<CampaignState> | null | undefined): RuinsState {
  if (!campaign) return 'sealed';
  if (campaign.ending !== null || campaign.chapter >= 13) return 'relit';
  return campaign.chapter > 9 ? 'thawed' : 'sealed';
}
