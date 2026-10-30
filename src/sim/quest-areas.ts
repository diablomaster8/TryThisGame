import { REGIONS, type RegionId } from '../config/regions';
import { WORLD_QUESTS } from '../config/tuning-world';
import type { Quest } from '../content/types';
import { areaOf } from '../content/where-map';
import { regionOf } from './regions';
import { GROVE_SIDE_STORIES } from './story-scenes';
import type { World } from './types';

/**
 * R0101 (WORLD-43): quests belong to places. Each quest's area comes from the WORLD-05
 * where-map (`content/where-map.ts`); a quest is offered only in its own region. Until a region
 * can be walked to (`WORLD_QUESTS.ownOffers`), its quests are offered from the Grove, the hub,
 * so nothing the game already offers goes missing; as regions open the gate tightens. Quests whose
 * area is a story area (the story worlds' doors, or `anywhere`) are offered anywhere, as now.
 * Read-only over the world and the registry.
 */
export function homeRegion(
  quest: Quest,
  built: (r: RegionId) => boolean = (r) => WORLD_QUESTS.ownOffers.includes(r),
): RegionId | null {
  const a = areaOf(quest);
  if (!a || !(a.region in REGIONS)) return null;
  const r = a.region as RegionId;
  return built(r) ? r : 'grove';
}

/** Whether `quest` may be offered in `region`. */
export function offeredIn(
  quest: Quest,
  region: RegionId,
  built?: (r: RegionId) => boolean,
): boolean {
  const home = homeRegion(quest, built);
  return home === null || home === region;
}

/** Whether `quest` may be offered where the Keeper is now. */
export function offeredHere(world: World, quest: Quest): boolean {
  return offeredIn(quest, regionOf(world.location));
}

/** What a region offers: quests not yet started, under way, and finished (by quest id). */
export function questsInArea(
  world: World,
  region: RegionId,
): { available: string[]; active: string[]; done: string[] } {
  const c = world.campaign;
  const out = { available: [] as string[], active: [] as string[], done: [] as string[] };
  for (const q of GROVE_SIDE_STORIES) {
    if (homeRegion(q) !== region) continue;
    const st = c?.fun[q.id] ?? c?.side[q.id];
    if (!st) out.available.push(q.id);
    else if (st.status === 'open') out.active.push(q.id);
    else out.done.push(q.id);
  }
  return out;
}
