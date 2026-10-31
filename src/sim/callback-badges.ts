/**
 * R0361 (FUN-72, lane E r10): the cross-world callback badges, for adults. Each is a dry nod
 * to a habit the Multiverse's heroes grow out of: Sam stops calling Nubbins rodents (finish
 * Cap's line), Goku stops calling them fish (finish DB20), and Hank's Ant-Lifter is Gerald
 * (finish UL03 and name a Grove Nubbin Gerald). Only with Mature content at 18+. The badges
 * are read from the Multiverse's side save and the Grove's names, never stored: the Grove
 * is not written. Pure: no storage here (the profile reads the side save and passes it in).
 */
import type { MultiverseSave } from './side-saves';
import type { World } from './types';

export type CallbackBadgeId = 'notRodent' | 'notFish' | 'gerald';

export const CALLBACK_BADGES: readonly CallbackBadgeId[] = ['notRodent', 'notFish', 'gerald'];

const finished = (mv: MultiverseSave, line: string, quest: string): boolean =>
  mv.lines[line]?.quests[quest]?.stage === 'finished';

/** Whether the set shows at all: an adult save with the Multiverse allowed. */
export function callbackBadgesShown(world: Pick<World, 'settings' | 'edu'>): boolean {
  return !world.edu && world.settings.matureContent === 'adult';
}

/** The callback badges earned, in list order; empty when the set is not shown. */
export function callbackBadges(
  mv: MultiverseSave | null,
  world: Pick<World, 'settings' | 'edu' | 'nubbins'>,
): CallbackBadgeId[] {
  if (!mv || !callbackBadgesShown(world)) return [];
  const got: CallbackBadgeId[] = [];
  if (mv.lines.CA?.done === true) got.push('notRodent');
  if (finished(mv, 'DB', 'mv-db20')) got.push('notFish');
  if (
    finished(mv, 'UL', 'mv-ul03') &&
    world.nubbins.some((n) => n.name.trim().toLowerCase() === 'gerald')
  )
    got.push('gerald');
  return got;
}
