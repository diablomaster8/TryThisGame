/**
 * Lane D round 9: world teaching hints (R0127), the Grove's secret (R0111), the biome sound
 * beds (R0139) and the seasons' Grove dressing (R0118). Imported directly where used.
 */
import type { RegionId } from './regions';

/** R0127 (WORLD-61): the mechanics a hint teaches. */
export type HintId = 'shake' | 'wade' | 'swim' | 'hop' | 'glide' | 'ride' | 'cave' | 'clue';

export interface HintSpot {
  id: HintId;
  region: RegionId;
  /** Region-local spot: the safe, obvious place the mechanic is first met. */
  x: number;
  z: number;
  /** The icon shown with the line (also not colour-only). */
  icon: string;
}

/**
 * R0127: each mechanic's teaching spot in the Grove. A hint shows once, the first time the
 * Keeper walks within `radius` of its spot while the mechanic applies, and is remembered in
 * `world.hintsSeen`; two hints never come within `gapMs` of each other (the later one waits
 * for the next pass). Spots keep clear of the start, the egg spots and the landmarks' cards.
 */
export const WORLD_HINTS = {
  radius: 2.2,
  gapMs: 20_000,
  spots: [
    { id: 'shake', region: 'grove', x: 6, z: -10.4, icon: '🍎' },
    { id: 'wade', region: 'grove', x: 9.8, z: 16.4, icon: '🌊' },
    { id: 'swim', region: 'grove', x: 12.6, z: 7, icon: '🏊' },
    { id: 'hop', region: 'grove', x: 13, z: -6.3, icon: '🪨' },
    { id: 'glide', region: 'grove', x: 16, z: -16, icon: '🪶' },
    { id: 'ride', region: 'grove', x: -26, z: 14, icon: '🐾' },
    { id: 'cave', region: 'grove', x: -10.6, z: -11.8, icon: '🕳️' },
    // R0111: the clue to the Grove's secret, within 20 u of the nook.
    { id: 'clue', region: 'grove', x: 9.2, z: -12.6, icon: '🗝️' },
  ] as const satisfies readonly HintSpot[],
} as const;

/**
 * R0111 (WORLD-28): one secret per region, opened by that region's Old Key (`<region>:key:1`
 * in `world.collected`). Only the Grove's is placed: a mossy nook at the foot of the falls,
 * where a sleeping stone Nubbin winks once and leaves a statue of its own. The others wait
 * for their maps. `glintRadius`: the nook twinkles while the key is held and the Keeper is
 * this close (the keepsakes' own sparkle, no new draw).
 */
export const SECRETS = {
  radius: 1.5,
  glintRadius: 6,
  spots: {
    grove: { x: 13.2, z: -9.2, reward: { decor: 'statue' as const, shells: 25 } },
  } as Partial<
    Record<RegionId, { x: number; z: number; reward: { decor: 'statue'; shells: number } }>
  >,
} as const;
