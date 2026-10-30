import { AWAY_STORIES_TEXT } from '../config/strings-camp';
import { activeQuests } from '../sim/quest-offers';
import { activeLines, sharesStory } from '../sim/story-book';
import { storylines } from '../sim/story-scenes';
import type { World } from '../sim/types';

/**
 * Lane C round 8 (R0632): the away screen's Stories block. Catch-up never plays a scene, never
 * offers and never accepts, so this only says where each story stands: what waits for the Keeper,
 * and which roads are as they were left. Pure over the world (no DOM), so it is tested in sim.
 */
export function awayStories(world: World): string[] {
  const c = world.campaign;
  if (!c || c.storyline || !sharesStory(world)) return [];
  const out: string[] = [];
  if (c.queue.length > 0) out.push(AWAY_STORIES_TEXT.spineWaits);
  const titles = new Map(storylines().map((s) => [s.id, s.title]));
  for (const line of activeLines(world)) {
    const id = line.storyline ?? '';
    const title = titles.get(id) ?? id;
    out.push(
      line.queue.length > 0
        ? AWAY_STORIES_TEXT.lineWaits(title, line.chapter)
        : AWAY_STORIES_TEXT.lineOn(title, line.chapter),
    );
  }
  const n = activeQuests(world, c).length;
  if (n > 0) out.push(AWAY_STORIES_TEXT.quests(n));
  return out;
}
