import type { RegionId } from './regions';

/**
 * R0091 (WORLD-27): one-time collectibles, a set per region: 12 pressed petals of the region's
 * own flower, 3 lost postcards and 1 old key (for the region's secret, WORLD-28). Each is
 * picked up once by walking over it and never comes back; finishing a set gives a one-time
 * cosmetic. Only the Grove is drawn today, so only its set has places; the other regions'
 * sets are counted but placed when their maps are built.
 */
export type CollectibleKind = 'petal' | 'postcard' | 'key';

export interface Collectible {
  /** `<region>:<kind>:<n>`, the key in `world.collected`. */
  id: string;
  region: RegionId;
  kind: CollectibleKind;
  x: number;
  z: number;
}

export const COLLECT = {
  /** World units from the Keeper's middle that pick one up. */
  pickRadius: 1.1,
  /** A collectible sparkles while the Keeper is this close (findable at the far zoom). */
  sparkleRadius: 6,
  /** Milliseconds between one collectible's sparkles. */
  sparkleEveryMs: 700,
  /** How many of each kind a region holds. */
  perRegion: { petal: 12, postcard: 3, key: 1 },
  /** What a finished set gives, once: a Grove decoration for petals, a hat for postcards. */
  rewards: { petal: { decor: 'flowerbed' }, postcard: { hat: 'flower' } },
} as const;

/** The Grove's set, in open ground away from the buildings, the pond and the stream. */
const GROVE_SPOTS: Record<CollectibleKind, ReadonlyArray<readonly [number, number]>> = {
  petal: [
    [-30, 18],
    [-36, 6],
    [-22, -24],
    [-34, -38],
    [-4, -36],
    [22, -30],
    [36, -18],
    [40, 4],
    [30, 26],
    [14, 40],
    [-14, 32],
    [-40, 38],
  ],
  postcard: [
    [-26, -6],
    [34, -40],
    [4, 30],
  ],
  key: [[-42, -20]],
};

function placed(region: RegionId, spots: typeof GROVE_SPOTS): Collectible[] {
  const out: Collectible[] = [];
  for (const kind of ['petal', 'postcard', 'key'] as const)
    spots[kind].forEach(([x, z], i) =>
      out.push({ id: `${region}:${kind}:${i + 1}`, region, kind, x, z }),
    );
  return out;
}

/** Every placed collectible (the Grove's, until other regions are drawn). */
export const COLLECTIBLES: readonly Collectible[] = placed('grove', GROVE_SPOTS);
