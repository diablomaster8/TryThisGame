/**
 * R0569 (SOUL-52): every Nubbin has a favourite spot in the Grove: the bridge, the well, the
 * old tree, the west hill top, the pond shore or one particular fruit tree. It is rolled
 * from its seed (no save field); a curious one picks a new one every sim day. Some of its
 * plain wanders head there (a lazy one hardly leaves it), sitting there cheers it a little,
 * and once the Keeper has seen it sat there the sheet names the spot (`spotSeen`).
 */
import { FAV_SPOT } from '../config/tuning-more/soul-quirks-gait';
import { GROVE, LANDMARKS } from '../config/tuning';
import { addHappiness } from './needs';
import { hashSeed } from './rng';
import { roll } from './traits';
import type { Nubbin, SimEvent, Vec2, World } from './types';

export type SpotId = 'bridge' | 'well' | 'oldTree' | 'westHill' | 'pondShore' | `tree${number}`;

const landmark = (id: string): Vec2 => {
  const l = LANDMARKS.find((x) => x.id === id)!;
  return { x: l.x, z: l.z };
};

const SPOTS: ReadonlyArray<{ id: SpotId; at: () => Vec2 }> = [
  { id: 'bridge', at: () => landmark('bridge') },
  { id: 'well', at: () => landmark('well') },
  { id: 'oldTree', at: () => landmark('oldTree') },
  { id: 'westHill', at: () => landmark('westHill') },
  { id: 'pondShore', at: () => ({ x: GROVE.pond.x, z: GROVE.pond.z + GROVE.pond.r + 1.2 }) },
  ...[0, 1, 2].map((i) => ({
    id: `tree${i}` as SpotId,
    at: () => {
      const t = GROVE.trees[i]!;
      return { x: t.x + 1.2, z: t.z + 1 };
    },
  })),
];

/** Its favourite spot: the id and where it is. */
export function favSpot(
  n: Pick<Nubbin, 'seed' | 'personality'>,
  world: World,
): { id: SpotId; at: Vec2 } {
  const day = n.personality === 'curious' ? Math.floor(world.timeMs / FAV_SPOT.curiousDayMs) : 0;
  const s = SPOTS[hashSeed(`spot:${n.seed}:${day}`) % SPOTS.length]!;
  return { id: s.id, at: s.at() };
}

/** Where a plain wander goes: the favourite spot now and then (a lazy one mostly), or null. */
export function spotWander(n: Nubbin, world: World, now: number): Vec2 | null {
  if (world.location !== 'grove' || n.stage === 'egg' || n.stage === 'cocoon') return null;
  // With the Keeper close by it stays about, to be near them.
  const k = world.keeper.pos;
  if (Math.hypot(k.x - n.pos.x, k.z - n.pos.z) < FAV_SPOT.keeperStay) return null;
  // And with company close by, it mostly stays with them.
  const company = world.nubbins.some(
    (o) =>
      o !== n &&
      o.stage !== 'egg' &&
      Math.hypot(o.pos.x - n.pos.x, o.pos.z - n.pos.z) < FAV_SPOT.company,
  );
  if (company && roll(n, 'favSpotCompany', now) < FAV_SPOT.companyStay) return null;
  const share = n.personality === 'lazy' ? FAV_SPOT.lazyShare : FAV_SPOT.share;
  if (roll(n, 'favSpot', now) >= share) return null;
  return favSpot(n, world).at;
}

/** Once a sim second: sitting at its spot cheers it; the Keeper near sees whose spot it is. */
export function stepFavSpots(world: World, dtMs: number, events: SimEvent[]): void {
  if (world.location !== 'grove') return;
  const now = world.timeMs;
  if (Math.floor(now / 1000) === Math.floor((now - dtMs) / 1000)) return;
  const k = world.keeper.pos;
  for (const n of world.nubbins) {
    if (n.behavior.state !== 'sit' || n.stage === 'egg') continue;
    const s = favSpot(n, world);
    if (Math.hypot(n.pos.x - s.at.x, n.pos.z - s.at.z) > FAV_SPOT.radius) continue;
    addHappiness(n, FAV_SPOT.happyPerMinute / 60);
    if (!n.spotSeen && Math.hypot(k.x - n.pos.x, k.z - n.pos.z) < FAV_SPOT.seenRadius) {
      n.spotSeen = true;
      events.push({ kind: 'spotFound', nubbinId: n.id, spot: s.id });
    }
  }
}
