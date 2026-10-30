import { funQuestBlocked } from './audience';
import type { Season, World } from './types';

/**
 * Festival gags (R0359, FUN-70): each season's vignette (`content/festival-gags.ts`) plays once
 * per save, the first time the Keeper is in the Grove in live play during that season. The
 * UI asks `festivalGagDue` when nothing else is showing and plays it; the sim records it only
 * when the `festivalGagSeen` command comes back, so a catch-up can never spend one unseen.
 * Never in a Learning Grove, which keeps its own festival toasts.
 */
export function festivalGagDue(world: World): Season | null {
  if (world.edu || world.location !== 'grove') return null;
  // Not before the first hatch: the opening minutes have enough to say.
  if (!world.nubbins.some((n) => n.stage !== 'egg')) return null;
  // Chapters 9 to 11 belong to the campaign, as for the fun quests.
  if (world.campaign && funQuestBlocked(world.campaign.chapter)) return null;
  return world.festivalGags?.includes(world.season) ? null : world.season;
}

export function festivalGagSeen(world: World, season: Season): void {
  const seen = (world.festivalGags ??= []);
  if (!seen.includes(season)) seen.push(season);
}
