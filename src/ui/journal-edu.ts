import type { Game } from '../game';
import { LANG_TEXT } from '../config/strings';
import { eduContent, textBandOf } from '../sim/story-scenes';

/**
 * Lane C r13 (R0610): the journal's band text and wait wording, split out of journal.ts so each
 * journal file stays under 400 lines.
 */

/**
 * The band's journal text in a Learning Grove save on the Learning story language (CV2):
 * the chapter's title, goal and hint, and each quest's title and step goals.
 */
export function eduJournal(g: Game) {
  const band = textBandOf(g.world);
  const m = eduContent();
  if (band === 'main' || !m) return null;
  return {
    chapter: (n: number) => m.eduChapterText(band, n),
    goal: (quest: string, step: string) => m.eduGoal(band, quest, step),
    title: (quest: string) => m.eduQuestTitle(band, quest),
  };
}

/** The moment a timed check names, in words, from the same words the sim reads. */
export function waitMoment(check: string): string {
  const t = check.split(':');
  const has = (...w: string[]) => t.some((x) => w.includes(x));
  const key = has('midnight', 'one-oclock', 'small-hours')
    ? 'midnight'
    : has('frost', 'later')
      ? 'late'
      : has('dawn', 'morning', 'first-light', 'sunrise')
        ? 'dawn'
        : has('dusk', 'evening', 'night', 'sunset') || t[0] === 'night'
          ? 'dusk'
          : 'short';
  return LANG_TEXT.waitMoments[key] ?? '';
}
