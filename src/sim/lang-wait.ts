/**
 * Lane E r9 (R0737 KIDS-69): when Ori or Hana comes back. Between two language quests the
 * next one waits for a short spell and a Grove morning (`langQuestOpens`); the postcard shows
 * that wait as a picture of the time, so this says which picture: "morning" when the Grove is
 * past its morning, "soon" when the morning is here (or a grown-up skipped the wait). Null
 * when nothing waits: the course is not started, is finished, or a visit is under way.
 */
import { isMorning } from './side-rule-kit';
import type { LangCourseId, World } from './types';

export type LangWait = 'morning' | 'soon';

/** `quests` is the course's quest codes in order (e.g. LH1, LH2, …). */
export function langNextVisit(
  world: World,
  course: LangCourseId,
  quests: readonly string[],
): LangWait | null {
  const fun = world.campaign?.fun;
  if (!world.edu?.courses[course] || !fun) return null;
  const i = quests.findIndex((q) => fun[q.toLowerCase()]?.status !== 'done');
  // The first visit comes straight from the postcard; a finished course waits on nothing.
  if (i <= 0) return null;
  // The next part is already open: the visit is under way.
  if (fun[quests[i]!.toLowerCase()] !== undefined) return null;
  const prev = fun[quests[i - 1]!.toLowerCase()]!;
  const skip = world.edu.langSkipAt;
  if (skip !== undefined && skip >= prev.sinceMs) return 'soon';
  return isMorning(world.timeMs) ? 'soon' : 'morning';
}
