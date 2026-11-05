/**
 * Lane C round 12 (R0629, CAMP-37): the kid open flow's one extra command. A child's offers are
 * picture invitations that start on a tap (the card's side is `ui/offer-card.ts`), the cap is
 * `QUESTS.childCap`, and a reader (7 to 10) gets "Help me" on a stuck step. A sprout has no Skip.
 */
import { kidFlow, questBook } from './quest-offers';
import { sideAct } from './side-stories';
import type { SimEvent, World } from './types';

/**
 * R0629: a reader's (7 to 10) "Help me" on a stuck step of quest `id`: the step is taken as if
 * skipped, with Moss's line. Never for a sprout (who has no Skip) and never off the Open flow.
 */
export function helpQuest(world: World, id: string, events: SimEvent[]): boolean {
  const c = world.campaign;
  if (!c || !kidFlow(world) || world.edu?.band !== 'reader') return false;
  if (world.questBook?.entries[id]?.state !== 'active') return false;
  const st = c.side[id] ?? c.fun[id];
  if (!st || st.status !== 'open') return false;
  const book = questBook(world);
  const sk = (book.skippedSteps ??= {});
  sk[id] = (sk[id] ?? 0) + 1;
  sideAct(world, c, id);
  events.push({ kind: 'questHelped', quest: id });
  return true;
}
