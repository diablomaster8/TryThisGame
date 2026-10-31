/**
 * R0118 (WORLD-51): the season the Grove wears. A campaign's staged or chapter season wins
 * (`seasonFor`) unless the debug panel forces one; otherwise, at home in the Grove, the world's own season (the real calendar,
 * or the debug panel's forced one) shows at full strength, so free play gets the same tree
 * tint, autumn wash, winter crowns, frost and pond ice the campaign already draws. Both
 * renderers' existing season paths read it: no new meshes, only their existing states.
 */
import { seasonFor } from '../config/campaign-look';
import type { SceneStage } from '../config/story';
import type { Season, World } from '../sim/types';

export interface SeasonHere {
  season: Season;
  strength: number;
  /** True when it is the world's own season, not the campaign's. */
  free: boolean;
}

export function seasonHere(
  world: Pick<World, 'season' | 'debugSeason'>,
  stage: SceneStage | null,
  campaign: string,
  chapter: number,
  location: string,
): SeasonHere | null {
  // The debug panel's forced season wins everywhere at home, for checks.
  if (world.debugSeason && location === 'grove')
    return { season: world.debugSeason, strength: 1, free: true };
  const own = seasonFor(stage, campaign, chapter);
  if (own) return { ...own, free: false };
  if (location !== 'grove') return null;
  return { season: world.season, strength: 1, free: true };
}

/** The pond freezes in a free-play winter (the campaign keeps its own ice rule). */
export function freeIce(s: SeasonHere | null): boolean {
  return !!s && s.free && s.season === 'winter';
}
